# LLMjacking expands to DeepSeek

- ID: llmjacking-deepseek-sysdig-2025-02
- Reported: 2025-02-07
- AI role: ai_credential_theft
- Entry: https://openattacks.ai/attacks/llmjacking-deepseek-sysdig-2025-02/

## Summary
Within days of DeepSeek virality, LLMjacking proxies added DeepSeek alongside OpenAI, AWS, Azure. Sysdig observed dozen+ proxy servers on stolen credentials; notes Microsoft lawsuit against actors abusing GenAI services (DALL-E abusive content).

## Category
attacks-on-ai

## Attribution
unknown

## AI involvement confidence
confirmed

## Attack flow
### step-1: Original credential theft is undisclosed (unknown)

The entry begins with already-stolen service credentials.

Evidence: <https://www.sysdig.com/blog/llmjacking-targets-deepseek>

### step-2: Proxy operators add service support (execution)

LLMjacking proxies add DeepSeek to other inference providers.

Evidence: <https://www.sysdig.com/blog/llmjacking-targets-deepseek>

### step-3: Stolen accounts provide inference access (ai)

Requests are routed through unauthorized service credentials.

Evidence: <https://www.sysdig.com/blog/llmjacking-targets-deepseek>

### step-4: AI access is resold or abused (impact)

The report describes more than a dozen proxy servers using stolen credentials.

Evidence: <https://www.sysdig.com/blog/llmjacking-targets-deepseek>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0012](https://atlas.mitre.org/techniques/AML.T0012) Valid Accounts — Stolen service credentials provide unauthorized inference access.
  Evidence: <https://www.sysdig.com/blog/llmjacking-targets-deepseek>

## Prevention
Same as LLMjacking: key hygiene, Bedrock/OpenAI anomaly detection, proxy hunting

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in LLMjacking expands to DeepSeek. Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- [DeepSeek](https://github.com/deepseek-ai)
- OpenAI
- AWS
- Azure

### Other tooling
- unknown

## Sources
- <https://www.sysdig.com/blog/llmjacking-targets-deepseek>
