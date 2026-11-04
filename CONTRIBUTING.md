# Contributing

The catalog is maintained as one YAML file per entry in `attacks/`. You can also [submit an issue](https://github.com/magicsword-io/openattacks/issues/new?template=submit-attack.yml).

1. Copy the template below into `attacks/<id>.yaml`. Use a unique lowercase, hyphenated ID that matches the filename.
2. Read the original research. Attribute the researcher and organization, link the source of every claim, and explain what role AI played.
3. Run `npm ci` once, then `npm run validate`. Preview with `npm run dev`.
4. Open a pull request against `main`. CI validates the YAML, checks types, builds the static site, and compares the API to the YAML.

```yaml
id: example-campaign-2026
name: Example campaign
date_reported: '2026-10-20'
researcher: unknown
org: unknown
sources:
  - url: https://example.org/original-report
    title: Original research report
ai_role: ai_tool_as_lure
technique_summary: Describe the attack and the evidence for AI involvement.
initial_access: unknown
ai_tooling_and_models: []
other_tooling: []
victims_and_sectors: unknown
regions: [unknown]
attribution_or_cluster: unknown
scale_and_metrics: unknown
prevention_angle: unknown
related_magicsword_projects: []
borderline: false
last_reviewed: '2026-10-20'
```

`schema.yaml` is the source of truth. Unknown fields fail validation. Optional fields include `aliases`, `ai_role_secondary`, `ai_role_detail`, `date_activity_start`, `date_activity_end`, `atlas_techniques`, `source_notes`, `iocs`, `tags`, `confidence`, `borderline_note`, and `magicsword_coverage`.

## Tool project links

Keep reported tool names and versions as plain strings in the YAML. Attack pages and Markdown downloads link recognized names using the reviewed registry in `src/data/tool-projects.json`. Add a project there to link it everywhere it is reported, including both AI artifacts and other tooling.

Verify the project identity and destination against its maintainer's repository or website. Prefer an official GitHub repository; use the official project or model page when no suitable repository is available. Record aliases as literal product names, update `reviewed_on` when researching links, and add `source_urls` for identity checks or unusual destinations. Label community forks and upstream-only references with a visible `note`. Do not substitute an unrelated project with the same name, guess repositories for unidentified artifacts, or link attacker infrastructure and indicators.

## Sourcing rules

- Every factual claim needs a source URL. Prefer primary reports, original researchers, vendor advisories, or court records. Add source notes when evidence has limitations.
- Write **unknown** rather than guessing; use an empty array when no tooling or mapping is documented. Never invent a victim count, location, model, attribution, or MITRE mapping.
- Include **no live victim data or unredacted victim IP addresses**. Only add non-victim indicators explicitly published for defensive use, and explain their origin. Defang domains and URLs in IOC fields; do not make them clickable.
- Mark PoCs, conceptual findings, marketplace claims, and other uncertain cases with `borderline: true` and explain the qualification in `borderline_note`.
- Preserve date precision: `date_reported` accepts `YYYY-MM-DD` or `YYYY-MM`. `last_reviewed` is the date you actually reviewed the source, in `YYYY-MM-DD` format.
- Confidence describes evidence for AI involvement: **high** for direct evidence, **medium** for credible but limited evidence, **low** for indirect or disputed evidence. Omit it when unassessed; the site shows “Not assessed.”
- Keep the tone factual and calm. Credit the researcher prominently. Describe prevention without making unsupported claims about what a product blocks.

## Roles and metadata

Use one of: `attacker_uses_ai_as_operator`, `ai_tool_as_lure`, `ai_agent_or_mcp_as_target`, `ai_infra_as_c2`, `llm_generated_malware`, `ai_credential_theft`, or `other`.

`related_magicsword_projects` accepts LOLSkills, LOLRMM, LOLDrivers, GTFOBins, LOLBAS, HijackLibs, and LOTTunnels. Add a project only when relevant to the reported technique. Prevention CTAs use the exact wording “free MagicSword.io”.

`magicsword_coverage` is an optional list of **published public post URLs**. Never add publishing schedules or draft URLs. `typefully` is an optional legacy internal schema field; keep editorial tracking outside this public repository. The content loader strips it before generating pages or APIs.

## Patterns

Edit `src/pages/patterns.md` to update editorial observations. Link examples to catalog entries, distinguish observations from prevalence claims, and update the review date when you recheck the sources.


## Attack flows and MITRE ATLAS

`attack_flow` is an optional directed graph rendered with React Flow. A new record without it gets a summary diagram from its existing fields. Prefer a curated reconstruction when the source establishes the sequence:

```yaml
attack_flow:
  nodes:
    - id: entry
      title: Initial access
      description: Describe only the entry point established by the report.
      kind: access
      source_urls: [https://example.org/original-report]
    - id: activity
      title: Reported activity
      description: Describe the next source-supported action, or state what remains unknown.
      kind: ai
      source_urls: [https://example.org/original-report]
  edges:
    - source: entry
      target: activity
```

Node kinds are `access`, `ai`, `execution`, `impact`, and `unknown`. IDs must be unique, edges must reference existing nodes, and every node must connect. Every evidence URL must also appear in the entry’s `sources`. Use separate branches for separately reported activity; do not imply that two model uses form one confirmed chain. Mark repeated edges with `loop: true`.

Map AI-specific behavior with `atlas_techniques`, using an official ID from `src/data/atlas-techniques.json`, a `rationale`, and `source_urls`. These are catalog annotations, not MITRE assignments. Leave the field absent when evidence does not support a mapping. ATT&CK mappings and related-project promotion are not shown on entry pages.

## Target geography

Use canonical country or territory names from the schema. Broader regions such as `Europe` are valid when no country is given. Use `Multiple regions` for explicitly multi-country or global activity without named countries, `unknown` when the source does not disclose target geography, and `Not applicable` for research with no geographical victim context.

Do not convert actor language, actor nationality, hosting infrastructure, a parent company’s headquarters, conference claims, or sandbox submitter countries into victim locations. Preserve qualifications and excluded original labels in `region_notes`. The map and filters use the same normalized `regions` values.

## Automatic AI-readable publishing

Every build generates `llms.txt`, `llms-full.txt`, `api/attacks.json`, `api/attacks.csv`, `api/schema.json`, `api/relevance.json`, and individual `api/attacks/<id>.json` and `.md` files from the YAML collection and reviewed sidecars. Do not edit generated files. Merging a valid attack PR into `main` triggers Vercel's connected Git deployment and rebuilds all outputs together; tests check each YAML ID against the generated guide, full context, page and individual exports. GitHub Pages is an optional manual workflow.

## Stack relevance

Adding a YAML record is sufficient to publish it everywhere. The homepage's personalized matches use separate reviewed annotations in `src/data/applicability.json`; a new entry without an annotation is exported as `not_assessed` and does not receive guessed matches.

For a reviewed mapping, use tool and OS IDs from `src/lib/stack-matching.mjs`. Each rule needs a source-supported victim-side product, workflow or OS scope, a relationship (`target`, `credential`, `workflow`, `lure` or `environment`), a concrete reason, conditions to check, and source URLs already present in the record. State affected-version and integration requirements for historical vulnerabilities. `mcp: true` means the rule requires an existing MCP connection, not merely that an attacker installs a new one. Never map attacker-side Claude/Gemini use to exposure of users of those products. Preserve research and evidence qualifications.

Choose an existing flow-node ID for `stage_id` and provide one concrete first `action`. Use `attacker_tool_only` or `not_assessed` with no rules when appropriate. The matching UI is a starting point for review, not a scan, risk score or current-vulnerability assessment. Windows policy links remain subject to the stage control's enforcement and platform prerequisites.

## Associated simulations

An attack record can link to one or more reviewed simulation definitions under `simulations/definitions/`. Use an existing attack ID and exact flow stage IDs. Mark a relationship `source-match` only when original research is shared; label broader mechanics `analogue` and state what is substituted or omitted. Keep research attribution and scoped code/fixture notices.

Definitions contain a legitimate task, synthetic clean/changed fixtures, prerequisites, expected observations and limits. Agent injection and fixed local comparisons are distinct modes. Never infer agent attribution, native vulnerability reproduction or detection from a helper receipt. Platform status needs identified execution evidence.

Regenerate with `npm run simulations:build`, then run `npm run validate`, `npm test` and the browser checks. A new executable recipe or tool capability requires code review, boundary tests and native verification; adding a YAML field cannot enable arbitrary commands or destinations. Keep source fixtures inert; only explicit preparation may materialize a project or skill instruction inside its run-owned disposable workspace. See [the lab guide](docs/SIMULATIONS.md).
