# Claude-assisted IoT security camera credential scraping toolkit

- ID: anthropic-iot-camera-cred-scrape-2025-03
- Reported: 2025-04-23
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/anthropic-iot-camera-cred-scrape-2025-03/

## Summary
Actor used Claude to rewrite scraping toolkit, scrape target URLs, process stealer-log Telegram posts, and improve UI/backend for testing leaked IoT camera credentials against internet-facing devices.

Evidence qualification: Capability development assisted by Claude; Anthropic did not confirm successful real-world deployment.

## Category
adversary-use-of-ai

## Attribution
unknown sophisticated actor

- Actor: unknown sophisticated actor

## AI involvement confidence
unverified

## Scope and targeting
- Initial access: unknown
- Victims and sectors: Potential IoT/security camera owners (deployment unconfirmed)
- Regions: unknown
- Region notes: unknown
- Scale and metrics: unknown

## Attack flow
### step-1: Leaked credentials and target URLs (access)

The actor processes URLs and Telegram stealer-log posts.

Evidence: <https://www.anthropic.com/news/detecting-and-countering-malicious-uses-of-claude-march-2025>

### step-2: Claude rewrites the toolkit (ai)

Claude helps improve scraping, processing and the toolkit interface.

Evidence: <https://www.anthropic.com/news/detecting-and-countering-malicious-uses-of-claude-march-2025>

### step-3: Credentials are tested (execution)

The toolkit tests leaked camera credentials against internet-facing devices.

Evidence: <https://www.anthropic.com/news/detecting-and-countering-malicious-uses-of-claude-march-2025>

### step-4: Victim impact is undisclosed (unknown)

The supplied report does not establish a confirmed set of compromised cameras.

Evidence: <https://www.anthropic.com/news/detecting-and-countering-malicious-uses-of-claude-march-2025>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0016.002](https://atlas.mitre.org/techniques/AML.T0016.002) Generative AI — The supplied source explicitly describes generative-model tooling assisting the reported activity; this mapping does not establish additional autonomy or victim impact.
  Evidence: <https://www.anthropic.com/news/detecting-and-countering-malicious-uses-of-claude-march-2025>

## Prevention
Rotate default/IoT credentials; block internet exposure of cameras

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in Claude-assisted IoT security camera credential scraping toolkit. Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- [Claude](https://claude.com/product/overview)

### Other tooling
- commercial breach data platforms
- Telegram stealer log communities

## Source notes
unknown

## Sources
- <https://www.anthropic.com/news/detecting-and-countering-malicious-uses-of-claude-march-2025>
