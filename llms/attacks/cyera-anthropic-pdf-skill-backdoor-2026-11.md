# Cyera Research - Tampered copy of Anthropic's PDF skill carrying Linux Go backdoor system_linux

- ID: cyera-anthropic-pdf-skill-backdoor-2026-11
- Reported: 2026-11-03
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/cyera-anthropic-pdf-skill-backdoor-2026-11/

## Summary
Cyera Research (Nov 3, 2026) discovered six skill archives impersonating Anthropic's official PDF skill, observed May 23 - July 14, 2026. Each archive contains 11 files byte-identical to upstream Anthropic pdf skill (github.com/anthropics/skills), but SKILL.md is truncated from 315 lines to 19 lines keeping official name and description while replacing Quick Start section with curl https://scan.100tal.com command, and adds 5.1 MB garble-obfuscated 64-bit Linux Go ELF binary system_linux. Binary features AES-256-GCM encrypted configuration with 0xAA XOR decryption revealing C2 81.70.101.115:2345 and attaches /bin/bash over raw TCP socket. Simplified Chinese strings in binary and UTC+8 archive timestamps indicate Chinese-language development environment. scan.100tal.com hostname linked to TAL Education Group infrastructure. Cyera notes attribution is unknown and could indicate targeted attack or internal security exercise. Cyera analyzed archives but did not observe live execution of system_linux backdoor. garble obfuscator (github.com/burrowers/garble) used to strip Go function names and identifiers. Demonstrates supply-chain risk where skill typosquatting or compromised distribution channels can deliver backdoors to AI developer environments.

## Category
attacks-on-ai

## Attribution
Unknown actor; UTC+8 archive timestamps; Simplified Chinese strings in binary; scan.100tal.com hostname (TAL Education Group-linked); Cyera notes attribution unknown and could be targeted attack or security exercise

- Actor: Unknown
- Country: Unknown
- Motivation: unknown
- Attributed by: Cyera Research
- Confidence: low

## AI involvement confidence
confirmed

## Attack flow
### create-tampered-skill: Create tampered PDF skill with system_linux backdoor (execution)

Create tampered PDF skill with system_linux backdoor

Evidence: <https://www.cyera.com/research/malicious-copy-anthropic-pdf-skill-carries-linux-backdoor>

### truncate-skill-md: Truncate SKILL.md (315→19 lines), add curl scan.100tal.com (execution)

Truncate SKILL.md (315→19 lines), add curl scan.100tal.com

Evidence: <https://www.cyera.com/research/malicious-copy-anthropic-pdf-skill-carries-linux-backdoor>

### obfuscate-backdoor: garble-obfuscate system_linux Go binary (execution)

garble-obfuscate system_linux Go binary

Evidence: <https://www.cyera.com/research/malicious-copy-anthropic-pdf-skill-carries-linux-backdoor>

### distribute-skill: Distribute tampered skill via unknown channel (execution)

Distribute tampered skill via unknown channel

Evidence: <https://www.cyera.com/research/malicious-copy-anthropic-pdf-skill-carries-linux-backdoor>

### developer-install: Developer installs tampered PDF skill (execution)

Developer installs tampered PDF skill

Evidence: <https://www.cyera.com/research/malicious-copy-anthropic-pdf-skill-carries-linux-backdoor>

### backdoor-execution: system_linux connects 81.70.101.115:2345, attaches /bin/bash (impact)

system_linux connects 81.70.101.115:2345, attaches /bin/bash

Evidence: <https://www.cyera.com/research/malicious-copy-anthropic-pdf-skill-carries-linux-backdoor>

### Connections

- create-tampered-skill -> truncate-skill-md
- truncate-skill-md -> obfuscate-backdoor
- obfuscate-backdoor -> distribute-skill
- distribute-skill -> developer-install
- developer-install -> backdoor-execution

## MITRE ATLAS
- [AML.T0000](https://atlas.mitre.org/techniques/AML.T0000) Search Open Technical Databases — Supply-chain attack targeting AI skill distribution; tampered Anthropic PDF skill delivers Linux backdoor to developer workstations in AI/ML development environments
  Evidence: <https://www.cyera.com/research/malicious-copy-anthropic-pdf-skill-carries-linux-backdoor>

## Prevention
Only install skills from Anthropic's official Skills repository (github.com/anthropics/skills); verify skill archive integrity and file count before installation; scan skill archives for unexpected binaries (system_linux, system_darwin, etc.); monitor skill installation for outbound connections to non-Anthropic domains (scan.100tal.com, 81.70.101.115); implement network egress filtering for skill execution environments; use read-only skill directories where possible; audit SKILL.md for truncated or modified Quick Start sections referencing external domains; educate developers on skill supply-chain risks

## Detections
- [Linux Shell Pipe to Shell](https://github.com/SigmaHQ/sigma/blob/master/rules/linux/process_creation/proc_creation_lnx_susp_pipe_shell.yml) (sigma) — Detects suspicious shell pipes; relevant for detecting /bin/bash reverse shell execution from system_linux backdoor
- [Bash Interactive Shell](https://github.com/SigmaHQ/sigma/blob/master/rules/linux/process_creation/proc_creation_lnx_bash_interactive_shell.yml) (sigma) — Detects bash interactive shell spawning; directly applicable to system_linux attaching /bin/bash to TCP socket
- Skill supply-chain integrity monitoring (guidance) — Verify skill archives against official Anthropic Skills repository (github.com/anthropics/skills); alert on unexpected binaries in skill directories (system_linux, system_darwin); scan SKILL.md for modified Quick Start sections referencing external domains (scan.100tal.com); monitor skill installation for outbound TCP connections to non-Anthropic infrastructure (81.70.101.115:2345); detect garble-obfuscated Go binaries via string entropy analysis; flag skill archives with UTC+8 timestamps and Simplified Chinese strings when organization is not China-based
- Network egress filtering (guidance) — Block outbound connections from skill execution environments to unknown IPs; alert on raw TCP connections to port 2345; monitor for /bin/bash processes with network sockets; detect AES-256-GCM encrypted config files in skill directories

## Timeline
- First seen: 2026-05-23
- Last updated: 2026-11-03
- 2026-05-23 (Cyera Research): Earliest observed tampered PDF skill archive with system_linux backdoor
- 2026-07-14 (Cyera Research): Latest observed tampered PDF skill archive (six total observed May 23 - Jul 14)
- 2026-11-03 (Cyera Research): Cyera publishes analysis with IOCs and backdoor mechanism; notes attribution unknown and system_linux was not observed executing

## Tools
### AI tooling and models
- Anthropic [Claude](https://claude.com/product/overview) Skills (impersonated; official repo https://github.com/anthropics/skills)
- garble [Go](https://github.com/golang/go) obfuscator (https://github.com/burrowers/garble)

### Other tooling
- system_linux [Go](https://github.com/golang/go) backdoor (5.1 MB ELF64, AES-256-GCM + 0xAA XOR config)
- /bin/bash reverse shell over TCP

## Sources
- [Malicious Copy of Anthropic's PDF Skill Carries Linux Backdoor](https://www.cyera.com/research/malicious-copy-anthropic-pdf-skill-carries-linux-backdoor) — Cyera Research
