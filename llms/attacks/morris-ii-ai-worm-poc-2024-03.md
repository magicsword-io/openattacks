# Morris II generative AI email worm (research PoC)

- ID: morris-ii-ai-worm-poc-2024-03
- Reported: 2024-03-01
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/morris-ii-ai-worm-poc-2024-03/

## Summary
Adversarial self-replicating prompts make GenAI email assistants propagate malicious instructions to other agents (zero-click in lab), with potential spam/exfil side effects. Tested against GPT-4, Gemini Pro, LLaVA in controlled setups.

Evidence qualification: Controlled research PoC against GenAI-powered email assistants; not observed in the wild.

## Category
attacks-on-ai

## Attribution
unknown

## AI involvement confidence
unverified

## Scope and targeting
- Initial access: unknown
- Victims and sectors: unknown
- Regions: unknown
- Region notes: unknown
- Scale and metrics: unknown

## Attack flow
### step-1: Research payload enters an email assistant (access)

The controlled experiment places adversarial content in assistant-readable email.

Evidence: <https://arxiv.org/abs/2403.02817> <https://www.wired.com/story/here-come-the-ai-worms/>

### step-2: Self-replicating instructions are processed (ai)

The model follows a prompt designed to reproduce itself.

Evidence: <https://arxiv.org/abs/2403.02817> <https://www.wired.com/story/here-come-the-ai-worms/>

### step-3: Assistant propagates the payload (execution)

Generated email carries the adversarial instructions to another assistant.

Evidence: <https://arxiv.org/abs/2403.02817> <https://www.wired.com/story/here-come-the-ai-worms/>

### step-4: Lab demonstrates propagation (impact)

Potential spam and data-exfiltration effects are research outcomes, not confirmed real-world victims.

Evidence: <https://arxiv.org/abs/2403.02817> <https://www.wired.com/story/here-come-the-ai-worms/>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0051.001](https://atlas.mitre.org/techniques/AML.T0051.001) Indirect — Email content injects instructions into assistants in a controlled experiment.
  Evidence: <https://arxiv.org/abs/2403.02817> <https://www.wired.com/story/here-come-the-ai-worms/>
- [AML.T0061](https://atlas.mitre.org/techniques/AML.T0061) LLM Prompt Self-Replication — The prompt is designed to replicate into assistant output.
  Evidence: <https://arxiv.org/abs/2403.02817> <https://www.wired.com/story/here-come-the-ai-worms/>

## Prevention
Treat retrieved email/content as untrusted; isolation between agent mailboxes

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in Morris II generative AI email worm (research PoC). Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- [ChatGPT-4](https://chatgpt.com/)
- [Gemini Pro](https://gemini.google.com/)
- [LLaVA](https://github.com/haotian-liu/LLaVA)
- RAG email assistants

### Other tooling
- unknown

## Source notes
unknown

## Sources
- <https://arxiv.org/abs/2403.02817>
- <https://www.wired.com/story/here-come-the-ai-worms/>
