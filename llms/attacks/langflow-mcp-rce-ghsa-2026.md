# Langflow MCP-config RCE (GHSA-7w94-79vh-5mr2, GHSA-w794-rj3p-xv45)

- ID: langflow-mcp-rce-ghsa-2026
- Reported: 2026-10-11
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/langflow-mcp-rce-ghsa-2026/

## Summary
GHSA-7w94-79vh-5mr2 (CVE-2026-105697) and GHSA-w794-rj3p-xv45: Authenticated Langflow users can achieve RCE by adding MCP server with Stdio transport. User-supplied command field passed directly to bash -c 'exec {command}' with zero validation, no allowlisting, no sandboxing. Env field allows arbitrary environment variable injection (LD_PRELOAD, PATH override). Command executes when server list fetched with action_count=true - happens automatically in UI MCP settings page. Affects <1.9.0 (GHSA-7w94-79vh-5mr2) and <1.10.3 (GHSA-w794-rj3p-xv45). Default LANGFLOW_AUTO_LOGIN=true hands out token without credentials. Previdian honeypots recorded 1,423 exploitation attempts from 27 IPs (Belgium, China, Germany, Hong Kong, Japan, Nigeria, Philippines, Russia, Seychelles, Singapore, South Korea, Taiwan, Tanzania, US, Vietnam) beginning Sep 19, 2026. Attackers first checked auto-login, then brute-forced credentials. Fixed in 1.9.0 (command allowlist) and 1.10.3 (full policy enforcement, removed bash wrapper). GitHub: github.com/langflow-ai/langflow.

## Category
attacks-on-ai

## Attribution
Multiple attackers from 27 countries; financially motivated/opportunistic exploitation

- Actor: Multiple opportunistic attackers
- Country: Multiple (27 countries)
- Motivation: financially-motivated
- Attributed by: Previdian, VulnCheck
- Confidence: high

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Authenticated user access (or LANGFLOW_AUTO_LOGIN=true provides token without credentials); exploitation via POST/PATCH /api/v2/mcp/servers/{server_name} or embedded flow configs
- Victims and sectors: Langflow installations; multiple internet-facing vulnerable instances found; 1,423 exploitation attempts against Previdian honeypots from 27 countries
- Regions: Multiple regions
- Region notes: unknown
- Scale and metrics: 1,423 exploitation attempts against Previdian honeypots from 27 IPs (Sep 19-Oct 2026); 333 attempts on Oct 11 alone; first attempts Sep 19 (2+ weeks before CVE publication Oct 5); dramatic increase post-CVE

## Attack flow
### auth: Obtain authentication (access)

Default LANGFLOW_AUTO_LOGIN=true provides token without credentials via GET /api/v1/auto_login; or brute-force credentials if auto-login disabled

Evidence: <https://github.com/langflow-ai/langflow/security/advisories/GHSA-w794-rj3p-xv45>

### inject-command: Add malicious MCP server (ai)

POST/PATCH /api/v2/mcp/servers/{server_name} with Stdio transport; command field contains arbitrary OS command (reverse shell, file operations, etc.); env field can inject LD_PRELOAD, PATH override

Evidence: <https://github.com/langflow-ai/langflow/security/advisories/GHSA-7w94-79vh-5mr2>

### trigger: Trigger execution (execution)

Command executes automatically when GET /api/v2/mcp/servers?action_count=true (happens when anyone navigates to MCP settings page); re-executes every time list loaded; persistent backdoor

Evidence: <https://github.com/langflow-ai/langflow/security/advisories/GHSA-7w94-79vh-5mr2>

### rce: Remote code execution (impact)

User-supplied command wrapped in bash -c 'exec {command}' and executed; no validation, allowlisting, or sandboxing; runs with Langflow process privileges; full server compromise possible

Evidence: <https://github.com/langflow-ai/langflow/security/advisories/GHSA-7w94-79vh-5mr2>

### Connections

- auth -> inject-command
- inject-command -> trigger
- trigger -> rce

## MITRE ATLAS
- [AML.T0034](https://atlas.mitre.org/techniques/AML.T0034) Cost Harvesting — Exploitation of vulnerability in AI workflow platform (Langflow) via MCP server misconfiguration
  Evidence: <https://github.com/langflow-ai/langflow/security/advisories/GHSA-7w94-79vh-5mr2>

## Prevention
Upgrade to Langflow 1.10.3+; disable LANGFLOW_AUTO_LOGIN; enforce strong unique passwords; review MCP server configurations; monitor /api/v2/mcp/servers/ API access; check for unexpected command/env entries; network segmentation; principle of least privilege

## Detections
- Monitor MCP server API endpoints (guidance) — Monitor POST/PATCH requests to /api/v2/mcp/servers/ endpoints for suspicious command parameters; alert on bash -c execution patterns, environment variable injection (LD_PRELOAD, PATH overrides), and auto-login token generation from unexpected IPs
- File system monitoring (guidance) — Monitor Langflow process for execution of child processes via bash; alert on unexpected shell command execution from Langflow worker processes

## Timeline
- First seen: 2026-09-19
- Last updated: 2026-11-04
- 2026-09-19 (Previdian honeypots): First exploitation attempts observed, 2+ weeks before CVE publication
- 2026-10-05 (GitHub Security Advisory): CVE published
- 2026-10-11 (Previdian, The Hacker News): 333 exploitation attempts on this day alone; public disclosure

## Tools
### AI tooling and models
- Langflow AI workflow platform
- Model Context Protocol (MCP) Stdio transport

### Other tooling
- bash command execution
- Environment variable injection (LD_PRELOAD, NODE_OPTIONS, PYTHONPATH, BASH_ENV)

## Source notes
Two GitHub Security Advisories (GHSA-7w94-79vh-5mr2 for <1.9.0, GHSA-w794-rj3p-xv45 for <1.10.3); Previdian observed exploitation 2+ weeks before public CVE; VulnCheck analysis of AI stack vulnerabilities. Detection: monitor Langflow API /api/v2/mcp/servers/ for suspicious commands, review MCP Stdio configs, check for bash -c execution, monitor env var injection patterns (LD_PRELOAD, PATH), alert on auto-login token requests from unexpected IPs.

## Sources
- [GHSA-7w94-79vh-5mr2: Authenticated RCE via MCP Stdio transport](https://github.com/langflow-ai/langflow/security/advisories/GHSA-7w94-79vh-5mr2)
- [GHSA-w794-rj3p-xv45: OS command injection RCE via MCP stdio](https://github.com/langflow-ai/langflow/security/advisories/GHSA-w794-rj3p-xv45)
- [Langflow Critical Authenticated RCE Flaw Targeted](https://thehackernews.com/2026/10/langflows-critical-authenticated-rce.html)
- [VulnCheck - Pwning the AI Stack](https://www.vulncheck.com/blog/pwning-the-ai-stack)
