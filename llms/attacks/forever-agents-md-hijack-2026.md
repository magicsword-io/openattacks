# Malicious AGENTS.md hijacking coding agents via Downloads

- ID: forever-agents-md-hijack-2026
- Reported: 2026-11-04
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/forever-agents-md-hijack-2026/

## Summary
Malicious AGENTS.md file dropped into ~/Downloads by website. When coding agent launches in Downloads directory, it reads and follows the malicious instructions. AGENTS.md variant edits ~/.codex/config.toml and runs npm install function-color (MALFEX downloader). CLAUDE.md variant steals OAuth tokens. Attack leverages agent instruction file priority and common workflow of developers launching agents in Downloads after downloading code samples or projects.

## Category
uncategorized

## Attribution
unknown

## AI involvement confidence
not assessed

## Attack flow
### drop: Malicious instruction file dropped to Downloads (access)

Website drops AGENTS.md or CLAUDE.md into ~/Downloads folder

Evidence: <https://forever.security/blog/hijacking-ai-agents-via-downloads-folder/>

### launch: Developer launches agent in Downloads (ai)

User starts coding agent in Downloads directory following common workflow for testing downloaded projects

Evidence: <https://forever.security/blog/hijacking-ai-agents-via-downloads-folder/>

### read: Agent reads malicious instruction file (ai)

Agent discovers and loads AGENTS.md or CLAUDE.md based on instruction file precedence

Evidence: <https://forever.security/blog/hijacking-ai-agents-via-downloads-folder/>

### execute: Malicious instructions executed (execution)

AGENTS.md variant edits ~/.codex/config.toml and runs npm install function-color; CLAUDE.md variant steals OAuth token

Evidence: <https://forever.security/blog/hijacking-ai-agents-via-downloads-folder/>

### impact: Malware installed or credentials stolen (impact)

function-color MALFEX downloader installed or OAuth tokens exfiltrated

Evidence: <https://forever.security/blog/hijacking-ai-agents-via-downloads-folder/>

### Connections

- drop -> launch
- launch -> read
- read -> execute
- execute -> impact

## MITRE ATLAS
- [AML.T0051.001](https://atlas.mitre.org/techniques/AML.T0051.001) Indirect — Malicious instruction file manipulates agent behavior by exploiting instruction file loading priority
  Evidence: <https://forever.security/blog/hijacking-ai-agents-via-downloads-folder/>
- [AML.T0081](https://atlas.mitre.org/techniques/AML.T0081) Modify AI Agent Configuration — AGENTS.md contains malicious instructions that modify agent configuration and install malware
  Evidence: <https://forever.security/blog/hijacking-ai-agents-via-downloads-folder/>
- [AML.T0053](https://atlas.mitre.org/techniques/AML.T0053) AI Agent Tool Invocation — Attack exfiltrates OAuth tokens via CLAUDE.md variant
  Evidence: <https://forever.security/blog/hijacking-ai-agents-via-downloads-folder/>
- [AML.T0011.001](https://atlas.mitre.org/techniques/AML.T0011.001) Malicious Package — Malicious instructions modify agent configuration files for persistence
  Evidence: <https://forever.security/blog/hijacking-ai-agents-via-downloads-folder/>

## Prevention
Review Downloads folder before launching agents; scan for unexpected .md instruction files; monitor ~/.codex/config.toml and other agent config modifications; detect npm install from unusual locations; restrict agent instruction file precedence; alert on OAuth token access from unexpected processes

## Detections
No detections are recorded.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- Coding agents (Codex, [Claude](https://claude.com/product/overview), others)
- Agent instruction files (AGENTS.md, CLAUDE.md)
- ~/.codex/config.toml

### Other tooling
- function-color npm package (MALFEX downloader)
- OAuth token theft

### MagicSword projects
- [LOLSkills](https://lolskills.io)

## Sources
- [Hijacking AI Agents via Downloads Folder](https://forever.security/blog/hijacking-ai-agents-via-downloads-folder/) — Forever Security
