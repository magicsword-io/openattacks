# ChatGPT Lockdown Mode bypass - HTML preview sandbox escape (Check Point)

- ID: chatgpt-lockdown-mode-bypass-checkpoint-2026-09
- Reported: 2026-09-18
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/chatgpt-lockdown-mode-bypass-checkpoint-2026-09/

## Summary
Check Point researcher Alexey Bukhteyev disclosed ChatGPT Lockdown Mode bypass allowing HTML preview sandbox escape via contentWindow.open from nested iframe. Attack vectors: (1) zero-click desktop chat history theft, (2) fake-update malware delivery pages, (3) credential phishing via malicious prompts, custom GPTs, or shared chat links. OpenAI patched vulnerability Sept 18, 2026. No evidence of in-the-wild exploitation; marked borderline as researcher disclosure only.

Evidence qualification: Researcher disclosure; OpenAI fixed Sept 18, 2026; no evidence of in-the-wild exploitation

## Category
attacks-on-ai

## Attribution
Researcher disclosure (Alexey Bukhteyev, Check Point); no threat actor; OpenAI patched Sept 18

- Actor: Researcher disclosure only
- Country: Unknown
- Motivation: unknown
- Attributed by: Check Point
- Confidence: low

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Malicious prompt, custom GPT, or shared chat link with HTML preview exploit
- Victims and sectors: ChatGPT users; theoretical risk only (fixed before in-wild use)
- Regions: unknown
- Region notes: unknown
- Scale and metrics: PoC only; patched Sept 18, 2026; no in-wild exploitation documented

## Attack flow
### craft-exploit: Craft HTML preview exploit (execution)

Attacker creates malicious prompt/GPT/shared chat with nested iframe contentWindow.open escape

Evidence: <https://research.checkpoint.com/2026/chatgpt-lockdown-mode-bypass-phishing-malware-delivery-and-silent-data-exfiltration/>

### deliver-link: Deliver via prompt/GPT/shared chat (access)

User interacts with malicious prompt, custom GPT, or shared chat link

Evidence: <https://research.checkpoint.com/2026/chatgpt-lockdown-mode-bypass-phishing-malware-delivery-and-silent-data-exfiltration/>

### escape-sandbox: Escape HTML preview sandbox (execution)

Nested iframe contentWindow.open escapes Lockdown Mode sandbox

Evidence: <https://research.checkpoint.com/2026/chatgpt-lockdown-mode-bypass-phishing-malware-delivery-and-silent-data-exfiltration/>

### exfil-or-phish: Chat history theft or credential phishing (impact)

Zero-click chat history exfiltration (desktop) or credential phishing popup

Evidence: <https://research.checkpoint.com/2026/chatgpt-lockdown-mode-bypass-phishing-malware-delivery-and-silent-data-exfiltration/>

### Connections

- craft-exploit -> deliver-link
- deliver-link -> escape-sandbox
- escape-sandbox -> exfil-or-phish

## MITRE ATLAS
- [AML.T0051](https://atlas.mitre.org/techniques/AML.T0051) LLM Prompt Injection — Malicious prompts/GPTs/shared chats could deliver HTML preview exploits
  Evidence: <https://research.checkpoint.com/2026/chatgpt-lockdown-mode-bypass-phishing-malware-delivery-and-silent-data-exfiltration/>
- [AML.T0077](https://atlas.mitre.org/techniques/AML.T0077) LLM Response Rendering — Sandbox escape enabled chat history theft (zero-click desktop)
  Evidence: <https://research.checkpoint.com/2026/chatgpt-lockdown-mode-bypass-phishing-malware-delivery-and-silent-data-exfiltration/>
- [AML.T0057](https://atlas.mitre.org/techniques/AML.T0057) LLM Data Leakage — Credential phishing via escaped sandbox popup windows
  Evidence: <https://research.checkpoint.com/2026/chatgpt-lockdown-mode-bypass-phishing-malware-delivery-and-silent-data-exfiltration/>

## Prevention
OpenAI patched Sept 18, 2026; users should update ChatGPT Desktop; avoid untrusted shared chat links; review custom GPT permissions; implement sandbox escape monitoring

## Detections
- ChatGPT security monitoring (guidance) — Update ChatGPT Desktop to post-Sept-18-2026 version; monitor for sandbox escape attempts; review shared chat links before opening; audit custom GPT permissions; implement popup blocker; detect contentWindow.open from nested iframes; educate users on malicious prompt/GPT risks

## Timeline
- First seen: 2026-09-18
- Last updated: 2026-09-18
- 2026-09-18 (Check Point / OpenAI): Alexey Bukhteyev discloses Lockdown Mode bypass; OpenAI patches same day; no in-wild exploitation documented

## Tools
### AI tooling and models
- [ChatGPT](https://chatgpt.com/)
- [ChatGPT](https://chatgpt.com/) Desktop
- Custom GPTs

### Other tooling
- HTML preview sandbox
- Nested iframe escape

## Source notes
Check Point blog; researcher disclosure only; OpenAI fixed Sept 18, 2026; no threat actor or in-wild exploitation documented

## Sources
- [Check Point: ChatGPT Lockdown Mode Bypass - Phishing, Malware Delivery and Silent Data Exfiltration](https://research.checkpoint.com/2026/chatgpt-lockdown-mode-bypass-phishing-malware-delivery-and-silent-data-exfiltration/) — Check Point
