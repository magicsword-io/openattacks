# Aoki infostealer targets Claude Code, ChatGPT, Codex, Cursor tokens

- ID: symantec-aoki-infostealer-ai-2026-10
- Reported: 2026-10-15
- AI role: ai_credential_theft
- Entry: https://openattacks.ai/attacks/symantec-aoki-infostealer-ai-2026-10/

## Summary
Aoki (aka Aokigahara) infostealer added AI credential theft in 2026. Targets: .claude.json, Claude desktop cookies, ChatGPT cookies, Codex config.toml/.env (github.com/openai/codex-cli), GitHub Copilot tokens (github.com/features/copilot), Cursor state.vscdb/storage.json (github.com/getcursor/cursor), Gemini CLI, JetBrains AI Assistant, Kiro, Windsurf, Codeium (github.com/Exafunction/codeium.vim), AWS credentials/SSO, Amazon Q, Git credentials, SSH keys. Cursor local state caches chat/code. Stolen keys allow acting under developer identity/quota, expose repos/cloud/CI-CD, bypass safeguards. Capable of LLMjacking. Earlier 2026 versions didn't target AI; capability recently added/expanding. Detection: monitor AI credential file access (.claude.json, .codex/auth.json, Cursor globalStorage), C2 domains (dobeqnesmot.cc, hjazfioe.surf), API usage anomalies from unexpected geolocations.

## Category
uncategorized

## Attribution
Unknown; no links to existing families; new stealer first seen earlier 2026

## AI involvement confidence
not assessed

## Scope and targeting
- Initial access: Infostealer distribution (method not disclosed); likely traditional vectors
- Victims and sectors: Developers using AI coding assistants; scale not disclosed
- Regions: unknown
- Region notes: unknown
- Scale and metrics: Capability added 2026, expanding; no victim count

## Attack flow
### deploy: Deploy infostealer (access)

Aoki/Aokigahara deployed (distribution method not disclosed)

Evidence: <https://www.broadcom.com/support/security-center/protection-bulletin/aoki-infostealer-targets-ai-coding-assistant-credentials>

### ai-theft: AI credential harvesting (ai)

Steals .claude.json, Claude/ChatGPT cookies, Codex config, Copilot/Cursor/Gemini/JetBrains/Kiro/Windsurf/Codeium tokens, AWS creds, Git creds, SSH keys; Cursor state caches chat/code

Evidence: <https://www.broadcom.com/support/security-center/protection-bulletin/aoki-infostealer-targets-ai-coding-assistant-credentials> <https://research.checkpoint.com/2026/infostealer-riding-the-ai-train/>

### traditional: Traditional targets (execution)

Browsers, crypto wallets, password managers, messaging/gaming, VPN/FTP, email

Evidence: <https://www.security.com/threat-intelligence/aoki-infostealer-ai-targeting>

### exfil: C2 exfiltration (impact)

Sends data to C2 (dobeqnesmot.cc, hjazfioe.surf); no backdoor commands

Evidence: <https://www.security.com/threat-intelligence/aoki-infostealer-ai-targeting>

### abuse: Credential abuse (impact)

Stolen keys enable acting as developer, LLMjacking, accessing repos/cloud/CI-CD, resale

Evidence: <https://www.broadcom.com/support/security-center/protection-bulletin/aoki-infostealer-targets-ai-coding-assistant-credentials>

### Connections

- deploy -> ai-theft
- deploy -> traditional
- ai-theft -> exfil
- traditional -> exfil
- exfil -> abuse

## MITRE ATLAS
- [AML.T0055](https://atlas.mitre.org/techniques/AML.T0055) Unsecured Credentials — Credential theft targeting AI development tools and cloud credentials
  Evidence: <https://www.broadcom.com/support/security-center/protection-bulletin/aoki-infostealer-targets-ai-coding-assistant-credentials>

## Prevention
Rotate AI API keys after compromise; scope keys narrowly; monitor unusual API usage; endpoint protection; credential managers; monitor Aoki C2 domains; file integrity monitoring for AI credential files

## Detections
No detections are recorded.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- [Claude Code](https://github.com/anthropics/claude-code)
- [Claude Desktop](https://claude.com/product/overview)
- [ChatGPT](https://chatgpt.com/) Desktop
- OpenAI Codex
- [Cursor](https://cursor.com/)
- [GitHub Copilot](https://github.com/features/copilot)
- Google [Gemini CLI](https://github.com/google-gemini/gemini-cli)
- JetBrains AI Assistant
- Kiro IDE
- Windsurf
- Codeium
- Amazon Q

### Other tooling
- Aoki/Aokigahara infostealer
- AWS CLI/SSO
- Git
- SSH

## Source notes
OS not specified; other targets suggest Windows; macOS/Linux not confirmed. Detection guidance: monitor AI credential file access, C2 communication (dobeqnesmot.cc, hjazfioe.surf), API usage anomalies from unexpected locations, unauthorized reads of .claude.json, .codex/auth.json, Cursor globalStorage, .copilot/config.json, .gemini/config.json, .aws/credentials, SSH keys.

## Sources
- [Aoki: Infostealer Targets AI Coding Assistant Credentials](https://www.broadcom.com/support/security-center/protection-bulletin/aoki-infostealer-targets-ai-coding-assistant-credentials)
- [Symantec Aoki AI targeting](https://www.security.com/threat-intelligence/aoki-infostealer-ai-targeting)
- [Check Point: Infostealer riding the AI Train](https://research.checkpoint.com/2026/infostealer-riding-the-ai-train/)
