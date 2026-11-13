# Radware hidden prompt injection targeting GitHub maintainer bots

- ID: radware-github-prompt-injection-bots-2026-11
- Reported: 2026-11-05
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/radware-github-prompt-injection-bots-2026-11/

## Summary
Radware researchers Zvika Babo and Gabi Nakibly (Nov 5, 2026) document hidden prompt injection techniques targeting GitHub maintainer bots processing issues and pull requests. Attackers hide instructions in HTML comments, invisible Unicode characters, and CSS display tricks. Examples documented: (1) google-gemini/gemini-cli#28575 - deduplication agent told to use run_shell_command to write base64-encoded GITHUB_TOKEN into GITHUB_ENV; (2) openai/codex#16733 - labeler told to curl webhook.site and dump environment variables; (3) microsoft/agent-framework#7177 - fake triage gate with allow_triage=true, gate_result=pass markers; (4) blondesean/Kings_Herald#21 - hidden backdoor instruction in feature request. Attackers study bot tool names and output field formats to forge steering markers. Hidden instructions can bypass human review while manipulating bot behavior. Radware provides examples repository at github.com/rdwr-gabin/github-ipi-in-the-wild. No specific threat actor attribution; confirmed technique active in wild.

## Category
attacks-on-ai

## Attribution
Unattributed technique; confirmed active in wild with documented examples

- Actor: Unattributed technique
- Country: Unknown
- Motivation: unknown
- Attributed by: Radware
- Confidence: low

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Malicious GitHub issues or pull requests with hidden prompt injection
- Victims and sectors: GitHub repositories using AI-powered triage, review, and CI bots; examples include Google Gemini, OpenAI, Microsoft repositories
- Regions: Multiple regions
- Region notes: unknown
- Scale and metrics: Multiple confirmed examples across major repositories (Google, OpenAI, Microsoft); active Nov 2026

## Attack flow
### study-bots: Study bot tools and output formats (execution)

Attacker analyzes target repository bot behavior, tool names, and expected output field formats

Evidence: <https://www.radware.com/blog/prompt-injecting-coding-agents/>

### craft-injection: Craft hidden prompt injection (execution)

Embed instructions in HTML comments, invisible Unicode, or CSS-hidden elements

Evidence: <https://www.radware.com/blog/prompt-injecting-coding-agents/>

### submit-issue-pr: Submit malicious issue or PR (access)

Attacker creates GitHub issue or PR containing hidden instructions

Evidence: <https://www.radware.com/blog/prompt-injecting-coding-agents/>

### bot-processes: Bot processes issue/PR (ai)

Triage, review, or CI bot reads issue/PR including hidden injection

Evidence: <https://www.radware.com/blog/prompt-injecting-coding-agents/>

### execute-injection: Bot executes injected instructions (impact)

Bot writes GITHUB_TOKEN to env, curls webhook, or accepts fake triage gate

Evidence: <https://www.radware.com/blog/prompt-injecting-coding-agents/>

### Connections

- study-bots -> craft-injection
- craft-injection -> submit-issue-pr
- submit-issue-pr -> bot-processes
- bot-processes -> execute-injection

## MITRE ATLAS
- [AML.T0051](https://atlas.mitre.org/techniques/AML.T0051) LLM Prompt Injection — Hidden HTML comments, invisible Unicode, and CSS tricks inject instructions into GitHub bot processing
  Evidence: <https://www.radware.com/blog/prompt-injecting-coding-agents/>
- [AML.T0053](https://atlas.mitre.org/techniques/AML.T0053) AI Agent Tool Invocation — Bots manipulated to execute run_shell_command, curl webhooks, write GITHUB_TOKEN to environment
  Evidence: <https://www.radware.com/blog/prompt-injecting-coding-agents/>
- [AML.T0055](https://atlas.mitre.org/techniques/AML.T0055) Unsecured Credentials — Attackers study bot tool names/output fields to forge valid steering markers (allow_triage, gate_result)
  Evidence: <https://www.radware.com/blog/prompt-injecting-coding-agents/>

## Prevention
Strip HTML comments before bot processing; sanitize invisible Unicode from issues/PRs; validate bot tool output fields against expected schema; implement bot action approval gates; monitor for suspicious run_shell_command, curl webhook, environment variable access; restrict bot permissions to minimum required; log all bot actions for audit; educate maintainers on prompt injection risks; implement bot behavioral analysis

## Detections
- [Execution via GitHub Actions Runner](https://github.com/elastic/detection-rules/blob/main/rules/cross-platform/execution_via_github_actions_runner.toml) (elastic) — Detects malicious code execution via GitHub Actions bot manipulation
- [Tampering with RUNNER_TRACKING_ID in GitHub Actions Runners](https://github.com/elastic/detection-rules/blob/main/rules/cross-platform/execution_via_github_runner_with_runner_tracking_id_tampering_via_env_vars.toml) (elastic) — Detects GITHUB_ENV and GITHUB_TOKEN manipulation via bot prompt injection
- GitHub bot security controls (guidance) — Strip HTML comments before bot processing; sanitize invisible Unicode (U+200B, U+200C, U+200D, U+FEFF); detect CSS display:none in issues/PRs; monitor run_shell_command usage; alert on curl webhook.site from bots; restrict GITHUB_TOKEN write access

## Timeline
- First seen: 2026-10-01
- Last updated: 2026-11-05
- 2026-11-05 (Radware): Zvika Babo and Gabi Nakibly publish analysis of hidden prompt injection targeting GitHub maintainer bots; examples repository documents real-world cases from Google, OpenAI, Microsoft repositories

## Tools
### AI tooling and models
- GitHub triage bots
- GitHub review bots
- GitHub CI/CD automation bots
- Repository automation agents

### Other tooling
- HTML comments
- Invisible Unicode characters
- CSS display manipulation
- [webhook.site](https://github.com/webhooksite/webhook.site) exfiltration

## Source notes
Radware blog (Nov 5, 2026) primary source; examples repository github.com/rdwr-gabin/github-ipi-in-the-wild provides proof-of-concept demonstrations; links to hackerbot-claw-github-actions-2026-03 and forever-agents-md-hijack catalog entries for related GitHub AI agent attacks

## Sources
- [Radware: Prompt Injecting Coding Agents](https://www.radware.com/blog/prompt-injecting-coding-agents/) — Radware
- [Radware: GitHub IPI in the Wild - Examples Repository](https://github.com/rdwr-gabin/github-ipi-in-the-wild) — GitHub
