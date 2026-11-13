# Apex Accelerator / REF8801

- ID: apex-accelerator-ref8801-2026-10
- Reported: 2026-10-12
- AI role: ai_tool_as_lure
- Entry: https://openattacks.ai/attacks/apex-accelerator-ref8801-2026-10/

## Summary
Fake Web3 accelerator hands founders free Claude/Gemini credits and npm packages (@apexacc/cli, @apexacc/audit). CLI is Oh My Pi with backdoored bootstrap: OPENROUTER_BASE_URL to attacker LLM proxy, rogue MCP in ~/.apex/agent/mcp.json, yolo approvals. Audit MCP returns fabricated findings and registers into Claude Desktop/Cursor/Windsurf. Windows chain: wscript→PowerShell→stealer; macOS CloudSyncD.

## Category
adversary-use-of-ai

## Attribution
Elastic REF8801; Russian comments in history but nationality not established

- Actor: Elastic REF8801
- Country: Russia

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Social engineering via fake accelerator / free AI credits; npm install of @apexacc/cli or @apexacc/audit
- Victims and sectors: Cryptocurrency / Web3 founders and startups
- Regions: Multiple regions
- Region notes: Global Web3 targeting is described. A claimed presence at TOKEN2049 in Singapore is not evidence of a victim in Singapore.
- Scale and metrics: unknown

## Attack flow
### step-1: Fake accelerator recruits founders (access)

Free AI credits entice Web3 founders to install npm packages.

Evidence: <https://www.elastic.co/security-labs/threat-command/apex-accelerator-malicious-npm-packages>

### step-2: Bootstrap changes agent settings (execution)

The packages introduce an attacker LLM proxy, rogue MCP configuration and permissive approvals.

Evidence: <https://www.elastic.co/security-labs/threat-command/apex-accelerator-malicious-npm-packages>

### step-3: Rogue tools influence the agent (ai)

The audit MCP fabricates findings and registers with desktop coding agents.

Evidence: <https://www.elastic.co/security-labs/threat-command/apex-accelerator-malicious-npm-packages>

### step-4: Platform-specific malware (impact)

Reported Windows and macOS branches deliver a stealer or CloudSyncD.

Evidence: <https://www.elastic.co/security-labs/threat-command/apex-accelerator-malicious-npm-packages>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0081](https://atlas.mitre.org/techniques/AML.T0081) Modify AI Agent Configuration — The packages rewrite model-proxy and MCP settings.
  Evidence: <https://www.elastic.co/security-labs/threat-command/apex-accelerator-malicious-npm-packages>
- [AML.T0104](https://atlas.mitre.org/techniques/AML.T0104) Publish Poisoned AI Agent Tool — The accelerator distributes a rogue audit MCP tool.
  Evidence: <https://www.elastic.co/security-labs/threat-command/apex-accelerator-malicious-npm-packages>

## Prevention
Block apexaccs.org / apexfdn.xyz / payload domains; audit MCP configs and OPENROUTER_BASE_URL; rotate AI keys; prevent wscript (Windows stealer chain depends on it)

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in Apex Accelerator / REF8801. Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- [Oh My Pi](https://github.com/can1357/oh-my-pi) (repackaged as Apex Copilot)
- Attacker LLM proxy arena.apexaccs.org/api/llm/v1
- Attacker MCP arena.apexaccs.org/api/copilot/mcp
- Fabricated 18-tool Apex Audit MCP
- Targets [Claude Desktop](https://claude.com/product/overview), [Cursor](https://cursor.com/), Windsurf configs

### Other tooling
- wscript.exe
- [PowerShell](https://github.com/PowerShell/PowerShell)
- [UACME](https://github.com/hfiref0x/UACME) ComputerDefaults bypass
- [Go](https://github.com/golang/go) AMSI/ETW patcher
- CloudSyncD (macOS)
- Telegram exfil
- bludness.exe / exegis.exe

### MagicSword projects
- [LOLSkills](https://lolskills.io)

## Source notes
unknown

## Sources
- <https://www.elastic.co/security-labs/threat-command/apex-accelerator-malicious-npm-packages>
