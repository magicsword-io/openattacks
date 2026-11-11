# Adception fake Claude Mac InstallFix

- ID: adception-claude-mac-2026-10
- Reported: 2026-10-09
- AI role: ai_tool_as_lure
- Entry: https://openattacks.ai/attacks/adception-claude-mac-2026-10/

## Summary
Google ad for 'claude mac' lists bing.com, Bing click-tracking redirects through compromised retailer to fake Claude download. Page shows real Anthropic install command; Copy button swaps clipboard to decode lake-90.com URL and pipe into zsh (InstallFix). Dual cloaking on referrer.

## Category
adversary-use-of-ai

## Attribution
Push AcSig ClickFix toolkit family

- Actor: Push AcSig ClickFix toolkit family

## AI involvement confidence
confirmed

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

## Prevention
Check pasted commands; do not pipe remote scripts into shell

## Detections
- Detect malicious Claude/AI install redirects (guidance) — Monitor for suspicious redirects from search ads to fake AI tool download pages. Educate users to download Claude and other AI tools only from official sites. Implement browser security extensions that warn about lookalike domains and clipboard manipulation.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- Fake [Claude](https://claude.com/product/overview) download / InstallFix lure

### Other tooling
- Google Ads
- Bing ck/a redirect
- zsh/curl pipe

## Sources
- <https://pushsecurity.com/blog/adception-malvertising-another-search-engines-search-results>
