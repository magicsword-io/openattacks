# GTIG LLMJacking - UNC6993, Jet Night, D1337-KAIROS monetize cloud models

- ID: gtig-llmjacking-unc6993-2026-11
- Reported: 2026-11-02
- AI role: ai_infra_as_c2
- Entry: https://openattacks.ai/attacks/gtig-llmjacking-unc6993-2026-11/

## Summary
Multiple threat clusters (UNC6993, Jet Night operators, D1337-KAIROS) hijack enterprise access to LLMs across AWS Bedrock, Azure, GCP. Initial access via exposed cloud identity tokens (IAM, Service Account keys, GitHub PATs, session tokens), stolen LLM API keys from public GitHub, exploited web app vulnerabilities, LiteLLM CVE-2026-40217 (/key/regenerate endpoint rebind). UNC6993 used session hijacking page masquerading as app portal to steal JSON payloads with active access tokens. Threat actors enable LLM services, create API keys, provision GPUs, subscribe Pay-As-You-Go, deploy LiteLLM/new-api/gcli2api gateways, host Manus agent framework with SearXNG metasearch. Monetize via LLM Mixers (Jet Night at jet-night.com $60/month unlimited, ai-relay on lookalike domains, newapi.pro). Stealthy credential validation sweeps with max_tokens=1. Fraudulent charges $100K in single day, cumulative $1M per org. Division of labor between initial access and downstream monetization.

## Category
uncategorized

## Attribution
UNC6993 (Mandiant); Jet Night operators; D1337-KAIROS persona; multiple financially motivated threat clusters operating globally; division of labor between initial access operators and LLM Mixer monetization operators

## AI involvement confidence
not assessed

## Attack flow
### initial-access: Compromised cloud identity and LLM API keys (access)

Misconfigured Service Account keys; session hijacking page for LLM portal JSON payloads; stolen GitHub PATs + web app vuln; compromised IAM with federation tokens; exposed LLM API keys harvested from public GitHub; stealthy validation sweeps with max_tokens=1

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/llmjacking-monetizing-compromised-cloud-models>

### lateral-persistence: Privilege escalation and persistence (execution)

Enumerated cloud services/repos/data stores; cloned codebases for secrets; queried data warehouse metadata; exploited LiteLLM CVE-2026-40217 (/key/regenerate rebind) to elevate Virtual Keys to PROXY_ADMIN; created unauthorized IAM/service accounts; injected SSH keys; attached admin policies; created backdoor accounts disguised as billing utilities

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/llmjacking-monetizing-compromised-cloud-models>

### llm-abuse: LLM resource hijacking (ai)

Enabled managed generative platforms; created additional API keys; subscribed Pay-As-You-Go; selected premium models; launched high-volume inference; 'burn and rotate' short-lived service accounts; provisioned GPU instances; requested quota increases; deployed LiteLLM gateways; hosted Manus agent framework with SearXNG metasearch and sandbox execution

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/llmjacking-monetizing-compromised-cloud-models>

### monetization: LLM Mixer resale (impact)

UNC6993 deployed new-api and gcli2api to aggregate stolen keys and balance loads; Jet Night (jet-night.com) $60/month unlimited token plan powered by stolen keys, passed ~$1M costs to victim; ai-relay on lookalike domains siphons access to newapi.pro resale ecosystem; D1337-KAIROS persona with Node.js proxy bundles; division of labor between access and monetization operators

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/llmjacking-monetizing-compromised-cloud-models>

### charges: Fraudulent billing (impact)

UNC6993 accumulated $100K+ charges quickly; cumulative charges at orgs reaching $1M; one actor 800K Bedrock calls over 30 hours (Opus 75% of calls), another 1.7M calls over 13 hours; token usage profile resembles resold coding-agent traffic with prompt caching; $100K+ estimated usage at list price for two documented cases

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/llmjacking-monetizing-compromised-cloud-models>

### Connections

- initial-access -> lateral-persistence
- lateral-persistence -> llm-abuse
- llm-abuse -> monetization
- llm-abuse -> charges
- monetization -> charges

## MITRE ATLAS
- [AML.T0012](https://atlas.mitre.org/techniques/AML.T0012) Valid Accounts — Threat actors hijack enterprise LLM infrastructure (AWS Bedrock, Azure Cognitive Services, GCP Gemini) to conduct LLMJacking
  Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/llmjacking-monetizing-compromised-cloud-models>
- [AML.T0034](https://atlas.mitre.org/techniques/AML.T0034) Cost Harvesting — Actors exploit LiteLLM gateway CVE-2026-40217 (/key/regenerate endpoint user ID rebind) to escalate Virtual Keys to PROXY_ADMIN master admin credentials
  Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/llmjacking-monetizing-compromised-cloud-models>

## Prevention
IAM least privilege; centralized secrets management; code monitoring for API keys; routine config audits; rate limiting via Cloud Armor; network allow listing; budget alerts and API quotas; phishing-resistant MFA; shadow LLM discovery; granular API key scopes; validation sweep monitoring (max_tokens=1); vulnerability/ML supply chain patching; gateway patch management (LiteLLM CVE-2026-40217); sandboxed execution; vetted model repositories; graph-based exposure modeling

## Detections
No detections are recorded.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- [AWS Bedrock](https://aws.amazon.com/bedrock/)
- Azure Cognitive Services
- GCP [Gemini](https://gemini.google.com/) Enterprise Agent Platform
- LiteLLM gateway
- new-api (centralized model hub and gateway)
- gcli2api (API proxy tool)
- Manus agent framework
- SearXNG metasearch
- agent-infra/sandbox execution environments

### Other tooling
- Jet Night reseller (jet-night.com)
- D1337-KAIROS persona
- ai-relay custom proxy infrastructure
- newapi.pro resale ecosystem
- [Node.js](https://github.com/nodejs/node) proxy bundles
- Burn and rotate service account strategy

## Sources
- [The Rise of LLMJacking - How Threat Actors Monetize Compromised Cloud and Model Resources](https://cloud.google.com/blog/topics/threat-intelligence/llmjacking-monetizing-compromised-cloud-models)
