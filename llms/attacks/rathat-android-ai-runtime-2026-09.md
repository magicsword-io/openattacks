# RatHat Android trojan with AI-driven runtime behavior

- ID: rathat-android-ai-runtime-2026-09
- Reported: 2026-09-16
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/rathat-android-ai-runtime-2026-09/

## Summary
Sep 16, 2026: Zimperium discovered RatHat, Android banking trojan making real-time API calls to Chinese LLM providers (DeepSeek, Qwen) during execution to adapt behavior. Trojan collects device state (installed apps, security tools, screen content) and sends to LLM with prompt requesting optimal attack strategy. LLM responds with commands for credential harvesting, screen overlay injection, or SMS interception based on context. China-linked based on LLM provider selection and C2 infrastructure. Observed targeting banking apps across multiple regions.

## Category
adversary-use-of-ai

## Attribution
China-linked based on LLM provider selection

- Actor: Unknown
- Country: China
- Motivation: financially-motivated
- Attributed by: Zimperium
- Confidence: medium

## AI involvement confidence
confirmed

## Attack flow
### install: Install malicious APK (access)

User installs RatHat via phishing or third-party store

Evidence: <https://www.bleepingcomputer.com/news/security/new-rathat-android-malware-uses-ai-to-automate-device-control/>

### collect-state: Collect device state (execution)

Trojan scans installed apps, security tools, screen content

Evidence: <https://www.bleepingcomputer.com/news/security/new-rathat-android-malware-uses-ai-to-automate-device-control/>

### query-llm: Query LLM for strategy (ai)

Send device state to DeepSeek/Qwen with prompt requesting optimal attack approach

Evidence: <https://www.bleepingcomputer.com/news/security/new-rathat-android-malware-uses-ai-to-automate-device-control/>

### execute-attack: Execute LLM-directed attack (impact)

LLM responds with commands; trojan executes credential harvesting, overlay injection, or SMS interception

Evidence: <https://www.bleepingcomputer.com/news/security/new-rathat-android-malware-uses-ai-to-automate-device-control/>

### Connections

- install -> collect-state
- collect-state -> query-llm
- query-llm -> execute-attack

## MITRE ATLAS
- [AML.T0040](https://atlas.mitre.org/techniques/AML.T0040) AI Model Inference API Access — Android malware uses LLM at runtime to dynamically adapt attack behavior based on device state
  Evidence: <https://www.bleepingcomputer.com/news/security/new-rathat-android-malware-uses-ai-to-automate-device-control/>

## Prevention
Install apps only from official stores; use mobile security solutions detecting runtime LLM API calls from apps; monitor for overlay attacks

## Detections
- Runtime LLM API monitoring (guidance) — Monitor Android apps for unexpected API calls to DeepSeek, Qwen, or other LLM providers; alert on overlay injection attempts

## Timeline
- First seen: 2026-09-01
- Last updated: 2026-11-05
- 2026-09-16 (Zimperium): RatHat discovered making runtime LLM calls to adapt banking trojan behavior dynamically

## Tools
### AI tooling and models
- [DeepSeek](https://github.com/deepseek-ai) (Chinese LLM)
- Qwen (Alibaba, Chinese LLM)

### Other tooling
- Android banking trojan
- Screen overlay injection
- SMS interception

## Sources
- [BleepingComputer: New RatHat Android malware uses AI to automate device control](https://www.bleepingcomputer.com/news/security/new-rathat-android-malware-uses-ai-to-automate-device-control/)
