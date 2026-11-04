# Stage detection queries

Every attack phase has an explicit entry in `stages.json`, keyed by attack ID and exact flow-node ID. This includes attacks without simulations, unknown steps, provider-side activity and qualified research. The initial catalog contains 68 attacks and 269 phases.

`definitions/*.yaml` are the canonical, editable behavior profiles. Each contains its hypothesis, required logs, investigation steps, limits, research search terms, review date and Sigma / KQL / SPL query text. The query origin is `catalog_authored`: these are editorial drafts, not rules retrieved from an upstream detection index. Profiles are reusable; a stage mapping and its note explain how to apply one to the specific reported behavior. Shared Sigma rule IDs remain stable across the move from the former TypeScript generator.

`query_kind: native` identifies a named collector or table, such as Defender `DeviceProcessEvents`, Windows Sysmon or CloudTrail. It does not establish validation, collection, alerting or incident coverage. Non-Windows process SPL still requires the explicitly documented custom process normalization. `custom_schema` profiles require application/platform telemetry mapped to the `OpenAttacksAudit_CL` table or `openattacks:audit` sourcetype. Their proposed event names are not native vendor events. These queries select candidates; correlation, approval context and local alert logic remain operator work.

`gap` profiles contain no queries. `unobserved` means the supplied account does not establish a runtime procedure; `unassessed` means a hunt has not been mapped. Neither means that an attack was prevented or that no behavior occurred. Preserve these gaps rather than inventing a query for every box in a diagram.

## Editing and publishing

1. Edit a profile under `definitions/`, or add one with a unique ID matching its filename. Keep catalog Sigma rules `experimental`. State exactly which logs and field mappings are needed.
2. Add a `stages.json` mapping for every source flow node. Use an explicit gap when needed. Preserve conditional policy scope and source qualifications. A stage note can narrow a shared profile without claiming that its candidate query implements the entire hypothesis.
3. Run `npm run detections:build` to regenerate `catalog.json`. Do not edit the generated catalog by hand.
4. Run `npm run validate`, `npm run check`, `npm run build`, `npm test` and the browser checks. Validation rejects missing phases, stale references, unknown profiles, duplicate YAML keys, invented gap queries and catalog drift.

The site, defense APIs and raw query downloads all consume the generated catalog. Each attack page has a server-rendered detection section, phase anchors, query downloads and a JSON stage pack. Content remains readable without JavaScript. The existing `?stage=...&view=hunt#attack-flow` inspector links remain supported.

Raw downloads are available at `api/detections/<profile>.sigma.yml`, `.kql` and `.spl`. Complete stage context, evidence, origin, validation status and download URLs are included in `api/defenses.json` and `api/defenses/<attack-id>.json`.

## Research with Security Detections MCP

Every phase exports a source-specific research brief for [Security Detections MCP](https://github.com/MHaggis/Security-Detections-MCP). In a connected client, discover available tools, inspect `get_stats`, search by behavior and required telemetry, and retrieve real candidates with `get_by_id`. Use CVE/process/data-source filters when supported. The tool inventory varies between installations; inspect it before assuming a capability exists.

If adding an upstream rule later, retain its real ID, repository URL, revision, author/license and log requirements, and explain the stage relationship. Keep verbatim upstream rules, adaptations and catalog-authored drafts distinguishable. A matching tag or keyword is not verified procedure coverage. ATLAS annotations and upstream ATT&CK IDs are separate namespaces.

The website has no live MCP connection and performs no index search or deployment. This change migrates existing drafts, adds an input-exposure profile and explicit phase mappings, and publishes the research briefs; it does not claim to have queried a live MCP rule index.

## Simulation evidence

Detection cards link to simulations only where the simulation definition maps to that exact stage. Most phases have no associated exercise. The synthetic MCP lab uses stdio tool calls and local receipts; it does not generate external exfiltration, and it does not emit the custom SIEM schema automatically. Record behavior, collected telemetry and fired alerts separately. A lab receipt alone does not establish agent attribution, security-product detection or prevention.
