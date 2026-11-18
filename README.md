# OpenAttacks

**The open catalog of AI attacks.** OpenAttacks collects documented cases of AI-enabled attacks and attacks against AI systems, then maps the reporting to attack flows, defensive context, detections, and safe simulations.

[Explore the catalog](https://openattacks.ai/) · [Browse the timeline](https://openattacks.ai/timeline/) · [Use with an LLM](https://openattacks.ai/use/) · [JSON API](https://openattacks.ai/api/attacks.json) · [RSS](https://openattacks.ai/rss.xml)

## Contents

- [Overview](#what-you-can-do)
- [Run locally](#run-locally)
- [Contributing](#contributing)
- [Use with an LLM and API](#use-with-an-llm-and-api)
- [Validation](#validation)
- [Simulations](#simulations)
- [Contributors](#contributors)

<p align="center">
  <a href="https://openattacks.ai/">
    <img src="docs/screenshots/landing-desktop.png" alt="OpenAttacks landing page with the interactive report timeline and attack categories" width="100%">
  </a>
</p>

OpenAttacks is a community-maintained [MagicSword](https://magicsword.io/) project. Every catalog entry starts with public evidence: an observed incident, campaign, published vulnerability, or concrete research demonstration. Conceptual scenarios and hypothetical attack chains do not belong in the catalog. Research and proof-of-concept entries keep their evidence labels so they are not mistaken for exploitation in the wild.

## What you can do

- **Browse sourced attacks.** Search and filter by environment, AI role, evidence, product, sector, year, and geography.
- **Follow the attack path.** Each entry turns source reporting into an interactive, source-linked flow.
- **Move toward action.** Reviewed entries connect relevant stages to prevention opportunities, investigation guidance, and draft Sigma, KQL, or SPL hunts.
- **Check your stack.** Select tools, operating systems, and MCP usage to find reports that may apply to your environment without uploading an inventory.
- **Use the data elsewhere.** The catalog ships as JSON, CSV, Markdown, RSS, and an installable agent skill.
- **Run bounded exercises.** Selected entries include synthetic, inert labs for observing a behavior without reproducing a live attack.

`/pewpew/`, linked from the bottom of `/regions/` and from a quiet "pew pew" link in the homepage timeline footer (typing `pew` on the homepage outside a text field also opens it), is a deliberately tongue-in-cheek "threat map". It groups entries by every country they reference. `src/lib/country-refs.mjs` derives the references at build time and labels each one by role: `origin` comes from `attribution.country`, `target` comes from a named country in `regions`, and `mentioned` means the country name appears somewhere in the entry text (case-sensitive, with aliases such as DPRK and U.S. normalized, and ambiguous names such as Georgia and Jordan ignored). Solid red arcs connect an origin to a target from the same entry. Dashed cyan arcs connect other countries the same entry references and make no claim. A mentioned country is never a victim location or an attribution. Animation starts paused under `prefers-reduced-motion`.

## From report to action

An entry preserves the original source and separates reported facts from catalog-authored interpretation. The flow makes the sequence explorable while keeping qualifications, branches, loops, and unknowns visible.

<p align="center">
  <img src="docs/screenshots/attack-flow-desktop.png" alt="A four-stage OpenAttacks flow from a malicious custom GPT through PowerShell execution to persistence" width="100%">
</p>

Defensive material is deliberately labeled as draft guidance. Query-bearing stages identify required telemetry, field-mapping assumptions, investigation steps, and coverage limits. Selected behaviors also include downloadable Node labs built around synthetic data and scoped observations.

<p align="center">
  <img src="docs/screenshots/lab-instructions-desktop.png" alt="OpenAttacks simulation instructions showing a bounded MCP tool-poisoning exercise and observable telemetry" width="100%">
</p>

## Run locally

Requires Node.js **22.22.0 or newer**.

```sh
npm ci
npm run dev
```

Open `http://localhost:4321`. To verify the production build:

```sh
npm run build
npm run preview
```

## Contributing

Contributions are welcome from threat researchers, defenders, detection engineers, developers, designers, and technical writers.

### Add or improve an attack entry

1. Read the [sourcing, privacy, and evidence rules](CONTRIBUTING.md).
2. Copy the YAML template into `attacks/<your-id>.yaml`.
3. Add original source URLs, researcher credit, report date, AI role, technique, and prevention context. Use `unknown` instead of guessing.
4. Run `npm run validate` and preview the entry with `npm run dev`.
5. Open a pull request against `main`.

Every valid entry automatically receives a detail page and inclusion in the public exports. Do not include live victim data, unredacted victim IPs, credentials, or instructions that turn a catalog record into an operational attack guide.

### Other useful contributions

- Correct source attribution, dates, evidence labels, or technical details.
- Add reviewed applicability mappings or detection-stage coverage.
- Improve accessibility, responsive behavior, documentation, or tests.
- Propose an inert simulation that has a clear boundary and observable outcome.
- Report stale links or data-quality issues in an issue or pull request.

When changing generated detections, simulations, or LLM exports, edit their source definitions and run the corresponding build command instead of editing generated output by hand.

## Repository map

| Path                               | Purpose                                                               |
| ---------------------------------- | --------------------------------------------------------------------- |
| `attacks/*.yaml`                   | Source of truth for catalog entries                                   |
| `schema.yaml`                      | Strict entry schema validated during CI and builds                    |
| `src/data/presentation.json`       | Reviewed browse titles, summaries, environments, and evidence classes |
| `src/data/applicability.json`      | Reviewed stack relevance, conditions, and first actions               |
| `detections/`                      | Reusable detection definitions and stage mappings                     |
| `simulations/`                     | Inert lab definitions, runtime, and reviewed fixtures                 |
| `src/pages/` and `src/components/` | Astro pages and interactive UI                                        |
| `skills/openattacks/`              | Installable agent skill for catalog discovery                         |
| `scripts/`                         | Validation and export builders                                        |

## Use with an LLM and API

OpenAttacks publishes chat-sized discovery files, a full Markdown catalog, an installable agent skill, and structured APIs. All formats are generated from the validated catalog; the site is static and does not require an account or runtime API server.

| Resource              | URL                                                                |
| --------------------- | ------------------------------------------------------------------ |
| Catalog JSON          | [`/api/attacks.json`](https://openattacks.ai/api/attacks.json)     |
| Catalog CSV           | [`/api/attacks.csv`](https://openattacks.ai/api/attacks.csv)       |
| Browse index          | [`/api/catalog.json`](https://openattacks.ai/api/catalog.json)     |
| Stack relevance       | [`/api/relevance.json`](https://openattacks.ai/api/relevance.json) |
| LLM discovery         | [`/llms.txt`](https://openattacks.ai/llms.txt)                     |
| Full Markdown catalog | [`/llms-full.txt`](https://openattacks.ai/llms-full.txt)           |
| Agent skill           | [`/use/`](https://openattacks.ai/use/)                             |
| RSS feed              | [`/rss.xml`](https://openattacks.ai/rss.xml)                       |

Per-entry JSON and Markdown are available at `/api/attacks/<id>.json`, `/api/attacks/<id>.md`, and `/llms/attacks/<id>.md`. Smaller LLM bundles are grouped under `/llms/by-category/`, `/llms/by-month/`, and `/llms/by-framework/`.

## Validation

Run the checks relevant to your change before opening a pull request:

```sh
npm run validate          # schema, detections, simulations, and generated exports
npm run test:validation   # record and source-link validation tests
npm run check             # Astro and TypeScript diagnostics
npm run build             # production build
npm test                  # repository test suite; run after the build
```

For browser and accessibility coverage:

```sh
npx playwright install chromium
npm run test:browser
```

Useful source-to-output commands include `npm run detections:build`, `npm run simulations:build`, and `npm run llm:build`. CI also checks links added or modified by a pull request.

## Research boundaries

- Dates on the timeline are source publication dates, not necessarily the beginning of an intrusion.
- Catalog counts describe documented coverage, not global attack prevalence.
- Stack matches are reviewed relevance rules, not risk scores or proof that an environment is vulnerable.
- Detection queries are starting points and must be mapped, tuned, and tested against the defender's telemetry.
- A prevention or policy link indicates a conditional opportunity, not verified prevention of the reported incident.
- Target geography excludes actor attribution, hosting, and telemetry locations unless the source identifies them as targets.
- MITRE ATLAS mappings are catalog interpretations and do not imply MITRE endorsement.

## Simulations

List and run the portable labs with:

```sh
npm run simulate -- list
npm run simulate -- prepare <simulation-id>
npm run simulate -- verify "/exact/run/record.json"
npm run simulate -- cleanup "/exact/run/record.json"
```

Preparation does not start a model or agent. Follow each lab's isolation and evidence instructions. See the [simulation guide](docs/SIMULATIONS.md), [verification record](docs/SIMULATION_VERIFICATION.md), and scoped [lab license](simulations/LICENSE).

## Deployment

Vercel builds the Astro site from `main` and publishes `dist/`. Pull requests receive preview deployments; validation or stale generated exports stop publishing. Canonical URLs default to `https://openattacks.ai`, while `SITE_URL` and `BASE_PATH` support alternate deployments.

See [CI and merge checks](docs/CI.md) for required checks and merge-queue behavior.

## License

OpenAttacks is licensed under the [Apache License 2.0](LICENSE). Catalog entries cite third-party sources that keep their own terms, and imported MITRE ATLAS metadata carries MITRE's license.

## Contributors

OpenAttacks grows through public research and community review. Source authors and researchers are credited on individual entries, and repository contributions are recorded in the [GitHub contributor graph](https://github.com/magicsword-io/openattacks/graphs/contributors).

Thank you to everyone who contributes cases, corrections, defensive context, code, tests, and documentation.
