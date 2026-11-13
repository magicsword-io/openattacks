# Storm-3358 ARTEX autonomous agent bank intrusions (Southeast Asia)

- ID: storm-3358-artex-bank-intrusions-2026-11
- Reported: 2026-11-06
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/storm-3358-artex-bank-intrusions-2026-11/

## Summary
Microsoft Threat Intelligence (Nov 6, 2026) reports Storm-3358, Cambodia-based financially motivated actor, targeting Southeast Asian financial sector using ARTEX autonomous offensive agents. Censys fingerprinting (Silas Cutler) identifies exposed ARTEX control panels via console title starting ARTEX + Next.js signature, port 8787, open directories leaking attack kit configurations. Oct 2026 activity: ARTEX agents autonomously scanned targets, exploited anonymous file upload vulnerabilities and SSRF, used netcat/curl to pull WISP RAT, vshell, and AdaptixC2 C2 frameworks; deployed web shells; conducted brute-force and password-spraying attacks; performed lateral movement. C2 infrastructure: WISP C2 199.19.95.66-68, AdaptixC2 85.11.167.52. ARTEX control panel servers: 91.92.240.238, 85.11.168.45, 31.77.229.35, 178.16.54.129 (Microsoft post hunting query lists 178.15.54.129 - note IP discrepancy). Storm-3358 attributed by Microsoft; vendor-asserted AI involvement. Tools: AdaptixC2 (github.com/Adaptix-Framework/AdaptixC2), ARTEX fork (github.com/RuoJi6/ARTEX; original Autumn-27/ARTEX repository down).

## Category
adversary-use-of-ai

## Attribution
Storm-3358, Cambodia-based, financially motivated; attributed by Microsoft Threat Intelligence

- Actor: Storm-3358
- Country: Cambodia
- Motivation: financially-motivated
- Attributed by: Microsoft Threat Intelligence
- Confidence: high

## AI involvement confidence
vendor-asserted

## Scope and targeting
- Initial access: Anonymous file upload exploitation, SSRF vulnerabilities
- Victims and sectors: Southeast Asian financial institutions; Oct 2026 active campaign
- Regions: Asia
- Region notes: unknown
- Scale and metrics: Active Oct 2026; multiple financial institutions compromised; Censys identified exposed ARTEX panels on port 8787 with leaked attack kit configurations

## Attack flow
### recon-scan: ARTEX autonomous reconnaissance (ai)

ARTEX agents autonomously scan Southeast Asian financial institution networks for vulnerabilities

Evidence: <https://www.microsoft.com/en-us/security/blog/2026/11/06/artex-abuse-expands-as-cybercriminals-target-financial-sector/>

### exploit-upload: Exploit anonymous file upload and SSRF (execution)

Agents exploit anonymous file upload vulnerabilities and SSRF to gain initial foothold

Evidence: <https://www.microsoft.com/en-us/security/blog/2026/11/06/artex-abuse-expands-as-cybercriminals-target-financial-sector/>

### deploy-rats: Deploy WISP, vshell, AdaptixC2 (execution)

netcat/curl used to pull WISP RAT, vshell, AdaptixC2 C2 frameworks to compromised hosts

Evidence: <https://www.microsoft.com/en-us/security/blog/2026/11/06/artex-abuse-expands-as-cybercriminals-target-financial-sector/>

### web-shells: Deploy web shells (execution)

Web shells deployed for persistent access to compromised web servers

Evidence: <https://www.microsoft.com/en-us/security/blog/2026/11/06/artex-abuse-expands-as-cybercriminals-target-financial-sector/>

### lateral-movement: Brute-force, spraying, lateral movement (execution)

Autonomous password brute-force and spraying attacks; lateral movement across financial institution networks

Evidence: <https://www.microsoft.com/en-us/security/blog/2026/11/06/artex-abuse-expands-as-cybercriminals-target-financial-sector/>

### maintain-access: Maintain C2 and data access (impact)

WISP C2 199.19.95.66-68, AdaptixC2 85.11.167.52 maintain persistent access for financial data theft

Evidence: <https://www.microsoft.com/en-us/security/blog/2026/11/06/artex-abuse-expands-as-cybercriminals-target-financial-sector/>

### Connections

- recon-scan -> exploit-upload
- exploit-upload -> deploy-rats
- deploy-rats -> web-shells
- web-shells -> lateral-movement
- lateral-movement -> maintain-access

## MITRE ATLAS
- [AML.T0049](https://atlas.mitre.org/techniques/AML.T0049) Exploit Public-Facing Application — Storm-3358 deploys ARTEX autonomous AI agents to conduct reconnaissance, vulnerability exploitation, and lateral movement without continuous operator input
  Evidence: <https://www.microsoft.com/en-us/security/blog/2026/11/06/artex-abuse-expands-as-cybercriminals-target-financial-sector/>
- [AML.T0012](https://atlas.mitre.org/techniques/AML.T0012) Valid Accounts — ARTEX agents autonomously exploit file upload and SSRF vulnerabilities to gain initial access to financial institution networks
  Evidence: <https://www.microsoft.com/en-us/security/blog/2026/11/06/artex-abuse-expands-as-cybercriminals-target-financial-sector/>
- [AML.T0016](https://atlas.mitre.org/techniques/AML.T0016) Obtain Capabilities — Adversaries use AI agents to automate post-exploitation activities including lateral movement and C2 deployment
  Evidence: <https://www.microsoft.com/en-us/security/blog/2026/11/06/artex-abuse-expands-as-cybercriminals-target-financial-sector/>

## Prevention
Implement file upload restrictions and validation; patch SSRF vulnerabilities; monitor for ARTEX console fingerprints (title ARTEX + Next.js, port 8787); block known C2 IPs (199.19.95.66-68, 85.11.167.52, 91.92.240.238, 85.11.168.45, 31.77.229.35); detect anomalous autonomous scanning patterns; monitor netcat/curl downloading RATs; implement web application firewalls; enable brute-force protection; segment networks to limit lateral movement

## Detections
- [Linux Webshell Indicators](https://github.com/SigmaHQ/sigma/blob/master/rules/linux/process_creation/proc_creation_lnx_webshell_detection.yml) (sigma) — Detects webshell process indicators on Linux; directly applicable to Storm-3358 web shell deployment
- [Suspicious Reverse Shell Command Line](https://github.com/SigmaHQ/sigma/blob/master/rules/linux/builtin/lnx_shell_susp_rev_shells.yml) (sigma) — Detects netcat reverse shells and RAT download patterns used by ARTEX agents
- [Suspicious C2 Activities](https://github.com/SigmaHQ/sigma/blob/master/rules/linux/auditd/lnx_auditd_susp_c2_commands.yml) (sigma) — Detects curl/wget downloading payloads and C2 command execution patterns
- ARTEX console fingerprinting (guidance) — Monitor for ARTEX control panel fingerprints: console title starting with ARTEX, Next.js framework signature, port 8787; scan for open directories exposing attack kit configurations; block known ARTEX IPs (91.92.240.238, 85.11.168.45, 31.77.229.35, 178.16.54.129); detect autonomous scanning patterns
- Password spraying and brute force (guidance) — Block known C2 IPs: WISP RAT 199.19.95.66-68, AdaptixC2 85.11.167.52; detect anomalous brute-force and password-spraying patterns; monitor lateral movement indicators

## Timeline
- First seen: 2026-10-01
- Last updated: 2026-11-06
- 2026-10-01 (Microsoft Threat Intelligence): Storm-3358 ARTEX campaign against Southeast Asian financial institutions begins; autonomous agents exploit file upload and SSRF vulnerabilities
- 2026-11-06 (Microsoft Threat Intelligence): Microsoft reports Storm-3358 ARTEX abuse expanding; Censys publishes fingerprinting methodology for exposed ARTEX control panels

## Tools
### AI tooling and models
- [ARTEX](https://github.com/RuoJi6/ARTEX) autonomous offensive agent (https://github.com/RuoJi6/ARTEX) — Community-maintained fork; the original repository is unavailable.
- [DeepSeek](https://github.com/deepseek-ai) and other LLM backends

### Other tooling
- WISP RAT
- vshell
- AdaptixC2 C2 framework (https://github.com/Adaptix-Framework/AdaptixC2)
- netcat
- curl
- Web shells

## Source notes
Microsoft Threat Intelligence blog (Nov 6, 2026) primary source; Censys Agentic Asbestos analysis (Silas Cutler) provides ARTEX fingerprinting methodology; all IOCs verified from sources; note IP discrepancy between main text (178.16.54.129) and hunting query (178.15.54.129) in Microsoft post

## Sources
- [Microsoft Threat Intelligence: ARTEX Abuse Expands as Cybercriminals Target Financial Sector](https://www.microsoft.com/en-us/security/blog/2026/11/06/artex-abuse-expands-as-cybercriminals-target-financial-sector/) — Microsoft
- [Censys: ARTEX - Agentic Asbestos](https://censys.com/blog/artex-agentic-asbestos/) — Censys
