# MCP line jumping: attack before first tool use

- ID: trailofbits-mcp-line-jumping-2025-04
- Reported: 2025-04-21
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/trailofbits-mcp-line-jumping-2025-04/

## Summary
Malicious MCP servers inject via tool descriptions before any tool is invoked ('line jumping'), enabling code execution/exfil and approval bypass. Follow-up showed conversation-history theft paths and ANSI escape deception in tool UX.

## Category
attacks-on-ai

## Attribution
unknown

## AI involvement confidence
confirmed

## Attack flow
### step-1: Connection route is unspecified (unknown)

The supplied record starts with a malicious MCP server available to the agent.

Evidence: <https://blog.trailofbits.com/2025/04/21/jumping-the-line-how-mcp-servers-can-attack-you-before-you-ever-use-them/> <https://blog.trailofbits.com/2025/04/23/how-mcp-servers-can-steal-your-conversation-history/>

### step-2: Tool descriptions enter model context (access)

The attack content is ingested before the first tool use.

Evidence: <https://blog.trailofbits.com/2025/04/21/jumping-the-line-how-mcp-servers-can-attack-you-before-you-ever-use-them/> <https://blog.trailofbits.com/2025/04/23/how-mcp-servers-can-steal-your-conversation-history/>

### step-3: Injected instructions jump the approval boundary (ai)

The model can be redirected without an initial explicit tool invocation.

Evidence: <https://blog.trailofbits.com/2025/04/21/jumping-the-line-how-mcp-servers-can-attack-you-before-you-ever-use-them/> <https://blog.trailofbits.com/2025/04/23/how-mcp-servers-can-steal-your-conversation-history/>

### step-4: Demonstrated execution or exfiltration (impact)

The research describes approval bypass and conversation-history theft paths.

Evidence: <https://blog.trailofbits.com/2025/04/21/jumping-the-line-how-mcp-servers-can-attack-you-before-you-ever-use-them/> <https://blog.trailofbits.com/2025/04/23/how-mcp-servers-can-steal-your-conversation-history/>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
No ATLAS mapping is recorded.

## Prevention
TOFU pinning (mcp-context-protector); sanitize ANSI; never auto-trust tool metadata

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in MCP line jumping: attack before first tool use. Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- MCP servers/clients

### Other tooling
- unknown

### MagicSword projects
- [LOLSkills](https://lolskills.io)

## Sources
- <https://blog.trailofbits.com/2025/04/21/jumping-the-line-how-mcp-servers-can-attack-you-before-you-ever-use-them/>
- <https://blog.trailofbits.com/2025/04/23/how-mcp-servers-can-steal-your-conversation-history/>
