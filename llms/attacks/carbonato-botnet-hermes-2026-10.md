# Carbonato botnet deploys Hermes agent to hunt AI keys on Docker hosts

- ID: carbonato-botnet-hermes-2026-10
- Reported: 2026-10-28
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/carbonato-botnet-hermes-2026-10/

## Summary
Oct 28, 2026: Carbonato botnet scans for exposed Docker daemons (TCP 2375/2376, unauthenticated or weak credentials). On compromise, deploys privileged container running Ubuntu with: (1) Hermes autonomous agent (Python-based LLM agent framework); (2) scanning modules for AWS credentials, GitHub tokens, OpenAI/Anthropic API keys, HuggingFace tokens, Docker secrets, Kubernetes service accounts; (3) XMRig crypto miner (secondary payload). Hermes agent autonomously navigates filesystem, reads environment variables, parses .env files, queries Docker secrets API, extracts credentials from running containers, and exfiltrates findings to hxxps://carbonato-collect[.]net/api/ingest. Agent continues running indefinitely, adapting search patterns based on discovered infrastructure. ThreatDown tracked 3,200+ compromised Docker hosts Oct-Nov 2026; hosts in cloud providers (AWS, GCP, Azure, DigitalOcean) and on-premise. Median dwell time 18 days before detection. Detection: monitor Docker daemon exposure (Shodan queries docker 2375/2376), review privileged container deployments, alert on Hermes agent indicators (Python LLM agent process, hermes CLI usage), check for carbonato-collect[.]net egress, monitor API key/token file access patterns from containers.

## Category
attacks-on-ai

## Attribution
Unknown actor; Carbonato botnet infrastructure; financially motivated (crypto mining + credential monetization)

- Actor: Carbonato botnet operators
- Country: Unknown
- Motivation: financially-motivated
- Attributed by: ThreatDown Labs
- Confidence: medium

## AI involvement confidence
confirmed

## Attack flow
### scan-docker: Scan for exposed Docker (access)

Botnet scans internet for exposed Docker daemons on TCP 2375 (unencrypted) and 2376 (TLS); brute-forces weak credentials or exploits no-auth configs

Evidence: <https://www.threatdown.com/blog/carbonato/>

### deploy-container: Deploy malicious container (ai)

Creates privileged Docker container with host filesystem mounts; runs Ubuntu image with Hermes agent, scanning tools, and XMRig miner; container gains host-level access

Evidence: <https://www.threatdown.com/blog/carbonato/>

### hermes-hunt: Autonomous credential hunting (execution)

Hermes agent autonomously navigates filesystem, reads env vars, parses .env files, queries Docker secrets, extracts credentials from running containers; adapts search patterns based on discovered infrastructure; targets AWS, GitHub, OpenAI, Anthropic, HuggingFace keys

Evidence: <https://www.threatdown.com/blog/carbonato/>

### exfiltrate-mine: Exfiltrate and mine (impact)

Hermes POSTs credentials to hxxps://carbonato-collect[.]net/api/ingest; XMRig mines Monero using host CPU; agent maintains persistence and continues hunting indefinitely; median 18-day dwell time

Evidence: <https://www.threatdown.com/blog/carbonato/>

### Connections

- scan-docker -> deploy-container
- deploy-container -> hermes-hunt
- hermes-hunt -> exfiltrate-mine

## MITRE ATLAS
- [AML.T0000](https://atlas.mitre.org/techniques/AML.T0000) Search Open Technical Databases — Attacker deploys autonomous AI agent (Hermes) to hunt for AI service credentials on compromised infrastructure
  Evidence: <https://www.threatdown.com/blog/carbonato/>

## Prevention
Never expose Docker daemon to internet; require TLS with client cert authentication; use Docker socket firewall rules; implement least-privilege container policies; disable privileged containers where possible; monitor container resource usage; rotate API keys regularly; use secret management solutions (HashiCorp Vault, AWS Secrets Manager); network segmentation; Docker security scanning

## Detections
- Docker daemon exposure monitoring (guidance) — Monitor for exposed Docker daemons on TCP 2375/2376; alert on unauthorized privileged container deployments with host filesystem mounts
- Hermes agent detection (guidance) — Monitor for Hermes Python processes, autonomous-agent activity, API calls to DeepSeek from Docker containers; alert on carbonato-collect\[.\]net egress

## Timeline
- First seen: 2026-10-01
- Last updated: 2026-11-04
- 2026-10-28 (ThreatDown Labs): 3,200+ compromised Docker hosts discovered; Hermes agent deployment for autonomous credential hunting; median 18-day dwell time

## Tools
### AI tooling and models
- Hermes autonomous agent framework
- OpenAI API (targeted)
- Anthropic [Claude](https://claude.com/product/overview) API (targeted)
- HuggingFace (targeted)

### Other tooling
- [Docker](https://github.com/moby/moby) container escape
- XMRig cryptocurrency miner
- carbonato-collect\[.\]net C2

## Sources
- [ThreatDown: Carbonato Botnet Spreads Via Exposed Docker Hosts](https://www.threatdown.com/blog/carbonato/)
- [Hermes - Autonomous AI Agent Framework](https://github.com/NousResearch/hermes-agent)
