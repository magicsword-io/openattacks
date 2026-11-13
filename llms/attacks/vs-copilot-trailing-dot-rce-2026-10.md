# Visual Studio / SSMS Copilot trailing-dot RCE (CVE-2026-103572)

- ID: vs-copilot-trailing-dot-rce-2026-10
- Reported: 2026-10-13
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/vs-copilot-trailing-dot-rce-2026-10/

## Summary
Copilot edit guard blocked writes to .mcp.json via string compare. Writing '.mcp.json.' bypasses check; Win32 strips trailing dot so write lands on real MCP config → RCE via MCP server command or ripgrepPath pointing at arbitrary binary. Chainable via indirect prompt injection from a file or MCP server. Shared Microsoft.VisualStudio.Copilot.Core.dll affects VS 2022/2026 and SSMS. Patched with GetFullPath.

## Category
attacks-on-ai

## Attribution
Vulnerability research; CVE-2026-103572 CVSS 8.8 Important

- Actor: Vulnerability research

## AI involvement confidence
confirmed

## Attack flow
### step-1: Untrusted instructions reach Copilot (access)

A file or MCP server supplies indirect instructions.

Evidence: <https://embracethered.com/blog/posts/2026/visual-studio-copilot-remote-code-execution/>

### step-2: Agent edits a protected configuration name (ai)

Writing .mcp.json. bypasses a string-based edit check.

Evidence: <https://embracethered.com/blog/posts/2026/visual-studio-copilot-remote-code-execution/>

### step-3: Windows normalizes the trailing dot (execution)

The write reaches the real MCP configuration or executable-path setting.

Evidence: <https://embracethered.com/blog/posts/2026/visual-studio-copilot-remote-code-execution/>

### step-4: Attacker-chosen command runs (impact)

The changed MCP startup command or binary path enables code execution.

Evidence: <https://embracethered.com/blog/posts/2026/visual-studio-copilot-remote-code-execution/>

### Connections

- step-1 -> step-2
- step-2 -> step-3
- step-3 -> step-4

## MITRE ATLAS
- [AML.T0051.001](https://atlas.mitre.org/techniques/AML.T0051.001) Indirect — Files or MCP responses can inject the editing instructions.
  Evidence: <https://embracethered.com/blog/posts/2026/visual-studio-copilot-remote-code-execution/>
- [AML.T0081](https://atlas.mitre.org/techniques/AML.T0081) Modify AI Agent Configuration — The resulting edit modifies MCP startup or executable configuration.
  Evidence: <https://embracethered.com/blog/posts/2026/visual-studio-copilot-remote-code-execution/>

## Prevention
Patch VS/SSMS; alert on Copilot writes to .mcp.json / settings.VisualStudio.json; watch devenv/Ssms spawning unexpected binaries

## Detections
- Review attack-specific indicators (guidance) — Monitor for the techniques described in Visual Studio / SSMS Copilot trailing-dot RCE (CVE-2026-103572). Refer to sources for specific IOCs and TTPs.

## Timeline
No timeline is recorded.

## Tools
### AI tooling and models
- [GitHub Copilot](https://github.com/features/copilot) in Visual Studio / SSMS
- MAI-Code-1-Flash (PoC model)

### Other tooling
- MCP config
- ripgrepPath setting

## Sources
- <https://embracethered.com/blog/posts/2026/visual-studio-copilot-remote-code-execution/>
