# GTG-2002 vibe hacking data extortion via Claude Code

- ID: gtg-2002-vibe-hacking-extortion-2025-08
- Reported: 2025-08-27
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/gtg-2002-vibe-hacking-extortion-2025-08/

## Summary
Cybercriminal GTG-2002 used Claude Code as active operator for scaled data extortion ('vibe hacking'): recon, credential harvest, network penetration, exfil, then ransom notes threatening data exposure (not classic encryptor). Actor stored preferred TTPs in CLAUDE.md; Claude helped choose ransom amounts from financial data and generated HTML ransom notes embedded in boot process.

## Category
adversary-use-of-ai

## Attribution
GTG-2002; financially motivated cybercriminal

- Actor: GTG-2002
- Motivation: financially-motivated

## AI involvement confidence
confirmed

## Attack flow
### step-1: Internet-facing systems are scanned (access)

Some operations also start with compromised VPN access.

Evidence: <https://www-cdn.anthropic.com/b2a76c6f6992465c09a6f2fce282f6c0cea8c200.pdf>

### step-2: Claude Code assists active intrusion (ai)

The actor stores preferences in CLAUDE.md and uses model help for reconnaissance and credential collection.

Evidence: <https://www-cdn.anthropic.com/b2a76c6f6992465c09a6f2fce282f6c0cea8c200.pdf>

### step-3: Data is collected and exfiltrated (execution)

The campaign penetrates networks and retrieves information.

Evidence: <https://www-cdn.anthropic.com/b2a76c6f6992465c09a6f2fce282f6c0cea8c200.pdf>

### step-4: Victims receive extortion demands (impact)

Model assistance supports ransom valuation and HTML demands threatening data exposure.

Evidence: <https://www-cdn.anthropic.com/b2a76c6f6992465c09a6f2fce282f6c0cea8c200.pdf>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0016.002](https://atlas.mitre.org/techniques/AML.T0016.002) Generative AI — Claude Code is used as part of the extortion workflow.
  Evidence: <https://www-cdn.anthropic.com/b2a76c6f6992465c09a6f2fce282f6c0cea8c200.pdf>
- [AML.T0102](https://atlas.mitre.org/techniques/AML.T0102) Generate Malicious Commands — The model supports command-driven intrusion tasks.
  Evidence: <https://www-cdn.anthropic.com/b2a76c6f6992465c09a6f2fce282f6c0cea8c200.pdf>

## Prevention
EDR + app control on coding-agent spawned shells; hunt boot-process HTML ransom artifacts; restrict agent network egress

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in GTG-2002 vibe hacking data extortion via Claude Code. Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- [Claude Code](https://github.com/anthropics/claude-code)
- CLAUDE.md TTP guide

### Other tooling
- unknown

### MagicSword projects
- [LOLBAS](https://lolbas-project.github.io)
- [GTFOBins](https://gtfobins.github.io)

## Sources
- <https://www-cdn.anthropic.com/b2a76c6f6992465c09a6f2fce282f6c0cea8c200.pdf>
