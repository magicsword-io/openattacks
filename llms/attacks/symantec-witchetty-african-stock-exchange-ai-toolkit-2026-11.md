# Symantec - Likely AI-written PowerShell toolkit hunts credentials at an African stock exchange (Witchetty implants on the same server)

- ID: symantec-witchetty-african-stock-exchange-ai-toolkit-2026-11
- Reported: 2026-11-19
- AI role: llm_generated_malware
- Entry: https://openattacks.ai/attacks/symantec-witchetty-african-stock-exchange-ai-toolkit-2026-11/

## Summary
Thibaut Passilly and Brigid O Gorman (Symantec Threat Hunter Team, Broadcom; SECURITY.COM, created 19 November 2026) describe a likely AI-written or AI-assisted PowerShell toolkit on a stock exchange in an unnamed African country. Forty-one modules ran under a webshell in the IIS worker process for 3 minutes 12 seconds on 20 September 2026, from 08:44 to 08:47 UTC, a new module every few seconds. Host and process modules (spid1, proc2, proc3, smbctx1, smbsc1) enumerated the machine, user, drives, SMB connections, and process trees via WMI. awslocal1 hunted AWS CLI config, environment variables, and Docker, Kubernetes, Terraform, Jenkins, and GitLab processes. iis1, iisa1, and iisp2 profiled IIS through the WebAdministration module. Secret scraping (cfg1, sites1, xpjs1, dep1, sysm1, sysh1, sysv2, gpp1, awsa1) searched web roots, C:\Deployer, and SYSVOL for web.config, .xml, .json, and .env files, Group Policy cpassword values, AWS keys, and database connection strings. rdsnet1 opened TCP 5432 to an AWS RDS PostgreSQL instance. scq1 queried Microsoft SQL Server with integrated authentication. SharePoint and TFS modules (spf1, spl1, spd1, spd2, sps1, tfs1, tfs2) searched sites for the keywords aws, credential, and password and queried TFS project APIs. API modules (api1, api2, map1, dbg1, adm1, admt1, adm2, keys1, key4, xtok1, cscs1, ipo1) probed internal debug endpoints, attempted an admin login with hardcoded credentials to obtain JWTs, and queried profile and banking data. cas1 and wmi1 queried the SCCM AdminService and WMI class SMS_R_System for LastLogonUserName. Harvested x-api-key values and a bearer token were cycled against the exchange investment API and a securities depository gateway. Those requests connected by IP, set the Host header manually, disabled certificate validation, and sent a blank key as a control. cscs1 and ipo1 queried capital-markets endpoints, including one specific investor number that Symantec does not publish. Authorship signals, which Symantec says are not conclusive one by one, are an identical opening line setting ErrorActionPreference to SilentlyContinue, the same outer try/catch, the same hex encoding, the empty-output sentinel 454d505459 (the hex of EMPTY), a DNS exfiltration loop copied into all 41 modules, generic variable names, one module with a unique progress variable, and one deliberate invalid-credential test. Each module split hex output into 50-character chunks and resolved them with [Net.Dns]::GetHostAddresses as a name under the token danoam334iqjo0ap2scg6ofosjxfgqhsa.oast.pro. Symantec calls oast.pro a public out-of-band testing service. The collector was not visible. Symantec does not say whether any credential or key worked. Six persistence implants on the server are attributed to Witchetty (LookingFrog) with high confidence. ESET's April 2022 TA410 profile names LookingFrog as one of three TA410 sub-groups and does not use the name Witchetty. Symantec says one implant was first seen in 2020, that the implants were present on this server in April 2026, and that Symantec's September 2022 reporting had already described Witchetty hitting this same exchange with ProxyShell and ProxyLogon webshells. The toolkit itself is not attributed. Symantec leaves open Witchetty with new tooling, a second operator using the access, or an unrelated actor. No privilege escalation or data theft was seen. The earliest malicious activity Symantec dates on the server is April 2026, and Symantec says the attackers may have been present longer.

## Category
adversary-use-of-ai

## Attribution
Toolkit unattributed. Six persistence implants on the same server are Witchetty (LookingFrog, a TA410 sub-group in ESET's 2022 profile) with high confidence from Symantec. Symantec does not attribute the PowerShell toolkit to Witchetty.

- Actor: Unnamed toolkit. Witchetty implants are separate.
- Country: Unknown
- Motivation: unknown
- Attributed by: Symantec Threat Hunter Team (Broadcom)
- Confidence: low

## AI involvement confidence
vendor-asserted

## Scope and targeting
- Initial access: Unknown for the 2026 activity. The 41 modules ran under a webshell in the IIS worker process, which Symantec says suggests a vulnerability may have been exploited. Symantec does not name that vulnerability. The 2022 Witchetty access to this exchange used ProxyShell and ProxyLogon. This report does not say those bugs were used again in 2026.
- Victims and sectors: One stock exchange in an unnamed African country. The toolkit ran on an IIS server and queried the exchange investment API, a securities depository gateway, SharePoint, TFS, SCCM, Microsoft SQL Server, and an AWS RDS PostgreSQL endpoint. Symantec does not name the exchange.
- Regions: Africa
- Region notes: Symantec says the victim is a stock exchange in an African country and does not name the country. China, in the Witchetty attribution, is not a victim region. The 2022 activity against two Middle East governments is a different incident and is not given countries in this write-up.
- Scale and metrics: 41 modules in 3 minutes 12 seconds on 20 September 2026, 08:44-08:47 UTC. Earliest malicious activity Symantec dates on the server is April 2026. Six persistence implants, one first seen in 2020. No privilege escalation or data theft observed. Whether any tested credential or key worked is unknown.

## Attack flow
### server: IIS server, access vector unknown (access)

The modules ran under a webshell in the IIS worker. Symantec dates the earliest malicious activity on the server to April 2026 and does not name the 2026 entry vector.

Evidence: <https://www.security.com/threat-intelligence/african-stock-exchange-ai-assisted-attack>

### implants: Witchetty implants on the server (execution)

Six persistence implants on the server are attributed to Witchetty with high confidence. One was first seen in 2020. Symantec does not attribute the PowerShell toolkit to that group.

Evidence: <https://www.security.com/threat-intelligence/african-stock-exchange-ai-assisted-attack>

### modules: 41 PowerShell modules (ai)

On 20 September 2026, 08:44-08:47 UTC, 41 modules ran in 3 minutes 12 seconds. Symantec reads the shared scaffold as AI-written or AI-assisted and does not identify the model.

Evidence: <https://www.security.com/threat-intelligence/african-stock-exchange-ai-assisted-attack>

### hunt: Credential and API tests (execution)

Modules searched web roots, C:\Deployer, and SYSVOL, queried cloud, database, SharePoint, TFS, and SCCM surfaces, and tested keys against the investment API and a securities depository gateway.

Evidence: <https://www.security.com/threat-intelligence/african-stock-exchange-ai-assisted-attack>

### exfil: DNS output to oast.pro (impact)

Hex output left as DNS lookups under one oast.pro token. Symantec did not see the collector, privilege escalation, or data theft, and does not know whether any key worked.

Evidence: <https://www.security.com/threat-intelligence/african-stock-exchange-ai-assisted-attack>

### Connections

- server -> implants
- server -> modules
- modules -> hunt
- hunt -> exfil

## MITRE ATLAS
- [AML.T0102](https://atlas.mitre.org/techniques/AML.T0102) Generate Malicious Commands — Symantec assesses the 41 PowerShell modules as AI-written or AI-assisted commands, with a shared scaffold copied into every module.
  Evidence: <https://www.security.com/threat-intelligence/african-stock-exchange-ai-assisted-attack>
- [AML.T0017](https://atlas.mitre.org/techniques/AML.T0017) Develop Capabilities — The toolkit is purpose-built offensive tooling. Symantec's evidence for development is the uniform module scaffold and the unidentified model, not a recovered training pipeline.
  Evidence: <https://www.security.com/threat-intelligence/african-stock-exchange-ai-assisted-attack>
- [AML.T0050](https://atlas.mitre.org/techniques/AML.T0050) Command and Scripting Interpreter — All 41 modules were PowerShell, started under the IIS worker through a webshell.
  Evidence: <https://www.security.com/threat-intelligence/african-stock-exchange-ai-assisted-attack>

## Prevention
Alert when the IIS worker spawns PowerShell. Hunt DNS queries for oast.pro and for the published token. Hunt PowerShell that calls [Net.Dns]::GetHostAddresses in a loop, and searches of SYSVOL or web roots for cpassword, web.config, and cloud keys, from the IIS worker. The published file hashes are for the Witchetty implants and related files, not for the 41 modules, which Symantec does not hash. HijackLibs documents the Avast wsc.dll / wsc_proxy.exe pair and the McAfee LockDown.dll / mfeann.exe pair. A Witchetty implant on the host does not by itself identify the author of the PowerShell modules.

## Detections
- [Suspicious Process By Web Server Process](https://github.com/SigmaHQ/sigma/blob/master/rules/windows/process_creation/proc_creation_win_webshell_susp_process_spawned_from_webserver.yml) (sigma) — Windows process creation. A web-server parent, including w3wp.exe, spawning PowerShell or another listed child. Matches the 41 modules running under the IIS worker. It does not identify the module contents or the AI-authorship scaffold.
- [DNS Query to External Service Interaction Domains](https://github.com/SigmaHQ/sigma/blob/master/rules/network/dns/net_dns_external_service_interaction_domains.yml) (sigma) — DNS queries whose name ends in a listed out-of-band domain, including .oast.pro, which the rule labels as ProjectDiscovery interactsh. Symantec's modules resolved names under danoam334iqjo0ap2scg6ofosjxfgqhsa.oast.pro. The rule needs DNS query logs. It does not require the PowerShell \[Net.Dns\]::GetHostAddresses call, and a lookup that never reaches a resolver will not match.
- [Findstr GPP Passwords](https://github.com/SigmaHQ/sigma/blob/master/rules/windows/process_creation/proc_creation_win_findstr_gpp_passwords.yml) (sigma) — Windows process creation for find.exe or findstr.exe with cpassword, \sysvol\, and .xml on the command line. Symantec's gpp1 module searched SYSVOL for cpassword, but it was PowerShell, not findstr.exe. A PowerShell-only search does not match this rule. No reviewed rule names the 50-character \[Net.Dns\]::GetHostAddresses loop.

## Timeline
- First seen: 2026-04
- Last updated: 2026-11-21
- 2020 (Symantec Threat Hunter Team): Symantec says one Witchetty implant later found on this server was first seen in 2020. The report does not say that sighting was on this exchange.
- 2026-04 (Symantec Threat Hunter Team): Earliest malicious activity Symantec dates on the server. Six Witchetty persistence implants were present. The attackers may have been present longer.
- 2026-09-20 (Symantec Threat Hunter Team): 41 PowerShell modules run under the IIS webshell from 08:44 to 08:47 UTC and send hex output to an oast.pro token. No privilege escalation or data theft is observed.
- 2026-11-19 (Symantec Threat Hunter Team): SECURITY.COM publishes the write-up. AI authorship is a combined assessment, the model is unidentified, and the toolkit is not attributed to Witchetty.

## Tools
### AI tooling and models
- Unidentified model. Symantec assesses the 41 [PowerShell](https://github.com/PowerShell/PowerShell) modules as AI-written or AI-assisted.

### Other tooling
- [PowerShell](https://github.com/PowerShell/PowerShell) under an IIS webshell
- Witchetty persistence implants on the same server, not attributed to the toolkit: Avast wsc_proxy hijack, ShellcodeLoader, svchost XOR loader for WindowsUpdate.xml, VSPerfCmd loader, Nim DLL impersonating VSPMsg.dll, mfeann.exe, setting.dat XOR loaders, [Cobalt Strike](https://www.cobaltstrike.com/) beacons, Mimikatz

### MagicSword projects
- [HijackLibs](https://hijacklibs.net)

## Source notes
Module names, the 20 September 2026 window, authorship signals, the oast.pro token, the Witchetty split, and the file hashes are from the Symantec article at https://www.security.com/threat-intelligence/african-stock-exchange-ai-assisted-attack. The page's created timestamp is 19 November 2026 11:00 UTC. The blog-post URL serves the same article. Authors are printed as Thibaut Passilly and Brigid O Gorman. Symantec calls oast.pro a public out-of-band testing service and does not name ProjectDiscovery or interactsh in the article text reviewed here. The Sigma DNS rule cited below lists .oast.pro among ProjectDiscovery interactsh domains. ESET's 2022 post names LookingFrog as a TA410 sub-group and does not use the name Witchetty. HijackLibs lists Avast wsc.dll loaded by wsc_proxy.exe and McAfee LockDown.dll loaded by mfeann.exe. No HijackLibs page for VSPerfCmd.exe or VSPMsg.dll was found, and a guessed path for that pair returned HTTP 404, so that pair is not linked. PowerShell is not a LOLBAS entry. The hash list below is the named artifacts from Symantec's table that this entry describes, not every hash on the page. Hashes marked not available for analysis, and unnamed similar svchost loaders, are omitted. The domain is defanged. No victim IP addresses were published.

## Sources
- [Major African Stock Exchange Targeted in AI-Assisted Attack](https://www.security.com/threat-intelligence/african-stock-exchange-ai-assisted-attack) — Symantec Threat Hunter Team
- [Major African Stock Exchange Targeted in AI-Assisted Attack](https://www.security.com/blog-post/african-stock-exchange-ai-assisted-attack) — SECURITY.COM
- [African stock exchange credential theft](https://gbhackers.com/african-stock-exchange-credential-theft/) — GBHackers
- [Hackers Use AI-Assisted PowerShell Toolkit With 41 Modules to Target African Stock Exchange](https://cybersecuritynews.com/ai-assisted-powershell/) — Cyber Security News
- [A lookback under the TA410 umbrella, Its cyberespionage TTPs and activity](https://www.welivesecurity.com/2022/04/27/lookback-ta410-umbrella-cyberespionage-ttps-activity/) — ESET
- [Avast wsc.dll](https://hijacklibs.net/entries/3rd_party/avast/wsc.html) — HijackLibs
- [McAfee LockDown.dll](https://hijacklibs.net/entries/3rd_party/mcafee/lockdown.html) — HijackLibs
