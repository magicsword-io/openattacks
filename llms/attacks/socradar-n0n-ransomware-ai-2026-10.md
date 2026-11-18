# n0n ransomware with OpenCode - 154 models including abliterated

- ID: socradar-n0n-ransomware-ai-2026-10
- Reported: 2026-10-28
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/socradar-n0n-ransomware-ai-2026-10/

## Summary
n0n ransomware operator exposed staging server at 185.157.161.148 with 1,719 files including 829 scripts, 5 C++ encryptor sources, and OpenCode AI coding agent environment. OpenCode configured with 154 model entries across 7 providers (Gemini, Mistral, Nemotron, Llama, Claude, GPT-5.x, Grok, Kimi, GLM, DeepSeek, MiniMax, Qwen) including uncensored and abliterated models (safety training removed) plus self-hosted model. Agent wrote and debugged hundreds of attack scripts; gateway spending $7,216 by Oct 22, 2026. Entry via credential stuffing (305 FortiGate SSL-VPN), exposed AWS keys, weak RDP/WinRM, compromised hosting portals. Hijacked Cisco Firepower Management Center to switch all policies to BLOCK. Human-directed operation supported by AI; no fully autonomous attack system. 93 listed victims, $283.7M total ransom demands.

## Category
uncategorized

## Attribution
n0n ransomware group; operations Sep 17 - Oct 22, 2026

## AI involvement confidence
not assessed

## Scope and targeting
- Initial access: Credential-only access: credential stuffing campaign against 305 FortiGate SSL-VPN devices, exposed AWS keys, weak RDP/WinRM credentials, compromised hosting management portals; no vulnerability exploitation found
- Victims and sectors: 23 organizations across 14 countries; 93 listed victims as of Oct 19, 2026
- Regions: Multiple regions
- Region notes: unknown
- Scale and metrics: Exposed workspace with 1,719 files (829 scripts, 5 encryptor sources); 154 model entries across 7 providers; $7,216 in AI gateway spending by Oct 22; 93 victims listed with $283.7M total ransom demands; 23 intrusion attempts across 14 countries

## Attack flow
### credential-access: Credential-only initial access (access)

Credential stuffing against 305 FortiGate SSL-VPN devices; exposed AWS keys; weak RDP/WinRM credentials; compromised hosting management portals; no vulnerability exploitation

Evidence: <https://socradar.io/blog/n0n-ransomware-ai-assisted-extortion/>

### ai-tooling: OpenCode with 154 models (ai)

Configured OpenCode coding agent with 154 model entries across 7 providers: Gemini, Mistral, Nemotron, Llama, Claude, GPT-5.x, Grok, Kimi, GLM, DeepSeek, MiniMax, Qwen; includes abliterated (safety training removed) and uncensored models plus self-hosted model; $7,216 gateway spending

Evidence: <https://socradar.io/blog/n0n-ransomware-ai-assisted-extortion/>

### script-generation: AI-generated attack scripts (execution)

OpenCode wrote and debugged hundreds of attack scripts; human-directed operation with AI support; agent kept encryption keys in memory file

Evidence: <https://socradar.io/blog/n0n-ransomware-ai-assisted-extortion/>

### fmc-hijack: Cisco FMC policy manipulation (impact)

Hijacked Cisco Firepower Management Center instances; switched all access policies to BLOCK; claimed widespread service disruption

Evidence: <https://socradar.io/blog/n0n-ransomware-ai-assisted-extortion/>

### ransomware: Encryption and extortion (impact)

Deployed n0n ransomware (5 C++ encryptor versions); stole and encrypted files; deleted data and backups; extortion; 93 victims listed with $283.7M total ransom demands

Evidence: <https://socradar.io/blog/n0n-ransomware-ai-assisted-extortion/>

### Connections

- credential-access -> ai-tooling
- ai-tooling -> script-generation
- script-generation -> fmc-hijack
- script-generation -> ransomware

## MITRE ATLAS
- [AML.T0016.002](https://atlas.mitre.org/techniques/AML.T0016.002) Generative AI — Operator uses OpenCode AI coding agent with 154 models to generate and debug attack scripts, demonstrating attacker use of AI for offensive operations
  Evidence: <https://socradar.io/blog/n0n-ransomware-ai-assisted-extortion/>

## Prevention
Strong credential policies; MFA for VPN/RDP/WinRM; AWS key rotation and monitoring; hosting portal security; Cisco FMC access control; monitor OpenCode/AI coding agent usage; gateway spending anomalies; exposed file servers

## Detections
No detections are recorded.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- [OpenCode](https://github.com/anomalyco/opencode) (open-source AI coding agent)
- [Gemini](https://gemini.google.com/)
- Mistral
- Nemotron
- Llama
- [Claude](https://claude.com/product/overview)
- GPT-5.x
- [Grok](https://x.ai/grok)
- Kimi
- GLM
- [DeepSeek](https://github.com/deepseek-ai)
- MiniMax
- Qwen
- Abliterated models (safety training removed)
- Uncensored models
- Self-hosted model

### Other tooling
- n0n ransomware encryptor (5 C++ versions)
- Credential stuffing tools
- Cisco Firepower Management Center (hijacked for policy manipulation)

## Source notes
SOCRadar STRU discovered exposed staging server in Sweden on port 8877; snapshots Sep 25-26, 2026; first documented criminal use of abliterated models; human-directed operation, not fully autonomous; SOCRadar access to blog post may be restricted (403 observed)

## Sources
- [n0n Ransomware: Inside an AI-Assisted Extortion Operation](https://socradar.io/blog/n0n-ransomware-ai-assisted-extortion/)
