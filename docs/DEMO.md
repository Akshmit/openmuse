# Mobile demo

[Watch the 38-second MP4](../assets/openmuse-mobile-demo.mp4) · [Animated hero](../assets/openmuse-demo.gif) · [Cover image](../assets/openmuse-preview.png).

Recorded from the working OpenMuse development build on an iPhone 17 simulator. The video is **1920 × 1080 (16:9), 30 fps, and 38 seconds**, with a cream, blue, and lilac background and captions designed for sound-off viewing. The opening hook is “Your agent has a computer.” Actual app captures are cut and accelerated up to 2×; no provider connections or execution results are simulated in the edit.

## What the recording shows

| Time | Scene |
| --- | --- |
| 0:00–0:03 | The agent computer and its saved browser session |
| 0:03–0:10 | Opening the real CopilotKit website and Hacker News in persistent Chromium |
| 0:10–0:15 | A Linux command receipt with successful output and a saved `today.md` file |
| 0:15–0:21 | Opening and saving that same file in the workspace editor |
| 0:21–0:27 | A PDF exported from the computer into the native reader, including paging |
| 0:27–0:32 | A saved document result and action update in the CopilotKit conversation |
| 0:32–0:38 | Goals and the open-source repository link |

The walkthrough shows manual browser/computer interaction and previously saved task results. It does not present these edits as an uninterrupted autonomous agent run. Personal mail, goals, and form details are fictional. CopilotKit and Hacker News are real public pages. The Linux workspace runs in the project's isolated Docker container, using a dedicated Colima VM on the recording machine; it is not Meta Secure VM or a graphical desktop.

Live Google, model-provider quality, CopilotKit Intelligence persistence/replay, and OpenBot still require separately configured acceptance runs. See [verification](VERIFICATION.md).

## Reproduce the workspace

1. Follow the [quick start](../README.md#quick-start). Keep the default local-data mode for fictional personal information.
2. In Chat, ask **“Complete the permission slip”**. Open the task, enter fictional form values, inspect the PDF, and review the local reply. Its saved tool result remains in the conversation.
3. Start the [browser worker](../apps/worker/README.md#local-development), open Computer, and navigate to `copilotkit.ai` or `news.ycombinator.com`. Bare domains become HTTPS addresses.
4. Enable the [Linux computer](COMPUTER.md) and open **Computer → Terminal → Start computer**. Run:

   ```sh
   printf '# Today\n\n- Read Hacker News\n- Review my calendar\n- Plan the week\n' > today.md
   cat today.md
   ```

5. Open **Files → today.md** and save it. The file is in the same persistent `/workspace` volume used by the terminal.
6. Choose **Copy a document here** to import an app PDF. Open the copied file from the workspace list to export it into Documents and display it in the native reader. Use **Next** to inspect the second page.
7. In **Menu → Delegate task → Finance**, use **Try example transactions**. Open the saved artifact to create a savings goal and visit Goals.

## Record your own demo

Use a simulator containing fictional personal data. With the native app open:

```sh
xcrun simctl io booted recordVideo --codec=h264 openmuse-recording.mp4
# Interact with the app. Press Control-C to finish the video.
```

Capture at native resolution, trim idle time, and place the portrait capture inside a 16:9 canvas. Keep captions short and show the first working screen immediately. Check the final video for development reload banners, credentials, and accidental private content before publishing.

The original [75-second alpha walkthrough](https://github.com/jerelvelarde/openmuse/releases/download/v0.1.0-alpha/openmuse-demo.mp4) remains available as a release archive. The README hero uses the newer 38-second cut. OpenMuse's own artwork is included; Meta reference screenshots and mascot are not redistributed.
