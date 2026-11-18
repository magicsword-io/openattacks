# Storm-0940 used ARTEX agentic AI framework in ConnectWise supply-chain attack reaching 2,250+ Microsoft 365 tenants

- ID: storm-0940-used-artex-agentic-ai-2026-10
- Reported: 2026-10-21
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/storm-0940-used-artex-agentic-ai-2026-10/

## Summary
Microsoft attributes the ConnectWise Cloud Backup supply-chain compromise to China-aligned Storm-0940, which used the ARTEX multi-agent AI framework to automate recon, spraying and OAuth abuse, reaching privileged cloud access in some tenants in under three hours.

## Category
adversary-use-of-ai

## Attribution
Storm-0940

- Actor: Storm-0940
- Country: China
- Motivation: nation-state
- Attributed by: Microsoft Threat Intelligence
- Confidence: high

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: unknown
- Victims and sectors: Defense; Government; Finance; Technology and AI companies; Critical infrastructure; Multiple sectors
- Regions: unknown
- Region notes: Target geography was not captured by the Notion feed. Actor attribution is not used as a victim location.
- Scale and metrics: unknown

## Attack flow
No attack flow is recorded.

## MITRE ATLAS
No ATLAS mapping is recorded.

## Prevention
unknown

## Detections
- [Password Spray Activity](https://github.com/SigmaHQ/sigma/blob/master/rules/cloud/azure/identity_protection/azure_identity_protection_password_spray.yml) (sigma) — Matched password spray with security-detections-mcp. Microsoft says Storm-0940 used ARTEX for an Entra password spray from 144.172.64.99, with more than 151,000 failed logons across eight organizations on 10-14 October 2026.
- [Azure AD Multiple Users Failing To Authenticate From Ip](https://github.com/splunk/security_content/blob/develop/detections/cloud/azure_ad_multiple_users_failing_to_authenticate_from_ip.yml) (splunk) — Matched T1110.003 with security-detections-mcp. Same Entra password-spray window: many accounts failing from one infrastructure range, then ConnectWise application sign-ins.
- [Entra ID Application Credential Modified](https://github.com/elastic/detection-rules/blob/main/rules/integrations/azure/persistence_entra_id_application_credential_modification.toml) (elastic) — Matched application credential with security-detections-mcp. Microsoft says the agents added application credentials and changed privileges after authenticating with the stolen ConnectWise app identities.
- Microsoft Defender titles for this campaign (guidance) — The blog's Defender coverage (unusual Graph activity for the ConnectWise application, application self-assigned Global Administrator, Graph activity from a threat-intelligence IP) is not a Sigma, Splunk, or Elastic rule. security-detections-mcp did not return those titles. Keep them as tenant alerts alongside the three rules above.

## Timeline
- First seen: 2026-09
- Last updated: 2026-11-15
- 2026-10-21 (Microsoft Threat Intelligence): Microsoft attributes the ConnectWise Cloud Backup supply-chain compromise to China-state-aligned Storm-0940 and says the actor used ARTEX to reach more than 2,250 Microsoft 365 tenants. Privileged cloud access followed in under three hours in some tenants.
- 2026-11-15 (OpenAttacks): Tagged ARTEX and backfilled attribution confidence, detections, and timeline from the cited Microsoft report.

## Tools
### AI tooling and models
- [ARTEX](https://github.com/RuoJi6/ARTEX) (open-source multi-agent LLM pen-test framework, model-agnostic) — Community-maintained fork; the original repository is unavailable.
- ConnectWise Cloud Backup (SkyKick) app identities
- Microsoft 365 / Entra ID

### Other tooling
- unknown

### Offensive frameworks
- [ARTEX](https://openattacks.ai/tools/artex/) (`artex`)

## Source notes
Imported from the AI Threat Watch Notion feed (an automated daily scan); not yet editorially reviewed. Feed severity: High. Feed novelty: Evolution.

## Sources
- <https://www.microsoft.com/en-us/security/blog/2026/10/21/storm-0940-uses-artex-agentic-ai-connectwise-supply-chain-compromise/> — Microsoft Threat Intelligence
- <https://www.bleepingcomputer.com/news/security/hackers-breach-microsoft-365-tenants-via-connectwise-supply-chain-attack/>
- <https://cyberscoop.com/microsoft-attributes-connectwise-supply-chain-attack-china-storm-0940/>
- <https://www.business-standard.com/technology/artificial-intelligence/chinese-linked-hackers-use-ai-to-compromise-firms-globally-microsoft-126102200170_1.html>
