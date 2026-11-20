# FakeAgent Claude Desktop malvertising

- ID: huntress-fakeagent-claude-malvertising-2026-07
- Reported: 2026-07-22
- AI role: ai_tool_as_lure
- Entry: https://openattacks.ai/attacks/huntress-fakeagent-claude-malvertising-2026-07/

## Summary
Huntress (Michael Tigges, 22 July 2026) calls this campaign FakeAgent. Bing ads for a Claude Desktop download pointed at a public Claude Artifact, claude.ai/public/artifacts/ca456f1f-44c0-42af-b329-4f1c7534a877, which had about 7,100 views and the platform disclaimer that the content is user-generated and unverified. Anthropic had removed the artifact by the time the post was published. The artifact redirected to claude.ai.download-app.us and then downloading-api.it.com/html/claude/win, which served a fake ClaudeDesktop.exe. download-app.us was registered on 9 May 2026. ClaudeDesktop.exe is a signed JetBrains jcef_helper.exe, the same file Huntress also saw copied as DockerDesktop.exe for a scheduled task. It sideloads a VMProtect-packed libcef.dll. That DLL reads an Ethereum contract, downloads cache.dat, and the task keeps a copy under the EdgeUpdate install directory. A second stage, sslconf.exe, is a signed IBM SPSS binary that sideloads tempdir.dll. That DLL checks the GPU vendor and VRAM, skips QEMU and VMware, and decrypts appcfg.dat with a DirectX shader used as an AES-256-CTR routine. The embedded payload is SectopRAT, an HVNC .NET RAT. Its C2 address is stored on a BNB Smart Chain contract. Huntress observed the campaign against 29 organizations on 21 and 22 July 2026. The live C2 in the post is 2.24.131.246, with backup domain 5ca8758c-02d0-4a72-89c8-d468b66dda41.com.

## Category
adversary-use-of-ai

## Attribution
Unnamed. Huntress ties the download domain to one registrant who also held earlier domains, including one Microsoft seized, and an April 2026 fake Docker Desktop that used the same sideload. No person or group is named.

- Actor: Unnamed
- Country: Unknown
- Motivation: cybercrime
- Attributed by: Huntress (Michael Tigges)
- Confidence: medium

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Bing ads for a Claude Desktop download, leading to a public Claude Artifact and then a fake Windows installer.
- Victims and sectors: 29 organizations. Huntress does not name them or their sectors.
- Regions: unknown
- Region notes: Huntress does not name a victim country. The registrant's location is not a victim region and is not recorded here.
- Scale and metrics: 29 organizations, 21-22 July 2026. The artifact had about 7,100 views before Anthropic removed it.

## Attack flow
### ad: Bing ad opens an artifact (access)

An ad for a Claude Desktop download sends the visitor to a public Claude Artifact. The page is user-generated. Anthropic later removed it.

Evidence: <https://www.huntress.com/blog/fakeagent-claude-desktop-malvertising-ends-in-dotnet-rat>

### redirect: Artifact redirects to the installer (ai)

The artifact sends the browser to claude.ai.download-app.us and then to downloading-api.it.com, which serves the fake ClaudeDesktop.exe.

Evidence: <https://www.huntress.com/blog/fakeagent-claude-desktop-malvertising-ends-in-dotnet-rat>

### sideload: Signed host loads libcef.dll (execution)

The signed JetBrains binary sideloads a VMProtect libcef.dll. A scheduled task keeps a DockerDesktop.exe copy, and a signed IBM binary later sideloads tempdir.dll.

Evidence: <https://www.huntress.com/blog/fakeagent-claude-desktop-malvertising-ends-in-dotnet-rat>

### rat: SectopRAT reads its C2 from chain (impact)

tempdir.dll decrypts appcfg.dat after a GPU check. The embedded SectopRAT reads its live C2, 2.24.131.246, from a BNB Smart Chain contract.

Evidence: <https://www.huntress.com/blog/fakeagent-claude-desktop-malvertising-ends-in-dotnet-rat>

### Connections

- ad -> redirect
- redirect -> sideload
- sideload -> rat

## MITRE ATLAS
- [AML.T0073](https://atlas.mitre.org/techniques/AML.T0073) Impersonation — The ad, the public artifact, and the installer impersonate Claude Desktop.
  Evidence: <https://www.huntress.com/blog/fakeagent-claude-desktop-malvertising-ends-in-dotnet-rat>
- [AML.T0052](https://atlas.mitre.org/techniques/AML.T0052) Phishing — Search ads deliver the fake installer. The lure is the AI product name, and the payload is not an email.
  Evidence: <https://www.huntress.com/blog/fakeagent-claude-desktop-malvertising-ends-in-dotnet-rat>

## Prevention
Download Claude Desktop from Anthropic. Treat a search ad and a public artifact as unverified. Alert when a signed JetBrains or IBM binary loads an unsigned DLL from the same directory, and when a new scheduled task runs DockerDesktop.exe from an EdgeUpdate path.

## Detections
- [Windows Unsigned DLL Side-Loading In Same Process Path](https://github.com/splunk/security_content/blob/develop/detections/endpoint/windows_unsigned_dll_side_loading_in_same_process_path.yml) (splunk) — Selected from a security-detections-mcp search for unsigned DLL side-loading. Sysmon Event 7 where an unsigned DLL loads from the same directory as the process, outside Windows and Program Files. That matches libcef.dll beside the signed JetBrains host and tempdir.dll beside the signed IBM host. A valid signature on the DLL would not match.
- [Scheduled Task Creation Via Schtasks.EXE](https://github.com/SigmaHQ/sigma/blob/master/rules/windows/process_creation/proc_creation_win_schtasks_creation.yml) (sigma) — Selected from a security-detections-mcp search for schtasks creation. Matches schtasks.exe with " /create " in the command line, excluding a system user. Huntress does not publish the command line. A task created through the Task Scheduler API would not match.
- [Local Scheduled Task Creation](https://github.com/elastic/detection-rules/blob/main/rules/windows/persistence_local_scheduled_task_creation.toml) (elastic) — Selected from a security-detections-mcp search for scheduled task creation. Requires an untrusted process or a listed script host, then schtasks.exe /create with a scheduling flag, within one minute, and not at SYSTEM integrity. The same command-line limit applies. Huntress did not show schtasks.exe.
- Sideload path and task location gaps (guidance) — Sigma Abusable DLL Potential Sideloading From Suspicious Location does list libcef.dll, but only under Perflogs, Users\Public, Temporary Internet Files, Windows\Temp, Favorites, Contacts, and Pictures. It does not cover a Downloads or AppData copy, so it is not cited. Sigma Scheduled Task Executed From A Suspicious Location matches Temp, Desktop, Downloads, and Public, not AppData\Roaming\Microsoft\EdgeUpdate. No Elastic image-load rule in the index covers a generic unsigned DLL beside a signed host.

## Timeline
- First seen: 2026-07-21
- Last updated: 2026-07-22
- 2025-05-30 (Huntress): Earliest C2 address Huntress reads from the operator's chain history, 107.189.24.67. This is earlier operator history, not the start of the July Claude campaign.
- 2026-05-09 (Huntress): download-app.us is registered. The post does not publish the registrant contact.
- 2026-06-12 (Huntress): The chain record Huntress calls current points at 2.24.131.246.
- 2026-07-21 (Huntress): FakeAgent activity against organizations begins. Bing ads lead to the public Claude Artifact and the fake ClaudeDesktop.exe.
- 2026-07-22 (Huntress): Huntress publishes the campaign. 29 organizations were hit across 21 and 22 July. Anthropic had removed the artifact. The backup domain is 5ca8758c-02d0-4a72-89c8-d468b66dda41.com.

## Tools
### AI tooling and models
- [Claude Desktop](https://claude.com/product/overview), impersonated by the ad, the public artifact, and the fake installer
- Public [Claude](https://claude.com/product/overview) Artifact used as the redirect page

### Other tooling
- SectopRAT (.NET HVNC) with its C2 address stored on a BNB Smart Chain contract
- Signed JetBrains jcef_helper.exe sideloading libcef.dll
- Signed IBM SPSS sslconf.exe sideloading tempdir.dll
- Scheduled task that runs the DockerDesktop.exe copy
- GPU vendor and VRAM checks before the shader decrypts the payload

## Source notes
Classified as adversary use of AI with the lure role, the same treatment as the Adception fake Claude installer and the ANY.RUN fake AI-tool installers. The AI product is the bait. Anthropic's platform hosted a user-generated artifact, and Huntress does not describe a compromise of Claude or of Anthropic. SectopRAT steals broadly. That is not recorded as a second role of AI-credential theft. Huntress used Claude Opus 4.8 while recovering a one-byte mistake in the shader key. That is the analyst's method, not the attacker's, and it is not an indicator. Benign signed hosts, which should not be blocked on the hash alone, are ClaudeDesktop.exe and DockerDesktop.exe SHA256 f8acb8f5cf88b77a4c27d7fd6856aa299bb178e85f9963c2fbd447d818da3ed0 (JetBrains jcef_helper.exe) and SSLConf.exe SHA256 fd826215add30c1319eefa291b6eaf8ddfa7720cfe816c49aef6fe8a88de7939 (IBM SPSS). Huntress quotes the second persistence path as %APPDATA%\Roaming\Microsoft\EdgeUpdate\Install\sslconf.exe. The libcef.dll contract is 0xc1907d7be91f95903ad66d775c397302e7dd9228 and the SectopRAT contract is 0xe012d0f34cde9b870e9d9ed566ea5f8fd9b92228. polse.us is an earlier domain Huntress links to the same registrant. Microsoft seized it in Operation Endgame as StealC hosting. It is not a host of the July installer. An April 2026 Docker Hub fake Docker Desktop used the same libcef.dll sideload. The registrant email is omitted.

## Sources
- [FakeAgent: Claude Desktop malvertising ends in a .NET RAT](https://www.huntress.com/blog/fakeagent-claude-desktop-malvertising-ends-in-dotnet-rat) — Huntress
