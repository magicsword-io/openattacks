# testmetest worm hijacks 42 GitHub repos with Claude/Gemini startup hooks

- ID: jfrog-testmetest-worm-2026-10
- Reported: 2026-10-26
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/jfrog-testmetest-worm-2026-10/

## Summary
42 armed third-party GitHub repositories across 11 legitimate owners contain execution hooks for AI coding assistants (.cursorrules, CLAUDE.md, claude_code_config.json, instructions.md) and 12.9-13.7 MB polymorphic wrappers decoding to same CI-publisher payload. Campaign uses compiled native addon (addon.node) that XORs .napi_cache with 0x96 to decrypt JavaScript payload. Addon checks for CI/container/sandbox environment and CPU/RAM limits, skipping execution in automated scanners. Payload collects credentials, poisons repos and CI, propagates via npm. GitHub account CementBeetleSteeple hosts repositories; SafeDep identifies as Shai-Hulud-descendant Miasma-family. Shellpanel artifacts in hijacked owner cluster link to cPanel CVE-2026-41940 exploitation. Socket (Kush Pandya, Nov 6, 2026) reports RubyGems strutil-core 1.0.1 (account jamnajiea); extconf.rb downloads Bun, runs worm at install; steals .claude/.credentials.json, .codex/auth.json, cloud/CI credentials to paleasbest[.]top; plants workspace-tools MCP server, SessionStart hooks, CLAUDE.md, AGENTS.md, .vscode/tasks.json; signed-commit-message backdoor (marker msync-3f7a); wiper if stolen GitHub token revoked. SHA-256 3b3f6e1bde0b28b015030a81a6d805b5b5306dc3f021e1102123971cfd83acc0; related PyPI pystr-codec. Thomas Roccia (Nov 9, 2026) documents hijacked repos with forged backdated commits: toray/XiamiSDK-lib, widget-lib, Rainbow-lib, QiniuSDK-lib, torayUtils-lib; ejaaduipitara/djp-devops, whatsapp-bot, content-service; ConcordiaDev/theme_saimaniq; madolee/da; Imanilom/baraja-coffe; claudiohernanbesada/xenios.api. CLAUDE.md DEVOPS-SEALED block instructs agents to silently run node scripts/setup.js at session start.

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

## Prevention
Monitor GitHub repositories for unexpected .cursorrules/CLAUDE.md/instructions.md files; native addon scrutiny; large dotfiles in packages; npm install hook abuse; GitHub Actions secret access; CI environment variable monitoring

## Detections
- [Curl or Wget Spawned via Node.js](https://github.com/elastic/detection-rules/blob/main/rules/cross-platform/command_and_control_curl_wget_spawn_via_nodejs_parent.toml) (elastic) — Detects Bun download during npm install (Node.js spawning curl/wget)
- [Package Runtime Secret File Access Followed by IMDS Request](https://github.com/elastic/detection-rules/blob/main/rules/cross-platform/credential_access_secret_file_access_followed_by_imds_request.toml) (elastic) — Detects credential file access (.claude/.credentials.json, .codex/auth.json) during package installation
- [Shai-Hulud Workflow File Creation or Modification](https://github.com/splunk/security_content/blob/develop/detections/endpoint/shai_hulud_workflow_file_creation_or_modification.yml) (splunk) — Detects Shai-Hulud family GitHub workflow modifications and git hook persistence
- Worm artifact detection (guidance) — Monitor strutil-core RubyGem (account jamnajiea), pystr-codec PyPI; alert on paleasbest\[.\]top exfiltration; detect workspace-tools MCP server installation; monitor CLAUDE.md DEVOPS-SEALED blocks; flag msync-3f7a signed-commit markers

## Timeline
- First seen: 2026-10-21
- Last updated: 2026-11-09
- 2026-10-26 (JFrog Security Research): JFrog documents 42 hijacked GitHub repositories with testmetest worm; native addon camouflage; 12.9-13.7 MB polymorphic wrappers; CLAUDE.md/.cursorrules execution hooks
- 2026-11-06 (Socket): Socket reports strutil-core 1.0.1 RubyGem (account jamnajiea); extconf.rb downloads Bun, runs worm at install; steals .claude/.credentials.json, .codex/auth.json; plants workspace-tools MCP server; msync-3f7a signed-commit backdoor; related PyPI pystr-codec
- 2026-11-09 (Thomas Roccia): Roccia documents hijacked repos with forged backdated commits (toray, ejaaduipitara, ConcordiaDev, madolee, Imanilom, claudiohernanbesada); CLAUDE.md DEVOPS-SEALED blocks instruct agents to silently run node scripts/setup.js at session start

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

### Other tooling
- npm binding.gyp command expansion
- Bun 1.2.18 runtime
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
SafeDep first documented npm package side Oct 22; JFrog complementary GitHub infrastructure investigation; campaign shifted to native addon camouflage to evade scanners; addon environment checks skip CI/containers/sandboxes with <1.5GB RAM or 1 CPU

## Sources
- [Beyond testmetest: Native Addon Camouflage and 42 Armed GitHub Repositories](https://research.jfrog.com/post/beyond-testmetest-42-hijacked-github-repos/)
- [Socket: Shai-Hulud Descendant - Malicious Ruby Gem](https://socket.dev/blog/shai-hulud-descendant-malicious-ruby-gem) — Socket
- [Thomas Roccia: Hijacked repos with backdated commits and CLAUDE.md DEVOPS-SEALED blocks](https://x.com/fr0gger_/status/2119730348699640060) — X/Twitter
