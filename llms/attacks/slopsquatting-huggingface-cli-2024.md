# Slopsquatting: hallucinated huggingface-cli package downloads

- ID: slopsquatting-huggingface-cli-2024
- Reported: 2024-06-14
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/slopsquatting-huggingface-cli-2024/

## Summary
Attackers register package names that code-generating LLMs hallucinate. Researchers registered hallucinated PyPI name huggingface-cli and observed tens of thousands of downloads (including reported Alibaba adoption). Broader study: 5.2%/21.7% hallucination rates commercial vs open-source models.

## Category
attacks-on-ai

## Attribution
unknown

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Developer installs LLM-suggested nonexistent package that attacker registered
- Victims and sectors: unknown
- Regions: unknown
- Region notes: unknown
- Scale and metrics: huggingface-cli >30,000 downloads cited; 205,474 unique fake names in study corpus

## Attack flow
### step-1: Code model hallucinates a package (ai)

An assistant recommends a package name that was not a legitimate dependency.

Evidence: <https://www.lasso.security/blog/ai-package-hallucinations> <https://arxiv.org/abs/2406.10279> <https://www.aikido.dev/blog/slopsquatting-ai-package-hallucination-attacks>

### step-2: An adversary can register that name (access)

The slopsquatting pattern makes the hallucinated name installable.

Evidence: <https://www.lasso.security/blog/ai-package-hallucinations> <https://arxiv.org/abs/2406.10279> <https://www.aikido.dev/blog/slopsquatting-ai-package-hallucination-attacks>

### step-3: Developer installs the suggested package (execution)

The research registered huggingface-cli and measured downloads.

Evidence: <https://www.lasso.security/blog/ai-package-hallucinations> <https://arxiv.org/abs/2406.10279> <https://www.aikido.dev/blog/slopsquatting-ai-package-hallucination-attacks>

### step-4: Downloads do not prove compromise (unknown)

The experiment measures exposure; the registered research package does not establish a malicious payload on every user.

Evidence: <https://www.lasso.security/blog/ai-package-hallucinations> <https://arxiv.org/abs/2406.10279> <https://www.aikido.dev/blog/slopsquatting-ai-package-hallucination-attacks>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0060](https://atlas.mitre.org/techniques/AML.T0060) Publish Hallucinated Entities — An installable entity is registered using a package name hallucinated by models.
  Evidence: <https://www.lasso.security/blog/ai-package-hallucinations> <https://arxiv.org/abs/2406.10279> <https://www.aikido.dev/blog/slopsquatting-ai-package-hallucination-attacks>
- [AML.T0062](https://atlas.mitre.org/techniques/AML.T0062) Discover LLM Hallucinations — Research identifies package hallucinations that create the exposure.
  Evidence: <https://www.lasso.security/blog/ai-package-hallucinations> <https://arxiv.org/abs/2406.10279> <https://www.aikido.dev/blog/slopsquatting-ai-package-hallucination-attacks>

## Prevention
Pin packages; verify registry names against official docs; SCA on AI-suggested deps

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in Slopsquatting: hallucinated huggingface-cli package downloads. Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- Code-generating LLMs

### Other tooling
- PyPI/npm typosquat registration

## Source notes
unknown

## Sources
- <https://www.lasso.security/blog/ai-package-hallucinations>
- <https://arxiv.org/abs/2406.10279>
- <https://www.aikido.dev/blog/slopsquatting-ai-package-hallucination-attacks>
