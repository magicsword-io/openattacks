# Copilot Studio / Power Platform SharePoint connector SSRF (CVE-2024-38206)

- ID: zenity-copilot-studio-sharepoint-ssrf-2024
- Reported: 2024-12-01
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/zenity-copilot-studio-sharepoint-ssrf-2024/

## Summary
SSRF in SharePoint connector used by Copilot Studio/Power Automate/Power Apps/Copilot 365. Malicious agent List-folder action with attacker URL could harvest victim SharePoint JWT when they connect/retry, enabling impersonation. Microsoft patched Dec 2024.

## Category
attacks-on-ai

## Attribution
unknown

## AI involvement confidence
confirmed

## Attack flow
### step-1: Original victim-contact route is unspecified (unknown)

The seed describes a malicious agent action and connector retry behavior.

Evidence: <https://labs.zenity.io/post/the-power-of-one-ssrf-vulnerability-a-multi-platform-threat> <https://nvd.nist.gov/vuln/detail/cve-2024-38206>

### step-2: Connector uses an attacker URL (access)

An agent List-folder action points to an attacker-controlled destination.

Evidence: <https://labs.zenity.io/post/the-power-of-one-ssrf-vulnerability-a-multi-platform-threat> <https://nvd.nist.gov/vuln/detail/cve-2024-38206>

### step-3: User connects or retries through the agent (ai)

The SharePoint connector follows the manipulated flow.

Evidence: <https://labs.zenity.io/post/the-power-of-one-ssrf-vulnerability-a-multi-platform-threat> <https://nvd.nist.gov/vuln/detail/cve-2024-38206>

### step-4: SharePoint token is exposed (impact)

The reported SSRF chain can reveal a JWT that enables impersonation.

Evidence: <https://labs.zenity.io/post/the-power-of-one-ssrf-vulnerability-a-multi-platform-threat> <https://nvd.nist.gov/vuln/detail/cve-2024-38206>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
No ATLAS mapping is recorded.

## Prevention
Patch; audit public Copilot Studio agents; least-privilege connectors

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in Copilot Studio / Power Platform SharePoint connector SSRF (CVE-2024-38206). Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- [Microsoft Copilot Studio](https://www.microsoft.com/en-us/copilot/products/copilot-studio)
- Power Platform SharePoint connector

### Other tooling
- unknown

## Sources
- <https://labs.zenity.io/post/the-power-of-one-ssrf-vulnerability-a-multi-platform-threat>
- <https://nvd.nist.gov/vuln/detail/cve-2024-38206>
