# EvilAI fake AI/productivity apps with AI-generated code

- ID: evilai-trendmicro-fake-ai-apps-2025
- Reported: 2025-09-01
- AI role: ai_tool_as_lure
- Entry: https://openattacks.ai/attacks/evilai-trendmicro-fake-ai-apps-2025/

## Summary
Operators distribute fake AI/productivity apps (PDF editors, browsers, recipe tools, etc.) with realistic UIs, working features, and code-signing. Steal browser data, fingerprint systems, disable some security tools, AES-encrypted C2. Trend notes AI-generated-looking clean code aiding evasion. Names include App Suite, Epi Browser, JustAskJacky, Tampered Chef, et al.

## Category
adversary-use-of-ai

## Attribution
unknown

## AI involvement confidence
confirmed

## Attack flow
### step-1: User installs a productivity app (access)

Realistic AI and productivity applications offer working-looking interfaces.

Evidence: <https://www.trendmicro.com/en/research/25/i/evilai.html>

### step-2: AI-themed functionality lends credibility (ai)

The research also notes code characteristics consistent with AI assistance.

Evidence: <https://www.trendmicro.com/en/research/25/i/evilai.html>

### step-3: Application performs hidden actions (execution)

The installed app fingerprints the host and communicates with encrypted C2.

Evidence: <https://www.trendmicro.com/en/research/25/i/evilai.html>

### step-4: Browser data theft (impact)

The reported operation steals information and attempts to disable some security tools.

Evidence: <https://www.trendmicro.com/en/research/25/i/evilai.html>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
No ATLAS mapping is recorded.

## Prevention
Allowlist apps; block unexpected signed-but-unknown publishers; MagicSword default-deny

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in EvilAI fake AI/productivity apps with AI-generated code. Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- Fake AI-branded applications
- AI-assisted clean code (Trend assessment)

### Other tooling
- AES C2
- code signing abuse

### MagicSword projects
- [LOLBAS](https://lolbas-project.github.io)

## Sources
- <https://www.trendmicro.com/en/research/25/i/evilai.html>
