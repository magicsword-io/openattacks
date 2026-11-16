# CyberStrikeAI attacks against schools in Africa and Latin America

- ID: kaspersky-cyberstrikeai-schools-2026
- Reported: 2026-11-04
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/kaspersky-cyberstrikeai-schools-2026/

## Summary
Financially motivated attacks against schools in Africa and Latin America used the open-source CyberStrikeAI implant. Initial access was through a compromised SQL Server. A C2-side LLM using MCP tools selected attack commands and achieved domain administrator privileges in three to four days. Techniques included a SystemUpdate scheduled task, certutil downloads, comsvcs.dll LSASS memory dumping, DCSync, and Golden Ticket generation.

## Category
adversary-use-of-ai

## Attribution
Unnamed. Kaspersky could not link the activity to a known group. Chinese-language script comments and UTC+8 control-server restarts suggest a Chinese-speaking operator.

- Actor: Unnamed operators
- Country: Unknown
- Motivation: unknown
- Attributed by: Kaspersky
- Confidence: low

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Compromised SQL Server
- Victims and sectors: Schools in Africa and Latin America
- Regions: Africa, South America
- Region notes: Africa and South America reflect targeted school systems in these regions
- Scale and metrics: Domain admin achieved in 3-4 days; multiple schools targeted

## Attack flow
### initial-access: SQL Server compromised (access)

Attacker gained initial access through compromised SQL Server

Evidence: <https://securelist.com/cyberstrikeai-attacks/121715/>

### implant: CyberStrikeAI implant deployed (ai)

Open-source CyberStrikeAI implant installed with C2 connection to fastcdn.bar and 185.186.245.144

Evidence: <https://securelist.com/cyberstrikeai-attacks/121715/>

### llm-decision: LLM selects attack commands (ai)

C2-side LLM using MCP tools autonomously chooses and executes attack techniques

Evidence: <https://securelist.com/cyberstrikeai-attacks/121715/>

### privilege-escalation: SystemUpdate task and credential dumping (execution)

SystemUpdate scheduled task created; certutil used for downloads; comsvcs.dll dumps LSASS memory

Evidence: <https://securelist.com/cyberstrikeai-attacks/121715/>

### domain-admin: Domain admin achieved via DCSync and Golden Ticket (impact)

DCSync extracts domain credentials; Golden Ticket generated for persistence; domain admin achieved in 3-4 days

Evidence: <https://securelist.com/cyberstrikeai-attacks/121715/>

### Connections

- initial-access -> implant
- implant -> llm-decision
- llm-decision -> privilege-escalation
- privilege-escalation -> domain-admin

## MITRE ATLAS
- [AML.T0016.002](https://atlas.mitre.org/techniques/AML.T0016.002) Generative AI — C2-side LLM with MCP tools autonomously executed attack operations
  Evidence: <https://securelist.com/cyberstrikeai-attacks/121715/>

## Prevention
Harden SQL Server; monitor for CyberStrikeAI indicators; detect SystemUpdate scheduled task creation; alert on certutil downloads; monitor comsvcs.dll LSASS dumps; detect DCSync activity; hunt for Golden Ticket use; block C2 infrastructure; review LOLBAS execution (certutil, comsvcs)

## Detections
- [Suspicious Child Process Of SQL Server](https://github.com/SigmaHQ/sigma/blob/master/rules/windows/process_creation/proc_creation_win_mssql_susp_child_process.yml) (sigma) — Matched sqlservr with security-detections-mcp. Kaspersky says the first commands in these incidents ran as children of sqlservr.exe.
- [Scheduled Task Creation Via Schtasks.EXE](https://github.com/SigmaHQ/sigma/blob/master/rules/windows/process_creation/proc_creation_win_schtasks_creation.yml) (sigma) — Matched schtasks with security-detections-mcp. The implant's first persistence step was a scheduled task named SystemUpdate.
- [File Decoded From Base64/Hex Via Certutil.EXE](https://github.com/SigmaHQ/sigma/blob/master/rules/windows/process_creation/proc_creation_win_certutil_decode.yml) (sigma) — Matched certutil decode with security-detections-mcp. Kaspersky says certutil decoded the assembled payload. The direct-IP download rule previously noted on this entry does not match that command.
- [Process Memory Dump Via Comsvcs.DLL](https://github.com/SigmaHQ/sigma/blob/master/rules/windows/process_creation/proc_creation_win_rundll32_process_dump_via_comsvcs.yml) (sigma) — Matched comsvcs with security-detections-mcp. The agent dumped lsass with comsvcs.dll MiniDump, passing the PID rather than the process name.
- [First Time Seen Account Performing DCSync](https://github.com/elastic/detection-rules/blob/main/rules/windows/credential_access_dcsync_newterm_subjectuser.toml) (elastic) — Matched DCSync with security-detections-mcp. After the domain administrator account was taken, the agent ran DCSync.
- Renamed Mimikatz and the implant token (guidance) — security-detections-mcp's Mimikatz hits key on the binary name or command line. Kaspersky says this activity used a renamed Mimikatz for DCSync and a Golden Ticket, so those name-based rules do not fit. No Sigma, Splunk, or Elastic rule encodes the X-Implant-Token header or the CyberStrikeAI certificate issuer.

## Timeline
- First seen: 2026-10-01
- Last updated: 2026-11-15
- 2026-10-23 (Trend Micro): TrendAI reports CyberStrikeAI campaign by Chinese-language operators targeting Japan
- 2026-11-04 (Kaspersky): CyberStrikeAI attacks against schools in Africa and Latin America disclosed
- 2026-11-15 (OpenAttacks): Tagged CyberStrikeAI and backfilled category, attribution, AI-involvement confidence, detections, and this timeline note from the cited Securelist report. Kaspersky does not name a group, country, or motive.

## Tools
### AI tooling and models
- CyberStrikeAI (https://github.com/CyberStrikeAI/CyberStrikeAI)
- LLM-driven C2 with MCP tools

### Other tooling
- SystemUpdate scheduled task
- certutil (LOLBAS)
- comsvcs.dll LSASS dump (LOLBAS)
- DCSync
- Golden Ticket
- Compromised SQL Server

### Offensive frameworks
- [CyberStrikeAI](https://openattacks.ai/tools/cyberstrikeai/) (`cyberstrikeai`)

### MagicSword projects
- [LOLBAS](https://lolbas-project.github.io)

## Source notes
Relevant detection rules:
- Sigma: Scheduled Task Creation Via Schtasks (https://github.com/SigmaHQ/sigma/blob/master/rules/windows/process_creation/proc_creation_win_schtasks_creation.yml)
- Sigma: Suspicious File Downloaded From Direct IP Via Certutil (https://github.com/SigmaHQ/sigma/blob/master/rules/windows/process_creation/proc_creation_win_certutil_download_direct_ip.yml)
- Sigma: Process Memory Dump Via Comsvcs.DLL (LSASS dump) (https://github.com/SigmaHQ/sigma/blob/master/rules/windows/process_creation/proc_creation_win_rundll32_process_dump_via_comsvcs.yml)
- Sigma: Suspicious LSASS Process Access (https://github.com/SigmaHQ/sigma/blob/master/rules/windows/process_creation/proc_creation_win_sysinternals_procdump_lsass.yml)
- Sigma: Powerview Add-DomainObjectAcl DCSync AD Extend Right (https://github.com/SigmaHQ/sigma/blob/master/rules/windows/builtin/security/win_security_account_backdoor_dcsync_rights.yml)
- Sigma: DCSync Attack Detection via RPC Firewall (https://github.com/SigmaHQ/sigma/blob/master/rules/application/rpc_firewall/rpc_firewall_dcsync_attack.yml)
- Sigma: PowerShell Malicious Cmdlets (covers Mimikatz/DCSync) (https://github.com/SigmaHQ/sigma/blob/master/rules/windows/process_creation/proc_creation_win_powershell_malicious_cmdlets.yml)
- LOLBAS references: certutil (https://lolbas-project.github.io/lolbas/Binaries/Certutil/), comsvcs.dll (https://lolbas-project.github.io/lolbas/Libraries/Comsvcs/), schtasks (https://lolbas-project.github.io/lolbas/Binaries/Schtasks/)

## Sources
- [CyberStrikeAI attacks](https://securelist.com/cyberstrikeai-attacks/121715/) — Kaspersky (Securelist)
