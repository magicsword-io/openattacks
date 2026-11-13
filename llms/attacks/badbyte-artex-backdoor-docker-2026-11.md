# BadByte - Backdoored ARTEX Docker images tomicdd/artex & congdonglinux/artex

- ID: badbyte-artex-backdoor-docker-2026-11
- Reported: 2026-11-04
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/badbyte-artex-backdoor-docker-2026-11/

## Summary
After Autumn-27 closed ARTEX source on Oct 8, 2026, unknown operator controlling Docker Hub accounts tomicdd and congdonglinux (mirror) pushed backdoored ARTEX images while maintaining deleted GitHub bait repository trhhubsd/ARTEX (formerly ptasm) with swapped docker-compose.yml pulling backdoored tomicdd/artex. Prebuilt /app/artex binary adds verifyCaptcha function: unauthenticated POST to /api/auth/login with marked captcha field executes arbitrary sh -c commands as root before password verification, bypassing authentication entirely. Backdoor exposes ARTEX operator's LLM API keys (OpenAI, Anthropic, DeepSeek), MCP server configurations, autonomous agent prompts, and credentials harvested from targets during offensive operations. BadByte analysis (Nov 4, 2026) confirmed /app/artex SHA-256 d5070f52262effe216b840711343bff8f2787f39208d887d8dfd9c673f8d1573, image index digest sha256:ce85d8369ccc1a85423f1f75d2f3afaa2fab759e580da37a6891af2f7392745e, UI build ID 3aC1db3gGU08O4UHbAt4J. Docker Hub removed tomicdd/artex on Nov 5, 2026. Backdoor demonstrates supply-chain risk in offensive AI agent tooling where operators' own credentials become attack surface.

## Category
attacks-on-ai

## Attribution
Unknown operator controlling Docker Hub tomicdd (primary) and congdonglinux (mirror) accounts; deleted GitHub repository trhhubsd/ARTEX (formerly ptasm); initially surfaced by Dan Tentler (Viss) on Nov 2, 2026; analyzed by BadByte

- Actor: Unknown (tomicdd/congdonglinux Docker Hub operator)
- Country: Unknown
- Motivation: cybercrime
- Attributed by: BadByte
- Confidence: low

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: ARTEX operators pull backdoored tomicdd/artex or congdonglinux/artex Docker image via compromised docker-compose.yml in deleted trhhubsd/ARTEX repository
- Victims and sectors: ARTEX operators conducting offensive security operations; exposed: operator LLM API keys, MCP configurations, autonomous agent prompts, harvested target credentials
- Regions: Multiple regions
- Region notes: unknown
- Scale and metrics: tomicdd/artex available on Docker Hub Oct 8 - Nov 5, 2026; unknown number of pulls before takedown; backdoor active approximately 4 weeks

## Attack flow
### close-source: ARTEX source closed Oct 8, 2026 (execution)

ARTEX source closed Oct 8, 2026

Evidence: <https://badbyte.io/artex-backdoor-docker-image/>

### push-backdoor: Push backdoored tomicdd/artex to Docker Hub (execution)

Push backdoored tomicdd/artex to Docker Hub

Evidence: <https://badbyte.io/artex-backdoor-docker-image/>

### swap-compose: trhhubsd/ARTEX swaps docker-compose.yml to pull tomicdd/artex (execution)

trhhubsd/ARTEX swaps docker-compose.yml to pull tomicdd/artex

Evidence: <https://badbyte.io/artex-backdoor-docker-image/>

### operator-pull: ARTEX operators pull backdoored image (execution)

ARTEX operators pull backdoored image

Evidence: <https://badbyte.io/artex-backdoor-docker-image/>

### backdoor-access: Unauthenticated POST /api/auth/login executes sh -c as root (execution)

Unauthenticated POST /api/auth/login executes sh -c as root

Evidence: <https://badbyte.io/artex-backdoor-docker-image/>

### credential-theft: Steal LLM API keys, MCP configs, prompts, target credentials (impact)

Steal LLM API keys, MCP configs, prompts, target credentials

Evidence: <https://badbyte.io/artex-backdoor-docker-image/>

### Connections

- close-source -> push-backdoor
- push-backdoor -> swap-compose
- swap-compose -> operator-pull
- operator-pull -> backdoor-access
- backdoor-access -> credential-theft

## MITRE ATLAS
- [AML.T0000](https://atlas.mitre.org/techniques/AML.T0000) Search Open Technical Databases — Supply-chain attack targeting AI offensive agent infrastructure; backdoor in ARTEX Docker image allows attacker to compromise operators' LLM API keys and MCP configurations
  Evidence: <https://badbyte.io/artex-backdoor-docker-image/>

## Prevention
Verify Docker image integrity via official repository sources and signed images; audit docker-compose.yml for unexpected image sources; use Docker Content Trust / Notary v2 for image verification; scan container images for suspicious network listeners and authentication bypasses; monitor container logs for unauthenticated command execution attempts; never deploy offensive tooling images from unverified third-party Docker Hub accounts; build ARTEX from official source (github.com/RuoJi6/ARTEX) rather than pulling prebuilt images; implement network segmentation for offensive security infrastructure

## Detections
- [Antivirus - Web Shell Detection Signature](https://github.com/SigmaHQ/sigma/blob/master/rules/category/antivirus/av_webshell.yml) (sigma) — General web shell detection; backdoored ARTEX /api/auth/login endpoint exhibits web shell characteristics (unauthenticated command execution)
- Container command execution monitoring (guidance) — Monitor Docker containers for unauthenticated API endpoints executing shell commands; alert on /api/auth/login POST requests with captcha fields invoking sh -c; audit docker-compose.yml for non-official ARTEX image sources (tomicdd/artex, congdonglinux/artex); verify ARTEX image digest against official builds; scan container filesystem for modified /app/artex binary (SHA-256 d5070f52262effe216b840711343bff8f2787f39208d887d8dfd9c673f8d1573); detect suspicious outbound connections from ARTEX containers to non-target infrastructure
- Docker image integrity validation (guidance) — Implement Docker Content Trust; verify image signatures before deployment; scan images with Trivy/Clair for malicious binaries; audit container network listeners for unexpected authentication bypasses; build offensive tooling from verified source repositories rather than pulling prebuilt images

## Timeline
- First seen: 2026-10-08
- Last updated: 2026-11-05
- 2026-10-08 (Unknown): Autumn-27 closes ARTEX source; tomicdd/artex backdoored image appears on Docker Hub
- 2026-11-02 (Dan Tentler (Viss)): Dan Tentler (Viss) publicly surfaces backdoored ARTEX Docker image
- 2026-11-04 (BadByte): BadByte publishes detailed analysis with hashes and backdoor mechanism
- 2026-11-05 (Docker Hub): Docker Hub removes tomicdd/artex and congdonglinux/artex images

## Tools
### AI tooling and models
- [ARTEX](https://github.com/RuoJi6/ARTEX) autonomous offensive agent (clean source at https://github.com/RuoJi6/ARTEX) — Community-maintained fork; the original repository is unavailable.
- Backdoored [ARTEX](https://github.com/RuoJi6/ARTEX) [Docker](https://github.com/moby/moby) image (tomicdd/artex, congdonglinux/artex - now removed from [Docker](https://github.com/moby/moby) Hub) — Community-maintained fork; the original repository is unavailable.

### Other tooling
- [Docker](https://github.com/moby/moby) / [Docker](https://github.com/moby/moby) Compose
- Unauthenticated /api/auth/login backdoor endpoint

## Source notes
BadByte analysis (Nov 4, 2026, updated Nov 5 on Docker Hub takedown) primary source; Dan Tentler (Viss) initial disclosure Nov 2, 2026; all hashes and IOCs verified from BadByte post: /app/artex SHA-256 d5070f52262effe216b840711343bff8f2787f39208d887d8dfd9c673f8d1573, image index digest sha256:ce85d8369ccc1a85423f1f75d2f3afaa2fab759e580da37a6891af2f7392745e, UI build ID 3aC1db3gGU08O4UHbAt4J

## Sources
- [Backdoored Docker Image for ARTEX AI Offensive Agent](https://badbyte.io/artex-backdoor-docker-image/) — BadByte
- [Backdoored Docker Image for ARTEX AI Offensive Agent Exposes Operators' Secrets](https://thehackernews.com/2026/11/backdoored-docker-image-for-artex-ai.html) — The Hacker News
