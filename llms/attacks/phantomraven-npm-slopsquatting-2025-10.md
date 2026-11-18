# PhantomRaven npm campaign with slopsquatting names

- ID: phantomraven-npm-slopsquatting-2025-10
- Reported: 2025-10-01
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/phantomraven-npm-slopsquatting-2025-10/

## Summary
A flood of malicious npm packages used remote dynamic HTTP dependencies invisible to many scanners and included AI-hallucination-friendly names such as unused-imports. The packages delivered credential stealers targeting npm, Git, and CI tokens.

## Category
attacks-on-ai

## Attribution
PhantomRaven; operator unknown

- Actor: JPD
- Country: Unknown
- Motivation: financially-motivated
- Attributed by: CrowdStrike
- Confidence: medium

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: npm install of malicious/slopsquat packages
- Victims and sectors: unknown
- Regions: unknown
- Region notes: unknown
- Scale and metrics: 126 packages cited in related reporting

## Attack flow
### step-3: Hallucinated names create an exposure path (ai)

AI package recommendations can direct developers to attacker-owned names; not every install is established as AI-driven.

Evidence: <https://www.koi.ai/blog/phantomraven-npm-malware-hidden-in-invisible-dependencies> <https://www.sonatype.com/blog/phantomraven-npm-malware> <https://www.bleepingcomputer.com/news/security/phantomraven-attack-floods-npm-with-credential-stealing-packages/>

### step-1: Developer installs a malicious package (access)

The campaign includes names friendly to AI hallucination-based recommendations.

Evidence: <https://www.koi.ai/blog/phantomraven-npm-malware-hidden-in-invisible-dependencies> <https://www.sonatype.com/blog/phantomraven-npm-malware> <https://www.bleepingcomputer.com/news/security/phantomraven-attack-floods-npm-with-credential-stealing-packages/>

### step-2: Remote dependencies load code (execution)

Dynamic HTTP dependencies conceal additional behavior from some scanners.

Evidence: <https://www.koi.ai/blog/phantomraven-npm-malware-hidden-in-invisible-dependencies> <https://www.sonatype.com/blog/phantomraven-npm-malware> <https://www.bleepingcomputer.com/news/security/phantomraven-attack-floods-npm-with-credential-stealing-packages/>

### step-4: Developer credentials are stolen (impact)

The delivered stealer targets npm, Git and CI tokens.

Evidence: <https://www.koi.ai/blog/phantomraven-npm-malware-hidden-in-invisible-dependencies> <https://www.sonatype.com/blog/phantomraven-npm-malware> <https://www.bleepingcomputer.com/news/security/phantomraven-attack-floods-npm-with-credential-stealing-packages/>

### Connections

- step-3 -> step-1 (Potential exposure path)
- step-1 -> step-2
- step-2 -> step-4

## MITRE ATLAS
- [AML.T0060](https://atlas.mitre.org/techniques/AML.T0060) Publish Hallucinated Entities — The campaign includes names compatible with hallucinated package recommendations; AI-driven installation is not established for every package.
  Evidence: <https://www.koi.ai/blog/phantomraven-npm-malware-hidden-in-invisible-dependencies> <https://www.sonatype.com/blog/phantomraven-npm-malware> <https://www.bleepingcomputer.com/news/security/phantomraven-attack-floods-npm-with-credential-stealing-packages/>

## Prevention
Block remote HTTP deps; lockfiles; SCA; never trust AI-suggested package names blindly

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in PhantomRaven npm campaign with slopsquatting names. Refer to sources for specific IOCs and TTPs.

## Timeline
- First seen: 2025-10-01
- Last updated: 2026-11-05
- 2025-10-01 (Koi Security, Sonatype, BleepingComputer): PhantomRaven campaign disclosed; 126 malicious npm packages with slopsquatting names and remote dependencies
- 2026-09-15 (CrowdStrike): Stealer code confirmed LLM-generated; operator identified as JPD

## Tools
### AI tooling and models
- unknown

### Other tooling
- Remote dynamic dependencies
- info-stealers

## Source notes
CrowdStrike identified LLM-generated stealer patterns: characteristic variable naming, comments explaining basic operations, structured code organization typical of AI-generated malware

## Sources
- [Koi Security: PhantomRaven npm Malware Hidden in Invisible Dependencies](https://www.koi.ai/blog/phantomraven-npm-malware-hidden-in-invisible-dependencies)
- [Sonatype: PhantomRaven npm Malware Campaign](https://www.sonatype.com/blog/phantomraven-npm-malware)
- [BleepingComputer: PhantomRaven Attack Floods npm](https://www.bleepingcomputer.com/news/security/phantomraven-attack-floods-npm-with-credential-stealing-packages/)
