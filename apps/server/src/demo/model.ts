import { randomUUID } from "node:crypto";
import {
  type ChatCompletionRequest,
  type ChatMessage,
  type FixtureResponse,
  getTextContent,
  LLMock,
} from "@copilotkit/aimock";
import { z } from "zod";

export const demoModel = "openai/openmuse-browser-demo";

const pageSchema = z.object({
  sessionId: z.string().min(1),
  url: z.url(),
  title: z.string(),
  text: z.string(),
  truncated: z.boolean(),
});

function targetUrl(prompt: string): string | undefined {
  if (/copilotkit\.ai/i.test(prompt)) return "https://copilotkit.ai";
  if (/hacker\s*news|news\.ycombinator\.com|cool stuff/i.test(prompt))
    return "https://news.ycombinator.com";
  return undefined;
}

function summarizePage(message: ChatMessage): FixtureResponse {
  let value: unknown;
  try {
    value = JSON.parse(getTextContent(message.content) ?? "");
  } catch {
    return { content: "The browser did not return readable page data. Check the browser result." };
  }
  const parsed = pageSchema.safeParse(value);
  if (!parsed.success)
    return { content: "The browser could not read that page. Check the browser result and retry." };
  const page = parsed.data;
  const lines = page.text
    .split(/\n+/)
    .map((line) => line.trim())
    .filter(Boolean);
  let excerpts: string[];
  let introduction: string;
  if (new URL(page.url).hostname === "news.ycombinator.com") {
    excerpts = lines
      .map(
        (line, index) =>
          /^\d+\.\s+(.+)$/.exec(line)?.[1] ?? (/^\d+\.$/.test(line) ? lines[index + 1] : undefined),
      )
      .filter((line): line is string => Boolean(line))
      .slice(0, 3);
    introduction = "From the current Hacker News front page:";
  } else {
    excerpts = lines
      .filter((line) => line.length >= 45 && /agent|copilotkit|ag.ui|framework/i.test(line))
      .slice(0, 3);
    introduction = "From CopilotKit’s current page:";
  }
  if (!excerpts.length) {
    excerpts = lines.filter((line) => line.length >= 30).slice(0, 3);
    introduction = "Here are excerpts from the page I just opened:";
  }
  if (!excerpts.length)
    return { content: "The page opened, but it did not expose enough readable text to summarize." };
  const bullets = excerpts.map(
    (line) => `• ${line.length > 110 ? `${line.slice(0, 110).replace(/\s+\S*$/, "")}…` : line}`,
  );
  return {
    content: `${introduction}\n\n${bullets.join("\n")}\n\nSource: ${page.url}${page.truncated ? "\nThe browser returned a shortened page extract." : ""}`,
  };
}

/** Script only the model: the app executes browse_web against its real browser worker. */
export function demoResponse(request: ChatCompletionRequest): FixtureResponse {
  const userIndex = request.messages.findLastIndex((message) => message.role === "user");
  const user = request.messages[userIndex];
  const url = targetUrl(user ? (getTextContent(user.content) ?? "") : "");
  if (!url)
    return {
      content:
        "This recording demo supports “Find cool stuff on Hacker News” and “Summarize https://copilotkit.ai”.",
    };

  // Only the latest turn can satisfy this request; older browser reads cannot suppress a new visit.
  const turn = request.messages.slice(userIndex + 1);
  const calls = new Set(
    turn.flatMap((message) =>
      (message.tool_calls ?? [])
        .filter((call) => call.function.name === "browse_web")
        .map((call) => call.id),
    ),
  );
  const result = turn.findLast(
    (message) =>
      message.role === "tool" &&
      message.tool_call_id &&
      (calls.has(message.tool_call_id) ||
        message.tool_call_id.startsWith("call_openmuse_demo_browse_")),
  );
  if (result) return summarizePage(result);
  if (!request.tools?.some((tool) => tool.function.name === "browse_web"))
    return { content: "The browse_web tool is not available. Start the API with browser support." };
  return {
    content: url.includes("ycombinator")
      ? "I’ll open Hacker News and read the front page."
      : "I’ll open CopilotKit and read the page.",
    toolCalls: [
      {
        id: `call_openmuse_demo_browse_${randomUUID()}`,
        name: "browse_web",
        arguments: JSON.stringify({ url }),
      },
    ],
  };
}

export function createDemoModel(
  options: { port?: number; latency?: number; firstByteDelay?: number } = {},
) {
  const latency = options.latency ?? 80;
  const firstByteDelay = options.firstByteDelay ?? options.latency ?? 1500;
  if (![latency, firstByteDelay].every((value) => Number.isFinite(value) && value >= 0))
    throw new Error("Demo model delays must be finite nonnegative milliseconds");
  return new LLMock({
    host: "127.0.0.1",
    port: options.port ?? 0,
    latency,
    chunkSize: 14,
    strict: true,
    logLevel: "silent",
    journalMaxEntries: 100,
  }).on({ model: "openmuse-browser-demo" }, demoResponse, {
    streamingProfile: { ttft: firstByteDelay },
  });
}
