# Suspected MIDNIGHT NEPTUNE uses SynthID recruiter lures and Claude Code settings to deploy SOMBERMEME

- ID: gtig-midnight-neptune-claude-settings-2026-11
- Reported: 2026-11-16
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/gtig-midnight-neptune-claude-settings-2026-11/

## Summary
Google Threat Intelligence Group (Aurora Blum, Kelli Vanderlee, Jess Xia, and David Mainor, 16 November 2026) describes suspected MIDNIGHT NEPTUNE activity in the DPRK section of the quarterly tracker. In recent intrusions against cryptocurrency organizations in North America and Europe, the cluster used LLM-enabled social engineering and the victim organization's AI tools as an internal supply-chain vector. For access, the actor created fraudulent recruiter profiles on professional networking platforms. The profile images contained SynthID watermarks, which GTIG says confirms LLM-synthesized identities. The personas sent targets to fraudulent meeting platforms with ClickFix lures that asked them to run diagnostic fix scripts. GTIG calls those staging scripts likely LLM-authored. After the initial compromise, the actor changed .claude/settings.json in internal code repositories so that starting Claude Code downloaded the SOMBERMEME backdoor. The actor also created GitHub personal access tokens named after Microsoft Copilot. GTIG places this in a broader observation that DPRK operators use generative tools for scale and use native agent execution hooks for enterprise access. No IP addresses, hashes, domains, or public tool repository were published for this cluster.

## Category
adversary-use-of-ai

## Attribution
Suspected MIDNIGHT NEPTUNE. GTIG describes the activity under Democratic People's Republic of Korea threat actors. The cluster name and the country are both stated as suspected.

- Actor: Suspected MIDNIGHT NEPTUNE
- Country: North Korea
- Motivation: nation-state
- Attributed by: Google Threat Intelligence Group
- Confidence: medium

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Fraudulent recruiter profiles on professional networking platforms, then ClickFix lures on fraudulent meeting pages that ask the target to run a diagnostic fix script.
- Victims and sectors: Cryptocurrency organizations in North America and Europe. No organization is named.
- Regions: North America, Europe
- Region notes: North America and Europe are the target regions GTIG named. North Korea is the suspected actor country, not a victim region.
- Scale and metrics: GTIG says multiple intrusions over the course of 2026 used this combination, and describes recent intrusions against cryptocurrency organizations in North America and Europe. No victim count was published.

## Attack flow
### recruit: SynthID recruiter profiles (access)

Fraudulent recruiter profiles on professional networking platforms use images that carry SynthID watermarks.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/agentic-threat-activity-crosses-a-significant-threshold/>

### clickfix: ClickFix on a fake meeting page (execution)

The personas direct targets to fraudulent meeting platforms. ClickFix pages ask them to run diagnostic fix scripts that GTIG calls likely LLM-authored.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/agentic-threat-activity-crosses-a-significant-threshold/>

### settings: Claude Code settings.json is changed (ai)

In internal repositories, .claude/settings.json is modified so that launching Claude Code downloads SOMBERMEME.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/agentic-threat-activity-crosses-a-significant-threshold/>

### somber: Claude Code downloads SOMBERMEME (impact)

Starting Claude Code triggers the download of the SOMBERMEME backdoor.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/agentic-threat-activity-crosses-a-significant-threshold/>

### pats: GitHub PATs named after Copilot (execution)

The actor creates GitHub personal access tokens named after Microsoft Copilot.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/agentic-threat-activity-crosses-a-significant-threshold/>

### Connections

- recruit -> clickfix
- clickfix -> settings
- settings -> somber
- somber -> pats

## MITRE ATLAS
No ATLAS mapping is recorded.

## Prevention
Review professional-network recruiter approaches that lead to a meeting page and a pasted diagnostic script. Diff .claude/settings.json in internal repositories, and alert when a process rewrites a file under .claude/ before Claude Code starts a download. Review new GitHub personal access tokens, including tokens whose names refer to Microsoft Copilot. No SOMBERMEME hash or domain was published.

## Detections
- [Suspicious ClickFix/FileFix Execution Pattern](https://github.com/SigmaHQ/sigma/blob/master/rules/windows/process_creation/proc_creation_win_susp_clickfix_filefix_execution.yml) (sigma) — Matched ClickFix with security-detections-mcp. Windows process creation under explorer.exe for the Run-dialog or File Explorer paste pattern, often mshta.exe or powershell.exe. GTIG named ClickFix and diagnostic fix scripts. It did not publish the command or the operating system, so this rule applies only where that Windows paste path was used.
- [Unusual Process Modifying GenAI Configuration File](https://github.com/elastic/detection-rules/blob/main/rules/cross-platform/defense_evasion_genai_config_modification.toml) (elastic) — Matched settings.json and .claude with security-detections-mcp. A file modification under .claude/, which includes .claude/settings.json, by an unusual process. GTIG describes that file being changed in internal repositories. The rule sees a host file write, not the git commit by itself.
- [New GitHub Personal Access Token (PAT) Added](https://github.com/elastic/detection-rules/blob/main/rules/integrations/github/persistence_new_pat_created.toml) (elastic) — Matched personal access token with security-detections-mcp. GitHub audit creation of a PAT. GTIG says the tokens were named after Microsoft Copilot. The rule does not match on that name.
- No rule names SOMBERMEME or SynthID (guidance) — security-detections-mcp searches for SOMBERMEME, SynthID, and deepfake returned no Sigma, Splunk, or Elastic rule. SynthID is a watermark on the published profile images, not a host event. SOMBERMEME has no published hash or domain in this report to attach to a malware rule.

## Timeline
- Last updated: 2026-11-16
- 2026-11-16 (Google Threat Intelligence Group): GTIG describes suspected MIDNIGHT NEPTUNE intrusions against cryptocurrency organizations in North America and Europe, using SynthID recruiter images, likely LLM-authored ClickFix scripts, a .claude/settings.json change that makes Claude Code download SOMBERMEME, and GitHub PATs named after Microsoft Copilot.

## Tools
### AI tooling and models
- LLM image generation, evidenced by SynthID watermarks
- Likely LLM-authored ClickFix staging scripts
- [Claude Code](https://github.com/anthropics/claude-code), via .claude/settings.json

### Other tooling
- SOMBERMEME backdoor
- GitHub personal access tokens named after Microsoft Copilot

## Source notes
The cluster name, SynthID watermarks, ClickFix meeting pages, the likely LLM-authored scripts, the .claude/settings.json change, SOMBERMEME, the Copilot-named GitHub tokens, and the North America and Europe cryptocurrency targeting are from the 16 November 2026 GTIG tracker. Category is adversary-use-of-ai because the operator used generative models for the recruiter imagery and, GTIG says, likely for the staging scripts. The change to the victim's Claude Code settings is ai_role_secondary ai_agent_or_mcp_as_target. That split matches other entries that contain both an operator role and abuse of an AI tool, and the category order in scripts/import-notion.mjs. No frameworks value is set. GTIG did not name ARTEX, Cairn, PentAGI, or another offensive framework for this cluster, and did not publish a command line or a host platform for the ClickFix script.

## Sources
- [GTIG AI Threat Tracker: Agentic Threat Activity Crosses a Significant Threshold](https://cloud.google.com/blog/topics/threat-intelligence/agentic-threat-activity-crosses-a-significant-threshold/) — Google Threat Intelligence Group
