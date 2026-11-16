# FBI FLASH FaceStealer uses stolen webcam video and BlueNoroff deepfakes

- ID: fbi-facestealer-bluenoroff-deepfake-2026-11
- Reported: 2026-11-12
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/fbi-facestealer-bluenoroff-deepfake-2026-11/

## Summary
FBI FLASH AC-111226-MS (Nov 12, 2026) describes FaceStealer, attributed to Sapphire Sleet / BlueNoroff / APT38 / UNC1069. The operators take over a victim's Telegram, LinkedIn, Slack, or Discord account, read the chat history, and message contacts to catch up or talk investment. A Calendly invite sets the time. Shortly before the call, the link points at a typosquat such as uu01webzoom.us or teams.livemeet.us. The copycat Zoom or Teams page plays the trusted contact's stolen webcam recording, often next to other participants. A chat message says the target cannot be heard and walks them through an update, script, or terminal paste that installs a cookie harvester, keyloggers, a screen capturer, and a backdoor. The target's webcam is recorded from the moment the link opens and feeds the next round. The FBI says the group has begun using what it calls super intelligence to make deepfakes of crypto and web3 figures alongside stolen footage. Earlier in 2026 a maintainer of a widely downloaded JavaScript library ran the fix during a fake Teams call, and the operators then published malicious dependencies that were caught quickly. The FBI has also seen attempts against npm maintainers and, recently, Rust crate maintainers. Arctic Wolf's Nov 12 paper adds lures that end in a ClickFix command: NovaStream Player at vip.novaplayer.online (HTML SHA-256 ca14040cc48fbc3b00ea5f74e891266128f7bb3058be400782c5b08436f7668a), a Chrome PDF Viewer kit at chromeupdate.docdock.online and calendly.docdock.online, and calendly.idcheck.watch. The macOS idcheck command is curl piped to osacompile. The Windows cradle is curl piped to powershell -c with [Console]::In.ReadToEnd()|iex. Hosting includes Hostwinds 104.168.149.21, 104.168.149.182, and 104.168.149.230, and Petrosky 83.136.210.38 for docdock.online. Arctic Wolf's appendix lists 98 high-confidence domains. The domains below are that table plus the FBI examples and the lure hosts named in the paper. Link bluenoroff-uses-deepfaked-executives-fake-zoom-2025-06 and unc1069-gemini-deepfake-crypto-2025.

## Category
adversary-use-of-ai

## Attribution
Sapphire Sleet, BlueNoroff, APT38, UNC1069, Dangerous Password, CryptoCore, Stardust Chollima. FBI FLASH AC-111226-MS. Arctic Wolf independently attributes the activity to BlueNoroff.

- Actor: Sapphire Sleet / BlueNoroff / APT38 / UNC1069
- Country: North Korea
- Motivation: financially-motivated
- Attributed by: FBI, Arctic Wolf Labs
- Confidence: high

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Hijacked messenger accounts, then a typosquat Zoom or Teams page and a ClickFix paste
- Victims and sectors: Cryptocurrency and web3 individuals and companies, plus open-source maintainers. The FBI says the group stole more than $400 million in 18 months.
- Regions: Multiple regions
- Region notes: North Korea is the actor origin from the FBI, not a victim region. Arctic Wolf's target countries are not listed as a closed set, so the entry uses Multiple regions.
- Scale and metrics: More than $400 million stolen in 18 months, per the FBI. Arctic Wolf: 122 AI-generated assets from seven generators, and 98 high-confidence domains on the Hostwinds cluster.

## Attack flow
### account: Hijacked messenger account (access)

A prior victim's Telegram, LinkedIn, Slack, or Discord account messages contacts and sends a Calendly invite.

Evidence: <https://www.ic3.gov/CSA/2026/261112.pdf>

### meeting: Typosquat meeting page (execution)

The link, such as uu01webzoom.us or teams.livemeet.us, plays stolen webcam video and starts recording the new target.

Evidence: <https://www.ic3.gov/CSA/2026/261112.pdf>

### deepfake: Generator-tagged deepfakes (ai)

Arctic Wolf found 122 assets from seven generators, identified by embedded tags and C2PA rather than appearance. Stolen footage is still most of the scheme.

Evidence: <https://www.ic3.gov/CSA/2026/261112.pdf> <https://arcticwolf.com/wp-content/bluenoroff_still_in_the_meeting.pdf>

### clickfix: ClickFix paste (execution)

Windows uses curl piped to powershell ReadToEnd|iex. macOS uses curl piped to osacompile.

Evidence: <https://arcticwolf.com/wp-content/bluenoroff_still_in_the_meeting.pdf>

### Connections

- account -> meeting
- meeting -> deepfake
- meeting -> clickfix

## MITRE ATLAS
- [AML.T0088](https://atlas.mitre.org/techniques/AML.T0088) Generate Deepfakes — The FBI says the operators generate deepfake video of crypto and web3 figures from public images, and Arctic Wolf ties 122 assets to generator tags and C2PA data.
  Evidence: <https://www.ic3.gov/CSA/2026/261112.pdf> <https://arcticwolf.com/wp-content/bluenoroff_still_in_the_meeting.pdf>
- [AML.T0016.002](https://atlas.mitre.org/techniques/AML.T0016.002) Generative AI — Arctic Wolf attributes the generated media to Grok Imagine, Google Generative AI, Wondershare AIGC, GPT-4o, GPT Image, and BytePlus ModelArk.
  Evidence: <https://arcticwolf.com/wp-content/bluenoroff_still_in_the_meeting.pdf>
- [AML.T0052](https://atlas.mitre.org/techniques/AML.T0052) Phishing — Hijacked accounts and typosquat Zoom and Teams pages deliver the lure.
  Evidence: <https://www.ic3.gov/CSA/2026/261112.pdf>

## Prevention
Treat a meeting link that arrives in chat just before the call as hostile until the domain is the vendor's. Do not paste a command from a call. On Windows, hunt curl.exe piped into powershell with ReadToEnd and iex. On macOS, hunt curl and osacompile in the same command line. Block the domains and the four IPs below.

## Detections
- [Potential In-Memory Download And Compile Of Payloads](https://github.com/SigmaHQ/sigma/blob/master/rules/macos/process_creation/proc_creation_macos_susp_in_memory_download_and_compile.yml) (sigma) — macOS process creation. A command line that contains both curl and osacompile. Matches the calendly.idcheck.watch cradle.
- [Suspicious Curl.EXE Download](https://github.com/SigmaHQ/sigma/blob/master/rules/windows/process_creation/proc_creation_win_curl_susp_download.yml) (sigma) — Windows process creation. curl.exe downloading a payload. Matches the front half of the Windows ClickFix cradle. It does not see the powershell ReadToEnd|iex half.
- ReadToEnd stdin cradle (guidance) — security-detections-mcp and a corpus search found no Sigma, Splunk, or Elastic rule for \[Console\]::In.ReadToEnd()|iex. The Sigma IEX rules require a space that this cradle omits. Also hunt the NovaStream HTML hash and the four IPs.

## Timeline
- First seen: 2026-05-20
- Last updated: 2026-11-12
- 2026-05-20 (Arctic Wolf Labs): A self-signed certificate generated at 15:04 UTC is later served by all three Hostwinds addresses. Lure domains resolve over the following days.
- 2026-11-12 (FBI): FBI FLASH describes FaceStealer, including deepfakes of crypto figures and the uu01webzoom.us and teams.livemeet.us examples.
- 2026-11-12 (Arctic Wolf Labs): Arctic Wolf publishes the six-month update, generator provenance for 122 assets, the ClickFix command lines, and the high-confidence domain table.

## Tools
### AI tooling and models
- [Grok](https://x.ai/grok) Imagine
- Google Generative AI
- Wondershare AIGC
- GPT-4o and GPT Image
- BytePlus ModelArk

### Other tooling
- Stolen webcam recordings
- ClickFix terminal paste
- NovaStream Player lure

## Source notes
The takeover loop, the two example typosquats, the deepfake statement, and the maintainer supply-chain note are from the FBI PDF. Generator counts, the ClickFix command lines, the Hostwinds and Petrosky addresses, the NovaStream hash, and the high-confidence domain table are from the Arctic Wolf white paper. The Sigma IEX rules require a space in '| iex' or 'iex ', and the published cradle is ReadToEnd()|iex with no space, so those rules are not cited. The osacompile run-only rule requires -x and -e, and the idcheck command uses osacompile -o, so that rule is not cited either. There is no attacker GitHub repository.

## Sources
- [FBI FLASH AC-111226-MS: FaceStealer](https://www.ic3.gov/CSA/2026/261112.pdf) — FBI
- [Still in the Meeting: BlueNoroff Six Months On](https://arcticwolf.com/resources/blog/still-in-the-meeting-bluenoroff-six-months-on/) — Arctic Wolf Labs
- [Still in the Meeting: BlueNoroff Six Months On (white paper)](https://arcticwolf.com/wp-content/bluenoroff_still_in_the_meeting.pdf) — Arctic Wolf Labs
- [BlueNoroff uses ClickFix, fileless PowerShell, and AI-generated Zoom meetings](https://arcticwolf.com/resources/blog/bluenoroff-uses-clickfix-fileless-powershell-and-ai-generated-zoom-meetings-to-target-web3-sector/) — Arctic Wolf Labs
- [Inside a DPRK BlueNoroff ClickFix kit](https://www.jumpsec.com/guides/inside-a-dprk-bluenoroff-clickfix-kit/) — Jumpsec
- [Coverage of the FaceStealer disruption](https://therecord.media/stolen-binance-crypto-recovered-doj-facestealer-disrupted) — The Record
- [FBI warns of North Korean fake Zoom calls](https://www.helpnetsecurity.com/2026/11/13/fbi-north-korean-fake-zoom-calls/) — Help Net Security
