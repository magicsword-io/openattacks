# C2Agent LLM-driven Windows implant

- ID: c2agent-unit42-2026-10
- Reported: 2026-10-09
- AI role: ai_infra_as_c2
- Entry: https://openattacks.ai/attacks/c2agent-unit42-2026-10/

## Summary
Go Windows implant where an LLM on the C2 side drives the host: operator sends a plain-language goal; implant builds a system prompt (tools, MCP, skills, memory), model returns one JSON tool call, agent executes and feeds TOOL RESULT back, loop until done (default 40 steps). Built-in MCP client defaults to Firecrawl public MCP; C2 can add MCP servers and markdown skill playbooks; skill_save lets the LLM propose new skills. From v2.3 can hand tasks to AI coding CLIs already on the host; v2.4 adds Cobalt Strike BOF loader and self-upgrade.

## Category
adversary-use-of-ai

## Attribution
unknown; 32 samples ~1 month active development

- Actor: unknown

## AI involvement confidence
confirmed

## Attack flow
### step-1: Stager downloads the implant (access)

The reported two-stage chain fetches a Windows PE; the original delivery route is unknown.

Evidence: <https://github.com/PaloAltoNetworks/Unit42-timely-threat-intel/blob/main/2026-10-09-C2Agent-malware.txt>

### step-2: LLM receives an operator goal (ai)

A system prompt describes available tools, MCP connections, skills and memory.

Evidence: <https://github.com/PaloAltoNetworks/Unit42-timely-threat-intel/blob/main/2026-10-09-C2Agent-malware.txt>

### step-3: Implant executes a tool call (execution)

The model returns a JSON tool call for the implant to execute.

Evidence: <https://github.com/PaloAltoNetworks/Unit42-timely-threat-intel/blob/main/2026-10-09-C2Agent-malware.txt>

### step-4: Tool results return to the model (ai)

Results feed the next decision in an iterative loop; later versions can delegate to installed AI CLIs.

Evidence: <https://github.com/PaloAltoNetworks/Unit42-timely-threat-intel/blob/main/2026-10-09-C2Agent-malware.txt>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4
- step-4 -> step-2 (Next decision) [loop]

## MITRE ATLAS
- [AML.T0102](https://atlas.mitre.org/techniques/AML.T0102) Generate Malicious Commands — An LLM returns tool calls in response to intrusion goals.
  Evidence: <https://github.com/PaloAltoNetworks/Unit42-timely-threat-intel/blob/main/2026-10-09-C2Agent-malware.txt>
- [AML.T0103](https://atlas.mitre.org/techniques/AML.T0103) Deploy AI Agent — The implant runs an AI agent with MCP and host-side tools.
  Evidence: <https://github.com/PaloAltoNetworks/Unit42-timely-threat-intel/blob/main/2026-10-09-C2Agent-malware.txt>

## Prevention
LOLSkills surface for skill/MCP abuse; hunt AI coding CLI handoff

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in C2Agent LLM-driven Windows implant. Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- LLM tool loop via C2 (proxied /llm/.../v1/chat/completions)
- MCP client (default [mcp.firecrawl.dev](https://github.com/firecrawl/firecrawl-mcp-server))
- Markdown skill playbooks from C2
- Host AI coding CLI handoff (v2.3+)
- aibox.x90.dev (v0 operator LLM endpoint only)

### Other tooling
- LOLBin templates (cred dump, shadow copies, free-space wipe)
- Process injection
- Native AD recon
- Exfil
- TCP pivot
- [Cobalt Strike](https://www.cobaltstrike.com/) BOFs (v2.4)
- Startup .lnk / Run key / onlogon task

### MagicSword projects
- [LOLSkills](https://lolskills.io)

## Sources
- <https://github.com/PaloAltoNetworks/Unit42-timely-threat-intel/blob/main/2026-10-09-C2Agent-malware.txt>
