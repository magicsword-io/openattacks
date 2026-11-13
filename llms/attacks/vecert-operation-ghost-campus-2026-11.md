# VECERT Operation Ghost Campus - FOFA account farm harvesting OpenAI and DeepSeek keys

- ID: vecert-operation-ghost-campus-2026-11
- Reported: 2026-11-08
- AI role: ai_credential_theft
- Entry: https://openattacks.ai/attacks/vecert-operation-ghost-campus-2026-11/

## Summary
VECERT (case VECERT-TI-2026-1107-B, Medium, about Nov 8, 2026) describes Operation Ghost Campus. The operator ran a catch-all mail domain, melocc.cc, with mail, api, pop, imap, and smtp subdomains. A script registered FOFA accounts, read the confirmation mail over POP or IMAP, and activated them within seconds. VECERT says it recovered fofa_accounts.csv with at least 1,438 accounts (examples fofaa4x3y145@melocc.cc and fofa6o4vg697@melocc.cc) plus passwords and JWTs. Rotating those free-tier tokens is described as producing tens of thousands of FOFA queries a day for exposed .env files, Docker configs, and Git repos. Hits are regex-parsed for OpenAI sk-proj keys and DeepSeek keys matching sk- followed by 32 hex characters. OpenAI keys are checked against api.openai.com and sorted into valid_no_balance (HTTP 429) or revoked (HTTP 401). DeepSeek balances are queried; the post names keys pulled from labibiyat.com and nyisu.com. The same control server, 134.175.71.194 (Tencent Cloud, Guangzhou), is described as hosting a GoTTY web terminal titled Pi – AI Coding Assistant (https://github.com/yudai/gotty), heartbeat bots that fake student reading time, and a scraper of 5,132 student records from the Fengxian campus of the Shanghai Publishing and Printing College, including campus-card balances and a QR payment-code module. VECERT says the operator is possibly in China and likely tied to Shanghai's academic community. Link keyhunter-llm-key-theft-2026-11, which also uses FOFA to hunt LLM keys.

## Category
attacks-on-ai

## Attribution
Unnamed. VECERT (VECERT-TI-2026-1107-B) says the operator is possibly in China and likely tied to Shanghai's academic community. No government or vendor attribution.

- Actor: Unnamed operator described by VECERT
- Country: China
- Motivation: financially-motivated
- Attributed by: VECERT Threat Research and Intelligence
- Confidence: low

## AI involvement confidence
unverified

## Scope and targeting
- Initial access: Mass FOFA account registration through a private catch-all mail domain, then searches for exposed .env files and git repos
- Victims and sectors: Holders of exposed OpenAI and DeepSeek keys; VECERT also describes 5,132 student records at a Shanghai college campus
- Regions: China, Multiple regions
- Region notes: unknown
- Scale and metrics: At least 1,438 FOFA accounts. 5,132 student records described. Control server 134.175.71.194.

## Attack flow
### farm-accounts: Farm FOFA accounts (access)

A script registers FOFA accounts on melocc.cc, reads the confirmation mail, and stores passwords and JWTs in fofa_accounts.csv.

Evidence: <https://medium.com/@vecert/investigation-operation-ghost-campus-artificial-intelligence-agents-academic-fraud-and-global-0ea0ded1e688>

### search-env: Search for exposed keys (execution)

Rotated free-tier tokens query FOFA for .env files, Docker configs, and git repos.

Evidence: <https://medium.com/@vecert/investigation-operation-ghost-campus-artificial-intelligence-agents-academic-fraud-and-global-0ea0ded1e688>

### validate: Validate OpenAI and DeepSeek keys (ai)

Regex hits are checked at api.openai.com or for DeepSeek balance and sorted into valid_no_balance or revoked.

Evidence: <https://medium.com/@vecert/investigation-operation-ghost-campus-artificial-intelligence-agents-academic-fraud-and-global-0ea0ded1e688>

### panel: Keys land in the GoTTY panel (impact)

VECERT says working keys feed the Pi AI Coding Assistant terminal on 134.175.71.194.

Evidence: <https://medium.com/@vecert/investigation-operation-ghost-campus-artificial-intelligence-agents-academic-fraud-and-global-0ea0ded1e688>

### Connections

- farm-accounts -> search-env
- search-env -> validate
- validate -> panel

## MITRE ATLAS
- [AML.T0021](https://atlas.mitre.org/techniques/AML.T0021) Establish Accounts — The operator mass-registers FOFA accounts through its own mail domain
  Evidence: <https://medium.com/@vecert/investigation-operation-ghost-campus-artificial-intelligence-agents-academic-fraud-and-global-0ea0ded1e688>
- [AML.T0055](https://atlas.mitre.org/techniques/AML.T0055) Unsecured Credentials — FOFA queries are used to find exposed .env files and pull OpenAI and DeepSeek keys
  Evidence: <https://medium.com/@vecert/investigation-operation-ghost-campus-artificial-intelligence-agents-academic-fraud-and-global-0ea0ded1e688>
- [AML.T0034](https://atlas.mitre.org/techniques/AML.T0034) Cost Harvesting — Validated keys are checked for remaining balance and described as fuel for the operator's own tools
  Evidence: <https://medium.com/@vecert/investigation-operation-ghost-campus-artificial-intelligence-agents-academic-fraud-and-global-0ea0ded1e688>

## Prevention
Do not leave provider keys in .env files, Docker configs, or public git repos. Monitor api.openai.com for bursts of validation calls that return 429 or 401. Treat melocc.cc and the named control IP as suspicious. Rotate any key that appeared in a public env file.

## Detections
- FOFA farming and provider-key validation (guidance) — No Sigma, Splunk, or Elastic rule covers FOFA account farming, GoTTY, or OpenAI 429/401 key-validation bursts. On the defender side, alert when a repository or host serves a .env containing sk-proj or DeepSeek sk- keys, and treat outbound queries to fofa.info from build systems as suspicious. Mail IPs 156.251.234.242 and 156.233.234.242 are intentionally not indicators until the VECERT discrepancy is resolved.

## Timeline
- First seen: 2026-11-08
- Last updated: 2026-11-10
- 2026-11-08 (VECERT): VECERT publishes Operation Ghost Campus (VECERT-TI-2026-1107-B), including fofa_accounts.csv, melocc.cc, and control server 134.175.71.194
- 2026-11-10 (Cyber Press): Secondary coverage repeats the FOFA account farm and the OpenAI and DeepSeek key-validation steps

## Tools
### AI tooling and models
- GoTTY web terminal (https://github.com/yudai/gotty), described as Pi – AI Coding Assistant
- Stolen OpenAI and [DeepSeek](https://github.com/deepseek-ai) API keys

### Other tooling
- FOFA account farm on melocc.cc
- fofa_accounts.csv

## Source notes
Control IP 134.175.71.194, melocc.cc, the 1,438-account count, example mailbox local-parts, labibiyat.com, nyisu.com, and the GoTTY panel name are from the VECERT Medium post. The mail-server IP is not listed. The same post gives 156.251.234.242 in the DNS section (mail, api, pop, imap, and smtp subdomains) and 156.233.234.242 in the infrastructure section (Cognetcloud, ASN 401701). Secondary write-ups disagree about which address is the Cognetcloud mail server, and the embedded screenshots were not independently re-resolved. Both addresses are omitted.

## Sources
- [VECERT: Operation Ghost-Campus](https://medium.com/@vecert/investigation-operation-ghost-campus-artificial-intelligence-agents-academic-fraud-and-global-0ea0ded1e688) — VECERT
- [Cyber Press coverage of Operation Ghost Campus](https://cyberpress.org/hackers-weaponize-ai-agents/) — Cyber Press
- [Cyber Security News: fake FOFA accounts](https://cybersecuritynews.com/fake-fofa-accounts/) — Cyber Security News
