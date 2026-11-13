# MCP Tool Poisoning Attacks (Invariant Labs)

- ID: invariant-mcp-tool-poisoning-2025-04
- Reported: 2025-04-01
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/invariant-mcp-tool-poisoning-2025-04/

## Summary
Malicious MCP tool descriptions hide instructions only the model sees (e.g., read ~/.ssh/id_rsa and mcp.json into sidenote params). Also demonstrated rug pulls (change description after approval) and cross-server shadowing that redirects trusted send_email tools to attacker addresses. Affects Cursor and other MCP clients.

## Category
attacks-on-ai

## Attribution
unknown

## AI involvement confidence
confirmed

## Attack flow
### step-1: A malicious MCP server is connected (access)

The user adds a server or trusts one that later changes.

Evidence: <https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks>

### step-2: Tool descriptions carry hidden instructions (ai)

Instructions are visible to the model and may shadow another server’s tools.

Evidence: <https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks>

### step-3: Agent reads files or redirects a tool (execution)

The demonstrations induce sensitive-file reads and manipulate email destinations.

Evidence: <https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks>

### step-4: Sensitive data is sent to the attacker (impact)

Tool arguments or redirected operations carry information across the trust boundary.

Evidence: <https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0051.001](https://atlas.mitre.org/techniques/AML.T0051.001) Indirect — Tool descriptions contain indirect model instructions.
  Evidence: <https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks>
- [AML.T0109](https://atlas.mitre.org/techniques/AML.T0109) AI Supply Chain Rug Pull — A trusted server can change its behavior after approval.
  Evidence: <https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks>
- [AML.T0086](https://atlas.mitre.org/techniques/AML.T0086) Exfiltration via AI Agent Tool Invocation — The demonstrations exfiltrate through tool arguments or redirected tools.
  Evidence: <https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks>

## Prevention
Show full tool descriptions; pin tool hashes; isolate MCP servers; least privilege

## Detections
No detections are recorded.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- MCP tool descriptions
- [Cursor](https://cursor.com/) and other MCP clients

### Other tooling
- unknown

### MagicSword projects
- [LOLSkills](https://lolskills.io)

## Sources
- <https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks>
