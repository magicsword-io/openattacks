# testmetest worm hijacks 42 GitHub repos with Claude/Gemini startup hooks

- ID: jfrog-testmetest-worm-2026-10
- Reported: 2026-10-26
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/jfrog-testmetest-worm-2026-10/

## Summary
42 armed third-party GitHub repositories across 11 legitimate owners contain execution hooks for AI coding assistants (.cursorrules, CLAUDE.md, claude_code_config.json, instructions.md) and 12.9-13.7 MB polymorphic wrappers decoding to same CI-publisher payload. Campaign uses compiled native addon (addon.node) that XORs .napi_cache with 0x96 to decrypt JavaScript payload. Addon checks for CI/container/sandbox environment and CPU/RAM limits, skipping execution in automated scanners. Payload collects credentials, poisons repos and CI, propagates via npm. GitHub account CementBeetleSteeple hosts repositories; SafeDep identifies as Shai-Hulud-descendant Miasma-family. Shellpanel artifacts in hijacked owner cluster link to cPanel CVE-2026-41940 exploitation.

## Category
uncategorized

## Attribution
GitHub account CementBeetleSteeple; SafeDep identifies as Miasma-family, Shai-Hulud-descendant payload; not established that original Miasma operators responsible; linked to Shellpanel cPanel exploitation (CVE-2026-41940)

## AI involvement confidence
not assessed

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
- [AML.T0011](https://atlas.mitre.org/techniques/AML.T0011) User Execution — Worm propagates through package registries (npm) and version control (GitHub), specifically targeting AI development environments
  Evidence: <https://research.jfrog.com/post/beyond-testmetest-42-hijacked-github-repos/>

## Prevention
Monitor GitHub repositories for unexpected .cursorrules/CLAUDE.md/instructions.md files; native addon scrutiny; large dotfiles in packages; npm install hook abuse; GitHub Actions secret access; CI environment variable monitoring

## Detections
No detections are recorded.

## Timeline
No timeline is recorded.

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

## Sources
- [Beyond testmetest: Native Addon Camouflage and 42 Armed GitHub Repositories](https://research.jfrog.com/post/beyond-testmetest-42-hijacked-github-repos/)
