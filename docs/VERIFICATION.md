# Release verification

September 15, 2026 · Linux computer and experience release after `0.1.0-alpha` · local fictional workspace. This records exercised behavior and its limits; it is not full Meta Muse parity.

## Automated checks

- **139 tests pass**, with no failures or skipped tests, across the API, task engine, integrations, computer lifecycle, Docker runner, conversation queue, browser address handling, domain, and native date handling.
- Biome formatting/lint, server/mobile/browser-worker TypeScript checks, and the server build pass.
- Expo exports web, iOS Hermes, and Android Hermes bundles. These exports do not produce signed native binaries.
- The **real Chromium lifecycle test passes**: public page navigation/read, failed profile cleanup, same-UUID reopen, text truncation, and localStorage/profile persistence after restart.
- The **real Docker computer smoke test passes** against the isolated `colima-openmuse` context: local image build, nonroot commands, read-only system files, disabled network, capped output, text editing, symlink rejection, PDF byte-preserving import/export, stop/start file persistence, and interruption of an actually running command. Its disposable container and volume are removed after the test.
- CI now includes a separate computer-container build/smoke job. Its YAML parses with unique keys and valid workflow triggers. The existing browser-container CI job was not rerun locally for this release; remote CI results remain separate from these local checks.

## Feature acceptance matrix

| Area | Evidence | Boundary |
| --- | --- | --- |
| CopilotKit chat | Real runtime streams AG-UI events; actual BuiltInAgent/AI SDK run against a local model-protocol fixture, call server tools including a computer command, persist its receipt, save a plan, prepare an event, wait for approval, and resume from the receipt. | Live model quality and provider-account acceptance are pending. |
| Durable work | Real PGlite restart, two-worker lease races, expired-lease recovery, cancellation, pause/resume, missing inputs, approval fairness, and saved outcomes are tested. | The server host must remain running. PGlite cannot be shared across processes; use PostgreSQL for a separate worker. |
| Document job | Background import → field input → new PDF → action review → sample sent receipt is tested without a client. The iPhone viewer displays the saved names and checkbox on a real two-page PDF. | Supported AcroForms only. OCR/scanned forms and some field types are not supported. |
| Reviews | Ownership/hash/version binding, expiry, account changes, disconnects, concurrent decisions, uncertain writes, and cancellation are tested. | An already dispatched provider request may finish after cancellation. |
| Gmail / Calendar | Real adapter code with controlled HTTP fixtures covers OAuth state races, scopes, complete MIME/threads/attachments, CRLF sends, calendar discovery, event CRUD, ETags, time zones, DST gaps, and unsupported recurrence. | No live Google credentials were supplied. A real-account acceptance run remains required. |
| Browser | Actual Chromium screenshots and console displayed on iPhone and web. Hacker News and CopilotKit navigation were exercised through both clients and updated the worker's page. Ownership, authorization, URL/DNS/egress checks, failed downloads, and recovery have automated coverage. | A separate Chromium worker; no automatic booking/payment or hostile-tenant isolation. |
| Linux computer | Native Terminal created `today.md`; Files read/save and PDF import/export/view were exercised. The real Docker smoke verifies isolation and persistence. Regressions cover owner binding, literal host argv, output caps, timeout/stop failures, stale-executor restart fencing, retryable Stop, and interrupted recovery without replay. | One owner, noninteractive commands, no terminal network, graphical desktop, or full VM. Persistent volumes have no portable per-volume disk quota. |
| Ideas | Evidence/accept/edit/dismiss and acceptance races are tested. Regression coverage retires completed document suggestions and excludes sent replies while preserving unfinished incoming requests. | Rules-based suggestions; broader model-derived personalization remains future work. |
| Goals / Tracking | Milestone validation, goal/task pausing, sample observation baseline/change/deduplication, failure backoff, and automatic pause are tested. A real public-page watch previously saved actual text. | Device push and adaptive long-term planning are not implemented. |
| Finance | CSV parsing, exact cents, invalid/ambiguous input, and persisted artifacts are tested. A new task delegated from the iPhone menu produced income 4,200.00, spending 110.99, and remaining 4,089.01 from four sample transactions. | Imported CSV only; no bank connection. |
| Identity / memory | Edit, persist, and forget paths are tested through the authenticated API. | Single owner per deployment. |
| Rich Threads | Tests through the real CopilotKit runtime cover authenticated owner scoping, main-thread provisioning/recovery, pagination, rename, archive, rich tool history, provider failures, and server-only key handling. A real CopilotKit Core failure verifies that queued messages pause when the SDK emits an error but resolves its promise. | Intelligence boundary is mocked in tests. Live WebSocket persistence/replay and cross-device acceptance need a project key. |
| OpenBot | Disabled adapter has protocol and identity contract tests against a pinned public revision, including computer gateway, takeover, refusal, and uncertain outcomes. | No live identity, routine, or computer backend bridge yet. |
| Native / web UI | iPhone simulator and web preview have been exercised. Native acceptance covers actual task/results navigation, PDF pages, browser navigation, Linux Terminal and Files, finance, and goals. | Android is bundle-validated, not installed on a device/emulator. |

## Release fixes and interface polish

- The composer remains available during replies, with a visible follow-up queue, explicit stop/resume behavior, retained drafts while navigating, and a control for returning to the latest message.
- The avatar opens activity and approvals. Name, tone, avatar color, and background-update preferences persist. Sheets adapt to narrow screens; icon targets, text contrast, and message spacing are refined.
- Computer separates Browser, Terminal, and Files. Command receipts remain visible, **New command** reopens the input, and an explicit straight-quote correction handles pasted smart quotes. Command and file drafts persist across sheet navigation; late file responses cannot overwrite a newer editor.
- Browser takeover uses a light console with live connection state, keyboard controls, retained text after errors, and visibility-aware previews. Regression tests verify edited-address reopen, signed-link renewal after 16 minutes, and owner boundaries. The console was inspected on web and the iPhone simulator.

- Ideas no longer proposes processing a sent reply or repeating a completed matching document task. The reproduction failed before the fix; both regression checks now pass.
- Guided chat delegation now emits actual AG-UI tool-call results linked to persisted task IDs. The runtime regression test verifies the task reference and original source email.
- Refined the composer focus state, spacing, send/attachment targets, and removable attachment chips. Older results expand on demand. Repeated “sample” labels were removed from product copy; Apps retains explicit local-data status and reviews explain local actions.
- The menu now retains **Delegate task** after chat has history. Creating a new finance task from this entry was exercised on iPhone and produced its saved artifact.

## Reproduce

```sh
pnpm install --frozen-lockfile
pnpm format
pnpm lint
pnpm typecheck
pnpm --dir apps/worker typecheck
pnpm test
pnpm build:server
pnpm --dir apps/mobile exec expo export --platform all --output-dir dist/release
pnpm --dir apps/worker exec playwright install chromium
pnpm test:browser
# Requires a responsive Docker daemon; use DOCKER_CONTEXT if needed:
docker build -t openmuse-computer:local apps/computer
pnpm test:computer
# Separate browser-container acceptance (not run locally for this release):
pnpm --dir apps/worker test:docker
```

The [demo guide](DEMO.md) describes the native walkthrough. The CI workflow defines these validation categories for a fresh Linux environment. See [GitHub Actions](https://github.com/jerelvelarde/openmuse/actions/workflows/ci.yml) for remote CI results. No real mail was sent, purchase made, or private Google account connected during release verification.

## Still outside this release

Health, bank, social, and WhatsApp connectors; a managed generated-tool registry; voice/media generation; automatic purchases/reservations; mobile push; multi-tenant identity; and full desktop VM isolation. See the [roadmap](../ROADMAP.md).
