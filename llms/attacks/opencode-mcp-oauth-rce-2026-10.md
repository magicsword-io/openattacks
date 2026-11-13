# opencode remote MCP OAuth RCE

- ID: opencode-mcp-oauth-rce-2026-10
- Reported: 2026-10-19
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/opencode-mcp-oauth-rce-2026-10/

## Summary
Malicious or compromised remote MCP server returns 401 and OAuth discovery with attacker-controlled authorization_endpoint. opencode passes that URL to npm open; on Windows/WSL open 10.x builds a PowerShell -EncodedCommand without escaping the target, so $(...) in an https URL runs before the browser launches. No prompt injection required.

## Category
attacks-on-ai

## Attribution
Vulnerability research (no in-the-wild campaign named)

- Actor: Vulnerability research (no in-the-wild campaign named)

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Developer connects coding agent to attacker-controlled or later-compromised remote MCP server
- Victims and sectors: Windows and WSL developers using opencode (~3M weekly npm downloads cited by Pillar)
- Regions: unknown
- Region notes: unknown
- Scale and metrics: Fixed in 1.18.33 (2026-09-28) without CVE/advisory; proposed CVSS 9.8

## Attack flow
### step-1: Developer connects a remote MCP server (access)

The server is attacker-controlled or later compromised.

Evidence: <https://www.pillar.security/blog/open-and-shut-remote-code-execution-in-opencode-via-mcp-oauth>

### step-2: OAuth discovery supplies an attacker URL (ai)

A 401 response leads to an attacker-controlled authorization endpoint.

Evidence: <https://www.pillar.security/blog/open-and-shut-remote-code-execution-in-opencode-via-mcp-oauth>

### step-3: URL enters PowerShell through open() (execution)

Affected Windows or WSL browser-opening code fails to escape the target.

Evidence: <https://www.pillar.security/blog/open-and-shut-remote-code-execution-in-opencode-via-mcp-oauth>

### step-4: Commands execute before the browser opens (impact)

The injection occurs in the URL-opening path without requiring prompt injection.

Evidence: <https://www.pillar.security/blog/open-and-shut-remote-code-execution-in-opencode-via-mcp-oauth>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
No ATLAS mapping is recorded.

## Prevention
Upgrade opencode; inventory installations (no CVE for scanners); pull unvetted remote MCP; argv not shell for URLs; MagicSword prevent unapproved second-stage binaries

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in opencode remote MCP OAuth RCE. Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- [opencode](https://github.com/anomalyco/opencode) / [opencode-ai](https://github.com/anomalyco/opencode) 1.0.137–1.18.32
- MCP OAuth discovery

### Other tooling
- [npm open@10.1.2](https://github.com/sindresorhus/open)
- [PowerShell](https://github.com/PowerShell/PowerShell)
- related class CVEs: CVE-2025-6514 [mcp-remote](https://github.com/punkpeye/mcp-remote), CVE-2025-58062 [openmcp-client](https://github.com/LSTM-Kirigaya/openmcp-client), CVE-2025-10619 [sequa-mcp](https://github.com/sequa-ai/sequa-mcp)

## Source notes
unknown

## Sources
- <https://www.pillar.security/blog/open-and-shut-remote-code-execution-in-opencode-via-mcp-oauth>
