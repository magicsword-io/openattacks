# LiteLLM 1.107.0 backdoor steals cloud and AI credentials

- ID: socket-litellm-supply-chain-2026-10
- Reported: 2026-10-21
- AI role: ai_credential_theft
- Entry: https://openattacks.ai/attacks/socket-litellm-supply-chain-2026-10/

## Summary
LiteLLM version 1.107.0 on PyPI and GHCR delivered malware through Python startup hooks (cook.pth, cook.py, sitecustomize.py). The payload collects: AWS/Azure/GCP/K8s credentials, GitHub CLI tokens, SSH/GPG keys, AI tool credentials (Codex, Claude, Gemini, Cursor MCP, Copilot, etc.), browser data, LiteLLM proxy database credentials, and environment variables. Collector encrypts data with AES-256-CBC and exfiltrates to www.litellm.dev/healthcheck. A second loader downloads Python from GitHub-controlled domain for remote execution. Docker provenance showed lookalike repository Berri-AI/litellm (hyphenated) instead of legitimate BerriAI/litellm.

## Category
uncategorized

## Attribution
unknown; lookalike repository and release workflow compromise suggest targeted supply chain operation

## AI involvement confidence
not assessed

## Attack flow
### supply-chain: Compromised release workflow (access)

Project release workflow used lookalike repository Berri-AI/litellm (hyphenated) instead of legitimate BerriAI/litellm; malicious commit added Maturin data directory; build provenance recorded source-owner override

Evidence: <https://socket.dev/blog/litellm-compromise>

### distribution: Malicious package distribution (execution)

Published litellm 1.107.0 to PyPI (7 wheels across macOS/Linux/Windows) and Docker images to GHCR with floating tags (latest, main-latest, main-stable)

Evidence: <https://socket.dev/blog/litellm-compromise>

### installation: Python startup hook installation (execution)

Wheels install cook.pth, cook.py, sitecustomize.py to environment's Python library directory; triggered automatically on any Python startup

Evidence: <https://socket.dev/blog/litellm-compromise>

### collection: Credential collection (ai)

Collects AWS/Azure/GCP/K8s, AI tools (Codex/Claude/Gemini/Cursor/Copilot/Windsurf), SSH/GPG keys, browser data, LiteLLM proxy DB credentials, environment variables; 16 collection modules with individual error handling

Evidence: <https://socket.dev/blog/litellm-compromise>

### exfiltration: Encrypted exfiltration (impact)

Data encrypted with AES-256-CBC, key wrapped with RSA-4096 public key, packaged in gzip tar; POSTed to www.litellm.dev/healthcheck with X-Token header; up to 4 retry attempts

Evidence: <https://socket.dev/blog/litellm-compromise>

### persistence: Remote code loader (execution)

sitecustomize.py forks detached process; downloads domain.txt from GitHub repo letters9813/pythonclient-test; if domain resolves, downloads and executes Python from /codepy endpoint; 1-hour loop

Evidence: <https://socket.dev/blog/litellm-compromise>

### Connections

- supply-chain -> distribution
- distribution -> installation
- installation -> collection
- collection -> exfiltration
- installation -> persistence
- persistence -> collection [loop]

## MITRE ATLAS
- [AML.T0010.001](https://atlas.mitre.org/techniques/AML.T0010.001) AI Software — Supply chain compromise of LiteLLM package specifically targeting AI/ML infrastructure and gateway credentials
  Evidence: <https://socket.dev/blog/litellm-compromise>
- [AML.T0055](https://atlas.mitre.org/techniques/AML.T0055) Unsecured Credentials — Credential theft specifically targets AI development tools (Codex, Claude, Gemini, Cursor, Copilot) and LiteLLM proxy database
  Evidence: <https://socket.dev/blog/litellm-compromise>

## Prevention
Block litellm==1.107.0 and affected image digests; Python startup hook monitoring; dependency pinning and artifact verification; registry tag floating risks; separate release credentials from installation environments; audit cloud/AI credentials

## Detections
No detections are recorded.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- LiteLLM (legitimate proxy for LLM providers, compromised version)

### Other tooling
- [Python](https://github.com/python/cpython) startup hooks (cook.pth for import cook, sitecustomize.py)
- Base64-encoded zlib-compressed credential collector
- Maturin build with data directory
- RSA-4096 encryption for exfiltration
- GitHub domain.txt pointer for remote code loader

## Sources
- [LiteLLM PyPI Package and Docker Images Compromised to Steal Cloud and AI Credentials](https://socket.dev/blog/litellm-compromise)
