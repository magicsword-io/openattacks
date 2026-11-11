# METR exposed vibe-coded agent dashboard key leading to $600K credit theft

- ID: metr-vibe-coded-agent-dashboard-2026-08
- Reported: 2026-08-31
- AI role: ai_credential_theft
- Entry: https://openattacks.ai/attacks/metr-vibe-coded-agent-dashboard-2026-08/

## Summary
Aug 31, 2026: METR disclosed incident where 'vibe-coded' (minimally tested, rapidly prototyped) AI agent dashboard accidentally exposed API key in client-side code. Unknown actor discovered key, used AI tooling to rapidly enumerate victim's cloud AI accounts (AWS Bedrock, Azure OpenAI, GCP Vertex AI), and drained approximately $600,000 in AI inference credits via unauthorized LLM calls. Demonstrates security risks of rapid AI prototyping ('vibe-coding') and AI-augmented attacker enumeration. METR estimates AI tooling accelerated enumeration ~10x vs manual methods.

## Category
attacks-on-ai

## Attribution
Unknown actor

- Actor: Unknown
- Country: Unknown
- Motivation: financially-motivated
- Attributed by: METR
- Confidence: low

## AI involvement confidence
confirmed

## Attack flow
### discover-key: Discover exposed API key (access)

Actor finds API key exposed in vibe-coded dashboard client-side code

Evidence: <https://metr.org/blog/2026-08-31-security-update/>

### ai-enumeration: AI-assisted account enumeration (ai)

Use AI tooling to rapidly enumerate cloud AI accounts (AWS Bedrock, Azure OpenAI, GCP Vertex AI); ~10x faster than manual

Evidence: <https://metr.org/blog/2026-08-31-security-update/>

### drain-credits: Drain AI inference credits (impact)

Make unauthorized LLM inference calls across enumerated accounts, draining ~$600K in credits

Evidence: <https://metr.org/blog/2026-08-31-security-update/>

### Connections

- discover-key -> ai-enumeration
- ai-enumeration -> drain-credits

## MITRE ATLAS
- [AML.T0000](https://atlas.mitre.org/techniques/AML.T0000) Search Open Technical Databases — Exposed API key in AI agent dashboard leads to theft of AI inference credits
  Evidence: <https://metr.org/blog/2026-08-31-security-update/>

## Prevention
Secure AI prototypes before production; never expose API keys in client code; use secret management; monitor AI usage for anomalies; set usage limits

## Detections
- AI credit consumption monitoring (guidance) — Monitor cloud AI usage for anomalous spikes; alert on rapid enumeration of AI accounts; detect unauthorized API key usage

## Timeline
- First seen: 2026-08-31
- Last updated: 2026-11-05
- 2026-08-31 (METR): Exposed vibe-coded dashboard key led to $600K AI credit theft with AI-augmented enumeration

## Tools
### AI tooling and models
- AI-assisted cloud account enumeration
- Automated credential abuse

### Other tooling
- API key harvesting
- Cloud AI credit draining

## Sources
- [METR: Exposed Vibe-Coded Agent Dashboard Key Led to ~$600K Credit Theft](https://metr.org/blog/2026-08-31-security-update/)
