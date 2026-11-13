# Check Point and CERT-EU exposed ARTEX operator consoles leak campaign data

- ID: checkpoint-artex-operator-consoles-2026-11
- Reported: 2026-11-05
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/checkpoint-artex-operator-consoles-2026-11/

## Summary
Check Point (Nov 5, 2026) and CERT-EU (Nov 5, 2026) document exposed ARTEX operator control panels leaking database dumps containing operator prompts, model selection (primarily DeepSeek Flash and Kimi), autonomous agent decision steps, and campaign targets. Three campaign fleets identified: (1) iOS signing shops - steal .p12 certificates and passwords, check against Apple revocation/expiry lists; (2) Crypto payment sites - drain USDT, swap deposit addresses; overwrite S3 buckets serving iOS IPA landing pages (supply chain); (3) Honor of Kings account tokens from stolen-account resale servers. Access methods: hardcoded admin passwords in JavaScript bundles, unauthenticated APIs, command injection, SSTI, IDOR vulnerabilities. Operator who hit Claude Opus guardrails switched to Chinese LLM models. Version-tag infrastructure clusters: sco-fix2 (38.11.173.0/24, 38.11.221.0/24, 198.200.59.85-89, AS54600 PEG TECH); dev-db-resilience-20261031 (103.122.245.x, AS152918 Liberally Network, Thailand); 0.3.15-pro.* (192.236.172.197, 198.44.123.66, 204.44.66.81, 104.168.112.237, AS36352 HostPapa). Custom framework PZZ referenced. CERT-EU reports ARTEX activity vs EU institutions; original Autumn-27 ARTEX repository down. Chinese-prompting actors, financially motivated; attributed by Check Point; confirmed AI involvement from leaked operator consoles.

## Category
adversary-use-of-ai

## Attribution
Chinese-prompting financially motivated operators; attributed by Check Point; confirmed from leaked operator console databases

- Actor: Chinese-prompting financially motivated operators
- Country: Unknown
- Motivation: financially-motivated
- Attributed by: Check Point
- Confidence: medium

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Hardcoded admin passwords, unauthenticated APIs, command injection, SSTI, IDOR
- Victims and sectors: iOS signing shops, cryptocurrency payment sites, Honor of Kings account resale servers, EU institutions (CERT-EU report)
- Regions: Multiple regions
- Region notes: unknown
- Scale and metrics: Three major campaign fleets (iOS signing, crypto payment, game accounts); multiple exposed ARTEX panels with leaked operator databases; infrastructure across AS54600 PEG TECH, AS152918 Liberally Network Thailand, AS36352 HostPapa

## Attack flow
### deploy-artex: Deploy ARTEX operator console (ai)

Financially motivated operators deploy ARTEX consoles for campaign orchestration

Evidence: <https://research.checkpoint.com/2026/hacking-on-autopilot-inside-artex-cybercrime-campaigns/>

### ios-signing: iOS signing shop campaign (execution)

Steal .p12 certificates and passwords; check Apple revocation/expiry

Evidence: <https://research.checkpoint.com/2026/hacking-on-autopilot-inside-artex-cybercrime-campaigns/>

### crypto-payment: Crypto payment site campaign (impact)

Drain USDT, swap deposit addresses; overwrite S3 buckets serving iOS IPA (supply chain)

Evidence: <https://research.checkpoint.com/2026/hacking-on-autopilot-inside-artex-cybercrime-campaigns/>

### game-accounts: Honor of Kings account theft (impact)

Steal account tokens from compromised stolen-account resale servers

Evidence: <https://research.checkpoint.com/2026/hacking-on-autopilot-inside-artex-cybercrime-campaigns/>

### console-exposure: ARTEX console exposure (execution)

Hardcoded passwords, unauthenticated APIs, command injection, SSTI, IDOR expose operator consoles and databases

Evidence: <https://research.checkpoint.com/2026/hacking-on-autopilot-inside-artex-cybercrime-campaigns/>

### Connections

- deploy-artex -> ios-signing
- deploy-artex -> crypto-payment
- deploy-artex -> game-accounts
- console-exposure -> deploy-artex

## MITRE ATLAS
- [AML.T0016](https://atlas.mitre.org/techniques/AML.T0016) Obtain Capabilities — Exposed ARTEX operator consoles reveal autonomous agent decision-making process and campaign orchestration
  Evidence: <https://research.checkpoint.com/2026/hacking-on-autopilot-inside-artex-cybercrime-campaigns/>
- [AML.T0012](https://atlas.mitre.org/techniques/AML.T0012) Valid Accounts — AI agents autonomously exploit hardcoded passwords, unauthenticated APIs, command injection, SSTI, IDOR
  Evidence: <https://research.checkpoint.com/2026/hacking-on-autopilot-inside-artex-cybercrime-campaigns/>
- [AML.T0010](https://atlas.mitre.org/techniques/AML.T0010) AI Supply Chain Compromise — S3 bucket overwrite campaign represents AI-driven supply chain attack
  Evidence: <https://research.checkpoint.com/2026/hacking-on-autopilot-inside-artex-cybercrime-campaigns/>

## Prevention
Secure ARTEX deployments against unauthorized access (remove hardcoded passwords, authenticate APIs); patch command injection, SSTI, IDOR vulnerabilities; rotate compromised credentials; monitor for iOS .p12 theft; protect cryptocurrency deposit address integrity; secure S3 buckets serving app distributions; implement behavioral detection for autonomous agent patterns; block known ARTEX infrastructure IPs; detect Chinese-language prompting in logs

## Detections
- [Detect New Open S3 Buckets](https://github.com/splunk/security_content/blob/develop/detections/cloud/detect_new_open_s3_buckets.yml) (splunk) — Detects S3 bucket operations including overwrites used in iOS IPA supply chain attacks
- ARTEX console security monitoring (guidance) — Scan for exposed ARTEX control panels via hardcoded admin passwords in JS bundles; detect unauthenticated ARTEX APIs; patch command injection, SSTI, IDOR in ARTEX deployments; monitor for Chinese-language prompting in agent logs; detect iOS .p12 certificate theft; alert on cryptocurrency deposit address swaps; monitor S3 bucket integrity for iOS IPA distributions; flag Honor of Kings token theft patterns; block known ARTEX infrastructure (AS54600, AS152918, AS36352)
- ARTEX infrastructure detection (guidance) — Monitor version-tag clusters: sco-fix2, dev-db-resilience-20261031, 0.3.15-pro.*; detect custom framework PZZ references; alert on DeepSeek Flash and Kimi model usage in offensive contexts; detect operator model switching after guardrail triggers

## Timeline
- First seen: 2026-09-01
- Last updated: 2026-11-05
- 2026-11-05 (Check Point): Check Point publishes analysis of exposed ARTEX operator consoles revealing three campaign fleets (iOS signing, crypto payment, game accounts); operator prompts, model choices, agent steps leaked
- 2026-11-05 (CERT-EU): CERT-EU warns of ARTEX activity vs EU institutions; original Autumn-27 ARTEX repository down

## Tools
### AI tooling and models
- [ARTEX](https://github.com/RuoJi6/ARTEX) autonomous offensive agent (https://github.com/RuoJi6/ARTEX) — Community-maintained fork; the original repository is unavailable.
- [DeepSeek](https://github.com/deepseek-ai) Flash (primary)
- Kimi (Chinese LLM)
- [Claude](https://claude.com/product/overview) Opus (hit guardrails, operator switched)
- Custom framework PZZ

### Other tooling
- iOS .p12 certificate theft
- USDT cryptocurrency draining
- S3 bucket overwrite for supply chain
- Honor of Kings account token theft

## Source notes
Check Point blog (Nov 5, 2026) primary source with detailed campaign analysis and infrastructure; CERT-EU blog (Nov 5, 2026) reports ARTEX vs EU institutions; all IOCs (IPs, ASNs, version tags) verified from Check Point; links to other ARTEX entries: microsoft-artex-github-secrets-keyvault-2026-11, crowdstrike-artex-sk-finance-2026-10, badbyte-artex-backdoor-docker-2026-11, storm-3358-artex-bank-intrusions-2026-11, srm-artex-ir-host-artifacts-2026-11

## Sources
- [Check Point: Hacking on Autopilot - Inside ARTEX Cybercrime Campaigns](https://research.checkpoint.com/2026/hacking-on-autopilot-inside-artex-cybercrime-campaigns/) — Check Point
- [CERT-EU: From Penetration Testing to Cyber Threat - Beware of ARTEX](https://cert.europa.eu/blog/from-penetration-testing-to-cyber-threat-beware-of-artex) — CERT-EU
