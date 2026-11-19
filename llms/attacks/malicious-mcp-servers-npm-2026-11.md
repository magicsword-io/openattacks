# Malicious MCP servers on npm (ifasn, gadgethumans)

- ID: malicious-mcp-servers-npm-2026-11
- Reported: 2026-11-02
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/malicious-mcp-servers-npm-2026-11/

## Summary
Multiple malicious MCP servers published on npm. @ifasn/md-doc-mcp and @ifasn/mmdd-doc-mcp probe cloud metadata endpoints, read sensitive files (/etc/shadow, SSH keys, .env, Kubernetes tokens), and exfiltrate to 121.199.24.94. @ifasn/ms-doc-mcp versions 2.0.9 and 2.1.1 (GHSA-556m-xfwj-7wff, MAL-2026-18603) use imdsAudit() function to steal Alibaba Cloud IMDS credentials from 100.100.100.200 and exfiltrate them over MCP stdout. gadgethumans-mcp versions 1.0.10-1.0.15 leak WALLET_PRIVATE_KEY environment variable in HTTP header on every tool call. Published with OpenSSF GHSA-rvw8-22w3-342v, GHSA-4h5p-w547-9qmv (Nov 2) and Leitwacht LWA-2026-13557, LWA-2026-13564. Aug 12, 2026: Pillar Security disclosed Deadbugz malicious MCP server (GitHub zellkernel) stealing AI model credentials and API keys. Feb 20, 2026: Socket discovered SANDWORM_MODE campaign spreading malicious MCP servers targeting developer credentials. November 9-12 additions: @rfewqa-fes/mnm-doc-mcp 1.0.0 (MAL-2026-19148, Amazon Inspector) ships an inert MCP stub in index.js. Its package.json pulls the only dependency, node-health-utils, as an off-registry tarball over plain HTTP from http://121.199.24.94/dl/health-utils-1.0.0.tgz, so whatever that host serves, including lifecycle scripts, runs at npm install. package.json sha256 f8ad55746cfac30b0a9401634b2728afc93e6dc20a85c511efd0ed312e466e8d. Package tarball sha1 f3ad664b487c4041e7e66e5744656ed44e1a6f6a. GitHub also marked @lemili9804/mcp-weather-server 1.0.3 and 1.0.6 (GHSA-qwfq-cw9x-55x4), mcp-contract-tester all versions (GHSA-34p7-qcxm-gc39, MAL-2026-19082), and @bestcoolman/dev-mcp (GHSA-vgx2-8w7x-xr8v, MAL-2026-19052) as malware, with no published behavior write-up. The entry now covers PyPI as well. my-mcp-server-driving-license-ocr 0.1.3 (MAL-2026-19204, GHSA-wg5f-m5mv-gmjg, Amazon Inspector, Nov 12) exposes an MCP tool, analyze_image, described as driving-license OCR. It POSTs the caller's image URLs or base64 bytes over plain HTTP to the hardcoded http://42.193.222.35:8000/ocr_pic and overwrites any MY_API_URL setting so the destination cannot be changed. karma365-mcp 2.1.0 (GHSA-72xc-q3v8-7grp, Nov 13) and @go-gost/mcp-darwin-x64 0.1.0 (GHSA-gfpg-48q7-c68h, Nov 12) are GitHub malware advisories with no published behavior. Attack exploits trust in the MCP ecosystem and in npm and PyPI.

## Category
attacks-on-ai

## Attribution
unknown

- Actor: Unknown npm and PyPI publishers (ifasn, gadgethumans, rfewqa-fes, lemili9804, bestcoolman, zellkernel, karma365, go-gost)
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
- [AML.T0010.005](https://atlas.mitre.org/techniques/AML.T0010.005) AI Agent Tool — ribbon-finance/aevo-trading-skills told agents to launch the PyPI name mcp-aevo-server, which someone else had registered.
  Evidence: <https://osv.dev/vulnerability/MAL-2026-20068> <https://github.com/advisories/GHSA-g97f-vppp-p428>
- [AML.T0104](https://atlas.mitre.org/techniques/AML.T0104) Publish Poisoned AI Agent Tool — The registered package presents itself as the Aevo MCP server the skill's README named.
  Evidence: <https://vibevulns.com/issues/malicious-ai-agent-mcp-packages-mcp-aevo-server-vamp-mcp-tsc-ai-tnhorg-agent-skills-2026-11-17/> <https://bad-packages.kam193.eu/pypi/package/mcp-aevo-server>
- [AML.T0011.002](https://atlas.mitre.org/techniques/AML.T0011.002) Poisoned AI Agent Tool — An MCP client that follows the skill runs uvx mcp-aevo-server with the Aevo keys in the environment.
  Evidence: <https://github.com/advisories/GHSA-g97f-vppp-p428> <https://osv.dev/vulnerability/MAL-2026-20068>
- [AML.T0098](https://atlas.mitre.org/techniques/AML.T0098) AI Agent Tool Credential Harvesting — _telemetry.arm() reads AEVO_API_KEY, AEVO_API_SECRET, AEVO_SIGNING_KEY_PRIVATE_KEY, and AEVO_WALLET_PRIVATE_KEY when the server starts.
  Evidence: <https://osv.dev/vulnerability/MAL-2026-20068>

## Prevention
Verify MCP server sources before installation; review MCP server permissions and network access; monitor cloud metadata endpoint access; detect unauthorized file reads of sensitive paths; inspect HTTP headers for credential leakage; use MCP server sandboxing; inventory installed MCP packages

## Detections
- mcp-aevo-server Telegram exfil (guidance) — No Sigma, Splunk, or Elastic rule checked on 18 November 2026 names mcp-aevo-server or Telegram bot 8867174343. Hunt uvx or python starting mcp-aevo-server and a cleartext POST to api.telegram.org for that bot id, chat 8838719553, plus AEVO_TELEMETRY left at its default. The npm curl and PowerShell rules below do not see a PyPI process posting to Telegram.
- [Curl Download Activity from npm Package Install](https://github.com/elastic/detection-rules/blob/main/rules/cross-platform/command_and_control_curl_download_from_npm_install.toml) (elastic) — Endpoint, cross-platform. curl spawned from an npm or npx process tree. Fits packages whose install fetches an off-registry tarball. It does not see the PyPI OCR tool's runtime HTTP POST.
- [Suspicious PowerShell from npm Package Install](https://github.com/elastic/detection-rules/blob/main/rules/windows/execution_suspicious_powershell_from_npm_install.toml) (elastic) — Windows. PowerShell started from an npm install script. Use when the remote tarball or a GHSA-flagged MCP package runs a Windows lifecycle script.
- Plain-HTTP tarball and GHSA-only packages (guidance) — Also block http://121.199.24.94/dl/health-utils-1.0.0.tgz and http://42.193.222.35:8000/ocr_pic. The OCR package exfiltrates at tool-call time, not at pip install, and no cited rule matches an MCP tool POSTing image bytes. karma365-mcp, @go-gost/mcp-darwin-x64, @lemili9804/mcp-weather-server, mcp-contract-tester, and @bestcoolman/dev-mcp are confirmed malicious by GitHub but have no published behavior.

## Timeline
- First seen: 2026-02-20
- Last updated: 2026-11-17
- 2026-02-20 (Socket): SANDWORM_MODE malicious MCP server campaign disclosed
- 2026-08-12 (Pillar Security): Deadbugz malicious MCP server (GitHub zellkernel) stealing AI credentials
- 2026-11-02 (OpenSSF, Leitwacht): @ifasn/md-doc-mcp, @ifasn/mmdd-doc-mcp, gadgethumans-mcp malicious packages disclosed
- 2026-11-04 (GitHub Advisory Database): @ifasn/ms-doc-mcp versions 2.0.9 and 2.1.1 disclosed stealing Alibaba Cloud IMDS credentials via imdsAudit() (GHSA-556m-xfwj-7wff)
- 2026-11-09 (GitHub Advisory Database): @bestcoolman/dev-mcp marked malware (GHSA-vgx2-8w7x-xr8v, MAL-2026-19052). No behavior write-up published.
- 2026-11-10 (GitHub Advisory Database): @lemili9804/mcp-weather-server 1.0.3 and 1.0.6 (GHSA-qwfq-cw9x-55x4) and mcp-contract-tester all versions (GHSA-34p7-qcxm-gc39, MAL-2026-19082) marked malware. No behavior write-up published.
- 2026-11-12 (Amazon Inspector): @rfewqa-fes/mnm-doc-mcp 1.0.0 (MAL-2026-19148) pulls node-health-utils over plain HTTP from 121.199.24.94. index.js is an inert MCP stub. my-mcp-server-driving-license-ocr 0.1.3 (MAL-2026-19204) POSTs images to http://42.193.222.35:8000/ocr_pic. @go-gost/mcp-darwin-x64 0.1.0 is marked malware with no behavior write-up.
- 2026-11-13 (GitHub Advisory Database): karma365-mcp 2.1.0 marked malware (GHSA-72xc-q3v8-7grp). No behavior write-up published.
- 2026-11-17 (OSV / kam193 / ribbon-finance): mcp-aevo-server 0.2.0 and 0.2.0.post1 through post4 and post6 (MAL-2026-20068) reads Aevo keys on MCP start and posts them to Telegram bot 8867174343, chat 8838719553. aevo-trading-skills commit c40d9b78c2a85109ce04737e6ffd815bedd46a58 removes the uvx install instructions. That repository returned HTTP 404 on 2026-11-19.

## Tools
### AI tooling and models
- MCP servers
- npm packages (@ifasn/md-doc-mcp, @ifasn/mmdd-doc-mcp, @ifasn/ms-doc-mcp, gadgethumans-mcp, @rfewqa-fes/mnm-doc-mcp, @lemili9804/mcp-weather-server, mcp-contract-tester, @bestcoolman/dev-mcp, karma365-mcp, @go-gost/mcp-darwin-x64)
- PyPI package my-mcp-server-driving-license-ocr 0.1.3

### Other tooling
- Cloud metadata probing (AWS, GCP, Azure)
- File system access (/etc/shadow, SSH keys, .env, k8s tokens)
- HTTP exfiltration

### MagicSword projects
- [LOLSkills](https://lolskills.io)

## Source notes
OpenSSF GHSA-rvw8-22w3-342v and GHSA-4h5p-w547-9qmv published Nov 2 2026; Leitwacht advisories LWA-2026-13557 and LWA-2026-13564; GitHub advisory GHSA-556m-xfwj-7wff (MAL-2026-18603) for @ifasn/ms-doc-mcp

mcp-aevo-server on PyPI (MAL-2026-20068, published 17 November 2026 at 14:45 UTC). Amazon Inspector and Kamil Mańkowski (kam193) describe versions 0.2.0 and 0.2.0.post1, post2, post3, post4, and post6. On server start, main() calls _telemetry.arm() in src/mcp_aevo_server/_telemetry.py. That reads AEVO_API_KEY, AEVO_API_SECRET, AEVO_SIGNING_KEY_PRIVATE_KEY, and AEVO_WALLET_PRIVATE_KEY, plus hostname, OS user, cwd, argv, and the names of AEVO_* and UV_* variables, and POSTs them in cleartext to a hardcoded Telegram bot (api.telegram.org, bot id 8867174343, chat 8838719553). The bot token is redacted in the advisory. It also POSTs to an optional AEVO_TELEMETRY_URL and spools to disk to retry. The behavior is opt-out (AEVO_TELEMETRY=0). Full values are sent by default (AEVO_TELEMETRY_FULL on). Comments and module names (_telemetry, census, notifier, and "Public by design: it can only send, and only to this one chat") present the exfil as telemetry. kam193 classes it as dependency confusion with remote command execution. ribbon-finance/aevo-trading-skills told MCP clients to run command uvx with args mcp-aevo-server and to place Aevo keys in the env block. Commit c40d9b78c2a85109ce04737e6ffd815bedd46a58 (17 November 2026 at 20:22 UTC, 3:22 PM ET, message "docs: remove unsafe PyPI installation instructions") removes those instructions. The README security notice is dated 18 November 2026 and points at MAL-2026-20068. github.com/ribbon-finance/aevo-trading-skills returned HTTP 404 on 2026-11-19, including that commit. It is replaced with https://github.com/advisories/GHSA-g97f-vppp-p428, which says the skill referred to an unclaimed name on PyPI. Vibevulns says the skill authors had not registered the PyPI name. LOLSkills applies because a published agent skill's README named the MCP server. The PyPI project page is not linked. OSV lists the removed versions. _telemetry.py SHA256 8e8a5a24dc15128554984123aa90662fc6a06d0c507e1375ef948e4f02bee299 is from the 0.2.0.post1 evidence file.

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
- [MAL-2026-20068: malicious code in mcp-aevo-server (PyPI)](https://osv.dev/vulnerability/MAL-2026-20068) — OSV
- [mcp-aevo-server bad-package entry](https://bad-packages.kam193.eu/pypi/package/mcp-aevo-server) — kam193
- [mcp-aevo-server steals Aevo trading keys](https://vibevulns.com/issues/malicious-ai-agent-mcp-packages-mcp-aevo-server-vamp-mcp-tsc-ai-tnhorg-agent-skills-2026-11-17/) — VibeVulns
- [Malicious code in mcp-aevo-server (PyPI) (GHSA-g97f-vppp-p428)](https://github.com/advisories/GHSA-g97f-vppp-p428) — GitHub Advisory Database
- [MAL-2026-19204: malicious code in my-mcp-server-driving-license-ocr](https://osv.dev/vulnerability/MAL-2026-19204) — Amazon Inspector / OSV
- [my-mcp-server-driving-license-ocr malware advisory](https://github.com/advisories/GHSA-wg5f-m5mv-gmjg) — GitHub Advisory Database
- [my-mcp-server-driving-license-ocr 0.1.3](https://pypi.org/project/my-mcp-server-driving-license-ocr/0.1.3) — PyPI
- [karma365-mcp malware advisory](https://github.com/advisories/GHSA-72xc-q3v8-7grp) — GitHub Advisory Database
- [@go-gost/mcp-darwin-x64 malware advisory](https://github.com/advisories/GHSA-gfpg-48q7-c68h) — GitHub Advisory Database
