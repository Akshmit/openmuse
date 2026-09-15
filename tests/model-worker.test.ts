import assert from "node:assert/strict";
import { mkdtemp, rm } from "node:fs/promises";
import { createServer } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { test } from "node:test";
import { createApp } from "../apps/server/src/app.ts";
import { createStore } from "../apps/server/src/db.ts";
import type { ActionProposal } from "../packages/domain/src/index.ts";

test("CopilotKit model worker executes server tools and persists the confirmed outcome", async () => {
  const directory = await mkdtemp(join(tmpdir(), "openmuse-model-"));
  const db = await createStore();
  const previousBase = process.env.OPENAI_BASE_URL,
    previousKey = process.env.OPENAI_API_KEY;
  const requests: { path: string; body: string }[] = [];
  const calls: { name: string; arguments: object }[] = [
    {
      name: "set_plan",
      arguments: { steps: ["Inspect available sources", "Save a practical plan"] },
    },
    { name: "read_workspace", arguments: { section: "files" } },
    {
      name: "save_artifact",
      arguments: {
        kind: "plan",
        title: "Weekend plan",
        summary: "A walk and time to read",
        data: { steps: ["Take a walk", "Read for 30 minutes"] },
      },
    },
    { name: "finish_task", arguments: { summary: "Saved your weekend plan with two steps." } },
  ];
  const fixture = createServer(async (request, response) => {
    let body = "";
    for await (const chunk of request) body += chunk;
    const index = requests.length;
    requests.push({ path: request.url ?? "", body });
    response.writeHead(200, { "Content-Type": "text/event-stream" });
    const emit = (type: string, value: object) =>
      response.write(`data: ${JSON.stringify({ type, ...value })}\n\n`);
    const base = { id: `response-${index}`, created_at: 1000, model: "fixture" };
    emit("response.created", { response: { ...base, status: "in_progress" } });
    const call = calls[index];
    if (call) {
      const item = {
        id: `item-${index}`,
        type: "function_call",
        call_id: `call-${index}`,
        name: call.name,
        arguments: JSON.stringify(call.arguments),
      };
      emit("response.output_item.added", { output_index: 0, item: { ...item, arguments: "" } });
      emit("response.function_call_arguments.delta", {
        item_id: item.id,
        output_index: 0,
        delta: item.arguments,
      });
      emit("response.output_item.done", {
        output_index: 0,
        item: { ...item, status: "completed" },
      });
    }
    emit("response.completed", {
      response: {
        ...base,
        status: "completed",
        usage: {
          input_tokens: 10,
          output_tokens: 5,
          input_tokens_details: { cached_tokens: 0 },
          output_tokens_details: { reasoning_tokens: 0 },
        },
      },
    });
    response.end("data: [DONE]\n\n");
  });
  await new Promise<void>((resolve) => fixture.listen(0, "127.0.0.1", resolve));
  const address = fixture.address();
  assert.ok(address && typeof address !== "string");
  process.env.OPENAI_BASE_URL = `http://127.0.0.1:${address.port}/v1`;
  process.env.OPENAI_API_KEY = "local-test-fixture";
  const server = await createApp(db, {
    mode: "sample",
    port: 8787,
    host: "127.0.0.1",
    publicUrl: "http://localhost:8787",
    dataDir: directory,
    agentBackend: "model",
    model: "openai/fixture",
    googleRedirectUri: "http://localhost:8787/api/google/callback",
    allowedOrigins: [],
  });
  try {
    const task = await server.agent.createTask("owner", {
      prompt: "Make a weekend plan",
      kind: "plan",
    });
    await server.agent.worker.tick();
    const result = await server.agent.detail("owner", task.id);
    assert.equal(result.task.status, "succeeded", result.task.error ?? result.task.question);
    assert.equal(result.task.result, "Saved your weekend plan with two steps.");
    assert.ok(result.artifacts.some((a) => a.title === "Weekend plan"));
    assert.ok(
      result.events.some((event) => event.title === "Read the authorized workspace sources"),
    );
    assert.ok(requests.length >= 4 && requests.length <= 6);
    assert.ok(requests.every((request) => request.path === "/v1/responses"));
    assert.ok(requests[0].body.includes('"name":"prepare_email"'));
    assert.ok(!requests[0].body.includes('"name":"approve"'));
    requests.length = 0;
    calls.splice(0, calls.length, {
      name: "prepare_event",
      arguments: {
        title: "Sample walk",
        start: "2026-10-10T10:00:00-07:00",
        end: "2026-10-10T11:00:00-07:00",
      },
    });
    const appointment = await server.agent.createTask("owner", {
      prompt: "Prepare a sample walk on my calendar",
    });
    await server.agent.worker.tick();
    const pending = await server.agent.getTask("owner", appointment.id);
    assert.equal(pending.status, "waiting_approval", pending.error ?? pending.question);
    assert.ok(pending.actionId);
    const proposal = await db.get<ActionProposal>("owner", "actions", pending.actionId);
    assert.ok(proposal);
    await server.actions.decide("owner", proposal.id, proposal.hash, "approve");
    requests.length = 0;
    calls.splice(0, calls.length, {
      name: "finish_task",
      arguments: { summary: "The reviewed sample event is on the calendar." },
    });
    await server.agent.worker.tick();
    const finished = await server.agent.getTask("owner", appointment.id);
    assert.equal(finished.status, "succeeded", finished.error ?? finished.question);
    assert.equal(finished.actionId, null);
    assert.ok(requests[0].body.includes("approvalResult"));
    assert.equal(
      (await db.list<ActionProposal>("owner", "actions")).filter((a) => a.taskId === appointment.id)
        .length,
      1,
    );
  } finally {
    await server.agent.stop();
    await db.close();
    await new Promise<void>((resolve) => fixture.close(() => resolve()));
    if (previousBase === undefined) delete process.env.OPENAI_BASE_URL;
    else process.env.OPENAI_BASE_URL = previousBase;
    if (previousKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = previousKey;
    await rm(directory, { recursive: true, force: true });
  }
});
