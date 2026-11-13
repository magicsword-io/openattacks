# APT41 Gemini-assisted OSSTUN C2 development

- ID: apt41-gemini-c2-osstun-2025-08
- Reported: 2025-11-05
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/apt41-gemini-c2-osstun-2025-08/

## Summary
PRC APT41 used Gemini in Aug 2025 for C++/Golang assistance on tools including a C2 framework called OSSTUN and for help with public obfuscation libraries.

## Category
adversary-use-of-ai

## Attribution
APT41; PRC-backed

- Actor: APT41
- Country: China
- Motivation: nation-state
- Attributed by: Google GTIG
- Confidence: high

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: unknown
- Victims and sectors: unknown
- Regions: unknown
- Region notes: unknown
- Scale and metrics: unknown

## Attack flow
### step-1: Actor brings development tasks (access)

APT41 seeks help with C++ and Go tooling.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/>

### step-2: Gemini provides code assistance (ai)

Requests cover OSSTUN command-and-control development and obfuscation libraries.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/>

### step-3: C2 development is supported (execution)

Model outputs assist an existing offensive development workflow.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/>

### step-4: Specific deployments are undisclosed (unknown)

The supplied entry does not identify victims of the assisted OSSTUN development.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0016.002](https://atlas.mitre.org/techniques/AML.T0016.002) Generative AI — The supplied source explicitly describes generative-model tooling assisting the reported activity; this mapping does not establish additional autonomy or victim impact.
  Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/>

## Prevention
Standard APT41 detections; AI assistance does not change post-exploitation signals

## Detections
No detections are recorded.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- [Gemini](https://gemini.google.com/)

### Other tooling
- OSSTUN C2
- C++/Go obfuscation libraries

## Source notes
unknown

## Sources
- <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/>
