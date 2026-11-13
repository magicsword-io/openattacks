# Yoba campaign - fake GPT-6/Claude desktop apps via DLL sideloading

- ID: checkpoint-yoba-fake-ai-2026-10
- Reported: 2026-10-27
- AI role: ai_tool_as_lure
- Entry: https://openattacks.ai/attacks/checkpoint-yoba-fake-ai-2026-10/

## Summary
Campaign creates fake GitHub projects (gpt-5-6/sol-free-desktop, gpt-6-astra/gpt-6-astra.github.io, opus-5-0/opus-5-0.github.io) with GitHub.io pages impersonating GPT-5.6 Sol, GPT-6 Astra, and Claude Opus desktop apps. ZIP installers contain legitimate signed OpenAI and Anthropic executables alongside malicious YobaDropper/YobaLoader DLLs. Uses DLL sideloading (T1574.002) to load malware indirectly from signed binaries. No fake engagement (stars/forks) but ranks highly via SEO poisoning on Google. Malware avoids dedicated C2 infrastructure, uses Telegram, Tor, Catbox, DNS over HTTPS. Russian-origin indicators; operates UTC-4 time zone. Releases Aug-Sep 2026, low detection rate, no password protection on ZIPs.

## Category
uncategorized

## Attribution
Yoba campaign; Russian-origin indicators (language, time zone); operates primarily UTC-4 time zone; different email addresses per repository suggest OPSEC to obscure true operational timezone

## AI involvement confidence
not assessed

## Attack flow
### seo-poison: SEO poisoning and fake repositories (access)

Created fake GitHub repositories impersonating GPT-5.6 Sol, GPT-6 Astra, Claude Opus; GitHub.io pages with download links; no fake engagement but ranks highly on Google via SEO poisoning

Evidence: <https://research.checkpoint.com/2026/tricks-from-the-past-deployed-via-signed-chatgpt-and-claude-binaries/>

### lure: User downloads fake installer (access)

Victim searches for AI desktop apps, finds malicious GitHub repositories via Google; downloads ZIP from GitHub releases (sol-setup.zip, GPT-6-Astra-Setup.zip, Setup-Claude.zip)

Evidence: <https://research.checkpoint.com/2026/tricks-from-the-past-deployed-via-signed-chatgpt-and-claude-binaries/>

### sideload: DLL sideloading from signed binaries (execution)

ZIP contains legitimate signed OpenAI/Anthropic executables alongside malicious YobaDropper DLL; when legitimate signed binary runs, it loads malicious DLL via DLL search order hijacking

Evidence: <https://research.checkpoint.com/2026/tricks-from-the-past-deployed-via-signed-chatgpt-and-claude-binaries/>

### dropper: YobaDropper deploys YobaLoader (execution)

YobaDropper executes, deploys YobaLoader component; anti-sandbox and anti-analysis techniques; no password protection needed due to low detection

Evidence: <https://research.checkpoint.com/2026/tricks-from-the-past-deployed-via-signed-chatgpt-and-claude-binaries/>

### c2: C2 via Telegram, Tor, Catbox, DoH (ai)

YobaLoader contacts attacker infrastructure via Telegram, Tor, Catbox, DNS over HTTPS; no dedicated C2 infrastructure for strong OPSEC; fetches final payload

Evidence: <https://research.checkpoint.com/2026/tricks-from-the-past-deployed-via-signed-chatgpt-and-claude-binaries/>

### payload: Final payload execution (impact)

YobaLoader executes final payload on infected system; details of final payload capabilities not disclosed in source

Evidence: <https://research.checkpoint.com/2026/tricks-from-the-past-deployed-via-signed-chatgpt-and-claude-binaries/>

### Connections

- seo-poison -> lure
- lure -> sideload
- sideload -> dropper
- dropper -> c2
- c2 -> payload

## MITRE ATLAS
No ATLAS mapping is recorded.

## Prevention
Verify official AI tool sources; DLL sideloading detection; monitor GitHub releases for fake AI projects; SEO poisoning awareness; C2 infrastructure monitoring (Telegram, Tor, DNS over HTTPS)

## Detections
No detections are recorded.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- GPT-5.6 Sol (fake)
- GPT-6 Astra (fake)
- [Claude](https://claude.com/product/overview) Opus (fake)

### Other tooling
- YobaDropper
- YobaLoader
- Legitimate signed OpenAI executables
- Legitimate signed Anthropic executables
- DLL sideloading
- Telegram for C2
- Tor
- Catbox
- DNS over HTTPS (DoH)

## Sources
- [Tricks from the Past deployed via signed ChatGPT and Claude binaries](https://research.checkpoint.com/2026/tricks-from-the-past-deployed-via-signed-chatgpt-and-claude-binaries/)
