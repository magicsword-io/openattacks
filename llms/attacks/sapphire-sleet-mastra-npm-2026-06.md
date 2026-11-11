# Sapphire Sleet (DPRK) backdoors 140+ Mastra AI framework npm packages

- ID: sapphire-sleet-mastra-npm-2026-06
- Reported: 2026-06-17
- AI role: ai_credential_theft
- Entry: https://openattacks.ai/attacks/sapphire-sleet-mastra-npm-2026-06/

## Summary
Jun 17, 2026: Microsoft attributes to DPRK Sapphire Sleet (aka BlueNoroff, APT38, Stardust Chollima): compromised Mastra AI framework maintainer account and published 140+ backdoored npm packages between May 29-Jun 15, 2026. Mastra is TypeScript AI agent framework (github.com/mastra-ai/mastra). Malicious postinstall scripts deployed obfuscated Node.js payload targeting: OpenAI keys, Anthropic keys, Azure OpenAI endpoints, AWS credentials, GitHub tokens, npm tokens, SSH keys, Docker configs, Kubernetes service accounts. Payload POSTed to DPRK C2 hxxps://mastra-telemetry[.]com (posing as legitimate telemetry endpoint). npm removed packages Jun 16-17; Microsoft estimates 8,000-12,000 downloads across compromised versions. Sapphire Sleet previously linked to crypto exchange attacks, IT worker schemes, and supply chain operations. Detection: monitor npm installs of Mastra@* between May 29-Jun 15 2026; check for mastra-telemetry[.]com egress; review postinstall scripts for obfuscation/eval; scan for credential file access from npm scripts.

## Category
attacks-on-ai

## Attribution
Sapphire Sleet (DPRK, aka BlueNoroff, APT38, Stardust Chollima); Microsoft high-confidence attribution; part of DPRK revenue generation and intelligence collection operations

- Actor: Sapphire Sleet (DPRK)
- Country: DPRK
- Motivation: financially-motivated
- Attributed by: Microsoft
- Confidence: high

## AI involvement confidence
confirmed

## Attack flow
### compromise-maintainer: Compromise Mastra maintainer (access)

Sapphire Sleet (DPRK) compromised Mastra maintainer's npm account via targeted phishing or credential theft; gained publish access to @mastra scope

Evidence: <https://www.microsoft.com/en-us/security/blog/2026/06/17/postinstall-payload-inside-mastra-npm-supply-chain-compromise/>

### publish-backdoored: Publish 140+ backdoored packages (ai)

Published 140+ malicious @mastra packages between May 29-Jun 15 with obfuscated postinstall scripts; maintained functional AI framework features to avoid immediate detection

Evidence: <https://www.microsoft.com/en-us/security/blog/2026/06/17/postinstall-payload-inside-mastra-npm-supply-chain-compromise/>

### harvest-credentials: Harvest AI and cloud credentials (execution)

Postinstall script executes obfuscated Node.js: scans env vars (OPENAI_API_KEY, ANTHROPIC_API_KEY, AZURE_OPENAI_*), filesystem (~/.config, ~/.aws, ~/.ssh, ~/.docker, ~/.kube), npm config; base64-encodes findings

Evidence: <https://www.microsoft.com/en-us/security/blog/2026/06/17/postinstall-payload-inside-mastra-npm-supply-chain-compromise/>

### exfiltrate-dprk: Exfiltrate to DPRK C2 (impact)

POSTs harvested credentials to hxxps://mastra-telemetry[.]com (DPRK infrastructure masquerading as telemetry); credentials support DPRK intelligence collection and revenue generation (AI service resale, crypto exchange targeting); 8,000-12,000 affected installs

Evidence: <https://www.microsoft.com/en-us/security/blog/2026/06/17/postinstall-payload-inside-mastra-npm-supply-chain-compromise/>

### Connections

- compromise-maintainer -> publish-backdoored
- publish-backdoored -> harvest-credentials
- harvest-credentials -> exfiltrate-dprk

## MITRE ATLAS
- [AML.T0000](https://atlas.mitre.org/techniques/AML.T0000) Search Open Technical Databases — DPRK APT supply chain compromise of AI framework to steal AI service credentials for intelligence collection and revenue generation
  Evidence: <https://www.microsoft.com/en-us/security/blog/2026/06/17/postinstall-payload-inside-mastra-npm-supply-chain-compromise/>

## Prevention
Verify npm package integrity; use package lock files with checksums; review postinstall scripts before install; monitor for unexpected network egress from npm scripts; rotate credentials after suspected exposure; use npm audit; implement SCA tools; prefer packages from verified maintainers; check npm package publish dates and maintainer history

## Detections
- Supply chain monitoring (guidance) — Monitor package installations, verify publisher authenticity, scan for malicious code patterns

## Timeline
- First seen: 2026-06-17
- Last updated: 2026-11-04
- 2026-06-17 (Microsoft): Initial discovery and analysis

## Tools
### AI tooling and models
- Mastra AI framework
- OpenAI API
- Anthropic [Claude](https://claude.com/product/overview) API
- [Azure OpenAI](https://azure.microsoft.com/en-us/products/ai-foundry/models/openai/) Service

### Other tooling
- npm supply chain attack
- [Node.js](https://github.com/nodejs/node) postinstall scripts
- mastra-telemetry\[.\]com C2 (DPRK infrastructure)

## Sources
- [Microsoft: North Korea's Sapphire Sleet targets AI developers with Mastra supply chain attack](https://www.microsoft.com/en-us/security/blog/2026/06/17/postinstall-payload-inside-mastra-npm-supply-chain-compromise/)
- [Mastra - AI Framework for TypeScript](https://github.com/mastra-ai/mastra)
