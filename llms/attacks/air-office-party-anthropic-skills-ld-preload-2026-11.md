# AIR Office Party, Anthropic document skills load an unchecked LD_PRELOAD library

- ID: air-office-party-anthropic-skills-ld-preload-2026-11
- Reported: 2026-11-05
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/air-office-party-anthropic-skills-ld-preload-2026-11/

## Summary
Air Security (Omri Saxena and Or Nevo; article dated Nov 5, 2026) found the issue in May 2026 and reported it to Anthropic. The docx, pptx, and xlsx skills, used by Claude document features and by the Claude Code document-skills marketplace, convert documents with python scripts/office/soffice.py --headless --convert-to pdf. The docx skill renders every written document to PDF through that helper. The same helper is used by the pptx and xlsx skills. If the helper cannot open a Unix socket, including under a sandbox, seccomp, or EMFILE, it sets LD_PRELOAD to a path under the process temp directory, lo_socket_shim.so, and execs LibreOffice. The helper does not check who owns that file or what is in it. Whoever writes it first is loaded into the LibreOffice process. Air's proof of concept planted the library directly in a Claude Code sandbox temp directory, and a second proof used a companion skill that unpacked the .so into /tmp while the agent wrote marketing copy. The load is Linux-only. macOS ignores LD_PRELOAD, so the library is not loaded there. Air writes that Anthropic acknowledged the report and considers the behavior outside its security boundary because the helper runs in a sandbox. As of the Nov 5 article, scripts/office/soffice.py on the repository main branch was unchanged since July 17 and still loaded the file at that path. A check of the same file on Nov 15, 2026 still showed _SHIM_SO built from tempfile.gettempdir() joined with lo_socket_shim.so, an early return when that file exists, and env["LD_PRELOAD"] set to it.

Evidence qualification: Air Security published a proof of concept. The article does not describe in-the-wild exploitation. Anthropic acknowledged the report and said the helper only runs inside a sandbox, which Anthropic treats as outside its security boundary.

## Category
attacks-on-ai

## Attribution
No threat actor. Air Security reported the behavior in the official skill. Anthropic's response, as quoted by Air, is that the helper is outside Anthropic's security boundary.

- Actor: unknown
- Motivation: unknown
- Attributed by: Air Security
- Confidence: low

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: A local writer places lo_socket_shim.so in the temp directory before the document skill runs soffice.py. Air demonstrated a direct plant and a companion skill. No remote exploitation is described.
- Victims and sectors: Users of the official Anthropic document skills on Linux, including Claude Code sandboxes where the socket open fails. No victim organizations are named.
- Regions: Not applicable
- Region notes: No target geography. The behavior is in published skill code.
- Scale and metrics: One helper shared by the docx, pptx, and xlsx skills. No exploitation count was published.

## Attack flow
### helper: Document skill calls soffice.py (ai)

docx, pptx, and xlsx skills run scripts/office/soffice.py --headless --convert-to pdf. The docx skill does this for every document it writes.

Evidence: <https://www.air.security/blog-posts/office-party>

### preload: Failed socket sets LD_PRELOAD (execution)

If the Unix socket cannot be opened, soffice.py sets LD_PRELOAD to tempfile.gettempdir()/lo_socket_shim.so with no ownership or content check.

Evidence: <https://www.air.security/blog-posts/office-party> <https://github.com/anthropics/skills/blob/main/skills/docx/scripts/office/soffice.py>

### plant: First writer of the shim is loaded (impact)

Air planted the library in a Claude Code sandbox temp directory, and also unpacked it from a companion skill. Linux loads it. macOS ignores LD_PRELOAD.

Evidence: <https://www.air.security/blog-posts/office-party>

### Connections

- helper -> preload
- preload -> plant

## MITRE ATLAS
- [AML.T0010.001](https://atlas.mitre.org/techniques/AML.T0010.001) AI Software — The load is in the official Anthropic document skills, not a third-party copy
  Evidence: <https://www.air.security/blog-posts/office-party> <https://github.com/anthropics/skills/blob/main/skills/docx/scripts/office/soffice.py>
- [AML.T0053](https://atlas.mitre.org/techniques/AML.T0053) AI Agent Tool Invocation — The docx skill invokes soffice.py as part of rendering a document the agent just wrote
  Evidence: <https://www.air.security/blog-posts/office-party>

## Prevention
Pin document skills and review scripts/office/soffice.py before enabling them. On Linux, alert when a process sets LD_PRELOAD to lo_socket_shim.so, and when a compiler writes that filename under /tmp before soffice.py runs. Do not treat an /etc/ld.so.preload file rule as coverage for this env-var path. macOS does not honor LD_PRELOAD for this load.

## Detections
- [Unusual LD_PRELOAD/LD_LIBRARY_PATH Command Line Arguments](https://github.com/elastic/detection-rules/blob/main/rules/linux/defense_evasion_ld_preload_cmdline.toml) (elastic) — Linux. A command line that sets LD_PRELOAD. Matches soffice.py when the env assignment is visible on the command line. It does not match a library path that exists only inside the Python process.
- [Unusual Preload Environment Variable Process Execution](https://github.com/elastic/detection-rules/blob/main/rules/linux/defense_evasion_unusual_preload_env_vars.toml) (elastic) — Linux. A process started with an unusual LD_PRELOAD or LD_LIBRARY_PATH. Matches the LibreOffice process the helper execs after setting the variable.
- lo_socket_shim.so is not an ld.so.preload file edit (guidance) — Rules for writes to /etc/ld.so.preload describe a different technique and are not cited. Hunt for lo_socket_shim.so under the temp directory, and for a compiler writing that file before soffice.py. Sigma has no rule for the LD_PRELOAD environment variable.

## Timeline
- First seen: 2026-05
- Last updated: 2026-11-15
- 2026-05 (Air Security): Omri Saxena and Or Nevo find the unchecked shim and report it to Anthropic
- 2026-07-17 (Air Security): Air says scripts/office/soffice.py on main last changed on this date and still loads the temp-directory library
- 2026-11-05 (Air Security): Air publishes Office Party. Anthropic's stated position is that the sandboxed helper is outside its security boundary.
- 2026-11-15 (https://github.com/anthropics/skills/blob/main/skills/docx/scripts/office/soffice.py): The docx soffice.py on main still defines _SHIM_SO as tempfile.gettempdir()/lo_socket_shim.so and sets LD_PRELOAD to it

## Tools
### AI tooling and models
- Anthropic skills repository, skills/docx, skills/pptx, and skills/xlsx (https://github.com/anthropics/skills)
- [Claude Code](https://github.com/anthropics/claude-code) document-skills and [Claude](https://claude.com/product/overview) document features that call soffice.py

### Other tooling
- LD_PRELOAD of lo_socket_shim.so
- LibreOffice via soffice.py

### MagicSword projects
- [LOLSkills](https://lolskills.io)

## Source notes
The May 2026 discovery, the Nov 5, 2026 article date, Anthropic's sandbox response, and the July 17 unchanged claim are from Air Security. The Nov 15, 2026 file check is a read of https://github.com/anthropics/skills/blob/main/skills/docx/scripts/office/soffice.py. The pptx and xlsx helpers were not re-read on that date; Air says they share this helper.

## Sources
- [Office Party: Anthropic's Document Skills Load an Unchecked Shared Library](https://www.air.security/blog-posts/office-party) — Air Security
- [skills/docx/scripts/office/soffice.py](https://github.com/anthropics/skills/blob/main/skills/docx/scripts/office/soffice.py) — anthropics
