# Proofpoint: criminals abuse Lovable AI site builder at scale for MFA phishing, drainers and zgRAT delivery

- ID: proofpoint-criminals-abuse-lovable-ai-site-2025-08
- Reported: 2025-08-14
- AI role: ai_credential_theft
- Entry: https://openattacks.ai/attacks/proofpoint-criminals-abuse-lovable-ai-site-2025-08/

## Summary
Proofpoint reported that tens of thousands of Lovable-hosted URLs a month were used for credential phishing, crypto drainers, and malware delivery, including activity tied to Tycoon phishing-as-a-service and Cookie Reloaded redirects. Confiant (Nov 11, 2026) describes PseudoCamo, a cloaked investment-scam cluster tracked since April that passed roughly 650 blocked domains in late August. Ads land on a localized 18+ age gate hosted on AI app-builder subdomains, then redirect to a second-hop money page. Observed hosts include befideapro.lovable.app uncloaking to befidea.pro, arveniop.lovable.app, newsireland-2.base44.app, and istanbul-space.base44.app. Targets included Poland, Romania, Czechia, Spain, Canada, and South Africa, then Ireland and Turkey. PseudoCamo is a sibling of BabaCamo. A UK money page on lofim.shop, reached through a black.php gate and also linked from compile-code-online.pages.dev, has victims deploy a MetaMask contract, fund it, and click Start. The third transaction sends the balance to the scammer. A fake Microsoft Teams APK at teamsapk.cyou is a remote-access trojan whose operator status strings are Chinese. It uses a WebSocket command-and-control channel at abc.claude-go.com and abc.visapath-vp.com.

## Category
adversary-use-of-ai

## Attribution
PseudoCamo; TeamsAPK operator; Tycoon PhaaS users; Cookie Reloaded redirect operators

- Actor: PseudoCamo; TeamsAPK operator; Tycoon PhaaS users; Cookie Reloaded redirect operators
- Country: Unknown
- Motivation: financially-motivated
- Attributed by: Proofpoint, Confiant Threat Intelligence
- Confidence: medium

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Malvertising and phishing pages hosted on AI website builders, plus a fake Microsoft Teams download page
- Victims and sectors: Consumers targeted by investment scams, wallet drainers, and a fake Microsoft Teams app. Proofpoint also reported finance-sector phishing.
- Regions: Poland, Romania, Czechia, Spain, Canada, South Africa, Ireland, Turkey, United Kingdom, Multiple regions
- Region notes: Confiant names those countries as PseudoCamo or trading-bot targets. Actor origin is not used as a victim location. PseudoCamo is described as a sibling of the Eastern European BabaCamo cluster, and the TeamsAPK operator's status strings are Chinese. Neither statement is a country attribution.
- Scale and metrics: Proofpoint: tens of thousands of Lovable-hosted URLs a month. Confiant: PseudoCamo passed roughly 650 blocked domains by late August.

## Attack flow
No attack flow is recorded.

## MITRE ATLAS
No ATLAS mapping is recorded.

## Prevention
Treat lovable.app and base44.app subdomains as untrusted until the publisher is verified. Block the listed scam and command-and-control domains. Warn users who are asked to deploy and fund a wallet contract from an ad. Do not install Teams from teamsapk.cyou.

## Detections
- AI-builder malvertising and in-browser drainer (guidance) — security-detections-mcp searches for wallet drainer, MetaMask, and malvertising returned no rule that matches this activity. PseudoCamo is cloaked malvertising on a hosted website, and the trading-bot theft is three transactions the victim signs in MetaMask. TeamsAPK is an Android package. None of those are a Windows, Linux, macOS, or CloudTrail pattern in the Sigma, Splunk, or Elastic corpora. Block the domains above and review ad-landing hosts on lovable.app and base44.app.

## Timeline
- First seen: 2025-08-14
- Last updated: 2026-11-11
- 2025-08-14 (Proofpoint): Proofpoint reports large-scale abuse of the Lovable AI site builder for credential phishing, crypto drainers, and malware delivery.
- 2026-11-11 (Confiant): Confiant publishes PseudoCamo white pages on lovable.app and base44.app, the lofim.shop Claude-branded trading-bot drainer, and the TeamsAPK Claude-themed command-and-control domains. The cluster was tracked since April and passed roughly 650 blocked domains in late August.

## Tools
### AI tooling and models
- Lovable AI website builder
- Base44 AI app builder
- [Claude](https://claude.com/product/overview) branding used as a lure on the trading-bot page and the TeamsAPK command-and-control domain

### Other tooling
- MetaMask contract deployment used by the trading-bot drainer
- black.php cloaking gate
- TeamsAPK Android remote-access trojan

## Source notes
Imported from the AI Threat Watch Notion feed and extended with the Confiant field note. Confiant confirms the pages are hosted on AI builders and does not claim the sites were AI-generated. There is no attacker GitHub repository.

## Sources
- [Cybercriminals Abuse AI Website Creation App for Phishing](https://www.proofpoint.com/us/blog/threat-insight/cybercriminals-abuse-ai-website-creation-app-phishing) — Proofpoint
- [Experts Find AI Browsers Can Be Tricked by PromptFix Exploit to Run Malicious Hidden Prompts](https://thehackernews.com/2025/08/experts-find-ai-browsers-can-be-tricked.html) — The Hacker News
- [Lovable security statement](https://lovable.dev/blog/lovable-security) — Lovable
- [Field Intelligence #5: Scareware at scale. Investment scams built on AI platforms](https://blog.confiant.com/p/field-intelligence-5-scareware-at-scale) — Confiant
