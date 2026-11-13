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

- Country: China
- Motivation: financially-motivated
- Attributed by: CrowdStrike Intelligence
- Confidence: medium

## AI involvement confidence
confirmed

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
No detections are recorded.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- [ARTEX](https://github.com/RuoJi6/ARTEX) — Community-maintained fork; the original repository is unavailable.
- [Claude Code](https://github.com/anthropics/claude-code)
- [DeepSeek](https://github.com/deepseek-ai) v4.1-flash via xcai.pro
- [GLM-5.3](https://github.com/zai-org)
- [Grok](https://x.ai/grok) 4.6

### Other tooling
- Proxy IPs listed in CrowdStrike IOC table

## Sources
- [CrowdStrike Oct 7 - Unknown threat actor uses ARTEX vs South Korean finance](https://www.crowdstrike.com/en-us/blog/unknown-threat-actor-uses-artex-to-target-south-korean-finance/)
