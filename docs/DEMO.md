# Native walkthrough

[Watch the MP4](https://github.com/jerelvelarde/openmuse/releases/download/v0.1.0-alpha/openmuse-demo.mp4).

Recorded from the actual OpenMuse development build on an iPhone 17 simulator. The capture is edited into short chapters and played at 2× speed. It runs for 75 seconds and has no narration. All mail, goals, transactions, and form details are fictional local data; the browser visits the real public `example.com` page.

## What the recording shows

| Time | Chapter |
| --- | --- |
| 0:00 | CopilotKit task-linked PDF result and the polished message composer |
| 0:07 | The agent's persistent browser computer |
| 0:12 | The interactive Chromium console |
| 0:21 | A real filled PDF in the native reader |
| 0:35 | A saved finance task, plan, and interactive spending artifact |
| 0:53 | Goals and tracking |
| 1:00 | Source-backed Ideas |
| 1:06 | Gmail/Calendar local-data status and computer connection |

The walkthrough opens persisted results. It is not a claim that live Google, a paid model provider, CopilotKit Intelligence, or OpenBot is connected. Rich Threads has runtime integration tests; live persistence/replay still requires a project key. See [verification](VERIFICATION.md).

## Reproduce the workspace

1. Follow the [quick start](../README.md#quick-start). Keep `WORKSPACE_MODE=sample` and `AGENT_BACKEND=sample` for fictional local data.
2. In Chat, ask **“Complete the permission slip”**. Open the task and enter fictional details. Review the new PDF, then approve the local action. The task saves its receipt and its CopilotKit tool card stays in the conversation.
3. In **Menu → Delegate task → Finance**, enter a request, choose **Try example transactions**, and delegate. The saved artifact shows income 4,200.00, spending 110.99, and remaining 4,089.01. These are imported amounts, not a bank balance.
4. Open that artifact to create a savings goal, then visit Goals.
5. Start the [browser worker](../apps/worker/README.md#local-development), open Computer, and create a session at `https://example.com`.
6. In Ideas, use **Find ideas** and inspect a source. Completed matching document work and sent replies should not be suggested again.
7. Import or fill a PDF in Files to exercise the reader, pagination, and sharing.

## Record your own demo

Use a simulator containing only fictional test data. With the native app open:

```sh
xcrun simctl io booted recordVideo --codec=h264 openmuse-recording.mp4
# Interact with the app. Press Control-C in this terminal to finish the video.
```

The MP4 in the release is an actual screen capture, cut and encoded for size. The repository contains its original OpenMuse screenshot assets; Meta reference screenshots are not redistributed.
