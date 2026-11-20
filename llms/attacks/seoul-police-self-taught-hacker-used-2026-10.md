# Seoul police: self-taught hacker used AI coding agent and autonomous pentest tool to breach 90+ Korean firms, steal 8.2M records

- ID: seoul-police-self-taught-hacker-used-2026-10
- Reported: 2026-10-26
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/seoul-police-self-taught-hacker-used-2026-10/

## Summary
Korean police say a low-skill crew used an AI coding agent plus an autonomous pentest framework to hack 60 firms in about 40 days, stealing 8.2M records for extortion — a law-enforcement-confirmed case of AI uplifting a novice.

## Category
adversary-use-of-ai

## Attribution
Unnamed South Korean extortion crew (32-year-old ringleader plus accomplices)

- Actor: Unnamed 32-year-old ringleader and six accomplices
- Country: Unknown
- Motivation: cybercrime
- Attributed by: Seoul Metropolitan Police Agency
- Confidence: high

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: unknown
- Victims and sectors: Healthcare; Education; Finance; Multiple sectors
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
- Website extortion case without a named host technique (guidance) — security-detections-mcp searches for password spray and web shells returned identity and webshell rules. Seoul police, Yonhap, Seoul Economic Daily, and BleepingComputer describe website intrusions, an AI coding agent, and ARTEX, then extortion. They do not name a command, webshell type, identity provider, or operating system, so those rules do not match this case. Review web-server access logs for the victim organizations police named by sector.

## Timeline
- First seen: 2025-09
- Last updated: 2026-11-15
- 2026-10-26 (Seoul Metropolitan Police Agency): Seoul police say seven suspects stole 8.2 million records from more than 90 organizations. The 32-year-old ringleader, identified only as A, used an AI coding agent and ARTEX to breach 60 of them from 31 August 2026. Police do not publish a legal name.
- 2026-11-15 (OpenAttacks): Tagged ARTEX and backfilled attribution, detections, and timeline from the cited police reporting. The ringleader's name and nationality are not in those sources, so country is Unknown.

## Tools
### AI tooling and models
- Unnamed AI coding agent
- autonomous AI pentest system ([ARTEX](https://github.com/RuoJi6/ARTEX) AI per BleepingComputer/Yonhap) — Community-maintained fork; the original repository is unavailable. MoLeft/ARTEX also returned HTTP 200 on 2026-11-16. The original Autumn-27/ARTEX repository returned HTTP 404.

### Other tooling
- unknown

### Offensive frameworks
- [ARTEX](https://openattacks.ai/tools/artex/) (`artex`)

## Source notes
Imported from the AI Threat Watch Notion feed (an automated daily scan); not yet editorially reviewed. Feed severity: High. Feed novelty: Evolution.

## Sources
- <https://en.sedaily.com/society/2026/10/26/self-taught-hacker-used-ai-to-steal-82-million-records> — Seoul Economic Daily (citing Seoul Metropolitan Police Agency)
- <https://www.bleepingcomputer.com/news/security/former-pentester-used-artex-ai-to-steal-82-million-data-records/>
- <https://en.yna.co.kr/view/AEN20261026005800315>
- <https://www.chosun.com/english/national-en/2026/10/26/O5G6E63B2JAFREUULLMFJONGOY/>
- <https://pcgamer.com/hardware/korean-police-arrest-cyberhacking-gang-reportedly-led-by-self-taught-hacker-who-allegedly-used-ai-to-breach-60-firms-and-received-a-mere-usd210-in-ransom>
