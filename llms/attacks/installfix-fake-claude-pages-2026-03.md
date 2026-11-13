# InstallFix fake Claude Code installation pages

- ID: installfix-fake-claude-pages-2026-03
- Reported: 2026-03-06
- AI role: ai_tool_as_lure
- Entry: https://openattacks.ai/attacks/installfix-fake-claude-pages-2026-03/

## Summary
Mar 6, 2026: Push Security identified 'InstallFix' campaign: 120+ fake websites impersonating official Claude Code installation pages (claude-code-download[.]com, get-claude-code[.]net, etc.). Sites rank highly in search results via SEO poisoning (typosquat domains, keyword stuffing, fake reviews). Offer trojanized Claude Code installers for Windows/macOS/Linux. Windows: NSIS installer bundles Claude Code with AMOS infostealer. macOS: DMG contains Claude Code.app + hidden LaunchAgent installing Atomic Stealer. Linux: .deb/.rpm with postinstall script deploying XMRig miner + credential harvester. All variants harvest: Anthropic API keys, OpenAI keys, GitHub tokens, AWS credentials, crypto wallets, browser cookies, SSH keys. Push Security tracked 8,900+ downloads Mar-May 2026. Average user dwell time before detection: 23 days. Detection: verify Claude Code install source (official anthropic.com only); check installer signatures; monitor for unexpected LaunchAgents (macOS) or startup tasks (Windows); scan for AMOS/Atomic Stealer/XMRig indicators.

## Category
attacks-on-ai

## Attribution
Unknown actor; 'InstallFix' campaign; sophisticated SEO manipulation and multi-platform malware development

- Actor: Unknown
- Country: Unknown
- Motivation: financially-motivated
- Attributed by: Push Security
- Confidence: medium

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: User searches 'download Claude Code', finds fake site via SEO poisoning, downloads trojanized installer
- Victims and sectors: 8,900+ downloads Mar-May 2026; AI developers, data scientists, software engineers seeking Claude Code
- Regions: Multiple regions
- Region notes: unknown
- Scale and metrics: 120+ fake installation websites, 8,900+ downloads Mar-May 2026; avg 23-day dwell time before detection

## Attack flow
### seo-poisoning: Create fake install sites with SEO (access)

Adversary creates 120+ fake Claude Code installation websites (claude-code-download[.]com, get-claude-code[.]net, etc.); uses SEO poisoning (typosquats, keyword stuffing, fake reviews) to rank highly in search results for 'download Claude Code'

Evidence: <https://pushsecurity.com/blog/installfix/>

### user-downloads: User downloads trojanized installer (ai)

User searches for Claude Code, finds fake site, downloads installer; sites appear legitimate with screenshots, documentation, fake testimonials; multi-platform support (Windows NSIS, macOS DMG, Linux deb/rpm)

Evidence: <https://pushsecurity.com/blog/installfix/>

### install-malware: Install malware with legitimate app (execution)

Installer deploys functional Claude Code plus malware: Windows (AMOS infostealer), macOS (LaunchAgent → Atomic Stealer), Linux (postinstall → XMRig + harvester). Malware harvests Anthropic keys, OpenAI keys, GitHub tokens, AWS creds, crypto wallets, SSH keys

Evidence: <https://pushsecurity.com/blog/installfix/>

### exfiltrate-mine: Credential theft and crypto mining (impact)

Malware exfiltrates credentials to attacker C2; XMRig mines Monero on Linux systems; persistence via LaunchAgents/startup tasks; 8,900+ affected installations Mar-May 2026; avg 23-day dwell time

Evidence: <https://pushsecurity.com/blog/installfix/>

### Connections

- seo-poisoning -> user-downloads
- user-downloads -> install-malware
- install-malware -> exfiltrate-mine

## MITRE ATLAS
- [AML.T0000](https://atlas.mitre.org/techniques/AML.T0000) Search Open Technical Databases — Adversary uses SEO poisoning and fake installation pages to distribute trojanized AI coding assistant installers stealing credentials
  Evidence: <https://pushsecurity.com/blog/installfix/>

## Prevention
Only download Claude Code from official anthropic.com; verify installer signatures; check domain spelling before download; use bookmark for official site; educate users on SEO poisoning risks; implement endpoint security detecting AMOS/Atomic/XMRig; monitor for unexpected startup persistence mechanisms

## Detections
- Behavioral monitoring (guidance) — Monitor for malicious patterns in IDE extensions, skills, and installation pages; verify publisher authenticity

## Timeline
- First seen: 2026-03-06
- Last updated: 2026-11-04
- 2026-03-06 (Push Security): Campaign discovered and analyzed

## Tools
### AI tooling and models
- [Claude Code](https://github.com/anthropics/claude-code) (impersonated)
- Anthropic [Claude](https://claude.com/product/overview) API
- OpenAI API

### Other tooling
- AMOS infostealer (Windows)
- Atomic Stealer (macOS)
- XMRig cryptocurrency miner (Linux)
- Credential harvesters
- SEO poisoning and typosquat domains

## Source notes
Push Security analysis. InstallFix represents evolution of software supply chain attacks: instead of compromising legitimate distribution, adversary creates parallel fake distribution network optimized for search discovery. Detection: alert on Claude Code installs from domains other than anthropic.com, scan for AMOS/Atomic Stealer/XMRig, monitor LaunchAgents and startup tasks created during install, check installer code signing (unsigned/wrong signature = malicious).

## Sources
- [Push Security: InstallFix Campaign - Fake Claude Code Installation Pages](https://pushsecurity.com/blog/installfix/)
