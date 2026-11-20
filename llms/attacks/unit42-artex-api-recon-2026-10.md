# ARTEX planner agent API reconnaissance and exploitation

- ID: unit42-artex-api-recon-2026-10
- Reported: 2026-10-30
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/unit42-artex-api-recon-2026-10/

## Summary
ARTEX planner agent activity observed Sep 24-Oct 27 2026 by Unit 42. Agent autonomously harvested source maps, OpenAPI specifications, and runtime-config.json files. Attempted OAuth redirect URI abuse and password spraying. Successfully self-registered on exposed APIs without authentication. Read approximately 50 MB of data. Wrote data to an unauthenticated development document store. Microsoft tracks related activity as Storm-0940 with Oct 21 observations. Unit 42's Nov 11, 2026 post (Cuong Dinh, Richard Emerson, Samantha Stallings), ARTEX and AI-Powered Red Teaming Tools, adds incident-response and Managed Threat Hunting cases where ARTEX turned password-reset pages and exposed APIs into cloud access in under a day. Behavioral hallmarks in that post: bursts of one to 14 requests about a second apart, then a pause of 25 to 31 seconds; a pivot within a minute of a credential download; more than 200 client secrets validated in about three minutes; a GET to the same path after almost every successful write; canary values evil.com, test@example.com, and deadbeefdeadbeefdeadbeef12; and polling every 48 seconds. As of October 2026 Unit 42 counted 609 internet-facing ARTEX hosts and 1,323 CyberStrikeAI hosts, with 21 running both. The framework is https://github.com/RuoJi6/ARTEX.

## Category
adversary-use-of-ai

## Attribution
Microsoft Storm-0940 (related activity Oct 21)

- Actor: Unnamed ARTEX operators; Microsoft tracks related activity as Storm-0940
- Country: Unknown
- Motivation: unknown
- Attributed by: Unit 42, Microsoft
- Confidence: medium

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Exposed API endpoints without authentication
- Victims and sectors: Organizations with exposed APIs and unauthenticated development endpoints
- Regions: Multiple regions
- Region notes: Multiple regions reflects API reconnaissance patterns observed by Unit 42
- Scale and metrics: Activity Sep 24-Oct 27 2026; approximately 50 MB data read; wrote to unauthenticated document store

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
- ARTEX API hallmarks (guidance) — security-detections-mcp searches for password spray returned Azure Identity Protection and dsacls rules. Those do not match ARTEX spraying an exposed application API. No cited rule encodes the canary values evil.com, test@example.com, or deadbeefdeadbeefdeadbeef12, the 25 to 31 second pause, or the 48 second recheck. Hunt OpenAPI and source-map downloads followed by a write and an immediate read of the same path.

## Timeline
- First seen: 2026-09-24
- Last updated: 2026-11-11
- 2026-10-30 (Unit 42): Unit 42 publishes the Sep 24-Oct 27 ARTEX planner activity: source maps, OpenAPI files, unauthenticated self-registration, and about 50 MB read.
- 2026-11-11 (Unit 42): Unit 42 publishes the defender hallmarks, including canary values, 1-14 request bursts with 25-31 second pauses, and the October host counts of 609 ARTEX and 1,323 CyberStrikeAI.

## Tools
### AI tooling and models
- [ARTEX](https://github.com/RuoJi6/ARTEX) planner agent — Community-maintained fork; the original repository is unavailable. MoLeft/ARTEX also returned HTTP 200 on 2026-11-16. The original Autumn-27/ARTEX repository returned HTTP 404.
- Autonomous API reconnaissance

### Other tooling
- Source map harvesting
- OpenAPI specification parsing
- OAuth redirect abuse attempts
- Password spraying
- API self-registration

### Offensive frameworks
- [ARTEX](https://openattacks.ai/tools/artex/) (`artex`)

## Source notes
Microsoft tracks related activity as Storm-0940 with Oct 21 observations

Relevant detection rules:
- Monitor for bulk access to source map files (.map.js, .js.map)
- Alert on OpenAPI specification downloads (openapi.json, swagger.json, api-docs)
- Detect runtime-config.json and similar configuration file access patterns
- Monitor for OAuth redirect URI manipulation attempts
- Alert on password spraying patterns (multiple authentication attempts across accounts)
- Detect unauthenticated API registration/account creation
- Monitor writes to development document stores from unexpected sources
- Track volume of API data reads (spike detection for ~50 MB threshold)
- Note: API reconnaissance detection typically requires application-level logging, WAF rules, and API gateway monitoring. No direct Sigma rules exist for OpenAPI/source map harvesting; requires custom rules based on web server access logs and application audit trails.

## Sources
- [Activity using ARTEX agentic AI](https://github.com/PaloAltoNetworks/Unit42-timely-threat-intel/blob/main/2026-10-30-activity-using-ARTEX-agentic-AI.txt) — Unit 42 (Palo Alto Networks)
- [ARTEX and AI-Powered Red Teaming Tools: What Defenders Need to Know](https://unit42.paloaltonetworks.com/artex-and-ai-powered-red-teaming-tools/) — Unit 42 (Palo Alto Networks)
