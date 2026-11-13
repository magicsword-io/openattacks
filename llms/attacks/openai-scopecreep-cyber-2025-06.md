# OpenAI disruption: ScopeCreep cyber operation

- ID: openai-scopecreep-cyber-2025-06
- Reported: 2025-06-01
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/openai-scopecreep-cyber-2025-06/

## Summary
OpenAI June 2025 threat report case study 'ScopeCreep' details a cyber operation disrupted for malicious use of ChatGPT in support of intrusion/malware workflows (AI built into existing attacker workflows rather than novel end-to-end autonomy).

## Category
adversary-use-of-ai

## Attribution
ScopeCreep (OpenAI designation)

- Actor: ScopeCreep (OpenAI designation)

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: unknown
- Victims and sectors: unknown
- Regions: unknown
- Region notes: unknown
- Scale and metrics: Part of OpenAI's broader 40+ network disruptions since Feb 2024 reporting began

## Attack flow
### step-1: ScopeCreep accounts seek assistance (access)

Operators use ChatGPT in an existing cyber operation.

Evidence: <https://cdn.openai.com/threat-intelligence-reports/5f73af09-a3a3-4a55-992e-069237681620/disrupting-malicious-uses-of-ai-june-2025.pdf>

### step-2: Model supports intrusion and malware work (ai)

The supplied entry establishes assistance without a detailed exploit chain.

Evidence: <https://cdn.openai.com/threat-intelligence-reports/5f73af09-a3a3-4a55-992e-069237681620/disrupting-malicious-uses-of-ai-june-2025.pdf>

### step-3: Tactical sequence is not disclosed (unknown)

Specific commands, initial access and victims are not described in the seed record.

Evidence: <https://cdn.openai.com/threat-intelligence-reports/5f73af09-a3a3-4a55-992e-069237681620/disrupting-malicious-uses-of-ai-june-2025.pdf>

### step-4: OpenAI disrupts malicious use (impact)

The reporting concerns disruption of the operation’s use of the service.

Evidence: <https://cdn.openai.com/threat-intelligence-reports/5f73af09-a3a3-4a55-992e-069237681620/disrupting-malicious-uses-of-ai-june-2025.pdf>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0016.002](https://atlas.mitre.org/techniques/AML.T0016.002) Generative AI — The supplied source explicitly describes generative-model tooling assisting the reported activity; this mapping does not establish additional autonomy or victim impact.
  Evidence: <https://cdn.openai.com/threat-intelligence-reports/5f73af09-a3a3-4a55-992e-069237681620/disrupting-malicious-uses-of-ai-june-2025.pdf>

## Prevention
Provider-side abuse detection; defender focus remains on resulting malware TTPs

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in OpenAI disruption: ScopeCreep cyber operation. Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- [ChatGPT](https://chatgpt.com/)

### Other tooling
- unknown

## Source notes
unknown

## Sources
- <https://cdn.openai.com/threat-intelligence-reports/5f73af09-a3a3-4a55-992e-069237681620/disrupting-malicious-uses-of-ai-june-2025.pdf>
