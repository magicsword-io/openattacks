# AgentCorruption (AWS Bedrock AgentCore IMDS)

- ID: agentcorruption-bedrock-2026-10
- Reported: 2026-10-08
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/agentcorruption-bedrock-2026-10/

## Summary
Chat prompt to public AgentCore agent abused tools that could HTTP/shell to IMDS 169.254.169.254, stealing execution-role credentials. Default role was region-wide across AgentCore: invoke other agents, read conversations/memories, pull images, Secrets Manager / AgentCore Identity, plant persistent memory hijacks. AWS tightened IMDSv2 defaults and narrowed default role.

## Category
attacks-on-ai

## Attribution
Vulnerability research (Zenity at SecTor)

- Actor: Vulnerability research (Zenity at SecTor)

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Prompt injection / SSRF via agent tools against exposed AgentCore agent
- Victims and sectors: Organizations deploying AgentCore agents (research disclosure; patched)
- Regions: unknown
- Region notes: unknown
- Scale and metrics: Single prompt to one agent → account/region AgentCore blast radius (pre-fix)

## Attack flow
### step-1: Public agent receives a prompt (access)

An exposed AWS AgentCore agent accepts attacker input.

Evidence: <https://labs.zenity.io/post/agentcorruption-how-a-single-prompt-collapsed-the-entire-cloud-security-model>

### step-2: Agent tools reach metadata (ai)

Prompt injection abuses HTTP or shell tools to query the instance metadata service.

Evidence: <https://labs.zenity.io/post/agentcorruption-how-a-single-prompt-collapsed-the-entire-cloud-security-model>

### step-3: Execution credentials are exposed (execution)

The response discloses the agent execution-role credentials.

Evidence: <https://labs.zenity.io/post/agentcorruption-how-a-single-prompt-collapsed-the-entire-cloud-security-model>

### step-4: Broader agent access (impact)

The role can reach other agents, memories and connected services; persistent memory hijacks are described.

Evidence: <https://labs.zenity.io/post/agentcorruption-how-a-single-prompt-collapsed-the-entire-cloud-security-model>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0051.000](https://atlas.mitre.org/techniques/AML.T0051.000) Direct — A prompt sent directly to the public agent redirects its tool use.
  Evidence: <https://labs.zenity.io/post/agentcorruption-how-a-single-prompt-collapsed-the-entire-cloud-security-model>
- [AML.T0055](https://atlas.mitre.org/techniques/AML.T0055) Unsecured Credentials — The metadata response exposes execution-role credentials.
  Evidence: <https://labs.zenity.io/post/agentcorruption-how-a-single-prompt-collapsed-the-entire-cloud-security-model>
- [AML.T0080.000](https://atlas.mitre.org/techniques/AML.T0080.000) Memory — The source describes persistent memory hijacks.
  Evidence: <https://labs.zenity.io/post/agentcorruption-how-a-single-prompt-collapsed-the-entire-cloud-security-model>

## Prevention
Least-privilege agent IAM; IMDSv2; agent's role is its blast radius

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in AgentCorruption (AWS Bedrock AgentCore IMDS). Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- [AWS Bedrock AgentCore](https://aws.amazon.com/bedrock/agentcore/)

### Other tooling
- IMDS / IMDSv2
- [AWS Secrets Manager](https://aws.amazon.com/secrets-manager/)
- [ECR](https://aws.amazon.com/ecr/)

## Source notes
unknown

## Sources
- <https://labs.zenity.io/post/agentcorruption-how-a-single-prompt-collapsed-the-entire-cloud-security-model>
