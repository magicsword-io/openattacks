# Malicious MCP servers on npm (ifasn, gadgethumans)

- ID: malicious-mcp-servers-npm-2026-11
- Reported: 2026-11-02
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/malicious-mcp-servers-npm-2026-11/

## Summary
Multiple malicious MCP servers published on npm. @ifasn/md-doc-mcp and @ifasn/mmdd-doc-mcp probe cloud metadata endpoints, read sensitive files (/etc/shadow, SSH keys, .env, Kubernetes tokens), and exfiltrate to 121.199.24.94. @ifasn/ms-doc-mcp versions 2.0.9 and 2.1.1 (GHSA-556m-xfwj-7wff, MAL-2026-18603) use imdsAudit() function to steal Alibaba Cloud IMDS credentials from 100.100.100.200 and exfiltrate them over MCP stdout. gadgethumans-mcp versions 1.0.10-1.0.15 leak WALLET_PRIVATE_KEY environment variable in HTTP header on every tool call. Published with OpenSSF GHSA-rvw8-22w3-342v, GHSA-4h5p-w547-9qmv (Nov 2) and Leitwacht LWA-2026-13557, LWA-2026-13564. Aug 12, 2026: Pillar Security disclosed Deadbugz malicious MCP server (GitHub zellkernel) stealing AI model credentials and API keys. Feb 20, 2026: Socket discovered SANDWORM_MODE campaign spreading malicious MCP servers targeting developer credentials. Attack exploits trust in MCP ecosystem and npm package distribution.

## Category
uncategorized

## Attribution
unknown

## AI involvement confidence
not assessed

## Attack flow
### publish: Malicious MCP servers published to npm (access)

Three packages published including @ifasn/md-doc-mcp, @ifasn/mmdd-doc-mcp, and gadgethumans-mcp 1.0.10-1.0.15

Evidence: <https://github.com/ossf/malicious-packages>

### install: User installs malicious MCP server (ai)

Developer or organization adds malicious package to MCP configuration

Evidence: <https://github.com/ossf/malicious-packages>

### probe: Server probes for sensitive information (execution)

ifasn packages probe cloud metadata endpoints and read /etc/shadow, SSH keys, .env, k8s tokens

Evidence: <https://github.com/ossf/malicious-packages>

### exfil-files: File-based credentials exfiltrated (impact)

ifasn packages send stolen credentials to 121.199.24.94

Evidence: <https://github.com/ossf/malicious-packages>

### exfil-header: Wallet keys leaked in headers (impact)

gadgethumans-mcp sends WALLET_PRIVATE_KEY in HTTP header on every tool call

Evidence: <https://github.com/ossf/malicious-packages>

### Connections

- publish -> install
- install -> probe
- probe -> exfil-files
- probe -> exfil-header

## MITRE ATLAS
- [AML.T0010.001](https://atlas.mitre.org/techniques/AML.T0010.001) AI Software — Attackers published malicious MCP servers through npm package ecosystem
  Evidence: <https://github.com/ossf/malicious-packages>
- [AML.T0011.001](https://atlas.mitre.org/techniques/AML.T0011.001) Malicious Package — Malicious MCP servers run persistently as agent tooling
  Evidence: <https://github.com/ossf/malicious-packages>
- [AML.T0055](https://atlas.mitre.org/techniques/AML.T0055) Unsecured Credentials — Packages exfiltrate credentials from environment variables and sensitive files
  Evidence: <https://github.com/ossf/malicious-packages>
- [AML.T0025](https://atlas.mitre.org/techniques/AML.T0025) Exfiltration via Cyber Means — MCP servers probe cloud metadata endpoints for credentials and instance information
  Evidence: <https://github.com/ossf/malicious-packages>

## Prevention
Verify MCP server sources before installation; review MCP server permissions and network access; monitor cloud metadata endpoint access; detect unauthorized file reads of sensitive paths; inspect HTTP headers for credential leakage; use MCP server sandboxing; inventory installed MCP packages

## Detections
No detections are recorded.

## Timeline
- First seen: 2026-02-20
- Last updated: 2026-11-05
- 2026-02-20 (Socket): SANDWORM_MODE malicious MCP server campaign disclosed
- 2026-08-12 (Pillar Security): Deadbugz malicious MCP server (GitHub zellkernel) stealing AI credentials
- 2026-11-02 (OpenSSF, Leitwacht): @ifasn/md-doc-mcp, @ifasn/mmdd-doc-mcp, gadgethumans-mcp malicious packages disclosed
- 2026-11-04 (GitHub Advisory Database): @ifasn/ms-doc-mcp versions 2.0.9 and 2.1.1 disclosed stealing Alibaba Cloud IMDS credentials via imdsAudit() (GHSA-556m-xfwj-7wff)

## Tools
### AI tooling and models
- MCP servers
- npm packages (@ifasn/md-doc-mcp, @ifasn/mmdd-doc-mcp, @ifasn/ms-doc-mcp, gadgethumans-mcp)

### Other tooling
- Cloud metadata probing (AWS, GCP, Azure)
- File system access (/etc/shadow, SSH keys, .env, k8s tokens)
- HTTP exfiltration

### MagicSword projects
- [LOLSkills](https://lolskills.io)

## Sources
- [OpenSSF Malicious Packages repository](https://github.com/ossf/malicious-packages) — OpenSSF
- [Deadbugz: Malicious MCP Server on npm](https://www.pillar.io/blog/deadbugz-malicious-mcp-server-aug-2026) — Pillar Security
- [Socket: MCP Security and the SANDWORM_MODE campaign](https://socket.dev/glossary/mcp-security) — Socket
- [@ifasn/ms-doc-mcp Malicious Package (MAL-2026-18603)](https://github.com/advisories/GHSA-556m-xfwj-7wff) — GitHub Advisory Database
