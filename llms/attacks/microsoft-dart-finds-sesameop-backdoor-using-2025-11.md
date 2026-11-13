# Microsoft DART finds SesameOp backdoor using OpenAI Assistants API as covert C2 channel

- ID: microsoft-dart-finds-sesameop-backdoor-using-2025-11
- Reported: 2025-11-03
- AI role: ai_infra_as_c2
- Entry: https://openattacks.ai/attacks/microsoft-dart-finds-sesameop-backdoor-using-2025-11/

## Summary
An espionage-focused intrusion used a .NET backdoor that relays commands and results through the OpenAI Assistants API, hiding C2 inside legitimate AI SaaS traffic.

## Category
adversary-use-of-ai

## Attribution
Unnamed (SesameOp operators)

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: unknown
- Victims and sectors: Multiple sectors
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
- OpenAI Assistants API (abused as C2 relay)

### Other tooling
- unknown

## Source notes
Imported from the AI Threat Watch Notion feed (an automated daily scan); not yet editorially reviewed. Feed severity: High. Feed novelty: New TTP.

## Sources
- <https://microsoft.com/en-us/security/blog/2025/11/03/sesameop-novel-backdoor-uses-openai-assistants-api-for-command-and-control> — Microsoft (Defender Experts / DART)
- <https://thehackernews.com/2025/11/microsoft-detects-sesameop-backdoor.html>
- <https://securityaffairs.com/184197/malware/sesameop-new-backdoor-exploits-openai-api-for-covert-c2.html>
