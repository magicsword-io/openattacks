# Fake AI tools campaign cluster (ANY.RUN)

- ID: anyrun-fake-ai-tools-2026-10
- Reported: 2026-10-14
- AI role: ai_tool_as_lure
- Entry: https://openattacks.ai/attacks/anyrun-fake-ai-tools-2026-10/

## Summary
1,258 public sandbox runs (Apr 15–Oct 5 2026) tied to lures as Claude, ChatGPT, Copilot, Gemini, Ollama, OpenClaw, Manus. Patterns: InstallFix one-liner domain swap; ClickFix Download Claude via mshta; shared claude.ai/chatgpt.com chats; trojanized Claude_x64-setup.exe with mseupdate headless Edge cookie grab; BiTB fake AI ads for marketers.

## Category
adversary-use-of-ai

## Attribution
Multiple overlapping kits (InstallFix, ClickFix Claude, trojanized installer, AI Ads BiTB)

- Actor: Multiple overlapping kits (InstallFix, ClickFix Claude, trojanized installer, AI Ads BiTB)

## AI involvement confidence
confirmed

## Attack flow
### step-1: AI-themed lures reach users (access)

Search ads, shared AI chats and fake downloads promote familiar AI brands.

Evidence: <https://any.run/cybersecurity-blog/fake-ai-tools-us-companies/>

### step-2: Trusted brands frame the lure (ai)

Claude, ChatGPT, Copilot and other product names provide social-engineering context.

Evidence: <https://any.run/cybersecurity-blog/fake-ai-tools-us-companies/>

### step-3: Commands or installers run (execution)

Reported branches use pasted commands, trojanized installers or browser-in-the-browser pages.

Evidence: <https://any.run/cybersecurity-blog/fake-ai-tools-us-companies/>

### step-4: Malware and cookie theft (impact)

The cluster includes malware delivery and a headless-browser cookie-grabbing chain.

Evidence: <https://any.run/cybersecurity-blog/fake-ai-tools-us-companies/>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
No ATLAS mapping is recorded.

## Prevention
Approved AI catalog; take paste-and-run from standard users; prevent mshta/wscript/unsigned scripts

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in Fake AI tools campaign cluster (ANY.RUN). Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- Impersonated [Claude](https://claude.com/product/overview), [ChatGPT](https://chatgpt.com/), Copilot, [Gemini](https://gemini.google.com/), [Ollama](https://github.com/ollama/ollama), OpenClaw, Manus, Codex, Perplexity

### Other tooling
- mshta
- [PowerShell](https://github.com/PowerShell/PowerShell) irm|iex
- msiexec
- msedge --remote-debugging-port=9222
- MacSync / Aura Stealer / HijackLoader

### MagicSword projects
- [LOLBAS](https://lolbas-project.github.io)

## Sources
- <https://any.run/cybersecurity-blog/fake-ai-tools-us-companies/>
