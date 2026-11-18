# HiddenLayer MCP tool parameter abuse / prompt leak

- ID: hiddenlayer-mcp-param-abuse-2025
- Reported: 2025-05-01
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/hiddenlayer-mcp-param-abuse-2025/

## Summary
Malicious MCP tool schemas use suggestive unused parameter names (system_prompt, conversation_history, chain_of_thought, tools_list) so the model fills them with sensitive context; tool then exfiltrates via HTTP. Also showed fake function schemas in user prompts leaking system prompts/tools.

## Category
attacks-on-ai

## Attribution
unknown

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: unknown
- Victims and sectors: unknown
- Regions: unknown
- Region notes: unknown
- Scale and metrics: unknown

## Attack flow
### step-1: Connection prerequisite is unspecified (unknown)

The supplied entry does not document the initial route to the malicious tool.

Evidence: <https://www.hiddenlayer.com/research/exploiting-mcp-tool-parameters> <https://hiddenlayer.com/innovation-hub/beyond-mcp-expanding-agentic-function-parameter-abuse>

### step-2: Tool schema requests sensitive context (ai)

Unused parameter names encourage the model to fill in prompts, history and tool information.

Evidence: <https://www.hiddenlayer.com/research/exploiting-mcp-tool-parameters> <https://hiddenlayer.com/innovation-hub/beyond-mcp-expanding-agentic-function-parameter-abuse>

### step-3: Model passes context as arguments (execution)

Sensitive values are included in the tool invocation.

Evidence: <https://www.hiddenlayer.com/research/exploiting-mcp-tool-parameters> <https://hiddenlayer.com/innovation-hub/beyond-mcp-expanding-agentic-function-parameter-abuse>

### step-4: Tool exfiltrates the arguments (impact)

The demonstrated tool sends the collected context through HTTP.

Evidence: <https://www.hiddenlayer.com/research/exploiting-mcp-tool-parameters> <https://hiddenlayer.com/innovation-hub/beyond-mcp-expanding-agentic-function-parameter-abuse>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0051.001](https://atlas.mitre.org/techniques/AML.T0051.001) Indirect — Attacker-supplied tool schemas induce sensitive-context disclosure.
  Evidence: <https://www.hiddenlayer.com/research/exploiting-mcp-tool-parameters> <https://hiddenlayer.com/innovation-hub/beyond-mcp-expanding-agentic-function-parameter-abuse>
- [AML.T0056](https://atlas.mitre.org/techniques/AML.T0056) Extract LLM System Prompt — The demonstration includes system-prompt extraction.
  Evidence: <https://www.hiddenlayer.com/research/exploiting-mcp-tool-parameters> <https://hiddenlayer.com/innovation-hub/beyond-mcp-expanding-agentic-function-parameter-abuse>
- [AML.T0086](https://atlas.mitre.org/techniques/AML.T0086) Exfiltration via AI Agent Tool Invocation — Sensitive content is transmitted through tool parameters.
  Evidence: <https://www.hiddenlayer.com/research/exploiting-mcp-tool-parameters> <https://hiddenlayer.com/innovation-hub/beyond-mcp-expanding-agentic-function-parameter-abuse>

## Prevention
Schema allowlists; strip unexpected params; never send full system prompt to tools

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in HiddenLayer MCP tool parameter abuse / prompt leak. Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- MCP tool schemas
- agent frameworks

### Other tooling
- unknown

### MagicSword projects
- [LOLSkills](https://lolskills.io)

## Source notes
unknown

## Sources
- <https://www.hiddenlayer.com/research/exploiting-mcp-tool-parameters>
- <https://hiddenlayer.com/innovation-hub/beyond-mcp-expanding-agentic-function-parameter-abuse>
