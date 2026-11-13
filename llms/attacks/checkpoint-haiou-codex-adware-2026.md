# Haiou prompt-adware in Codex jailbreak bundle

- ID: checkpoint-haiou-codex-adware-2026
- Reported: 2026-11-04
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/checkpoint-haiou-codex-adware-2026/

## Summary
GitHub repository haiou-666/haiou-codex promoted on Bilibili and QQ as Codex jailbreak bundle. Installation decrypts AES-GCM encrypted payload.pkg and installs global Codex instructions plus seagull-* skills that inject advertisements for zz.aiapi2025.top into agent responses. Malicious skills also prevent agent from testing or revealing the injected ads. Attack monetizes jailbreak distribution through forced API gateway advertising while appearing to provide free model access workarounds.

## Category
uncategorized

## Attribution
haiou-666 (GitHub username)

## AI involvement confidence
not assessed

## Scope and targeting
- Initial access: User downloads and installs haiou-codex jailbreak bundle from GitHub promoted on Chinese social platforms
- Victims and sectors: Codex users seeking jailbreak or free access, primarily Chinese-speaking users
- Regions: China, Asia
- Region notes: China and Asia reflect primary promotion on Bilibili and QQ; global Codex users potentially affected
- Scale and metrics: Promoted on Bilibili and QQ; repository stars and download count unknown

## Attack flow
### distribution: Jailbreak bundle promoted on social platforms (access)

haiou-666/haiou-codex GitHub repository promoted on Bilibili and QQ as Codex jailbreak solution

Evidence: <https://research.checkpoint.com/2026/free-the-model-sell-the-gateway-prompt-adware-hidden-in-jailbreak-bundles/>

### install: User installs encrypted payload (execution)

Installation process decrypts AES-GCM payload.pkg and installs to system

Evidence: <https://research.checkpoint.com/2026/free-the-model-sell-the-gateway-prompt-adware-hidden-in-jailbreak-bundles/>

### inject: Malicious instructions and skills installed (ai)

Global Codex instructions modified and seagull-* skills installed with ad injection logic

Evidence: <https://research.checkpoint.com/2026/free-the-model-sell-the-gateway-prompt-adware-hidden-in-jailbreak-bundles/>

### adware: Ads injected into agent responses (impact)

Agent responses include advertisements for zz.aiapi2025.top API gateway; skills prevent agent from testing or revealing ads

Evidence: <https://research.checkpoint.com/2026/free-the-model-sell-the-gateway-prompt-adware-hidden-in-jailbreak-bundles/>

### Connections

- distribution -> install
- install -> inject
- inject -> adware

## MITRE ATLAS
- [AML.T0054](https://atlas.mitre.org/techniques/AML.T0054) LLM Jailbreak — Malicious skills inject advertisements into agent responses
  Evidence: <https://research.checkpoint.com/2026/free-the-model-sell-the-gateway-prompt-adware-hidden-in-jailbreak-bundles/>
- [AML.T0081](https://atlas.mitre.org/techniques/AML.T0081) Modify AI Agent Configuration — Global instructions and skills contain malicious prompt injection to force ad display
  Evidence: <https://research.checkpoint.com/2026/free-the-model-sell-the-gateway-prompt-adware-hidden-in-jailbreak-bundles/>
- [AML.T0080](https://atlas.mitre.org/techniques/AML.T0080) AI Agent Context Poisoning — Skills manipulate agent output to include commercial advertisements
  Evidence: <https://research.checkpoint.com/2026/free-the-model-sell-the-gateway-prompt-adware-hidden-in-jailbreak-bundles/>
- [AML.T0010.001](https://atlas.mitre.org/techniques/AML.T0010.001) AI Software — Attacker distributes compromised agent configuration through fake jailbreak bundle
  Evidence: <https://research.checkpoint.com/2026/free-the-model-sell-the-gateway-prompt-adware-hidden-in-jailbreak-bundles/>

## Prevention
Review global Codex instructions for unauthorized modifications; scan installed skills for ad injection patterns; monitor agent responses for unexpected commercial content; verify instruction and skill sources; detect connections to suspicious API gateways; educate users about jailbreak bundle risks

## Detections
No detections are recorded.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- Codex
- Global Codex instructions
- Malicious skills (seagull-* series)

### Other tooling
- AES-GCM encrypted payload
- GitHub repository (haiou-666/haiou-codex)

### MagicSword projects
- [LOLSkills](https://lolskills.io)

## Source notes
Relevant detection rules:
- Monitor modifications to global Codex instructions
- Detect installation of unexpected skills (seagull-* naming pattern)
- Alert on connections to suspicious API gateways (zz.aiapi2025.top)
- Review skill content for ad injection patterns or output manipulation logic
- Note: No direct Sigma rules for agent skill poisoning; requires custom monitoring of agent configuration changes and skill installation events, plus network monitoring for unexpected API gateway connections.

## Sources
- [Free the Model, Sell the Gateway: Prompt Adware Hidden in Jailbreak Bundles](https://research.checkpoint.com/2026/free-the-model-sell-the-gateway-prompt-adware-hidden-in-jailbreak-bundles/) — Check Point Research
