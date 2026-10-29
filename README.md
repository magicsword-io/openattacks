# OpenAttacks

The open catalog of AI attacks. How attackers actually use AI, sourced and mapped to prevention. A community-maintained MagicSword catalog built with Astro, one YAML file per entry, and static JSON/CSV exports.

**Primary domain:** [openattacks.ai](https://openattacks.ai/) · [LLM guide](https://openattacks.ai/llms.txt) · [JSON catalog](https://openattacks.ai/api/attacks.json) · [GitHub](https://github.com/magicsword-io/openattacks)

`openattacks.com`, `www.openattacks.com`, and `www.openattacks.ai` permanently redirect to `https://openattacks.ai`, preserving paths and query strings. The rules live in `vercel.json`; the domains must also be attached to the Vercel project and have valid DNS before they can serve or redirect traffic.

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

Filtering, date sorting, pagination, theme preference, and timeline filtering run in the browser with no backend. Catalog filters are shareable through URL parameters (`q`, `environment`, `role`, `evidence`, `tool`, `sector`, `year`, `region`, `sort`, `page`). Press `/` to focus search. JSON is a public array of entries matching the YAML fields; CSV stores arrays and objects as JSON in quoted cells. Formula-like CSV cells receive an apostrophe prefix for spreadsheet safety.

Model/platform and sector groups match words explicitly present in the reported tooling or victim descriptions. Model/platform and sector dropdowns show the normalized groups. Original product versions, commands and artifacts remain searchable and are preserved in the technical record and exports.

## Reading and browsing

The homepage opens directly into the searchable catalog, with a short introduction and a chronological list grouped by report month. Each entry shows its report date, title, summary, evidence class, environment and AI role. Counts in month headings describe the current page of results, not attack prevalence. Search, environment, attack pattern and evidence are primary filters; normalized products, sectors, year and geography are under More filters. Active filters can be removed individually. `/catalog/` preserves existing links and filters, with the homepage as its canonical URL.

**Find attacks relevant to my stack** opens `/stack/`, where visitors select multiple tools, optional operating systems, and whether they connect to MCP servers. Matching reports explain why they apply, the conditions to check, a first action, and direct links to the relevant diagram stage or draft hunt. Old homepage links with stack parameters or `#your-stack` forward to the new page, preserving the selection. The animated dot chart remains on `/timeline/`; geography remains on `/regions/`. AI-readable resources are available in the footer and About page.

The shared visual theme follows LOLSkills and MagicSword: near-black surfaces, neutral borders, emerald accents and locally hosted Inter Tight typography. The light theme retains the same hierarchy with a darker green for contrast.

Stack selections stay in shareable URL parameters (`tools=cursor,claude-code`, `os=windows`, `mcp=yes|no|unknown`). Matching runs locally without an account or an inventory upload. Tools are ORed; selected operating systems narrow rules with an explicit OS scope. MCP=no excludes rules requiring an existing MCP connection, while a reported attack that installs a new rogue server can still match. An unanswered or unknown MCP setting retains product-specific matches with an explicit condition to confirm. MCP=yes alone matches reviewed generic MCP workflows, without assuming a particular product. Ordering groups product/integration reports, credential exposure, workflows, lures and broader host patterns, then report date; it is not a risk ranking.

`src/data/applicability.json` holds reviewed victim-side applicability rules, source references, version/configuration conditions and first actions. A product being used by an attacker does not establish relevance to users of that product. The initial mapping covers 43 of 68 entries; unmapped records remain available in the full catalog. Newly merged entries automatically receive an explicit `not_assessed` fallback until reviewed, with no inferred matches. `api/relevance.json` exposes every entry and the same rules, coverage counts and category definitions. Missing matches do not establish safety.

The inventory handoff links to MagicSword's software-inventory page; visitors review MCP connections and permissions in their AI client settings. The separate **Connect MagicSword MCP** link uses the supplied setup-page preview and states its Enterprise requirement. Set `MAGICSWORD_MCP_SETUP_URL` at build time when that page has its final URL; `MAGICSWORD_INVENTORY_URL` can also override the inventory destination. The current MCP default is `https://magic-portal-git-josehelps-mcp-server-m-a9b665-d1vious-projects.vercel.app/mcp#connect`.

All outbound MagicSword navigation, inventory, MCP and policy links carry `utm_source=openattacks` and `utm_medium=referral`; `utm_content` identifies the placement. Query parameters and fragments such as `#connect` are preserved. Attribution does not add an analytics script or alter source-evidence URLs in raw catalog exports.

Entry pages lead with the takeaway and an expanded **What happened** account before the attack diagram. Selecting a stage opens **Evidence**, **Prevent** and **Hunt** tabs; evidence is the initial view, and draft hunt status stays visible. Tooling, impact, ATLAS mappings and record/download utilities are disclosures below the flow. Mobile stages use ordinary page scrolling and preserve the graph's explicit branch and loop relationships.

`src/data/presentation.json` contains reviewed editorial titles, summaries, source-stated environments and evidence classes. These are browse annotations, not independent incident verification or changes to the original YAML. `api/catalog.json` publishes this index alongside its category definitions and links to the source evidence; `api/attacks.json` retains exact public YAML parity. New entries without editorial annotations still generate a page, index record and all exports automatically, using their source title/summary and explicit unclassified/unspecified labels instead of inferred certainty.

## Validation and tests

```sh
npm run validate
npm run check
npm run build
npm test
```

Browser checks cover all filters, search, sorting, pagination, stack matching and share links, MagicSword attribution, mobile sizing, theme persistence, internal links, and automated WCAG AA scans in both themes. They require Python 3 for the local static test server. Tests use a dedicated port (14323, override with `PLAYWRIGHT_PORT`) and fail if it is occupied, so another workspace's server cannot be mistaken for this site:

```sh
npx playwright install chromium
npm run test:browser
```

The test suite checks all seed records, unknown-field rejection, dates, source URL validation, role enums, and exact build output parity with public YAML data. Build before running `npm test`.

The seed has no confidence assessments, so the empty confidence filter and labels are hidden. Sixteen entries carry research or other evidence qualifications, which remain visible before their diagrams. Seed review dates reflect the supplied October 20, 2026 research snapshot; they do not represent independent verification by the site builder. Internal publication status and Typefully draft/scheduled links were removed during import. Published social post URLs were retained where provided.

## Vercel

Import `magicsword-io/openattacks` into Vercel and select `main` as the production branch. The repository can remain private. Vercel reads the Astro framework, install command (`npm ci`), build command (`npm run check && npm run build && npm test`), and output directory (`dist`) from `vercel.json`.

Every merge to `main` rebuilds and publishes the site, `llms.txt`, `llms-full.txt`, and all catalog exports together. Pull requests receive preview deployments. Failed validation or export tests stop publishing.

Use the root base path (`/`, the default). Canonical URLs, sitemaps, social metadata, and LLM links default to `https://openattacks.ai`, including in preview builds. Remove stale `SITE_URL` and `BASE_PATH` overrides from the Vercel project, or explicitly set `SITE_URL=https://openattacks.ai` and `BASE_PATH=/`. `SITE_URL` can still override the canonical domain for an alternate deployment. Local commands never publish anything.

The production Vercel project is named `openattacks`. In its Domains settings, attach `openattacks.ai`, `openattacks.com`, `www.openattacks.com`, and `www.openattacks.ai`, then apply the DNS records Vercel specifies at the registrar. The `.ai` apex serves the site; `vercel.json` redirects the other three hosts with HTTP 308 responses. Existing `ai-attacks.vercel.app` links remain as a legacy alias of the same project. Legacy social-image paths also redirect to `openattacks-share.png`.

The four domains were attached to Vercel on 2026-10-29. DNS is managed at Squarespace; Vercel's current configuration check requests these records in each domain's DNS zone:

| Domain            | Type | Host  | Value         |
| ----------------- | ---- | ----- | ------------- |
| `openattacks.ai`  | `A`  | `@`   | `76.76.21.21` |
| `openattacks.ai`  | `A`  | `www` | `76.76.21.21` |
| `openattacks.com` | `A`  | `@`   | `76.76.21.21` |
| `openattacks.com` | `A`  | `www` | `76.76.21.21` |

Recheck Vercel's Domains settings for the current recommended records when configuring DNS. Deploy this branch's changes to activate the host and legacy-image redirects.

To deploy from the CLI after linking the project:

```sh
vercel link
vercel deploy
vercel deploy --prod
```

`.vercel/` is local configuration and is not committed. `.vercelignore` excludes workspace attachments and generated files from CLI uploads.

## GitHub Pages (optional)

The GitHub Pages workflow is manual so an unavailable Pages plan does not fail every merge. To use it, first enable Pages with **GitHub Actions** as the build source in repository settings, then run **Deploy to GitHub Pages** from the Actions tab. Private repositories require a GitHub plan that supports Pages for private repositories.

The default deployment is `https://magicsword-io.github.io/openattacks/`. All internal links, assets, canonical URLs, and sitemaps respect the configured base path.

For a custom domain, set repository Actions variables:

| Variable        | Example                  |
| --------------- | ------------------------ |
| `SITE_URL`      | `https://openattacks.ai` |
| `BASE_PATH`     | `/`                      |
| `CUSTOM_DOMAIN` | `openattacks.ai`         |

The workflow writes `public/CNAME` when `CUSTOM_DOMAIN` is set. Alternatively add `public/CNAME` yourself. Configure the domain’s DNS and GitHub Pages custom-domain settings separately.

For the default project-path deployment, leave `CUSTOM_DOMAIN` unset, use `SITE_URL=https://magicsword-io.github.io` and `BASE_PATH=/openattacks`. Vercel's host redirects apply only to Vercel deployments.

To test a project-path build locally:

```sh
SITE_URL=https://magicsword-io.github.io BASE_PATH=/openattacks npm run build
BASE_PATH=/openattacks npm run preview
```

Open `http://localhost:4321/openattacks/` for this project-path preview.

## API

The static files are available under the deployment base path at `api/attacks.json` and `api/attacks.csv`. Vercel serves the API and LLM text files with `Access-Control-Allow-Origin: *` so browser clients on other origins can read them. Both formats are rebuilt from the validated YAML on every deployment.

## AI-readable catalog and automatic updates

The landing page links directly to `llms.txt`, which provides the current entry count, a query guide, and links to every entry. `llms-full.txt` includes the complete Markdown context: source credit, caveats, target geography, flow nodes and edges, ATLAS rationale, and defensive notes. Each entry also has `api/attacks/<id>.json` and `api/attacks/<id>.md`; `api/schema.json` publishes the public schema and `api/atlas.json` describes the referenced MITRE ATLAS definitions.

These are **Astro build routes, not manually maintained files**. A merged attack PR pushes to `main`, triggering Vercel's connected Git deployment. The same build validates YAML and regenerates the site, all AI-readable files and all API formats. Tests verify that every YAML record appears in every appropriate output before publishing. No runtime MCP server is needed: assistants can read the discovery guide or download the JSON array and query it locally.

## Flows, maps and mappings

All 68 seed entries now contain source-linked attack-flow graphs. React Flow renders desktop diagrams on demand with zoom, pan and fit controls; mobile uses a scrollable stage list with explicit graph connections; a server-rendered text version remains available to readers and crawlers. New entries without a curated graph receive a factual summary diagram. Unknowns, PoCs, conceptual findings and separately reported branches retain their qualifications.

The flows use selectable icon nodes. Each stage can show its original evidence, a hunt hypothesis, required telemetry, investigation steps, query starters in Sigma / KQL / SPL, and a copyable research brief for [Security Detections MCP](https://github.com/MHaggis/Security-Detections-MCP). The site does not connect to that server or claim to have searched its rule index. Native process and Bedrock discovery starters identify their collectors; application / platform examples declare a custom audit schema and require field mapping. All are drafts, with no claimed validation against production telemetry.

Stage annotations live in `src/data/stage-guidance.json`, keyed by attack ID and flow-node ID; reusable hypotheses, query templates and control definitions live in `src/lib/stage-guidance.ts`. Adding an entry automatically creates its `api/defenses/<id>.json` pack and an item in `api/defenses.json`. Stages without annotations explicitly display “not mapped”; unknown or unconfirmed runtime claims do not receive invented rules. CI checks annotation references and export parity.

Green MagicSword links mark conditional **Windows execution-policy opportunities**, with the exact branch and prerequisites in the stage detail. They are editorial recommendations based on [MagicSword's documented application-control capabilities](https://www.magicsword.io/use-cases/application-control?utm_source=openattacks&utm_medium=referral&utm_content=readme-control), not verified incident prevention. Audit mode does not block; an enforced policy must cover the actual executable. Cloud-only, social, browser-extension, macOS and Linux activities are not presented as covered Windows execution paths. Community research links are context, not enforcement products. These annotations are also included in generated LLM Markdown.

Target geography uses normalized names. The map excludes actor attribution, hosting and telemetry locations from victim counts; entry-level `region_notes` preserve those distinctions. Unknown and multi-country-unspecified records remain separate from mapped locations. Map geometry comes from public-domain Natural Earth data through world-atlas.

MITRE ATLAS annotations reference the official atlas-data v5.6.0 IDs and names, with rationale and original source URLs. The imported metadata includes MITRE’s license; annotations are this catalog’s interpretation, not MITRE endorsement. The official MagicSword logos are bundled locally for both themes.
