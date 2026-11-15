# Dynatrace mcpvenom measures MCP tool-description poisoning across 12 frameworks

- ID: dynatrace-mcpvenom-tool-poisoning-2026-11
- Reported: 2026-11-15
- AI role: ai_agent_or_mcp_as_target
- Entry: https://openattacks.ai/attacks/dynatrace-mcpvenom-tool-poisoning-2026-11/

## Summary
Farooq Shaikh and Biagio Montaruli (Dynatrace; AISec at ACM CCS 2026, Nov 15-19, The Hague) measure MCP tool poisoning with real tool execution. mcpvenom (https://github.com/dynatrace-research/mcpvenom) runs 45 scenarios across 12 frameworks and 18 models, 9,720 cells. The attacker controls one MCP server the user installed and can change tool descriptions, input-schema descriptions, and tool responses. The attacker cannot change the system prompt, user messages, framework code, or model weights. A legitimate server exposes read_file, write_file, list_files, http_get, and http_post. A planted secret sits in the workspace. A canary HTTP server on port 18080 records exfiltration. Overall, 2,113 cells were vulnerable (22.9 percent). Of those, 64.9 percent were a dispatched attacker tool call, 23.0 percent were confirmed network contact, and 12.1 percent were a verified secret in the canary log. Hand review covered 1,259 transcripts. Nine core frameworks clustered between 23 and 26 percent, and the paper says none of the 12 implements an intentional description check. Pydantic AI's duplicate-tool-name rejection landed at 16.6 percent, and AG2's executor constraints at 4.6 percent. A regex scanner the authors built rejected 20 of 45 scenarios and flagged 9 of 125 benign descriptions (7.2 percent). Model results ran from Claude Fable 5 at 0.4 percent to Amazon Nova Pro at 49.7 percent (245 of 493 cells). Claude Opus 4.8 was vulnerable in 8 of 530 cells (1.5 percent) and issued 223 refusals that cited the poisoned description. Claude Sonnet 5 sometimes named the text as prompt injection and then made the exfiltration call. The simplest high-signal payload appends an instruction to read /workspace/.env and send it with http_post. That direct-description class scored 29.2 percent aggregate ASR outside AG2. A language-switch payload scored 66.0 percent. Five disclosures to four organizations were rejected: two to LangChain, one to Microsoft for AutoGen via MSRC, one to the MCP SDK, and one to Haystack (deepset). The AutoGen rejection is about microsoft/autogen, which the paper says is not the AG2 0.14.0 fork in the matrix. Link invariant-mcp-tool-poisoning-2025-04, the earlier description-poisoning report this paper cites.

Evidence qualification: This is a lab measurement with planted secrets and a canary server. The paper does not describe an intrusion against a named organization. All five vendor disclosures were rejected.

## Category
attacks-on-ai

## Attribution
No threat actor. Dynatrace Research ran the measurement. The five vendor reports were rejected.

- Actor: unknown
- Motivation: unknown
- Attributed by: Dynatrace
- Confidence: low

## AI involvement confidence
confirmed

## Scope and targeting
- Initial access: The user installs an MCP server whose tool description, schema text, or tool response carries the instruction. The paper's servers run over stdio in the lab.
- Victims and sectors: No customer is named. The matrix uses planted workspace secrets and framework harnesses.
- Regions: Not applicable
- Region notes: The Hague is the workshop location, not a victim region. Downloads in the paper's framework table are as of May 2026 and are not a victim count.
- Scale and metrics: 9,720 cells. 2,113 vulnerable (22.9 percent), including 255 cells (12.1 percent of the vulnerable set) with a canary receipt of the secret. 45 scenarios. 12 frameworks. 18 models.

## Attack flow
### install: Malicious MCP server is installed (access)

The user adds a server the attacker published. It is registered next to a legitimate server that can read files and call http_post.

Evidence: <https://arxiv.org/abs/2611.03555>

### describe: Poisoned description enters the prompt (ai)

Frameworks copy tool descriptions, schema text, and tool responses into the model context. The paper says none of the 12 checks that text on purpose.

Evidence: <https://arxiv.org/abs/2611.03555>

### post: http_post carries the secret (execution)

A typical payload tells the model to read /workspace/.env and send it with the legitimate http_post tool.

Evidence: <https://arxiv.org/abs/2611.03555>

### canary: Canary confirms exfiltration (impact)

255 of the vulnerable cells put the planted secret on the canary at port 18080. The full vulnerable set is 2,113 of 9,720 cells.

Evidence: <https://arxiv.org/abs/2611.03555>

### Connections

- install -> describe
- describe -> post
- post -> canary

## MITRE ATLAS
- [AML.T0051.001](https://atlas.mitre.org/techniques/AML.T0051.001) Indirect — Tool descriptions, schema text, and tool responses are attacker-controlled fields copied into the model prompt
  Evidence: <https://arxiv.org/abs/2611.03555>
- [AML.T0053](https://atlas.mitre.org/techniques/AML.T0053) AI Agent Tool Invocation — The successful cells invoke a legitimate tool, most clearly http_post, because the poisoned description told the model to
  Evidence: <https://arxiv.org/abs/2611.03555>
- [AML.T0055](https://atlas.mitre.org/techniques/AML.T0055) Unsecured Credentials — The verified tier is a planted workspace secret received by the canary HTTP server
  Evidence: <https://arxiv.org/abs/2611.03555>

## Prevention
Review an MCP server's tool descriptions before adding it, and treat a description that names another tool, a file such as .env, or an outbound URL as hostile. Do not assume the framework checks that text. The paper's own regex scanner missed 25 of 45 scenarios, so a description scan is only a partial control. Prefer a model that refused in this matrix, and still review the server, because the paper says no framework defense made up for a susceptible model.

## Detections
- Lab tool-description poisoning has no product rule (guidance) — The paper's signal is a tool description that instructs a read of .env and an http_post, then a request to a canary on port 18080. No Sigma, Splunk, or Elastic rule names MCP tool descriptions. Review descriptions at install time. The authors' regex scanner rejected 20 of 45 scenarios and flagged 9 of 125 benign descriptions, so a scan is not coverage by itself.

## Timeline
- First seen: 2026-11-15
- Last updated: 2026-11-15
- 2026-11-15 (Dynatrace): AISec workshop paper, Nov 15-19, 2026. mcpvenom results: 22.9 percent of 9,720 cells vulnerable, and five vendor disclosures rejected.

## Tools
### AI tooling and models
- mcpvenom (https://github.com/dynatrace-research/mcpvenom)
- 12 MCP frameworks, including LangChain 1.5.0, Pydantic AI 2.14.1, CrewAI 1.15.5, Semantic Kernel 1.44.0, Haystack 3.0.0, and AG2 0.14.0
- 18 models, from [Claude](https://claude.com/product/overview) Fable 5 (0.4 percent) to Amazon Nova Pro (49.7 percent)

### Other tooling
- Legitimate http_post tool used to send the planted secret
- Canary HTTP server on port 18080

### MagicSword projects
- [LOLSkills](https://lolskills.io)

## Source notes
Counts, model rates, framework versions, the http_post payload, the canary port, and the five rejections are from the paper text at https://arxiv.org/abs/2611.03555. The workshop dates are Nov 15-19, 2026. The paper does not give a separate preprint day, so date_reported is the workshop start. Link invariant-mcp-tool-poisoning-2025-04.

## Sources
- [MCP Tool Poisoning in Agentic AI Frameworks: A Cross-Framework Measurement Study](https://arxiv.org/abs/2611.03555) — AISec, ACM CCS 2026
- [mcpvenom](https://github.com/dynatrace-research/mcpvenom) — Dynatrace Research
