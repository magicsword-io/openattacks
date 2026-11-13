# PROMPTLOCK LLM-generated Lua ransomware PoC

- ID: promptlock-gtig-eset-2025
- Reported: 2025-11-05
- AI role: llm_generated_malware
- Entry: https://openattacks.ai/attacks/promptlock-gtig-eset-2025/

## Summary
Cross-platform Go ransomware PoC that uses an LLM to dynamically generate and execute malicious Lua for filesystem recon, exfil, and encryption on Windows and Linux. ESET described related research as first known AI-written ransomware using local gpt-oss:20b.

Evidence qualification: Proof of concept / experimental; not reported as active campaign.

## Category
adversary-use-of-ai

## Attribution
unknown

## AI involvement confidence
unverified

## Scope and targeting
- Initial access: unknown
- Victims and sectors: unknown
- Regions: unknown
- Region notes: unknown
- Scale and metrics: unknown

## Attack flow
### step-1: PoC starts in a research setting (unknown)

This entry is a ransomware proof of concept, not a confirmed victim campaign.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/> <https://www.eset.com/blog/en/business-topics/threat-landscape/the-first-known-ai-written-ransomware/>

### step-2: LLM generates Lua at runtime (ai)

A Go program requests filesystem-related malicious scripts.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/> <https://www.eset.com/blog/en/business-topics/threat-landscape/the-first-known-ai-written-ransomware/>

### step-3: Generated Lua is executed (execution)

The research describes reconnaissance, exfiltration and encryption logic.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/> <https://www.eset.com/blog/en/business-topics/threat-landscape/the-first-known-ai-written-ransomware/>

### step-4: Research demonstrates ransomware behavior (impact)

The PoC demonstrates potential Windows and Linux impact.

Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/> <https://www.eset.com/blog/en/business-topics/threat-landscape/the-first-known-ai-written-ransomware/>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0102](https://atlas.mitre.org/techniques/AML.T0102) Generate Malicious Commands — The ransomware proof of concept generates Lua scripts at runtime.
  Evidence: <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/> <https://www.eset.com/blog/en/business-topics/threat-landscape/the-first-known-ai-written-ransomware/>

## Prevention
Treat unexpected local LLM + script generation as high signal; ransomware fundamentals unchanged

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in PROMPTLOCK LLM-generated Lua ransomware PoC. Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- LLM at runtime
- Lua script generation
- [gpt-oss:20b](https://github.com/openai/gpt-oss) (ESET write-up)

### Other tooling
- [Go](https://github.com/golang/go)

## Source notes
unknown

## Sources
- <https://cloud.google.com/blog/topics/threat-intelligence/threat-actor-usage-of-ai-tools/>
- <https://www.eset.com/blog/en/business-topics/threat-landscape/the-first-known-ai-written-ransomware/>
