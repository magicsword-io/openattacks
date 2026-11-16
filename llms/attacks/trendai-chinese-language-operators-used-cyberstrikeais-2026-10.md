# TrendAI: Chinese-language operators used CyberStrikeAI's 44 agents and LLM-built tooling against Japanese organizations

- ID: trendai-chinese-language-operators-used-cyberstrikeais-2026-10
- Reported: 2026-10-23
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/trendai-chinese-language-operators-used-cyberstrikeais-2026-10/

## Summary
TrendAI details three Chinese-language campaigns against Japan using AI at different levels, from a 44-agent CyberStrikeAI pipeline to LLM-planned intrusions that also hunted AI inference services, and finds AI raised scale but not depth of compromise.

## Category
adversary-use-of-ai

## Attribution
Unnamed (three Simplified Chinese-language operators; not linked to each other)

- Actor: Unnamed operators (three Simplified Chinese-language cases; not linked to each other)
- Country: Unknown
- Motivation: unknown
- Attributed by: TrendAI (Trend Micro)
- Confidence: low

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: unknown
- Victims and sectors: Government; Multiple sectors; Technology and AI companies
- Regions: unknown
- Region notes: Target geography was not captured by the Notion feed. Actor attribution is not used as a victim location.
- Scale and metrics: unknown

## Attack flow
No attack flow is recorded.

## MITRE ATLAS
No ATLAS mapping is recorded.

## Prevention
unknown

## Detections
- Attacker-side consoles without a victim command line (guidance) — security-detections-mcp searches for web shells and password spray returned host and identity rules. TrendAI reconstructed three infrastructures from files left on attacker servers and says that material cannot establish identities or, by itself, which attempts succeeded. Case A used CyberStrikeAI against legacy web admin interfaces; many targets were recorded as no session, no web shell, and no exfiltration. A webshell rule would not describe that evidence. Country is Unknown because Simplified Chinese is a working language, not an attributed country.

## Timeline
- First seen: 2026-01
- Last updated: 2026-11-15
- 2026-10-23 (TrendAI (Trend Micro)): TrendAI's Japanese article, published in English on 27 October, describes three Simplified Chinese-language infrastructures targeting Japan. Case A, in October 2026, ran CyberStrikeAI with 44 agents. TrendAI does not link the three operators.
- 2026-11-15 (OpenAttacks): Tagged CyberStrikeAI and backfilled attribution, detections, and timeline from the cited TrendAI report.

## Tools
### AI tooling and models
- CyberStrikeAI (open-source agent pentest tool)
- unnamed LLMs
- AI workflow, LLM preprocessing and inference platforms in South Korea

### Other tooling
- unknown

### Offensive frameworks
- [CyberStrikeAI](https://openattacks.ai/tools/cyberstrikeai/) (`cyberstrikeai`)

## Source notes
Imported from the AI Threat Watch Notion feed (an automated daily scan); not yet editorially reviewed. Feed severity: Medium. Feed novelty: Evolution.

## Sources
- <https://www.trendaisecurity.com/en-us/resources-insights/deep-research/not-only-artex-the-different-levels-ai-is-used-in-attacks-targeting-japan> — TrendAI (Trend Micro)
- <https://thehackernews.com/2026/10/cyberstrikeai-uses-44-ai-agents-to.html>
- <https://cyberpress.org/ai-agents-target-japan/>
