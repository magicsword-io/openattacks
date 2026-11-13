# Rilide/Vidar via fake Sora/Gemini/Midjourney AI tools

- ID: eset-rilide-vidar-fake-ai-2024
- Reported: 2024-07-30
- AI role: ai_tool_as_lure
- Entry: https://openattacks.ai/attacks/eset-rilide-vidar-fake-ai-2024/

## Summary
Fake Sora/Gemini ads and a Google Translate extension delivered Rilide stealer targeting Facebook credentials; fake Midjourney installer delivered Vidar stealer (browsers, wallets, keystrokes).

## Category
adversary-use-of-ai

## Attribution
unknown

## AI involvement confidence
confirmed

## Attack flow
### step-1: AI ads or downloads attract users (access)

Fake Sora, Gemini and Midjourney offers lead to an installer or extension.

Evidence: <https://blog.eset.ie/2024/07/30/beware-of-fake-ai-tools-masking-very-real-malware-threats/>

### step-2: AI branding disguises the lure (ai)

The advertised product provides the reason to install.

Evidence: <https://blog.eset.ie/2024/07/30/beware-of-fake-ai-tools-masking-very-real-malware-threats/>

### step-3: Rilide or Vidar is delivered (execution)

The report describes separate extension and installer payload branches.

Evidence: <https://blog.eset.ie/2024/07/30/beware-of-fake-ai-tools-masking-very-real-malware-threats/>

### step-4: Credentials and personal data are stolen (impact)

Targets include Facebook accounts, browser information and wallets.

Evidence: <https://blog.eset.ie/2024/07/30/beware-of-fake-ai-tools-masking-very-real-malware-threats/>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
No ATLAS mapping is recorded.

## Prevention
Avoid ad-driven AI downloads; extension allowlists

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in Rilide/Vidar via fake Sora/Gemini/Midjourney AI tools. Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- Fake Sora
- [Gemini](https://gemini.google.com/)
- Midjourney branded lures

### Other tooling
- Rilide
- Vidar

### MagicSword projects
- [LOLBAS](https://lolbas-project.github.io)

## Sources
- <https://blog.eset.ie/2024/07/30/beware-of-fake-ai-tools-masking-very-real-malware-threats/>
