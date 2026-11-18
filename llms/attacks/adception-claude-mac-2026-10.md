# Adception fake Claude Mac InstallFix

- ID: adception-claude-mac-2026-10
- Reported: 2026-10-09
- AI role: ai_tool_as_lure
- Entry: https://openattacks.ai/attacks/adception-claude-mac-2026-10/

## Summary
Google ad for claude mac lists bing.com, Bing click-tracking redirects through compromised retailer to fake Claude download. Page shows real Anthropic install command; Copy button swaps clipboard to decode lake-90.com URL and pipe into zsh (InstallFix). Dual cloaking on referrer. Mate Research (Nadav Lorber) documents full attack chain - clipboard swap Copy button triggers base64 curl pipe to zsh, AES-CTR zsh stager, beacon to /api/metrics/run?event=pasted|stager, AMOS infostealer exfiltration to 152.42.143.45, root backdoor via LaunchDaemons com.apple.accountsd.helper and com.apple.metadata.mds.worker. Signed DMG served from claude-desktop.com as Claude.dmg with Developer ID OSMAN ASTUR; jsDelivr note points to anchorpost13.com. Google Ads campaign 24303764142 served via claude-desk-code.com, promotion-chatgpt.com, lake-90.com. PasteSwitch toolkit family, unattributed.

## Category
adversary-use-of-ai

## Attribution
Push AcSig ClickFix toolkit family

- Actor: Push AcSig ClickFix toolkit family
- Country: Unknown
- Motivation: financially-motivated
- Attributed by: Push Security, Mate Security
- Confidence: medium

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Malvertising + clipboard swap / paste into Terminal
- Victims and sectors: macOS users searching for Claude
- Regions: unknown
- Region notes: unknown
- Scale and metrics: unknown

## Attack flow
### step-1: Search ad redirects (access)

An ad for Claude on Mac redirects through tracking and a compromised retailer to a fake download page.

Evidence: <https://pushsecurity.com/blog/adception-malvertising-another-search-engines-search-results>

### step-2: Claude branding earns trust (ai)

The page displays a real-looking Anthropic installation command.

Evidence: <https://pushsecurity.com/blog/adception-malvertising-another-search-engines-search-results>

### step-3: Clipboard command is swapped (execution)

The Copy button substitutes a command that decodes a different download URL and pipes content to zsh.

Evidence: <https://pushsecurity.com/blog/adception-malvertising-another-search-engines-search-results>

### step-4: Victim runs attacker content (impact)

Pasting the copied command into Terminal runs attacker-supplied content.

Evidence: <https://pushsecurity.com/blog/adception-malvertising-another-search-engines-search-results>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0073](https://atlas.mitre.org/techniques/AML.T0073) Impersonation — A fake Claude download impersonates a trusted AI vendor.
  Evidence: <https://pushsecurity.com/blog/adception-malvertising-another-search-engines-search-results>
- [AML.T0052](https://atlas.mitre.org/techniques/AML.T0052) Phishing — Google Ads malvertising campaign delivers AMOS via fake Claude installer
  Evidence: <https://mate.security/labs/fake-claude-code-ads-are-installing-amos-on-macs>
- [AML.T0074](https://atlas.mitre.org/techniques/AML.T0074) Masquerading — Clipboard swap technique delivers malicious payload via user paste action
  Evidence: <https://mate.security/labs/fake-claude-code-ads-are-installing-amos-on-macs>
- [AML.T0011](https://atlas.mitre.org/techniques/AML.T0011) User Execution — AMOS infostealer establishes persistence via LaunchDaemons
  Evidence: <https://mate.security/labs/fake-claude-code-ads-are-installing-amos-on-macs>

## Prevention
Check pasted commands; do not pipe remote scripts into shell

## Detections
- [Clipboard Access Via OSAScript](https://github.com/SigmaHQ/sigma/blob/master/rules/macos/process_creation/proc_creation_macos_clipboard_access_via_osascript.yml) (sigma) — Detects clipboard manipulation via osascript on macOS
- [Potential Persistence Via PlistBuddy](https://github.com/SigmaHQ/sigma/blob/master/rules/macos/process_creation/proc_creation_macos_persistence_via_plistbuddy.yml) (sigma) — Detects LaunchDaemon creation (com.apple.accountsd.helper, com.apple.metadata.mds.worker)
- [Credentials from Password Stores - Keychain](https://github.com/SigmaHQ/sigma/blob/master/rules/macos/process_creation/proc_creation_macos_creds_from_keychain.yml) (sigma) — Detects AMOS infostealer credential harvesting from macOS Keychain
- Malicious Claude install redirect detection (guidance) — Block domains claude-desktop.com, claude-desk-code.com, promotion-chatgpt.com, lake-90.com, anchorpost13.com; detect base64-encoded zsh pipes; monitor beacon traffic to /api/metrics/run?event=pasted|stager; block AMOS C2 152.42.143.45; flag Google Ads campaign 24303764142

## Timeline
- First seen: 2026-10-09
- Last updated: 2026-11-06
- 2026-10-09 (Push Security): Push Security reports Adception malvertising campaign; Google Ads for 'claude mac' redirect through Bing to fake Claude download; clipboard swap to base64 curl|zsh
- 2026-11-06 (Mate Security): Mate Research documents full attack chain: base64 curl pipe to zsh, AES-CTR stager, AMOS infostealer exfiltration to 152.42.143.45, LaunchDaemons persistence (com.apple.accountsd.helper, com.apple.metadata.mds.worker), signed DMG (Developer ID OSMAN ASTUR), Google Ads campaign 24303764142

## Tools
### AI tooling and models
- Fake [Claude](https://claude.com/product/overview) download / InstallFix lure

### Other tooling
- Google Ads campaign 24303764142
- Bing ck/a redirect
- zsh/curl pipe with base64 encoding
- AES-CTR zsh stager
- AMOS infostealer
- LaunchDaemons persistence (com.apple.accountsd.helper, com.apple.metadata.mds.worker)
- Signed DMG (Developer ID OSMAN ASTUR)
- PasteSwitch toolkit

## Source notes
Push Security initial disclosure (Oct 9); Mate Research comprehensive analysis adds AMOS payload details, LaunchDaemons persistence, signed DMG distribution, Google Ads campaign ID, full IOC set

## Sources
- [Push Security: Adception Malvertising - Another Search Engine's Search Results](https://pushsecurity.com/blog/adception-malvertising-another-search-engines-search-results) — Push Security
- [Mate Research: Fake Claude Code Ads are Installing AMOS on Macs](https://mate.security/labs/fake-claude-code-ads-are-installing-amos-on-macs) — Mate Security
