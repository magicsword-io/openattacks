# Microsoft agent-framework PyPI 1.26.1 and 1.26.2 .pth credential stealer

- ID: microsoft-agent-framework-pypi-pth-stealer-2026-11
- Reported: 2026-11-17
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/microsoft-agent-framework-pypi-pth-stealer-2026-11/

## Summary
On 17 November 2026, PyPI package agent-framework (Microsoft Agent Framework) received two releases nobody at Microsoft has claimed. Wiz (Rami McCarthy, Scott Piper, Benjamin Read) times version 1.26.1 at 20:35 UTC and 1.26.2 at about 21:08 UTC, and says both were gone from PyPI by about 21:30 UTC. The last safe release is 1.26.0, published 12 November 2026 at 18:25 UTC as a wheel and an sdist together with agent-framework-core 1.26.0. Wiz says there is no python-1.26.1 tag or release in the project repository, main does not contain the malicious code, and 1.26.1 was a wheel only while still depending on agent-framework-core[all]==1.26.0, so the framework kept working. Wiz says the root cause is unconfirmed and has not linked this to the May 2026 durabletask compromise. OX Security (Moshe Siman Tov Bustan) says the attacker appears to have hijacked the wheel build flow. The Hacker News (Ravie Lakshmanan, 18 November 2026) describes that earlier durabletask incident as TeamPCP distributing Mini Shai-Hulud, and treats agent-framework as a separate later compromise of a second Microsoft PyPI package. Any pip install agent-framework or unpinned upgrade during the window installed the wheel. Python executes import lines in .pth files on every interpreter start, including pip, even when agent_framework is never imported. Version 1.26.1 drops agent_framework_meta.pth, whose single line is import agent_framework_meta. agent_framework_meta/__init__.py then calls _telemetry._start() inside a silent try block, under the comment Lightweight runtime diagnostics hook. _start sets _AF_TEL=1 so the same process tree runs it once, then forks and calls os.setsid, or starts a daemon thread where fork is unavailable. Version 1.26.2 restores the clean __init__.py and moves the trigger to a new top-level af_runtime_diag.pth that imports af_runtime_diag.py, which starts collection on import, so a hunt for the 1.26.1 names misses it. Collection covers environment names containing TOKEN, SECRET, PASSWORD, KEY, AZURE, AWS, GITHUB, OPENAI, HF_, FOUNDRY, NPM, PIP, NUGET, SYSTEM, BUILD, and AGENT, plus up to 300 /proc/*/environ files and up to 60 credential files (~/.azure/, .npmrc, pip.conf, .netrc, .git-credentials, .docker/config.json, Hugging Face tokens, Foundry config, Azure DevOps agent .credentials, and .env or JSON under /app and /workspace). It also requests an Azure DevOps OIDC token for api://AzureADTokenExchange when SYSTEM_ACCESSTOKEN and SYSTEM_OIDCREQUESTURI are set, and managed-identity tokens from IMDS (169.254.169.254) or the App Service identity endpoint. Wiz describes 12 resource audiences, naming ARM, Graph, Key Vault, Storage, Cognitive Services, Azure AI/ML, Search, Container Registry, Azure DevOps, and AzureADTokenExchange, plus instance metadata. One JSON document is zlib-compressed, base64-encoded, and POSTed once to hxxps://webhook[.]site/d381fd80-ec62-42ad-8f5c-d1b15103c9bb?t=telemetry with User-Agent af-runtime-diagnostics/1. There is no fallback channel. Version 1.26.2 uses User-Agent runtime-diagnostics/1, adds GitHub Actions OIDC theft for api://AzureADTokenExchange and https://management.azure.com/ when a workflow has id-token: write, adds ACTIONS, OIDC, RUNNER, and ARM_ name patterns, adds /home/runner/work/_temp/* and /home/runner/.azure/, and raises the file cap from 60 to 80. Wiz says the webhook token was on the free tier, which caps a URL at 100 requests, and that at most 50 requests were captured. Wiz cites about 41,000 downloads a week and, in the same post's headline, almost 200,000 a month. OX cites 192,534 monthly downloads. OSV MAL-2026-20101 (published 17 November 2026 at 22:12 UTC; finders Amazon Inspector and OX Security; analyst Kamil Mańkowski / kam193) and GHSA-764m-3ppc-5m73 (published 18 November 2026 at 00:31 UTC) match this description. github.com/microsoft/agent-framework returned HTTP 404 on 18 November 2026, so it is not linked here.

## Category
attacks-on-ai

## Attribution
Unattributed. Wiz says the root cause is unconfirmed and has not linked this to the May 2026 durabletask compromise.

- Actor: Unattributed
- Country: Unknown
- Motivation: unknown
- Attributed by: No one. Wiz says the root cause is unconfirmed.

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: pip install or an unpinned upgrade of agent-framework during the 17 November 2026 window pulled the malicious wheel. How the publisher credential was obtained is unconfirmed.
- Victims and sectors: Developers, CI runners, and containers that installed agent-framework 1.26.1 or 1.26.2. No named victim organization was published.
- Regions: Multiple regions
- Region notes: No victim country was published. Multiple regions reflects a public PyPI package rather than a named geography. Actor location is not a victim region.
- Scale and metrics: Window about 20:35 to 21:30 UTC on 17 November 2026. Wiz: about 41,000 downloads a week, and almost 200,000 a month in the headline. OX: 192,534 monthly downloads. Wiz confirmed the webhook.site token was free tier (100-request cap) and that at most 50 requests were captured. No victim count.

## Attack flow
### upload: Malicious wheels published (access)

1.26.1 at 20:35 UTC and 1.26.2 at about 21:08 UTC. Both were off PyPI by about 21:30 UTC. The dependency stayed agent-framework-core 1.26.0.

Evidence: <https://www.wiz.io/blog/malicious-version-of-microsofts-agent-framework-published-to-pypi>

### pth-hook: .pth runs on Python start (execution)

1.26.1 uses agent_framework_meta.pth and _telemetry.py. 1.26.2 uses af_runtime_diag.pth and af_runtime_diag.py. _AF_TEL=1 limits it to once per process tree.

Evidence: <https://www.wiz.io/blog/malicious-version-of-microsofts-agent-framework-published-to-pypi> <https://socket.dev/blog/agent-framework-pypi-package-compromised-with-credential-stealer>

### collect: Cloud, CI, and model tokens (ai)

Environment and file secrets, Azure DevOps and managed-identity tokens, and in 1.26.2 GitHub Actions OIDC tokens. Patterns include OPENAI, HF_, and FOUNDRY.

Evidence: <https://www.wiz.io/blog/malicious-version-of-microsofts-agent-framework-published-to-pypi>

### webhook: One POST to webhook.site (impact)

A single compressed JSON POST to the hardcoded webhook.site URL. Wiz says the free-tier token captured at most 50 requests.

Evidence: <https://www.wiz.io/blog/malicious-version-of-microsofts-agent-framework-published-to-pypi>

### Connections

- upload -> pth-hook
- pth-hook -> collect
- collect -> webhook

## MITRE ATLAS
- [AML.T0010.001](https://atlas.mitre.org/techniques/AML.T0010.001) AI Software — Malicious releases were published on the official Microsoft Agent Framework PyPI package, which is AI software.
  Evidence: <https://www.wiz.io/blog/malicious-version-of-microsofts-agent-framework-published-to-pypi>
- [AML.T0011.001](https://atlas.mitre.org/techniques/AML.T0011.001) Malicious Package — Installing the wheel, or any later Python start in that environment, runs the .pth hook without importing the package.
  Evidence: <https://www.wiz.io/blog/malicious-version-of-microsofts-agent-framework-published-to-pypi> <https://osv.dev/vulnerability/MAL-2026-20101>
- [AML.T0055](https://atlas.mitre.org/techniques/AML.T0055) Unsecured Credentials — The hook reads credential files, environment secrets, and cloud identity tokens, including OpenAI, Hugging Face, and Foundry material.
  Evidence: <https://www.wiz.io/blog/malicious-version-of-microsofts-agent-framework-published-to-pypi> <https://socket.dev/blog/agent-framework-pypi-package-compromised-with-credential-stealer>
- [AML.T0025](https://atlas.mitre.org/techniques/AML.T0025) Exfiltration via Cyber Means — Collected JSON is zlib-compressed, base64-encoded, and posted once to a hardcoded webhook.site URL.
  Evidence: <https://www.wiz.io/blog/malicious-version-of-microsofts-agent-framework-published-to-pypi>

## Prevention
Pin agent-framework to 1.26.0 or another release verified against Microsoft, and install with a hash. Search lockfiles, CI logs, virtualenvs, and images for 1.26.1 and 1.26.2. On disk, look for agent_framework_meta.pth, agent_framework_meta/_telemetry.py, af_runtime_diag.pth, and af_runtime_diag.py, and for _AF_TEL=1. Search proxy and DNS logs for webhook.site and the path d381fd80-ec62-42ad-8f5c-d1b15103c9bb. If Python started in that environment, rotate secrets that were reachable, including Azure CLI sessions, Azure DevOps PATs, managed-identity and federated credentials, and GitHub Actions OIDC for workflows that installed 1.26.2 with id-token: write. A 200 from the webhook means the request was accepted. A 410 or 429 means the free-tier URL rejected it.

## Detections
- [Python Path File (pth) Creation](https://github.com/elastic/detection-rules/blob/main/rules/linux/persistence_pth_file_creation.toml) (elastic) — Linux endpoint file events. Creation of a .pth file under system or user site-packages or dist-packages. pip is not in the general exclusion list. The rule does not match Windows or macOS. It does not look for agent_framework_meta.pth or af_runtime_diag.pth by name. The Splunk sitecustomize.py site-hook rule is not cited because these wheels do not drop that file.
- agent-framework file names and the webhook (guidance) — Also hunt agent_framework_meta.pth, agent_framework_meta/_telemetry.py, af_runtime_diag.pth, af_runtime_diag.py, and _AF_TEL=1, plus DNS or proxy hits for webhook.site path d381fd80-ec62-42ad-8f5c-d1b15103c9bb and User-Agents af-runtime-diagnostics/1 and runtime-diagnostics/1. No cited rule covers the Windows interpreter or the webhook host.

## Timeline
- First seen: 2026-11-17
- Last updated: 2026-11-18
- 2026-11-12 (Wiz): Legitimate agent-framework 1.26.0 published at 18:25 UTC, wheel and sdist, alongside agent-framework-core 1.26.0.
- 2026-11-17 (Wiz): 1.26.1 at 20:35 UTC and 1.26.2 at about 21:08 UTC. Both unavailable on PyPI by about 21:30 UTC. OSV MAL-2026-20101 published at 22:12 UTC.
- 2026-11-18 (GitHub Advisory Database): GHSA-764m-3ppc-5m73 published at 00:31 UTC. The Hacker News summarizes Wiz, Socket, OX, Aikido, StepSecurity, and others.

## Tools
### AI tooling and models
- Microsoft Agent Framework [Python](https://github.com/python/cpython) package agent-framework (PyPI), last safe release 1.26.0
- Stealer targets OPENAI, HF_, and FOUNDRY names and Azure AI, ML, and Cognitive Services tokens

### Other tooling
- [Python](https://github.com/python/cpython) .pth startup hook (agent_framework_meta.pth, then af_runtime_diag.pth)
- [webhook.site](https://github.com/webhooksite/webhook.site) as the single exfiltration endpoint

## Source notes
Times, file names, the _AF_TEL marker, the 12-audience description, the free-tier cap, and the at-most-50 figure are from Wiz. Socket and OSV MAL-2026-20101 agree on the two wheels, the renamed 1.26.2 trigger, and the webhook. OX states the 192,534 monthly-download figure and the wheel-build-flow hypothesis. The Hacker News byline is Ravie Lakshmanan, 18 November 2026; its TeamPCP / Mini Shai-Hulud sentence is about the May durabletask incident, which Wiz says is not linked. Hashes: wheel 1.26.1 SHA256 d27fa34414e6201d5e03e559ef634f020057554d7b3f4898dd5d7cd3e989e110; wheel 1.26.2 SHA256 3d20a8bc91351a9a16b6db243b848ceca0206b7a8623b02d2af553a9c9f7e0a9; af_runtime_diag.py SHA256 54d885b7d7161c9ed96489c66364c4bfbf635929166843bba10d97d46b5a2e1f; af_runtime_diag.pth SHA256 325e7e9f0ec94e41ad1a1b7a3f18a6b8b5bffece2e2b97b8d3369eb967452f93; _telemetry.py SHA1 0a013e4724c4437cf9b177def1d988113e167539 (Wiz) and SHA256 39fa329f2a93f734b0bb8f5adb203ea3331d1ae479832a5015a54cb17aabd663 (Socket and OSV); agent_framework_meta.pth SHA256 21f28e8517a10ffe431f8d68f5875c85eca4001ae6d118322b0a41873998eb5e (Socket); agent_framework_meta/__init__.py SHA256 c275ccbe520ef3c0f02dc6a35389e427f9f1b4e0b12e140cd7bf7179ce143f02 (Socket). Link socket-litellm-supply-chain-2026-10 and shai-hulud-self-replicating-npm-worm-2025-09. The project repository URL returned HTTP 404 on 18 November 2026 and is omitted.

## Sources
- [Microsoft agent-framework Compromised: Credential Stealer Targets Azure and CI Pipelines](https://www.wiz.io/blog/malicious-version-of-microsofts-agent-framework-published-to-pypi) — Wiz
- [Microsoft's agent-framework PyPI package compromised with credential stealer](https://socket.dev/blog/agent-framework-pypi-package-compromised-with-credential-stealer) — Socket
- [Two malicious agent-framework releases hit PyPI in 33 minutes](https://www.aikido.dev/blog/two-malicious-agent-framework-releases-hit-pypi-in-33-minutes) — Aikido
- [Microsoft agent-framework PyPI package compromised](https://www.stepsecurity.io/blog/microsoft-agent-framework-pypi-package-compromised) — StepSecurity
- [BREAKING: Hijacked releases of Microsoft's official agent-framework steal Azure and CI credentials](https://www.ox.security/blog/breaking-hijacked-releases-of-microsofts-official-agent-framework-steals-azure-and-ci-credentials/) — OX Security
- [MAL-2026-20101: malicious code in agent-framework (PyPI)](https://osv.dev/vulnerability/MAL-2026-20101) — OSV
- [GHSA-764m-3ppc-5m73: malicious code in agent-framework (PyPI)](https://github.com/advisories/GHSA-764m-3ppc-5m73) — GitHub Advisory Database
- [Attackers compromise Microsoft's agent-framework PyPI package to steal cloud credentials](https://thehackernews.com/2026/11/attackers-compromise-microsofts-agent.html) — The Hacker News
