# ARTEX planner agent API reconnaissance and exploitation

- ID: unit42-artex-api-recon-2026-10
- Reported: 2026-10-30
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/unit42-artex-api-recon-2026-10/

## Summary
ARTEX planner agent activity observed Sep 24-Oct 27 2026 by Unit 42. Agent autonomously harvested source maps, OpenAPI specifications, and runtime-config.json files. Attempted OAuth redirect URI abuse and password spraying. Successfully self-registered on exposed APIs without authentication. Read approximately 50 MB of data. Wrote data to an unauthenticated development document store. Attack demonstrates autonomous API reconnaissance and exploitation capabilities. Microsoft tracks related activity as Storm-0940 with Oct 21 observations.

## Category
uncategorized

## Attribution
Microsoft Storm-0940 (related activity Oct 21)

## AI involvement confidence
not assessed

## Attack flow
### recon: Agent harvests API metadata (access)

ARTEX planner agent autonomously collected source maps, OpenAPI specifications, and runtime-config.json files from exposed endpoints

Evidence: <https://github.com/PaloAltoNetworks/Unit42-timely-threat-intel/blob/main/2026-10-30-activity-using-ARTEX-agentic-AI.txt>

### exploit-attempts: OAuth and credential attacks attempted (ai)

Agent tried OAuth redirect URI abuse and password spraying

Evidence: <https://github.com/PaloAltoNetworks/Unit42-timely-threat-intel/blob/main/2026-10-30-activity-using-ARTEX-agentic-AI.txt>

### registration: Self-registration on exposed APIs (execution)

Successfully registered accounts on APIs without authentication controls

Evidence: <https://github.com/PaloAltoNetworks/Unit42-timely-threat-intel/blob/main/2026-10-30-activity-using-ARTEX-agentic-AI.txt>

### data-access: Approximately 50 MB data read (impact)

Agent read substantial data from compromised APIs

Evidence: <https://github.com/PaloAltoNetworks/Unit42-timely-threat-intel/blob/main/2026-10-30-activity-using-ARTEX-agentic-AI.txt>

### data-write: Data written to unauthenticated store (impact)

Wrote collected data to unauthenticated development document store

Evidence: <https://github.com/PaloAltoNetworks/Unit42-timely-threat-intel/blob/main/2026-10-30-activity-using-ARTEX-agentic-AI.txt>

### Connections

- recon -> exploit-attempts
- exploit-attempts -> registration
- registration -> data-access
- data-access -> data-write

## MITRE ATLAS
- [AML.T0016.002](https://atlas.mitre.org/techniques/AML.T0016.002) Generative AI — ARTEX planner agent autonomously conducted API reconnaissance and exploitation
  Evidence: <https://github.com/PaloAltoNetworks/Unit42-timely-threat-intel/blob/main/2026-10-30-activity-using-ARTEX-agentic-AI.txt>

## Prevention
Authenticate all API endpoints including development; remove source maps from production; restrict OpenAPI spec access; validate OAuth redirect URIs; implement API registration controls; monitor for automated reconnaissance patterns; detect bulk configuration file access; alert on unauthenticated document store writes; review Storm-0940 indicators

## Detections
No detections are recorded.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- [ARTEX](https://github.com/RuoJi6/ARTEX) planner agent — Community-maintained fork; the original repository is unavailable.
- Autonomous API reconnaissance

### Other tooling
- Source map harvesting
- OpenAPI specification parsing
- OAuth redirect abuse attempts
- Password spraying
- API self-registration

## Sources
- [Activity using ARTEX agentic AI](https://github.com/PaloAltoNetworks/Unit42-timely-threat-intel/blob/main/2026-10-30-activity-using-ARTEX-agentic-AI.txt) — Unit 42 (Palo Alto Networks)
