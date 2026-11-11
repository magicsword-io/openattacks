# Skynet autonomous agent hunts exposed LLM/MCP endpoints for 100K steps

- ID: symantec-skynet-llmjacking-2026-10
- Reported: 2026-10-21
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/symantec-skynet-llmjacking-2026-10/

## Summary
Autonomous offensive agent hunts exposed LLM endpoints (OpenAI-compatible APIs, self-hosted models, AI gateways, MCP servers) without authentication or with stolen keys. Wraps jailbreak around ~74 offensive tools, instructs model to ignore safety controls and treat credential theft as routine development. 'Skynet mode' authorizes 100,000 unattended steps without human approval. Scans for targets (VS Code servers, Django, Jupyter, Laravel, Supabase, Prisma Studio), exploits web frameworks, steals databases/credentials, quietly deploys XMRig miners (github.com/xmrig/xmrig) under /tmp/.x and go2rtc camera paths. Symantec AI honeypot captured full working prompt summer 2026; 127,000+ external requests from tens of thousands of addresses, dominated by endpoint reconnaissance, API key spraying, exposed config probing.

## Category
uncategorized

## Attribution
unknown

## AI involvement confidence
not assessed

## Attack flow
### hunt-endpoints: Hunt exposed LLM/MCP endpoints (access)

Scans internet for exposed LLM endpoints without authentication (OpenAI-compatible APIs, self-hosted models, AI gateways, MCP servers); Symantec honeypot recorded 127,000+ requests from tens of thousands of addresses

Evidence: <https://www.broadcom.com/support/security-center/protection-bulletin/autonomous-llmjacking-skynet-agent-hijacks-exposed-ai-models-to-run-attacks>

### jailbreak: Jailbreak with offensive tools (ai)

Wraps ~74 offensive tools in jailbreak prompt; tells model to ignore safety controls, treat credential theft as routine development; 'Skynet mode' authorizes 100,000 unattended steps without human approval

Evidence: <https://www.broadcom.com/support/security-center/protection-bulletin/autonomous-llmjacking-skynet-agent-hijacks-exposed-ai-models-to-run-attacks>

### exploit-frameworks: Exploit web frameworks (execution)

Scans for and exploits VS Code servers, Django, Jupyter, Laravel, Supabase, Prisma Studio; steals databases and credentials

Evidence: <https://www.broadcom.com/support/security-center/protection-bulletin/autonomous-llmjacking-skynet-agent-hijacks-exposed-ai-models-to-run-attacks>

### deploy-miner: Deploy XMRig miners (impact)

Quietly installs XMRig cryptocurrency miners under /tmp/.x and go2rtc camera paths; verifies miners running; victim pays for hijacked LLM compute while servers stripped of data

Evidence: <https://www.broadcom.com/support/security-center/protection-bulletin/autonomous-llmjacking-skynet-agent-hijacks-exposed-ai-models-to-run-attacks>

### Connections

- hunt-endpoints -> jailbreak
- jailbreak -> exploit-frameworks
- exploit-frameworks -> deploy-miner
- deploy-miner -> hunt-endpoints [loop]

## MITRE ATLAS
- [AML.T0034](https://atlas.mitre.org/techniques/AML.T0034) Cost Harvesting — Exploitation of exposed LLM/MCP endpoints for infrastructure hijacking
  Evidence: <https://www.broadcom.com/support/security-center/protection-bulletin/autonomous-llmjacking-skynet-agent-hijacks-exposed-ai-models-to-run-attacks>
- [AML.T0012](https://atlas.mitre.org/techniques/AML.T0012) Valid Accounts — LLMjacking - hijacking exposed AI models to power autonomous cybercrime operations
  Evidence: <https://www.broadcom.com/support/security-center/protection-bulletin/autonomous-llmjacking-skynet-agent-hijacks-exposed-ai-models-to-run-attacks>

## Prevention
Never expose LLM APIs/MCP endpoints without authentication; require auth on all paths including health checks; place behind gateway; rotate AI API keys; scope keys narrowly; monitor unusual inference volume/spend; restrict outbound network from AI tools; IMDSv2 with hop limit 1; least privilege for agents; human approval for sensitive actions; keep exploited software patched; block mining pools and known miner hashes

## Detections
No detections are recorded.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- Exposed LLM endpoints (OpenAI-compatible)
- Self-hosted model servers
- AI gateways
- Model Context Protocol (MCP) servers

### Other tooling
- ~74 offensive tools (wrapped in jailbreak prompt)
- XMRig cryptocurrency miner
- go2rtc camera directory paths
- [VS Code](https://github.com/microsoft/vscode) servers
- Django
- Jupyter
- Laravel
- Supabase
- Prisma Studio

## Sources
- [Autonomous LLMjacking: 'Skynet' Agent Hijacks Exposed AI Models](https://www.broadcom.com/support/security-center/protection-bulletin/autonomous-llmjacking-skynet-agent-hijacks-exposed-ai-models-to-run-attacks)
- [Symantec Skynet LLMjacking autonomous agent](https://www.security.com/threat-intelligence/ai-llmjacking-skynet)
