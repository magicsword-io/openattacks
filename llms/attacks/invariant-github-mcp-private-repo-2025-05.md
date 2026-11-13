# GitHub MCP indirect prompt injection → private repo exfil

- ID: invariant-github-mcp-private-repo-2025-05
- Reported: 2025-05-26
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/invariant-github-mcp-private-repo-2025-05/

## Summary
Malicious GitHub issue content can indirectly prompt-inject an agent using the official GitHub MCP server. When a user asks the agent to inspect public issues, the agent can be coerced to read private repositories and leak contents via public PR/issue. Architectural trust issue (broad agent permissions + untrusted GitHub content), not a simple GitHub MCP code bug.

## Category
attacks-on-ai

## Attribution
unknown

## AI involvement confidence
confirmed

## Attack flow
### step-1: Agent reads an attacker issue (access)

A user asks an agent with GitHub MCP access to inspect public issues.

Evidence: <https://invariantlabs.ai/blog/mcp-github-vulnerability>

### step-2: Issue instructions override the task (ai)

Indirect prompt injection redirects the model through untrusted issue content.

Evidence: <https://invariantlabs.ai/blog/mcp-github-vulnerability>

### step-3: Agent accesses private repositories (execution)

Broad tool permissions let the agent retrieve private data.

Evidence: <https://invariantlabs.ai/blog/mcp-github-vulnerability>

### step-4: Private content becomes public (impact)

The demonstrated chain leaks content through a public pull request or issue.

Evidence: <https://invariantlabs.ai/blog/mcp-github-vulnerability>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0051.001](https://atlas.mitre.org/techniques/AML.T0051.001) Indirect — Public GitHub issue content indirectly injects the agent.
  Evidence: <https://invariantlabs.ai/blog/mcp-github-vulnerability>
- [AML.T0086](https://atlas.mitre.org/techniques/AML.T0086) Exfiltration via AI Agent Tool Invocation — GitHub write tools publish private repository content.
  Evidence: <https://invariantlabs.ai/blog/mcp-github-vulnerability>

## Prevention
Scope MCP tokens per-repo; block cross-repo actions; treat issues as untrusted input

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in GitHub MCP indirect prompt injection → private repo exfil. Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- [GitHub MCP server](https://github.com/github/github-mcp-server)
- coding agents

### Other tooling
- unknown

## Sources
- <https://invariantlabs.ai/blog/mcp-github-vulnerability>
