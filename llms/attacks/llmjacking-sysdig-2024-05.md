# LLMjacking via stolen cloud credentials (Sysdig)

- ID: llmjacking-sysdig-2024-05
- Reported: 2024-05-06
- AI role: ai_credential_theft
- Entry: https://openattacks.ai/attacks/llmjacking-sysdig-2024-05/

## Summary
After a Laravel CVE-2021-3129 foothold, attackers stole cloud credentials and probed ten AI services (AI21, Anthropic, AWS Bedrock, Azure, ElevenLabs, MakerSuite, Mistral, OpenAI, OpenRouter, and GCP Vertex) to resell LLM access via reverse proxies while victims paid inference bills. Later Sysdig reporting showed 85,000+ Bedrock requests with Converse API abuse within 30 days of launch. Pillar Security separately reported the Bizarre Bazaar campaign targeting AI startups for unauthorized inference resale.

## Category
attacks-on-ai

## Attribution
unknown

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Vulnerable Laravel (CVE-2021-3129) leading to cloud credential theft
- Victims and sectors: unknown
- Regions: unknown
- Region notes: unknown
- Scale and metrics: Potential >$46,000/day Claude 2.x costs cited; July 2024 spike 61k Bedrock requests in 3 hours

## Attack flow
### step-1: Vulnerable Laravel provides a foothold (access)

The report identifies CVE-2021-3129 before credential theft.

Evidence: <https://www.sysdig.com/blog/llmjacking-stolen-cloud-credentials-used-in-new-ai-attack> <https://www.sysdig.com/blog/growing-dangers-of-llmjacking>

### step-2: Cloud credentials are stolen (execution)

Attackers obtain keys and probe multiple AI providers.

Evidence: <https://www.sysdig.com/blog/llmjacking-stolen-cloud-credentials-used-in-new-ai-attack> <https://www.sysdig.com/blog/growing-dangers-of-llmjacking>

### step-3: Inference access is proxied (ai)

Authorized model access is resold through attacker reverse proxies.

Evidence: <https://www.sysdig.com/blog/llmjacking-stolen-cloud-credentials-used-in-new-ai-attack> <https://www.sysdig.com/blog/growing-dangers-of-llmjacking>

### step-4: Victim accounts incur inference usage (impact)

The report describes high-volume requests and potentially substantial costs.

Evidence: <https://www.sysdig.com/blog/llmjacking-stolen-cloud-credentials-used-in-new-ai-attack> <https://www.sysdig.com/blog/growing-dangers-of-llmjacking>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0012](https://atlas.mitre.org/techniques/AML.T0012) Valid Accounts — Stolen cloud credentials are used to access inference services.
  Evidence: <https://www.sysdig.com/blog/llmjacking-stolen-cloud-credentials-used-in-new-ai-attack> <https://www.sysdig.com/blog/growing-dangers-of-llmjacking>

## Prevention
Monitor Bedrock ListFoundationModels+Invoke/Converse from long-term AKIA keys; rotate exposed keys; SCP restrict Bedrock

## Detections
- Monitor AWS Bedrock API abuse (guidance) — Alert on unusual Bedrock ListFoundationModels, InvokeModel, and Converse API calls, especially from AKIA long-term keys. Monitor for spike patterns (e.g., 61k requests in 3 hours). Implement CloudTrail analysis for Bedrock usage from unexpected geolocations or IAM principals.
- Detect stolen cloud credentials (guidance) — Scan for exposed AWS keys in public repositories, logs, and error tracking services. Rotate credentials immediately upon detection. Use SCPs to restrict Bedrock access to approved principals only.

## Timeline
- First seen: 2024-05-06
- Last updated: 2026-11-05
- 2024-05-06 (Sysdig): Initial LLMjacking disclosure; Laravel CVE-2021-3129 to cloud credential theft and AI inference resale
- 2024-07-01 (Sysdig): Bedrock Converse API abuse observed; 85k+ requests within 30 days of launch
- 2026-01-28 (Pillar Security): Bizarre Bazaar campaign targets AI startups with LLMjacking
- 2026-09-03 (FortiGuard): AWS Bedrock Marketplace abuse; attackers subscribe victims to high-cost models without approval
- 2026-09-09 (Okta Security): Stolen AI session tokens enable LLMjacking without long-term credentials; bypasses MFA and key rotation

## Tools
### AI tooling and models
- [AWS Bedrock](https://aws.amazon.com/bedrock/) [Claude](https://claude.com/product/overview) v2/v3
- OpenAI
- Anthropic
- Azure
- [Vertex AI](https://cloud.google.com/vertex-ai)
- others in probe list

### Other tooling
- LLM reverse proxy for resale

## Source notes
2026 updates expand LLMjacking scope: Bedrock Marketplace abuse (FortiGuard), AI startup targeting (Pillar Bizarre Bazaar), and session token theft (Okta)

## Sources
- [Sysdig: LLMjacking - Stolen Cloud Credentials Used in New AI Attack](https://www.sysdig.com/blog/llmjacking-stolen-cloud-credentials-used-in-new-ai-attack)
- [Sysdig: Growing Dangers of LLMjacking](https://www.sysdig.com/blog/growing-dangers-of-llmjacking)
- [Pillar Security: Bizarre Bazaar - LLMjacking Campaign Targeting AI Startups](https://www.pillar.io/blog/bizarre-bazaar-llmjacking-jan-2026)
