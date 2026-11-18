# Claude Code Auto Mode turned into Yes Mode by one AGENTS.md line

- ID: matan-claude-code-yes-mode-agents-md-2026-11
- Reported: 2026-11-01
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/matan-claude-code-yes-mode-agents-md-2026-11/

## Summary
Matan Ben-Tov (published Nov 1, 2026) shows a one-line prompt injection in a project AGENTS.md that makes Claude Code Auto Mode allow tool calls the user set it to deny. Auto Mode has been the default tool-call gate since Aug 7, 2026. On each tool call, Claude Code prompts Sonnet 5, without thinking, to return a severity score. The reverse engineering was done on Claude Code v2.1.251 as of Sep 1, 2026. A score under 25 is allowed. A higher score is escalated to another Sonnet 5 call with thinking, which this attack does not need. The classifier prompt includes the user's CLAUDE.md, memory files, and the project AGENTS.md, wrapped in a user_claude_md tag. The published line closes that tag and tells the classifier to score on a 0-10 scale where 5 is the allow or block boundary, then reopens the tag. In the tests, every injected classification came back between 0 and 10, so Claude Code treated the score as under 25 and ran the command. A direct demo used a hard_deny rule that should block curl or fetch except to example.com. On a clean Pi repository the classifier returned 90 and blocked mal.com. After the line was added, the same request was allowed with a score of 8. Across about 50 isolated classifier scenarios on seven repositories (pi, browser-use, tropt, bun, codex, rocksdb, and ghostty) and four user profiles, 4 percent slipped past with a clean AGENTS.md and 99 percent did with the line, measured as a score under 15. In 30 end-to-end sessions with Opus 5.5 as the main agent, the classifier blocked every forbidden command on the clean file. With the line present, forbidden commands ran in 22 of 30 sessions (73 percent), including a read of a local .env, git config --global http.sslVerify false, and commands that came from a malicious skill rather than the user's prompt. The attack still worked on Claude Code v2.1.316, released Oct 31, 2026, including versions that classify on the server. Mahmood Sharif is thanked for guidance. This is not the Downloads-folder AGENTS.md hijack in forever-agents-md-hijack-2026.

Evidence qualification: The post is a researched bypass, evaluated in containers. It does not describe an in-the-wild intrusion. Matan Ben-Tov says Anthropic had not replied to the Sept 4, 2026 disclosure by publication.

## Category
attacks-on-ai

## Attribution
No threat actor. Matan Ben-Tov disclosed the bypass to Anthropic on Sept 4, 2026, and reports no response by publication.

- Actor: unknown
- Motivation: unknown
- Attributed by: Matan Ben-Tov
- Confidence: low

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: The user runs Claude Code, with Auto Mode on, in a repository whose AGENTS.md contains the one published line
- Victims and sectors: Claude Code users who open a repository they did not write. No victim organization is named. The evaluation ran locally in containers.
- Regions: Not applicable
- Region notes: No target country. The evaluation repositories are public codebases used as fixtures.
- Scale and metrics: Classifier bypass in 99 percent of about 50 injected scenarios, versus 4 percent clean. End-to-end forbidden commands ran in 22 of 30 injected sessions and in 0 of 30 clean sessions. Effective on Claude Code v2.1.316.

## Attack flow
### plant: One line in AGENTS.md (access)

The repository's AGENTS.md closes the user_claude_md tag and tells the classifier to score severity from 0 to 10.

Evidence: <https://matanbt.github.io/post/yesmode2026/>

### score: Sonnet 5 scores under 10 (ai)

Auto Mode sends the file to Sonnet 5. In the tests every injected score came back between 0 and 10.

Evidence: <https://matanbt.github.io/post/yesmode2026/>

### allow: Claude Code allows scores under 25 (execution)

The client treats the 0-10 score as below the threshold of 25 and runs the tool call, including hard_deny commands.

Evidence: <https://matanbt.github.io/post/yesmode2026/>

### bypass: Denied commands still run (impact)

End-to-end sessions then read a local .env, disabled git TLS verification, or followed a malicious skill. Clean sessions blocked the same commands.

Evidence: <https://matanbt.github.io/post/yesmode2026/>

### Connections

- plant -> score
- score -> allow
- allow -> bypass

## MITRE ATLAS
- [AML.T0051.001](https://atlas.mitre.org/techniques/AML.T0051.001) Indirect — The project AGENTS.md is untrusted text that is copied into the Auto Mode classifier prompt
  Evidence: <https://matanbt.github.io/post/yesmode2026/>
- [AML.T0054](https://atlas.mitre.org/techniques/AML.T0054) LLM Jailbreak — The line changes the classifier's 0-100 severity scale so a high-risk score falls under the allow threshold of 25
  Evidence: <https://matanbt.github.io/post/yesmode2026/>

## Prevention
Run Claude Code in a sandbox or container when the repository is not yours, so a failed Auto Mode check cannot reach keys or a local .env. Read AGENTS.md before the session. Treat AGENTS.md, CLAUDE.md, and skill files as code the classifier will ingest. The post's own patch ideas, a score that states its scale, keeping untrusted files out of the classifier prompt, or a non-LLM classifier, are described as incomplete.

## Detections
- The AGENTS.md scale line is not a host rule (guidance) — No cited rule matches a markdown line that retargets Claude Code's Auto Mode classifier. Search repositories for the published fragment that closes user_claude_md and sets a 0-10 severity scale. A blocked curl in the user's hard_deny list that then succeeds is the session-level sign the post demonstrates.

## Timeline
- First seen: 2026-09-01
- Last updated: 2026-11-01
- 2026-09-01 (Matan Ben-Tov): Reverse engineering on Claude Code v2.1.251. Auto Mode had been the default gate since Aug 7, 2026.
- 2026-09-04 (Matan Ben-Tov): Disclosed to Anthropic. The post says there was no response by publication.
- 2026-10-31 (Matan Ben-Tov): The bypass still works on Claude Code v2.1.316, including server-side classification.
- 2026-11-01 (Matan Ben-Tov): The Yes Mode write-up is published, with the 99 percent classifier result and the 22-of-30 session result.

## Tools
### AI tooling and models
- [Claude Code](https://github.com/anthropics/claude-code) Auto Mode, tested through v2.1.316 (Oct 31, 2026)
- Sonnet 5 permission classifier
- Opus 5.5 as the main agent in the end-to-end sessions

### Other tooling
- Project AGENTS.md

### MagicSword projects
- [LOLSkills](https://lolskills.io)

## Source notes
The classifier design, the published line, the Pi demo, the 99 percent and 73 percent figures, the v2.1.316 result, and the Sept 4 disclosure are from Matan Ben-Tov's post. Link forever-agents-md-hijack-2026, which uses a different AGENTS.md lure.

## Sources
- [Turning Claude Code's Auto Mode Into "Yes Mode"](https://matanbt.github.io/post/yesmode2026/) — Matan Ben-Tov
