# Wiz: Storm-0940-overlapping operator runs ARTEX agents against Okta, Entra and Cognito logins at IT and software vendors

- ID: wiz-storm-0940-overlapping-operator-runs-2026-10
- Reported: 2026-10-22
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/wiz-storm-0940-overlapping-operator-runs-2026-10/

## Summary
Wiz saw an ARTEX-driven operator sharing Microsoft-attributed Storm-0940 IPs password-spray and probe auth flows at IT and software vendors throughout October; most attempts failed.

## Category
adversary-use-of-ai

## Attribution
Storm-0940 (overlap per Wiz)

- Actor: Storm-0940 (overlap per Wiz)
- Country: China
- Motivation: nation-state

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: unknown
- Victims and sectors: Technology and AI companies
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
- [ARTEX](https://github.com/RuoJi6/ARTEX) multi-agent pentest framework (LLM backends not named) — Community-maintained fork; the original repository is unavailable.
- Okta, Entra ID, AWS Cognito login flows

### Other tooling
- unknown

### Offensive frameworks
- [ARTEX](https://openattacks.ai/tools/artex/) (`artex`)

## Source notes
Imported from the AI Threat Watch Notion feed (an automated daily scan); not yet editorially reviewed. Feed severity: Medium. Feed novelty: Evolution.

## Sources
- <https://wiz.io/blog/artex-in-the-wild-storm-0940-expands-targeting-of-it-and-software-vendors> — Wiz Research
- <https://aimatter.in/2026/10/22/wiz-finds-an-ai-agent-that-attacks-software-vendors>
