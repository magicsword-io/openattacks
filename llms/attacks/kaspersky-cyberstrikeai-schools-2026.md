# CyberStrikeAI attacks against schools in Africa and Latin America

- ID: kaspersky-cyberstrikeai-schools-2026
- Reported: 2026-11-04
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/kaspersky-cyberstrikeai-schools-2026/

## Summary
Financially motivated attacks against schools in Africa and Latin America used the open-source CyberStrikeAI implant. Initial access was through a compromised SQL Server. A C2-side LLM using MCP tools selected attack commands and achieved domain administrator privileges in three to four days. Techniques included a SystemUpdate scheduled task, certutil downloads, comsvcs.dll LSASS memory dumping, DCSync, and Golden Ticket generation.

## Category
uncategorized

## Attribution
Financially motivated; attribution otherwise unknown

## AI involvement confidence
not assessed

## Attack flow
### initial-access: SQL Server compromised (access)

Attacker gained initial access through compromised SQL Server

Evidence: <https://securelist.com/cyberstrikeai-attacks/121715/>

### implant: CyberStrikeAI implant deployed (ai)

Open-source CyberStrikeAI implant installed with C2 connection to fastcdn.bar and 185.186.245.144

Evidence: <https://securelist.com/cyberstrikeai-attacks/121715/>

### llm-decision: LLM selects attack commands (ai)

C2-side LLM using MCP tools autonomously chooses and executes attack techniques

Evidence: <https://securelist.com/cyberstrikeai-attacks/121715/>

### privilege-escalation: SystemUpdate task and credential dumping (execution)

SystemUpdate scheduled task created; certutil used for downloads; comsvcs.dll dumps LSASS memory

Evidence: <https://securelist.com/cyberstrikeai-attacks/121715/>

### domain-admin: Domain admin achieved via DCSync and Golden Ticket (impact)

DCSync extracts domain credentials; Golden Ticket generated for persistence; domain admin achieved in 3-4 days

Evidence: <https://securelist.com/cyberstrikeai-attacks/121715/>

### Connections

- initial-access -> implant
- implant -> llm-decision
- llm-decision -> privilege-escalation
- privilege-escalation -> domain-admin

## MITRE ATLAS
- [AML.T0016.002](https://atlas.mitre.org/techniques/AML.T0016.002) Generative AI — C2-side LLM with MCP tools autonomously executed attack operations
  Evidence: <https://securelist.com/cyberstrikeai-attacks/121715/>

## Prevention
Harden SQL Server; monitor for CyberStrikeAI indicators; detect SystemUpdate scheduled task creation; alert on certutil downloads; monitor comsvcs.dll LSASS dumps; detect DCSync activity; hunt for Golden Ticket use; block C2 infrastructure; review LOLBAS execution (certutil, comsvcs)

## Detections
No detections are recorded.

## Timeline
- First seen: 2026-10-01
- Last updated: 2026-11-05
- 2026-10-23 (Trend Micro): TrendAI reports CyberStrikeAI campaign by Chinese-language operators targeting Japan
- 2026-11-04 (Kaspersky): CyberStrikeAI attacks against schools in Africa and Latin America disclosed

## Tools
### AI tooling and models
- CyberStrikeAI (https://github.com/CyberStrikeAI/CyberStrikeAI)
- LLM-driven C2 with MCP tools

### Other tooling
- SystemUpdate scheduled task
- certutil (LOLBAS)
- comsvcs.dll LSASS dump (LOLBAS)
- DCSync
- Golden Ticket
- Compromised SQL Server

### MagicSword projects
- [LOLBAS](https://lolbas-project.github.io)

## Sources
- [CyberStrikeAI attacks](https://securelist.com/cyberstrikeai-attacks/121715/) — Kaspersky (Securelist)
