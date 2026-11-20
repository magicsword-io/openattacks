# GTIG/Mandiant: UNC7228 and other crews run ARTEX and PentAGI agent frameworks in live intrusions at machine speed

- ID: gtig-mandiant-unc7228-other-crews-run-2026-10
- Reported: 2026-10-30
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/gtig-mandiant-unc7228-other-crews-run-2026-10/

## Summary
Google's incident responders have seen ARTEX and PentAGI agents run lateral movement, AD credential theft, webshell deployment and exfil prep on their own after operators hand them credentials, with access-to-deep-access times as short as 15 minutes.

## Category
adversary-use-of-ai

## Attribution
UNC7228 (GTIG; overlaps Microsoft's Storm-0940); other unnamed financially motivated and suspected PRC-nexus clusters

- Actor: UNC7228 (GTIG; overlaps Microsoft's Storm-0940); other unnamed financially motivated and suspected PRC-nexus clusters
- Country: China
- Motivation: nation-state
- Attributed by: Google Threat Intelligence Group and Mandiant
- Confidence: medium

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: unknown
- Victims and sectors: Government; Technology and AI companies; Critical infrastructure; Multiple sectors
- Regions: unknown
- Region notes: The 30 October 2026 report did not name countries for UNC7228 or the other crews. The 16 November 2026 tracker says the customized PentAGI platform scanned organizations in Asia. Asia is that activity, not a victim-country list for every crew in this entry. Actor nexus is not a victim region.
- Scale and metrics: unknown

## Attack flow
No attack flow is recorded.

## MITRE ATLAS
No ATLAS mapping is recorded.

## Prevention
unknown

## Detections
- [Kerberoasting Activity - Initial Query](https://github.com/SigmaHQ/sigma/blob/master/rules/windows/builtin/security/win_security_kerberoasting_activity.yml) (sigma) — Matched Kerberoasting with security-detections-mcp. GTIG says ARTEX ran Kerberoasting scripts to harvest service tickets.
- [First Time Seen Account Performing DCSync](https://github.com/elastic/detection-rules/blob/main/rules/windows/credential_access_dcsync_newterm_subjectuser.toml) (elastic) — Matched DCSync with security-detections-mcp. GTIG says ARTEX followed Kerberoasting with DCSync scripts for the krbtgt key and domain-controller hashes.
- [Potential Pass-the-Hash (PtH) Attempt](https://github.com/elastic/detection-rules/blob/main/rules/windows/lateral_movement_alternate_creds_pth.toml) (elastic) — Matched Pass the Hash with security-detections-mcp. GTIG lists Pass-the-Hash among the lateral-movement scripts ARTEX attempted against domain controllers.
- [Linux Webshell Indicators](https://github.com/SigmaHQ/sigma/blob/master/rules/linux/process_creation/proc_creation_lnx_webshell_detection.yml) (sigma) — Matched webshell with security-detections-mcp. GTIG describes JSP webshells written through MySQL general_log on a Linux Weaver OA server.
- [Connection to Commonly Abused Web Services](https://github.com/elastic/detection-rules/blob/main/rules/windows/command_and_control_common_webservices.toml) (elastic) — Matched webhook.site with security-detections-mcp. GTIG says a Windows database server used curl to post command results to rotating webhook.site URLs.
- MySQL general_log poisoning and artex-probe filenames (guidance) — security-detections-mcp searches for jsp and webshell returned Linux webshell and SAP NetWeaver rules. None encode SET GLOBAL general_log_file writes of JSP content, the cl1217.jsp-style names, or artex-probe filenames. Hunt those strings in web and database logs.

## Timeline
- First seen: 2026-08
- Last updated: 2026-11-16
- 2026-10-30 (Google Threat Intelligence Group and Mandiant): GTIG and Mandiant report ARTEX, PentAGI, Hexstrike, and CAIRN in incident-response engagements since late August 2026. UNC7228 overlaps Microsoft's PRC-nexus Storm-0940; other crews are financially motivated or suspected PRC-nexus.
- 2026-11-15 (OpenAttacks): Tagged ARTEX and PentAGI and backfilled attribution confidence, detections, and timeline from the cited GTIG report.
- 2026-11-16 (Google Threat Intelligence Group): GTIG says a customized platform built on open-source PentAGI was used from late August to early October 2026 for reconnaissance and vulnerability scanning against organizations in Asia. frameworks stays artex and pentagi.

## Tools
### AI tooling and models
- [ARTEX](https://github.com/RuoJi6/ARTEX), [PentAGI](https://github.com/vxcontrol/pentagi), Hexstrike, [CAIRN](https://github.com/oritera/Cairn) agent frameworks — Community-maintained fork; the original repository is unavailable. MoLeft/ARTEX also returned HTTP 200 on 2026-11-16. The original Autumn-27/ARTEX repository returned HTTP 404.
- unnamed frontier and open-weight LLM APIs, LLM mixers and local models

### Other tooling
- unknown

### Offensive frameworks
- [ARTEX](https://openattacks.ai/tools/artex/) (`artex`)
- [PentAGI](https://openattacks.ai/tools/pentagi/) (`pentagi`)

## Source notes
Imported from the AI Threat Watch Notion feed (an automated daily scan); not yet editorially reviewed. Feed severity: High. Feed novelty: Evolution. The 16 November 2026 GTIG tracker says that from late August to early October 2026 a threat actor used a customized attack orchestration platform built on the open-source version of PentAGI for systematic reconnaissance and vulnerability scanning against organizations in Asia. The public project page checked for that name is https://github.com/vxcontrol/pentagi, which returned HTTP 200 on 16 November 2026. GTIG did not publish a repository URL. frameworks already includes pentagi. Cairn is not added here: the same tracker describes a separate Cairn intrusion, including a US aerospace target, which is noted on unit42-cairn-cl-sta-1238-2026-11 rather than attributed to UNC7228.

## Sources
- <https://cloud.google.com/blog/topics/threat-intelligence/artex-and-friends-enter-agentic-offensive-frameworks> — Google Threat Intelligence Group / Mandiant
- <https://cellcog.ai/blog/workos-artex-breach/>
- [GTIG AI Threat Tracker: Agentic Threat Activity Crosses a Significant Threshold](https://cloud.google.com/blog/topics/threat-intelligence/agentic-threat-activity-crosses-a-significant-threshold/) — Google Threat Intelligence Group
