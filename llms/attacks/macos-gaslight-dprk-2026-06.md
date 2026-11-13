# macOS.Gaslight - DPRK backdoor with LLM prompt injection analysis

- ID: macos-gaslight-dprk-2026-06
- Reported: 2026-06-23
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/macos-gaslight-dprk-2026-06/

## Summary
Jun 23, 2026: SentinelLABS analyzed macOS.Gaslight, DPRK macOS backdoor deployed via fake job offers targeting cryptocurrency/AI companies. Backdoor includes novel anti-analysis technique: embeds carefully crafted prompt injection payloads in code comments, strings, and metadata. When security researchers use LLM-based analysis tools (Claude Code, GPT-4 Code Interpreter, AI-assisted reverse engineering tools) to examine sample, injected prompts instruct LLM to: (1) report code as benign; (2) misattribute functionality; (3) omit C2 communications from analysis; (4) provide false explanations downplaying severity. SentinelLABS tested against Claude Sonnet 3.5, GPT-4o, Gemini 1.5 Pro: all three initially reported backdoor as benign when using standard analysis prompts. Adversary understands analysts increasingly rely on LLM code analysis; targets the analysis workflow itself. Backdoor functionality: keylogging, screenshot capture, file exfiltration, command execution; C2 via hxxps://macos-update[.]com. Attributed to DPRK BlueNoroff/Lazarus with high confidence. Detection: analyze samples in sandboxes without LLM assistance for initial triage; use LLM analysis only as supplementary; check for prompt injection patterns in binary strings; verify C2 communications manually.

## Category
adversary-use-of-ai

## Attribution
DPRK BlueNoroff/Lazarus (high-confidence attribution by SentinelOne); revenue generation and intelligence collection operations

- Actor: BlueNoroff/Lazarus
- Country: DPRK
- Motivation: nation-state
- Attributed by: SentinelOne
- Confidence: high

## AI involvement confidence
confirmed

## Attack flow
### spearphishing: Fake job offer spearphishing (access)

DPRK BlueNoroff/Lazarus targets crypto/AI company employees via fake job offers on LinkedIn/email; sends malicious macOS app bundle (posing as job assessment test, code challenge, etc.)

Evidence: <https://www.sentinelone.com/labs/macos-gaslight-dprk-backdoor-prompt-injection/>

### execute-backdoor: User executes backdoor (execution)

Target executes malicious app; macOS.Gaslight backdoor installs keylogger, screenshot capture, file exfiltration, command execution capabilities; establishes C2 to hxxps://macos-update[.]com

Evidence: <https://www.sentinelone.com/labs/macos-gaslight-dprk-backdoor-prompt-injection/>

### evade-analysis: Prompt injection evades LLM analysis (ai)

Security researchers analyze sample using LLM tools (Claude Code, GPT-4, Gemini); embedded prompt injection in code comments/strings instructs LLM to report as benign, omit C2 from analysis, misattribute functionality; delays detection and remediation

Evidence: <https://www.sentinelone.com/labs/macos-gaslight-dprk-backdoor-prompt-injection/>

### exfiltration: Data exfiltration and persistence (impact)

Backdoor logs keystrokes, captures screenshots, exfiltrates files to C2; maintains persistence on macOS; delayed detection due to LLM analysis manipulation enables prolonged access

Evidence: <https://www.sentinelone.com/labs/macos-gaslight-dprk-backdoor-prompt-injection/>

### Connections

- spearphishing -> execute-backdoor
- execute-backdoor -> evade-analysis
- execute-backdoor -> exfiltration

## MITRE ATLAS
- [AML.T0051](https://atlas.mitre.org/techniques/AML.T0051) LLM Prompt Injection — DPRK malware embeds prompt injection in code to manipulate LLM-based security analysis tools, causing false benign verdicts
  Evidence: <https://www.sentinelone.com/labs/macos-gaslight-dprk-backdoor-prompt-injection/>

## Prevention
Educate employees on fake job offer phishing; verify job offers via official channels; use Gatekeeper and notarization (macOS); implement EDR detecting keyloggers and C2 communications; for analysts: do not rely solely on LLM-based analysis tools; use traditional sandboxing and manual analysis for initial triage; verify LLM analysis results against manual inspection

## Detections
- Prompt injection pattern detection (guidance) — Scan malware samples for embedded prompt injection patterns before LLM analysis; use traditional sandbox analysis for initial triage
- C2 monitoring (guidance) — Monitor for macos-update\[.\]com domain; detect keylogger and screenshot capture activity on macOS

## Timeline
- First seen: 2026-06-01
- Last updated: 2026-11-04
- 2026-06-23 (SentinelLABS): First documented DPRK malware using prompt injection to manipulate LLM-based security analysis tools

## Tools
### AI tooling and models
- [Claude Code](https://github.com/anthropics/claude-code) (targeted for manipulation)
- GPT-4 Code Interpreter (targeted)
- [Gemini](https://gemini.google.com/) 1.5 Pro (targeted)
- AI-assisted reverse engineering tools (targeted)

### Other tooling
- macOS.Gaslight backdoor
- Prompt injection in malware samples
- C2 infrastructure (macos-update\[.\]com)
- Keylogger, screenshot capture, file exfiltration

## Sources
- [SentinelLABS: macOS.Gaslight - North Korean Backdoor Uses LLM to Evade Analysis](https://www.sentinelone.com/labs/macos-gaslight-dprk-backdoor-prompt-injection/)
