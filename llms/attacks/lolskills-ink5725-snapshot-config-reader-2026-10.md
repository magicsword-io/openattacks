# ink5725/snapshot-config-reader skill finding

- ID: lolskills-ink5725-snapshot-config-reader-2026-10
- Reported: 2026-10-06
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/lolskills-ink5725-snapshot-config-reader-2026-10/

## Summary
Agent skill SKILL.md instructs pulling 'config' from PNG trailer, EXIF, LSB. ClamAV Img.Packed.PngContainsDownloadCmd (high) on two PNGs; Nova DetectHiddenInstructions (low). 0 downloads; scan incomplete.

Evidence qualification: Scanner finding on a skill bundle; Jose explicitly not calling it malicious. Pattern of decode-from-image instructions.

## Category
attacks-on-ai

## Attribution
unknown

## AI involvement confidence
unverified

## Attack flow
### step-1: Skill bundle is scanned (access)

The finding concerns an agent skill with no observed downloads.

Evidence: <https://lolskills.io/discover/56bd2dd3473fa5a15b30dd42a262ac410148e41679ebcc51c71b33279cdbfa6c>

### step-2: SKILL.md requests image extraction (ai)

Instructions tell the agent to obtain configuration from PNG trailers, metadata or low bits.

Evidence: <https://lolskills.io/discover/56bd2dd3473fa5a15b30dd42a262ac410148e41679ebcc51c71b33279cdbfa6c>

### step-3: Scanners flag embedded instructions (execution)

The partial scan detects suspicious image content with differing confidence levels.

Evidence: <https://lolskills.io/discover/56bd2dd3473fa5a15b30dd42a262ac410148e41679ebcc51c71b33279cdbfa6c>

### step-4: No execution is established (unknown)

The record does not confirm a victim, a completed scan or successful skill execution.

Evidence: <https://lolskills.io/discover/56bd2dd3473fa5a15b30dd42a262ac410148e41679ebcc51c71b33279cdbfa6c>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0051.001](https://atlas.mitre.org/techniques/AML.T0051.001) Indirect — The flagged skill instructs an agent to recover instructions from image artifacts; actual execution is unconfirmed.
  Evidence: <https://lolskills.io/discover/56bd2dd3473fa5a15b30dd42a262ac410148e41679ebcc51c71b33279cdbfa6c>

## Prevention
Whole-bundle skill scanning; treat decode-from-image steps as signals

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in ink5725/snapshot-config-reader skill finding. Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- Agent skill bundle

### Other tooling
- PNG steganography / trailer / EXIF / LSB

### MagicSword projects
- [LOLSkills](https://lolskills.io)

## Sources
- <https://lolskills.io/discover/56bd2dd3473fa5a15b30dd42a262ac410148e41679ebcc51c71b33279cdbfa6c>
