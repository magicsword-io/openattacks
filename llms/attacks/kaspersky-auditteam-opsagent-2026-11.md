# Kaspersky: AuditTeam OpsAgent masks ransomware as a forced audit

- ID: kaspersky-auditteam-opsagent-2026-11
- Reported: 2026-11-18
- AI role: llm_generated_malware
- Entry: https://openattacks.ai/attacks/kaspersky-auditteam-opsagent-2026-11/

## Summary
Kaspersky GReAT (Vladimir Nestor, Securelist, 18 November 2026) documents AuditTeam and its OpsAgent framework. The ransom note demands an Audit and Consulting fee in exchange for a vulnerability report. Kaspersky says the note is dropped by the cryptor module, so a victim who sees it already has encrypted files. The campaign began in January 2026. GitHub commit history shows a start on 5 January 2026, and the leak site lists its first victim on 21 February 2026. Activity continued through October 2026 at a minimum. Kaspersky first saw the tool on 10 March 2026 against an organization in Hong Kong. Dozens of machines were infected in China, the Philippines, Senegal, Italy, Finland, Hong Kong, and Russia. The group's leak site also claims victims in Turkey, Thailand, Ukraine, Argentina, South Korea, Japan, and Spain. Kaspersky attributes OpsAgent to AuditTeam with high confidence from the note wording, the Tor leak site, and the remediation-report pitch. Loaders in C, .NET, and later Rust unpack the implant. The C loader injects into msiexec.exe. The September Rust loader pulls an encrypted payload from the C2 and runs it in-process. The C++ implant (version 5.2.8 in the write-up) offers file commands, injection, token theft, keylogging, screenshots, and pivoting. Commands such as mimikatz_spawn and pth_spawn do not embed those tools. Payloads arrive over a named pipe, XOR-encoded with key 604902af7b70b271. OpsAgent can read its C2 from the public repository hxxps://github[.]com/RonaldCMalcolm1983/staticPage. The address is AES-CBC, key the SHA-256 of f4bb8c7e15d8b98d535eb20b09176b3d, wrapped by GetConfig and EndConfig. The Rust rewrite, OpsAgent-rs, starts with HTTP POST, can upgrade to a WebSocket, and reads an extra base64 blob from the same README using AES-GCM. Kaspersky says several code patterns suggest LLM-assisted development. That is an inference from the binary: hash-resolved WinAPI names left in plaintext in memory, and injection routines that differ mainly by argument count and target process. No prompt, API trace, or model name was recovered. The closing paragraph says AI-assisted development tools may have lowered the cost of a framework like this. That is the same inference, not a separate observation. An AV and EDR killer installs a digitally signed Beijing Jiangmin Antivirus driver, kvcore.sys, to C:\Windows\System32\drivers\kvcore.sys (and the Sysnative path). It talks to filter port \KvCorePortX0. Command 0x1D followed by a target filename kills the process. The kill list is about 220 names, including security, remote-access, backup, and database processes. A debug log path is C:\Users\Public\kv_dbg.log. Stagers use syscache.dat under ProgramData, the user profile, CLR_v4.0, the module path, or Temp. This driver behavior is CVE-2026-19193. NVD describes improper access control in MessageNotifyCallback of kvcore.sys in Jiangmin Antivirus 21, local, with a public exploit, published 7 August 2026. The public proof of concept at https://github.com/patrickt2017/CVE-2026-19193-PoC documents command 0x1D on \KvCorePortX0 and gives SHA-256 AE4ABB650C7DF1D3654AFC814617DE6F6589DC2C3BE434154B3BE0F6521E2259 for kvcore.sys 1.23.6.27. That hash is the PoC's, not Kaspersky's sample. Kaspersky's driver MD5 is 109cdc24ccd4872a3e4bf6f2d4f3c3d4, which Kaspersky marks as a legitimate antivirus driver. The file is not in the LOLDrivers repository tree checked on 18 November 2026 (no path containing kvcore, jiangmin, or that MD5). The cryptor encrypts with AES-CBC or ChaCha20, X25519 key exchange, stops database and backup processes including Veeam, removes shadow copies, and wipes deleted-file contents. C2 uses CloudFront names d19v1tntmz2i98[.]cloudfront[.]net and d35htktbyt7nxc[.]cloudfront[.]net, and 157.20.104[.]111. Kaspersky says the GitHub repository was removed in November 2026 and that later Rust implants had the GitHub lookup disabled, so removal does not show the campaign stopped.

## Category
adversary-use-of-ai

## Attribution
AuditTeam. Kaspersky GReAT, high confidence, from the Audit and Consulting fee note, the Tor leak site, and the remediation-report pitch. First public mention Kaspersky cites is dbdigest.com in March 2026, then DeXpose on 25 June 2026.

- Actor: AuditTeam
- Country: Unknown
- Motivation: financially-motivated
- Attributed by: Kaspersky GReAT
- Confidence: high

## AI involvement confidence
vendor-asserted

## Scope and targeting
- Initial access: unknown
- Victims and sectors: Dozens of organizations Kaspersky observed in China, the Philippines, Senegal, Italy, Finland, Hong Kong, and Russia, across industries Kaspersky does not name. The leak site claims further countries.
- Regions: China, Philippines, Senegal, Italy, Finland, Hong Kong, Russia
- Region notes: Regions are countries where Kaspersky observed infections. The leak site's additional claims (Turkey, Thailand, Ukraine, Argentina, South Korea, Japan, Spain) are the group's own listing and are not added as regions.
- Scale and metrics: Dozens of infected machines. Observed victims in seven countries. Leak site claims seven more. Activity from 5 January 2026 through at least October 2026. No dollar amount and no model name.

## Attack flow
### loaders: C, .NET, and Rust loaders (access)

Loaders unpack OpsAgent. The C and .NET variants inject into msiexec.exe. The September Rust loader runs the payload in-process after fetching it from the C2.

Evidence: <https://securelist.com/auditteam-opsagent-forced-audit/122031/>

### implant: OpsAgent and the GitHub dead drop (execution)

The implant takes file, injection, token, and pivot commands. It can read an encrypted C2 address from RonaldCMalcolm1983/staticPage. The Rust build uses a second blob and AES-GCM.

Evidence: <https://securelist.com/auditteam-opsagent-forced-audit/122031/>

### llm-patterns: Patterns Kaspersky reads as LLM output (ai)

Kaspersky points at plaintext API names left beside hash resolution, and at injection routines that share the same scaffold. This is an inference. No model was named.

Evidence: <https://securelist.com/auditteam-opsagent-forced-audit/122031/>

### killer: kvcore.sys and the cryptor (impact)

A signed Jiangmin driver, command 0x1D on \KvCorePortX0, terminates security tools. The cryptor then encrypts files and drops the consulting-fee note.

Evidence: <https://securelist.com/auditteam-opsagent-forced-audit/122031/> <https://nvd.nist.gov/vuln/detail/cve-2026-19193>

### Connections

- loaders -> implant
- implant -> llm-patterns
- llm-patterns -> killer

## MITRE ATLAS
- [AML.T0016.002](https://atlas.mitre.org/techniques/AML.T0016.002) Generative AI — Kaspersky infers LLM-assisted development from hash-resolved APIs whose plaintext names remain in memory and from near-identical injection scaffolding. No prompt was recovered.
  Evidence: <https://securelist.com/auditteam-opsagent-forced-audit/122031/>
- [AML.T0048](https://atlas.mitre.org/techniques/AML.T0048) External Harms — The cryptor encrypts files and drops the Audit and Consulting fee note. Kaspersky says seeing the note means encryption already happened.
  Evidence: <https://securelist.com/auditteam-opsagent-forced-audit/122031/>

## Prevention
Hunt kvcore.sys under C:\Windows\System32\drivers and C:\Windows\Sysnative\drivers, filter port \KvCorePortX0, and C:\Users\Public\kv_dbg.log. The driver is signed and is not, as of 18 November 2026, in the LOLDrivers tree, so a known-vulnerable-driver name list that omits kvcore.sys will not match. Hunt syscache.dat on the paths Kaspersky lists, the five stager MD5s, and driver MD5 109cdc24ccd4872a3e4bf6f2d4f3c3d4. Block or alert on the two CloudFront names and 157.20.104[.]111 only with other evidence, because CloudFront addresses are shared. Treat a ransom note that asks for an Audit and Consulting fee as encryption that already happened.

## Detections
- kvcore.sys is not on the public vulnerable-driver name list (guidance) — SigmaHQ driver_load_win_vuln_drivers_names.yml does not list kvcore.sys, so that rule will not match this driver. No cited Sigma, Splunk, or Elastic rule names \KvCorePortX0, syscache.dat, or the Audit and Consulting fee note. Hunt the driver path, the MD5, command 0x1D against that filter port, and the stager paths in the Securelist indicators. Shadow-copy deletion is described without a utility name, so the vssadmin rule is not cited. The driver was not in the LOLDrivers tree on 18 November 2026.

## Timeline
- First seen: 2026-01-05
- Last updated: 2026-11-18
- 2026-01-05 (Kaspersky GReAT): GitHub history Kaspersky cites as the campaign start. The first CloudFront name was added on 29 January and first seen 21 February.
- 2026-02-21 (Kaspersky GReAT): Leak site's first listed victim, the same day Kaspersky first sees d19v1tntmz2i98\[.\]cloudfront\[.\]net.
- 2026-03-10 (Kaspersky GReAT): First OpsAgent activity Kaspersky analysed, at an organization in Hong Kong.
- 2026-06-25 (Kaspersky GReAT): DeXpose, as cited by Kaspersky, reports AuditTeam claiming a Russian organization on its leak site.
- 2026-08-07 (NVD): NVD publishes CVE-2026-19193 for Jiangmin kvcore.sys MessageNotifyCallback. The public PoC documents command 0x1D on \KvCorePortX0.
- 2026-08-19 (Kaspersky GReAT): 157.20.104\[.\]111 added on the dead-drop repository. A second CloudFront name follows on 20 August.
- 2026-09 (Kaspersky GReAT): Rust loader observed. On 6 September the second CloudFront name is first seen. On 29 September the actor deletes the legacy C2 string from the repository.
- 2026-11-18 (Kaspersky GReAT): Securelist publishes the OpsAgent report. The GitHub repository had already been removed in November. Kaspersky's LLM comment is an inference from code patterns.

## Tools
### AI tooling and models
- Unnamed model. Kaspersky infers LLM-assisted development of OpsAgent from code patterns only.

### Other tooling
- OpsAgent C++ implant and OpsAgent-rs
- Beijing Jiangmin kvcore.sys (CVE-2026-19193)
- Public PoC https://github.com/patrickt2017/CVE-2026-19193-PoC (not evidence the operators used this repository)
- Amazon CloudFront C2 names
- GitHub dead-drop repository RonaldCMalcolm1983/staticPage

### MagicSword projects
- [LOLDrivers](https://loldrivers.io)

## Source notes
Stager MD5s from Kaspersky: d3e49dceb89a25f5da4ff0c42e996857, bd4c327ad208cb722ad25e43ea3f35fc, 5d1425ab3dad1d2de053f69529d227e1, f0d5752054f6b7af1325ea340c4326d0, 83768e994c6bb72d0b430b98a71ec8d6. Driver MD5 109cdc24ccd4872a3e4bf6f2d4f3c3d4. Paths include C:\ProgramData\Microsoft\Windows\Caches\syscache.dat, C:\Users\{username}\AppData\Local\Microsoft\Windows\Caches\syscache.dat, C:\Users\{username}\AppData\Local\Microsoft\CLR_v4.0\syscache.dat, and C:\Users\Public\kv_dbg.log. The PoC SHA-256 is a different measurement of kvcore.sys 1.23.6.27 and is not listed with Kaspersky's MD5 as if they were the same file. LOLDrivers was checked from the repository tree on 18 November 2026. Do not claim kvcore.sys is listed there. The Sigma vulnerable-driver name rule does not contain kvcore.sys, so it is not cited.

## Sources
- [The forced audit: how AuditTeam's OpsAgent framework masks ransomware as consulting](https://securelist.com/auditteam-opsagent-forced-audit/122031/) — Kaspersky
- [CVE-2026-19193](https://nvd.nist.gov/vuln/detail/cve-2026-19193) — NVD
- [CVE-2026-19193 proof of concept](https://github.com/patrickt2017/CVE-2026-19193-PoC) — patrickt2017
