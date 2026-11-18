# CloudSEK: Silent Lynx operator ran a Hermes agent named Strix

- ID: cloudsek-silent-lynx-hermes-strix-2026-11
- Reported: 2026-11-11
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/cloudsek-silent-lynx-hermes-strix-2026-11/

## Summary
CloudSEK TRIAD (11 November 2026) found a Debian VPS at 89.125.213[.]123, on Baxet Group, serving files on port 8088 without authentication. The directory held tooling, victim data, and a .hermes/ tree with agent state, memory, persona, scripts, and logs from April through October 2026. CloudSEK assesses with high confidence that the server belongs to a Silent Lynx operator, from implant code markers and build paths that match published Laplas and Chvost samples, and with medium confidence a Kazakhstan nexus: Russian-language operation, the operator's test traffic from a residential Kazakhtelecom line, and working hours on UTC+5. That matches earlier Cisco Talos (UAT-6275) and Recorded Future (TAG-193) assessments. CloudSEK says the collection priorities are regional intelligence gathering, not a financial motive. The Record (Daryna Antoniuk, 12 November 2026) covers the same report and says the findings do not establish a connection to the Kazakh government. The operator ran much of the work through Hermes, an open-source agent framework, branded Strix. CloudSEK does not publish a repository URL. The public project that matches the described Telegram gateway, cron, delegation, and OpenRouter routing is https://github.com/NousResearch/hermes-agent. The primary model was DeepSeek V4.1 Flash via OpenRouter, with Gemini 2.5 Flash for sub-agents. Heredoc shell execution and SQL DROP were allowlisted without confirmation, the tool-loop hard stop was off, and unsafe browser JavaScript evaluation was on. Toolsets were terminal, computer use, browser, cron, delegation, a task board, and Telegram. The persona told the agent to drop safety disclaimers and favour low-noise techniques. The operator tasked it in Russian. The Telegram gateway let the operator send tasks from a phone. CloudSEK says the gateway logs tie inbound commands to one Telegram user, display name Марат, and quotes a 2 October test-shell announcement. The agent analysed recon output, continued collection from a handoff file that described the railway electronic-document login chain, and wrote a report on access to the railway's upstream ISP. In early October it shredded shell histories, vacuumed databases, cleared cron rows, and zeroed login records. Its memory told it to pull a secret and use it inside a single shell command so Hermes token redaction would not apply. Intrusions CloudSEK describes: domain-level access to Tajikistan's national railway from mid-August to at least 10 October 2026, with a Ligolo tunnel and more than 2,000 government documents including defence correspondence, reached through one railway employee's government SSO account; webshell and database access to Uzbekistan's Smart Forestry GeoServer, including PostgreSQL COPY FROM PROGRAM and cron callbacks; Kyrgyzstan implant builds on the server; and Turkmenistan Railways and Ahal administration lures built and tested in October, which CloudSEK treats as an upcoming campaign rather than a confirmed intrusion. The agent's memory also records Armenian government networks filtering the operator and an October 2026 engagement against Pakistan's Ministry of Foreign Affairs and its national telecom provider. Delivery was LNK and archive lures that launch PowerShell, fetch P.ps1 from hxxp://89.125.213[.]123:8080/P.ps1, and open a raw TCP shell. The final shortcut variant uses IEX (DownloadString). An AMSI-bypass variant sets amsiInitFailed before the download. Implants are Laplas (srvdriv.exe) and Chvost (ssdpdrv.exe), plus service wrappers. Tools on the server include fscan (https://github.com/shadow1ng/fscan), Ligolo-ng (https://github.com/nicocha30/ligolo-ng), GOST (https://github.com/go-gost/gost), Inveigh (https://github.com/Kevin-Robertson/Inveigh), Responder (https://github.com/lgandx/Responder), NetExec (https://github.com/Pennyw0rth/NetExec), and Impacket (https://github.com/fortra/impacket). Infrastructure includes foreverpeace[.]ru for a NetBird control plane and a Pangolin proxy, and 134.17.14[.]24 as a cron callback whose ownership CloudSEK does not confirm. The operator test host in the logs is DESKTOP-S3MHLFV\nemo. CloudSEK says the same harness and model family appeared in its earlier Gentlemen affiliate investigation and that those two operators are unrelated.

## Category
adversary-use-of-ai

## Attribution
Silent Lynx. CloudSEK cites the vendor names UAT-6275 (Cisco Talos) and TAG-193 (Recorded Future). High confidence the server is a Silent Lynx operator. Medium confidence on the Kazakhstan nexus. The Record also uses the names Cavalry Werewolf and YoroTrooper; CloudSEK's background table describes overlaps with those names, not identity.

- Actor: Silent Lynx
- Aliases: UAT-6275, TAG-193
- Country: Kazakhstan
- Motivation: unknown
- Attributed by: CloudSEK TRIAD
- Confidence: high

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: LNK, ZIP, password-protected archive, or ISO lures launch hidden PowerShell, which downloads P.ps1 and opens a raw TCP shell. Separate intrusions used a railway employee SSO account and a GeoServer webshell.
- Victims and sectors: Tajikistan national railway and the national electronic document platform, including defence correspondence. Uzbekistan Smart Forestry geospatial platform. Turkmenistan Railways and Ahal administration lures were built and tested. Kyrgyzstan implant builds were on the server. Government and transport.
- Regions: Tajikistan, Uzbekistan, Turkmenistan, Kyrgyzstan
- Region notes: Tajikistan and Uzbekistan are intrusions CloudSEK describes from the server. Turkmenistan is lures tested in October, not a confirmed compromise. Kyrgyzstan is a per-target implant build on the server. Armenia and Pakistan appear as further targets in the agent memory, not as confirmed intrusions, and are not listed here. Kazakhstan is the assessed operator nexus, not a victim region.
- Scale and metrics: Directory contents span April to October 2026. Railway domain access from mid-August to at least 10 October 2026. More than 2,000 government documents described. More than a dozen gigabytes on the open directory. No victim-organization count beyond the named networks.

## Attack flow
### lure: LNK and archive lures (access)

A PDF-themed shortcut in a ZIP, password-protected archive, or ISO opens a decoy and starts hidden PowerShell. One variant bypasses AMSI first.

Evidence: <https://www.cloudsek.com/blog/off-the-rails-inside-an-exposed-silent-lynx-server>

### powershell: P.ps1 opens a TCP shell (execution)

PowerShell downloads P.ps1 from the operator server and runs commands with Invoke-Expression. Laplas and Chvost implants call back over TLS.

Evidence: <https://www.cloudsek.com/blog/off-the-rails-inside-an-exposed-silent-lynx-server>

### strix: Hermes agent Strix (ai)

On the operator server, Strix uses DeepSeek V4.1 Flash and Gemini 2.5 Flash. The operator tasks it in Russian over the Telegram gateway. Destructive commands are pre-approved.

Evidence: <https://www.cloudsek.com/blog/off-the-rails-inside-an-exposed-silent-lynx-server>

### collect: Railway, forestry, and cleanup (impact)

Domain access on the Tajik railway, document collection, and a Smart Forestry webshell. In early October the agent shreds histories and clears logs. The exposed directory remained.

Evidence: <https://www.cloudsek.com/blog/off-the-rails-inside-an-exposed-silent-lynx-server>

### Connections

- lure -> powershell
- powershell -> strix
- strix -> collect

## MITRE ATLAS
- [AML.T0053](https://atlas.mitre.org/techniques/AML.T0053) AI Agent Tool Invocation — The operator tasked the Hermes agent, including from Telegram, to analyse recon, continue document collection, and write an access report.
  Evidence: <https://www.cloudsek.com/blog/off-the-rails-inside-an-exposed-silent-lynx-server>
- [AML.T0102](https://atlas.mitre.org/techniques/AML.T0102) Generate Malicious Commands — Heredoc shell execution and SQL DROP were allowlisted to run without confirmation, and the agent was told to keep secrets inside one shell command.
  Evidence: <https://www.cloudsek.com/blog/off-the-rails-inside-an-exposed-silent-lynx-server>
- [AML.T0101](https://atlas.mitre.org/techniques/AML.T0101) Data Destruction via AI Agent Tool Invocation — In early October the agent shredded shell histories, vacuumed databases, cleared cron rows, and zeroed login records.
  Evidence: <https://www.cloudsek.com/blog/off-the-rails-inside-an-exposed-silent-lynx-server>
- [AML.T0016.002](https://atlas.mitre.org/techniques/AML.T0016.002) Generative AI — The primary model was DeepSeek V4.1 Flash and the sub-agent model was Gemini 2.5 Flash, both via OpenRouter.
  Evidence: <https://www.cloudsek.com/blog/off-the-rails-inside-an-exposed-silent-lynx-server>
- [AML.T0052](https://atlas.mitre.org/techniques/AML.T0052) Phishing — LNK and archive lures, including a Turkmenistan Railways decoy and an Ahal administration executable, lead to the PowerShell stage.
  Evidence: <https://www.cloudsek.com/blog/off-the-rails-inside-an-exposed-silent-lynx-server>

## Prevention
Treat shortcut files and ISO or ZIP lures that launch hidden PowerShell and download a script as initial access. Alert on IEX with DownloadString, on new Ligolo tunnels, and on PostgreSQL COPY FROM PROGRAM. The published hashes, 89.125.213[.]123, foreverpeace[.]ru, and the P.ps1 and decoy.pdf URLs are hunt indicators. An autonomous agent with heredoc and SQL DROP pre-approved, plus a Telegram gateway on an operator server, is not visible in the victim's model logs. Review government SSO accounts that can read documents outside their agency.

## Detections
- [PowerShell Download and Execution Cradles](https://github.com/SigmaHQ/sigma/blob/master/rules/windows/process_creation/proc_creation_win_powershell_download_iex.yml) (sigma) — Windows process creation. Command lines that both download and invoke expression, including IEX and DownloadString. CloudSEK says the final shortcut runs hidden PowerShell with IEX (DownloadString) of P.ps1. A renamed download cmdlet, or a command line that never hits the process-creation log, will not match.
- Implants, the tunnel, and the operator-side agent (guidance) — Also hunt the published SHA-256 values, connections to 89.125.213\[.\]123 including port 8080 for P.ps1 and decoy.pdf and the TCP shell, and foreverpeace\[.\]ru. Strix ran on the operator server. Victim logs do not show the DeepSeek or Gemini calls. No public rule cited here names Laplas, Chvost, or srvdriv.exe.

## Timeline
- First seen: 2026-04
- Last updated: 2026-11-12
- 2026-04 (CloudSEK): Earliest material on the exposed server, including an earlier Ligolo tunnel and Laplas builds. The directory record runs through October.
- 2026-08 (CloudSEK): Domain-level access to the Tajik railway from mid-August. The operator's Telegram session with the agent also dates to mid-August.
- 2026-10-02 (CloudSEK): Operator test shell announced to the agent. Kazakhtelecom and Proton VPN logins the same afternoon. Early October cleanup misses the exposed directory.
- 2026-10-10 (CloudSEK): Railway access described as lasting at least until 10 October. Turkmenistan lures were built and tested during October.
- 2026-11-11 (CloudSEK): CloudSEK publishes the exposed-server report, including the Strix configuration, persona, and Telegram gateway logs.
- 2026-11-12 (The Record): The Record covers the CloudSEK findings and says they do not establish a link to the Kazakh government.

## Tools
### AI tooling and models
- Hermes Agent, operator brand Strix (https://github.com/NousResearch/hermes-agent)
- [DeepSeek](https://github.com/deepseek-ai) V4.1 Flash via OpenRouter
- [Gemini](https://gemini.google.com/) 2.5 Flash via OpenRouter for sub-agents
- Hermes Telegram gateway

### Other tooling
- Ligolo-ng (https://github.com/nicocha30/ligolo-ng)
- fscan (https://github.com/shadow1ng/fscan)
- GOST (https://github.com/go-gost/gost)
- Inveigh (https://github.com/Kevin-Robertson/Inveigh)
- Responder (https://github.com/lgandx/Responder)
- NetExec (https://github.com/Pennyw0rth/NetExec)
- Impacket (https://github.com/fortra/impacket)
- Laplas (srvdriv.exe) and Chvost (ssdpdrv.exe)
- NetBird mesh and Pangolin proxy on foreverpeace\[.\]ru

## Source notes
IPs, URLs, hashes, the Strix configuration table, the Telegram display name, and the DESKTOP-S3MHLFV\nemo test host are from the CloudSEK article. The Record is a 12 November 2026 recap and adds that the research does not establish a Kazakh government link. Hermes Agent is linked because the public repository matches the Telegram gateway, cron, sub-agents, and OpenRouter use CloudSEK describes. CloudSEK did not publish that URL. Link hermes-operators-campaigns-2026 for other public Hermes-operator reporting. CloudSEK says the same harness and model family appeared in its earlier Gentlemen affiliate investigation and that the two operators are unrelated. inc-gentlemen-ransomware-ai-2026-10 is a separate SOCRadar report about OpenCode, Claude, and Kimi, not that CloudSEK investigation. The old Hermes URL github.com/Hermes-Autonomous-Intelligence/hermes returned HTTP 404 on 18 November 2026 and is not used.

## Sources
- [Off the Rails: Inside an Exposed Silent Lynx Server](https://www.cloudsek.com/blog/off-the-rails-inside-an-exposed-silent-lynx-server) — CloudSEK
- [Kazakhstan-linked hackers used AI agent to spy on Central Asian governments](https://therecord.media/kazakhstan-hackers-central-asia) — The Record
- [Hermes Agent](https://github.com/NousResearch/hermes-agent) — Nous Research
- [Ligolo-ng](https://github.com/nicocha30/ligolo-ng) — nicocha30
- [fscan](https://github.com/shadow1ng/fscan) — shadow1ng
- [GOST](https://github.com/go-gost/gost) — go-gost
- [Impacket](https://github.com/fortra/impacket) — Fortra
- [NetExec](https://github.com/Pennyw0rth/NetExec) — Pennyw0rth
- [Responder](https://github.com/lgandx/Responder) — lgandx
- [Inveigh](https://github.com/Kevin-Robertson/Inveigh) — Kevin Robertson
