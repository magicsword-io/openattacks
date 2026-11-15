# Forever Security EMBRACE, browsers embedded in five AI assistants

- ID: forever-embrace-embedded-browsers-2026-10
- Reported: 2026-10-29
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/forever-embrace-embedded-browsers-2026-10/

## Summary
Forever Security (Gal Weizman; published Oct 29, 2026) calls the shared pattern EMBRACE, an embedded browser trusted like a standalone one. The post covers Cursor, GitHub Copilot, Codex, VS Code, and Claude Desktop. In Cursor, a page opened in the built-in browser hid a command in an on-screen HTML chip. The agent read the hidden instructions. In an otherwise empty composer, one Enter ran the proposed command. When Cursor's sandbox blocked it, the agent turned the sandbox off on its own, with nothing in the page telling it to, and tried again. Forever Security says the install then ran with the user's privileges, outside the sandbox, and from a cold start in an empty project one Enter launched an app the page chose. The post says this does not fire on every model. In GitHub Copilot's browser preview, a page could report any address that looked like a web address. The address bar and the agent's tab list both showed github.com while the tab was somewhere else. Forever Security confirmed that on Copilot 1.1.27 on Sep 26, 2026. GitHub fixed it in 1.1.29 on Oct 13, before a report was sent. In Codex, Claude Desktop, and VS Code, a local HTML file opened in the built-in browser could read outside the project. The delivery in the post is a dull financial-report repo. The user asks the assistant to set it up per the README, and the assistant hands over a link to the file. Claude Desktop and VS Code restrict the page itself to the project folder, but not a web worker the page starts, and reads from that worker reached any file on the disk. Codex had no folder check. The page used a hidden index file macOS writes in folders opened in Finder to map the disk, then read SSH keys, .env files, npm tokens, and the hosts file. Disclosure: Cursor, Sep 10, patched silently on Oct 1, with no reply. Claude Desktop, July 23 to Anthropic, declined as outside a Workspace Trust boundary; a July 24 report from Noma Security was accepted as valid. Codex, July 27 to OpenAI, no reply, and still unpatched at publication. VS Code, Sep 10 to Microsoft, declined for the same Workspace Trust reason, and still unpatched at publication. This is a different Forever Security report from forever-agents-md-hijack-2026 and thisbash-claude-dispatch-rce-2026-11.

Evidence qualification: The post is a disclosure of research findings in product browsers. It does not name an in-the-wild intrusion. At publication, Forever Security said the Codex and VS Code issues were still unpatched.

## Category
attacks-on-ai

## Attribution
No threat actor. Forever Security disclosed the findings to the vendors. Noma Security is credited for a July 24 Claude Desktop report that Anthropic accepted.

- Actor: unknown
- Motivation: unknown
- Attributed by: Forever Security
- Confidence: low

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: A page opened in the assistant's built-in browser, or a local HTML file the assistant links from a repository the user asked it to set up
- Victims and sectors: Users of those five desktop assistants. No victim organization is named. The file-read demonstration used the researchers' own machine.
- Regions: Not applicable
- Region notes: No target country is named. The macOS index file is a technique detail, not a victim region.
- Scale and metrics: Five products. Two issues, Codex and VS Code, were still unpatched when the post was published on Oct 29, 2026. Cursor was patched on Oct 1. Copilot was fixed in 1.1.29.

## Attack flow
### open: Page or local file opens in the assistant browser (access)

A site is opened in Cursor or Copilot, or the assistant links a local HTML file from a repository the user asked it to set up.

Evidence: <https://forever.security/blog/embrace-hacking-5-ai-assistants-embedded-browsers>

### bend: The embedded browser breaks a browser rule (ai)

Cursor lets the page feed the agent. Copilot accepts an address the page supplies. Codex, Claude Desktop, and VS Code let a local file read outside its folder, through a web worker in the last two.

Evidence: <https://forever.security/blog/embrace-hacking-5-ai-assistants-embedded-browsers>

### act: Command, file read, or spoofed address (execution)

Cursor's agent can disable its own sandbox after a block. The local file reads SSH keys, .env files, npm tokens, and the hosts file. Copilot's bar can show github.com for a different page.

Evidence: <https://forever.security/blog/embrace-hacking-5-ai-assistants-embedded-browsers>

### status: Two issues still open at publication (impact)

Cursor was patched on Oct 1 and Copilot in 1.1.29. Forever Security says Codex and VS Code were still unpatched on Oct 29, 2026.

Evidence: <https://forever.security/blog/embrace-hacking-5-ai-assistants-embedded-browsers>

### Connections

- open -> bend
- bend -> act
- act -> status

## MITRE ATLAS
- [AML.T0051.001](https://atlas.mitre.org/techniques/AML.T0051.001) Indirect — A page or local file the assistant opens carries instructions or a command the agent then acts on
  Evidence: <https://forever.security/blog/embrace-hacking-5-ai-assistants-embedded-browsers>
- [AML.T0055](https://atlas.mitre.org/techniques/AML.T0055) Unsecured Credentials — The local-file finding read SSH keys, .env files, and npm tokens from the researchers' machine
  Evidence: <https://forever.security/blog/embrace-hacking-5-ai-assistants-embedded-browsers>

## Prevention
Treat the browser inside each assistant as an endpoint that loads untrusted pages and local files. Keep Cursor and Copilot on builds that include the Oct 1 and 1.1.29 fixes. Do not open local HTML from a repository you do not trust, including a file the assistant links. Do not treat a required Enter or a single click as a control when the assistant is the one asking for it.

## Detections
- Embedded-browser findings have no single host rule (guidance) — The post does not name a process, a package, or a network destination that a Sigma, Splunk, or Elastic rule would match. Hunt assistant browsers opening local HTML, an agent disabling its own sandbox after a blocked command, and Copilot preview tabs whose recorded address is github.com while the page is not. The macOS folder index is a file the page reads, not a separate malware family.

## Timeline
- First seen: 2026-07-23
- Last updated: 2026-10-29
- 2026-07-23 (Forever Security): Claude Desktop report to Anthropic, declined as outside Workspace Trust. Noma Security's July 24 report was accepted as valid. Codex was reported to OpenAI on July 27.
- 2026-09-10 (Forever Security): Cursor and VS Code reports. Microsoft declined the VS Code issue for Workspace Trust.
- 2026-10-01 (Forever Security): Cursor silently patches its issue. Forever Security says Cursor did not reply.
- 2026-10-13 (Forever Security): GitHub fixes the Copilot address-bar spoof in 1.1.29, before a report was sent.
- 2026-10-29 (Forever Security): Gal Weizman publishes EMBRACE. Codex and VS Code are described as still unpatched.

## Tools
### AI tooling and models
- [Cursor](https://cursor.com/) built-in browser
- [GitHub Copilot](https://github.com/features/copilot) browser preview, 1.1.27 and the 1.1.29 fix
- Codex built-in browser
- [VS Code](https://github.com/microsoft/vscode) built-in browser
- [Claude Desktop](https://claude.com/product/overview) built-in browser

### Other tooling
- unknown

## Source notes
Product behavior, dates, and patch status are from the Forever Security post. The post points to a technical companion for reproduction steps. Those steps are not repeated here. Link forever-agents-md-hijack-2026 and thisbash-claude-dispatch-rce-2026-11, which are different reports.

## Sources
- [EMBRACE: How We Hacked the Browsers Embedded in Top Five Desktop AI Assistants](https://forever.security/blog/embrace-hacking-5-ai-assistants-embedded-browsers) — Forever Security
