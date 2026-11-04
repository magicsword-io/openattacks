# Simulation runner verification

2026-11-03. These results describe runner mechanics with synthetic data. They do not establish model susceptibility, provider compliance, EDR detection, or prevention.

| Environment | Runtime | Result |
| --- | --- | --- |
| macOS 15.7.3 (24G419), ARM64, dedicated Tart guest | Node 22.22.0 | 34/34 runner tests; no failures or skips |
| Ubuntu 24.04.4, kernel 6.17.0-19, ARM64, dedicated Tart guest | Node 22.22.0 | 34/34 runner tests; no failures or skips |
| macOS host, ARM64 | Node 22.22.0 | Same runtime checks passed |
| Windows | Node 22.22.0 CI job | Pending observed CI result; not inferred from other systems |

Both dedicated guests started from cached pinned Cirrus Labs base images, used a read-only artifact share and host-only networking, and ran the copied helpers without installing website dependencies. Source hashes matched the host. The tests drive all seven recipes and their clean/changed/split/retrieval conditions; they use an actual child stdio process, and independently assert rejected arguments, strict JSON handling, call/message budgets, changed source/assets, unknown files, links and cleanup scope. Additional CLI list/prepare/verify/cleanup checks passed in both guests, and run workspaces were removed.

The suite is `node --test tests/simulations.test.mjs`. CI runs it on macOS, Ubuntu and Windows. ARM64 results do not certify Intel/AMD64 behavior. No live agent, API credential, provider account, public exfiltration receiver or security product was used in these checks.

Code and fixture notices are scoped under `simulations/`. The source content generator and web integration have separate tests. Local raw evidence and artifact hashes are retained with the PR working context; the PR summarizes final build, browser, archive and platform checks.
