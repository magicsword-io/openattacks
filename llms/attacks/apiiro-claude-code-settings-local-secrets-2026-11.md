# Apiiro finds Claude Code settings.local.json secrets in 1,122 public GitHub copies

- ID: apiiro-claude-code-settings-local-secrets-2026-11
- Reported: 2026-11-05
- AI role: ai_credential_theft
- Entry: https://openattacks.ai/attacks/apiiro-claude-code-settings-local-secrets-2026-11/

## Summary
Apiiro (published Nov 5, 2026; updated Nov 8) searched public GitHub from Nov 1 to Nov 3, 2026, and found 104,185 copies of .claude/settings.local.json in 103,617 repositories. Of those, 1,122 files (1.1 percent) held at least one secret the researchers counted, 1,379 distinct secrets in that file alone: 636 provider-format keys and 743 passwords or tokens next to a public host. The count includes 379 database passwords, 122 Supabase service-role keys, 43 SSH logins for public servers, 42 GitHub, GitLab, and npm tokens, 23 AWS keys, and 6 private keys. Adding history, the shared .claude/settings.json file, and saved agent transcripts brings the total to 2,539 distinct secrets in 1,994 repositories. The mechanism is Claude Code's own permission prompt. If the user picks Yes, and don't ask again, the allow rule stored in the project file can be the exact command, so a password after PGPASSWORD= or sshpass -p is written in plain text. Apiiro reproduced that with Opus 5.5 and Fable 5.1. The first time Claude Code creates the file inside a git repository it adds the path to the user's global git excludes. That rule stays on one computer, does not cover a folder that becomes a repository later, and is never written to the project's .gitignore. If the file is already tracked, later approvals are appended and the user is not told. In 539 of 1,105 repositories with a secret that Apiiro traced, a commit co-authored by Claude changed the file. On Nov 2, 2026 every secret-bearing copy Apiiro checked was still on the default branch. The median repository had first committed it 217 days earlier. Deleting the file left 734 further secrets in history across 509 repositories, and 211 forks of 74 repositories carried the same secrets. gitleaks flagged 564 of the 1,122 files and TruffleHog 643. Neither flagged 215. Apiiro names 63 organizations and says one confirmed a notified key had been live. No credential was tested. Boris Cherny, head of Claude Code, wrote on Hacker News on Nov 7 that the team was looking at auto mode and basic secret scanning, and that he believed exposed copies had been created manually. A separate SANS Internet Storm Center diary by Manuel Humberto Santander Peláez (July 13, 2026) records internet scans for /.claude/settings.local.json, /.claude/mcp.json, and /.cursor/mcp.json on an ordinary web host. That diary does not attribute the scans to this GitHub corpus.

## Category
attacks-on-ai

## Attribution
No named actor for the GitHub copies. The exposure is Claude Code writing secrets into a file that git then publishes. The July 2026 ISC diary documents separate scanning for the same paths.

- Actor: unknown
- Motivation: unknown
- Attributed by: Apiiro
- Confidence: low

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: A developer approves an exact Claude Code shell command that contains a secret. The settings file is later committed, or was already tracked, so the secret is in a public repository and its history.
- Victims and sectors: 63 organizations with a counted secret in a public allow list, plus individual developers. Apiiro's table includes a database vendor, a medical-records application, and other software companies. No organization is named.
- Regions: unknown
- Region notes: Apiiro does not name the countries of the 63 organizations. Public GitHub is not a victim region.
- Scale and metrics: 104,185 public copies, 1,122 with a counted secret, 1,379 secrets in the current file, 2,539 secrets across 1,994 repositories once history, shared settings, and transcripts are included. 539 of 1,105 traced repositories had a Claude co-authored commit touching the file.

## Attack flow
### approve: Yes, and don't ask again (access)

Claude Code proposes a shell command that already contains a secret from config or .env. The user approves that exact command for good.

Evidence: <https://apiiro.com/blog/coding-agents-leaking-secrets-github-dont-ask-again>

### save: The command is saved in settings.local.json (ai)

The allow rule can be the full command line. Global git excludes hide the file on that one computer and are not written into the repository .gitignore.

Evidence: <https://apiiro.com/blog/coding-agents-leaking-secrets-github-dont-ask-again>

### commit: The file is committed (execution)

In 539 of 1,105 traced repositories with a secret, a commit co-authored by Claude changed the file. History and forks keep copies after deletion.

Evidence: <https://apiiro.com/blog/coding-agents-leaking-secrets-github-dont-ask-again>

### public: 1,122 public copies hold a secret (impact)

Apiiro counted 1,379 secrets in current copies and 2,539 once history, shared settings, and transcripts are included. A July 2026 ISC diary also shows scans for this path on web servers.

Evidence: <https://apiiro.com/blog/coding-agents-leaking-secrets-github-dont-ask-again> <https://isc.sans.edu/diary/33150>

### Connections

- approve -> save
- save -> commit
- commit -> public

## MITRE ATLAS
- [AML.T0055](https://atlas.mitre.org/techniques/AML.T0055) Unsecured Credentials — Yes, and don't ask again can store the approved command, including a password or token, in the project settings file
  Evidence: <https://apiiro.com/blog/coding-agents-leaking-secrets-github-dont-ask-again>
- [AML.T0010.001](https://atlas.mitre.org/techniques/AML.T0010.001) AI Software — The file is written by Claude Code and then committed, including in commits Apiiro says were co-authored by Claude
  Evidence: <https://apiiro.com/blog/coding-agents-leaking-secrets-github-dont-ask-again>

## Prevention
Search the organization for .claude/settings.local.json and .claude/settings.json, including git history, and rotate every secret those files ever held before deleting them. Add the local file to each repository .gitignore. Approve command patterns instead of one exact command, and reference secrets as variables such as $DB_URL so the saved rule does not hold the value. Scanners that only match known key formats miss passwords after PGPASSWORD=, sshpass -p, and mysql -p.

## Detections
- settings.local.json secrets are a repository search, not a host rule (guidance) — No cited endpoint rule matches a git commit of .claude/settings.local.json. Search organizations for that file and for .claude/settings.json, including history. gitleaks and TruffleHog, run by Apiiro without their verification step, missed 215 of the 1,122 files, mostly passwords inside PGPASSWORD=, sshpass -p, and mysql -p. The July 2026 ISC diary is a web-root scan for the same path, which is a different place than a GitHub commit.

## Timeline
- First seen: 2025-08-11
- Last updated: 2026-11-08
- 2025-08-11 (Apiiro): Apiiro cites a Claude Code issue, filed this day, that described approved commands with tokens being stored in settings.local.json. Later issues were closed without an Anthropic reply.
- 2026-07-13 (SANS Internet Storm Center): Manuel Humberto Santander Peláez records scans for /.claude/settings.local.json and related MCP config paths on a small web host.
- 2026-11-02 (Apiiro): Organization notices go out Nov 2 and 3. Every secret-bearing file Apiiro checked was still on the default branch.
- 2026-11-05 (Apiiro): Apiiro publishes the GitHub census, 1,122 files and 2,539 secrets across all sources they counted.
- 2026-11-08 (Apiiro): The post adds Boris Cherny's Nov 7 Hacker News reply. He said the team was looking at auto mode and basic secret scanning.

## Tools
### AI tooling and models
- [Claude Code](https://github.com/anthropics/claude-code) permission prompt, Yes and don't ask again
- .claude/settings.local.json and shared .claude/settings.json
- Opus 5.5 and Fable 5.1, used when Apiiro reproduced the save

### Other tooling
- git global excludes, which do not travel with the repository

## Source notes
Counts, dates, the git-exclude behavior, the scanner gap, and Boris Cherny's Nov 7 comment are from the Apiiro post. Organization names are not in that post and are not added here. The July 13, 2026 path list is from the SANS ISC diary by Manuel Humberto Santander Peláez. The diary does not say those scans started the weekend of the Apiiro post.

## Sources
- [Coding Agents Are Leaking Your Secrets to GitHub](https://apiiro.com/blog/coding-agents-leaking-secrets-github-dont-ask-again) — Apiiro
- [Someone Is Scanning for Your MCP Servers and AI Assistant Credentials](https://isc.sans.edu/diary/33150) — SANS Internet Storm Center
