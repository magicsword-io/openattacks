# Symantec - AI-assisted commands revived a stalled intrusion at a US retailer

- ID: symantec-ai-revived-retailer-intrusion-2026-11
- Reported: 2026-11-16
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/symantec-ai-revived-retailer-intrusion-2026-11/

## Summary
Symantec Threat Hunter Team (Broadcom; SECURITY.COM article created Nov 16, 2026) describes a September 2026 intrusion at a U.S. retailer. The initial access vector is unknown. The earliest activity, Sep 18, was on three Microsoft SQL Server hosts, with cmd.exe running under sqlservr.exe, which Symantec treats as likely xp_cmdshell. Some of those commands were already long PowerShell scripts with quoted section labels. The scripts searched point-of-sale synchronization directories for stored passwords and connection strings, tested egress to 155.254.22[.]215:9458, and on one host appended base64 text under ProgramData, decoded it with Certutil, and compiled it with csc.exe. The source was EfsPotato (https://github.com/zcgonvh/EfsPotato). The payload saved the SAM, SYSTEM, and SECURITY hives. On Sep 21 an internet-facing IIS server appeared, with commands under w3wp.exe. On Sep 22 the commands looked hand-typed: 110 actions, three typos including systemifo and pwoershell, average length about 45 characters. Loaders were killed by security software, including a Bitdefender bdreinit.exe sideload of log.dll and log.txt from 204.194.49[.]129:8080, a pairing also seen with ShadowPad loaders and not unique to one actor. The operators reran that loader about five times in 20 minutes. They also staged an AES PowerShell reverse shell, server.ps1, toward 166.0.25[.]106:443 with a fallback host at 154.81.37[.]136, and wrote ASP webshells filemanager.asp and qwdajhsd.asp. On Sep 23 they staged a G DATA ask.exe/ask.dll sideload and BreakChainC.exe, then switched to about 50 long, error-free PowerShell scripts over about two hours. Banners included ===FILES MENTIONING CONN STRINGS===. Comments stated a hypothesis, cited earlier results, and revised a conclusion, which Symantec reads as model reasoning pasted into a webshell. The scripts collected connection strings, the FileZilla Server user database, WinSCP, PuTTY, and RDP settings, IIS configuration, and Windows logon registry values. They found SolarWinds Orion, read its bundled RabbitMQ .erlang.cookie, and ran Orion's erl.exe so rpc:call reached os:cmd on a second server. The command was passed as decimal character codes. That was about 10 minutes after the first Orion query. Later the same day BreakChainCs.exe relaunched the sideloaded binaries through WMI and shell modes so they were no longer children of w3wp.exe. From Sep 24 to Sep 29 the activity reached more SQL servers, a host that looks like a domain controller, Chisel, a password sprayer, and searches for NTDS.dit, Group Policy Preferences passwords, and LAPS. No data theft or encryption was observed. Symantec's financial-motive reading rests on the point-of-sale password search, contact with 155.254.22[.]215 (named in a separate Sep 22 Gambit Security report as an AI console tied to card-skimming activity), and later domain-credential theft that could be ransomware preparation. Loader files and the staging server overlap an August intrusion elsewhere and a July intrusion at a securities firm; neither of those showed AI assistance. Yuze (https://github.com/P001water/yuze) was used in the August case back to 204.194.49[.]129. Trend Micro has documented Yuze use by Warlock operators (Symantec Longlegs, also known as Storm-2603). Symantec does not attribute this intrusion to them. ATT&CK techniques in the report include T1574.002, T1505.003, T1552.001, T1021, and T1003.002.

## Category
adversary-use-of-ai

## Attribution
Unnamed. Symantec does not tie the activity to Warlock, Longlegs, or Storm-2603. ShadowPad-associated sideloading and Yuze are shared with other actors and are not treated as an attribution.

- Actor: Unnamed
- Country: Unknown
- Motivation: financially-motivated
- Attributed by: Symantec Threat Hunter Team (Broadcom)
- Confidence: low

## AI involvement confidence
vendor-asserted

## Scope and targeting
- Initial access: Unknown. The first observed commands were cmd.exe under sqlservr.exe on SQL Server, consistent with xp_cmdshell, and later cmd.exe under w3wp.exe on IIS.
- Victims and sectors: A U.S. retail organization. Internet-facing IIS and at least six further servers, most of them Microsoft SQL Server. Point-of-sale synchronization scripts were searched for passwords.
- Regions: United States
- Region notes: The primary victim is a U.S. retailer. The August and July overlaps are different organizations and are not given countries in the retailer write-up.
- Scale and metrics: Sep 18 through at least Sep 29, 2026. On Sep 23, about 50 scripts in about two hours, median length over 500 characters, against about 45 characters for the earlier hand-typed commands. About 10 minutes from the first Orion query to command execution on a second server. No theft or encryption observed in this intrusion.

## Attack flow
### sql-and-iis: SQL Server and IIS command shells (access)

From Sep 18, cmd.exe runs under sqlservr.exe. From Sep 21, commands run under w3wp.exe. Symantec does not identify the initial entry vector.

Evidence: <https://www.security.com/threat-intelligence/ai-assisted-attack-us-retailer>

### stalled: Hand-typed commands stall (execution)

Sep 22 commands include typos such as systemifo and pwoershell. Security software kills staged loaders, including the bdreinit.exe and log.dll pair, and the operators retry without changing approach.

Evidence: <https://www.security.com/threat-intelligence/ai-assisted-attack-us-retailer>

### ai-scripts: Long labelled scripts (ai)

On Sep 23 about 50 error-free PowerShell scripts run in about two hours, with section banners and comments Symantec reads as model reasoning. Pauses fit an operator pasting the next script.

Evidence: <https://www.security.com/threat-intelligence/ai-assisted-attack-us-retailer>

### orion-move: Orion cookie reaches a second server (impact)

About 10 minutes after the first Orion query, the operators read the RabbitMQ cookie and use the bundled erl.exe rpc:call path to run a command on a second server. Later activity dumps credential hives. No encryption was observed.

Evidence: <https://www.security.com/threat-intelligence/ai-assisted-attack-us-retailer>

### Connections

- sql-and-iis -> stalled
- stalled -> ai-scripts
- ai-scripts -> orion-move

## MITRE ATLAS
- [AML.T0016](https://atlas.mitre.org/techniques/AML.T0016) Obtain Capabilities — Symantec says the operators obtained working PowerShell, including the Orion cookie handoff, from an AI tool after hand-typed commands failed.
  Evidence: <https://www.security.com/threat-intelligence/ai-assisted-attack-us-retailer>
- [AML.T0050](https://atlas.mitre.org/techniques/AML.T0050) Command and Scripting Interpreter — The AI-assisted phase was long PowerShell submitted through the webshell and through SQL Server command execution.
  Evidence: <https://www.security.com/threat-intelligence/ai-assisted-attack-us-retailer>
- [AML.T0055](https://atlas.mitre.org/techniques/AML.T0055) Unsecured Credentials — The scripts collected connection strings, client settings, the Erlang cookie, and registry hives that hold credential material.
  Evidence: <https://www.security.com/threat-intelligence/ai-assisted-attack-us-retailer>

## Prevention
Alert when w3wp.exe or sqlservr.exe spawns cmd.exe or PowerShell, and when xp_cmdshell is used. Treat a same-directory unsigned DLL next to bdreinit.exe or ask.exe as sideloading. Alert on csc.exe compiling from ProgramData or a user-writable path, on Chisel client arguments, and on reg save of SAM, SYSTEM, or SECURITY. Hunt Orion's bundled erl.exe making rpc:call with a cookie, and ASP files dropped in the web application's image directory. A sudden change from short mistyped commands to long labelled scripts is an investigation lead, not a benign automation signature. Restrict xp_cmdshell, the Erlang distribution port, and the RabbitMQ cookie file.

## Detections
- [Suspicious Process By Web Server Process](https://github.com/SigmaHQ/sigma/blob/master/rules/windows/process_creation/proc_creation_win_webshell_susp_process_spawned_from_webserver.yml) (sigma) — Selected from a security-detections-mcp search for w3wp. Windows process creation. A web-server parent, including w3wp.exe, spawning a suspicious child. Matches commands Symantec saw under the IIS worker. It does not match sqlservr.exe as the parent.
- [Suspicious Child Process Of SQL Server](https://github.com/SigmaHQ/sigma/blob/master/rules/windows/process_creation/proc_creation_win_mssql_susp_child_process.yml) (sigma) — Selected from a security-detections-mcp search for sqlservr. Windows process creation. sqlservr.exe spawning cmd.exe, PowerShell, or another listed child. Matches the Sep 18 pattern Symantec reads as xp_cmdshell.
- [MSSQL XPCmdshell Suspicious Execution](https://github.com/SigmaHQ/sigma/blob/master/rules/windows/builtin/application/mssqlserver/win_mssql_xp_cmdshell_audit_log.yml) (sigma) — Selected from a security-detections-mcp search for xp_cmdshell. Windows application log. MSSQL audit event 33205 whose data contains object_name:xp_cmdshell and statement:EXEC. Requires the xp_cmdshell audit policy. The process-creation rule above still applies when that audit policy is off.
- [Windows Unsigned DLL Side-Loading In Same Process Path](https://github.com/splunk/security_content/blob/develop/detections/endpoint/windows_unsigned_dll_side_loading_in_same_process_path.yml) (splunk) — Selected from a security-detections-mcp search for DLL side-loading. Sysmon image load. An unsigned DLL loaded from the same directory as the process, outside Windows and Program Files. Fits bdreinit.exe with log.dll and ask.exe with ask.dll staged in the same folder. A signed decoy executable does not have to be on a named-binary list.
- [Privilege Escalation via Rogue Named Pipe Impersonation](https://github.com/elastic/detection-rules/blob/main/rules/windows/privilege_escalation_via_rogue_named_pipe.toml) (elastic) — Selected from a security-detections-mcp search for Potato. The rule cites https://github.com/zcgonvh/EfsPotato and alerts on Sysmon pipe-creation event 17 when the pipe path contains a nested Pipe segment. It does not match the string EfsPotato. The Splunk Potato-family rule's file-name list does not include EfsPotato, so that rule is not cited. A renamed compile can still miss a name-based hunt.
- [Dynamic .NET Compilation Via Csc.EXE](https://github.com/SigmaHQ/sigma/blob/master/rules/windows/process_creation/proc_creation_win_csc_susp_dynamic_compilation.yml) (sigma) — Selected from a security-detections-mcp search for csc.exe. Windows process creation. csc.exe whose command line points at ProgramData, Temp, or another listed user-writable location. Symantec compiled under ProgramData. The rule filters a w3wp.exe parent, so a compile whose parent is only the IIS worker does not match.
- [PUA - Chisel Tunneling Tool Execution](https://github.com/SigmaHQ/sigma/blob/master/rules/windows/process_creation/proc_creation_win_pua_chisel.yml) (sigma) — Selected from a security-detections-mcp search for chisel. Windows process creation. Image ending in chisel.exe, or command lines with client/server and reverse, socks, or r: arguments. Symantec's Chisel detection on Sep 25 was on a Windows host. The Linux Chisel rule is not cited.
- [Windows Registry Entries Exported Via Reg](https://github.com/splunk/security_content/blob/develop/detections/endpoint/windows_registry_entries_exported_via_reg.yml) (splunk) — Selected from a security-detections-mcp search under T1003.002. Endpoint process data. reg.exe with save or export. Symantec says the EfsPotato payload saved the SAM, SYSTEM, and SECURITY hives. This matches that copy when it is reg.exe. A custom writer that does not call reg.exe will not match.
- Erlang rpc:call and the Orion cookie (guidance) — security-detections-mcp search for erl.exe returned no rule. Nothing in the index alerts on Orion's bundled erl.exe, rpc:call, or a read of .erlang.cookie. Hunt process creation for erl.exe under the Orion Erlang path with -setcookie and rpc:call. ASP names filemanager.asp and qwdajhsd.asp, and BreakChainC.exe, are also absent from the index; the w3wp child-process rule covers shells spawned from the web worker, not the ASP file drop by itself.

## Timeline
- First seen: 2026-09-18
- Last updated: 2026-11-16
- 2026-09-18 (Symantec Threat Hunter Team): First activity on three SQL Server hosts. Labelled PowerShell searches point-of-sale sync folders, tests egress to 155.254.22\[.\]215:9458, and compiles EfsPotato on one host.
- 2026-09-21 (Symantec Threat Hunter Team): Commands start under w3wp.exe on the internet-facing web server, then pause for about 12 hours.
- 2026-09-22 (Symantec Threat Hunter Team): Hand-typed commands with typos. bdreinit.exe/log.dll from 204.194.49\[.\]129:8080 is killed on each retry. server.ps1 and two ASP webshells are staged.
- 2026-09-23 (Symantec Threat Hunter Team): About 50 long scripts in about two hours. Orion's Erlang cookie is used to run a command on a second server roughly 10 minutes after the first Orion query. BreakChainCs.exe follows.
- 2026-09-24 (Symantec Threat Hunter Team): Further SQL hosts save registry hives. Activity continues through at least Sep 29, including Chisel, NTDS.dit searches, and a password sprayer.
- 2026-11-16 (Symantec Threat Hunter Team): SECURITY.COM publishes the retailer write-up. AI assistance is high confidence; the operator-in-the-loop reading is moderate; the model is unidentified.

## Tools
### AI tooling and models
- Unidentified model. Symantec assesses AI-written [PowerShell](https://github.com/PowerShell/PowerShell) with an operator relaying output, not an autonomous agent.

### Other tooling
- EfsPotato (https://github.com/zcgonvh/EfsPotato), compiled on the server with csc.exe
- Chisel (https://github.com/jpillora/chisel)
- Yuze (https://github.com/P001water/yuze), seen in the overlapping August intrusion
- Bitdefender bdreinit.exe sideloading log.dll
- G DATA ask.exe sideloading ask.dll
- BreakChainC.exe and BreakChainCs.exe
- ASP webshells filemanager.asp and qwdajhsd.asp
- [PowerShell](https://github.com/PowerShell/PowerShell)

## Source notes
Dates, typos, script counts, the Orion cookie path, the decimal-encoded rpc:call, and the published hashes are from the Symantec article at https://www.security.com/threat-intelligence/ai-assisted-attack-us-retailer (canonical; the blog-post URL serves the same title). The article's createdDate is 2026-11-16. Symantec lists many additional file hashes; the set below is the named tooling from that table, not every unnamed suspicious file. Yuze's Warlock reporting is Symantec's summary of Trend Micro, and Symantec says it is not an attribution. Link the August staging overlap only as Symantec describes it.

## Sources
- [How AI revived a stalled attack on a U.S. retailer](https://www.security.com/threat-intelligence/ai-assisted-attack-us-retailer) — Symantec Threat Hunter Team
- [How AI revived a stalled attack on a U.S. retailer](https://www.security.com/blog-post/ai-assisted-attack-us-retailer) — SECURITY.COM
- [How AI revived a stalled attack on a U.S. retailer](https://www.broadcom.com/support/security-center/protection-bulletin/how-ai-revived-a-stalled-attack-on-a-u-s-retailer) — Broadcom
- [EfsPotato](https://github.com/zcgonvh/EfsPotato) — zcgonvh
- [Chisel](https://github.com/jpillora/chisel) — jpillora
- [Yuze](https://github.com/P001water/yuze) — P001water
