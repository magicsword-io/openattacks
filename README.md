# AI Attacks

How attackers actually use AI, sourced and mapped to prevention. A community-maintained MagicSword catalog built with Astro, one YAML file per entry, and static JSON/CSV exports.

**Live site:** [ai-attacks.vercel.app](https://ai-attacks.vercel.app/) · [LLM guide](https://ai-attacks.vercel.app/llms.txt) · [JSON catalog](https://ai-attacks.vercel.app/api/attacks.json)

## Run locally

Requires Node **22.22.0 or newer**.

```sh
npm ci
npm run dev
```

Open `http://localhost:4321`. `npm run build` validates all YAML entries and creates `dist/`; `npm run preview` serves that production build.

To build and run the production site locally:

```sh
npm run build
npm run preview
```

The preview also opens at `http://localhost:4321` when that port is available. If the development server is already using it, use `npm run preview -- --port 4322` and open `http://localhost:4322`.

## Add an entry in under five minutes

1. Copy the YAML template from [CONTRIBUTING.md](CONTRIBUTING.md) to `attacks/<your-id>.yaml`.
2. Fill in the original source URLs, researcher credit, report date, AI role, technique, and prevention angle. Use `unknown` instead of guessing.
3. Run `npm run validate` and open `npm run dev` to preview your entry.
4. Open a pull request against `main`. Every entry gets its own page, an Edit on GitHub link, and inclusion in the API automatically.

Read the [sourcing and privacy rules](CONTRIBUTING.md) before submitting. Include no live victim data or unredacted victim IPs.

## Structure

- `attacks/*.yaml`: 68 seed entries; the source of truth for the public catalog.
- `schema.yaml`: strict JSON Schema, validated with Ajv both in CI and the Astro content loader.
- `src/content.config.ts`: YAML content collection; strips internal `typefully` data.
- `src/pages/`: home, searchable catalog, animated dot timeline, target-geography map, entry flows, methodology, and editable `patterns.md`.
- `src/pages/api/`: generated `api/attacks.json` and `api/attacks.csv`.
- `.github/workflows/`: PR checks and an optional, manually triggered GitHub Pages deployment.
- `vercel.json`: production build checks, static hosting, and public data response headers.

Filtering, date sorting, pagination, theme preference, and timeline filtering run in the browser with no backend. Catalog filters are shareable through URL parameters (`q`, `role`, `year`, `region`, `tool`, `sector`, `project`, `confidence`, `evidence`, `sort`, `page`). Press `/` to focus search. JSON is a public array of entries matching the YAML fields; CSV stores arrays and objects as JSON in quoted cells. Formula-like CSV cells receive an apostrophe prefix for spreadsheet safety.

Model/platform and sector groups match words explicitly present in the reported tooling or victim descriptions. The original labels remain available in the filters and exports; these groups do not add new claims to the YAML.

## Validation and tests

```sh
npm run validate
npm run check
npm run build
npm test
```

Browser checks cover all filters, search, sorting, pagination, mobile sizing, theme persistence, internal links, and automated WCAG AA scans in both themes. They require Python 3 for the local static test server:

```sh
npx playwright install chromium
npm run test:browser
```

The test suite checks all seed records, unknown-field rejection, dates, source URL validation, role enums, and exact build output parity with public YAML data. Build before running `npm test`.

The seed has no confidence assessments, so entries display “Not assessed.” Sixteen entries are flagged as research or borderline. Seed review dates reflect the supplied October 20, 2026 research snapshot; they do not represent independent verification by the site builder. Internal publication status and Typefully draft/scheduled links were removed during import. Published social post URLs were retained where provided.

## Vercel

Import `magicsword-io/ai-attacks` into Vercel and select `main` as the production branch. The repository can remain private. Vercel reads the Astro framework, install command (`npm ci`), build command (`npm run check && npm run build && npm test`), and output directory (`dist`) from `vercel.json`.

Every merge to `main` rebuilds and publishes the site, `llms.txt`, `llms-full.txt`, and all catalog exports together. Pull requests receive preview deployments. Failed validation or export tests stop publishing.

Use the root base path (`/`, the default); remove any `BASE_PATH=/ai-attacks` override inherited from GitHub Pages. Canonical URLs, sitemaps, and LLM links use Vercel's production domain automatically. Set `SITE_URL=https://your-domain.example` in Vercel if you want to override that domain. Local commands remain unchanged and never publish anything.

To deploy from the CLI after linking the project:

```sh
vercel link
vercel deploy
vercel deploy --prod
```

`.vercel/` is local configuration and is not committed. `.vercelignore` excludes workspace attachments and generated files from CLI uploads.

## GitHub Pages (optional)

The GitHub Pages workflow is manual so an unavailable Pages plan does not fail every merge. To use it, first enable Pages with **GitHub Actions** as the build source in repository settings, then run **Deploy to GitHub Pages** from the Actions tab. Private repositories require a GitHub plan that supports Pages for private repositories.

The default deployment is `https://magicsword-io.github.io/ai-attacks/`. All internal links, assets, canonical URLs, and sitemaps respect the configured base path.

For a custom domain, set repository Actions variables:

| Variable | Example |
| --- | --- |
| `SITE_URL` | `https://your-domain.example` |
| `BASE_PATH` | `/` |
| `CUSTOM_DOMAIN` | `your-domain.example` |

The workflow writes `public/CNAME` when `CUSTOM_DOMAIN` is set. Alternatively add `public/CNAME` yourself. Configure the domain’s DNS and GitHub Pages custom-domain settings separately.

To test a project-path build locally:

```sh
SITE_URL=https://magicsword-io.github.io BASE_PATH=/ai-attacks npm run build
BASE_PATH=/ai-attacks npm run preview
```

Open `http://localhost:4321/ai-attacks/` for this project-path preview.

## API

The static files are available under the deployment base path at `api/attacks.json` and `api/attacks.csv`. Vercel serves the API and LLM text files with `Access-Control-Allow-Origin: *` so browser clients on other origins can read them. Both formats are rebuilt from the validated YAML on every deployment.


## AI-readable catalog and automatic updates

The landing page links directly to `llms.txt`, which provides the current entry count, a query guide, and links to every entry. `llms-full.txt` includes the complete Markdown context: source credit, caveats, target geography, flow nodes and edges, ATLAS rationale, and defensive notes. Each entry also has `api/attacks/<id>.json` and `api/attacks/<id>.md`; `api/schema.json` publishes the public schema and `api/atlas.json` describes the referenced MITRE ATLAS definitions.

These are **Astro build routes, not manually maintained files**. A merged attack PR pushes to `main`, triggering Vercel's connected Git deployment. The same build validates YAML and regenerates the site, all AI-readable files and all API formats. Tests verify that every YAML record appears in every appropriate output before publishing. No runtime MCP server is needed: assistants can read the discovery guide or download the JSON array and query it locally.

## Flows, maps and mappings

All 68 seed entries now contain source-linked attack-flow graphs. React Flow renders them on demand with zoom, pan and fit controls; a server-rendered text version remains available to readers and crawlers. New entries without a curated graph receive a factual summary diagram. Unknowns, PoCs, conceptual findings and separately reported branches retain their qualifications.

The flows use selectable icon nodes. Each stage can show its original evidence, a hunt hypothesis, required telemetry, investigation steps, query starters in Sigma / KQL / SPL, and a copyable research brief for [Security Detections MCP](https://github.com/MHaggis/Security-Detections-MCP). The site does not connect to that server or claim to have searched its rule index. Native process and Bedrock discovery starters identify their collectors; application / platform examples declare a custom audit schema and require field mapping. All are drafts, with no claimed validation against production telemetry.

Stage annotations live in `src/data/stage-guidance.json`, keyed by attack ID and flow-node ID; reusable hypotheses, query templates and control definitions live in `src/lib/stage-guidance.ts`. Adding an entry automatically creates its `api/defenses/<id>.json` pack and an item in `api/defenses.json`. Stages without annotations explicitly display “not mapped”; unknown or unconfirmed runtime claims do not receive invented rules. CI checks annotation references and export parity.

Green MagicSword links mark conditional **Windows execution-policy opportunities**, with the exact branch and prerequisites in the stage detail. They are editorial recommendations based on [MagicSword's documented application-control capabilities](https://www.magicsword.io/use-cases/application-control), not verified incident prevention. Audit mode does not block; an enforced policy must cover the actual executable. Cloud-only, social, browser-extension, macOS and Linux activities are not presented as covered Windows execution paths. Community research links are context, not enforcement products. These annotations are also included in generated LLM Markdown.

Target geography uses normalized names. The map excludes actor attribution, hosting and telemetry locations from victim counts; entry-level `region_notes` preserve those distinctions. Unknown and multi-country-unspecified records remain separate from mapped locations. Map geometry comes from public-domain Natural Earth data through world-atlas.

MITRE ATLAS annotations reference the official atlas-data v5.6.0 IDs and names, with rationale and original source URLs. The imported metadata includes MITRE’s license; annotations are this catalog’s interpretation, not MITRE endorsement. The official MagicSword logos are bundled locally for both themes.
