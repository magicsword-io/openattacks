# INC Ransom and The Gentlemen affiliates using Claude Opus and Kimi AI

- ID: inc-gentlemen-ransomware-ai-2026-10
- Reported: 2026-10-20
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/inc-gentlemen-ransomware-ai-2026-10/

## Summary
Oct 20, 2026: SOCRadar tracked INC Ransom and The Gentlemen RaaS affiliates deploying AI agents via OpenCode framework. Agents powered by Claude 3.5 Opus (Anthropic) and Kimi (Moonshot AI, Chinese). Workflow: (1) Initial access via RDP brute-force or stolen credentials; (2) Deploy OpenCode agent with 'network-recon', 'privilege-escalation', 'data-discovery' skills; (3) Agent autonomously scans Active Directory, identifies high-value targets (domain controllers, file servers, backups), maps network topology; (4) Agent generates PowerShell/C# payloads for privilege escalation (leveraging Kimi for Chinese-language Windows environments); (5) Automates data exfiltration staging to Mega/SFTP; (6) Deploys ransomware after validation of backup destruction. SOCRadar observed affiliates using abliterated models (uncensored variants refusing no requests). Both groups share OpenCode infrastructure and AI access via underground markets. Detection: monitor for OpenCode agent indicators (Python process with LLM API calls), alert on rapid automated AD queries, check for Anthropic/Moonshot API traffic from unexpected sources, review PowerShell/C# script generation patterns characteristic of LLM output.

## Category
uncategorized

## Attribution
INC Ransom affiliates, The Gentlemen affiliates; financially motivated ransomware-as-a-service operations; shared AI infrastructure access via underground markets

## AI involvement confidence
not assessed

## Scope and targeting
- Initial access: RDP brute-force, stolen VPN credentials, phishing with malware loaders
- Victims and sectors: Multiple organizations; sectors not disclosed by SOCRadar; Ukrainian and European targets mentioned in affiliate forum discussions
- Regions: Europe, Ukraine
- Region notes: unknown
- Scale and metrics: Unknown number of intrusions; SOCRadar tracking Oct 2026; affiliates share AI infrastructure and techniques across both RaaS families

## Attack flow
### initial-access: Gain initial access (access)

Affiliates compromise target via RDP brute-force, stolen VPN credentials, or phishing; establish foothold with remote access

Evidence: <https://socradar.io/blog/inc-gentlemen-ransomware-ai-infrastructure/>

### deploy-agent: Deploy OpenCode AI agent (ai)

Install OpenCode framework with Claude 3.5 Opus or Kimi model; load 'network-recon', 'privilege-escalation', 'data-discovery' skills; agent begins autonomous operation

Evidence: <https://socradar.io/blog/inc-gentlemen-ransomware-ai-infrastructure/>

### recon-lateral: Automated reconnaissance and lateral movement (execution)

Agent scans Active Directory, identifies domain controllers, file servers, backups; maps network topology; generates PowerShell/C# privilege escalation payloads (Kimi assists with Chinese Windows environments); moves laterally

Evidence: <https://socradar.io/blog/inc-gentlemen-ransomware-ai-infrastructure/>

### exfil-ransomware: Data exfiltration and ransomware deployment (impact)

Agent stages sensitive data to Mega/SFTP; validates backup destruction; deploys INC Ransom or The Gentlemen ransomware; automated process reduces dwell time and increases success rate

Evidence: <https://socradar.io/blog/inc-gentlemen-ransomware-ai-infrastructure/>

### Connections

- initial-access -> deploy-agent
- deploy-agent -> recon-lateral
- recon-lateral -> exfil-ransomware

## MITRE ATLAS
- [AML.T0040](https://atlas.mitre.org/techniques/AML.T0040) AI Model Inference API Access — Ransomware affiliates use LLM agents to autonomously conduct reconnaissance, lateral movement, and data exfiltration
  Evidence: <https://socradar.io/blog/inc-gentlemen-ransomware-ai-infrastructure/>
- [AML.T0016.002](https://atlas.mitre.org/techniques/AML.T0016.002) Generative AI — Adversaries use AI to automate privilege escalation and payload generation
  Evidence: <https://socradar.io/blog/inc-gentlemen-ransomware-ai-infrastructure/>

## Prevention
Enforce MFA on RDP/VPN; monitor for rapid automated AD enumeration; detect OpenCode agent processes; block or monitor Anthropic/Moonshot API traffic from non-developer endpoints; use behavioral analytics detecting LLM-generated script patterns; implement EDR detecting automated reconnaissance; segment networks to slow lateral movement

## Detections
No detections are recorded.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- [OpenCode](https://github.com/anomalyco/opencode) autonomous agent framework
- [Claude](https://claude.com/product/overview) 3.5 Opus (Anthropic)
- Kimi (Moonshot AI)
- Abliterated/uncensored model variants

### Other tooling
- [PowerShell](https://github.com/PowerShell/PowerShell) and C# for privilege escalation
- Active Directory reconnaissance
- Mega and SFTP for exfiltration staging
- INC Ransom and The Gentlemen ransomware

## Source notes
SOCRadar Dark Web Team analysis. Related to n0n ransomware OpenCode campaign (socradar-n0n-ransomware-ai-2026-10). INC Ransom and The Gentlemen represent shift toward RaaS affiliates sharing AI agent infrastructure for operational automation. Detection: look for OpenCode Python agent process with network recon modules, monitor Anthropic API (api.anthropic.com) and Moonshot API traffic, alert on rapid AD queries from single source, check PowerShell/C# scripts for LLM generation patterns (verbose comments, specific formatting, error-handling characteristics).

## Sources
- [SOCRadar: INC Ransom & The Gentlemen Leverage AI for Ransomware Operations](https://socradar.io/blog/inc-gentlemen-ransomware-ai-infrastructure/)
