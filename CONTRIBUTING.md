# Contributing

The catalog is maintained as one YAML file per entry in `attacks/`. You can also [submit an issue](https://github.com/magicsword-io/openattacks/issues/new?template=submit-attack.yml).

1. Copy the template below into `attacks/<id>.yaml`. Use a unique lowercase, hyphenated ID that matches the filename.
2. Read the original research. Attribute the researcher and organization, link the source of every claim, and explain what role AI played.
3. Run `npm ci` once, then `npm run format:data` (Prettier) and `npm run validate`. Preview with `npm run dev`.
4. Open a pull request against `main`. CI checks YAML formatting, validates the YAML, checks types, builds the static site, and compares the API to the YAML.

CI also checks the published source and coverage URLs in added or modified entries. Run `npm run check:links -- --all` locally to audit the catalog, or `npm run check:links -- --base origin/main` to check entries changed in commits since `origin/main`. URL syntax checks run offline with `npm run validate`; live checks require network access.

Changed attack entries must also include `category`, `attribution`, `ai_involvement_confidence`, `detections`, and `timeline`. The Attack detections workflow checks those fields, requests every detection URL, and compares each rule's platform with the operating systems described by the entry. See [Detection rules on pull requests](#detection-rules-on-pull-requests).

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

- Include only attacks **observed in the wild or documented in public reporting**: original researcher reports, vendor advisories, or news coverage of a concrete case. **No conceptual scenarios, hypothetical attack chains, or general threat frameworks.** A source URL alone does not make a speculative scenario eligible.
- Published vulnerability demonstrations and research PoCs qualify when they document concrete behavior. Label them as research and do not imply exploitation in the wild. Reported marketplace claims must retain their uncertainty labels.
- Every factual claim needs a source URL. Prefer primary reports, original researchers, vendor advisories, or court records. Add source notes when evidence has limitations.
- Published source, flow, ATLAS evidence, and coverage links must use absolute `http://` or `https://` URLs, with no embedded credentials or private/local destinations. Source URLs must be unique within an entry; multiple entries may cite the same report. A reachable URL still needs human review to confirm it supports the claim.
- Write **unknown** rather than guessing; use an empty array when no tooling or mapping is documented. Never invent a victim count, location, model, attribution, or MITRE mapping.
- Include **no live victim data or unredacted victim IP addresses**. Only add non-victim indicators explicitly published for defensive use, and explain their origin. Defang domains and URLs in IOC fields; do not make them clickable.
- Mark PoCs, marketplace claims, and other uncertain cases with `borderline: true` and explain the qualification in `borderline_note`. This flag does not make a conceptual entry eligible.
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

After changing `attacks/*.yaml`, run `npm run llm:build` and commit the generated files. That command refreshes `llms.txt`, `llms-full.txt`, `llms/attacks/<id>.md`, `llms/by-category/<category>.md`, `llms/by-month/<YYYY-MM>.md`, `data/attacks.json`, and `data/attacks.schema.json`. Do not edit those files by hand. `npm run llm:check` fails when they are stale; CI runs that check on every pull request. A push to `main` regenerates and commits them if a merge still drifted, using a `[skip ci]` bot commit.

The site build also generates `api/attacks.json`, `api/attacks.csv`, `api/schema.json`, `api/relevance.json`, and individual `api/attacks/<id>.json` and `.md` files from the YAML collection and reviewed sidecars. It serves the committed LLM files at the same paths. Merging a valid attack PR into `main` triggers Vercel's connected Git deployment and rebuilds the site outputs together. GitHub Pages is an optional manual workflow.

The `source-links` CI check follows up to five redirects, uses an eight-second timeout per request and up to four concurrent checks, and retries failures once. It confirms failed HEAD requests with GET before failing on HTTP 404/410. Invalid or unsafe destinations and broken redirect chains also fail. Authentication/bot blocking (401/403), rate limits (429), other unexpected statuses, server errors, DNS failures, and timeouts produce review warnings in the Actions job summary. The checker reads response headers only and never crawls IOC fields or free-text payload URLs. URL fragments are preserved in records but are not checked for matching page anchors. A separate weekly and manually triggered workflow audits all existing links.

For maintainer merge protection and deployment behavior, see [CI and merge checks](docs/CI.md).

## Stack relevance

Adding a YAML record is sufficient to publish it everywhere. The homepage's personalized matches use separate reviewed annotations in `src/data/applicability.json`; a new entry without an annotation is exported as `not_assessed` and does not receive guessed matches.

For a reviewed mapping, use tool and OS IDs from `src/lib/stack-matching.mjs`. Each rule needs a source-supported victim-side product, workflow or OS scope, a relationship (`target`, `credential`, `workflow`, `lure` or `environment`), a concrete reason, conditions to check, and source URLs already present in the record. State affected-version and integration requirements for historical vulnerabilities. `mcp: true` means the rule requires an existing MCP connection, not merely that an attacker installs a new one. Never map attacker-side Claude/Gemini use to exposure of users of those products. Preserve research and evidence qualifications.

Choose an existing flow-node ID for `stage_id` and provide one concrete first `action`. Use `attacker_tool_only` or `not_assessed` with no rules when appropriate. The matching UI is a starting point for review, not a scan, risk score or current-vulnerability assessment. Windows policy links remain subject to the stage control's enforcement and platform prerequisites.

## Associated simulations

An attack record can link to one or more reviewed simulation definitions under `simulations/definitions/`. Use an existing attack ID and exact flow stage IDs. Mark a relationship `source-match` only when original research is shared; label broader mechanics `analogue` and state what is substituted or omitted. Keep research attribution and scoped code/fixture notices.

Definitions contain a legitimate task, synthetic clean/changed fixtures, prerequisites, expected observations and limits. Agent injection and fixed local comparisons are distinct modes. Never infer agent attribution, native vulnerability reproduction or detection from a helper receipt. Platform status needs identified execution evidence.

Regenerate with `npm run simulations:build`, then run `npm run validate`, `npm test` and the browser checks. A new executable recipe or tool capability requires code review, boundary tests and native verification; adding a YAML field cannot enable arbitrary commands or destinations. Keep source fixtures inert; only explicit preparation may materialize a project or skill instruction inside its run-owned disposable workspace. See [the lab guide](docs/SIMULATIONS.md).

## Detection rules on pull requests

The `attack-detections` job runs on `pull_request` and on merge-group checks. It looks at attack files added or modified relative to the base commit (`attacks/*.yaml`). The job uses `pull_request` so the workflow that arrives with the pull request cannot read repository secrets. It does not use `pull_request_target`. Fork pull requests do not receive `DETECTIONS_PUSH_TOKEN`.

For each changed entry the job reuses `entryErrors` from `src/lib/schema.mjs`, then checks:

- `category`, `attribution`, `ai_involvement_confidence`, `detections`, and `timeline` are present and non-empty. `attribution` and `timeline` need at least one filled value. `detections` needs at least one item.
- Every detection URL is a public HTTP(S) address and the final response is HTTP 200. The request uses the same private-address checks as the source-link checker. `guidance` items may omit a URL.
- A Sigma, Splunk, Elastic, KQL, or LOLBAS rule's platform agrees with the operating systems named in the entry. Platforms come from the URL path (`rules/windows`, `rules/macos`, `rules/linux`, and the Sigma `win` filename token) or, when the path has no OS, from the rule's `logsource.product`. The entry's OS comes from its summary, tooling, flow, and notes, using the `windows`, `macos`, `linux`, and `android` ids in `src/lib/stack-matching.mjs`. A Windows rule on an entry that only describes macOS fails. When either side does not name an OS, that comparison is skipped.

The job prints one block per file and exits non-zero when any check fails. Run the same report locally:

```sh
node scripts/validate-pr-entries.mjs --base origin/main
node scripts/validate-pr-entries.mjs attacks/your-entry.yaml
```

Entries whose detections are missing, empty, or only `format: guidance` are sent to [security-detections-mcp](https://github.com/mhaggis/security-detections-mcp) (`security-detections-mcp@3.3.4`). The workflow installs the Sigma, Splunk ESCU, and Elastic rule repositories on a cache miss and lets the server build its SQLite index. `actions/cache` stores `~/.cache/security-detections-mcp` and `.cache/detection-sources` under a key that changes each ISO week (`date -u +%G-W%V`). A missing cache rebuilds the index. Later runs in that week restore it.

Queries use ATT&CK ids found in the entry (`T1059`, `T1543.001`), ATLAS ids and names from `src/data/atlas-techniques.json`, and public IOC tokens. Results are limited to Sigma, Splunk, and Elastic, dropped when the rule platform does not overlap the entry, and capped at five rules in a stable order. Each suggestion is fetched and kept only when its URL returns HTTP 200. Matching rules are written into `detections` and formatted with Prettier.

On a pull request from this repository the job commits those rules to the head branch. Set the optional Actions secret `DETECTIONS_PUSH_TOKEN` (contents write on this repo only) when that commit should start a new workflow run. A push made with the default `GITHUB_TOKEN` does not start another workflow. Fork pull requests cannot be pushed to; the same suggestion list is posted as a pull request comment when the token can write comments, and it is always included in the job summary.

```sh
node scripts/enrich-detections.mjs --base origin/main --dry-run
node scripts/build-detection-index.mjs
node scripts/enrich-detections.mjs attacks/your-entry.yaml
```

Building the index clones the upstream rule repositories and needs network access. Review every suggested rule before merging. A match is a candidate, not confirmation that the rule detects the incident.

## Stage detections

Add an explicit mapping for every phase in `detections/stages.json`, including attacks without simulations. Select a reviewed profile from `detections/definitions/`, explain its fit in a stage note when needed, or use `unassessed` / `unobserved` to record a gap. Fallback diagrams use `entry`, `activity` and `ai` IDs. Do not infer victim-side detection of attacker-side prompts, unknown delivery or unconfirmed deployments.

Profiles hold canonical Sigma / KQL / SPL text, required telemetry, field mapping, research terms and limits. They are catalog-authored drafts; upstream rules need distinct provenance and license attribution. Keep custom-schema event names explicit and retain existing Sigma IDs when editing a shared profile. Run `npm run detections:build` after changing a definition, followed by the normal validation, build and test checks. See [the detection guide](detections/README.md).
