# Pretext LLM attacker vs agent-skill scanners

- ID: pretext-skill-scanner-evasion-2026-10
- Reported: 2026-10-05
- AI role: other
- Entry: https://openattacks.ai/attacks/pretext-skill-scanner-evasion-2026-10/

## Summary
LLM attacker wrote payloads as plain-language instructions, framed as skill purpose, split across files. Evaded NVIDIA SkillSpector-style static+LLM-judge scanners up to 97% vs fixed detector, 77% vs adaptive. Takeaway: scanning SKILL.md alone is insufficient; scan whole bundle.

Evidence qualification: Academic research paper on evading skill scanners, not a real-world intrusion.

## Category
adversary-use-of-ai

## Attribution
Academic (Pretext paper)

- Actor: Academic (Pretext paper)

## AI involvement confidence
unverified

## Scope and targeting
- Initial access: n/a (research)
- Victims and sectors: n/a (research against scanners)
- Regions: Not applicable
- Region notes: Controlled research against skill scanners, rather than a geographically located victim campaign.
- Scale and metrics: Up to 97% / 77% evasion rates in paper evaluation

## Attack flow
### step-1: Researchers construct skill bundles (access)

The experiment evaluates skill-scanner resistance rather than a victim intrusion.

Evidence: <https://arxiv.org/abs/2609.39607>

### step-2: LLM writes pretextual instructions (ai)

Payloads are framed as ordinary skill purpose and split across files.

Evidence: <https://arxiv.org/abs/2609.39607>

### step-3: Static and model-based scanners inspect them (execution)

Tests compare evasion against fixed and adaptive detectors.

Evidence: <https://arxiv.org/abs/2609.39607>

### step-4: Research measures scanner evasion (impact)

Reported evasion rates apply to the evaluated detectors and experimental settings.

Evidence: <https://arxiv.org/abs/2609.39607>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0051.001](https://atlas.mitre.org/techniques/AML.T0051.001) Indirect — Skill-bundle text carries instructions targeting the model-based scanner.
  Evidence: <https://arxiv.org/abs/2609.39607>
- [AML.T0015](https://atlas.mitre.org/techniques/AML.T0015) Evade AI Model — The research measures evasion of AI-based detectors.
  Evidence: <https://arxiv.org/abs/2609.39607>

## Prevention
Whole-bundle skill scanning (LOLSkills model)

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in Pretext LLM attacker vs agent-skill scanners. Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- LLM attacker
- agent skills / SKILL.md
- [NVIDIA SkillSpector](https://github.com/NVIDIA/SkillSpector) (evaluated)

### Other tooling
- unknown

### MagicSword projects
- [LOLSkills](https://lolskills.io)

## Source notes
unknown

## Sources
- <https://arxiv.org/abs/2609.39607>
