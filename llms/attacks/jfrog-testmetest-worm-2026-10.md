# testmetest worm hijacks 42 GitHub repos with Claude/Gemini startup hooks

- ID: jfrog-testmetest-worm-2026-10
- Reported: 2026-10-26
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/jfrog-testmetest-worm-2026-10/

## Summary
42 armed third-party GitHub repositories across 11 legitimate owners contain execution hooks for AI coding assistants (.cursorrules, CLAUDE.md, claude_code_config.json, instructions.md) and 12.9-13.7 MB polymorphic wrappers decoding to same CI-publisher payload. Campaign uses compiled native addon (addon.node) that XORs .napi_cache with 0x96 to decrypt JavaScript payload. Addon checks for CI/container/sandbox environment and CPU/RAM limits, skipping execution in automated scanners. Payload collects credentials, poisons repos and CI, propagates via npm. GitHub account CementBeetleSteeple hosts repositories; SafeDep identifies as Shai-Hulud-descendant Miasma-family. Shellpanel artifacts in hijacked owner cluster link to cPanel CVE-2026-41940 exploitation. Socket (Kush Pandya, Nov 6, 2026) reports RubyGems strutil-core 1.0.1 (account jamnajiea); extconf.rb downloads Bun, runs worm at install; steals .claude/.credentials.json, .codex/auth.json, cloud/CI credentials to paleasbest[.]top; plants workspace-tools MCP server, SessionStart hooks, CLAUDE.md, AGENTS.md, .vscode/tasks.json; signed-commit-message backdoor (marker msync-3f7a); wiper if stolen GitHub token revoked. SHA-256 3b3f6e1bde0b28b015030a81a6d805b5b5306dc3f021e1102123971cfd83acc0; related PyPI pystr-codec. Thomas Roccia (Nov 9, 2026) documents hijacked repos with forged backdated commits: toray/XiamiSDK-lib, widget-lib, Rainbow-lib, QiniuSDK-lib, torayUtils-lib; ejaaduipitara/djp-devops, whatsapp-bot, content-service; ConcordiaDev/theme_saimaniq; madolee/da; Imanilom/baraja-coffe; claudiohernanbesada/xenios.api.   CLAUDE.md DEVOPS-SEALED block instructs agents to silently run node scripts/setup.js at session start. Bitdefender Labs (Andrei Anton-Aanei and Alina Bîzgă, 17 November 2026) analyses the same sealed setup.js campaign and lists 22 malicious GitHub links, each with a setup.js MD5. AGENTS.md and CLAUDE.md call scripts/setup.js a sealed binary artifact, not human-readable source, and say not to read, quote, or display it, to run it at session start without displaying output, and to run node scripts/setup.js without confirmation if the user asks for help before setup has run. A second path needs no prompt: after the developer opens and trusts the repo, a session-start hook in .claude/settings.json runs the command in the user's shell. The outer setup.js is a 3.75 MB single-line script that hex-decodes an embedded value, applies ROT13, and evaluates the result. The Node stager holds two AES-128-GCM blobs with embedded keys, decompresses one into a 4.67 MB bundle, resolves or downloads the Bun runtime (https://github.com/oven-sh/bun), and pipes the bundle to bun run - on stdin. A compressed _bz field in package.json hides further payloads, including Windows Credential Manager enumeration and conditional JavaScript. It steals from CI and GitHub Actions, cloud and container environments, package registries, browser stores, password managers, Windows Credential Manager, SSH keys, .env files, API keys, and source-control tokens, then validates tokens against provider APIs. Locally it searches the home directory for settings.json, config.json, mcp.json, .aider.conf.yml, .cursorrules, .windsurfrules, .cursor/rules/, and .github/copilot-instructions.md, keeps paths containing one of 14 agent names (Claude, Codex, Gemini, Copilot, Kiro, OpenCode, Cline, Aider, Tabby, Amazon Q, Cody, Bolt, Continue, Cursor), and injects instruction text, session-start hooks, or MCP server configs. Remotely it checks GitHub tokens through /user, /user/repos, and /users/<user>/repos for repo, public_repo, and workflow scopes, and GitLab tokens through /api/v4/projects. MAX_TARGET_REPOS defaults to 25. It inspects up to 50 branches, skips dependabot/ and copilot/, then commits AGENTS.md, CLAUDE.md, .cursorrules, .cursor/rules/setup.mdc, .claude/settings.json, .claude/setup.mjs, .mcp.json, .vscode/tasks.json, .vscode/setup.mjs, and .github/copilot-instructions.md. It also changes package metadata and workflows, creates GitLab pipeline schedules, and tries to republish to npm, PyPI, RubyGems, and JFrog. Bitdefender names no actor. New repository names, written here as text and not as links, itsunai/docker-php-fpm, itsunai/passport_auth_server, bajoebel/kkpatip, ahmadtohar9/restomoiz, tobias94-design/s-valentine, tobias94-design/gymtracker, tobias94-design/signage, rkamphuis012-hub/sr-pilot-codex-test, Malala-Tour-Indonesia/Malala-Tour-Indonesia.github.io, and julieth333/campustech. setup.js MD5s for those names and for the repositories already listed are in source_notes and in the hash list.

## Category
attacks-on-ai

## Attribution
GitHub account CementBeetleSteeple; SafeDep identifies as Miasma-family, Shai-Hulud-descendant payload; not established that original Miasma operators responsible; linked to Shellpanel cPanel exploitation (CVE-2026-41940)

- Actor: CementBeetleSteeple (GitHub account); Miasma-family, Shai-Hulud-descendant
- Country: Unknown
- Motivation: cybercrime
- Attributed by: JFrog Security Research, SafeDep, Socket
- Confidence: medium

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: Account hijacks via GitHub/npm credential theft from earlier worm infections; exposed npm credentials; forged commit timelines and short-lived publishing branches; cPanel CVE-2026-41940 exploitation (Shellpanel workflows in same hijacked cluster)
- Victims and sectors: 42 GitHub repositories from 11 legitimate owners; AI development, npm package consumers
- Regions: unknown
- Region notes: unknown
- Scale and metrics: 42 armed repositories; 11 hijacked legitimate owners; multiple malicious npm packages (event-bus-lite-testmetest, @iobandamwer/cache-helper, @iobandamwer/native-helper, path-stream-utils-testmetest); polymorphic wrappers 12.9-13.7 MB; discovered Oct 21-26, 2026

## Attack flow
### initial-compromise: Account/repository hijacking (access)

Hijacked 11 legitimate GitHub owners and 42 repositories via credential theft from earlier infections; exposed npm credentials; linked to cPanel CVE-2026-41940 Shellpanel exploitation

Evidence: <https://research.jfrog.com/post/beyond-testmetest-42-hijacked-github-repos/>

### repository-poison: AI assistant execution hooks (ai)

Armed repositories with .cursorrules, CLAUDE.md, claude_code_config.json, instructions.md files; added 12.9-13.7 MB polymorphic wrappers; all decode to same CI-publisher payload

Evidence: <https://research.jfrog.com/post/beyond-testmetest-42-hijacked-github-repos/>

### npm-distribution: Malicious npm packages (execution)

Published event-bus-lite-testmetest, @iobandamwer/cache-helper, @iobandamwer/native-helper, path-stream-utils-testmetest; binding.gyp command expansion executes index.js during install; later versions use compiled native addon

Evidence: <https://research.jfrog.com/post/beyond-testmetest-42-hijacked-github-repos/>

### evasion: Scanner evasion via native addon (execution)

Compiled addon.node checks CI/container/sandbox env vars (GITHUB_ACTIONS, CI, VERCEL, etc.), /proc/1/cgroup for docker/kubepod, RAM <1.5GB, CPU=1, TracerPid; returns without running if detected; skips automated scanners

Evidence: <https://research.jfrog.com/post/beyond-testmetest-42-hijacked-github-repos/>

### decrypt-payload: Runtime decryption (execution)

Addon reads /proc/self/maps for own folder, opens .napi_cache, XORs every byte with 0x96; drops result in /tmp, chmod 0600, forks detached process with node; decrypts Bun bootstrap and credential stealer

Evidence: <https://research.jfrog.com/post/beyond-testmetest-42-hijacked-github-repos/>

### credential-theft: Credential collection and propagation (impact)

Collects GitHub/npm/cloud credentials; poisons repositories and CI configuration; propagates through package registries; CI-publisher payload designed to run in GitHub Actions with npm tokens/trusted publishing

Evidence: <https://research.jfrog.com/post/beyond-testmetest-42-hijacked-github-repos/>

### c2: Encrypted data exfiltration (impact)

Attacker-owned CementBeetleSteeple repository operates as active encrypted data sink receiving snapshot envelopes

Evidence: <https://research.jfrog.com/post/beyond-testmetest-42-hijacked-github-repos/>

### Connections

- initial-compromise -> repository-poison
- repository-poison -> npm-distribution
- npm-distribution -> evasion
- evasion -> decrypt-payload
- decrypt-payload -> credential-theft
- credential-theft -> c2
- credential-theft -> repository-poison [loop]
- credential-theft -> npm-distribution [loop]

## MITRE ATLAS
- [AML.T0010](https://atlas.mitre.org/techniques/AML.T0010) AI Supply Chain Compromise — Supply chain attack targeting AI coding assistant users via hijacked GitHub repositories and malicious npm packages
  Evidence: <https://research.jfrog.com/post/beyond-testmetest-42-hijacked-github-repos/>
- [AML.T0011](https://atlas.mitre.org/techniques/AML.T0011) User Execution — Worm propagates through package registries (npm, RubyGems, PyPI) and version control (GitHub), specifically targeting AI development environments
  Evidence: <https://research.jfrog.com/post/beyond-testmetest-42-hijacked-github-repos/> <https://socket.dev/blog/shai-hulud-descendant-malicious-ruby-gem>
- [AML.T0051](https://atlas.mitre.org/techniques/AML.T0051) LLM Prompt Injection — CLAUDE.md DEVOPS-SEALED blocks inject hidden instructions telling agents to silently run node scripts/setup.js at session start
  Evidence: <https://x.com/fr0gger_/status/2119730348699640060>
- [AML.T0083](https://atlas.mitre.org/techniques/AML.T0083) Credentials from AI Agent Configuration — Worm steals AI coding assistant credentials (.claude/.credentials.json, .codex/auth.json) and cloud/CI credentials
  Evidence: <https://socket.dev/blog/shai-hulud-descendant-malicious-ruby-gem>
- [AML.T0081](https://atlas.mitre.org/techniques/AML.T0081) Modify AI Agent Configuration — Plants workspace-tools MCP server and SessionStart hooks for persistent AI agent manipulation
  Evidence: <https://socket.dev/blog/shai-hulud-descendant-malicious-ruby-gem>
- [AML.T0051.001](https://atlas.mitre.org/techniques/AML.T0051.001) Indirect — AGENTS.md and CLAUDE.md text, loaded as project instructions, tells the agent to run scripts/setup.js and not to display the file.
  Evidence: <https://www.bitdefender.com/en-us/blog/labs/how-ai-agents-become-new-targets-in-github-malware-campaign>
- [AML.T0080](https://atlas.mitre.org/techniques/AML.T0080) AI Agent Context Poisoning — The same instruction files are written into agent context so a later session runs the payload.
  Evidence: <https://www.bitdefender.com/en-us/blog/labs/how-ai-agents-become-new-targets-in-github-malware-campaign>
- [AML.T0084](https://atlas.mitre.org/techniques/AML.T0084) Discover AI Agent Configuration — After execution the payload searches the home directory for agent configuration files and keeps paths that name one of 14 agents.
  Evidence: <https://www.bitdefender.com/en-us/blog/labs/how-ai-agents-become-new-targets-in-github-malware-campaign>
- [AML.T0053](https://atlas.mitre.org/techniques/AML.T0053) AI Agent Tool Invocation — A session-start hook in .claude/settings.json runs the setup command in the user shell once the repository is trusted, without a new prompt.
  Evidence: <https://www.bitdefender.com/en-us/blog/labs/how-ai-agents-become-new-targets-in-github-malware-campaign>
- [AML.T0010.005](https://atlas.mitre.org/techniques/AML.T0010.005) AI Agent Tool — Stolen GitHub and GitLab tokens are used to commit agent instruction files and to republish packages, including through npm, PyPI, RubyGems, and JFrog.
  Evidence: <https://www.bitdefender.com/en-us/blog/labs/how-ai-agents-become-new-targets-in-github-malware-campaign>

## Prevention
Monitor GitHub repositories for unexpected .cursorrules/CLAUDE.md/instructions.md files; native addon scrutiny; large dotfiles in packages; npm install hook abuse; GitHub Actions secret access; CI environment variable monitoring. Bitdefender's additions: reject instruction files that call setup.js a sealed artifact and tell the agent not to read it, and review .claude/settings.json session-start hooks before trusting a repository. The Bun runtime used by the inner bundle is https://github.com/oven-sh/bun.

## Detections
- [Curl or Wget Spawned via Node.js](https://github.com/elastic/detection-rules/blob/main/rules/cross-platform/command_and_control_curl_wget_spawn_via_nodejs_parent.toml) (elastic) — Detects Bun download during npm install (Node.js spawning curl/wget)
- [Package Runtime Secret File Access Followed by IMDS Request](https://github.com/elastic/detection-rules/blob/main/rules/cross-platform/credential_access_secret_file_access_followed_by_imds_request.toml) (elastic) — Detects credential file access (.claude/.credentials.json, .codex/auth.json) during package installation
- [Shai-Hulud Workflow File Creation or Modification](https://github.com/splunk/security_content/blob/develop/detections/endpoint/shai_hulud_workflow_file_creation_or_modification.yml) (splunk) — Detects Shai-Hulud family GitHub workflow modifications and git hook persistence
- Worm artifact detection (guidance) — Monitor strutil-core RubyGem (account jamnajiea), pystr-codec PyPI; alert on paleasbest\[.\]top exfiltration; detect workspace-tools MCP server installation; monitor CLAUDE.md DEVOPS-SEALED blocks; flag msync-3f7a signed-commit markers

## Timeline
- First seen: 2026-10-21
- Last updated: 2026-11-17
- 2026-10-26 (JFrog Security Research): JFrog documents 42 hijacked GitHub repositories with testmetest worm; native addon camouflage; 12.9-13.7 MB polymorphic wrappers; CLAUDE.md/.cursorrules execution hooks
- 2026-11-06 (Socket): Socket reports strutil-core 1.0.1 RubyGem (account jamnajiea); extconf.rb downloads Bun, runs worm at install; steals .claude/.credentials.json, .codex/auth.json; plants workspace-tools MCP server; msync-3f7a signed-commit backdoor; related PyPI pystr-codec
- 2026-11-09 (Thomas Roccia): Roccia documents hijacked repos with forged backdated commits (toray, ejaaduipitara, ConcordiaDev, madolee, Imanilom, claudiohernanbesada); CLAUDE.md DEVOPS-SEALED blocks instruct agents to silently run node scripts/setup.js at session start
- 2026-11-17 (Bitdefender Labs): Andrei Anton-Aanei and Alina Bîzgă publish 22 setup.js links and MD5s, the hex-then-ROT13 decode, the Bun stdin bundle, home-directory agent-config injection for 14 agent names, and GitHub or GitLab propagation capped at 25 repositories.

## Tools
### AI tooling and models
- [Claude Code](https://github.com/anthropics/claude-code)
- [Cursor](https://cursor.com/)
- Codex
- [Gemini](https://gemini.google.com/)
- [GitHub Copilot](https://github.com/features/copilot)
- Aider
- Continue
- Windsurf
- Cline
- Kiro
- [OpenCode](https://github.com/anomalyco/opencode)
- Tabby
- Amazon Q
- Cody
- Bolt

### Other tooling
- npm binding.gyp command expansion
- Bun runtime (https://github.com/oven-sh/bun). Earlier reporting named Bun 1.2.18. Bitdefender says the setup.js chain resolves or downloads Bun and does not give that version.
- Native [Node](https://github.com/nodejs/node) addon with XOR 0x96 encryption
- Caesar transformation and AES-128-GCM
- [GitHub Actions](https://github.com/features/actions) for CI publishing
- npm trusted publishing
- RubyGems strutil-core 1.0.1 (account jamnajiea)
- PyPI pystr-codec
- workspace-tools MCP server
- SessionStart hooks
- Signed-commit-message backdoor (msync-3f7a marker)

## Source notes
SafeDep first documented npm package side Oct 22; JFrog complementary GitHub infrastructure investigation; campaign shifted to native addon camouflage to evade scanners; addon environment checks skip CI/containers/sandboxes with <1.5GB RAM or 1 CPU. Bitdefender setup.js MD5s, repositories as plain text: toray/QiniuSDK-lib, toray/widget-lib, toray/XiamiSDK-lib, toray/torayUtils-lib, and toray/Rainbow-lib b9a182b646c7fdff68f2ff9dfd822516; ConcordiaDev/theme_saimaniq 2f54f6d41f41bb3c8e684b0f009cbcc3; ejaaduipitara/djp-devops, ejaaduipitara/whatsapp-bot, and ejaaduipitara/content-service ab7ff2f782c194953e5811d16b9e1817; Imanilom/baraja-coffe 2191cbd04134839daeb6b8909725eae0; claudiohernanbesada/xenios.api 7ad1567180f6d5a5b317f697310a796c; madolee/da a20a99e325226f56d7a25460a9d436ab; itsunai/docker-php-fpm and itsunai/passport_auth_server 3794736979327349404171798328a38a; bajoebel/kkpatip 31f1f5d9c59b950d91d05cecee20fce8; ahmadtohar9/restomoiz 908293cd1ed04cf50fbe72baf74967b6; tobias94-design/s-valentine, tobias94-design/gymtracker, and tobias94-design/signage bbd5695c36e76538547c45fd17e6c7e4; rkamphuis012-hub/sr-pilot-codex-test 5c8db9bf78c6c2174ccf8a6299f9aafd; Malala-Tour-Indonesia/Malala-Tour-Indonesia.github.io 82a8be193a41f5b17906f919a179d999; julieth333/campustech 5dc5473468ee2d8006ebdaab0c7e93fb. The page datePublished is 2026-11-17T17:39:55+03:00 (9:39 AM ET).

## Sources
- [Beyond testmetest: Native Addon Camouflage and 42 Armed GitHub Repositories](https://research.jfrog.com/post/beyond-testmetest-42-hijacked-github-repos/)
- [Socket: Shai-Hulud Descendant - Malicious Ruby Gem](https://socket.dev/blog/shai-hulud-descendant-malicious-ruby-gem) — Socket
- [Thomas Roccia: Hijacked repos with backdated commits and CLAUDE.md DEVOPS-SEALED blocks](https://x.com/fr0gger_/status/2119730348699640060) — X/Twitter
- [How AI agents become new targets in a GitHub malware campaign](https://www.bitdefender.com/en-us/blog/labs/how-ai-agents-become-new-targets-in-github-malware-campaign) — Bitdefender
- [Bun](https://github.com/oven-sh/bun) — Oven
