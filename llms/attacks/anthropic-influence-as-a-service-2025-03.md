# Claude-orchestrated influence-as-a-service bot network

- ID: anthropic-influence-as-a-service-2025-03
- Reported: 2025-04-23
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/anthropic-influence-as-a-service-2025-03/

## Summary
Financially motivated influence-as-a-service used Claude not only for content but to decide when 100+ social bot accounts should like, share, comment, or ignore posts based on client political personas. Also generated multilingual responses and image-gen prompts.

## Category
adversary-use-of-ai

## Attribution
unknown commercially motivated operator; state affiliation not confirmed

- Actor: unknown commercially motivated operator

## AI involvement confidence
confirmed

## Attack flow
### step-1: Operator defines political personas (access)

Commercial clients supply narratives and personas for social accounts.

Evidence: <https://www.anthropic.com/news/detecting-and-countering-malicious-uses-of-claude-march-2025>

### step-2: Claude plans account activity (ai)

Claude helps decide when more than 100 bot accounts should engage or ignore posts.

Evidence: <https://www.anthropic.com/news/detecting-and-countering-malicious-uses-of-claude-march-2025>

### step-3: Accounts distribute content (execution)

The operation uses multilingual responses and generated image prompts.

Evidence: <https://www.anthropic.com/news/detecting-and-countering-malicious-uses-of-claude-march-2025>

### step-4: Coordinated influence (impact)

Authentic social accounts encounter the coordinated engagement; state affiliation is unconfirmed.

Evidence: <https://www.anthropic.com/news/detecting-and-countering-malicious-uses-of-claude-march-2025>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0016.002](https://atlas.mitre.org/techniques/AML.T0016.002) Generative AI — The supplied source explicitly describes generative-model tooling assisting the reported activity; this mapping does not establish additional autonomy or victim impact.
  Evidence: <https://www.anthropic.com/news/detecting-and-countering-malicious-uses-of-claude-march-2025>

## Prevention
Platform bot detection; model-provider abuse monitoring (Anthropic banned accounts)

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in Claude-orchestrated influence-as-a-service bot network. Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- [Claude](https://claude.com/product/overview)
- image-generation tools (prompts only)

### Other tooling
- unknown

## Sources
- <https://www.anthropic.com/news/detecting-and-countering-malicious-uses-of-claude-march-2025>
