# Sysdig: attacker turns hijacked Ollama server into reasoning engine for an autonomous exploit pipeline

- ID: sysdig-attacker-turns-hijacked-ollama-server-2026-06
- Reported: 2026-06-17
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/sysdig-attacker-turns-hijacked-ollama-server-2026-06/

## Summary
Instead of reselling stolen AI compute, an actor used a free exposed Ollama model as the brain of a multi-stage autonomous scanning and exploitation tool under active development.

## Category
adversary-use-of-ai

## Attribution
Unnamed (VAPT tool developer; source IPs in India)

## AI involvement confidence
confirmed

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
- Internet-exposed [Ollama](https://github.com/ollama/ollama) servers
- tool requested OpenAI, Anthropic and Google model names

### Other tooling
- unknown

## Source notes
Imported from the AI Threat Watch Notion feed (an automated daily scan); not yet editorially reviewed. Feed severity: Medium. Feed novelty: New TTP.

## Sources
- <https://webflow.sysdig.com/blog/llmjacking-evolved-attackers-are-using-stolen-ai-compute-to-build-offensive-agentic-tools> — Sysdig Threat Research Team
- <https://labs.cloudsecurityalliance.org/research/csa-research-note-llmjacking-offensive-agentic-infrastructur/>
