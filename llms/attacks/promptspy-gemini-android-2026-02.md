# PromptSpy Android spyware using Gemini for C2 decisions

- ID: promptspy-gemini-android-2026-02
- Reported: 2026-02-19
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/promptspy-gemini-android-2026-02/

## Summary
Feb 19, 2026: ESET discovered PromptSpy Android spyware using Gemini 1.5 Pro for C2 decision-making. After collecting surveillance data (location, photos, contacts, messages, call logs), malware sends summary to Gemini with prompt asking what additional data to collect or which contacts to target. Gemini response directs next collection phase. Enables adaptive targeting of high-value contacts and data. Attribution unknown.

## Category
adversary-use-of-ai

## Attribution
Unknown actor

- Actor: Unknown
- Country: Unknown
- Motivation: unknown
- Attributed by: ESET
- Confidence: low

## AI involvement confidence
confirmed

## Attack flow
### install: Install PromptSpy APK (access)

Victim installs malicious APK

Evidence: <https://www.welivesecurity.com/en/eset-research/promptspy-ushers-in-era-android-threats-using-genai/>

### initial-collection: Collect surveillance data (execution)

Gather location, photos, contacts, messages, call logs

Evidence: <https://www.welivesecurity.com/en/eset-research/promptspy-ushers-in-era-android-threats-using-genai/>

### gemini-decision: Query Gemini for next targets (ai)

Send data summary to Gemini 1.5 Pro asking what to collect next or which contacts to target

Evidence: <https://www.welivesecurity.com/en/eset-research/promptspy-ushers-in-era-android-threats-using-genai/>

### adaptive-targeting: Execute Gemini-directed collection (impact)

Follow Gemini recommendations for high-value contact targeting and additional data gathering

Evidence: <https://www.welivesecurity.com/en/eset-research/promptspy-ushers-in-era-android-threats-using-genai/>

### Connections

- install -> initial-collection
- initial-collection -> gemini-decision
- gemini-decision -> adaptive-targeting

## MITRE ATLAS
- [AML.T0040](https://atlas.mitre.org/techniques/AML.T0040) AI Model Inference API Access — Spyware uses Gemini API to adaptively determine surveillance targets and data collection priorities
  Evidence: <https://www.welivesecurity.com/en/eset-research/promptspy-ushers-in-era-android-threats-using-genai/>

## Prevention
Install apps only from official stores; use mobile security solutions; review app permissions; monitor for unexpected Gemini API usage

## Detections
- Gemini API monitoring from mobile apps (guidance) — Monitor Android apps for unexpected Google Gemini API calls; alert on spyware indicators (location, photo, contact access) combined with LLM queries

## Timeline
- First seen: 2026-02-01
- Last updated: 2026-11-05
- 2026-02-19 (ESET): PromptSpy discovered using Gemini to adaptively direct surveillance data collection

## Tools
### AI tooling and models
- Google [Gemini](https://gemini.google.com/) 1.5 Pro

### Other tooling
- Android spyware
- Location tracking
- Photo exfiltration
- Contact/message harvesting

## Sources
- [ESET: PromptSpy Android Spyware Uses Gemini for C2](https://www.welivesecurity.com/en/eset-research/promptspy-ushers-in-era-android-threats-using-genai/)
