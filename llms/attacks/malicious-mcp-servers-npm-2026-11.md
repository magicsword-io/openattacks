# Malicious MCP servers on npm (ifasn, gadgethumans)

- ID: malicious-mcp-servers-npm-2026-11
- Reported: 2026-11-02
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/malicious-mcp-servers-npm-2026-11/

## Summary
Multiple malicious MCP servers published on npm. @ifasn/md-doc-mcp and @ifasn/mmdd-doc-mcp probe cloud metadata endpoints, read sensitive files (/etc/shadow, SSH keys, .env, Kubernetes tokens), and exfiltrate to 121.199.24.94. @ifasn/ms-doc-mcp versions 2.0.9 and 2.1.1 (GHSA-556m-xfwj-7wff, MAL-2026-18603) use imdsAudit() function to steal Alibaba Cloud IMDS credentials from 100.100.100.200 and exfiltrate them over MCP stdout. gadgethumans-mcp versions 1.0.10-1.0.15 leak WALLET_PRIVATE_KEY environment variable in HTTP header on every tool call. Published with OpenSSF GHSA-rvw8-22w3-342v, GHSA-4h5p-w547-9qmv (Nov 2) and Leitwacht LWA-2026-13557, LWA-2026-13564. Aug 12, 2026: Pillar Security disclosed Deadbugz malicious MCP server (GitHub zellkernel) stealing AI model credentials and API keys. Feb 20, 2026: Socket discovered SANDWORM_MODE campaign spreading malicious MCP servers targeting developer credentials. November 9-12 additions: @rfewqa-fes/mnm-doc-mcp 1.0.0 (MAL-2026-19148, Amazon Inspector) ships an inert MCP stub in index.js. Its package.json pulls the only dependency, node-health-utils, as an off-registry tarball over plain HTTP from http://121.199.24.94/dl/health-utils-1.0.0.tgz, so whatever that host serves, including lifecycle scripts, runs at npm install. package.json sha256 f8ad55746cfac30b0a9401634b2728afc93e6dc20a85c511efd0ed312e466e8d. Package tarball sha1 f3ad664b487c4041e7e66e5744656ed44e1a6f6a. GitHub also marked @lemili9804/mcp-weather-server 1.0.3 and 1.0.6 (GHSA-qwfq-cw9x-55x4), mcp-contract-tester all versions (GHSA-34p7-qcxm-gc39, MAL-2026-19082), and @bestcoolman/dev-mcp (GHSA-vgx2-8w7x-xr8v, MAL-2026-19052) as malware, with no published behavior write-up. Attack exploits trust in the MCP ecosystem and npm package distribution.

## Category
attacks-on-ai

## Attribution
unknown

- Actor: Unknown npm publishers (ifasn, gadgethumans, rfewqa-fes, lemili9804, bestcoolman, zellkernel)
- Country: Unknown
- Motivation: cybercrime
- Attributed by: OpenSSF, Leitwacht, GitHub Advisory Database, Amazon Inspector, Pillar Security, Socket
- Confidence: medium

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: User installs malicious MCP server from npm
- Victims and sectors: AI agent developers, organizations using MCP servers
- Regions: Multiple regions
- Region notes: Multiple regions reflects global npm and MCP user base
- Scale and metrics: Multiple malicious MCP packages identified (ifasn, gadgethumans, Deadbugz, SANDWORM_MODE); exact installation count unknown

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
- [Suspicious PowerShell from npm Package Install](https://github.com/elastic/detection-rules/blob/main/rules/windows/execution_suspicious_powershell_from_npm_install.toml) (elastic) — Windows. PowerShell started from an npm install script. Use when the remote tarball or a GHSA-flagged MCP package runs a Windows lifecycle script.
- Plain-HTTP tarball and GHSA-only packages (guidance) — Also block http://121.199.24.94/dl/health-utils-1.0.0.tgz and alert on package.json dependencies that are bare http:// tarball URLs. @lemili9804/mcp-weather-server, mcp-contract-tester, and @bestcoolman/dev-mcp are confirmed malicious by GitHub but have no published behavior, so no tighter rule is cited for them.

## Timeline
- First seen: 2026-02-20
- Last updated: 2026-11-12
- 2026-02-20 (Socket): SANDWORM_MODE malicious MCP server campaign disclosed
- 2026-08-12 (Pillar Security): Deadbugz malicious MCP server (GitHub zellkernel) stealing AI credentials
- 2026-11-02 (OpenSSF, Leitwacht): @ifasn/md-doc-mcp, @ifasn/mmdd-doc-mcp, gadgethumans-mcp malicious packages disclosed
- 2026-11-04 (GitHub Advisory Database): @ifasn/ms-doc-mcp versions 2.0.9 and 2.1.1 disclosed stealing Alibaba Cloud IMDS credentials via imdsAudit() (GHSA-556m-xfwj-7wff)
- 2026-11-09 (GitHub Advisory Database): @bestcoolman/dev-mcp marked malware (GHSA-vgx2-8w7x-xr8v, MAL-2026-19052). No behavior write-up published.
- 2026-11-10 (GitHub Advisory Database): @lemili9804/mcp-weather-server 1.0.3 and 1.0.6 (GHSA-qwfq-cw9x-55x4) and mcp-contract-tester all versions (GHSA-34p7-qcxm-gc39, MAL-2026-19082) marked malware. No behavior write-up published.
- 2026-11-12 (Amazon Inspector): @rfewqa-fes/mnm-doc-mcp 1.0.0 (MAL-2026-19148) pulls node-health-utils over plain HTTP from 121.199.24.94. index.js is an inert MCP stub.

## Tools
### AI tooling and models
- MCP servers
- npm packages (@ifasn/md-doc-mcp, @ifasn/mmdd-doc-mcp, @ifasn/ms-doc-mcp, gadgethumans-mcp, @rfewqa-fes/mnm-doc-mcp, @lemili9804/mcp-weather-server, mcp-contract-tester, @bestcoolman/dev-mcp)

### Other tooling
- Cloud metadata probing (AWS, GCP, Azure)
- File system access (/etc/shadow, SSH keys, .env, k8s tokens)
- HTTP exfiltration

### MagicSword projects
- [LOLSkills](https://lolskills.io)

## Source notes
OpenSSF GHSA-rvw8-22w3-342v and GHSA-4h5p-w547-9qmv published Nov 2 2026; Leitwacht advisories LWA-2026-13557 and LWA-2026-13564; GitHub advisory GHSA-556m-xfwj-7wff (MAL-2026-18603) for @ifasn/ms-doc-mcp

Relevant detection rules:
- Monitor access to cloud metadata endpoints (169.254.169.254, 100.100.100.200 (Alibaba), metadata.google.internal, etc.)
- Alert on unauthorized reads of /etc/shadow, ~/.ssh/id_rsa, ~/.ssh/id_ed25519, .env files
- Detect access to Kubernetes service account tokens (/var/run/secrets/kubernetes.io/)
- Monitor HTTP headers for sensitive environment variable leakage (WALLET_PRIVATE_KEY, AWS_SECRET_ACCESS_KEY, etc.)
- Alert on npm package installations from unverified sources
- Note: Cloud metadata access typically detected via network monitoring or instance-level audit logs (CloudTrail, Azure Monitor, GCP Cloud Logging). File access requires host-based file integrity monitoring.

## Sources
- [OpenSSF Malicious Packages repository](https://github.com/ossf/malicious-packages) — OpenSSF
- [Deadbugz: Malicious MCP Server on npm](https://www.pillar.io/blog/deadbugz-malicious-mcp-server-aug-2026) — Pillar Security
- [Socket: MCP Security and the SANDWORM_MODE campaign](https://socket.dev/glossary/mcp-security) — Socket
- [@ifasn/ms-doc-mcp Malicious Package (MAL-2026-18603)](https://github.com/advisories/GHSA-556m-xfwj-7wff) — GitHub Advisory Database
- [MAL-2026-19148: malicious code in @rfewqa-fes/mnm-doc-mcp](https://osv.dev/vulnerability/MAL-2026-19148) — Amazon Inspector / OSV
- [@lemili9804/mcp-weather-server malware advisory](https://github.com/advisories/GHSA-qwfq-cw9x-55x4) — GitHub Advisory Database
- [mcp-contract-tester malware advisory (MAL-2026-19082)](https://github.com/advisories/GHSA-34p7-qcxm-gc39) — GitHub Advisory Database
- [@bestcoolman/dev-mcp malware advisory (MAL-2026-19052)](https://github.com/advisories/GHSA-vgx2-8w7x-xr8v) — GitHub Advisory Database
- [Roundup of November 2026 malicious npm MCP servers](https://vibevulns.com/issues/malicious-npm-mcp-servers-mnm-doc-mcp-weather-contract-tester-2026-11/) — VibeVulns
