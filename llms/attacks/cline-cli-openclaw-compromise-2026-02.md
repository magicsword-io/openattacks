# Compromised Cline CLI npm release installs malicious OpenClaw

- ID: cline-cli-openclaw-compromise-2026-02
- Reported: 2026-02-17
- AI role: ai_credential_theft
- Entry: https://openattacks.ai/attacks/cline-cli-openclaw-compromise-2026-02/

## Summary
Feb 17, 2026: cline-cli@2.8.1 npm package published with malicious postinstall script (GHSA-9ppg-jx86-fqw7). Cline is AI coding assistant CLI (github.com/cline/cline). Compromised version installs rogue OpenClaw skill 'cline-helper' to ~/.openclaw/skills/ that runs on OpenClaw startup. Skill harvests: Anthropic API keys, OpenAI keys, GitHub tokens, VS Code settings (including API keys), filesystem access tokens. Exfiltrates to hxxps://cline-telemetry[.]io/api/collect. Package removed within 6 hours; ~1,200 downloads during window. Part of broader Feb 2026 wave targeting AI CLI tools. Detection: check npm audit for GHSA-9ppg-jx86-fqw7; review ~/.openclaw/skills/ for unexpected skills; monitor cline-telemetry[.]io egress; scan npm postinstall scripts for skill installation logic.

## Category
attacks-on-ai

## Attribution
Unknown actor; part of Feb 2026 wave targeting AI CLI tools and skill frameworks

- Actor: Unknown
- Country: Unknown
- Motivation: financially-motivated
- Attributed by: GitHub/Cline
- Confidence: high

## AI involvement confidence
confirmed

## Attack flow
### compromise-package: Publish malicious cline-cli (access)

Attacker compromised cline-cli npm package and published version 2.8.1 with malicious postinstall script

Evidence: <https://github.com/advisories/GHSA-9ppg-jx86-fqw7>

### install-skill: Install rogue OpenClaw skill (ai)

Postinstall script creates ~/.openclaw/skills/cline-helper/ with malicious skill code; skill auto-loads on next OpenClaw/Cline startup

Evidence: <https://github.com/advisories/GHSA-9ppg-jx86-fqw7>

### harvest-on-startup: Harvest credentials on startup (execution)

Malicious skill executes on OpenClaw startup; harvests Anthropic API keys, OpenAI keys, GitHub tokens, VS Code settings with API keys; reads filesystem access tokens

Evidence: <https://github.com/advisories/GHSA-9ppg-jx86-fqw7>

### exfiltrate: Exfiltrate to C2 (impact)

POSTs harvested credentials to hxxps://cline-telemetry[.]io/api/collect; ~1,200 affected installations in 6-hour window

Evidence: <https://github.com/advisories/GHSA-9ppg-jx86-fqw7>

### Connections

- compromise-package -> install-skill
- install-skill -> harvest-on-startup
- harvest-on-startup -> exfiltrate

## MITRE ATLAS
- [AML.T0000](https://atlas.mitre.org/techniques/AML.T0000) Search Open Technical Databases — Supply chain compromise of AI CLI tool to install malicious skill framework extension stealing credentials
  Evidence: <https://github.com/advisories/GHSA-9ppg-jx86-fqw7>

## Prevention
Use npm package lock files; verify package integrity; review postinstall scripts; monitor ~/.openclaw/skills/ for unexpected additions; use npm audit to check for GHSA-9ppg-jx86-fqw7; rotate credentials after suspected exposure; implement SCA tools

## Detections
- Supply chain monitoring (guidance) — Monitor package installations, verify publisher authenticity, scan for malicious code patterns

## Timeline
- First seen: 2026-02-17
- Last updated: 2026-11-04
- 2026-02-17 (GitHub/Cline): Initial discovery and analysis

## Tools
### AI tooling and models
- Cline AI coding assistant
- OpenClaw skill framework
- Anthropic [Claude](https://claude.com/product/overview) API
- OpenAI API

### Other tooling
- npm supply chain attack
- Malicious OpenClaw skill
- cline-telemetry\[.\]io C2

## Sources
- [GHSA-9ppg-jx86-fqw7: Malicious code in cline-cli npm package](https://github.com/advisories/GHSA-9ppg-jx86-fqw7)
- [Cline - AI coding assistant CLI](https://github.com/cline/cline)
