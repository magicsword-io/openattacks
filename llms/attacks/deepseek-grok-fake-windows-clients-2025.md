# Fake DeepSeek / Grok Windows clients deliver stealers and backdoors

- ID: deepseek-grok-fake-windows-clients-2025
- Reported: 2025-02-01
- AI role: ai_tool_as_lure
- Entry: https://openattacks.ai/attacks/deepseek-grok-fake-windows-clients-2025/

## Summary
No official DeepSeek Windows desktop client; fake DeepSeek/Grok installers delivered Python stealers, SSH backdoors, Vidar, BrowserVenom (browser traffic proxying), and Chinese-language trojanized installers including Gh0stRAT variants.

## Category
adversary-use-of-ai

## Attribution
unknown

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Users download fake AI desktop clients from unofficial sites/ads
- Victims and sectors: Users seeking DeepSeek/Grok desktop apps
- Regions: Multiple regions
- Region notes: The source describes global distribution. Chinese-language installers do not establish victims in China.
- Scale and metrics: unknown

## Attack flow
### step-1: User finds an unofficial AI client (access)

Fake DeepSeek or Grok desktop downloads are promoted through sites and ads.

Evidence: <https://securelist.com/backdoors-and-stealers-prey-on-deepseek-and-grok/115801/> <https://www.kaspersky.com/blog/trojans-disguised-as-deepseek-grok-clients/53116/> <https://www.mcafee.com/blogs/other-blogs/mcafee-labs/bogus-deepseek-ai-installers-are-infecting-devices-with-malware-research-finds/>

### step-2: AI product branding is impersonated (ai)

The installer presents itself as a trusted model client.

Evidence: <https://securelist.com/backdoors-and-stealers-prey-on-deepseek-and-grok/115801/> <https://www.kaspersky.com/blog/trojans-disguised-as-deepseek-grok-clients/53116/> <https://www.mcafee.com/blogs/other-blogs/mcafee-labs/bogus-deepseek-ai-installers-are-infecting-devices-with-malware-research-finds/>

### step-3: Trojanized installer runs (execution)

Reported branches deliver stealers, SSH backdoors or RAT variants.

Evidence: <https://securelist.com/backdoors-and-stealers-prey-on-deepseek-and-grok/115801/> <https://www.kaspersky.com/blog/trojans-disguised-as-deepseek-grok-clients/53116/> <https://www.mcafee.com/blogs/other-blogs/mcafee-labs/bogus-deepseek-ai-installers-are-infecting-devices-with-malware-research-finds/>

### step-4: Data theft or remote access (impact)

Payloads steal browser data, proxy traffic or establish attacker access.

Evidence: <https://securelist.com/backdoors-and-stealers-prey-on-deepseek-and-grok/115801/> <https://www.kaspersky.com/blog/trojans-disguised-as-deepseek-grok-clients/53116/> <https://www.mcafee.com/blogs/other-blogs/mcafee-labs/bogus-deepseek-ai-installers-are-infecting-devices-with-malware-research-finds/>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
No ATLAS mapping is recorded.

## Prevention
Only official web apps; block unsigned AI installers; MagicSword prevent unexpected stealers

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in Fake DeepSeek / Grok Windows clients deliver stealers and backdoors. Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- Fake [DeepSeek](https://github.com/deepseek-ai) / [Grok](https://x.ai/grok) branded installers

### Other tooling
- Vidar
- BrowserVenom
- Gh0stRAT
- [Python](https://github.com/python/cpython) stealers

### MagicSword projects
- [LOLBAS](https://lolbas-project.github.io)

## Source notes
unknown

## Sources
- <https://securelist.com/backdoors-and-stealers-prey-on-deepseek-and-grok/115801/>
- <https://www.kaspersky.com/blog/trojans-disguised-as-deepseek-grok-clients/53116/>
- <https://www.mcafee.com/blogs/other-blogs/mcafee-labs/bogus-deepseek-ai-installers-are-infecting-devices-with-malware-research-finds/>
