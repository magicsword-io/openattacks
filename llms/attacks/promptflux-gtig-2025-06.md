# PROMPTFLUX Gemini API self-modifying VBScript dropper

- ID: promptflux-gtig-2025-06
- Reported: 2025-11-05
- AI role: llm_generated_malware
- Entry: https://openattacks.ai/attacks/promptflux-gtig-2025-06/

## Summary
VBScript dropper with decoy installer; 'Thinking Robot' module POSTs to Gemini API (gemini-1.5-flash-latest) with hard-coded key asking for VBScript AV-evasion rewrites; intends Startup persistence and removable-drive spread. Self-update function commented out in analyzed samples.

Evidence qualification: GTIG classifies as experimental/dev; incomplete features; no demonstrated ability to compromise victims.

## Category
adversary-use-of-ai

## Attribution
unattributed; financially motivated lure filenames suggested

- Actor: unattributed
- Motivation: financially-motivated

## AI involvement confidence
unverified

## Scope and targeting
- Initial access: unknown
- Victims and sectors: unknown
- Regions: unknown
- Region notes: unknown
- Scale and metrics: Experimental; Google disabled associated assets

## Attack flow
### step-1: Initial delivery is not established (unknown)

The analyzed VBScript includes a decoy installer, but the initial route is unknown.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/>

### step-2: Thinking Robot queries Gemini (ai)

A hard-coded key supports requests for VBScript evasion rewrites.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/>

### step-3: Dropper contains a rewrite workflow (execution)

The analyzed sample contains code for self-modification.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/>

### step-4: Self-update is commented out (unknown)

Startup persistence and removable-drive spread are intended behavior; the analyzed rewrite function was not active.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0102](https://atlas.mitre.org/techniques/AML.T0102) Generate Malicious Commands — A dropper requests generated VBScript rewrites; the analyzed self-update routine is commented out.
  Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/>

## Prevention
Monitor Gemini API keys embedded in scripts; block unexpected generative API from endpoints

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in PROMPTFLUX Gemini API self-modifying VBScript dropper. Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- [Google Gemini API](https://ai.google.dev/)
- [gemini-1.5-flash-latest](https://ai.google.dev/)

### Other tooling
- VBScript
- Startup folder persistence

## Source notes
unknown

## Sources
- <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/>
