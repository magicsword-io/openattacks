# UNC1069 (MASAN) Gemini misuse + deepfake Zoom lures

- ID: unc1069-gemini-deepfake-crypto-2025
- Reported: 2025-11-05
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/unc1069-gemini-deepfake-crypto-2025/

## Summary
DPRK-linked UNC1069 used Gemini for crypto recon, wallet path research, Spanish lure text, and credential-theft 'update' instructions. Separately used deepfake images/video of crypto industry figures to push malicious 'Zoom SDK' links delivering BIGMACHO backdoor.

## Category
adversary-use-of-ai

## Attribution
UNC1069 aka MASAN; DPRK-associated

- Actor: UNC1069 aka MASAN

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Social engineering / deepfake lures with malicious Zoom SDK download
- Victims and sectors: Cryptocurrency users/industry
- Regions: unknown
- Region notes: unknown
- Scale and metrics: unknown

## Attack flow
### step-1: Actor prepares cryptocurrency operations (access)

The report describes two related capability areas without proving a single combined chain.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/>

### step-2: Gemini assists research and lure text (ai)

Requests cover cryptocurrency reconnaissance, wallet paths and Spanish-language messages.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/>

### step-3: Separate deepfake Zoom lure (ai)

Deepfake images or video impersonate cryptocurrency industry figures.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/>

### step-4: Malicious Zoom SDK delivers BIGMACHO (execution)

The separately reported social-engineering branch leads to a backdoor download.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/>

### Connections

- step-1 -> step-2 (Model assistance)
- step-1 -> step-3 (Separate reported lure)
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0088](https://atlas.mitre.org/techniques/AML.T0088) Generate Deepfakes — A separately reported lure uses deepfake industry figures.
  Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/>
- [AML.T0016.002](https://atlas.mitre.org/techniques/AML.T0016.002) Generative AI — Gemini supports cryptocurrency research and lure writing.
  Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/>

## Prevention
Verify Zoom/SDK downloads; deepfake skepticism; block unofficial SDKs

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in UNC1069 (MASAN) Gemini misuse + deepfake Zoom lures. Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- [Gemini](https://gemini.google.com/)
- deepfake image/video

### Other tooling
- BIGMACHO backdoor
- fake Zoom SDK

### MagicSword projects
- [LOLRMM](https://lolrmm.io)

## Source notes
unknown

## Sources
- <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/>
