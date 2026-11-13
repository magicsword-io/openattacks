# Unit 42: LLMs obfuscating malicious JavaScript

- ID: unit42-llm-js-obfuscation-2024
- Reported: 2024-05-01
- AI role: llm_generated_malware
- Entry: https://openattacks.ai/attacks/unit42-llm-js-obfuscation-2024/

## Summary
Showed LLMs can effectively rewrite and obfuscate existing malicious JavaScript to evade detection, while finding fully AI-written malware from scratch less practical at the time.

Evidence qualification: Research demonstration of LLM obfuscation efficacy; not a single named campaign.

## Category
adversary-use-of-ai

## Attribution
unknown

## AI involvement confidence
unverified

## Attack flow
### step-1: Researchers provide malicious JavaScript (access)

The experiment starts with existing code rather than an observed delivery campaign.

Evidence: <https://unit42.paloaltonetworks.com/using-llms-obfuscate-malicious-javascript/>

### step-2: LLMs rewrite and obfuscate the code (ai)

Model output changes the script while retaining malicious behavior.

Evidence: <https://unit42.paloaltonetworks.com/using-llms-obfuscate-malicious-javascript/>

### step-3: Researchers test detection outcomes (execution)

The study compares detection before and after rewriting.

Evidence: <https://unit42.paloaltonetworks.com/using-llms-obfuscate-malicious-javascript/>

### step-4: Demo measures evasion (impact)

The finding concerns obfuscation efficacy, not a separate confirmed victim intrusion.

Evidence: <https://unit42.paloaltonetworks.com/using-llms-obfuscate-malicious-javascript/>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0016.002](https://atlas.mitre.org/techniques/AML.T0016.002) Generative AI — The supplied source explicitly describes generative-model tooling assisting the reported activity; this mapping does not establish additional autonomy or victim impact.
  Evidence: <https://unit42.paloaltonetworks.com/using-llms-obfuscate-malicious-javascript/>

## Prevention
Behavioral JS detections over static signatures

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in Unit 42: LLMs obfuscating malicious JavaScript. Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- Commercial LLMs

### Other tooling
- unknown

## Sources
- <https://unit42.paloaltonetworks.com/using-llms-obfuscate-malicious-javascript/>
