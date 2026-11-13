# OpenAI disruption: Phish and Scripts cyber cluster

- ID: openai-phish-and-scripts-2025-10
- Reported: 2025-10-01
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/openai-phish-and-scripts-2025-10/

## Summary
October 2025 OpenAI report documents Chinese-language accounts using ChatGPT for phishing and malware campaign help, including research into further automation via DeepSeek—illustrating multi-model hopping.

## Category
adversary-use-of-ai

## Attribution
Chinese-language cyber cluster (OpenAI)

- Actor: Chinese-language cyber cluster (OpenAI)

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: unknown
- Victims and sectors: unknown
- Regions: unknown
- Region notes: unknown
- Scale and metrics: unknown

## Attack flow
### step-1: Operators request campaign assistance (access)

Chinese-language accounts ask for phishing and malware support.

Evidence: <https://cdn.openai.com/threat-intelligence-reports/7d662b68-952f-4dfd-a2f2-fe55b041cc4a/disrupting-malicious-uses-of-ai-october-2025.pdf>

### step-2: ChatGPT assists the workflow (ai)

The report also describes investigation of further automation through DeepSeek.

Evidence: <https://cdn.openai.com/threat-intelligence-reports/7d662b68-952f-4dfd-a2f2-fe55b041cc4a/disrupting-malicious-uses-of-ai-october-2025.pdf>

### step-3: Multi-model preparation continues (execution)

Model outputs support existing campaign preparation and scripting.

Evidence: <https://cdn.openai.com/threat-intelligence-reports/7d662b68-952f-4dfd-a2f2-fe55b041cc4a/disrupting-malicious-uses-of-ai-october-2025.pdf>

### step-4: OpenAI disrupts the accounts (impact)

The supplied record reports account disruption rather than a complete victim intrusion chain.

Evidence: <https://cdn.openai.com/threat-intelligence-reports/7d662b68-952f-4dfd-a2f2-fe55b041cc4a/disrupting-malicious-uses-of-ai-october-2025.pdf>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0016.002](https://atlas.mitre.org/techniques/AML.T0016.002) Generative AI — The supplied source explicitly describes generative-model tooling assisting the reported activity; this mapping does not establish additional autonomy or victim impact.
  Evidence: <https://cdn.openai.com/threat-intelligence-reports/7d662b68-952f-4dfd-a2f2-fe55b041cc4a/disrupting-malicious-uses-of-ai-october-2025.pdf>

## Prevention
Multi-model abuse monitoring; phishing defenses against AI-polished lures

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in OpenAI disruption: Phish and Scripts cyber cluster. Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- [ChatGPT](https://chatgpt.com/)
- [DeepSeek](https://github.com/deepseek-ai) (researched for automation)

### Other tooling
- unknown

## Source notes
unknown

## Sources
- <https://cdn.openai.com/threat-intelligence-reports/7d662b68-952f-4dfd-a2f2-fe55b041cc4a/disrupting-malicious-uses-of-ai-october-2025.pdf>
