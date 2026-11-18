# Google GTIG AI Threat Tracker: agentic setup harvested cloud credentials in under six hours

- ID: google-gtig-ai-threat-tracker-agentic-2026-09
- Reported: 2026-09-08
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/google-gtig-ai-threat-tracker-agentic-2026-09/

## Summary
GTIG documented a Mandiant-investigated intrusion where an autonomous multi-agent setup ran scanning, credential harvesting and IP rotation with little human input, alongside TeamPCP malware targeting AI tooling.

## Category
adversary-use-of-ai

## Attribution
Unnamed financially motivated actor; UNC6780 (TeamPCP); unknown 'Recon' dashboard operator

- Motivation: cybercrime

## AI involvement confidence
vendor-asserted

## Scope and targeting
- Initial access: unknown
- Victims and sectors: Technology and AI companies; Multiple sectors
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
- Unnamed AI coding chatbot used as agent
- AI coding tool configs (.claude, .cursor, .vscode)
- LLM-based code reviewers targeted by embedded prompts

### Other tooling
- unknown

## Source notes
Imported from the AI Threat Watch Notion feed (an automated daily scan); not yet editorially reviewed. Feed severity: High. Feed novelty: Evolution.

## Sources
- <https://cloud.google.com/blog/topics/threat-intelligence/from-prompting-to-autonomy-the-evolution-of-adversarial-ai> — Google Threat Intelligence Group
- <https://labs.cloudsecurityalliance.org/research/csa-research-note-gtig-agentic-credential-harvesting-2026090/>
