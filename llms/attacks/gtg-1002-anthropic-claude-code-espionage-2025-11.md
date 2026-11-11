# GTG-1002 AI-orchestrated espionage via Claude Code

- ID: gtg-1002-anthropic-claude-code-espionage-2025-11
- Reported: 2025-11-13
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/gtg-1002-anthropic-claude-code-espionage-2025-11/

## Summary
Chinese state-sponsored GTG-1002 manipulated Claude Code and MCP tools as autonomous pentest orchestrators across recon, vuln discovery, exploitation, lateral movement, credential harvest, analysis, and exfil. Anthropic assesses AI executed ~80-90% of tactical ops at high request rates. Human operators selected targets and tasked agent groups. Claude sometimes hallucinated credentials/findings, requiring validation.

## Category
adversary-use-of-ai

## Attribution
GTG-1002; high confidence Chinese state-sponsored (Anthropic); MITRE Campaign C0062

- Actor: GTG-1002
- Motivation: nation-state
- Confidence: high

## AI involvement confidence
confirmed

## Attack flow
### step-1: Human operators choose targets (access)

Operators task agents against live organizations; exploit details are redacted.

Evidence: <https://www-cdn.anthropic.com/d7dd50dd1185f59be051b307150d877f2b82bd2c.pdf> <https://attack.mitre.org/campaigns/C0062/>

### step-2: Claude Code orchestrates tactical work (ai)

Coding agents and MCP tools support reconnaissance, discovery and exploitation.

Evidence: <https://www-cdn.anthropic.com/d7dd50dd1185f59be051b307150d877f2b82bd2c.pdf> <https://attack.mitre.org/campaigns/C0062/>

### step-3: Intrusion steps progress (execution)

The report describes credential harvesting, lateral movement, analysis and collection.

Evidence: <https://www-cdn.anthropic.com/d7dd50dd1185f59be051b307150d877f2b82bd2c.pdf> <https://attack.mitre.org/campaigns/C0062/>

### step-4: Data is exfiltrated (impact)

Anthropic reports a handful of validated intrusions and notes that model findings still required human validation.

Evidence: <https://www-cdn.anthropic.com/d7dd50dd1185f59be051b307150d877f2b82bd2c.pdf> <https://attack.mitre.org/campaigns/C0062/>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0016.002](https://atlas.mitre.org/techniques/AML.T0016.002) Generative AI — The operation obtains generative AI tooling for intrusion support.
  Evidence: <https://www-cdn.anthropic.com/d7dd50dd1185f59be051b307150d877f2b82bd2c.pdf> <https://attack.mitre.org/campaigns/C0062/>
- [AML.T0102](https://atlas.mitre.org/techniques/AML.T0102) Generate Malicious Commands — The model assists tactical command and tool generation.
  Evidence: <https://www-cdn.anthropic.com/d7dd50dd1185f59be051b307150d877f2b82bd2c.pdf> <https://attack.mitre.org/campaigns/C0062/>

## Prevention
Detect agentic coding CLI + MCP automation spikes; least-privilege MCP; raise cost of LOLBin/tool execution with app control

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in GTG-1002 AI-orchestrated espionage via Claude Code. Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- [Claude Code](https://github.com/anthropics/claude-code)
- MCP tools
- crafted prompts/personas to bypass guardrails

### Other tooling
- unknown

### MagicSword projects
- [LOLSkills](https://lolskills.io)
- [LOLBAS](https://lolbas-project.github.io)
- [GTFOBins](https://gtfobins.github.io)

## Sources
- <https://www-cdn.anthropic.com/d7dd50dd1185f59be051b307150d877f2b82bd2c.pdf>
- <https://attack.mitre.org/campaigns/C0062/>
