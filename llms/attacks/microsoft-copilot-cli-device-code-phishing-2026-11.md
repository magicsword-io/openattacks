# Microsoft: one phished GitHub device code lets an attacker steer a Copilot CLI session, poison its memory and read synced sessions

- ID: microsoft-copilot-cli-device-code-phishing-2026-11
- Reported: 2026-11-17
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/microsoft-copilot-cli-device-code-phishing-2026-11/

## Summary
Microsoft Security Research (Uri Oren and Dor Edry, 17 November 2026) ran a controlled lab simulation in which a test account approved a GitHub OAuth device-code request started by an attacker-controlled client using the public GitHub Copilot CLI client ID. The verification page is the real github.com page, and the authorization shows the legitimate application name. The requested scopes were repo, read:user, read:org, gist and codespace, chosen by the client that starts the flow. With that one approval the researchers could (1) steer an active Copilot CLI session remotely when the user had enabled remote control and policy allowed it, and have the agent run a command on the test machine subject to its approval prompts and OS permissions, (2) add misleading entries to Copilot Memory with the /memory command so they could influence later interactions, (3) read Copilot CLI sessions synced to the cloud, including sessions from before the simulation, and (4) access private repositories available to the account. Microsoft states these are proof-of-concept outcomes of features working as designed and that it has not observed them in earlier device-code campaigns (Storm-2372, the 2026 AI-enabled campaign, EvilTokens) or in the wild. Remote control is off by default and is enabled with remoteSessions in ~/.copilot/settings.json; enterprises can set remoteControl.mode to disabled or requireSSO.

## Category
attacks-on-ai

## Attribution
Vulnerability and abuse research by Microsoft Security Research; not an attributed campaign

- Actor: Vulnerability research

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Device code phishing (email or Microsoft Teams lure carrying a GitHub verification link and an attacker-generated code)
- Victims and sectors: Developers using GitHub Copilot CLI (lab simulation, no victims)
- Regions: unknown
- Region notes: Lab research; no victim geography.
- Scale and metrics: Proof of concept only. Two Microsoft Defender XDR detections shipped: Suspected GitHub Copilot CLI device code phishing via email, and via Microsoft Teams. Defender can disrupt by suspending the affected GitHub Enterprise Managed User.

## Attack flow
### step-1: Attacker starts a device-code sign-in (access)

An attacker-controlled client requests a GitHub device code with the public Copilot CLI client ID and chooses the scopes.

Evidence: <https://www.microsoft.com/en-us/security/blog/2026/11/17/the-risks-of-device-code-authentication-for-ai-coding-agents/>

### step-2: Victim approves the code on github.com (access)

A lure framed as an IT request or Copilot license check sends the code and the real verification link; the victim approves.

Evidence: <https://www.microsoft.com/en-us/security/blog/2026/11/17/the-risks-of-device-code-authentication-for-ai-coding-agents/>

### step-3: Attacker steers the running agent session (ai)

With remote control enabled, the attacker interacts with the active Copilot CLI session and has the agent run a command, subject to local approvals.

Evidence: <https://www.microsoft.com/en-us/security/blog/2026/11/17/the-risks-of-device-code-authentication-for-ai-coding-agents/>

### step-4: Memory poisoning and session read-back (ai)

The attacker writes misleading Copilot Memory entries with /memory and reads cloud-synced sessions.

Evidence: <https://www.microsoft.com/en-us/security/blog/2026/11/17/the-risks-of-device-code-authentication-for-ai-coding-agents/>

### step-5: Private repository access (impact)

The token reaches private repositories available to the account.

Evidence: <https://www.microsoft.com/en-us/security/blog/2026/11/17/the-risks-of-device-code-authentication-for-ai-coding-agents/>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-2 -> step-4
- step-2 -> step-5

## MITRE ATLAS
- [AML.T0052](https://atlas.mitre.org/techniques/AML.T0052) Phishing — An email or Microsoft Teams lure carries a GitHub verification link and an attacker-generated device code.
  Evidence: <https://www.microsoft.com/en-us/security/blog/2026/11/17/the-risks-of-device-code-authentication-for-ai-coding-agents/>
- [AML.T0053](https://atlas.mitre.org/techniques/AML.T0053) AI Agent Tool Invocation — With remote control enabled, the attacker steers the Copilot CLI session and has the agent run a command, subject to local approvals.
  Evidence: <https://www.microsoft.com/en-us/security/blog/2026/11/17/the-risks-of-device-code-authentication-for-ai-coding-agents/>
- [AML.T0080.000](https://atlas.mitre.org/techniques/AML.T0080.000) Memory — The attacker adds misleading Copilot Memory entries with /memory so they can influence later interactions.
  Evidence: <https://www.microsoft.com/en-us/security/blog/2026/11/17/the-risks-of-device-code-authentication-for-ai-coding-agents/>
- [AML.T0085](https://atlas.mitre.org/techniques/AML.T0085) Data from AI Services — The approved token can read Copilot CLI sessions synced to the cloud, including sessions from before the simulation.
  Evidence: <https://www.microsoft.com/en-us/security/blog/2026/11/17/the-risks-of-device-code-authentication-for-ai-coding-agents/>

## Prevention
Approve only device codes you started yourself. Set the GitHub Store local sessions in the Cloud policy and remoteControl.mode to the least permissive option (disabled or requireSSO). Review and revoke unexpected GitHub OAuth authorizations, limit repository roles, and review saved Copilot Memory entries during incident response, since disabling memory does not delete stored entries.

## Detections
- Suspected GitHub Copilot CLI device code phishing via email (guidance) — Microsoft Defender XDR alert correlating suspicious messages and clicks with GitHub OAuth token creation and regeneration (T1566.002, T1528).
- Suspected GitHub Copilot CLI device code phishing via Microsoft Teams (guidance) — Microsoft Defender XDR alert for the Teams-delivered variant; requires the GitHub Enterprise Cloud connector in Defender for Cloud Apps.

## Timeline
- First seen: 2026-11-17
- Last updated: 2026-11-17
- 2026-11-17 (Microsoft Security Research): Uri Oren and Dor Edry publish a controlled lab simulation. Microsoft states the outcomes were not observed in earlier device-code campaigns or in the wild, and that two Defender XDR detections shipped.

## Tools
### AI tooling and models
- [GitHub Copilot](https://github.com/features/copilot) CLI (target)
- Copilot Memory (target)

### Other tooling
- GitHub OAuth device authorization flow
- Copilot CLI remote control / cloud session storage

## Source notes
unknown

## Sources
- [The risks of device code authentication for AI coding agents](https://www.microsoft.com/en-us/security/blog/2026/11/17/the-risks-of-device-code-authentication-for-ai-coding-agents/) — Microsoft
- [Protect AI agents from trusted-identity attacks (preview)](https://learn.microsoft.com/en-us/defender-xdr/security-for-ai/protect-ai-agents-from-trusted-identity-attacks) — Microsoft Learn
- [Steering a GitHub Copilot CLI session from another device](https://docs.github.com/en/copilot/how-tos/copilot-cli/use-copilot-cli/steer-remotely) — GitHub Docs
