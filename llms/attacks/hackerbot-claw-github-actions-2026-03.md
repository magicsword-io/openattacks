# hackerbot-claw autonomous GitHub Actions exploitation

- ID: hackerbot-claw-github-actions-2026-03
- Reported: 2026-03-01
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/hackerbot-claw-github-actions-2026-03/

## Summary
Mar 1, 2026: StepSecurity discovered hackerbot-claw, autonomous agent exploiting misconfigured GitHub Actions workflows. Agent scans public repositories for insecure workflow patterns (untrusted input injection, secrets exposure, pull_request_target misuse), automatically submits exploits, harvests exposed secrets and GITHUB_TOKEN, pivots to other repositories accessible with stolen credentials. Fully autonomous: scans, exploits, collects, pivots without operator intervention. Attribution unknown.

## Category
adversary-use-of-ai

## Attribution
Unknown actor

- Actor: Unknown
- Country: Unknown
- Motivation: unknown
- Attributed by: StepSecurity
- Confidence: low

## AI involvement confidence
confirmed

## Attack flow
### scan: Scan public repositories (execution)

Agent scans for insecure GitHub Actions patterns

Evidence: <https://www.stepsecurity.io/blog/hackerbot-claw-github-actions-exploitation>

### exploit: Submit automated exploits (access)

Submit pull requests or trigger workflows to exploit untrusted input injection, secrets exposure

Evidence: <https://www.stepsecurity.io/blog/hackerbot-claw-github-actions-exploitation>

### harvest: Harvest secrets and tokens (impact)

Collect exposed secrets, GITHUB_TOKEN credentials

Evidence: <https://www.stepsecurity.io/blog/hackerbot-claw-github-actions-exploitation>

### pivot: Pivot to accessible repositories (execution)

Use stolen credentials to access and compromise additional repositories

Evidence: <https://www.stepsecurity.io/blog/hackerbot-claw-github-actions-exploitation>

### Connections

- scan -> exploit
- exploit -> harvest
- harvest -> pivot

## MITRE ATLAS
- [AML.T0040](https://atlas.mitre.org/techniques/AML.T0040) AI Model Inference API Access — Autonomous agent exploits GitHub Actions workflows to harvest secrets and pivot
  Evidence: <https://www.stepsecurity.io/blog/hackerbot-claw-github-actions-exploitation>

## Prevention
Secure GitHub Actions workflows; avoid untrusted input in run commands; use StepSecurity Harden Runner; rotate exposed secrets; restrict workflow permissions

## Detections
- [GitHub Self-Hosted Runner Suspicious Execution](https://github.com/SigmaHQ/sigma/blob/master/rules/windows/process_creation/proc_creation_win_github_self_hosted_runner.yml) (sigma) — Detects suspicious execution from GitHub self-hosted runners; relevant for hackerbot-claw exploiting GitHub Actions
- [GitHub Actions Workflow Modification Blocked](https://github.com/elastic/detection-rules/blob/main/rules/integrations/github/initial_access_github_actions_workflow_injection_blocked.toml) (elastic) — Detects GitHub Actions workflow injection attempts; directly applicable to hackerbot-claw exploitation
- GitHub Actions exploitation monitoring (guidance) — Monitor for automated pull requests with suspicious workflow triggers; alert on unexpected secret access or GITHUB_TOKEN usage; detect rapid workflow execution spikes

## Timeline
- First seen: 2026-03-01
- Last updated: 2026-11-05
- 2026-03-01 (StepSecurity): hackerbot-claw autonomous GitHub Actions exploitation disclosed

## Tools
### AI tooling and models
- Autonomous agent (model/framework unspecified)

### Other tooling
- [GitHub Actions](https://github.com/features/actions) exploitation
- Automated secret harvesting

## Sources
- [StepSecurity: hackerbot-claw Autonomous GitHub Actions Exploitation](https://www.stepsecurity.io/blog/hackerbot-claw-github-actions-exploitation)
