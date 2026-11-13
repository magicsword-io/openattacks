# 3AM ransomware affiliate using AI loop against UK schools

- ID: bitdefender-3am-ransomware-ai-2026
- Reported: 2026-11-04
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/bitdefender-3am-ransomware-ai-2026/

## Summary
3AM ransomware affiliate used AI loop against UK schools showing model-style command errors including Bash escape sequences in Windows commands and malformed for /f syntax passing K" to comsvcs. Numbered retry scripts (av_remove2, av_remove3) indicate automated iteration. Probe files da_proof.txt and psexec-ok suggest autonomous validation. Backdoor admins library and svc_bkpmon created. Staging registry path HKLM\SOFTWARE\FIN001. Attack demonstrates AI-driven operations with observable execution errors and iteration patterns.

## Category
uncategorized

## Attribution
3AM ransomware affiliate

## AI involvement confidence
not assessed

## Attack flow
### initial-access: Initial access to UK schools (unknown)

Initial access vector not disclosed in source

Evidence: <https://www.bitdefender.com/en-us/blog/businessinsights/3am-ransomware-hybrid-ai-attack>

### ai-commands: AI loop generates attack commands (ai)

Model generates commands with observable errors including Bash escapes in Windows commands and broken for /f syntax

Evidence: <https://www.bitdefender.com/en-us/blog/businessinsights/3am-ransomware-hybrid-ai-attack>

### iteration: Automated retry with numbered scripts (ai)

Numbered scripts av_remove2, av_remove3 show iteration; probe files da_proof.txt, psexec-ok validate steps

Evidence: <https://www.bitdefender.com/en-us/blog/businessinsights/3am-ransomware-hybrid-ai-attack>

### persistence: Backdoor accounts and registry staging (execution)

Backdoor admins library and svc_bkpmon created; staging in HKLM\SOFTWARE\FIN001

Evidence: <https://www.bitdefender.com/en-us/blog/businessinsights/3am-ransomware-hybrid-ai-attack>

### ransomware: 3AM ransomware deployed (impact)

3AM ransomware payload deployed after preparation

Evidence: <https://www.bitdefender.com/en-us/blog/businessinsights/3am-ransomware-hybrid-ai-attack>

### Connections

- initial-access -> ai-commands
- ai-commands -> iteration
- iteration -> persistence
- persistence -> ransomware

## MITRE ATLAS
- [AML.T0016.002](https://atlas.mitre.org/techniques/AML.T0016.002) Generative AI — AI loop autonomously executed attack commands with observable model errors and iteration patterns
  Evidence: <https://www.bitdefender.com/en-us/blog/businessinsights/3am-ransomware-hybrid-ai-attack>

## Prevention
Detect model-style command syntax errors; monitor for numbered retry scripts; alert on probe files in unusual locations; review backdoor account creation; monitor registry key HKLM\SOFTWARE\FIN001; detect PsExec lateral movement; hunt for comsvcs.dll credential dumping

## Detections
No detections are recorded.

## Timeline
- First seen: 2026-10-01
- Last updated: 2026-11-05
- 2026-11-04 (Bitdefender): 3AM ransomware AI loop attack against UK schools disclosed

## Tools
### AI tooling and models
- AI-driven command loop (model unspecified)

### Other tooling
- 3AM ransomware
- Numbered retry scripts (av_remove2, av_remove3)
- Probe files (da_proof.txt, psexec-ok)
- Backdoor accounts (library, svc_bkpmon)
- Registry staging (HKLM\SOFTWARE\FIN001)
- PsExec
- comsvcs.dll

### MagicSword projects
- [LOLBAS](https://lolbas-project.github.io)

## Sources
- [3AM Ransomware Hybrid AI Attack](https://www.bitdefender.com/en-us/blog/businessinsights/3am-ransomware-hybrid-ai-attack) — Bitdefender
