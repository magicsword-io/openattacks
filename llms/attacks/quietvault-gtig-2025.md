# QUIETVAULT AI-assisted credential stealer

- ID: quietvault-gtig-2025
- Reported: 2025-11-05
- AI role: ai_credential_theft
- Entry: https://openattacks.ai/attacks/quietvault-gtig-2025/

## Summary
JavaScript stealer targeting GitHub and npm tokens; exfils via creating public GitHub repos. Also leverages AI prompts and installed AI CLI tools to search for other secrets on the host. Observed in operations; linked in industry reporting to Nx/s1ngularity-style supply-chain delivery.

## Category
attacks-on-ai

## Attribution
GTIG QUIETVAULT; industry links to UNC6426 / s1ngularity cluster

- Actor: GTIG QUIETVAULT

## AI involvement confidence
confirmed

## Attack flow
### step-1: Trojanized npm package is installed (access)

Industry reporting links the delivery to supply-chain campaigns.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/> <https://research.splunk.com/stories/quietvault/>

### step-2: JavaScript stealer searches for tokens (execution)

GitHub and npm credentials are primary targets.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/> <https://research.splunk.com/stories/quietvault/>

### step-3: Installed AI CLIs help find more secrets (ai)

Prompts and local model tools extend host-side secret discovery.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/> <https://research.splunk.com/stories/quietvault/>

### step-4: Secrets are posted to public repositories (impact)

The malware creates public GitHub repositories to exfiltrate collected data.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/> <https://research.splunk.com/stories/quietvault/>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0055](https://atlas.mitre.org/techniques/AML.T0055) Unsecured Credentials — The stealer uses local AI tools to search for additional secrets.
  Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/> <https://research.splunk.com/stories/quietvault/>

## Prevention
Disable or gate AI CLIs in CI; rotate GitHub/npm tokens; hunt public s1ngularity-style repos

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in QUIETVAULT AI-assisted credential stealer. Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- On-host AI CLI tools
- crafted AI prompts for secret discovery

### Other tooling
- GitHub API for exfil repos
- npm token theft

### MagicSword projects
- [LOLSkills](https://lolskills.io)

## Sources
- <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/>
- <https://research.splunk.com/stories/quietvault/>
