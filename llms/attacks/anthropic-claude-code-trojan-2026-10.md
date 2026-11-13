# Trojanized anthropic.claude-code Cursor extension

- ID: anthropic-claude-code-trojan-2026-10
- Reported: 2026-10-30
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/anthropic-claude-code-trojan-2026-10/

## Summary
Tampered anthropic.claude-code extension versions 2.1.312 and 2.1.313 served via Cursor marketplace install and auto-update on Oct 29 2026 from ~5:27 AM to 4:35 PM ET. Loader in extension.js collected hostname, username, environment variables matching secret patterns, added SSH key svc-telemetry to authorized_keys, established reverse SSH tunnel to tunnel@134.209.82.225, beaconed to :8099/beacon. Persistence via com.apple.sysmond LaunchAgent (macOS), @reboot cron (Linux), SysMon scheduled task (Windows). GitHub repo https://github.com/anthropics/anthropic-quickstarts compromised.

## Category
uncategorized

## Attribution
unknown

## AI involvement confidence
not assessed

## Scope and targeting
- Initial access: Supply-chain compromise of official Cursor marketplace extension via compromised GitHub repository
- Victims and sectors: Cursor IDE users who installed or auto-updated anthropic.claude-code extension during compromise window
- Regions: Multiple regions
- Region notes: Multiple regions reflects global Cursor user base; specific affected geography unknown
- Scale and metrics: Served Oct 29 2026 ~5:27 AM-4:35 PM ET via Cursor marketplace; exact victim count unknown

## Attack flow
### supply-chain: GitHub repository compromised (access)

Attacker gained access to anthropics/anthropic-quickstarts GitHub repository and pushed malicious extension versions 2.1.312 and 2.1.313

Evidence: <https://www.microsoft.com/en-us/security/blog/2026/10/30/inside-malicious-claude-code-branded-cursor-extension-persistent-ssh-backdoor/> <https://cursor.com/blog/claude-code-extension-security-notice>

### distribution: Malicious versions served via marketplace (ai)

Cursor marketplace distributed compromised extension via install and auto-update from Oct 29 5:27 AM to 4:35 PM ET

Evidence: <https://www.microsoft.com/en-us/security/blog/2026/10/30/inside-malicious-claude-code-branded-cursor-extension-persistent-ssh-backdoor/> <https://cursor.com/blog/claude-code-extension-security-notice>

### collection: Extension collects host information and secrets (execution)

Loader in extension.js collected hostname, username, environment variable names matching secret patterns

Evidence: <https://www.microsoft.com/en-us/security/blog/2026/10/30/inside-malicious-claude-code-branded-cursor-extension-persistent-ssh-backdoor/> <https://cursor.com/blog/claude-code-extension-security-notice>

### backdoor: SSH backdoor established (impact)

Added svc-telemetry SSH key to authorized_keys and established reverse SSH tunnel to tunnel@134.209.82.225 with beacon to :8099/beacon

Evidence: <https://www.microsoft.com/en-us/security/blog/2026/10/30/inside-malicious-claude-code-branded-cursor-extension-persistent-ssh-backdoor/> <https://cursor.com/blog/claude-code-extension-security-notice>

### persistence: Platform-specific persistence installed (impact)

com.apple.sysmond LaunchAgent (macOS), @reboot cron (Linux), SysMon scheduled task (Windows)

Evidence: <https://www.microsoft.com/en-us/security/blog/2026/10/30/inside-malicious-claude-code-branded-cursor-extension-persistent-ssh-backdoor/> <https://cursor.com/blog/claude-code-extension-security-notice>

### Connections

- supply-chain -> distribution
- distribution -> collection
- collection -> backdoor
- backdoor -> persistence

## MITRE ATLAS
- [AML.T0010.001](https://atlas.mitre.org/techniques/AML.T0010.001) AI Software — Attacker compromised an AI coding assistant extension in the official marketplace
  Evidence: <https://www.microsoft.com/en-us/security/blog/2026/10/30/inside-malicious-claude-code-branded-cursor-extension-persistent-ssh-backdoor/> <https://cursor.com/blog/claude-code-extension-security-notice>
- [AML.T0011](https://atlas.mitre.org/techniques/AML.T0011) User Execution — Extension established persistence through platform-specific mechanisms
  Evidence: <https://www.microsoft.com/en-us/security/blog/2026/10/30/inside-malicious-claude-code-branded-cursor-extension-persistent-ssh-backdoor/>
- [AML.T0055](https://atlas.mitre.org/techniques/AML.T0055) Unsecured Credentials — Malicious extension collected environment variables matching secret patterns
  Evidence: <https://www.microsoft.com/en-us/security/blog/2026/10/30/inside-malicious-claude-code-branded-cursor-extension-persistent-ssh-backdoor/>

## Prevention
Monitor extension integrity; review SSH authorized_keys; detect outbound SSH tunnels to suspicious IPs; scan for LaunchAgent/cron/@reboot persistence; review scheduled tasks; monitor environment variable access patterns

## Detections
No detections are recorded.

## Timeline
- First seen: 2026-10-29
- Last updated: 2026-11-05
- 2026-10-29 (Cursor, Microsoft): Trojanized anthropic.claude-code extension served via Cursor marketplace for ~11 hours
- 2026-10-30 (Microsoft): Microsoft Threat Intelligence analysis of persistent SSH backdoor published
- 2026-11-01 (OpenSourceMalware.com): Additional technical analysis of Claude Code trojan SSH backdoor persistence mechanisms

## Tools
### AI tooling and models
- [Cursor IDE](https://cursor.com/)
- anthropic.claude-code extension

### Other tooling
- Reverse SSH tunnel
- LaunchAgent persistence (macOS)
- Cron persistence (Linux)
- Scheduled task persistence (Windows)

## Source notes
Relevant detection rules:
- Sigma: Scheduled Task Creation Via Schtasks (https://github.com/SigmaHQ/sigma/blob/master/rules/windows/process_creation/proc_creation_win_schtasks_creation.yml)
- Sigma: Suspicious Cron File Created (https://github.com/SigmaHQ/sigma/blob/master/rules/linux/file_event/file_event_lnx_susp_cron_file_created.yml)
- Sigma: Persistence Via PlistBuddy (macOS LaunchAgent) (https://github.com/SigmaHQ/sigma/blob/master/rules/macos/process_creation/proc_creation_macos_persistence_via_plistbuddy.yml)
- Sigma: SSH Port Forwarding/Tunneling (https://github.com/SigmaHQ/sigma/blob/master/rules/windows/process_creation/proc_creation_win_ssh_port_forward.yml)
- Sigma: Suspicious SSH via OpenSSH Scheduled Task (https://github.com/SigmaHQ/sigma/blob/master/rules/windows/process_creation/proc_creation_win_schtasks_openssh_tunnelling.yml)

## Sources
- [Inside the malicious Claude Code-branded Cursor extension with persistent SSH backdoor](https://www.microsoft.com/en-us/security/blog/2026/10/30/inside-malicious-claude-code-branded-cursor-extension-persistent-ssh-backdoor/) — Microsoft
- [Security notice regarding Claude Code extension](https://cursor.com/blog/claude-code-extension-security-notice) — Cursor
- [Claude Code Trojan: Persistent SSH Backdoor Analysis](https://opensourcemalware.com/analysis/claude-code-trojan-persistent-ssh-backdoor) — OpenSourceMalware.com
