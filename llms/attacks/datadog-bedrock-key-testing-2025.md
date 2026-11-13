# Exposed AWS keys mass-tested for Bedrock LLMjacking

- ID: datadog-bedrock-key-testing-2025
- Reported: 2025-06-01
- AI role: ai_credential_theft
- Entry: https://openattacks.ai/attacks/datadog-bedrock-key-testing-2025/

## Summary
Datadog documents automated testing of exposed AWS keys specifically for Amazon Bedrock access (ListFoundationModels / Invoke / Converse patterns), showing LLMjacking reconnaissance at internet scale beyond generic AWS abuse.

## Category
attacks-on-ai

## Attribution
unknown

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: unknown
- Victims and sectors: unknown
- Regions: unknown
- Region notes: unknown
- Scale and metrics: unknown

## Attack flow
### step-1: Exposed AWS keys are collected (access)

Attackers obtain credentials exposed outside the legitimate account boundary.

Evidence: <https://securitylabs.datadoghq.com/articles/beyond-valid-credentials-how-exposed-aws-keys-are-tested-for-amazon-bedrock-access/>

### step-2: Automated key tests run (execution)

Requests check model listing, invocation and conversation permissions.

Evidence: <https://securitylabs.datadoghq.com/articles/beyond-valid-credentials-how-exposed-aws-keys-are-tested-for-amazon-bedrock-access/>

### step-3: Bedrock access is identified (ai)

Testing distinguishes keys that can use model inference services.

Evidence: <https://securitylabs.datadoghq.com/articles/beyond-valid-credentials-how-exposed-aws-keys-are-tested-for-amazon-bedrock-access/>

### step-4: Per-key abuse is not quantified (unknown)

The supplied entry establishes reconnaissance at scale, rather than a bill or victim count for every key.

Evidence: <https://securitylabs.datadoghq.com/articles/beyond-valid-credentials-how-exposed-aws-keys-are-tested-for-amazon-bedrock-access/>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0012](https://atlas.mitre.org/techniques/AML.T0012) Valid Accounts — Exposed AWS credentials are tested for model-service access.
  Evidence: <https://securitylabs.datadoghq.com/articles/beyond-valid-credentials-how-exposed-aws-keys-are-tested-for-amazon-bedrock-access/>

## Prevention
Secret scanning; CloudTrail detections for Bedrock enum+invoke from unexpected keys

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in Exposed AWS keys mass-tested for Bedrock LLMjacking. Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- [Amazon Bedrock](https://aws.amazon.com/bedrock/)

### Other tooling
- Stolen AKIA keys

## Source notes
unknown

## Sources
- <https://securitylabs.datadoghq.com/articles/beyond-valid-credentials-how-exposed-aws-keys-are-tested-for-amazon-bedrock-access/>
