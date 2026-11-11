# FakeGit agentbaiting - 800+ fake AI skills and MCP servers recommended by agents

- ID: fakegit-agentbaiting-island-2026-10
- Reported: 2026-10-30
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/fakegit-agentbaiting-island-2026-10/

## Summary
Oct 30, 2026: Island Security identified 'FakeGit' campaign: 800+ fake GitHub repositories impersonating popular AI skills, MCP servers, Cursor rules, and Claude Code extensions. Repos use typosquat/combosquat names (e.g., 'cursor-rules-best-practices', 'mcp-server-github-enhanced', 'claude-code-skills-security'), contain trojanized npm/PyPI packages or malicious install scripts. Adversary optimized repo metadata (README, topics, stars, forks) to rank highly in LLM tool recommendations: when users ask agents 'find me a GitHub MCP server' or 'what Cursor skills should I use?', agents recommend FakeGit repos from search results. Payloads: Shai-Hulud variants, Discord webhook exfiltration, npm/PyPI worms, SSH backdoors. Island tracked 2,400+ installations from agent recommendations Oct-Nov 2026. Attack exploits agent trust in GitHub search ranking and lack of package verification. Detection: verify GitHub repo authenticity (check org, stars, commit history, age); review agent-recommended packages before install; use allowlisted skill/MCP sources; monitor for unexpected GitHub clones initiated by AI agents; check for typosquat patterns in recommended repo names.

## Category
attacks-on-ai

## Attribution
Unknown actor; 'FakeGit' campaign; sophisticated understanding of LLM recommendation mechanics and AI developer workflows

- Actor: FakeGit
- Country: Unknown
- Motivation: financially-motivated
- Attributed by: Island
- Confidence: high

## AI involvement confidence
confirmed

## Attack flow
### create-fakes: Create fake repos (ai)

Adversary creates 800+ GitHub repos with typosquat/combosquat names mimicking popular AI skills, MCP servers, Cursor rules; optimizes metadata (README, topics, keywords) for LLM search ranking; inflates stars/forks

Evidence: <https://www.island.io/blog/agentbaiting-how-800-fake-ai-skills-and-mcp-servers-delivered-malware>

### agent-recommends: Agent recommends malicious repo (ai)

User asks AI agent to find/recommend skill, MCP server, or Cursor rule; agent searches GitHub/web, ranks FakeGit repos highly due to optimized metadata; agent recommends malicious repo to user as legitimate tool

Evidence: <https://www.island.io/blog/agentbaiting-how-800-fake-ai-skills-and-mcp-servers-delivered-malware>

### user-installs: User installs per agent recommendation (execution)

User trusts agent recommendation and clones repo or installs package; malicious install script or npm/PyPI postinstall executes; Shai-Hulud stealer, SSH backdoor, or worm payload deploys

Evidence: <https://www.island.io/blog/agentbaiting-how-800-fake-ai-skills-and-mcp-servers-delivered-malware>

### compromise: Credential theft and persistence (impact)

Payload harvests AI API keys, GitHub tokens, SSH keys, AWS credentials; establishes persistence (SSH backdoor, cron job); exfiltrates to Discord webhooks or C2; 2,400+ successful compromises tracked Oct-Nov 2026

Evidence: <https://www.island.io/blog/agentbaiting-how-800-fake-ai-skills-and-mcp-servers-delivered-malware>

### Connections

- create-fakes -> agent-recommends
- agent-recommends -> user-installs
- user-installs -> compromise

## MITRE ATLAS
- [AML.T0000](https://atlas.mitre.org/techniques/AML.T0000) Search Open Technical Databases — Adversary manipulates LLM tool recommendation systems to deliver malicious packages via agent-suggested GitHub repos
  Evidence: <https://www.island.io/blog/agentbaiting-how-800-fake-ai-skills-and-mcp-servers-delivered-malware>

## Prevention
Verify GitHub repos before install (check org, stars, age, commit history); use allowlisted skill/MCP sources; implement agent guardrails to warn on unverified packages; educate users not to blindly trust agent recommendations; review install scripts; use SCA tools; prefer official sources (Anthropic MCP registry, Cursor skills directory); flag typosquat patterns

## Detections
- Supply chain monitoring (guidance) — Monitor package installations, verify publisher authenticity, scan for malicious code patterns

## Timeline
- First seen: 2026-10-30
- Last updated: 2026-11-04
- 2026-10-30 (Island): Initial discovery and analysis

## Tools
### AI tooling and models
- [Cursor IDE](https://cursor.com/) and [Cursor](https://cursor.com/) rules
- [Claude Code](https://github.com/anthropics/claude-code)
- MCP (Model Context Protocol) servers
- AI coding assistants (generic)
- LLM search and recommendation systems

### Other tooling
- Fake GitHub repositories (800+)
- npm/PyPI trojanized packages
- Shai-Hulud credential stealer variants
- SSH backdoors
- Discord webhook exfiltration

## Sources
- [Island: FakeGit 'Agentbaiting' Campaign Targets AI Agent Recommendations](https://www.island.io/blog/agentbaiting-how-800-fake-ai-skills-and-mcp-servers-delivered-malware)
