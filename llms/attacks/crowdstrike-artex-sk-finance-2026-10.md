# ARTEX + Claude Code vs South Korean finance

- ID: crowdstrike-artex-sk-finance-2026-10
- Reported: 2026-10-07
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/crowdstrike-artex-sk-finance-2026-10/

## Summary
Likely Chinese-speaking financially motivated actor used open-source Chinese agentic pentest suite ARTEX plus Claude Code against South Korean financial orgs. Open directories held Claude session histories, ARTEX configs, Claude memory. ARTEX used DeepSeek v4.1-flash via xcai.pro; also GLM-5.3 and Grok 4.6. Actor asked Claude where to sell Korean breach data. ARTEX later went closed-source.

## Category
adversary-use-of-ai

## Attribution
CrowdStrike did not attribute the activity to a named adversary. It assessed with moderate confidence that the actor was likely a Chinese speaker and financially motivated.

- Actor: Unknown threat actor
- Country: Unknown
- Motivation: financially-motivated
- Attributed by: CrowdStrike Intelligence
- Confidence: medium

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: unknown (industry reports: loan inquiry service; employee mobile work-support system)
- Victims and sectors: South Korean financial organizations (multiple banks per industry reports)
- Regions: South Korea
- Region notes: South Korea describes victim financial organizations. Chinese language concerns actor attribution; Hong Kong refers to infrastructure. Neither is counted as victim geography.
- Scale and metrics: Active late Sep–early Oct 2026; number of orgs unconfirmed

## Attack flow
### step-1: Initial access is not established (unknown)

The supplied entry does not confirm the initial intrusion route.

Evidence: <https://www.crowdstrike.com/en-us/blog/unknown-threat-actor-uses-artex-to-target-south-korean-finance/>

### step-2: ARTEX and Claude Code assist operations (ai)

The actor uses an agentic pentest suite and coding-agent tooling.

Evidence: <https://www.crowdstrike.com/en-us/blog/unknown-threat-actor-uses-artex-to-target-south-korean-finance/>

### step-3: Agents support financial-sector attacks (execution)

Open directories exposed sessions, configurations and model use tied to South Korean financial targets.

Evidence: <https://www.crowdstrike.com/en-us/blog/unknown-threat-actor-uses-artex-to-target-south-korean-finance/>

### step-4: Actor discusses selling breach data (impact)

Claude session material includes questions about selling Korean breach data; identities remain unconfirmed.

Evidence: <https://www.crowdstrike.com/en-us/blog/unknown-threat-actor-uses-artex-to-target-south-korean-finance/>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0016.002](https://atlas.mitre.org/techniques/AML.T0016.002) Generative AI — The supplied source explicitly describes generative-model tooling assisting the reported activity; this mapping does not establish additional autonomy or victim impact.
  Evidence: <https://www.crowdstrike.com/en-us/blog/unknown-threat-actor-uses-artex-to-target-south-korean-finance/>

## Prevention
Monitor for agentic pentest suites and exposed Claude session dirs; Jose Censys notes on IOCs

## Detections
- ARTEX operator infrastructure is not a victim-side rule (guidance) — security-detections-mcp searches for password spray, web shells, and the report's ATT&CK techniques (T1583.003, T1588.007, T1090) returned infrastructure, proxy, and identity rules. CrowdStrike describes the actor's own ARTEX and Claude Code servers, not a command, webshell, or cloud API on the South Korean financial organizations. Hunt exposed Claude session directories and ARTEX consoles, and review the loan-inquiry and mobile work-support services named in the industry reporting CrowdStrike cites.

## Timeline
- First seen: 2026-09
- Last updated: 2026-11-15
- 2026-10-07 (CrowdStrike Intelligence): CrowdStrike reports an unnamed, likely Chinese-speaking, financially motivated actor using ARTEX and Claude Code against South Korean financial organizations from late September to early October 2026. A resume prompt listing Maoming, Guangdong cannot be definitively tied to the actor.
- 2026-11-15 (OpenAttacks): Tagged ARTEX and backfilled actor name, detections, and timeline from the cited CrowdStrike report. Country stays Unknown because the report attributes language and a financial motive, not a country.

## Tools
### AI tooling and models
- [ARTEX](https://github.com/RuoJi6/ARTEX) — Community-maintained fork; the original repository is unavailable.
- [Claude Code](https://github.com/anthropics/claude-code)
- [DeepSeek](https://github.com/deepseek-ai) v4.1-flash via xcai.pro
- [GLM-5.3](https://github.com/zai-org)
- [Grok](https://x.ai/grok) 4.6

### Other tooling
- Proxy IPs listed in CrowdStrike IOC table

### Offensive frameworks
- [ARTEX](https://openattacks.ai/tools/artex/) (`artex`)

## Source notes
CrowdStrike's report ties the South Korean finance activity to an unnamed actor. Separate reports of ARTEX use by other clusters should not be treated as attribution for this campaign.

## Sources
- [CrowdStrike Oct 7 - Unknown threat actor uses ARTEX vs South Korean finance](https://www.crowdstrike.com/en-us/blog/unknown-threat-actor-uses-artex-to-target-south-korean-finance/)
