# Storm-0940 used ARTEX agentic AI framework in ConnectWise supply-chain attack reaching 2,250+ Microsoft 365 tenants

- ID: storm-0940-used-artex-agentic-ai-2026-10
- Reported: 2026-10-21
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/storm-0940-used-artex-agentic-ai-2026-10/

## Summary
Microsoft attributes the ConnectWise Cloud Backup supply-chain compromise to China-aligned Storm-0940, which used the ARTEX multi-agent AI framework to automate recon, spraying and OAuth abuse, reaching privileged cloud access in some tenants in under three hours.

## Category
adversary-use-of-ai

## Attribution
Storm-0940

- Actor: Storm-0940
- Country: China
- Motivation: nation-state

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: unknown
- Victims and sectors: Defense; Government; Finance; Technology and AI companies; Critical infrastructure; Multiple sectors
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
No detections are recorded.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- [ARTEX](https://github.com/RuoJi6/ARTEX) (open-source multi-agent LLM pen-test framework, model-agnostic) — Community-maintained fork; the original repository is unavailable.
- ConnectWise Cloud Backup (SkyKick) app identities
- Microsoft 365 / Entra ID

### Other tooling
- unknown

## Source notes
Imported from the AI Threat Watch Notion feed (an automated daily scan); not yet editorially reviewed. Feed severity: High. Feed novelty: Evolution.

## Sources
- <https://www.microsoft.com/en-us/security/blog/2026/10/21/storm-0940-uses-artex-agentic-ai-connectwise-supply-chain-compromise/> — Microsoft Threat Intelligence
- <https://www.bleepingcomputer.com/news/security/hackers-breach-microsoft-365-tenants-via-connectwise-supply-chain-attack/>
- <https://cyberscoop.com/microsoft-attributes-connectwise-supply-chain-attack-china-storm-0940/>
- <https://www.business-standard.com/technology/artificial-intelligence/chinese-linked-hackers-use-ai-to-compromise-firms-globally-microsoft-126102200170_1.html>
