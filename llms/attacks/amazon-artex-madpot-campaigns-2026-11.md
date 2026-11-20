# Amazon MadPot records ARTEX agents hunting AI provider keys and attempting exchange KYC deepfakes

- ID: amazon-artex-madpot-campaigns-2026-11
- Reported: 2026-11-13
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/amazon-artex-madpot-campaigns-2026-11/

## Summary
Amazon Threat Intelligence (CJ Moses, AWS Security Blog, 13 November 2026) says that from 3 October to 5 November 2026, MadPot decoys configured as popular LLM chat-completion APIs received requests from AI agents. The requests carried persistent task context, system prompts, tool histories, knowledge-graph state, and reported findings. Amazon assesses with moderate confidence that the agents ran on ARTEX, from prompt references to ARTEX tooling and other ARTEX artifacts, and with moderate confidence that the operators were disparate Chinese-nexus groups, from simplified Chinese prompts, China time-zone settings, targeting consistent with Chinese interests, and tooling predominantly used by Chinese-nexus threats. Standing instructions set mission, targeting, and constraints, including a fixed country sequence, a preference for enterprise production sites over personal projects, a ban on mainland China targets and government domains, and a requirement that outbound traffic use proxies. Credentials exposed for more than 30 days were to be treated as low-value. Most activity split work across planner, worker, verification, and compression agents sharing a knowledge graph. Campaign 1, in the agents' records, hunted internet-exposed AI gateways and application builders, extracted upstream provider keys, validated them, and pooled them. Named targets were One API, New API, Veloera, Sub2API, LiteLLM, Dify, FastGPT, Langflow, RAGFlow, Open WebUI, LobeChat, and Ollama. The recorded playbook mapped each product to known chains, including uninitialized installs, anonymous management and provider-configuration endpoints, the LiteLLM default master key, CVE-2025-3248 (Langflow), CVE-2026-28797 (RAGFlow), an isCliRequest authentication bypass on One API family systems, SSRF through URL-fetch features to cloud metadata services, and secrets in client-side JavaScript, source maps, debug routes, and environment files. Discovery used internet scanning, certificate transparency, GitHub repositories and event archives, npm and PyPI tarballs, container layers, notebooks, model-hosting spaces, paste sites, and Telegram. Stolen keys were fed into the framework gateway so stolen inference funded more hunting. Cloud credentials were validated, storage was enumerated, and managed AI services, secrets stores, and application identities were prioritized over general cloud permissions. Leads were graded L1, L2 for a working API call, and L3 for quantified impact. Campaign 2, in concurrent sessions against two cryptocurrency exchanges, attempted real-time deepfake video for liveness checks and forged ID-document photos. The agents' records say the vendor's server-side verdict rejected the deepfake on every recorded attempt. Amazon did not say whether the forged document photos passed. At least four sessions ran at once, on cash-out, balances, the deepfake pipeline, and the verification bypass. Amazon did not observe the described activity on other organizations as it happened and cannot verify the outcomes the agents reported. It notified potentially affected AWS customers. Community forks that answered HTTP 200 on 16 November 2026 are https://github.com/RuoJi6/ARTEX and https://github.com/MoLeft/ARTEX. The original Autumn-27/ARTEX repository returned HTTP 404.

## Category
adversary-use-of-ai

## Attribution
Unnamed Chinese-nexus groups. Amazon Threat Intelligence, moderate confidence, from simplified Chinese prompts, China time zones, targeting, and tooling. Financially motivated. Not a single named cluster.

- Actor: Unnamed Chinese-nexus groups
- Country: China
- Motivation: financially-motivated
- Attributed by: Amazon Threat Intelligence
- Confidence: medium

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: The agents' records describe exposed AI management interfaces, default credentials, known product flaws, and public artifact searches. Amazon did not observe those intrusions on customer or third-party systems.
- Victims and sectors: Agents' records describe hundreds of targets across AI application platforms and other workloads, plus two cryptocurrency exchanges. Amazon notified potentially affected AWS customers. No organization is named here.
- Regions: unknown
- Region notes: Amazon describes a fixed country sequence and an instruction to exclude mainland China and government domains. It does not name the countries of the hundreds of targets or of the two exchanges. Those instructions are not recorded as victim regions.
- Scale and metrics: MadPot collection window 3 October through 5 November 2026. The records describe hundreds of targets. Campaign 2 names two cryptocurrency exchanges and at least four concurrent agent sessions. Every recorded liveness verdict rejected the deepfake. No confirmed victim count was published.

## Attack flow
### instruct: Standing instructions set the mission (access)

Operators gave ARTEX agents objectives, a country sequence, proxy rules, and grading for stolen credentials. The agents then worked inside those instructions.

Evidence: <https://aws.amazon.com/blogs/security/amazon-threat-intelligence-observes-threat-actors-running-cybercrime-campaigns-with-artex-ai-agents/>

### gateways: Agents hunt exposed AI gateways (ai)

Planner, worker, verification, and compression agents share a knowledge graph and record searches for One API, New API, Veloera, Sub2API, LiteLLM, Dify, FastGPT, Langflow, RAGFlow, Open WebUI, LobeChat, and Ollama.

Evidence: <https://aws.amazon.com/blogs/security/amazon-threat-intelligence-observes-threat-actors-running-cybercrime-campaigns-with-artex-ai-agents/>

### keys: Stolen keys fund more hunting (impact)

The records describe keys being validated, graded, pooled, and supplied to the framework gateway. Amazon cannot verify those outcomes.

Evidence: <https://aws.amazon.com/blogs/security/amazon-threat-intelligence-observes-threat-actors-running-cybercrime-campaigns-with-artex-ai-agents/>

### kyc: Deepfake KYC at two exchanges (ai)

Separate concurrent sessions record real-time deepfake video and forged ID photos aimed at two cryptocurrency exchanges.

Evidence: <https://aws.amazon.com/blogs/security/amazon-threat-intelligence-observes-threat-actors-running-cybercrime-campaigns-with-artex-ai-agents/>

### rejected: Liveness checks reject the deepfake (impact)

The vendor's server-side verdict rejected the deepfake on every attempt the agents recorded. The document-photo result was not stated.

Evidence: <https://aws.amazon.com/blogs/security/amazon-threat-intelligence-observes-threat-actors-running-cybercrime-campaigns-with-artex-ai-agents/>

### Connections

- instruct -> gateways
- gateways -> keys
- instruct -> kyc
- kyc -> rejected

## MITRE ATLAS
- [AML.T0016.001](https://atlas.mitre.org/techniques/AML.T0016.001) Software Tools — Amazon assesses the captured agents were running the ARTEX offensive framework.
  Evidence: <https://aws.amazon.com/blogs/security/amazon-threat-intelligence-observes-threat-actors-running-cybercrime-campaigns-with-artex-ai-agents/>
- [AML.T0055](https://atlas.mitre.org/techniques/AML.T0055) Unsecured Credentials — The recorded playbook steals provider keys from exposed gateways, default credentials, client-side JavaScript, source maps, debug routes, and environment files.
  Evidence: <https://aws.amazon.com/blogs/security/amazon-threat-intelligence-observes-threat-actors-running-cybercrime-campaigns-with-artex-ai-agents/>
- [AML.T0012](https://atlas.mitre.org/techniques/AML.T0012) Valid Accounts — Stolen keys were validated with provider identity services and fed into the framework gateway as working credentials.
  Evidence: <https://aws.amazon.com/blogs/security/amazon-threat-intelligence-observes-threat-actors-running-cybercrime-campaigns-with-artex-ai-agents/>
- [AML.T0088](https://atlas.mitre.org/techniques/AML.T0088) Generate Deepfakes — A second campaign recorded real-time deepfake video and forged ID photos aimed at cryptocurrency-exchange KYC checks. Recorded liveness verdicts rejected the deepfake.
  Evidence: <https://aws.amazon.com/blogs/security/amazon-threat-intelligence-observes-threat-actors-running-cybercrime-campaigns-with-artex-ai-agents/>

## Prevention
Put AI gateways, application builders, and inference endpoints under the same controls as other production systems. Change default credentials, including the LiteLLM default master key, and do not leave an install uninitialized. Remove unauthenticated management and provider-configuration endpoints. Review Langflow for CVE-2025-3248 and RAGFlow for CVE-2026-28797, and do not trust an isCliRequest header as authentication on One API family systems. Alert on URL-fetch features that can reach cloud metadata, and on secrets in client-side JavaScript, source maps, debug routes, and environment files. Watch provider spend. Treat the published IPs as MadPot observations of agent traffic in the stated windows, and corroborate them before blocking.

## Detections
- [Web Server Cloud Metadata SSRF Request](https://github.com/elastic/detection-rules/blob/main/rules/cross-platform/credential_access_web_server_cloud_imds_ssrf_request.toml) (elastic) — Matched SSRF and 169.254.169.254 with security-detections-mcp. Web-server URL or query hitting a cloud metadata endpoint. Amazon's captured playbook includes SSRF through URL-fetch features to cloud metadata. Amazon did not confirm each attempt succeeded.
- [Cloud Instance Metadata Credential Path HTTP Request](https://github.com/elastic/detection-rules/blob/main/rules/network/credential_access_cloud_imds_credential_http_request.toml) (elastic) — Matched 169.254.169.254 with security-detections-mcp. HTTP GET to a metadata credential path. Same playbook item, seen on packet capture rather than the web-server log.
- [Ollama API Accessed from External Network](https://github.com/elastic/detection-rules/blob/main/rules/cross-platform/initial_access_ollama_api_external_access.toml) (elastic) — Matched Ollama with security-detections-mcp. Ollama is one of the exposed AI applications the agents' records say they hunted. The rule flags an unauthenticated Ollama API accepting an external connection. It does not identify ARTEX.
- No rule for the KYC deepfake or the named gateway flaws (guidance) — security-detections-mcp searches for deepfake, KYC, liveness, Langflow, RAGFlow, default credential, master key, and source map returned no Sigma, Splunk, or Elastic rule for this activity. A master-key hit was Windows DPAPI, which is a different control. Hunt the LiteLLM default master key, CVE-2025-3248, CVE-2026-28797, the One API family isCliRequest authentication bypass, and secrets in JavaScript bundles, source maps, debug routes, and environment files. There is no detection rule in the index for a rejected liveness deepfake.

## Timeline
- First seen: 2026-10-03
- Last updated: 2026-11-16
- 2026-11-13 (Amazon Threat Intelligence): CJ Moses publishes the MadPot capture of ARTEX agent memory for 3 October through 5 November 2026, including the credential-hunting playbook, the rejected KYC deepfakes, and eleven IP addresses.
- 2026-11-16 (OpenAttacks): Entry added from the Amazon blog and The Hacker News restatement. Community fork URLs were checked, and the detection rules above were taken from security-detections-mcp matches whose pages returned HTTP 200.

## Tools
### AI tooling and models
- [ARTEX](https://github.com/RuoJi6/ARTEX) (https://github.com/RuoJi6/ARTEX) — Community-maintained fork; the original repository is unavailable. MoLeft/ARTEX also returned HTTP 200 on 2026-11-16. The original Autumn-27/ARTEX repository returned HTTP 404.
- [ARTEX](https://github.com/RuoJi6/ARTEX) (https://github.com/MoLeft/ARTEX) — Community-maintained fork; the original repository is unavailable. MoLeft/ARTEX also returned HTTP 200 on 2026-11-16. The original Autumn-27/ARTEX repository returned HTTP 404.
- LLM chat-completion APIs, as presented by MadPot
- One API
- New API
- Veloera
- Sub2API
- LiteLLM
- Dify
- FastGPT
- Langflow
- RAGFlow
- Open WebUI
- LobeChat
- [Ollama](https://github.com/ollama/ollama)

### Other tooling
- unknown

### Offensive frameworks
- [ARTEX](https://openattacks.ai/tools/artex/) (`artex`)

## Source notes
The campaigns, the moderate-confidence attribution, the product list, the CVEs, the isCliRequest bypass, the SSRF and secret locations, the knowledge-graph roles, the two exchanges, the rejected liveness checks, and the eleven IPs are from the Amazon blog. Amazon states that it did not watch the off-decoy activity and cannot verify agent-reported outcomes. The Hacker News article of 16 November 2026 restates that blog. It also discusses Cloudflare and other ARTEX reporting that is not part of this entry. The Hacker News flaw table says Langflow versions before 1.3.0 are affected by CVE-2025-3248; Amazon's blog names the CVE and does not give that version range. https://github.com/RuoJi6/ARTEX and https://github.com/MoLeft/ARTEX returned HTTP 200 on 16 November 2026. https://github.com/Autumn-27/ARTEX returned HTTP 404 and is not linked. Mainland China appears only as an operator exclusion, not as a victim region.

## Sources
- [Amazon Threat Intelligence observes threat actors running cybercrime campaigns with ARTEX AI agents](https://aws.amazon.com/blogs/security/amazon-threat-intelligence-observes-threat-actors-running-cybercrime-campaigns-with-artex-ai-agents/) — Amazon
- [Amazon Uncovers AI Agent Campaign Targeting LiteLLM, Dify, and Other Apps for API Keys](https://thehackernews.com/2026/11/amazon-uncovers-ai-agent-campaign.html) — The Hacker News
