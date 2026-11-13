# Sysdig captures LLM agent driving a marimo exploit to an internal database dump in four pivots

- ID: sysdig-captures-llm-agent-driving-marimo-2026-05
- Reported: 2026-05-26
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/sysdig-captures-llm-agent-driving-marimo-2026-05/

## Summary
Sysdig documented what it calls its first captured LLM-agent-driven intrusion, chaining a marimo RCE to AWS secrets, SSH and a PostgreSQL credential-table dump in about an hour.

## Category
adversary-use-of-ai

## Attribution
Unnamed (source IP in Indonesia)

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
- Unspecified LLM agent used by attacker
- victim ran marimo [Python](https://github.com/python/cpython) notebook

### Other tooling
- unknown

## Source notes
Imported from the AI Threat Watch Notion feed (an automated daily scan); not yet editorially reviewed. Feed severity: High. Feed novelty: New TTP.

## Sources
- <https://sysdig.com/blog/ai-agent-at-the-wheel-how-an-attacker-used-llms-to-move-from-a-cve-to-an-internal-database-in-4-pivots/> — Sysdig Threat Research Team
- <https://labs.cloudsecurityalliance.org/research/csa-research-note-llm-agent-postexploit-marimo-20260602-csa/>
