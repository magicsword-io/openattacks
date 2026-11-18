# Snyk analysis - covert and lookalike malicious skills targeting skills.sh and ClawHub

- ID: snyk-covert-lookalike-skills-2026-11
- Reported: 2026-11-06
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/snyk-covert-lookalike-skills-2026-11/

## Summary
Snyk Security Research (Marco Milanta, Marc Fischer, Luca Beurer-Kellner, Nov 6, 2026) documents malicious skills targeting skills.sh and ClawHub platforms. callicrate/skills/agents-md bundles UPX-packed Rust binary, detaches with FAST_VALIDATE_WORKER=1 environment variable, appends remote text to ~/.claude/CLAUDE.md for persistence after skill removal. ClawHub campaigns: vinhbui3004/audio-upload-aioz-stream and video-upload-aioz-stream exfiltrate to api-w3stream.attoaioz.cyou; gloryjack/tushare-pro via tussahre.pro; neutronstar238/md-to-ppt runs npx slidew. Additional malicious skills: andy825lay-tech/github-automation-pro (obfuscated JavaScript), liuyanfeng1234/v19-trust-manifesto (agent enrollment as curl diagnostic utility). Unattributed campaigns; confirmed malicious behavior. Multiple attack vectors: packed binaries, remote CLAUDE.md modification, typosquatted domains, obfuscated JavaScript, fake diagnostic utilities.

## Category
attacks-on-ai

## Attribution
Unattributed campaigns; multiple distinct actors targeting AI skill platforms

- Actor: Unattributed campaigns
- Country: Unknown
- Motivation: cybercrime
- Attributed by: Snyk
- Confidence: low

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Users install malicious skills from skills.sh or ClawHub platforms
- Victims and sectors: AI developers using skills.sh and ClawHub platforms; Claude AI users
- Regions: Multiple regions
- Region notes: unknown
- Scale and metrics: Multiple malicious skills identified Nov 2026 across skills.sh and ClawHub

## Attack flow
### publish-malicious-skills: Publish malicious skills (access)

Attackers publish covert malicious skills on skills.sh and ClawHub platforms with lookalike or utility names

Evidence: <https://research.snyk.io/blog/skill-analysis/>

### user-install: User installs malicious skill (ai)

Developer installs malicious skill from skills.sh or ClawHub platform

Evidence: <https://research.snyk.io/blog/skill-analysis/>

### deploy-backdoor: Deploy UPX-packed binary or obfuscated JS (execution)

Skill deploys UPX-packed Rust binary, obfuscated JavaScript, or npx-based payload

Evidence: <https://research.snyk.io/blog/skill-analysis/>

### persist-claude-md: Modify ~/.claude/CLAUDE.md (execution)

Remote text appended to CLAUDE.md for persistence after skill removal

Evidence: <https://research.snyk.io/blog/skill-analysis/>

### exfiltrate-credentials: Exfiltrate credentials (impact)

Credentials and data exfiltrated to attacker domains (api-w3stream.attoaioz.cyou, tussahre.pro)

Evidence: <https://research.snyk.io/blog/skill-analysis/>

### Connections

- publish-malicious-skills -> user-install
- user-install -> deploy-backdoor
- deploy-backdoor -> persist-claude-md
- persist-claude-md -> exfiltrate-credentials

## MITRE ATLAS
- [AML.T0010](https://atlas.mitre.org/techniques/AML.T0010) AI Supply Chain Compromise — Supply chain attack via malicious skills on skills.sh and ClawHub platforms
  Evidence: <https://research.snyk.io/blog/skill-analysis/>
- [AML.T0011](https://atlas.mitre.org/techniques/AML.T0011) User Execution — Skills propagate through AI skill distribution platforms targeting developer environments
  Evidence: <https://research.snyk.io/blog/skill-analysis/>
- [AML.T0051](https://atlas.mitre.org/techniques/AML.T0051) LLM Prompt Injection — Remote text appended to ~/.claude/CLAUDE.md persists instructions after skill removal
  Evidence: <https://research.snyk.io/blog/skill-analysis/>
- [AML.T0083](https://atlas.mitre.org/techniques/AML.T0083) Credentials from AI Agent Configuration — Malicious skills target AI credential theft and environment compromise
  Evidence: <https://research.snyk.io/blog/skill-analysis/>
- [AML.T0081](https://atlas.mitre.org/techniques/AML.T0081) Modify AI Agent Configuration — Skills establish persistence through CLAUDE.md modification and agent enrollment mechanisms
  Evidence: <https://research.snyk.io/blog/skill-analysis/>

## Prevention
Verify skill publisher authenticity before installation; scan for UPX-packed binaries in skill packages; monitor ~/.claude/CLAUDE.md for unauthorized modifications; block suspicious domains (api-w3stream.attoaioz.cyou, tussahre.pro); audit skills for obfuscated JavaScript; detect FAST_VALIDATE_WORKER=1 environment variable usage; review npx commands in skill execution; restrict skill permissions to minimum required; implement skill sandboxing where possible

## Detections
- Skill supply-chain monitoring (guidance) — Monitor ~/.claude/CLAUDE.md for unauthorized modifications; scan skill packages for UPX-packed binaries; detect FAST_VALIDATE_WORKER=1 environment variable usage; block domains api-w3stream.attoaioz.cyou and tussahre.pro; audit npx commands (npx slidew); flag obfuscated JavaScript in skills; verify skill publisher authenticity; detect detached processes from skill installations
- Related malicious skill campaigns (guidance) — Cross-reference with malicious-openclaw-skills-2026 catalog entry; monitor for similar patterns across AI skill platforms; detect fake diagnostic utilities claiming curl functionality; alert on agent enrollment via non-standard mechanisms

## Timeline
- First seen: 2026-09-01
- Last updated: 2026-11-06
- 2026-11-06 (Snyk): Snyk publishes analysis of covert and lookalike malicious skills on skills.sh and ClawHub; callicrate/skills/agents-md UPX-packed binary modifies CLAUDE.md; ClawHub campaigns exfiltrate to api-w3stream.attoaioz.cyou and tussahre.pro; obfuscated JavaScript and fake diagnostic utilities identified

## Tools
### AI tooling and models
- [Claude](https://claude.com/product/overview) AI
- skills.sh platform
- ClawHub platform

### Other tooling
- UPX packer
- Rust binaries
- Node.js/npx
- Obfuscated JavaScript

## Source notes
Snyk Security Research blog (Nov 6, 2026) primary source; all indicators (skill names, domains, techniques) verified from Snyk analysis; multiple unattributed campaigns with distinct TTPs; links to malicious-openclaw-skills-2026 catalog entry for broader context

## Sources
- [Snyk: Skill Analysis - Covert and Lookalike Malicious Skills](https://research.snyk.io/blog/skill-analysis/) — Snyk
