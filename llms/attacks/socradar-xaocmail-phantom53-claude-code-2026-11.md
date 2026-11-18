# SOCRadar XaocMail ClickFix delivers Phantom53 and HavoX, built with Claude Code

- ID: socradar-xaocmail-phantom53-claude-code-2026-11
- Reported: 2026-11-13
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/socradar-xaocmail-phantom53-claude-code-2026-11/

## Summary
SOCRadar Threat Research Unit (published Nov 13, 2026) describes a Russian-speaking operator chaining XaocMail, Phantom53, and HavoX (Havoc Demon). Preparation began in October 2025. Phishing tests and framework development continued in early 2026. The operation launched in August 2026 and was still active at publication. XaocMail, on 185.224.132.148:8585, builds per-victim document-sharing lures (Google Docs, Adobe Acrobat, Office365, SecuredDocs) and stores landing JSON in Cloudflare KV. Emails point at hxxps://securedoc.[subdomain].workers.dev/?id={linkId}. The ClickFix page offers three Win+R paths: a PowerShell DownloadString cradle, mshta against /h?id=X (an earlier ZIP of GUP.exe sideloading libcurl.dll), and msiexec /i .../m?id=X /qn, which SOCRadar calls the active path. The MSI impersonates names such as Visual Studio Tools, Python, or Node.js and drops Python 3.11 under a random directory in AppData or LocalAppData. A pythonw scheduled task runs the beacon every 12 minutes. A second task runs the watcher every 3 minutes. The beacon is a .pyd named like a real package (cv2.pyd, with PyInit_cv2, and the same pattern for numpy, PIL, and lxml). It beacons over DNS-over-HTTPS to Cloudflare, Google, and ControlD, encoding commands in AAAA records, with UDP/53 as a fallback, and a week-keyed SHA256 DGA on .xyz. CMD_WAKE writes an IPC file so the watcher reflectively loads an AES-GCM HavoX blob in memory. If the MSI is not elevated it can show a UAC prompt for a product-named task, and a separate payload uses fodhelper.exe registry hijacking. Payload aliases include a Level RMM drop from downloads.level.io and an AI-secret stealer covering Claude Code, Codex, Gemini CLI, Cursor, Windsurf, and other AI tools, plus password-manager, browser, SSH, git, wallet, and messaging collection. SOCRadar's AI evidence is on the operator side: .claude/settings.json, 143 numbered NNN-task-name.md files across adminka (25), implant_v3 (31), and implant_v4 (87), a 117 KB implant_v4/arch.md, and implant_v4/.tasks/prompts/noav-beacon-test.md, a Russian prompt for a claudeg5f-tmux Claude wrapper that tells the agent to install a test MSI on a VM named NoAV under an authorized red-team framing. HavoX's login panel and an exfiltration path are on 145.63.138.67. Almost a thousand personalized pages were identified. Named target countries are Brazil, Peru, India, Indonesia, and Spain, across technology, finance, education, government, logistics, and manufacturing. SOCRadar did not confirm attacker intent beyond the footholds.

## Category
adversary-use-of-ai

## Attribution
Unnamed Russian-speaking operator. SOCRadar does not name a country or a tracked cluster.

- Actor: Unnamed Russian-speaking operator
- Motivation: cybercrime
- Attributed by: SOCRadar Threat Research Unit
- Confidence: low

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Spearphishing links from XaocMail to Cloudflare Worker ClickFix pages that ask the user to run msiexec, mshta, or a PowerShell cradle
- Victims and sectors: Technology, finance, education, government, logistics, and manufacturing. Almost a thousand personalized lure pages. No organization names are listed here.
- Regions: Brazil, Peru, India, Indonesia, Spain
- Region notes: Brazil, Peru, India, Indonesia, and Spain are the countries SOCRadar names. The article also describes the set as Latin America, Asia, and Europe. Operator language is not a victim region.
- Scale and metrics: Almost a thousand personalized XaocMail pages. 143 Claude Code task files. implant_v4/arch.md is 117 KB. No victim-host count was published.

## Attack flow
### phish: XaocMail sends the lure (access)

A self-hosted panel writes a per-victim landing page to Cloudflare KV and emails a workers.dev link.

Evidence: <https://socradar.io/blog/xaocmail-clickfix-phantom53-havox-america-asia-europe/>

### clickfix: ClickFix runs the MSI (execution)

The page asks the user to run msiexec /i against /m?id=, or an older mshta or PowerShell path.

Evidence: <https://socradar.io/blog/xaocmail-clickfix-phantom53-havox-america-asia-europe/>

### beacon: pythonw beacon over DoH (execution)

Python 3.11 in AppData runs cv2.pyd every 12 minutes and a watcher every 3 minutes. Commands return inside DNS AAAA answers.

Evidence: <https://socradar.io/blog/xaocmail-clickfix-phantom53-havox-america-asia-europe/>

### claude: Claude Code built the implant (ai)

The operator tree has .claude/settings.json, 143 numbered task files, a 117 KB arch.md, and a Russian authorized-red-team test prompt.

Evidence: <https://socradar.io/blog/xaocmail-clickfix-phantom53-havox-america-asia-europe/>

### havoc: HavoX in memory and AI-secret theft (impact)

CMD_WAKE loads the Havoc Demon reflectively. Aliases include Level RMM and a stealer for Claude Code, Codex, Gemini CLI, Cursor, and Windsurf.

Evidence: <https://socradar.io/blog/xaocmail-clickfix-phantom53-havox-america-asia-europe/>

### Connections

- phish -> clickfix
- clickfix -> beacon
- beacon -> havoc
- claude -> beacon

## MITRE ATLAS
- [AML.T0016.002](https://atlas.mitre.org/techniques/AML.T0016.002) Generative AI — Claude Code task files, settings, and a Russian test prompt show the operator used a Claude agent to build and test the implant
  Evidence: <https://socradar.io/blog/xaocmail-clickfix-phantom53-havox-america-asia-europe/>
- [AML.T0054](https://atlas.mitre.org/techniques/AML.T0054) LLM Jailbreak — The NoAV prompt frames the job as authorized red-team work so the agent stays on task
  Evidence: <https://socradar.io/blog/xaocmail-clickfix-phantom53-havox-america-asia-europe/>
- [AML.T0055](https://atlas.mitre.org/techniques/AML.T0055) Unsecured Credentials — A payload alias steals secrets from Claude Code, Codex, Gemini CLI, Cursor, Windsurf, and other AI tools
  Evidence: <https://socradar.io/blog/xaocmail-clickfix-phantom53-havox-america-asia-europe/>
- [AML.T0052](https://atlas.mitre.org/techniques/AML.T0052) Phishing — XaocMail sends document-sharing phishing links to Cloudflare Worker ClickFix pages
  Evidence: <https://socradar.io/blog/xaocmail-clickfix-phantom53-havox-america-asia-europe/>

## Prevention
Block ClickFix paste-and-run. Alert when explorer.exe starts msiexec.exe with a workers.dev URL, when mshta.exe fetches an HTTP URL, and when pythonw.exe runs a .pyw from AppData and loads a .pyd outside a normal Python install. Hunt scheduled tasks named like MicrosoftEdgeUpdateTask, OneDriveSyncTask, WindowsDefenderScheduledScan, OfficeBackgroundTaskHandler, or AdobeAcrobatUpdateTask with a short random suffix. Treat DoH from pythonw.exe to 1.1.1.1, 8.8.8.8, or 76.76.2.11 as suspicious when paired with those tasks.

## Detections
- [Suspicious Msiexec Quiet Install From Remote Location](https://github.com/SigmaHQ/sigma/blob/master/rules/windows/process_creation/proc_creation_win_msiexec_install_remote.yml) (sigma) — Windows process creation. msiexec /i against a remote URL with a quiet flag. Matches the active ClickFix path msiexec /i .../m?id= /qn.
- [Windows MSIExec Remote Download](https://github.com/splunk/security_content/blob/develop/detections/endpoint/windows_msiexec_remote_download.yml) (splunk) — Windows endpoint. msiexec retrieving a remote package. Same active delivery path.
- [Remotely Hosted HTA File Executed Via Mshta.EXE](https://github.com/SigmaHQ/sigma/blob/master/rules/windows/process_creation/proc_creation_win_mshta_http.yml) (sigma) — Windows process creation. mshta.exe with an http URL. Matches the earlier /h?id= path that fetched GUP.exe and libcurl.dll.
- [Potential DLL Sideloading Of Libcurl.DLL Via GUP.EXE](https://github.com/SigmaHQ/sigma/blob/master/rules/windows/image_load/image_load_side_load_gup_libcurl.yml) (sigma) — Windows image load. GUP.exe loading libcurl.dll. SOCRadar assigns this to the previous HTA ZIP, not the current MSI.
- [Suspicious Execution of Powershell with Base64](https://github.com/SigmaHQ/sigma/blob/master/rules/windows/process_creation/proc_creation_win_powershell_encode.yml) (sigma) — Windows process creation. Encoded PowerShell. Phantom53 CMD_EXEC runs powershell -EncodedCommand.
- [Bypass UAC via Fodhelper.exe](https://github.com/SigmaHQ/sigma/blob/master/rules/windows/process_creation/proc_creation_win_uac_bypass_fodhelper.yml) (sigma) — Windows process creation. fodhelper.exe UAC bypass, which SOCRadar lists as a payload alias.
- [Local Scheduled Task Creation](https://github.com/elastic/detection-rules/blob/main/rules/windows/persistence_local_scheduled_task_creation.toml) (elastic) — Windows. New scheduled task. The MSI registers beacon and watcher tasks. Elevated installs use COM ITaskFolder::RegisterTask and do not spawn schtasks.exe.
- [Windows Scheduled Task Created Via XML](https://github.com/splunk/security_content/blob/develop/detections/endpoint/windows_scheduled_task_created_via_xml.yml) (splunk) — Windows. Task registration from XML. SOCRadar says the non-elevated path writes p53_task_a.xml and p53_task_b.xml.
- pythonw, DoH, and Level RMM (guidance) — No cited rule names pythonw.exe loading cv2.pyd from AppData, DoH POST to 1.1.1.1, 8.8.8.8, or 76.76.2.11, or the Level RMM MSI. The schtasks.exe creation rule is not cited because the elevated path does not spawn schtasks.exe. Also hunt 145.63.138.67 and 185.224.132.148.

## Timeline
- First seen: 2025-10
- Last updated: 2026-11-13
- 2025-10 (SOCRadar): Operators test malware and Cloudflare infrastructure. Development continues through early 2026.
- 2026-08 (SOCRadar): XaocMail phishing launches. The operation is still active at publication.
- 2026-11-13 (SOCRadar): STRU publishes the XaocMail, Phantom53, and HavoX chain, including the Claude Code task files and 145.63.138.67

## Tools
### AI tooling and models
- [Claude Code](https://github.com/anthropics/claude-code) (.claude/settings.json, numbered task files, claudeg5f-tmux prompt wrapper)
- AI-secret stealer aimed at [Claude Code](https://github.com/anthropics/claude-code), Codex, [Gemini CLI](https://github.com/google-gemini/gemini-cli), [Cursor](https://cursor.com/), and Windsurf

### Other tooling
- XaocMail phishing panel
- Phantom53 DoH beacon and watcher (.pyd under pythonw.exe)
- HavoX / Havoc Demon, reflective load
- Cloudflare Workers and KV
- msiexec, mshta, [PowerShell](https://github.com/PowerShell/PowerShell) (LOLBAS)
- GUP.exe sideloading libcurl.dll (HijackLibs), earlier path
- fodhelper.exe UAC bypass (LOLBAS)
- Level RMM (LOLRMM)

### MagicSword projects
- [LOLBAS](https://lolbas-project.github.io)
- [HijackLibs](https://hijacklibs.net)
- [LOLRMM](https://lolrmm.io)

## Source notes
Chain, timings, Claude Code artifacts, and IOCs are from the SOCRadar article. Operator mailbox addresses in that IOC table are omitted. Victim names and stolen-file contents are not included. The article lists additional MSI and payload hashes beyond the set below. Havoc is the public framework; HavoX is SOCRadar's name for this operator's Demon build.

## Sources
- [XaocMail ClickFix Campaign Drops Phantom53 and HavoX Across Latin America, Asia, and Europe](https://socradar.io/blog/xaocmail-clickfix-phantom53-havox-america-asia-europe/) — SOCRadar
