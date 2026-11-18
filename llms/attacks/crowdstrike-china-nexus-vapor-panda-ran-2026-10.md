# CrowdStrike: China-nexus VAPOR PANDA ran DeepSeek-backed ARTEX agents against 200+ organizations in 11 days

- ID: crowdstrike-china-nexus-vapor-panda-ran-2026-10
- Reported: 2026-10-29
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/crowdstrike-china-nexus-vapor-panda-ran-2026-10/

## Summary
A China-nexus espionage group used ARTEX multi-agent tooling on DeepSeek to run simultaneous intrusions against 200+ organizations in 14+ countries, confirming post-exploitation at nine, at roughly 40x human command rates.

## Category
adversary-use-of-ai

## Attribution
VAPOR PANDA (CrowdStrike; THN says previously VexatiousTemper, overlaps Earth Estries)

- Actor: VAPOR PANDA (CrowdStrike; THN says previously VexatiousTemper, overlaps Earth Estries)
- Country: China
- Motivation: nation-state
- Attributed by: CrowdStrike
- Confidence: high

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: unknown
- Victims and sectors: Government; Defense; Finance; Critical infrastructure; Technology and AI companies; Healthcare
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
- [Detect Password Spray Attempts](https://github.com/splunk/security_content/blob/develop/detections/application/detect_password_spray_attempts.yml) (splunk) — Matched password spray with security-detections-mcp. The Hacker News account of CrowdStrike's report says VAPOR PANDA password-sprayed credentials, including against at least 12 further organizations.
- [Antivirus - Web Shell Detection Signature](https://github.com/SigmaHQ/sigma/blob/master/rules/category/antivirus/av_webshell.yml) (sigma) — Matched web shell with security-detections-mcp. The same account says the operators wrote web shells. It does not name IIS or a file extension, so this is the generic antivirus signature rather than an IIS-only rule.
- [Suspicious Instance Metadata Service (IMDS) API Command Line Execution](https://github.com/elastic/detection-rules/blob/main/rules/cross-platform/credential_access_suspicious_instance_metadata_service_api_cli.toml) (elastic) — Matched Instance Metadata with security-detections-mcp. CrowdStrike, via The Hacker News, describes a SAML assertion chained with XXE to query the cloud instance metadata service.
- BLOODALCHEMY and the container-root path (guidance) — security-detections-mcp searches for web shell, password spray, and IMDS did not return a rule for BLOODALCHEMY, its ShadowPad lineage, or root access through an unauthenticated orchestration service. Those are named in the CrowdStrike account and need a campaign hunt rather than a generic host rule.

## Timeline
- First seen: 2026-10-17
- Last updated: 2026-11-15
- 2026-10-29 (CrowdStrike): CrowdStrike attributes ARTEX use from 17 October 2026 against more than 200 organizations to China-nexus VAPOR PANDA, previously VexatiousTemper, overlapping Earth Estries. Post-exploitation was confirmed at nine organizations.
- 2026-11-15 (OpenAttacks): Tagged ARTEX and backfilled attribution confidence, detections, and timeline from the cited CrowdStrike, CyberScoop, and The Hacker News reports.

## Tools
### AI tooling and models
- [ARTEX](https://github.com/RuoJi6/ARTEX) agent framework — Community-maintained fork; the original repository is unavailable.
- [DeepSeek](https://github.com/deepseek-ai)
- unnamed subscription-based commercial LLM

### Other tooling
- unknown

### Offensive frameworks
- [ARTEX](https://openattacks.ai/tools/artex/) (`artex`)

## Source notes
Imported from the AI Threat Watch Notion feed (an automated daily scan); not yet editorially reviewed. Feed severity: High. Feed novelty: Evolution.

## Sources
- <https://www.crowdstrike.com/en-us/blog/vapor-panda-uses-artex-to-scale-global-campaign/> — CrowdStrike
- <https://cyberscoop.com/china-vapor-panda-agentic-ai-artex-campaign-crowdstrike/>
- <https://thehackernews.com/2026/10/chinese-hackers-use-ai-powered-artex-to.html>
