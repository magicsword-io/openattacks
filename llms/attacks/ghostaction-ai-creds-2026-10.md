# GhostAction Stage 2 stealer (AI credential theft)

- ID: ghostaction-ai-creds-2026-10
- Reported: 2026-10-16
- AI role: ai_credential_theft
- Entry: https://openattacks.ai/attacks/ghostaction-ai-creds-2026-10/

## Summary
GhostAction pushes malicious GitHub Actions then Stage 2: .vscode/tasks.json folderOpen runs node on fake fa-solid-400.woff2 JS stealer; cron */5 pulls C2. Targets AWS/npm/git/kube/SSH plus Claude/Gemini creds. 94 repos / 66 owners. PolinRider copycat technique, not DPRK per OSM.

Evidence qualification: Primary attack is CI secret theft + VS Code folderOpen stealer; AI is a credential target (Claude/Gemini keys), not the attack operator. Included because Jose's post calls out AI tooling theft.

## Category
attacks-on-ai

## Attribution
GhostAction; PolinRider-technique copycat (no shared IOCs with DPRK per OSM)

- Actor: GhostAction

## AI involvement confidence
unverified

## Scope and targeting
- Initial access: Compromised GitHub account → malicious workflow + VS Code trusted workspace auto task
- Victims and sectors: GitHub maintainers / developers (many dormant repos)
- Regions: unknown
- Region notes: unknown
- Scale and metrics: 94 compromised repos; Stage 1 Oct 8, Stage 2 Oct 15 2026

## Attack flow
### step-1: Compromised account changes a repository (access)

Malicious GitHub Actions and workspace tasks are introduced.

Evidence: <https://opensourcemalware.com/blog/ghostaction-copycats-polinrider-by-hiding-a-stealer-in-a-fake-font-file>

### step-2: Trusted workspace opens a task (execution)

VS Code executes Node content disguised as a font file.

Evidence: <https://opensourcemalware.com/blog/ghostaction-copycats-polinrider-by-hiding-a-stealer-in-a-fake-font-file>

### step-3: AI credential stores are searched (ai)

The stealer targets Claude and Gemini tokens alongside cloud and developer credentials.

Evidence: <https://opensourcemalware.com/blog/ghostaction-copycats-polinrider-by-hiding-a-stealer-in-a-fake-font-file>

### step-4: Secrets are stolen with persistence (impact)

The report describes periodic C2 retrieval through cron and a multi-repository campaign.

Evidence: <https://opensourcemalware.com/blog/ghostaction-copycats-polinrider-by-hiding-a-stealer-in-a-fake-font-file>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0055](https://atlas.mitre.org/techniques/AML.T0055) Unsecured Credentials — The stealer searches local AI credential stores.
  Evidence: <https://opensourcemalware.com/blog/ghostaction-copycats-polinrider-by-hiding-a-stealer-in-a-fake-font-file>

## Prevention
task.allowAutomaticTasks off; Restricted Mode; crontab -l for #ghc2; rotate Claude/Gemini/cloud/git creds

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in GhostAction Stage 2 stealer (AI credential theft). Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- Targets [Claude](https://claude.com/product/overview) and [Gemini](https://gemini.google.com/) credential stores

### Other tooling
- [GitHub Actions](https://github.com/features/actions)
- [VS Code](https://github.com/microsoft/vscode) tasks.json
- [node](https://github.com/nodejs/node)
- cron
- 193.32.204.199:8080

## Source notes
unknown

## Sources
- <https://opensourcemalware.com/blog/ghostaction-copycats-polinrider-by-hiding-a-stealer-in-a-fake-font-file>
