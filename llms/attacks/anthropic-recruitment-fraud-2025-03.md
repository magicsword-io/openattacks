# Claude-polished Eastern Europe recruitment fraud

- ID: anthropic-recruitment-fraud-2025-03
- Reported: 2025-04-23
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/anthropic-recruitment-fraud-2025-03/

## Summary
Recruitment fraud impersonating hiring managers used Claude for real-time language refinement, native-English polishing, interview scripts, and more legitimate-looking formatting.

Evidence qualification: AI used for language sanitization of scam content; successful victim compromise not confirmed by Anthropic.

## Category
adversary-use-of-ai

## Attribution
unknown

## AI involvement confidence
unverified

## Scope and targeting
- Initial access: unknown
- Victims and sectors: Job seekers primarily in Eastern European countries
- Regions: Europe
- Region notes: The source describes job seekers in Eastern Europe without naming individual countries.
- Scale and metrics: unknown

## Attack flow
### step-1: Recruiter identities are impersonated (access)

The fraud targets job seekers with hiring-manager personas.

Evidence: <https://www.anthropic.com/news/detecting-and-countering-malicious-uses-of-claude-march-2025>

### step-2: Claude polishes the dialogue (ai)

Model assistance refines language, interview scripts and formatting.

Evidence: <https://www.anthropic.com/news/detecting-and-countering-malicious-uses-of-claude-march-2025>

### step-3: Fraudulent recruitment messages (execution)

The actor uses more legitimate-looking recruitment communications.

Evidence: <https://www.anthropic.com/news/detecting-and-countering-malicious-uses-of-claude-march-2025>

### step-4: Individual losses are undisclosed (unknown)

The supplied record does not quantify successful fraud or victim losses.

Evidence: <https://www.anthropic.com/news/detecting-and-countering-malicious-uses-of-claude-march-2025>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0016.002](https://atlas.mitre.org/techniques/AML.T0016.002) Generative AI — The supplied source explicitly describes generative-model tooling assisting the reported activity; this mapping does not establish additional autonomy or victim impact.
  Evidence: <https://www.anthropic.com/news/detecting-and-countering-malicious-uses-of-claude-march-2025>

## Prevention
Verify recruiters outside chat channels; AI polish is not proof of legitimacy

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in Claude-polished Eastern Europe recruitment fraud. Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- [Claude](https://claude.com/product/overview)

### Other tooling
- unknown

## Source notes
unknown

## Sources
- <https://www.anthropic.com/news/detecting-and-countering-malicious-uses-of-claude-march-2025>
