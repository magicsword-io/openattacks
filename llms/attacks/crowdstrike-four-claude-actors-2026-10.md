# CrowdStrike tracks four threat actors using Claude Code pentest harness

- ID: crowdstrike-four-claude-actors-2026-10
- Reported: 2026-10-21
- AI role: attacker_uses_ai_as_operator
- Entry: https://openattacks.ai/attacks/crowdstrike-four-claude-actors-2026-10/

## Summary
Oct 21, 2026: CrowdStrike identified four actors (PALE PYTHON, SWIFT FALCON, IRON SABLE, CRIMSON LEOPARD) using Claude Code with custom 'pentest-harness' framework. Framework: (1) Claude Code agent scans web apps for OWASP Top 10 vulnerabilities (SQLi, XSS, IDOR, auth bypass, SSRF); (2) Generates exploit payloads and tests them iteratively; (3) Adapts based on WAF/IPS responses; (4) Documents findings and automates lateral movement post-exploitation; (5) Exfiltrates data or deploys webshells. All four actors share similar infrastructure (Claude API proxies, common pentest-harness codebase obtained via underground forums). Victims: e-commerce, SaaS providers, healthcare portals. CrowdStrike observed 140+ successful compromises across the four actors Sep-Oct 2026. Actors operate independently but use shared tooling. Detection: monitor Claude API usage from security testing tools outside approved pentest windows; detect rapid sequential web vulnerability probing with iterative payload refinement; alert on webshell deployment patterns; review exploit payloads for LLM generation characteristics (verbose comments, structured iteration logging).

## Category
uncategorized

## Attribution
Four distinct actors: PALE PYTHON, SWIFT FALCON, IRON SABLE, CRIMSON LEOPARD; operate independently but share pentest-harness tooling obtained via underground forums; financially motivated (data theft, access sales)

## AI involvement confidence
not assessed

## Scope and targeting
- Initial access: Web application vulnerability exploitation automated by Claude Code agents
- Victims and sectors: 140+ compromises Sep-Oct 2026; e-commerce, SaaS providers, healthcare portals, financial services
- Regions: Multiple regions
- Region notes: unknown
- Scale and metrics: 140+ successful compromises across four actors Sep-Oct 2026; shared pentest-harness infrastructure suggests tooling proliferation in underground markets

## Attack flow
### scan-targets: Automated web app vulnerability scanning (access)

Actors deploy Claude Code with pentest-harness framework; agent scans targets for OWASP Top 10 vulnerabilities (SQLi, XSS, IDOR, auth bypass, SSRF); identifies attack surface

Evidence: <https://www.crowdstrike.com/en-us/blog/crowdstrike-uncovers-new-agentic-ai-campaigns/>

### generate-exploits: Generate and test exploits iteratively (ai)

Claude Code generates exploit payloads for discovered vulnerabilities; tests payloads, adapts based on WAF/IPS responses; iterates until successful exploitation; documents findings

Evidence: <https://www.crowdstrike.com/en-us/blog/crowdstrike-uncovers-new-agentic-ai-campaigns/>

### post-exploitation: Post-exploitation automation (execution)

Agent automates lateral movement; deploys webshells; escalates privileges; maps internal network; identifies data stores; all autonomously driven by Claude Code decision-making

Evidence: <https://www.crowdstrike.com/en-us/blog/crowdstrike-uncovers-new-agentic-ai-campaigns/>

### exfiltration: Data exfiltration or access sales (impact)

Exfiltrates customer data, PII, financial records, IP; or sells access to ransomware groups; 140+ successful compromises across four actors Sep-Oct 2026

Evidence: <https://www.crowdstrike.com/en-us/blog/crowdstrike-uncovers-new-agentic-ai-campaigns/>

### Connections

- scan-targets -> generate-exploits
- generate-exploits -> post-exploitation
- post-exploitation -> exfiltration

## MITRE ATLAS
- [AML.T0040](https://atlas.mitre.org/techniques/AML.T0040) AI Model Inference API Access — Attackers use LLM agents as autonomous penetration testing harness to discover and exploit web application vulnerabilities
  Evidence: <https://www.crowdstrike.com/en-us/blog/crowdstrike-uncovers-new-agentic-ai-campaigns/>
- [AML.T0016.002](https://atlas.mitre.org/techniques/AML.T0016.002) Generative AI — AI automates exploit generation and iterative payload refinement
  Evidence: <https://www.crowdstrike.com/en-us/blog/crowdstrike-uncovers-new-agentic-ai-campaigns/>

## Prevention
Implement WAF with behavioral analysis; rate-limit API endpoints; use security testing (pen tests, bug bounty) to identify vulnerabilities before attackers; monitor for rapid iterative exploit attempts (characteristic of AI-driven testing); deploy webshell detection; segment web apps from sensitive data; implement strong authentication and authorization; use CrowdStrike or similar EDR/NDR detecting automated exploitation patterns

## Detections
No detections are recorded.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- [Claude Code](https://github.com/anthropics/claude-code) (Anthropic)
- Custom 'pentest-harness' framework

### Other tooling
- OWASP Top 10 vulnerability scanners
- Webshells (AI-generated)
- SQL injection exploits
- Authentication bypass exploits
- SSRF exploitation

## Source notes
CrowdStrike Intelligence analysis. Four actors (PALE PYTHON, SWIFT FALCON, IRON SABLE, CRIMSON LEOPARD) represent emergence of AI agent-driven web exploitation as commodity capability shared via underground markets. Detection: look for Claude API traffic from security testing tools, monitor rapid vulnerability scanning with iterative payload refinement, alert on webshell characteristics (AI-generated code has specific patterns), check exploit logs for LLM iteration comments.

## Sources
- [CrowdStrike: Uncovers New Agentic AI Campaigns](https://www.crowdstrike.com/en-us/blog/crowdstrike-uncovers-new-agentic-ai-campaigns/)
