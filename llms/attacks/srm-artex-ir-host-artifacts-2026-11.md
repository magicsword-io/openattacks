# S-RM ARTEX in the wild - incident response host artifacts and TTPs

- ID: srm-artex-ir-host-artifacts-2026-11
- Reported: 2026-11-06
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/srm-artex-ir-host-artifacts-2026-11/

## Summary
S-RM incident response analysis (Nov 6, 2026) documents real-world ARTEX deployment artifacts and TTPs from multiple IR engagements. Initial access via vulnerable web plugins and misconfigured upload endpoints; rapid credential harvesting and reuse; autonomous agents pivot through identity systems, cloud resources, code repositories, and firewall configurations within a single day. One case featured MSP supply-chain pivot; another deployed card skimmers on compromised e-commerce sites. Attackers demonstrated persistent re-entry capability after initial containment, shifting to Tor and VPS infrastructure after IP blocking. Forensic artifacts: /opt/artex/data/task/<task>/i<id>/ directory structure; compromised files and accounts tagged with i<id> markers; SQL injection signatures ARTEX' UNION SELECT 1-- and ARTEX'/**/AND/**/2>1--; HTTP User-Agent norma/0.4; ARTEX web console self-signed certificate (O=ARTEX, C=CN) displaying Autonomous pentest console branding; GitHub branches named artex-wtest-*; fake emails @example.invalid. Actor unnamed; attributed by S-RM incident response; confirmed AI involvement from recovered agent task logs and autonomous pivot patterns. Sophos X-Ops (Nov 10, 2026) separately reports activity at a small number of customers consistent with ARTEX or other AI-assisted tooling: webshell and SQL Server command execution, credential theft, lateral movement, rapid command bursts, and structured markers. Windows host markers are temporary files named i[variant]_. such as i12345_b2.ps1, paths beginning artx especially under C:\Windows\Temp, and command markers MARKER123 or ARTX123. Cloud markers are a service principal credential or role added by an application, and application sign-ins with a scripted user agent. Sophos file detections are Troj/Bckdr-SDA for a trojanized ARTEX Docker image (see badbyte-artex-backdoor-docker-2026-11), Troj/Loader-TU, Linux/Agent-KD, and ATK/Artex-A, ATK/Artex-B, and ATK/Artex-C. Published firewall and endpoint IPS signatures are 2313266, 2313265, 2313264, 2313263, 2313261, 2313259, 2313258, and 2313257. Sophos cites Microsoft's Storm-0940 attribution for the ConnectWise Cloud Backup case only; that name is not applied to the S-RM engagements.

## Category
adversary-use-of-ai

## Attribution
Unnamed actors; attributed by S-RM incident response teams; multiple distinct but tactically similar ARTEX deployments

- Actor: Unnamed ARTEX operators
- Country: Unknown
- Motivation: financially-motivated
- Attributed by: S-RM, Sophos X-Ops
- Confidence: medium

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Vulnerable web plugins, misconfigured file upload endpoints
- Victims and sectors: Multiple organizations across sectors including e-commerce, MSPs; S-RM IR engagements 2026
- Regions: Multiple regions
- Region notes: unknown
- Scale and metrics: Multiple IR engagements 2026; identity/cloud/code/firewall compromise in under 24 hours; MSP supply-chain pivot in one case; card skimmer deployment in another; persistent re-entry after containment

## Attack flow
### initial-compromise: Exploit vulnerable web plugins (execution)

ARTEX agents exploit vulnerable web plugins and misconfigured file upload endpoints for initial access

Evidence: <https://www.s-rminform.com/latest-thinking/artex-in-the-wild-lessons-from-responding-to-agentic-ai-attacks>

### credential-harvest: Credential harvesting and reuse (execution)

Rapid credential harvesting from compromised hosts; credentials reused for lateral movement

Evidence: <https://www.s-rminform.com/latest-thinking/artex-in-the-wild-lessons-from-responding-to-agentic-ai-attacks>

### rapid-pivot: Identity/cloud/code/firewall pivot in <24h (execution)

Autonomous agents pivot through identity systems, cloud resources, code repositories, and firewall configurations within single day

Evidence: <https://www.s-rminform.com/latest-thinking/artex-in-the-wild-lessons-from-responding-to-agentic-ai-attacks>

### msp-pivot: MSP supply-chain pivot (one case) (execution)

In one engagement, ARTEX agents pivoted through compromised MSP to reach additional customer environments

Evidence: <https://www.s-rminform.com/latest-thinking/artex-in-the-wild-lessons-from-responding-to-agentic-ai-attacks>

### card-skimmer: Card skimmer deployment (one case) (impact)

In e-commerce compromise, agents deployed card skimmer malware to capture payment data

Evidence: <https://www.s-rminform.com/latest-thinking/artex-in-the-wild-lessons-from-responding-to-agentic-ai-attacks>

### persistent-reentry: Persistent re-entry after containment (execution)

Attackers demonstrated re-entry capability after initial containment, shifting to Tor/VPS infrastructure after IP blocking

Evidence: <https://www.s-rminform.com/latest-thinking/artex-in-the-wild-lessons-from-responding-to-agentic-ai-attacks>

### Connections

- initial-compromise -> credential-harvest
- credential-harvest -> rapid-pivot
- rapid-pivot -> msp-pivot
- rapid-pivot -> card-skimmer
- rapid-pivot -> persistent-reentry

## MITRE ATLAS
- [AML.T0049](https://atlas.mitre.org/techniques/AML.T0049) Exploit Public-Facing Application — ARTEX agents autonomously conduct full intrusion lifecycle from initial compromise through multi-system pivots without continuous operator guidance
  Evidence: <https://www.s-rminform.com/latest-thinking/artex-in-the-wild-lessons-from-responding-to-agentic-ai-attacks>
- [AML.T0012](https://atlas.mitre.org/techniques/AML.T0012) Valid Accounts — AI agents exploit vulnerable web plugins and file upload misconfigurations for initial access
  Evidence: <https://www.s-rminform.com/latest-thinking/artex-in-the-wild-lessons-from-responding-to-agentic-ai-attacks>
- [AML.T0055](https://atlas.mitre.org/techniques/AML.T0055) Unsecured Credentials — Agents autonomously harvest and reuse credentials, pivot through identity systems, cloud resources, code repositories, and firewall configurations in under 24 hours
  Evidence: <https://www.s-rminform.com/latest-thinking/artex-in-the-wild-lessons-from-responding-to-agentic-ai-attacks>

## Prevention
Patch vulnerable web plugins promptly; restrict and validate file uploads; implement strict authentication for admin interfaces; monitor for ARTEX forensic indicators (/opt/artex/ directories, i<id> file/account tagging, SQL markers, norma/0.4 UA, self-signed ARTEX certs); block Tor egress where not required; implement network segmentation to limit lateral movement; rotate credentials after suspected compromise; monitor for artex-wtest- GitHub branch patterns; scrutinize @example.invalid emails in logs; deploy EDR to detect autonomous pivot behaviors; implement MSP supply-chain security controls

## Detections
- [Potential IIS Web Shell File Creation](https://github.com/elastic/detection-rules/blob/main/rules/windows/persistence_web_shell_aspx_write.toml) (elastic) — Windows. ASPX web shell writes under IIS paths. Matches the Sophos report of webshell execution on customer hosts.
- [Suspicious Process By Web Server Process](https://github.com/SigmaHQ/sigma/blob/master/rules/windows/process_creation/proc_creation_win_webshell_susp_process_spawned_from_webserver.yml) (sigma) — Windows. Shells spawned by w3wp.exe and other web server processes.
- [Windows Sqlservr Spawning Shell](https://github.com/splunk/security_content/blob/develop/detections/endpoint/windows_sqlservr_spawning_shell.yml) (splunk) — Windows. sqlservr.exe spawning cmd.exe or PowerShell, matching Sophos SQL Server command execution.
- [SQL Injection with Long URLs](https://github.com/splunk/security_content/blob/develop/detections/web/sql_injection_with_long_urls.yml) (splunk) — Detects SQL injection patterns including ARTEX UNION SELECT and comment-based injection markers
- [Suspicious C2 Activities](https://github.com/SigmaHQ/sigma/blob/master/rules/linux/auditd/lnx_auditd_susp_c2_commands.yml) (sigma) — Detects Tor usage, curl/wget C2 patterns, and credential reuse behaviors
- ARTEX forensic artifact detection (guidance) — Linux: monitor for /opt/artex/data/task/<task>/i<id>/ directory structures; alert on files and accounts tagged with i<id> patterns; flag HTTP User-Agent norma/0.4; scan for self-signed certificates with O=ARTEX, C=CN; monitor for Autonomous pentest console branding; detect GitHub branches named artex-wtest-*; alert on @example.invalid emails. Windows (Sophos): files named i\[variant\]_. such as i12345_b2.ps1, paths beginning artx under C:\Windows\Temp, and command markers MARKER123 or ARTX123. Cloud: service principal credential or role added by an application, and application sign-ins with a scripted user agent. Sophos file names Troj/Bckdr-SDA, Troj/Loader-TU, Linux/Agent-KD, ATK/Artex-A/B/C and IPS 2313266, 2313265, 2313264, 2313263, 2313261, 2313259, 2313258, 2313257 are vendor signatures, not public Sigma or Elastic rules.
- Rapid lateral movement detection (guidance) — Detect identity system pivots within 24-hour window; alert on cloud resource access from newly compromised credentials; monitor code repository access anomalies; flag firewall configuration changes from suspicious sources; detect MSP credential usage across multiple customer tenants; implement EDR behavioral detection for autonomous pivot patterns
- Card skimmer and payment fraud detection (guidance) — Scan e-commerce sites for injected JavaScript card skimmers; monitor payment form modifications; detect exfiltration of payment data; alert on suspicious checkout flow changes

## Timeline
- Last updated: 2026-11-10
- 2026-11-06 (S-RM): S-RM publishes incident response analysis documenting ARTEX deployment artifacts, TTPs, and forensic indicators from multiple IR engagements; identity/cloud/code/firewall pivots in <24h; MSP supply-chain compromise; card skimmer deployment; persistent re-entry after containment
- 2026-11-10 (Sophos X-Ops): Sophos publishes Windows host markers (i\[variant\]_. files, artx paths under C:\Windows\Temp, MARKER123/ARTX123), cloud service-principal markers, file detections including Troj/Bckdr-SDA, and IPS signatures 2313266, 2313265, 2313264, 2313263, 2313261, 2313259, 2313258, and 2313257. Customer activity is described as consistent with ARTEX or other AI-assisted tooling. Storm-0940 is cited only for Microsoft's ConnectWise attribution.

## Tools
### AI tooling and models
- [ARTEX](https://github.com/RuoJi6/ARTEX) autonomous offensive agent (https://github.com/RuoJi6/ARTEX) — Community-maintained fork; the original repository is unavailable.
- LLM backends for agent decision-making

### Other tooling
- SQL injection tools
- Credential harvesting utilities
- Card skimmer malware
- Tor network
- VPS infrastructure

## Source notes
S-RM blog (Nov 6, 2026) primary source documenting IR artifacts from multiple ARTEX engagements; all forensic indicators (file paths, SQL markers, UA strings, certificate details, GitHub patterns) verified from S-RM analysis; unnamed adversaries due to ongoing investigations. Sophos X-Ops (Nov 10, 2026) adds Windows host markers and the listed IPS IDs. 2313260 and 2313262 are not in the published signature table, so they are omitted. Sophos describes the customer activity as consistent with ARTEX or other AI-assisted tooling, which is vendor-asserted and does not replace the S-RM task-log evidence. Storm-0940 is Microsoft's attribution for ConnectWise, cited by Sophos, and is not used as the actor for the S-RM cases.

## Sources
- [S-RM: ARTEX in the Wild - Lessons from Responding to Agentic AI Attacks](https://www.s-rminform.com/latest-thinking/artex-in-the-wild-lessons-from-responding-to-agentic-ai-attacks) — S-RM
- [ARTEX: Attackers apply agentic AI](https://www.sophos.com/en-us/blog/artex-attackers-apply-agentic-ai) — Sophos X-Ops
