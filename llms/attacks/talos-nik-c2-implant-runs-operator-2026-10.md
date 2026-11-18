# Talos: NIK C2 implant runs operator prompts through OpenAI on the victim's own API key

- ID: talos-nik-c2-implant-runs-operator-2026-10
- Reported: 2026-10-29
- AI role: llm_generated_malware
- Entry: https://openattacks.ai/attacks/talos-nik-c2-implant-runs-operator-2026-10/

## Summary
Talos found a Go-based C2 framework with live infrastructure whose implant sends operator prompts to OpenAI from the infected host, preferring the victim's own OpenAI key so the calls trace back to the victim.

## Category
adversary-use-of-ai

## Attribution
Unnamed (operators of the NIK C2 framework)

- Motivation: cybercrime

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
- OpenAI Chat Completions API (default gpt-4; victim's OPENAI_API_KEY used when present)

### Other tooling
- unknown

## Source notes
Imported from the AI Threat Watch Notion feed (an automated daily scan); not yet editorially reviewed. Feed severity: Medium. Feed novelty: Evolution.

## Sources
- <https://blog.talosintelligence.com/nik-c2-new-ai-enabled-framework/> — Cisco Talos
- <https://thehackernews.com/2026/10/threatsday-critical-firewall-flaws.html>
