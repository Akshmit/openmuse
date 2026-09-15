# Demos

## Mobile

[Watch the 38-second MP4](../assets/openmuse-mobile-demo.mp4) · [Animated hero](../assets/openmuse-demo.gif) · [Cover image](../assets/openmuse-preview.png).

**OpenMuse 🪁 — ask it to browse, follow along in chat, and take control when you need to.** The native iPhone recording is framed in a 1920 × 1080 (16:9) canvas, with a cream, blue, and lilac background and captions for sound-off viewing.

The model responses use [CopilotKit AI Mock](https://github.com/CopilotKit/aimock). The app runs its actual CopilotKit agent and `browse_web` tool against a real Chromium worker. The script requests a page, waits for the real tool result, and extracts headlines or overview text from that result. It does not supply browser results or invent page content.

### What the mobile recording shows

| Time | Scene |
| --- | --- |
| 0:00–0:04 | Ask OpenMuse to explore Hacker News |
| 0:04–0:09 | Read highlights from the live page |
| 0:09–0:15 | Ask it to summarize CopilotKit |
| 0:15–0:21 | Follow the inline browser and result |
| 0:21–0:31 | Take control of the same live browser |
| 0:31–0:38 | Return to chat and the OpenMuse repository |

- A chat request to find interesting stories on Hacker News.
- A server tool call that opens and reads the page, with a browser card inline in the conversation.
- Highlights extracted from the page the browser just read.
- A second request to summarize CopilotKit, using the same persistent browser session.
- **Take control**, which opens that session's live browser console.
- The open-source repository at [CopilotKit/OpenMuse](https://github.com/CopilotKit/OpenMuse).

Captures are trimmed and paced for readability, including brief slowdowns of the browser card and faster transitions into takeover. This is a reproducible demonstration of the app and tool flow; it is not an evaluation of a live model's reasoning. Site content changes, so your highlights can differ. Personal workspace information is fictional. Live Google, provider quality, Intelligence persistence/replay, and OpenBot require separately configured acceptance runs; see [verification](VERIFICATION.md).

## Desktop web

[Watch the 40-second web MP4](../assets/openmuse-web-demo.mp4) · [Animated preview](../assets/openmuse-web-demo.gif) · [Cover image](../assets/openmuse-web-preview.png).

A separate recording of the actual desktop web app, placed below the mobile demo in the README. The 1440 × 810 browser capture sits inside a 1920 × 1080 canvas with the same cream, blue, and lilac background and OpenMuse 🪁 branding.

| Time | Scene |
| --- | --- |
| 0:00–0:05 | Type a request to explore Hacker News |
| 0:05–0:11 | Follow the agent’s inline browser |
| 0:11–0:16 | Read highlights from the live page |
| 0:16–0:23 | Ask about CopilotKit and see its browser card |
| 0:23–0:28 | Read the page’s overview and source |
| 0:28–0:35 | Take control and scroll the same browser |
| 0:35–0:40 | Return to the conversation |

This recording uses the same AI Mock model and real Chromium tool flow described above. It captures a production web export in a separate local workspace, with actual typing, clicks, and scrolling. Cuts, brief holds, and speed changes shorten waiting time. No development overlays or private workspace information appear in the published media.

## Run the agent browser demo

From the repository root:

```sh
pnpm install --frozen-lockfile
pnpm --dir apps/worker exec playwright install chromium
pnpm dev:demo
```

This starts AI Mock, the normal OpenMuse API on port **8788**, and a separate real browser worker on **8791**. Demo files and profiles stay in ignored `artifacts/demo/`. The runner supplies an explicit local environment and does not load the project's private `.env` or provider credentials. The Linux computer is disabled for this focused browser recording.

Start the app in another terminal:

```sh
EXPO_PUBLIC_API_URL=http://127.0.0.1:8788 pnpm dev:web
```

For the iPhone development build:

```sh
EXPO_PUBLIC_API_URL=http://127.0.0.1:8788 pnpm --dir apps/mobile exec expo start --dev-client --port 8081
```

Use the [native setup](../apps/mobile/README.md) if the development build is not installed. Fully reload the app after changing its API URL. Android emulators use `http://10.0.2.2:8788` for the host API.

Send **“Check out Hacker News for cool stuff”**, then **“Summarize copilotkit.ai”**. Wait for each reply and choose **Take control** to inspect the browser. The recording script supports those two prompts; use [a configured model](../README.md#configure-the-agent-and-google) for open-ended requests. `browse_web` is the same server tool in both modes.

`DEMO_MODEL_FIRST_BYTE_DELAY_MS` and `DEMO_MODEL_CHUNK_DELAY_MS` tune model pacing (defaults 1500 and 80 ms). `DEMO_API_PORT` changes the API port. Set `DEMO_WORKER_URL` and `DEMO_WORKER_TOKEN` to use an existing local worker instead of starting one. The built-in demo token is public and scoped to this local demo; it is not a deployment credential. Press Control-C to stop the demo processes. Restart your normal app command without the demo API override to return to your usual workspace.

## Record your own demo

### iPhone

With the app open on a simulator containing fictional personal information:

```sh
xcrun simctl io booted recordVideo --codec=h264 openmuse-recording.mp4
# Interact with the app. Press Control-C to finish the video.
```

Capture at native resolution, trim idle time, and frame the portrait capture inside a 16:9 canvas. Show the chat request and its real tool result. Describe the model setup in the accompanying recording notes. Check the final video for development reload banners and private content before publishing.

### Web

Start the demo runner, then export and serve the web app to avoid development reload banners:

```sh
EXPO_PUBLIC_API_URL=http://127.0.0.1:8788 pnpm --dir apps/mobile exec expo export --platform web --clear --output-dir dist/web
python3 -m http.server 8081 --bind 127.0.0.1 --directory apps/mobile/dist/web
```

Use port 8081 when the development server is stopped. `--clear` ensures the export uses the requested API URL. Open the page in a clean desktop browser and record the two prompts and takeover flow at 1440 × 810 or larger. Describe the model setup in the accompanying recording notes. Scroll to keep the browser card and resulting text readable.

The original [75-second alpha walkthrough](https://github.com/jerelvelarde/openmuse/releases/download/v0.1.0-alpha/openmuse-demo.mp4) remains available as a historical release archive. OpenMuse's own artwork is included; Meta reference screenshots and mascot are not redistributed.
