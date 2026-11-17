# Scans exploit LiteLLM MCP test endpoint for unauthenticated command execution (CVE-2026-42271 + Starlette BadHost CVE-2026-48710)

- ID: sans-isc-litellm-mcp-rest-scans-2026-11
- Reported: 2026-11-16
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/sans-isc-litellm-mcp-rest-scans-2026-11/

## Summary
LiteLLM exposes POST /mcp-rest/test/connection and POST /mcp-rest/test/tools/list to test an MCP server before it is added to the gateway. Both accept a full server config, including a stdio command, arguments and environment, and LiteLLM spawns that command as a subprocess on the proxy host (CVE-2026-42271, LiteLLM 1.74.2 through 1.83.6). The endpoints require a proxy API key, but Horizon3.ai showed that CVE-2026-48710 ("BadHost"), where Starlette 1.0.0 and older use an unvalidated Host header to build the URL that access control checks, removes that requirement, giving unauthenticated command execution as the LiteLLM process. SANS ISC honeypots began receiving these requests the weekend of Nov 14-15, 2026, for example POST /mcp-rest/test/tools/list with Authorization: Bearer nothing and the body {"server": {"transport": "stdio", "command": "id", "args": [], "env": {}}}, with Host header values localhost], [localhost, 127.0.0.1] and litellm.proxy, which Ullrich reads as variations meant to slip past filters built around the public PoC. User-Agent Python/3.14 aiohttp/3.14.5. Exploitation of the chain had been reported since July 2026.

## Category
attacks-on-ai

## Attribution
Unattributed scanning observed by SANS ISC honeypots

- Actor: Unnamed
- Country: Unknown
- Motivation: unknown
- Attributed by: SANS ISC (observation only)
- Confidence: low

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Unauthenticated HTTP request to an internet-facing LiteLLM proxy, using a malformed Host header to bypass the API key check
- Victims and sectors: Organizations running internet-facing LiteLLM proxies
- Regions: unknown
- Region notes: The honeypot diary does not name a target country. global is not a region value in the schema, so this entry uses unknown.
- Scale and metrics: SANS ISC honeypots started seeing the requests the weekend of Nov 14-15, 2026. The diary does not publish a hit count. Horizon3.ai rates the chain CVSS 10.0 and lists LiteLLM 1.74.2 through 1.83.6, patched in 1.83.7, when Starlette is 1.0.0 or older.

## Attack flow
### badhost: Bypass the API key check (access)

A malformed Host header (localhost], [localhost, 127.0.0.1]) confuses Starlette's URL-based access control.

Evidence: <https://isc.sans.edu/diary/33522>

### mcp-test: Submit a stdio MCP server config (ai)

POST /mcp-rest/test/tools/list with transport stdio and an attacker-chosen command.

Evidence: <https://isc.sans.edu/diary/33522>

### exec: Command runs on the proxy host (impact)

LiteLLM spawns the command as the proxy process, which can read stored provider keys.

Evidence: <https://horizon3.ai/attack-research/vulnerabilities/cve-2026-42271-chained-with-cve-2026-48710/>

### Connections

- badhost -> mcp-test
- mcp-test -> exec

## MITRE ATLAS
- [AML.T0049](https://atlas.mitre.org/techniques/AML.T0049) Exploit Public-Facing Application — Exploit of a public-facing AI gateway endpoint with an authentication bypass
  Evidence: <https://horizon3.ai/attack-research/vulnerabilities/cve-2026-42271-chained-with-cve-2026-48710/>
- [AML.T0050](https://atlas.mitre.org/techniques/AML.T0050) Command and Scripting Interpreter — The stdio command in the MCP server config runs as a subprocess on the proxy host
  Evidence: <https://isc.sans.edu/diary/33522>
- [AML.T0055](https://atlas.mitre.org/techniques/AML.T0055) Unsecured Credentials — The LiteLLM process holds model provider API keys and secrets
  Evidence: <https://horizon3.ai/attack-research/vulnerabilities/cve-2026-42271-chained-with-cve-2026-48710/>

## Prevention
Upgrade LiteLLM to 1.83.7 or later and Starlette to 1.0.1 or later. Block /mcp-rest/test/ at the edge and allow only expected hostnames in the Host header. Do not expose the proxy to the internet. Rotate every provider key the proxy stored if it was reachable. Hunt for subprocesses spawned by the LiteLLM process.

## Detections
- LiteLLM MCP test endpoint abuse (guidance) — Alert on requests to /mcp-rest/test/ with Host headers containing \[, \], /, ? or #, and on any child process of the LiteLLM proxy.

## Timeline
- First seen: 2026-11-14
- Last updated: 2026-11-16
- 2026-11-16 (SANS ISC): Honeypots record scans against /mcp-rest/test/tools/list using Host header variations of the public BadHost PoC.

## Tools
### AI tooling and models
- LiteLLM proxy / AI gateway (https://github.com/BerriAI/litellm), versions 1.74.2 through 1.83.6

### Other tooling
- Starlette 1.0.0 and older (BadHost, CVE-2026-48710)
- aiohttp-based scanner (User-Agent Python/3.14 aiohttp/3.14.5)

## Source notes
Request, headers and timing are from the SANS ISC diary. Affected versions, endpoints and chain are from Horizon3.ai. No attacker IPs were published. This is a different LiteLLM incident from socket-litellm-supply-chain-2026-10.

## Sources
- [Scans for LiteLLM/Starlette (CVE-2026-42271, CVE-2026-48710)](https://isc.sans.edu/diary/33522) — SANS Internet Storm Center
- [CVE-2026-42271 Chained with CVE-2026-48710: LiteLLM Unauthenticated Remote Code Execution](https://horizon3.ai/attack-research/vulnerabilities/cve-2026-42271-chained-with-cve-2026-48710/) — Horizon3.ai
