# CERT-In / CSIRT-Fin CRAFTY FALCON AI-tool campaign against Indian BFSI

- ID: cert-in-crafty-falcon-bfsi-2026-11
- Reported: 2026-11-04
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/cert-in-crafty-falcon-bfsi-2026-11/

## Summary
CERT-In Advisory CIAD-2026-0058 (Nov 4, 2026) warns of CRAFTY FALCON campaign targeting Indian non-banking financial companies (NBFCs), fintechs, payment aggregators, and cryptocurrency exchanges. Attackers chain multiple open-source agentic offensive AI frameworks: ARTEX (autonomous penetration testing), PentAGI (multi-agent security testing), Cairn (AI-driven web exploitation), and CyberStrikeAI (LLM-powered C2). Campaign features cloud/AWS Lambda pivots for staging-to-production access, AI-driven app reverse-engineering to invoke payment and merchant-settlement APIs from allow-listed infrastructure, Rs. 1 test transfers followed by large mule payouts, cryptocurrency wallet-key theft, comprehensive log deletion, and deliberate retargeting during festive windows when transaction volumes are high and security teams are reduced. CERT-In notes campaign exploits trust in cloud infrastructure and leverages AI agent autonomy to accelerate intrusion timelines from weeks to hours.

## Category
adversary-use-of-ai

## Attribution
CERT-In: CRAFTY FALCON financially motivated campaign; Indian press notes Chinese-linked offensive AI frameworks; no confirmed state nexus in CERT-In advisory

- Actor: CRAFTY FALCON
- Country: Unknown
- Motivation: financially-motivated
- Attributed by: CERT-In / CSIRT-Fin
- Confidence: high

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Cloud service exploitation, exposed APIs, compromised AWS Lambda functions, credential stuffing against fintech portals
- Victims and sectors: Indian non-banking financial companies (NBFCs), fintechs, payment aggregators, cryptocurrency exchanges; festive-season targeting (Diwali, year-end)
- Regions: India
- Region notes: unknown
- Scale and metrics: Active since at least Oct 2026; Rs. 1 test transfers followed by large payouts; multiple NBFCs and fintechs compromised; festive-window retargeting pattern

## Attack flow
### initial-recon: AI agent reconnaissance (execution)

AI agent reconnaissance

Evidence: <https://www.cert-in.org.in/s2cMainServlet?pageid=PUBVLNOTES02&VLCODE=CIAD-2026-0058>

### cloud-pivot: AWS Lambda staging-to-production pivot (execution)

AWS Lambda staging-to-production pivot

Evidence: <https://www.cert-in.org.in/s2cMainServlet?pageid=PUBVLNOTES02&VLCODE=CIAD-2026-0058>

### api-abuse: Payment/merchant API invocation (execution)

Payment/merchant API invocation

Evidence: <https://www.cert-in.org.in/s2cMainServlet?pageid=PUBVLNOTES02&VLCODE=CIAD-2026-0058>

### test-transfer: Rs. 1 test transfer (execution)

Rs. 1 test transfer

Evidence: <https://indianexpress.com/article/technology/tech-news-technology/cert-in-crafty-falcon-ai-driven-hacking-campaign-fintech-10951672/>

### fund-theft: Large mule payouts (impact)

Large mule payouts

Evidence: <https://indianexpress.com/article/technology/tech-news-technology/cert-in-crafty-falcon-ai-driven-hacking-campaign-fintech-10951672/>

### crypto-theft: Cryptocurrency wallet-key theft (impact)

Cryptocurrency wallet-key theft

Evidence: <https://www.cert-in.org.in/s2cMainServlet?pageid=PUBVLNOTES02&VLCODE=CIAD-2026-0058>

### log-deletion: Comprehensive log deletion (execution)

Comprehensive log deletion

Evidence: <https://www.cert-in.org.in/s2cMainServlet?pageid=PUBVLNOTES02&VLCODE=CIAD-2026-0058>

### Connections

- initial-recon -> cloud-pivot
- cloud-pivot -> api-abuse
- api-abuse -> test-transfer
- test-transfer -> fund-theft
- api-abuse -> crypto-theft
- fund-theft -> log-deletion
- crypto-theft -> log-deletion

## MITRE ATLAS
- [AML.T0000](https://atlas.mitre.org/techniques/AML.T0000) Search Open Technical Databases — Attackers deploy multiple autonomous AI agent frameworks (ARTEX, PentAGI, Cairn, CyberStrikeAI) as operators to automate intrusion lifecycle from reconnaissance through payment API exploitation and fund exfiltration
  Evidence: <https://www.cert-in.org.in/s2cMainServlet?pageid=PUBVLNOTES02&VLCODE=CIAD-2026-0058>

## Prevention
Monitor for agentic AI framework execution patterns (ARTEX, PentAGI, Cairn, CyberStrikeAI); implement API rate limiting and anomaly detection; enforce least-privilege for Lambda and cloud functions; enable comprehensive CloudTrail and application logging with tamper protection; segregate staging from production environments; implement transaction velocity checks and behavioral analytics; strengthen multi-factor authentication; monitor for unusual payment API invocations from non-standard infrastructure; review allow-lists for payment endpoints

## Detections
- [AWS Lambda Event Source Mapping Creation](https://github.com/elastic/detection-rules/blob/main/rules/integrations/aws/persistence_lambda_event_source_mapping_created.toml) (elastic) — Detects Lambda event source mapping creation; relevant for detecting Lambda-based persistence in CRAFTY FALCON cloud pivots
- [AWS New Lambda Layer Attached](https://github.com/SigmaHQ/sigma/blob/master/rules/cloud/aws/cloudtrail/aws_new_lambda_layer_attached.yml) (sigma) — Detects Lambda layer attachment; applicable to CRAFTY FALCON staging-to-production pivots via Lambda
- Agentic AI framework detection (guidance) — Monitor for ARTEX, PentAGI, Cairn, CyberStrikeAI process execution (Python agent frameworks); alert on autonomous API enumeration patterns; detect rapid payment API invocations from non-standard infrastructure; flag Rs. 1 test transfers followed by large transactions; monitor CloudTrail for Lambda configuration changes and log deletion attempts

## Timeline
- First seen: 2026-10-01
- Last updated: 2026-11-04
- 2026-11-04 (CERT-In): CERT-In Advisory CIAD-2026-0058 issued warning Indian BFSI sector on CRAFTY FALCON campaign using ARTEX, PentAGI, Cairn, CyberStrikeAI; festive-window targeting pattern noted

## Tools
### AI tooling and models
- [ARTEX](https://github.com/RuoJi6/ARTEX) (https://github.com/RuoJi6/ARTEX) — Community-maintained fork; the original repository is unavailable.
- PentAGI (https://github.com/vxcontrol/pentagi)
- CyberStrikeAI (https://github.com/Ed1s0nZ/CyberStrikeAI, https://github.com/aipentest/cyberstrikeai)
- [Cairn](https://github.com/oritera/Cairn) (AI web exploitation harness)
- On-the-fly AI script generation

### Other tooling
- AWS Lambda for staging-to-production pivots
- Custom payment API invocation scripts
- Log deletion tools

### Offensive frameworks
- [ARTEX](https://openattacks.ai/tools/artex/) (`artex`)
- [Cairn](https://openattacks.ai/tools/cairn/) (`cairn`)
- [CyberStrikeAI](https://openattacks.ai/tools/cyberstrikeai/) (`cyberstrikeai`)
- [PentAGI](https://openattacks.ai/tools/pentagi/) (`pentagi`)

## Source notes
CERT-In Advisory CIAD-2026-0058 (Nov 4, 2026) official government warning; Indian Express and industry coverage provide context on AI framework usage and festive-window targeting; cross-reference with cairn-norforge-2026-10 entry for Cairn exploitation patterns

## Sources
- [CERT-In Advisory CIAD-2026-0058: CRAFTY FALCON Campaign Against Indian Financial Sector](https://www.cert-in.org.in/s2cMainServlet?pageid=PUBVLNOTES02&VLCODE=CIAD-2026-0058) — CERT-In
- [CERT-In warns of AI-driven hacking campaign targeting Indian fintech sector](https://indianexpress.com/article/technology/tech-news-technology/cert-in-crafty-falcon-ai-driven-hacking-campaign-fintech-10951672/) — Indian Express
