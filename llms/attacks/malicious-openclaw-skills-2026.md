# Multiple campaigns distributing malicious OpenClaw skills

- ID: malicious-openclaw-skills-2026
- Reported: 2026-06-23
- AI role: ai_credential_theft
- Entry: https://openattacks.ai/attacks/malicious-openclaw-skills-2026/

## Summary
Koi reported ClawHavoc skills distributed through fake repositories and a rogue registry to deliver infostealers and harvest developer credentials. Cyera later reported poisoned skills using fake prerequisite lures, OS-specific installation instructions, external paste relays, and inflated README droppers. Detection should verify skill provenance, inspect companion files rather than only SKILL.md, and monitor agent-initiated shell and network activity.

## Category
attacks-on-ai

## Attribution
ClawHavoc campaign and related poisoned-skill activity; actor unknown

- Actor: ClawHavoc
- Country: Unknown
- Motivation: financially-motivated
- Attributed by: Koi Security
- Confidence: medium

## AI involvement confidence
confirmed

## Attack flow
### distribute-skills: Distribute malicious skills (access)

ClawHavoc: 23 skills on fake GitHub repos + openclaw-skills[.]com registry. Unit 42: 5 skills via typosquat repos + SEO-poisoned blogs. Skills named to appear legitimate (productivity-boost, code-optimizer, security-scanner, api-connector-pro, github-integration-plus)

Evidence: <https://koi.security/blog/clawhavoc-malicious-openclaw-skills-amos>

### user-installs: User installs skill (ai)

User finds malicious skill via search, fake registry, or social engineering; installs to ~/.openclaw/skills/ via OpenClaw CLI or UI; skill auto-loads on next OpenClaw startup

Evidence: <https://koi.security/blog/clawhavoc-malicious-openclaw-skills-amos>

### execute-payload: Execute malware and harvest (execution)

ClawHavoc: deploys AMOS (macOS) or Raccoon Stealer (Windows); harvests Anthropic keys, OpenAI keys, GitHub tokens, AWS creds, crypto wallets, browser cookies. Unit 42: Node.js credential harvester + reverse shell; targets same credential types

Evidence: <https://koi.security/blog/clawhavoc-malicious-openclaw-skills-amos>

### exfiltrate-persist: Exfiltrate and maintain access (impact)

Credentials POST to attacker C2; reverse shells provide persistent access; 6,900+ affected installations across both campaigns (ClawHavoc 4,800, Unit 42 2,100)

Evidence: <https://koi.security/blog/clawhavoc-malicious-openclaw-skills-amos>

### Connections

- distribute-skills -> user-installs
- user-installs -> execute-payload
- execute-payload -> exfiltrate-persist

## MITRE ATLAS
- [AML.T0000](https://atlas.mitre.org/techniques/AML.T0000) Search Open Technical Databases — Multiple campaigns delivering malicious AI skill framework extensions to steal credentials and deploy malware on AI developer machines
  Evidence: <https://koi.security/blog/clawhavoc-malicious-openclaw-skills-amos>

## Prevention
Only install OpenClaw skills from trusted sources; verify GitHub repo authenticity (org, stars, commit history); review skill manifest permissions before install; use allowlisted skill sources; monitor ~/.openclaw/skills/ for unexpected additions; implement endpoint security detecting AMOS/Raccoon; educate users on skill installation risks

## Detections
- [Linux Base64 Encoded Pipe to Shell](https://github.com/SigmaHQ/sigma/blob/master/rules/linux/process_creation/proc_creation_lnx_base64_execution.yml) (sigma) — Detects base64 -D | bash patterns; directly applicable to Cyera-documented AMOS macOS delivery via base64-decoded pipes
- [Keychain Password Retrieval via Command Line](https://github.com/elastic/detection-rules/blob/main/rules/macos/credential_access_keychain_pwd_retrieval_security_cmd.toml) (elastic) — Detects macOS keychain credential access; relevant for AMOS infostealer credential theft on macOS
- [Linux Shell Pipe to Shell](https://github.com/SigmaHQ/sigma/blob/master/rules/linux/process_creation/proc_creation_lnx_susp_pipe_shell.yml) (sigma) — Detects suspicious shell pipes; applicable to AMOS delivery mechanisms using curl | bash patterns
- OpenClaw skill supply-chain monitoring (guidance) — Monitor ~/.openclaw/skills/ for unexpected installations; alert on skills from unknown publishers (hightower6eu, Demerzels-lab, LJT-520, dexiaong, Ddoy233); detect fake openclaw-agent prerequisite lures; scan SKILL.md for inflated README droppers (22 MB+); flag Skills Directory A/B grades on skills with external paste relay references (glot.io, rentry.co); monitor outbound connections to AMOS C2 91.92.242.30 and secondary IPs; detect base64 -D | bash with decoy echo swcdn.apple.com; block domains socifiapp.com, custom-registry.com, openclawskills.net, laosji.net; audit skills with OS-split instructions for macOS (bash delivery) vs Windows (ZIP/EXE)

## Timeline
- First seen: 2026-02-01
- Last updated: 2026-11-06
- 2026-02-01 (Koi Security): ClawHavoc campaign discovered delivering AMOS via 23 malicious skills
- 2026-06-23 (Unit 42): Five malicious skills with Node.js credential harvesters and reverse shells identified
- 2026-11-03 (Cyera Research): Analysis of 1M+ skills reveals 516 AMOS-linked samples, 70 confirmed-malicious active in Sep 2026; all received A/B Skills Directory grades despite malicious payloads; primary C2 91.92.242.30 in 83.7% of references; fake openclaw-agent lures, OS-split delivery (base64 bash on macOS, ZIP/EXE on Windows), paste relay infrastructure

## Tools
### AI tooling and models
- OpenClaw AI skill framework
- Anthropic [Claude](https://claude.com/product/overview) API
- OpenAI API

### Other tooling
- AMOS infostealer (macOS)
- Raccoon Stealer (Windows)
- [Node.js](https://github.com/nodejs/node) credential harvesters
- Reverse shells
- openclaw-skills\[.\]com rogue registry

## Sources
- [Koi: ClawHavoc Campaign Delivers AMOS via Malicious OpenClaw Skills](https://koi.security/blog/clawhavoc-malicious-openclaw-skills-amos)
- [Cyera: Poisoned Skills Target Developer Credentials](https://www.cyera.com/research/poisoned-skills-target-developer-credentials) — Cyera Research
