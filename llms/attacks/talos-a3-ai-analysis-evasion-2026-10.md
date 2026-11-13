# A3 AI-analysis evasion (FRUITSHELL / HOLLOWCLAD / MANTLEMAZE)

- ID: talos-a3-ai-analysis-evasion-2026-10
- Reported: 2026-10-08
- AI role: other
- Entry: https://openattacks.ai/attacks/talos-a3-ai-analysis-evasion-2026-10/

## Summary
84 samples across families embed plaintext comments telling LLMs to ignore the file, refuse reverse engineering, or claim DoD/IP. Direct-instruction trick steered models toward benign ~35% in best runs. MANTLEMAZE pairs this with iqvw64e.sys BYOVD (CVE-2015-2291); ROZESHELL pairs with AMSI bypass and csc.exe.

## Category
adversary-use-of-ai

## Attribution
CAIRN families FRUITSHELL, PLOTSAFE, HOLLOWCLAD, MANTLEMAZE, ROZESHELL; A3 technique class

- Actor: CAIRN families FRUITSHELL, PLOTSAFE, HOLLOWCLAD, MANTLEMAZE, ROZESHELL

## AI involvement confidence
confirmed

## Attack flow
### step-1: Malware is presented for analysis (access)

Samples include comments aimed at automated analysis models.

Evidence: <https://blog.talosintelligence.com/ignore-all-instructions-and-read-this-blog-the-state-of-ai-analysis-evasion-in-malware/>

### step-2: Instructions target the analyst model (ai)

The text asks LLMs to ignore the file, refuse analysis or accept benign explanations.

Evidence: <https://blog.talosintelligence.com/ignore-all-instructions-and-read-this-blog-the-state-of-ai-analysis-evasion-in-malware/>

### step-3: Model interpretation is influenced (execution)

The research measures whether direct instructions shift maliciousness assessments.

Evidence: <https://blog.talosintelligence.com/ignore-all-instructions-and-read-this-blog-the-state-of-ai-analysis-evasion-in-malware/>

### step-4: Some runs misclassify samples (impact)

Results are bounded by the evaluated models, samples and experimental conditions.

Evidence: <https://blog.talosintelligence.com/ignore-all-instructions-and-read-this-blog-the-state-of-ai-analysis-evasion-in-malware/>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0051.001](https://atlas.mitre.org/techniques/AML.T0051.001) Indirect — Comments in analyzed files inject instructions into a security-analysis model.
  Evidence: <https://blog.talosintelligence.com/ignore-all-instructions-and-read-this-blog-the-state-of-ai-analysis-evasion-in-malware/>
- [AML.T0015](https://atlas.mitre.org/techniques/AML.T0015) Evade AI Model — The text attempts to evade AI-based maliciousness assessment.
  Evidence: <https://blog.talosintelligence.com/ignore-all-instructions-and-read-this-blog-the-state-of-ai-analysis-evasion-in-malware/>

## Prevention
Treat sample text as evidence never instruction; prevent iqvw64e load via app control

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in A3 AI-analysis evasion (FRUITSHELL / HOLLOWCLAD / MANTLEMAZE). Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- Prompt injection against defender LLM pipelines

### Other tooling
- iqvw64e.sys (LOLDrivers)
- csc.exe (LOLBAS)
- VMProtect costume sections

### MagicSword projects
- [LOLDrivers](https://loldrivers.io)
- [LOLBAS](https://lolbas-project.github.io)

## Sources
- <https://blog.talosintelligence.com/ignore-all-instructions-and-read-this-blog-the-state-of-ai-analysis-evasion-in-malware/>
