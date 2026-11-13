# UNC4899 (PUKCHONG) Gemini for exploit and tooling R&D

- ID: unc4899-pukchong-gemini-2025
- Reported: 2025-11-05
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/unc4899-pukchong-gemini-2025/

## Summary
DPRK UNC4899 (PUKCHONG), known for supply-chain compromise, used Gemini for code development, exploit research, and tooling improvements targeting edge devices and modern browsers.

## Category
adversary-use-of-ai

## Attribution
UNC4899 aka PUKCHONG; DPRK

- Actor: UNC4899 aka PUKCHONG

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: unknown
- Victims and sectors: unknown
- Regions: unknown
- Region notes: unknown
- Scale and metrics: unknown

## Attack flow
### step-1: Actor requests exploit research support (access)

UNC4899 researches edge devices and modern browsers.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/>

### step-2: Gemini supports development (ai)

The model helps with code, exploit research and tooling improvements.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/>

### step-3: Existing offensive tooling is refined (execution)

The source describes development assistance to an actor known for supply-chain compromise.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/>

### step-4: Specific deployment is undisclosed (unknown)

The seed does not connect each model interaction to a confirmed victim intrusion.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0016.002](https://atlas.mitre.org/techniques/AML.T0016.002) Generative AI — The supplied source explicitly describes generative-model tooling assisting the reported activity; this mapping does not establish additional autonomy or victim impact.
  Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/>

## Prevention
Supply-chain integrity; browser/edge device patching

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in UNC4899 (PUKCHONG) Gemini for exploit and tooling R&D. Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- [Gemini](https://gemini.google.com/)

### Other tooling
- unknown

## Source notes
unknown

## Sources
- <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/>
