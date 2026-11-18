# CLOSEDQUORUM implant - 4 LLMs vote on next action

- ID: talos-closedquorum-implant-2026-09
- Reported: 2026-09-22
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/talos-closedquorum-implant-2026-09/

## Summary
CLOSEDQUORUM is a Go-based Windows implant that queries DeepSeek, Qwen (via OpenRouter), Mistral, and Gemini in sequence for post-compromise decisions. Each model receives system info (hostname, Windows version, admin status) and a constrained JSON prompt with 4 actions: steal (credentials/browsers/wallets), inject (process hollowing), persist (registry/startup), or move (no handler in the public build). Models vote; plurality wins; ties favor DeepSeek > Qwen > Mistral > Gemini. Decisions are posted to a Discord webhook with reasoning. No human operator commands are needed after deployment. The public build uses dummy keys and a dummy webhook, so Talos did not observe end-to-end execution. Talos discovered it via CAIRN, its open-source AI-malware hunting toolkit. Developer artifacts link to carding forums dating to 2025.

Evidence qualification: Public distribution build contains dummy API keys and webhook; Talos has not observed end-to-end run or confirmed in-the-wild deployment; binary artifacts connect developer to carding forum postings dating to 2025

## Category
adversary-use-of-ai

## Attribution
Developer artifacts link to carding forum postings dating to 2025; no confirmed threat actor attribution

- Actor: Unknown
- Motivation: unknown
- Attributed by: Cisco Talos
- Confidence: low

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Not established in public sample; deployment method unknown
- Victims and sectors: No confirmed in-the-wild deployment; public sample analysis only
- Regions: unknown
- Region notes: unknown
- Scale and metrics: First publicly documented autonomous AI C2 implant; analysis dated Jun 17, 2026; disclosed Sep 22, 2026; public build non-functional (dummy keys)

## Attack flow
### deployment: Implant deployment (access)

Go-based Windows implant deployed (method unknown in public sample); no confirmed in-the-wild deployment

Evidence: <https://blog.talosintelligence.com/the-closed-quorum-inside-the-first-reported-autonomous-ai-c2-implant/>

### system-enum: System enumeration (execution)

Collects hostname, Windows version, administrator status for LLM query context

Evidence: <https://blog.talosintelligence.com/the-closed-quorum-inside-the-first-reported-autonomous-ai-c2-implant/>

### llm-vote: LLM panel voting (ai)

Queries 4 LLM providers in sequence: DeepSeek, Qwen (OpenRouter), Mistral, Gemini; sends system info and constrained JSON prompt with 4 actions (steal, inject, persist, move); each model votes; plurality wins; ties favor DeepSeek > Qwen > Mistral > Gemini; no quorum threshold

Evidence: <https://blog.talosintelligence.com/the-closed-quorum-inside-the-first-reported-autonomous-ai-c2-implant/>

### discord-log: Decision logging to Discord (execution)

Posts winning decision and model's stated reasoning to Discord webhook before execution; stolen data also sent to same webhook

Evidence: <https://blog.talosintelligence.com/the-closed-quorum-inside-the-first-reported-autonomous-ai-c2-implant/>

### execute: Execute decision (impact)

Executes winning action: steal (credentials, browsers, wallets), inject (process hollowing via CreateProcessW CREATE_SUSPENDED), persist (registry/startup), or move (no handler); public build injection reaches primitives but demonstrates no successful execution

Evidence: <https://blog.talosintelligence.com/the-closed-quorum-inside-the-first-reported-autonomous-ai-c2-implant/>

### Connections

- deployment -> system-enum
- system-enum -> llm-vote
- llm-vote -> discord-log
- discord-log -> execute
- execute -> system-enum [loop]

## MITRE ATLAS
- [AML.T0040](https://atlas.mitre.org/techniques/AML.T0040) AI Model Inference API Access — First documented Windows implant using LLM panel voting for autonomous C2 decisions; represents shift where expanding portions of attack chain execute without operator involvement
  Evidence: <https://blog.talosintelligence.com/the-closed-quorum-inside-the-first-reported-autonomous-ai-c2-implant/>

## Prevention
AI API key monitoring; Discord webhook traffic from unexpected processes; plurality voting pattern detection; LLM query patterns with system enumeration; CAIRN tool for AI-malware hunting

## Detections
- Correlated LLM-provider and Discord traffic (guidance) — Alert on unexpected Windows processes contacting several LLM providers and Discord webhooks within the same execution window.
- Autonomous implant behavior correlation (guidance) — Correlate LLM API traffic with LSASS access, process injection, persistence creation, or repeated execution at randomized intervals.

## Timeline
- First seen: 2026-06-17
- Last updated: 2026-09-22
- 2026-09-22 (Cisco Talos): Talos published its static analysis and stated that it had no confirmation of in-the-wild deployment.

## Tools
### AI tooling and models
- [DeepSeek](https://github.com/deepseek-ai) (api.deepseek.com, deepseek-chat)
- Qwen (via OpenRouter, qwen/qwen-2.5-72b-instruct)
- Mistral (api.mistral.ai, mistral-large-latest)
- Google [Gemini](https://gemini.google.com/) (gemini-2.0-flash-exp)

### Other tooling
- Discord webhook for decision logging and exfiltration
- [CAIRN](https://github.com/oritera/Cairn) (Talos AI-malware hunting tool, used for discovery)
- Go-based implant
- Windows process injection primitives (CreateProcessW, CREATE_SUSPENDED)

## Source notes
Cisco Talos first public documentation; discovered via CAIRN. Talos reports that the public distribution binary is inert because it contains dummy API keys and a dummy webhook. Static analysis confirms plurality voting and deterministic tie-breaking, not a minimum 3-of-4 quorum; if every provider fails, an unhandled consensus value causes the loop to sleep and retry.

## Sources
- [The Closed Quorum: Inside the first reported autonomous AI C2 implant](https://blog.talosintelligence.com/the-closed-quorum-inside-the-first-reported-autonomous-ai-c2-implant/)
