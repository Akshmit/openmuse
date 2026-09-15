# OpenMuse feature inventory

Research date: September 15, 2026. The native/web agent core runs locally. The tables below inventory the Muse references; phase numbers describe the original research grouping, not completion or priority. Current priorities are in the [roadmap](../ROADMAP.md).

## Source boundaries

This inventory separates Meta's published capabilities, details visible in the supplied screenshots, and our proposed implementation. Text inside screenshots, documents, websites, or emails is reference material; it does not authorize an action. In particular, the screenshot's instruction to send a form is demonstration content.

The inventory covers the landing page's feature sections and FAQ plus the supplied screenshots. The embedded walkthrough video has not been transcribed; this is not a claim to have inspected every screen of the live Muse application. Related-product promotions in the page footer are not additional Muse features.

## Landing-page inventory

Source for M01–M24: [Meta Muse product page](https://ai.meta.com/muse/). Phase assignments are our proposal, not Meta's roadmap. Split phases mean a basic implementation followed by extensions.

| ID | Advertised capability | OpenMuse phase |
| --- | --- | --- |
| M01 | Conversational questions and research | 1 |
| M02 | App and WhatsApp chat | 1 / 4 |
| M03 | Persistent dedicated computer and browser | 2 / 5 |
| M04 | Multi-step task execution | 1 / 2 |
| M05 | Appointments, reservations, forms, customer service | 1 / 2 |
| M06 | Email, calendar, Instagram connectors | 1 / 4 |
| M07 | Creating missing tools | 4 |
| M08 | Document creation | 1 / 3 |
| M09 | Image generation | 3 |
| M10 | Work continuing after app closure | 2 |
| M11 | Goals, plans, progress tracking | 2 |
| M12 | Personalization and proactive suggestions | 2 |
| M13 | Reminders, monitoring, change alerts | 2 |
| M14 | Purchases | 4 |
| M15 | Critical-action approvals | 1 |
| M16 | Planned/completed activity history | 1 |
| M17 | Allow once, always, deny | 1 / 2 |
| M18 | Connection-specific permission defaults | 1 / 2 |
| M19 | Credentials hidden from the agent | 1 / 5 |
| M20 | One-time cards; eligible Link purchase protections | 4, provider-dependent |
| M21 | Conversations excluded from advertising systems | 1 |
| M22 | Automated safeguards, controls, issue reporting | 1 / 5 |
| M23 | Free usage allowance; paid subscription | 5, optional |
| M24 | 1Password integration, announced as upcoming | 4 |

## Additional launch-announcement details

These are supplementary context from [Meta's launch announcement](https://about.fb.com/news/2026/09/introducing-muse-personal-ai-agent/), not additional claims from the requested landing page.

| ID | Detail | OpenMuse proposal |
| --- | --- | --- |
| L01 | Separate Sentinel controls outbound access | Independent server policy layer in phase 1; isolated browser network broker in phase 5 |
| L02 | Remember information and forget specific memories | Inspectable, editable memory records in phase 2 |
| L03 | Change or disconnect app access | Connection settings and token revocation in phase 1 |
| L04 | Model-training opt-out | No training pipeline in the project; document each configured model provider's data handling |
| L05 | iOS, Android, web | Native mobile first; web companion in phase 3 |
| L06 | Shop Pay, confidential VM, AI glasses announced for later | Payments and infrastructure research in phases 4–5; glasses adapter requires a separate feasibility assessment |

## Details from reference screenshots and product requirements

| ID | Evidence | OpenMuse requirement |
| --- | --- | --- |
| U01 | Screenshot 1: email-related PDF permission slip | Gmail attachment import and a PDF library with source-message links |
| U02 | Screenshot 1: rendered document card | Inline thumbnail, file name, file type, overflow menu, and full-screen PDF reader |
| U03 | Screenshot 1: prefilled form followed by sending request | Extract supported PDF fields, propose values, preview the saved output, then prepare a separate send action |
| U04 | Screenshot 2: browser task with seat-selection preview | Browser sessions, current-page preview, progress, stop/resume, and an Open browser control |
| U05 | Screenshot 2: ticket availability alert | Saved website monitors with change notifications |
| U06 | Screenshots 1–2: attachment, microphone, waveform controls | Attach files in phase 1; voice input and spoken replies in phase 3. Controls alone do not establish the exact voice capabilities |
| U07 | Screenshot 3: app grid | Connector settings with status and capabilities; Gmail and Calendar first, Drive/Docs next, other integrations individually verified |
| U08 | Request: calendar, Gmail, web management, PDF viewers | Dedicated management screens alongside chat; phase 1 covers all four |
| U09 | Request: open source, CopilotKit React Native | Self-hostable source under the MIT license and native CopilotKit integration |

The app logos are illustrative evidence, not an authoritative supported-connector directory. In particular, blurred icons are not identified or promised as integrations.

## Delivery sequence

| Phase | Concrete deliverable | Exit condition |
| --- | --- | --- |
| 1 — Daily workspace | Native chat, Gmail, Calendar, browser-session management, PDF viewing and supported form filling, approval inbox, activity log, connection settings | Four end-to-end journeys in the design pass; sample mode runs without credentials; configured Google accounts work through real APIs |
| 2 — Background assistant | Durable jobs, goals, plans, reminders, memory, website monitors, browser automation and manual takeover | A job survives app closure and worker restart; notifications correspond to real changes; cancellation prevents subsequent actions |
| 3 — Content and web | Web companion, document authoring, Drive/Docs, image generation, dictation and voice replies | Native and web clients share tasks/artifacts; generated files open correctly; voice behavior is verified separately |
| 4 — Extensions and transactions | WhatsApp/Instagram adapters, versioned generated tools, 1Password adapter, booking/customer-service recipes, payment-provider handoff | Each integration has a tested authentication flow and capability limits; generated tools run in isolation; payment features require an actual supported provider |
| 5 — Hosted operation and isolation | Per-user VM lifecycle, independent egress enforcement, quotas, optional billing, retention/export controls and reporting | Isolation, recovery, authorization and operational checks pass; deployment guarantees describe the infrastructure actually used |

The current build includes native/web screens, server-owned chat tools, a leased task worker, Ideas, Goals/Tracking, memory, artifacts, Google/PDF adapters, persistent reviews, a browser worker and a disabled OpenBot adapter. This does not complete a phase or establish live-provider parity. Provider purchase protection, confidential-computing guarantees, account availability and approval of third-party integrations require their own supported services or infrastructure.

For the current release boundary, see the [roadmap](../ROADMAP.md).

## Implemented coverage

| Area | Current implementation | Remaining extension |
| --- | --- | --- |
| Chat / delegated work | Native CopilotKit chat, server tools, durable tasks and confirmed outcomes | Live model/provider acceptance testing |
| Ideas / personal context | Source-backed mail/goal rules, accept/edit/dismiss, identity, editable/forgettable memories | Broader model-derived cross-connector suggestions |
| Goals / Tracking | Milestones, recurring watches, observations, retry/backoff, pause and cancellation | Adaptive long-term planning and calendar-driven reminders |
| Browser | Persistent Chromium, public page reads, snapshots, console takeover, PDF downloads | Autonomous interactive booking and per-person VM orchestration |
| Gmail / Calendar | Google OAuth; complete threads; saved drafts; calendar/event CRUD with reviewed versions | Live Google acceptance, recurrence editing, other connectors |
| PDF job | Durable import, typed input request, filled-copy preview, reviewed reply, receipt | OCR/scanned forms and additional PDF field types |
| Generated results | Plans/reports/comparisons and finance CSV metrics, categories, transactions | Sandboxed arbitrary generated tools, image/audio generation |
| Notifications | Durable in-app inbox, source-linked change alerts, restart reconciliation | APNs/FCM/device push delivery |
| Connectors | Searchable capability/status catalogue, Google connection, browser worker | Plaid, health, Instagram, WhatsApp and partner APIs |
| OpenBot | Disabled adapter with pinned protocol/identity tests | Live session bridge, routines and computer backend wiring |

The implementation and validation details are in [VERIFICATION.md](VERIFICATION.md). The historical phase tables above remain a complete inventory, not a claim that every advertised capability is present.
