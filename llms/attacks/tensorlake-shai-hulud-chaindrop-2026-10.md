# Tensorlake AI sandbox SDK hijacked with Shai-Hulud stealer by ChainDrop

- ID: tensorlake-shai-hulud-chaindrop-2026-10
- Reported: 2026-10-17
- AI role: ai_credential_theft
- Entry: https://openattacks.ai/attacks/tensorlake-shai-hulud-chaindrop-2026-10/

## Summary
Oct 17, 2026: Actor 'ChainDrop' compromised Tensorlake maintainer's npm account via phishing. Published malicious TensorZero@1.8.4, @tensorzero/gateway@2.0.1, @tensorzero/cli@1.4.0. Embedded obfuscated Shai-Hulud infostealer targeting AI development credentials: Cursor IDE (.cursor/User/globalStorage/*.json), Claude Desktop (~/Library/Application Support/Claude), OpenAI keys (env vars, .openai/), GitHub tokens (~/.config/gh/), AWS credentials (~/.aws/), Docker configs, SSH keys. Exfiltrated to discord.com/api/webhooks/... and hxxps://tensorlakeapi[.]online/api/collect. Packages removed within 3 hours; ~450 downloads during window. TensorZero is LLM gateway/observability platform for engineering teams. ChainDrop previously linked to @tensorzero/keyv Mini Shai-Hulud campaign (Aug 7, GitGuardian) and other AI supply chain hits. Detection: monitor npm package.json for unexpected dependencies, review postinstall scripts, check for base64/eval obfuscation, scan for Discord webhook URLs, monitor file access to AI credential paths.

## Category
attacks-on-ai

## Attribution
Actor 'ChainDrop'; linked to Mini Shai-Hulud keyv campaign (Aug 7); persistent targeting of AI development supply chains

- Actor: ChainDrop
- Country: Unknown
- Motivation: financially-motivated
- Attributed by: Socket Security
- Confidence: high

## AI involvement confidence
confirmed

## Attack flow
### phish-maintainer: Compromise maintainer account (access)

ChainDrop phished Tensorlake maintainer's npm credentials to gain publish access to @tensorzero packages

Evidence: <https://socket.dev/blog/tensorlake-compromise>

### publish-malicious: Publish malicious packages (ai)

Published malicious versions: TensorZero@1.8.4, @tensorzero/gateway@2.0.1, @tensorzero/cli@1.4.0 with embedded Shai-Hulud stealer in obfuscated postinstall script

Evidence: <https://socket.dev/blog/tensorlake-compromise>

### execute-stealer: Execute credential harvesting (execution)

Postinstall script runs Shai-Hulud: scans filesystem for Cursor IDE config, Claude Desktop tokens, OpenAI keys, GitHub tokens, AWS credentials, Docker configs, SSH keys; base64 encodes and stages

Evidence: <https://socket.dev/blog/tensorlake-compromise>

### exfiltrate: Exfiltrate credentials (impact)

POST stolen credentials to Discord webhook and hxxps://tensorlakeapi[.]online/api/collect; credentials enable downstream AI service abuse and lateral movement

Evidence: <https://socket.dev/blog/tensorlake-compromise>

### Connections

- phish-maintainer -> publish-malicious
- publish-malicious -> execute-stealer
- execute-stealer -> exfiltrate

## MITRE ATLAS
- [AML.T0000](https://atlas.mitre.org/techniques/AML.T0000) Search Open Technical Databases — Supply chain compromise of AI development SDK to steal AI service credentials and API keys
  Evidence: <https://socket.dev/blog/tensorlake-compromise>

## Prevention
Verify npm package integrity; review postinstall scripts; monitor for unexpected dependencies; use npm audit; implement software composition analysis (SCA); rotate credentials after suspected exposure; use credential vaults; monitor file access to AI credential stores; network egress filtering for Discord/unknown domains

## Detections
- npm postinstall script monitoring (guidance) — Monitor npm postinstall scripts for file system access to AI credential paths (~/.cursor/, ~/Library/Application Support/Claude, ~/.openai/, ~/.config/gh/, ~/.aws/); alert on Discord webhook URLs or unknown C2 domains in install scripts
- Network egress monitoring (guidance) — Alert on POST requests to tensorlakeapi\[.\]online or Discord webhook domains from npm/Node processes; monitor base64-encoded data exfiltration

## Timeline
- First seen: 2026-10-17
- Last updated: 2026-11-04
- 2026-10-17 (Socket Security): TensorZero packages compromised via phished maintainer credentials; ~450 downloads in 3-hour window before removal

## Tools
### AI tooling and models
- TensorZero LLM gateway and observability platform
- [Cursor IDE](https://cursor.com/)
- [Claude Desktop](https://claude.com/product/overview)
- OpenAI API

### Other tooling
- Shai-Hulud credential stealer
- npm supply chain attack
- Discord webhooks for exfiltration
- tensorlakeapi\[.\]online C2

## Sources
- [Socket: AI Sandbox SDK Compromised in Supply Chain Attack](https://socket.dev/blog/tensorlake-compromise)
- [TensorZero - LLM Gateway for Engineering Teams](https://github.com/tensorzero/tensorzero)
