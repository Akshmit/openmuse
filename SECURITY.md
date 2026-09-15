# Security policy

## Reporting a vulnerability

Use the repository's **Security → Report a vulnerability** form for private reports. Include the affected commit, reproduction steps using fictional data, and the observed impact. Do not open a public issue containing credentials or a working exploit against someone else's deployment. This alpha has no guaranteed response time.

## Deployment boundary

OpenMuse currently supports one owner per deployment. Live mode uses a shared access key; it is not multi-tenant account authentication. Sample mode binds to loopback and contains fictional data. Use HTTPS and restricted network access for a remote live deployment.

The API holds provider credentials. Google tokens are encrypted at rest; short-lived signed URLs grant file and browser-console access. Protect `.env`, `.openmuse`, database backups, and browser profiles as private data. A signed URL is a credential until it expires.

The browser worker must remain private and require its own random token. It runs persistent Chromium with application-enforced public-network checks. Playwright disables Chromium's internal sandbox by default; this is not a full desktop VM or a security boundary for hostile tenants. The Docker image reduces host access but does not establish kernel-enforced network isolation. See [worker boundaries](apps/worker/README.md).

A proposal is bound to the account, reviewed content, and applicable provider version. The server requires a recorded approval before dispatching a send or calendar change. An uncertain network outcome is retained for reconciliation. Cancellation stops later task steps; a provider request already in flight may still finish.

No provider keys, personal data, or third-party logins are needed for the sample walkthrough or CI. CopilotKit Intelligence and any configured model/provider operate under their own terms and data policies.
