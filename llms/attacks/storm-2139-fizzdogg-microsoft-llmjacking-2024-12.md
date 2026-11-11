# Storm-2139 / FizzDogg Azure OpenAI LLMjacking (Microsoft DCU)

- ID: storm-2139-fizzdogg-microsoft-llmjacking-2024-12
- Reported: 2024-12-19
- AI role: ai_credential_theft
- Entry: https://openattacks.ai/attacks/storm-2139-fizzdogg-microsoft-llmjacking-2024-12/

## Summary
Microsoft civil action against Storm-2139 (FizzDogg) network alleged theft of Azure OpenAI credentials and custom tooling to bypass safety controls and generate harmful images via DALL-E/GenAI services at victims' expense.

## Category
adversary-use-of-ai

## Attribution
Storm-2139 / FizzDogg

- Actor: Storm-2139
- Aliases: FizzDogg
- Motivation: cybercrime
- Attributed by: Microsoft Digital Crimes Unit
- Confidence: high

## AI involvement confidence
vendor-asserted

## Attack flow
### step-1: Theft route is not detailed in the seed (unknown)

Microsoft’s civil case alleges stolen Azure OpenAI credentials.

Evidence: <https://www.microsoft.com/en-us/corporate-responsibility/customer-security-trust/digital-crimes-unit/notice-of-pleadings/storm-2139/>

### step-2: Stolen keys access victim resources (access)

The credentials provide unauthorized access to generative services.

Evidence: <https://www.microsoft.com/en-us/corporate-responsibility/customer-security-trust/digital-crimes-unit/notice-of-pleadings/storm-2139/>

### step-3: Custom tooling bypasses safety controls (ai)

The alleged operation generates harmful content through DALL-E and related services.

Evidence: <https://www.microsoft.com/en-us/corporate-responsibility/customer-security-trust/digital-crimes-unit/notice-of-pleadings/storm-2139/>

### step-4: Victim accounts bear the usage (impact)

The civil action describes unauthorized model use at account owners’ expense.

Evidence: <https://www.microsoft.com/en-us/corporate-responsibility/customer-security-trust/digital-crimes-unit/notice-of-pleadings/storm-2139/>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0012](https://atlas.mitre.org/techniques/AML.T0012) Valid Accounts — The civil case alleges use of stolen Azure OpenAI credentials.
  Evidence: <https://www.microsoft.com/en-us/corporate-responsibility/customer-security-trust/digital-crimes-unit/notice-of-pleadings/storm-2139/>

## Prevention
Protect Azure OpenAI keys; monitor anomalous image/model invocation

## Detections
No detections are recorded.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- [Azure OpenAI](https://azure.microsoft.com/en-us/products/ai-foundry/models/openai/)
- DALL-E

### Other tooling
- unknown

## Sources
- <https://www.microsoft.com/en-us/corporate-responsibility/customer-security-trust/digital-crimes-unit/notice-of-pleadings/storm-2139/>
