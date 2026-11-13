# ThisBash - Claude Dispatch browser extension RCE (researcher disclosure)

- ID: thisbash-claude-dispatch-rce-2026-11
- Reported: 2026-11-06
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/thisbash-claude-dispatch-rce-2026-11/

## Summary
Forever Security researcher Gal Weizman disclosed ThisBash vulnerability allowing browser extension on claude.ai to push prompts to Claude Desktop via Dispatch API, auto-clicking Allow button to execute commands without user interaction. Proof-of-concept demonstrated npm install -g add-colors-to-bash execution (opened Calculator app). Attack can reach other machines logged into same Claude account. Anthropic announced Dispatch retirement. No evidence of in-the-wild exploitation; marked borderline as researcher disclosure only.

Evidence qualification: Researcher disclosure; no evidence of in-the-wild exploitation; Anthropic retiring Dispatch feature

## Category
attacks-on-ai

## Attribution
Researcher disclosure (Gal Weizman, Forever Security); no threat actor

- Actor: Researcher disclosure only
- Country: Unknown
- Motivation: unknown
- Attributed by: Forever Security
- Confidence: low

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Malicious browser extension on claude.ai domain
- Victims and sectors: Claude Desktop users; theoretical risk only (no in-wild use)
- Regions: unknown
- Region notes: unknown
- Scale and metrics: PoC only; Anthropic retiring Dispatch; no in-wild exploitation documented

## Attack flow
### install-extension: Malicious extension installed (access)

User installs malicious browser extension with claude.ai permissions

Evidence: <https://forever.security/blog/thisbash-claude-dispatch-browser-extension-rce/>

### push-prompt: Extension pushes prompt via Dispatch (ai)

Extension uses Dispatch API to push command prompt to Claude Desktop

Evidence: <https://forever.security/blog/thisbash-claude-dispatch-browser-extension-rce/>

### auto-allow: Auto-click Allow button (execution)

Extension automatically clicks Allow to bypass user consent

Evidence: <https://forever.security/blog/thisbash-claude-dispatch-browser-extension-rce/>

### execute-command: Execute arbitrary command (impact)

Command executes on Claude Desktop (PoC: npm install -g add-colors-to-bash)

Evidence: <https://forever.security/blog/thisbash-claude-dispatch-browser-extension-rce/>

### Connections

- install-extension -> push-prompt
- push-prompt -> auto-allow
- auto-allow -> execute-command

## MITRE ATLAS
- [AML.T0051](https://atlas.mitre.org/techniques/AML.T0051) LLM Prompt Injection — Browser extension could inject prompts to Claude Desktop via Dispatch
  Evidence: <https://forever.security/blog/thisbash-claude-dispatch-browser-extension-rce/>
- [AML.T0053](https://atlas.mitre.org/techniques/AML.T0053) AI Agent Tool Invocation — Auto-click Allow bypasses user consent for command execution
  Evidence: <https://forever.security/blog/thisbash-claude-dispatch-browser-extension-rce/>

## Prevention
Anthropic retiring Dispatch feature; users should update Claude Desktop when patch available; review browser extensions on claude.ai; implement extension permission review

## Detections
- Claude Dispatch security monitoring (guidance) — Monitor browser extensions with claude.ai permissions; detect auto-clicking behaviors; log Dispatch API calls; update Claude Desktop when Dispatch retirement patch available; review extension permissions regularly

## Timeline
- First seen: 2026-11-06
- Last updated: 2026-11-06
- 2026-11-06 (Forever Security): Gal Weizman discloses ThisBash vulnerability; Anthropic announces Dispatch retirement; no in-wild exploitation

## Tools
### AI tooling and models
- [Claude Desktop](https://claude.com/product/overview)
- [Claude](https://claude.com/product/overview) Dispatch API

### Other tooling
- Browser extension
- npm

## Source notes
Forever Security blog (Nov 6, 2026); researcher disclosure only; no threat actor or in-wild use; Anthropic announced Dispatch retirement

## Sources
- [Forever Security: ThisBash - Claude Dispatch Browser Extension RCE](https://forever.security/blog/thisbash-claude-dispatch-browser-extension-rce/) — Forever Security
