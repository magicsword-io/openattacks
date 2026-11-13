# Railway October 2026 incident - build escape to decrypted customer AI provider keys

- ID: railway-october-ai-key-theft-2026-10
- Reported: 2026-11-10
- AI role: ai_credential_theft
- Entry: https://openattacks.ai/attacks/railway-october-ai-key-theft-2026-10/

## Summary
Railway (Jacob Cooper, Angelo Saraceno, Sarah Bedell, Luca Casonato; report published Nov 10, 2026) says the attacker's first signups began on October 18, when dummy accounts were created. At 07:28 UTC on October 20 a previously unknown bug in the multi-tenant build infrastructure gave a partial filesystem escape and a build-server credential. Railway's internal Temporal cluster trusted that credential. The attacker read stored histories of 353 builds between 13:50 and 15:30 UTC on October 20, including sealed build variables, and pulled a snapshot of Railway's internal monorepo. Railway says the source let the attacker run agent fanouts, find exploits, and move laterally. At 03:26 UTC on October 21 a misconfigured OIDC binding in a cloud environment exposed a short-lived cloud credential, which led to an SSH key and a long-lived credential on an orchestration machine. Between 04:42 and 05:14 UTC, and again between 06:36 and 07:15 UTC, the attacker queried the envelope-encrypted variables database with regexes for AI provider key names, focusing on customers with many variables, and decrypted them through KMS. At most 1.85 percent (about 100,000) of workspaces were affected. Linked-account tokens, BYOK agent keys and GitHub OAuth tokens, were exposed for 1,852 users. Railway reset those tokens. Unauthorized spend on the stolen keys was estimated at about 740,000 dollars. Starting at 09:25 UTC on October 21, Railway asked GitHub, GitLab, Anthropic, OpenAI, OpenRouter, SpaceXSI, Google, and Stripe to revoke keys. Railway reads the downstream use as credentials sold through AI-access relay services for distillation, seen in coding-agent traffic, agent-behaviour reviews used as training data, and checks of training tasks and their scoring. Railway links the incident to the wider Black October series (Fireworks, OpenCode, Warp, and others) without saying they are the same operator. The agent and ARTEX-like harness detail is attributed to Wiz. No attacker IPs or file hashes were published. ARTEX reference https://github.com/RuoJi6/ARTEX.

## Category
attacks-on-ai

## Attribution
Unnamed. Financial motivation (resale of AI key access). Railway links the case to Black October but does not say it is the same operator as Fireworks, OpenCode, or Warp.

- Actor: Unnamed
- Country: Unknown
- Motivation: financially-motivated
- Attributed by: Railway; the agent-harness detail is from Wiz as cited by Railway
- Confidence: medium

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Previously unknown bug in Railway multi-tenant build infrastructure, partial filesystem escape, build-server credential
- Victims and sectors: Railway customers, at most 1.85 percent of workspaces; 1,852 users with linked BYOK agent keys or GitHub OAuth tokens
- Regions: Multiple regions
- Region notes: unknown
- Scale and metrics: About 100,000 workspaces (1.85 percent). 1,852 users' linked tokens. About 740,000 dollars of unauthorized model spend. 353 build histories read.

## Attack flow
### signup: Dummy account swarm (access)

Signups begin October 18, two days before the build escape.

Evidence: <https://blog.railway.com/p/incident-report-october-security-incident>

### build-escape: Break out of the build (execution)

At 07:28 UTC on October 20 a build bug yields a credential that Temporal trusts. 353 build histories are read.

Evidence: <https://blog.railway.com/p/incident-report-october-security-incident>

### oidc: OIDC misbinding to a long-lived credential (execution)

At 03:26 UTC on October 21 a short-lived cloud credential exposes an SSH key and a long-lived credential on an orchestration machine.

Evidence: <https://blog.railway.com/p/incident-report-october-security-incident>

### decrypt: Decrypt AI provider keys (ai)

Regex selection and KMS decrypt in two windows on October 21 expose variables for at most 1.85 percent of workspaces.

Evidence: <https://blog.railway.com/p/incident-report-october-security-incident>

### resale: Stolen usage (impact)

Keys show up in coding-agent traffic and training-data collection. Unauthorized spend is about 740,000 dollars.

Evidence: <https://blog.railway.com/p/incident-report-october-security-incident>

### Connections

- signup -> build-escape
- build-escape -> oidc
- oidc -> decrypt
- decrypt -> resale

## MITRE ATLAS
- [AML.T0021](https://atlas.mitre.org/techniques/AML.T0021) Establish Accounts — The attacker created a swarm of dummy Railway accounts starting October 18
  Evidence: <https://blog.railway.com/p/incident-report-october-security-incident>
- [AML.T0055](https://atlas.mitre.org/techniques/AML.T0055) Unsecured Credentials — Regexes selected AI provider key names in the variables database before decryption
  Evidence: <https://blog.railway.com/p/incident-report-october-security-incident>
- [AML.T0012](https://atlas.mitre.org/techniques/AML.T0012) Valid Accounts — A build credential, then a cloud credential from a bad OIDC binding, were reused to move laterally
  Evidence: <https://blog.railway.com/p/incident-report-october-security-incident>
- [AML.T0034](https://atlas.mitre.org/techniques/AML.T0034) Cost Harvesting — Stolen keys ran up about 740,000 dollars in unauthorized model usage
  Evidence: <https://blog.railway.com/p/incident-report-october-security-incident>
- [AML.T0016](https://atlas.mitre.org/techniques/AML.T0016) Obtain Capabilities — Railway, citing Wiz, describes an ARTEX-like harness and abliterated models used during the intrusion
  Evidence: <https://blog.railway.com/p/incident-report-october-security-incident> <https://www.wiz.io/blog/black-october-for-ai-developer-platforms>

## Prevention
Treat build credentials as production credentials. Do not let a build identity read Temporal histories or the variables database. Audit OIDC bindings. Alert on regex queries of variable names followed by KMS decrypt bursts. Prefer short-lived customer tokens and provider-side revocation.

## Detections
- Railway build-escape and KMS decrypt hunting (guidance) — No indexed Sigma, Splunk, or Elastic rule matches Railway's private Temporal client, the build-isolation escape, or application-database KMS decrypts of customer variables. AWS rules for PutKeyPolicy, key deletion, or Kubernetes AssumeRoleWithWebIdentity describe different events and are not cited. On a platform like Railway, alert on a build identity reading job histories, on regex scans of variable names, and on decrypt bursts between new credentials and AI-provider key prefixes.

## Timeline
- First seen: 2026-10-18
- Last updated: 2026-11-10
- 2026-10-18 (Railway): Attacker begins creating dummy Railway accounts
- 2026-10-20 (Railway): 07:28 UTC build escape. 13:50-15:30 UTC the attacker reads 353 build histories, sealed variables included.
- 2026-10-21 (Railway): 03:26 UTC OIDC misbinding. 04:42-05:14 and 06:36-07:15 UTC KMS decrypt of AI provider keys. 09:25 UTC revocation requests to GitHub, GitLab, Anthropic, OpenAI, OpenRouter, SpaceXSI, Google, and Stripe.
- 2026-11-10 (Railway): Full incident report. Unauthorized spend estimated at about 740,000 dollars. Wiz harness detail included.

## Tools
### AI tooling and models
- Customer AI provider keys (Anthropic, OpenAI, OpenRouter, and others Railway asked to revoke)
- ARTEX-like harness described by Wiz (https://github.com/RuoJi6/ARTEX)

### Other tooling
- Temporal client access with a build credential
- Misconfigured OIDC binding
- KMS decrypt of envelope-encrypted variables

## Source notes
Times, counts, the 740,000 dollar estimate, the provider list, and the Wiz attribution of the harness are from Railway's Nov 10 incident report. No IPs or hashes were published. Link gtig-llmjacking-unc6993-2026-11 (Fireworks), keyhunter-llm-key-theft-2026-11 (Railway named only as a scanned PaaS), and wiz-ai-driven-cloud-2026-10.

## Sources
- [Railway: Incident Report, October 21st Security Attack](https://blog.railway.com/p/incident-report-october-security-incident) — Railway
- [Wiz: Black October for AI developer platforms](https://www.wiz.io/blog/black-october-for-ai-developer-platforms) — Wiz
- [BleepingComputer: Railway breach and fraudulent AI charges](https://www.bleepingcomputer.com/news/apple/railway-breach-leads-to-740-000-in-fraudulent-ai-charges/) — BleepingComputer
- [The Hacker News: Railway stolen customer AI keys](https://thehackernews.com/2026/11/railway-says-stolen-customer-ai-keys.html) — The Hacker News
