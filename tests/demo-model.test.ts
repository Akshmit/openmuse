import assert from "node:assert/strict";
import { randomUUID } from "node:crypto";
import { test } from "node:test";
import { AbstractAgent } from "@ag-ui/client";
import type { RunAgentInput } from "@ag-ui/core";
import type { ChatCompletionRequest, ChatMessage } from "@copilotkit/aimock";
import { BuiltInAgent, defineTool } from "@copilotkit/runtime/v2";
import { z } from "zod";
import { createDemoModel, demoModel, demoResponse } from "../apps/server/src/demo/model.ts";

const browseTool = {
  type: "function" as const,
  function: { name: "browse_web", parameters: {} },
};
const request = (messages: ChatMessage[]): ChatCompletionRequest => ({
  model: "openmuse-browser-demo",
  messages,
  tools: [browseTool],
});

test("demo only summarizes browser evidence belonging to the current user turn", () => {
  const history: ChatMessage[] = [
    { role: "user", content: "Find cool stuff on Hacker News" },
    {
      role: "assistant",
      content: null,
      tool_calls: [
        { id: "first", type: "function", function: { name: "browse_web", arguments: "{}" } },
      ],
    },
    {
      role: "tool",
      tool_call_id: "first",
      content: JSON.stringify({
        sessionId: "old",
        url: "https://news.ycombinator.com",
        title: "Hacker News",
        text: "1. Old page headline",
        truncated: false,
      }),
    },
    { role: "user", content: "Now summarize https://copilotkit.ai" },
  ];
  const reply = demoResponse(request(history));
  assert.ok("toolCalls" in reply && reply.toolCalls);
  assert.equal(reply.toolCalls[0].name, "browse_web");
  assert.deepEqual(JSON.parse(reply.toolCalls[0].arguments), { url: "https://copilotkit.ai" });
});

test("demo reports missing or failed browser evidence without inventing a summary", () => {
  const reply = demoResponse(
    request([
      { role: "user", content: "Summarize copilotkit.ai" },
      {
        role: "tool",
        tool_call_id: "call_openmuse_demo_browse_failure",
        content: '{"error":"Worker unavailable"}',
      },
    ]),
  );
  assert.ok("content" in reply);
  assert.match(reply.content ?? "", /could not read/);
  assert.ok(!("toolCalls" in reply));
});

test("AI Mock drives the real BuiltInAgent SDK through two browser tool rounds", async () => {
  const previousBase = process.env.OPENAI_BASE_URL;
  const previousKey = process.env.OPENAI_API_KEY;
  const mock = createDemoModel({ latency: 0 });
  await mock.start();
  process.env.OPENAI_BASE_URL = `${mock.url}/v1`;
  process.env.OPENAI_API_KEY = "local-demo-test";
  const visited: string[] = [];
  const options = {
    model: demoModel,
    maxSteps: 3,
    maxRetries: 0,
    tools: [
      defineTool({
        name: "browse_web",
        description: "Read a page (unit-test tool implementation).",
        parameters: z.object({ url: z.url() }),
        execute: async ({ url }) => {
          visited.push(url);
          return {
            sessionId: randomUUID(),
            url,
            title: url.includes("ycombinator") ? "Hacker News" : "CopilotKit",
            text: url.includes("ycombinator")
              ? "Hacker News\n1.\t\n\tTest headline returned only by this tool\n2. Another observed headline\n3.\nA third observed headline"
              : "CopilotKit connects your application to agents using the observed test tool response.",
            truncated: false,
          };
        },
      }),
    ],
  };
  // ConversationAgent also creates a BuiltInAgent per turn and returns its raw run observable.
  class DemoAgent extends AbstractAgent {
    run(input: RunAgentInput) {
      return new BuiltInAgent(options).run(input);
    }
  }
  const agent = new DemoAgent();
  const errors: string[] = [];
  agent.subscribe({
    onRunErrorEvent: ({ event }) => {
      errors.push(event.message);
    },
  });
  try {
    agent.addMessage({ id: randomUUID(), role: "user", content: "Find cool stuff on Hacker News" });
    const first = await agent.runAgent();
    assert.deepEqual(errors, []);
    assert.match(
      first.newMessages.map((message) => ("content" in message ? message.content : "")).join(" "),
      /Test headline returned only by this tool/,
    );
    const firstSummary = first.newMessages.findLast(
      (message) => message.role === "assistant" && message.content,
    );
    assert.ok(
      firstSummary && "content" in firstSummary && typeof firstSummary.content === "string",
    );
    assert.equal(firstSummary.content.match(/• /g)?.length, 3);
    assert.ok(!firstSummary.content.includes("Source: ["));
    agent.addMessage({
      id: randomUUID(),
      role: "user",
      content: "Summarize https://copilotkit.ai",
    });
    const second = await agent.runAgent();
    assert.deepEqual(errors, []);
    assert.match(
      second.newMessages.map((message) => ("content" in message ? message.content : "")).join(" "),
      /observed test tool response/,
    );
    assert.deepEqual(visited, ["https://news.ycombinator.com", "https://copilotkit.ai"]);
    assert.equal(mock.getRequests().length, 4);
  } finally {
    if (previousBase === undefined) delete process.env.OPENAI_BASE_URL;
    else process.env.OPENAI_BASE_URL = previousBase;
    if (previousKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = previousKey;
    await mock.stop();
  }
});
