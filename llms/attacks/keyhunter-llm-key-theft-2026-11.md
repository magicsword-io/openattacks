# KeyHunter Operation - LLM API key theft and academic fraud

- ID: keyhunter-llm-key-theft-2026-11
- Reported: 2026-11-04
- AI role: ai_credential_theft
- Entry: https://openattacks.ai/attacks/keyhunter-llm-key-theft-2026-11/

## Summary
Nov 4, 2026: SOCRadar STRU discovered KeyHunter operation by leepsmarts (Chinese-speaking, UTC+8), active since Jan 2026. Two parallel tracks: (1) LLM API key theft: 2,233 API keys harvested (Anthropic, OpenAI, Google, DeepSeek), 12 marked valid (0.54% yield), targeting 247 exposed LLM gateways on PaaS platforms (Vercel, Netlify, Railway, Render, Replit, Streamlit, Fly.io, Cloudflare Pages). Tools scan .env files, GitHub repos, and cloud metadata. (2) Academic fraud: 195 Harvard alumni records from Nov 2025 ShinyHunters torrent, application payment links for Stanford/UChicago/Wake Forest/Case Western/Central Michigan, accounts at NYU/UC Berkeley/Oregon State/UIUC/Colorado State. (3) Financial fraud: Harmony ONE crypto drainer, stolen Stripe merchant keys for card validation, CVVs from Chinese underground market. Infrastructure: 6 servers + Malaysia OpenClaw host, tied by PentAGI CA certificate. AI agents manage operations: Hermes Agent node runs AI_radar cron (every 240min) monitoring X/Twitter, HuggingFace, GitHub, arXiv for new LLM releases/quotas via grok-4.6 + Tavily proxy. Four-phase pipeline: Phase 0 (AI monitoring), Phase 1 (FOFA/Shodan reconnaissance), Phase 2 (env_hunter scans 50+ paths, fadidevv/keyhunter + bigzooooz/KeyHunter GitHub scrapers), Phase 3 (validation), Phase 4 (unified dashboard). OPSEC failure: directory listing on 209.112.91.74 exposed 110 files/37 directories including Telegram bot tokens, operational logs, stolen credentials. CVE-2026-41940 (CVSS 9.8, CISA KEV) exploit staged against UTN Argentina, Arizona Christian University, University of Utah. Real victim seed phrases captured by Harmony ONE drainer.

## Category
attacks-on-ai

## Attribution
leepsmarts (@leepsmartsx), Chinese-speaking, UTC+8, GitHub PRO account

- Actor: leepsmarts
- Aliases: @leepsmartsx
- Country: China
- Motivation: financially-motivated
- Attributed by: SOCRadar STRU
- Confidence: high

## AI involvement confidence
confirmed

## Attack flow
### ai-monitoring: Phase 0: AI-driven intelligence monitoring (ai)

Hermes Agent runs AI_radar cron (240min intervals) using grok-4.6 to monitor X/Twitter, HuggingFace, GitHub, arXiv for new LLM releases, API quotas via Tavily proxy

Evidence: <https://socradar.io/blog/keyhunter-operation-harvard-alumni-stanford-llm-key-data/>

### recon: Phase 1: Reconnaissance (execution)

mscanner-fofa.service + mscanner-shodan.service query FOFA/Shodan for exposed LLM endpoints on Vercel, Netlify, Railway, Render, Replit, Streamlit, Fly.io, Cloudflare Pages; 360 Quake, HFS scanning, Wayback Machine queries

Evidence: <https://socradar.io/blog/keyhunter-operation-harvard-alumni-stanford-llm-key-data/>

### harvest: Phase 2: Credential extraction (access)

env_hunter v4.0 scans 50+ paths (.env, config.json, secrets.toml); fadidevv/keyhunter + bigzooooz/KeyHunter scrape GitHub; 2,233 API keys harvested

Evidence: <https://socradar.io/blog/keyhunter-operation-harvard-alumni-stanford-llm-key-data/>

### validate: Phase 3: Validation (execution)

anthropic_check.py, openai_check.py, cloud_check.py, openrouter_check.py validate keys; 12 marked valid (0.54% yield)

Evidence: <https://socradar.io/blog/keyhunter-operation-harvard-alumni-stanford-llm-key-data/>

### monetize: Phase 4: Monetization and fraud (impact)

Stolen keys used for unauthorized inference; parallel academic fraud (20 universities), crypto drainer (Harmony ONE), credit card fraud via Stripe validation

Evidence: <https://socradar.io/blog/keyhunter-operation-harvard-alumni-stanford-llm-key-data/>

### Connections

- ai-monitoring -> recon
- recon -> harvest
- harvest -> validate
- validate -> monetize

## MITRE ATLAS
- [AML.T0012](https://atlas.mitre.org/techniques/AML.T0012) Valid Accounts — KeyHunter operation harvests LLM API credentials from exposed cloud infrastructure, GitHub repos, and PaaS platforms
  Evidence: <https://socradar.io/blog/keyhunter-operation-harvard-alumni-stanford-llm-key-data/>

## Prevention
Secure .env files and cloud configurations; never expose API keys in GitHub repos or PaaS platforms; monitor cloud metadata endpoints (169.254.169.254); rotate API keys regularly; implement API key usage monitoring; restrict .env access; use secret management solutions (Vault, AWS Secrets Manager); monitor FOFA/Shodan reconnaissance; detect HFS server scanning; alert on Wayback Machine queries for .env files; implement PaaS security best practices

## Detections
- [AWS IMDS Malicious Usage](https://github.com/SigmaHQ/sigma/blob/master/rules/cloud/aws/cloudtrail/aws_cloudtrail_imds_malicious_usage.yml) (sigma) — Detects malicious usage of AWS Instance Metadata Service (IMDS) for credential theft; applies to KeyHunter's cloud metadata harvesting
- Exposed .env file monitoring (guidance) — Monitor for unauthorized access to .env files, config.json, secrets.toml on PaaS platforms; alert on .env.development, .env.prod, .env.staging, .env.backup access patterns
- Cloud metadata endpoint abuse (IMDS) (guidance) — Alert on access to 169.254.169.254, 100.100.100.200 (Alibaba), metadata.google.internal; detect IMDS credential theft attempts
- [Kubernetes Pod Exec Cloud Instance Metadata Access](https://github.com/elastic/detection-rules/blob/main/rules/integrations/kubernetes/credential_access_kubernetes_pod_exec_cloud_instance_metadata.toml) (elastic) — Detects IMDS access from K8s pods; applicable to KeyHunter's cloud metadata harvesting tactics
- [AWS Bedrock AgentCore Runtime Prompt Targeting Credentials](https://github.com/elastic/detection-rules/blob/main/rules/integrations/aws_bedrock_agentcore/credential_access_bedrock_agentcore_runtime_prompt_credential_harvesting.toml) (elastic) — Detects prompts targeting credentials or metadata; relevant for AI-driven credential theft
- GitHub credential harvesting (guidance) — Monitor for keyhunter/KeyHunter tool signatures scanning GitHub repos for API keys; detect mass repository enumeration
- API key validation traffic (guidance) — Detect automated API key validation attempts against Anthropic, OpenAI, Google, DeepSeek endpoints; monitor for high-volume failed authentication from single sources

## Timeline
- First seen: 2026-01-15
- Last updated: 2026-11-05
- 2026-01-15 (SOCRadar STRU): KeyHunter operation began; infrastructure timeline starts
- 2026-07-10 (SOCRadar STRU): Active key harvesting documented in operational summary; 2,233 keys total
- 2026-08-16 (SOCRadar STRU): 195 Harvard alumni records processed from ShinyHunters torrent
- 2026-09-09 (SOCRadar STRU): Open directory discovered at 209.112.91.74, exposing operation
- 2026-10-13 (SOCRadar STRU): Last observed LEEP group activity
- 2026-11-04 (SOCRadar STRU): KeyHunter operation publicly disclosed by SOCRadar

## Tools
### AI tooling and models
- Hermes Agent (github.com/NousResearch/hermes-agent)
- OpenClaw agent
- grok-4.6 model (AI_radar monitoring)
- PentAGI (github.com/vxcontrol/pentagi)
- aipocket (github.com/leepsmarts/aipocket)

### Other tooling
- fadidevv/keyhunter (github.com/fadidevv/keyhunter, Rust, crates.io: github-keyhunter v0.1.0)
- bigzooooz/KeyHunter (github.com/bigzooooz/KeyHunter)
- env_hunter (v4.0, scans 50+ paths)
- FOFA reconnaissance
- Shodan API
- 360 Quake searches
- HFS server hunting
- Wayback Machine (wayback_verify.py)
- Tavily search proxy (tavily.astrdark.cyou)
- Exa and Firecrawl APIs
- anthropic_check.py
- openai_check.py
- cloud_check.py
- openrouter_check.py
- stripe_card_checker.py
- Harmony ONE crypto drainer (modified fork)
- CVE-2026-41940 exploit (4-stage, pre-staged SSH key)

## Sources
- [SOCRadar STRU: KeyHunter Operation - Harvard Alumni Data, Stanford Applications and LLM Key Theft](https://socradar.io/blog/keyhunter-operation-harvard-alumni-stanford-llm-key-data/)
