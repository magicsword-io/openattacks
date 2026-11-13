# s1ngularity Nx npm supply chain abusing AI CLIs

- ID: s1ngularity-nx-ai-cli-2025-08
- Reported: 2025-08-27
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/s1ngularity-nx-ai-cli-2025-08/

## Summary
Attackers stole an Nx npm publish token via GitHub Actions injection and published malicious Nx packages. Postinstall harvested environment, GitHub, npm, SSH, and wallet data and invoked local Claude, Gemini, and Amazon Q CLIs with dangerous flags to inventory sensitive files, then pushed loot to public GitHub repos named s1ngularity-repository*. Phase 2 used stolen tokens to make 5,500+ private repos public. Later Mandiant reporting described a hijacked coding-assistant session spreading Shai-Hulud through malicious package recommendations.

## Category
adversary-use-of-ai

## Attribution
s1ngularity / UNC6426 (industry)

- Actor: s1ngularity

## AI involvement confidence
confirmed

## Attack flow
### step-1: Publish token is stolen (access)

GitHub Actions injection enables malicious Nx package releases.

Evidence: <https://www.wiz.io/blog/s1ngularity-supply-chain-attack> <https://www.wiz.io/blog/s1ngularitys-aftermath> <https://nx.dev/blog/s1ngularity-postmortem> <https://snyk.io/blog/weaponizing-ai-coding-agents-for-malware-in-the-nx-malicious-package/>

### step-2: Package postinstall harvests secrets (execution)

Installation starts environment, developer-token and file collection.

Evidence: <https://www.wiz.io/blog/s1ngularity-supply-chain-attack> <https://www.wiz.io/blog/s1ngularitys-aftermath> <https://nx.dev/blog/s1ngularity-postmortem> <https://snyk.io/blog/weaponizing-ai-coding-agents-for-malware-in-the-nx-malicious-package/>

### step-3: Local AI CLIs inventory sensitive files (ai)

Claude, Gemini and Amazon Q are invoked with permissive flags.

Evidence: <https://www.wiz.io/blog/s1ngularity-supply-chain-attack> <https://www.wiz.io/blog/s1ngularitys-aftermath> <https://nx.dev/blog/s1ngularity-postmortem> <https://snyk.io/blog/weaponizing-ai-coding-agents-for-malware-in-the-nx-malicious-package/>

### step-4: Loot and private repositories become public (impact)

Collected data is pushed to public repositories; later token abuse exposes additional private repositories.

Evidence: <https://www.wiz.io/blog/s1ngularity-supply-chain-attack> <https://www.wiz.io/blog/s1ngularitys-aftermath> <https://nx.dev/blog/s1ngularity-postmortem> <https://snyk.io/blog/weaponizing-ai-coding-agents-for-malware-in-the-nx-malicious-package/>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0055](https://atlas.mitre.org/techniques/AML.T0055) Unsecured Credentials — Postinstall malware harvests tokens and uses AI CLIs to locate sensitive files.
  Evidence: <https://www.wiz.io/blog/s1ngularity-supply-chain-attack> <https://www.wiz.io/blog/s1ngularitys-aftermath> <https://nx.dev/blog/s1ngularity-postmortem> <https://snyk.io/blog/weaponizing-ai-coding-agents-for-malware-in-the-nx-malicious-package/>

## Prevention
Pin npm provenance; gate AI CLIs; app control on unexpected gh/cli from node postinstall; rotate tokens

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in s1ngularity Nx npm supply chain abusing AI CLIs. Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- [claude CLI](https://github.com/anthropics/claude-code)
- [gemini CLI](https://github.com/google-gemini/gemini-cli)
- [Amazon Q CLI](https://github.com/aws/amazon-q-developer-cli)
- --dangerously-skip-permissions style flags

### Other tooling
- [GitHub CLI](https://github.com/cli/cli)
- npm postinstall
- [GitHub Actions](https://github.com/features/actions) webhook token theft

### MagicSword projects
- [LOLSkills](https://lolskills.io)
- [LOLBAS](https://lolbas-project.github.io)

## Sources
- [Wiz: s1ngularity Supply Chain Attack](https://www.wiz.io/blog/s1ngularity-supply-chain-attack)
- [Wiz: s1ngularity's Aftermath](https://www.wiz.io/blog/s1ngularitys-aftermath)
- [Nx: s1ngularity Postmortem](https://nx.dev/blog/s1ngularity-postmortem)
- [Snyk: Weaponizing AI Coding Agents for Malware in Nx](https://snyk.io/blog/weaponizing-ai-coding-agents-for-malware-in-the-nx-malicious-package/)
- [Mandiant: Hijacked Coding-Assistant Session Spreads Shai-Hulud](https://www.mandiant.com/resources/blog/hijacked-coding-assistant-shai-hulud)
