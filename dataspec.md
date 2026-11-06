# OpenAttacks data specification

How the catalog stores its data, how that data turns into the site and APIs, and what you need to add a new entry.

## 1. Storage model

There is **no database and no runtime backend**. Everything is plain files in git, and the site is built to static HTML and JSON with Astro (`output: "static"` in `astro.config.mjs`). Merging to `main` triggers a Vercel rebuild, which regenerates every page and export.

| Layer | Location | Format | Role | Required for a new entry? |
|---|---|---|---|---|
| Attack records | `attacks/<id>.yaml` | YAML, one file per entry | Source of truth for each attack | **Yes** |
| Record schema | `schema.yaml` | JSON Schema 2020-12, written as YAML | Validates every attack file | Change it only to add fields or enum values |
| Browse card | `src/data/presentation.json` | JSON keyed by attack ID | Curated title, summary, environments and evidence class | No, but recommended (there's a fallback) |
| Stage defenses | `detections/stages.json` + `detections/definitions/*.yaml` | JSON stage mappings + YAML profiles | Maps every flow stage to a detection profile or an explicit evidence gap | **Yes**: every flow node needs a mapping |
| Stack relevance | `src/data/applicability.json` | JSON keyed by attack ID | Reviewed "does this affect my stack" rules | No (the default is `not_assessed`) |
| ATLAS reference | `src/data/atlas-techniques.json` | JSON | Official MITRE ATLAS technique names and URLs (v5.6.0) | Only when new ATLAS IDs are needed |
| Simulations | `simulations/definitions/*.yaml` + `simulations/fixtures/` → `simulations/catalog.json` | YAML in, generated JSON out | Lab exercises linked to attack stages | No (closed set; see §6) |
| Editorial patterns | `src/pages/patterns.md` | Markdown | Cross-entry observations | No |

Current coverage: 111 attack files. All 111 have a curated `attack_flow` and explicit stage-detection mappings; 66 have curated presentation and applicability annotations, and 95 have `atlas_techniques`.

### Load and validation pipeline

```
attacks/*.yaml
   │  parsed with `yaml`; duplicate keys rejected (scripts/validate.mjs)
   ▼
src/lib/schema.mjs  ── Ajv 2020 (strict) against schema.yaml
   │                   + custom checks (§3.3)
   ▼
src/content.config.ts ── Astro content collection "attacks"
   │                     (strips the internal `typefully` field)
   ▼
src/lib/catalog.ts getAttacks()  ── sorted newest first
   │
   ├── joins src/data/presentation.json    (src/lib/presentation.ts)
   ├── joins src/data/applicability.json   (src/lib/stack-data.ts)
   ├── maps detections/stages.json through detections/catalog.json
   │      (src/lib/stage-guidance.ts)
   └── falls back to an auto-generated flow when attack_flow is absent (src/lib/attack-flow.ts)
   ▼
Generated at build time (do not edit by hand):
  /attacks/<id>/                 entry pages
  /api/attacks.json, attacks.csv, catalog.json, schema.json, relevance.json,
  defenses.json, atlas.json, simulations.json
  /api/attacks/<id>.json, /api/attacks/<id>.md, /api/defenses/<id>.json
  /llms.txt, /llms-full.txt, sitemap
```

## 2. Attack record: `attacks/<id>.yaml`

`schema.yaml` is authoritative. It sets `additionalProperties: false`, so **any field not listed below fails validation**.

### 2.1 Required fields

| Field | Type | Rules / notes |
|---|---|---|
| `id` | string | `^[a-z0-9]+(-[a-z0-9]+)*$`. **Must equal the filename** (`<id>.yaml`) and be unique. Convention: `<name>-<yyyy>[-<mm>]` or a CVE ID. |
| `name` | string | Non-empty display name. |
| `date_reported` | string | `YYYY-MM-DD` or `YYYY-MM` (a real calendar date). Precision is preserved; partial dates sort as the 1st of the month. |
| `researcher` | string | Credited researcher(s), or `unknown`. |
| `org` | string | Researching organization, or `unknown`. |
| `sources` | array, at least 1 | Each item is `{ url (uri, required), title?, publisher? }` with no other keys. |
| `ai_role` | enum | `attacker_uses_ai_as_operator`, `ai_tool_as_lure`, `ai_agent_or_mcp_as_target`, `ai_infra_as_c2`, `llm_generated_malware`, `ai_credential_theft`, `other` |
| `technique_summary` | string | Non-empty. Describe the attack and the evidence for AI involvement. |
| `initial_access` | string | Or `unknown`. |
| `ai_tooling_and_models` | string[] | Can be `[]`. Also drives the platform filter groups (regexes in `catalog.ts`: Claude, ChatGPT, Gemini, MCP, Cursor, and others). |
| `other_tooling` | string[] | Can be `[]`. |
| `victims_and_sectors` | string | Free text. Drives the sector filters by regex (government, finance, technology, and others). |
| `regions` | string[] | At least 1 item, unique, from the canonical enum in `schema.yaml` (country names such as `United States`, `Bosnia and Herz.`; broader regions such as `Europe`; plus `Multiple regions`, `unknown`, `Not applicable`). |
| `attribution_or_cluster` | string | Or `unknown`. |
| `scale_and_metrics` | string | Or `unknown`. Never invent counts. |
| `prevention_angle` | string | Or `unknown`. |
| `related_magicsword_projects` | enum[] | Any of `GTFOBins`, `HijackLibs`, `LOLBAS`, `LOLDrivers`, `LOLRMM`, `LOLSkills`, `LOTTunnels`. Can be `[]`. |
| `borderline` | boolean | `true` for PoCs, marketplace claims and other qualified concrete reports. Conceptual scenarios are not eligible for the catalog. |

### 2.2 Optional fields

| Field | Type | Rules / notes |
|---|---|---|
| `aliases` | string[] | |
| `date_activity_start` / `date_activity_end` | string or null | If both are set, start must be ≤ end. |
| `borderline_note` | string or null | Explain the qualification when `borderline: true`. Shown as "qualification" in the exports. |
| `ai_role_secondary` | enum or null | Same values as `ai_role`. |
| `ai_role_detail` | string or null | |
| `confidence` | `high` \| `medium` \| `low` | Evidence for **AI involvement**. Omit when not assessed; the site shows "Not assessed". |
| `last_reviewed` | `YYYY-MM-DD` | The date you actually reviewed the sources. |
| `source_notes` | string or null | Limits of the evidence. |
| `region_notes` | string | Qualifications and excluded labels for the region choice. |
| `magicsword_coverage` | uri[] | **Published** public post URLs only. |
| `iocs` | object | Only `domains`, `ips`, `hashes`, `urls` (each a string[]). Defang them. No victim data. |
| `tags` | string[] | |
| `atlas_techniques` | array | See §2.3. |
| `attack_flow` | object | See §2.4. |
| `typefully` | object or null | Legacy internal tracking. The loader **strips** it, so don't use it in this public repo. |

### 2.3 `atlas_techniques`

```yaml
atlas_techniques:
  - id: AML.T0073            # must be in the schema enum (mirrors src/data/atlas-techniques.json)
    rationale: Why this mapping holds, per the source.
    source_urls: [https://…] # at least 1, unique; every URL must also appear in `sources`
```

These are catalog annotations, not MITRE assignments. Leave the field out when the evidence doesn't support a mapping. To use an ATLAS ID that isn't in the enum yet, add it to **both** `schema.yaml` and `src/data/atlas-techniques.json`.

### 2.4 `attack_flow`

A directed graph rendered with React Flow.

```yaml
attack_flow:
  nodes:                      # 2 to 12 nodes
    - id: step-1              # ^[a-z][a-z0-9-]*$, unique
      title: Short title      # 1 to 80 chars
      description: Source-supported description.
      kind: access            # access | ai | execution | impact | unknown
      source_urls: [https://…]  # each must appear in `sources`
  edges:                      # at least 1
    - source: step-1
      target: step-2
      label: optional
      loop: true              # optional, for repeated steps
```

Custom rules (in `src/lib/schema.mjs`):

- Node IDs are unique.
- Every edge references existing nodes.
- No self-edges.
- Every node is connected to at least one edge.

If `attack_flow` is omitted, `attackFlow()` builds a three-node summary (`entry` → `activity` ← `ai`) from `initial_access`, `technique_summary` and `ai_role_detail`/`ai_tooling_and_models`.

**Convention:** many entries use `step-1`…`step-N`. The annotations in §4 refer to exact node IDs, so add a curated flow before annotating stages.

YAML anchors (`&a1` / `*a1`) are allowed and widely used to reuse `source_urls` lists.

## 3. Validation

### 3.1 Commands

```bash
npm ci                     # once
npm run format:data        # Prettier: rewrites attacks/*.yaml and schema.yaml in place
npm run format:data:check  # Prettier: fails if any of those files is not formatted (runs in CI)
npm run validate           # schema + custom checks on attacks/*.yaml, plus a simulation catalog drift check
npm run check          # astro check (types)
npm run build          # validate + simulations check + lab bundle + astro build → dist/
npm test               # node --test tests/*.test.mjs (reads dist/, so build first)
npm run test:browser   # Playwright + axe
npm run dev            # local preview with hot reload of attacks/*.yaml
```

CI (`.github/workflows/ci.yml`) runs format:data:check → validate → check → build → test → browser tests on every PR and on pushes to `main`.

The formatting check also runs inside `npm test` (`tests/format.test.mjs`), so a local test run catches unformatted YAML. Formatting uses Prettier, configured in `.prettierrc.json`: YAML only, `printWidth: 100`, `proseWrap: preserve`. Simulation definitions are deliberately excluded, because `build-simulations.mjs` hashes their exact bytes into `simulations/catalog.json`.

### 3.2 Schema checks (Ajv, strict mode)

These cover required fields, types, enums, the `report-date` format (a real calendar date, or `YYYY-MM`), URI format, and rejection of unknown properties. Error messages include the field path.

### 3.3 Custom checks (`entryErrors` in `src/lib/schema.mjs`)

- The filename equals `${id}.yaml`.
- No duplicate IDs across files (`scripts/validate.mjs`).
- No duplicate YAML keys.
- The flow graph rules in §2.4.
- Every `attack_flow` node URL and every `atlas_techniques` URL appears in `sources`.
- `date_activity_start` ≤ `date_activity_end`.

### 3.4 Test-enforced consistency (`tests/*.test.mjs`, run on the built `dist/`)

- The JSON exports exactly match the public YAML content and leave out `typefully`.
- Every YAML ID appears in `llms.txt`, `llms-full.txt`, its entry page, and the per-entry `.json`/`.md` exports.
- **No stale annotation keys:** every key in `presentation.json`, `applicability.json` and `detections/stages.json` must be an existing attack ID, and every detection stage key must be an existing flow node ID.
- Presentation values use valid environment and evidence IDs. `summary` is ≤ 210 characters. `unspecified` cannot be combined with other environments.
- Applicability rules use real tool/OS IDs, a valid stage, and source URLs from the record. Attacker-side Claude/Gemini use never turns into a product-exposure match.

## 4. Annotations and stage detections

These files are keyed by attack ID. A YAML record alone is enough to publish an entry, and presentation/relevance use safe fallbacks when their optional annotations are absent. Stage detections are stricter: every flow node must map to a reviewed profile or an explicit gap.

### 4.1 `presentation.json`: browse card

```json
"<attack-id>": {
  "title": "Descriptive display title",
  "summary": "≤ 210 chars",
  "environments": ["macos"],
  "evidence": "campaign"
}
```

- `environments`: `windows`, `macos`, `linux`, `cloud`, `web`, `agents`, `development`, `browser`, `android`, `business`, `provider`, `unspecified`
- `evidence`: `campaign`, `vulnerability`, `research`, `concept`, `claim`, `analysis`, `provider`, `finding`, `qualified`, `unclassified`
- **Fallback:** `title = name`, the summary is a truncated `technique_summary`, `environments = ["unspecified"]`, and `evidence` is `qualified` if `borderline`, otherwise `unclassified`.

### 4.2 `detections/stages.json`: per-stage hunt and defense

```json
"<attack-id>": {
  "step-3": {
    "profile": "windows-shell",
    "control": "script-hosts",
    "scope": "Which branch the control covers",
    "resource": "LOLSkills",
    "note": "optional"
  }
}
```

- `profile` is required and must match a canonical profile in `detections/definitions/*.yaml`. `native` profiles use named vendor/normalized telemetry, `custom_schema` profiles require the documented OpenAttacks audit mapping, and `gap` profiles publish no query.
- Use `unobserved` when the source does not establish runtime behavior and `unassessed` when no stage-specific hunt has been reviewed. These gaps do not mean the behavior is undetectable or absent.
- `control` (optional): `script-hosts`, `shell-helper`, `unapproved-code`. These produce the MagicSword policy CTA.
- `resource` (optional): `LOLSkills`, `GTFOBins`, `HijackLibs`, `LOLDrivers`.
- Add or edit profiles under `detections/definitions/`, then run `npm run detections:build` to regenerate `detections/catalog.json`. Controls and resources remain code-reviewed definitions in `src/lib/stage-guidance.ts`.

### 4.3 `applicability.json`: "my stack" relevance

```json
"<attack-id>": {
  "status": "mapped",
  "reviewed": "YYYY-MM-DD",
  "review_basis": "Editorial applicability reviewed against the catalog source account; not a scan or independent incident verification.",
  "stage_id": "step-3",
  "action": "One concrete first action.",
  "rules": [{
    "tools": ["claude"],
    "systems": ["macos"],
    "mcp": false,
    "relationship": "lure",
    "reason": "Concrete, source-supported reason.",
    "conditions": ["What must be true for this to apply"],
    "source_urls": ["https://… (must be in the record's sources)"]
  }]
}
```

- `status`: `mapped` (needs `stage_id`, `action` and at least one rule), `attacker_tool_only` or `not_assessed` (both need `rules: []`, plus an optional `note`).
- `tools`: IDs from `stackTools` in `src/lib/stack-matching.mjs`. Examples: `cursor`, `claude-code`, `github-copilot`, `chatgpt`, `copilot-studio`, `bedrock`, `claude`, `gemini`, `mcp-remote`, `ai-api-keys`, `agent-skills`, `npm-pypi`.
- `systems`: `windows`, `macos`, `linux`, `android`. Use `[]` for any.
- `relationship`: `target`, `credential`, `workflow`, `lure`, `environment`.
- `mcp: true` means the rule needs an **existing** MCP connection.
- **Fallback:** `not_assessed` with no matches. Never guess a mapping.

## 5. Adding a new attack: checklist

1. **Research.** Read the primary source. Record the researcher, the org and a URL for every claim. Use `unknown` or `[]` instead of guessing.
2. **Create `attacks/<id>.yaml`.** The ID is lowercase and hyphenated, and the filename matches it. Start from this minimal valid template:

   ```yaml
   id: example-campaign-2026-11
   name: Example campaign
   date_reported: '2026-11-05'
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
   last_reviewed: '2026-11-05'
   ```

3. **Optional enrichment in the YAML:** `confidence`, `borderline_note`, `attack_flow` (use `step-N` IDs, with source URLs taken from `sources`), `atlas_techniques`, `region_notes`, `source_notes`, `iocs` (defanged), `tags`, `aliases`.
4. **Add annotations and stage mappings:**
   - `src/data/presentation.json`: title, summary, environments, evidence.
   - `src/data/applicability.json`: `mapped`, `attacker_tool_only` or `not_assessed`.
   - `detections/stages.json` (**required**): map every flow node to a profile, including explicit `unassessed` or `unobserved` gaps.
5. **Verify:**
   ```bash
   set -o pipefail
   npm run format:data && npm run validate && npm run check && npm run build && npm test
   ```
6. **Preview** with `npm run dev`, at `/attacks/<id>/`.
7. **Open a PR** against `main`. After the merge, Vercel rebuilds every page, API, CSV, LLM file and the sitemap.

Contributors without repo access can also open the GitHub issue form at `.github/ISSUE_TEMPLATE/submit-attack.yml`.

### Content rules (from CONTRIBUTING.md)

- Every factual claim needs a source URL. Prefer primary reports.
- No live victim data and no unredacted victim IPs. Only include IOCs that were published for defensive use, and defang them.
- Regions are **target** geography only. Never use actor nationality, hosting location or HQ.
- Mark PoCs and uncertain concrete claims `borderline: true` and give a `borderline_note`; do not add conceptual scenarios.
- `confidence` is about evidence of AI involvement, not about the attack itself.
- Keep the tone factual. Credit the researcher. Don't make unsupported claims about what a product blocks.

## 6. Simulations: a closed set

Simulation labs live in `simulations/definitions/<slug>.yaml` with inert fixtures in `simulations/fixtures/<slug>/`. `npm run simulations:build` compiles them into `simulations/catalog.json`. `validate` and `build` fail on drift.

The builder (`scripts/build-simulations.mjs`) is deliberately strict:

- It requires **exactly seven** definitions, with slugs fixed in its `recipes` map.
- It requires an exact key set per definition: `id`, `recipe`, `mode`, `title`, `question`, `summary`, `attack_mappings`, `requirements`, `observations`, `limitations`, `research_credit`, `research_url`, `sources`, `fixtures`, `task`, `platforms`, `provenance`.
- Fixtures are SHA-256 pinned, and symlinks or extra files are rejected.
- Each `attack_mappings` item links to an attack ID and its flow stage IDs, with a `relationship` of `source-match` or `analogue`.

**Consequences:**

- Linking an **existing** simulation to a new attack means editing that definition's `attack_mappings`, then running `npm run simulations:build`.
- Adding a **new** simulation is a code change (new recipe, builder update, boundary tests, native verification), not a data change. See `docs/SIMULATIONS.md`.

## 7. Site-wide and reference data to keep in sync

| When you… | Also update |
|---|---|
| Use a new ATLAS ID | the `schema.yaml` enum **and** `src/data/atlas-techniques.json` |
| Need a new region value | the `schema.yaml` `regions` enum (and the map data in `src/lib/geography.ts` if it isn't a world-atlas name) |
| Need a new MagicSword project | the `schema.yaml` enum and `projects` in `src/lib/catalog.ts` |
| Need a new stack tool | `stackTools` in `src/lib/stack-matching.mjs` |
| Need a new platform or sector filter | the regex lists in `src/lib/catalog.ts` |
| Do a full catalog re-review | the `reviewed` constant in `src/lib/catalog.ts` |
| Rename or delete an attack or flow node | update `src/data/presentation.json`, `src/data/applicability.json`, `detections/stages.json`, and any simulation `attack_mappings` (stale keys fail validation/tests) |
