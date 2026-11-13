# AWS AI-augmented actor compromising 600+ FortiGate firewalls

- ID: aws-ai-fortigate-campaign-2026-02
- Reported: 2026-02-20
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/aws-ai-fortigate-campaign-2026-02/

## Summary
Feb 20, 2026: AWS disclosed compromise of 600+ FortiGate firewall appliances by AI-augmented threat actor. Actor exploits CVE-2024-21762 (FortiGate SSL VPN RCE) at scale; uses AI-assisted tooling to rapidly parse configurations, extract credentials, identify high-value targets for lateral movement. AI significantly accelerates post-compromise triage and targeting. Compromised appliances provide VPN access to victim networks. Attribution unknown.

## Category
adversary-use-of-ai

## Attribution
Unknown actor

- Actor: Unknown
- Country: Unknown
- Motivation: unknown
- Attributed by: AWS Security
- Confidence: low

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: CVE-2024-21762 FortiGate SSL VPN RCE
- Victims and sectors: 600+ organizations using vulnerable FortiGate appliances
- Regions: Multiple regions
- Region notes: unknown
- Scale and metrics: 600+ FortiGate appliances compromised as of Feb 2026

## Attack flow
### exploit: Exploit CVE-2024-21762 (access)

Mass exploitation of FortiGate SSL VPN RCE vulnerability

Evidence: <https://aws.amazon.com/blogs/security/ai-augmented-threat-actor-accesses-fortigate-devices-at-scale/>

### ai-triage: AI-assisted configuration parsing (ai)

AI rapidly parses FortiGate configurations, extracts credentials, identifies high-value targets

Evidence: <https://aws.amazon.com/blogs/security/ai-augmented-threat-actor-accesses-fortigate-devices-at-scale/>

### lateral: Lateral movement via VPN (execution)

Use harvested VPN credentials to access victim networks

Evidence: <https://aws.amazon.com/blogs/security/ai-augmented-threat-actor-accesses-fortigate-devices-at-scale/>

### compromise: Compromise internal networks (impact)

Pivot through VPN access to compromise high-value internal systems

Evidence: <https://aws.amazon.com/blogs/security/ai-augmented-threat-actor-accesses-fortigate-devices-at-scale/>

### Connections

- exploit -> ai-triage
- ai-triage -> lateral
- lateral -> compromise

## MITRE ATLAS
- [AML.T0040](https://atlas.mitre.org/techniques/AML.T0040) AI Model Inference API Access — AI-augmented actor uses AI to accelerate post-compromise configuration parsing and credential extraction at scale
  Evidence: <https://aws.amazon.com/blogs/security/ai-augmented-threat-actor-accesses-fortigate-devices-at-scale/>

## Prevention
Patch FortiGate appliances (CVE-2024-21762); monitor for unusual configuration access; restrict VPN access; rotate credentials post-compromise

## Detections
- FortiGate compromise monitoring (guidance) — Monitor FortiGate appliances for CVE-2024-21762 exploitation indicators, unusual configuration file access, credential harvesting

## Timeline
- First seen: 2026-02-01
- Last updated: 2026-11-05
- 2026-02-20 (AWS Security): 600+ FortiGate compromises disclosed with AI-augmented attacker tooling

## Tools
### AI tooling and models
- AI-assisted configuration parsing
- Automated credential extraction

### Other tooling
- CVE-2024-21762 exploit
- FortiGate configuration harvesting

## Source notes
AWS Security bulletin. Detection: monitor FortiGate appliances for exploitation indicators, unusual configuration file access, credential harvesting attempts.

## Sources
- [AWS: AI-Augmented Actor Compromising 600+ FortiGate Firewalls](https://aws.amazon.com/blogs/security/ai-augmented-threat-actor-accesses-fortigate-devices-at-scale/)
