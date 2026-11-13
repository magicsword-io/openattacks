# Multiple Hermes agent operators - knaithe/KnYuan and Hunt.io campaigns

- ID: hermes-operators-campaigns-2026
- Reported: 2026-07-30
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/hermes-operators-campaigns-2026/

## Summary
Multiple 2026 campaigns using Hermes agent: (1) knaithe/KnYuan '1DayNews' campaign (Unit 42, Jul 30): Exploits public 1-day vulnerabilities; deploys Hermes with DeepSeek for autonomous exploitation and lateral movement; targets technology companies. (2) Hunt.io Thailand Ministry of Finance (Jul 23, vendor-asserted): Hermes agent used in government intrusion; autonomous reconnaissance and data exfiltration. Both demonstrate Hermes becoming commodity tool for various threat actors.

## Category
adversary-use-of-ai

## Attribution
knaithe/KnYuan (Unit 42 tracking); Thailand campaign actor unknown (Hunt.io vendor-asserted)

- Actor: knaithe/KnYuan (Unit 42), Unknown (Thailand)
- Country: Unknown
- Motivation: financially-motivated
- Attributed by: Unit 42, Hunt.io
- Confidence: medium

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: 1-day vulnerability exploitation (knaithe); unknown (Thailand campaign)
- Victims and sectors: Technology companies (knaithe); Thailand Ministry of Finance (Hunt.io); government and private sector
- Regions: Multiple regions, Thailand
- Region notes: unknown
- Scale and metrics: Multiple organizations compromised across both campaigns Jul-Aug 2026

## Attack flow
### initial-access: Gain initial access (access)

knaithe exploits 1-day vulnerabilities; Thailand campaign method unknown

Evidence: <https://unit42.paloaltonetworks.com/autonomous-ai-cyber-attack-campaign/>

### deploy-hermes: Deploy Hermes agent (ai)

Install Hermes autonomous agent framework with DeepSeek backing

Evidence: <https://unit42.paloaltonetworks.com/autonomous-ai-cyber-attack-campaign/>

### autonomous-ops: Autonomous reconnaissance and exploitation (execution)

Hermes conducts autonomous network mapping, vulnerability discovery, lateral movement

Evidence: <https://unit42.paloaltonetworks.com/autonomous-ai-cyber-attack-campaign/>

### exfiltration: Data exfiltration (impact)

Autonomous data collection and exfiltration; multiple organizations compromised

Evidence: <https://hunt.io/blog/thailand-ministry-finance-targeted-with-hermes-ai-agent>

### Connections

- initial-access -> deploy-hermes
- deploy-hermes -> autonomous-ops
- autonomous-ops -> exfiltration

## MITRE ATLAS
- [AML.T0040](https://atlas.mitre.org/techniques/AML.T0040) AI Model Inference API Access — Multiple threat actors using Hermes autonomous agent for post-compromise operations
  Evidence: <https://unit42.paloaltonetworks.com/autonomous-ai-cyber-attack-campaign/> <https://hunt.io/blog/thailand-ministry-finance-targeted-with-hermes-ai-agent>

## Prevention
Patch 1-day vulnerabilities rapidly; monitor for Hermes agent indicators; detect autonomous agent behavior; segment sensitive networks

## Detections
- Hermes agent detection (guidance) — Monitor for Hermes Python processes, autonomous-agent activity, DeepSeek API calls from compromised hosts
- 1-day exploitation monitoring (guidance) — Rapid patching and monitoring for exploitation of recently disclosed vulnerabilities

## Timeline
- First seen: 2026-07-01
- Last updated: 2026-11-05
- 2026-07-23 (Hunt.io): Thailand Ministry of Finance intrusion using Hermes agent
- 2026-07-30 (Unit 42): knaithe/KnYuan 1DayNews campaign disclosed using Hermes + DeepSeek

## Tools
### AI tooling and models
- Hermes autonomous agent framework
- [DeepSeek](https://github.com/deepseek-ai) models (knaithe campaign)

### Other tooling
- 1-day vulnerability exploits
- Autonomous reconnaissance tools
- Data exfiltration frameworks

## Source notes
Unit 42 analysis of knaithe/KnYuan; Hunt.io vendor assertion for Thailand campaign. Hermes agent GitHub github.com/Hermes-Autonomous-Intelligence/hermes. Detection: monitor for Hermes Python processes, autonomous reconnaissance patterns, DeepSeek API calls from infrastructure hosts.

## Sources
- [Unit 42: knaithe/KnYuan Using Hermes Agent in 1DayNews Campaign](https://unit42.paloaltonetworks.com/autonomous-ai-cyber-attack-campaign/)
- [Hunt.io: Thailand Ministry of Finance Intrusion Using Hermes Agent](https://hunt.io/blog/thailand-ministry-finance-targeted-with-hermes-ai-agent)
