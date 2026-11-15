# Trojanized anthropic.claude-code Cursor extension

- ID: anthropic-claude-code-trojan-2026-10
- Reported: 2026-10-30
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/anthropic-claude-code-trojan-2026-10/

## Summary
Cursor's Nov 13, 2026 update says the attacker obtained an access key Cursor had issued to Fireworks. Fireworks exposed that key. The attacker copied a read-only bucket used to share data with Fireworks. The bucket held limited coding-agent traces, mostly from 2025, from sessions that were not in Privacy Mode and were permitted for training. A small number of traces had unredacted credentials. Less than 0.01% of customers had API credentials exposed. From those credentials the attacker reached select SaaS tools, then select archived non-production Cursor repositories, limited customer-support data and email, product usage metrics and contact details, summaries of some coding-agent conversations, and credentials users had sent to support. On Oct 29, using a stolen credential, the attacker placed malicious unauthorized copies of Anthropic's Claude Code extension on the cache used to serve the Cursor VS Code extension marketplace. Anthropic did not publish this copy. It was not a vulnerability in Anthropic's product. Open VSX never had the malware. At most 5,000 users who requested specific cached versions that day potentially received it. The copies were available for about 11 hours. The marketplace was taken offline, and a hosting provider took down the attacker's server. The last attacker activity Cursor saw was Nov 1, and it was blocked. Traces were exposed for fewer than 0.05% of non-Privacy-Mode users, who were notified. Privacy Mode prompts and code were not affected. Microsoft's Oct 30 analysis of the copies that were served, anthropic.claude-code 2.1.312 and 2.1.313, describes a loader in extension.js that collected hostname, username, and environment variables matching secret patterns, added SSH key svc-telemetry to authorized_keys, opened a reverse SSH tunnel to tunnel@134.209.82.225, and beaconed to :8099/beacon. Persistence was a com.apple.sysmond LaunchAgent on macOS, an @reboot cron job on Linux, and a SysMon scheduled task on Windows. The marketplace window Microsoft and Cursor's earlier notice described was Oct 29, about 5:27 AM to 4:35 PM ET.

## Category
attacks-on-ai

## Attribution
Unnamed. Cursor published the Fireworks-key root cause on Nov 13, 2026. No country is stated.

- Actor: unknown
- Motivation: unknown
- Attributed by: Cursor
- Confidence: low

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Stolen access key that Cursor had issued to Fireworks, then a stolen credential used to place unauthorized Claude Code extension copies on the Cursor marketplace cache. Open VSX did not carry the malware.
- Victims and sectors: Cursor users who requested the specific cached extension versions on Oct 29, and customers whose non-Privacy-Mode traces or support credentials were in the copied bucket. Production systems and customer code repositories were not described as affected.
- Regions: Multiple regions
- Region notes: Multiple regions reflects the global Cursor user base. Cursor did not name affected countries.
- Scale and metrics: At most 5,000 users potentially received the cached copies, which were available for about 11 hours. API credentials were exposed for less than 0.01% of customers. Traces were exposed for fewer than 0.05% of non-Privacy-Mode users. Tampered versions were anthropic.claude-code 2.1.312 and 2.1.313.

## Attack flow
### fireworks-key: Exposed Fireworks access key (access)

The attacker used an access key Cursor had issued to Fireworks and copied a read-only bucket of coding-agent traces. A small number of traces contained credentials.

Evidence: <https://cursor.com/blog/security-incident-update>

### supply-chain: Malicious copies placed on the marketplace cache (access)

On Oct 29 a stolen credential was used to place unauthorized copies of Anthropic's Claude Code extension, versions 2.1.312 and 2.1.313, on the cache Cursor used for its marketplace. Open VSX did not have them.

Evidence: <https://cursor.com/blog/security-incident-update>

### distribution: Cached versions served for about 11 hours (ai)

At most 5,000 users who requested those cached versions could receive them. Cursor's earlier notice placed the marketplace window at about 5:27 AM to 4:35 PM ET.

Evidence: <https://cursor.com/blog/security-incident-update> <https://cursor.com/blog/claude-code-extension-security-notice>

### collection: Extension collects host information and secrets (execution)

Loader in extension.js collected hostname, username, environment variable names matching secret patterns

Evidence: <https://www.microsoft.com/en-us/security/blog/2026/10/30/inside-malicious-claude-code-branded-cursor-extension-persistent-ssh-backdoor/>

### backdoor: SSH backdoor established (impact)

Added svc-telemetry SSH key to authorized_keys and established reverse SSH tunnel to tunnel@134.209.82.225 with beacon to :8099/beacon

Evidence: <https://www.microsoft.com/en-us/security/blog/2026/10/30/inside-malicious-claude-code-branded-cursor-extension-persistent-ssh-backdoor/>

### persistence: Platform-specific persistence installed (impact)

com.apple.sysmond LaunchAgent (macOS), @reboot cron (Linux), SysMon scheduled task (Windows)

Evidence: <https://www.microsoft.com/en-us/security/blog/2026/10/30/inside-malicious-claude-code-branded-cursor-extension-persistent-ssh-backdoor/>

### Connections

- fireworks-key -> supply-chain
- supply-chain -> distribution
- distribution -> collection
- collection -> backdoor
- backdoor -> persistence

## MITRE ATLAS
- [AML.T0010.001](https://atlas.mitre.org/techniques/AML.T0010.001) AI Software — Unauthorized copies of an AI coding extension were placed on the cache that served Cursor's marketplace. Anthropic did not publish them.
  Evidence: <https://cursor.com/blog/security-incident-update> <https://www.microsoft.com/en-us/security/blog/2026/10/30/inside-malicious-claude-code-branded-cursor-extension-persistent-ssh-backdoor/>
- [AML.T0011](https://atlas.mitre.org/techniques/AML.T0011) User Execution — Extension established persistence through platform-specific mechanisms
  Evidence: <https://www.microsoft.com/en-us/security/blog/2026/10/30/inside-malicious-claude-code-branded-cursor-extension-persistent-ssh-backdoor/>
- [AML.T0055](https://atlas.mitre.org/techniques/AML.T0055) Unsecured Credentials — The copied bucket included traces with unredacted credentials, and the extension collected environment variables matching secret patterns
  Evidence: <https://cursor.com/blog/security-incident-update> <https://www.microsoft.com/en-us/security/blog/2026/10/30/inside-malicious-claude-code-branded-cursor-extension-persistent-ssh-backdoor/>

## Prevention
Rotate credentials that were in coding-agent traces or sent to support if Cursor notified the account. Review SSH authorized_keys for svc-telemetry, outbound SSH to 134.209.82.225, LaunchAgent com.apple.sysmond, @reboot cron, and a SysMon scheduled task. Do not treat Open VSX as the source of this copy.

## Detections
- [Scheduled Task Creation Via Schtasks.EXE](https://github.com/SigmaHQ/sigma/blob/master/rules/windows/process_creation/proc_creation_win_schtasks_creation.yml) (sigma) — Windows process creation. schtasks.exe creating a task. Microsoft describes a SysMon scheduled task. The rule does not name SysMon.
- [New Cron File Created](https://github.com/SigmaHQ/sigma/blob/master/rules/linux/file_event/file_event_lnx_susp_cron_file_created.yml) (sigma) — Linux file event. A new cron file. Matches the @reboot cron persistence Microsoft describes.
- [Potential Persistence Via PlistBuddy](https://github.com/SigmaHQ/sigma/blob/master/rules/macos/process_creation/proc_creation_macos_persistence_via_plistbuddy.yml) (sigma) — macOS process creation. PlistBuddy writing a LaunchAgent. Relevant to com.apple.sysmond only if the installer used PlistBuddy. Microsoft names the LaunchAgent, not the tool that wrote it.
- [Port Forwarding Activity Via SSH.EXE](https://github.com/SigmaHQ/sigma/blob/master/rules/windows/process_creation/proc_creation_win_ssh_port_forward.yml) (sigma) — Windows process creation. ssh.exe port forwarding. Matches the reverse tunnel on Windows. The Linux and macOS tunnels are the same destination, 134.209.82.225.
- [Potential SSH Tunnel Persistence Install Using A Scheduled Task](https://github.com/SigmaHQ/sigma/blob/master/rules/windows/process_creation/proc_creation_win_schtasks_openssh_tunnelling.yml) (sigma) — Windows process creation. schtasks.exe installing an OpenSSH tunnel. Microsoft describes both a SysMon task and a reverse SSH tunnel.
- Fireworks key and marketplace cache (guidance) — No cited rule covers an exposed vendor access key or a write to the Cursor marketplace cache. Hunt svc-telemetry in authorized_keys and outbound SSH to 134.209.82.225.

## Timeline
- First seen: 2026-10-29
- Last updated: 2026-11-13
- 2026-10-29 (Cursor): Using a stolen credential, the attacker places unauthorized Claude Code extension copies on the marketplace cache. At most 5,000 users who requested those versions could receive them. The copies are available for about 11 hours.
- 2026-10-30 (Microsoft): Microsoft describes the loader, SSH key svc-telemetry, the tunnel to 134.209.82.225, the beacon on port 8099, and persistence via com.apple.sysmond, cron, and a SysMon task. Versions are 2.1.312 and 2.1.313.
- 2026-11-01 (Cursor): Last attacker activity Cursor reports. The activity was blocked.
- 2026-11-13 (Cursor): Cursor publishes the root cause: an access key issued to Fireworks was exposed, the attacker copied a read-only trace bucket, and Open VSX never had the malware.

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
The Fireworks access key, the read-only bucket, the 0.01% and 0.05% figures, the marketplace cache, the 5,000-user bound, the 11-hour window, and the Nov 1 last-seen activity are from Cursor's Nov 13, 2026 update. The loader, SSH key svc-telemetry, tunnel 134.209.82.225, beacon on port 8099, and the macOS, Linux, and Windows persistence names are from Microsoft's Oct 30 analysis. The earlier GitHub-repository explanation is not the root cause Cursor published on Nov 13.

## Sources
- [Inside the malicious Claude Code-branded Cursor extension with persistent SSH backdoor](https://www.microsoft.com/en-us/security/blog/2026/10/30/inside-malicious-claude-code-branded-cursor-extension-persistent-ssh-backdoor/) — Microsoft
- [Security notice regarding Claude Code extension](https://cursor.com/blog/claude-code-extension-security-notice) — Cursor
- [Claude Code Trojan: Persistent SSH Backdoor Analysis](https://opensourcemalware.com/analysis/claude-code-trojan-persistent-ssh-backdoor) — OpenSourceMalware.com
- [Security incident update](https://cursor.com/blog/security-incident-update) — Cursor
