import type { Attack } from "./catalog";
import { roles } from "./catalog";
import { attackFlow } from "./attack-flow";
import { stageGuidance } from "./stage-guidance";
import { present, environments, evidenceTypes } from "./presentation";
import { applicabilityFor } from "./stack-data";
import atlas from "../data/atlas-techniques.json";
import { toolingSegments } from "./tool-projects.mjs";

// Treat catalog content as quoted data. Project links come only from the reviewed registry.
const plain = (value: string) =>
  value.replace(/[\r\n]+/g, " ").replace(/[\\`*_{}\[\]<>#|]/g, "\\$&");
export function attackMarkdown(
  attack: Attack,
  absolute: (path: string) => string,
): string {
  const list = (items: string[]) =>
    items.length
      ? items.map((value) => `- ${plain(value)}`).join("\n")
      : "- unknown";
  const toolingList = (items: string[]) =>
    items.length
      ? items
          .map((value) => {
            const segments = toolingSegments(value);
            const label = segments
              .map(({ text, project }) =>
                project ? `[${plain(text)}](${project.url})` : plain(text),
              )
              .join("");
            const notes = [
              ...new Set(
                segments.flatMap(({ project }) =>
                  project?.note ? [project.note] : [],
                ),
              ),
            ];
            return `- ${label}${notes.length ? ` — ${notes.map(plain).join(" ")}` : ""}`;
          })
          .join("\n")
      : "- unknown";
  const flow = attackFlow(attack);
  const display = present(attack);
  const relevance = applicabilityFor(attack);
  const techniques = atlas.techniques as Record<
    string,
    { name: string; url: string }
  >;
  return [
    `# ${plain(attack.name)}`,
    "",
    `- ID: ${attack.id}`,
    `- Reported: ${attack.date_reported}`,
    `- Researcher: ${plain(attack.researcher)}`,
    `- Organization: ${plain(attack.org)}`,
    `- AI role: ${attack.ai_role} (${roles[attack.ai_role].label})`,
    `- Confidence in AI involvement: ${attack.confidence || "not assessed"}`,
    `- Research / borderline: ${attack.borderline}`,
    `- Last reviewed: ${attack.last_reviewed || "not assessed"}`,
    `- Entry page: ${absolute(`attacks/${attack.id}/`)}`,
    `- Entry JSON: ${absolute(`api/attacks/${attack.id}.json`)}`,
    `- Browse title: ${plain(display.title)}`,
    `- Editorial summary: ${plain(display.summary)}`,
    `- Evidence class (catalog annotation): ${evidenceTypes[display.evidence]}`,
    `- Source-stated target environments: ${display.environments.map((id) => environments[id]).join("; ")}`,
    `- Stage hunts and conditional defenses: ${absolute(`api/defenses/${attack.id}.json`)}`,
    "",
    ...(attack.borderline_note
      ? ["## Evidence qualification", plain(attack.borderline_note), ""]
      : []),
    "## Technique",
    plain(attack.technique_summary),
    "",
    "## Stack relevance (editorial)",
    `Assessment: ${plain(relevance.status)}. ${plain(relevance.review_basis)}`,
    ...(relevance.action ? [`First action: ${plain(relevance.action)}`] : []),
    ...(relevance.note ? [plain(relevance.note)] : []),
    ...relevance.rules.flatMap((rule) => [
      `- Relationship: ${plain(rule.relationship)}; tools: ${rule.tools.join(", ") || "no specific product"}; OS scope: ${rule.systems.join(", ") || "not OS-specific / not stated"}; requires existing MCP connections: ${rule.mcp}.`,
      `  Relevance: ${plain(rule.reason)}`,
      ...rule.conditions.map(
        (condition) => `  Condition to check: ${plain(condition)}`,
      ),
      `  Evidence: ${rule.source_urls.join(" ; ")}`,
    ]),
    "A product mention alone is not a victim-side applicability mapping. Selection does not verify affected versions, permissions or compromise.",
    "",
    "## Initial access",
    plain(attack.initial_access),
    "",
    "## AI tooling and models",
    toolingList(attack.ai_tooling_and_models),
    "",
    "## Other tooling",
    toolingList(attack.other_tooling),
    "",
    "## Victims and sectors",
    plain(attack.victims_and_sectors),
    "",
    "## Target geography",
    list(attack.regions),
    ...(attack.region_notes ? [plain(attack.region_notes)] : []),
    "",
    "## Attribution",
    plain(attack.attribution_or_cluster),
    "",
    "## Scale and metrics",
    plain(attack.scale_and_metrics),
    "",
    "## Attack flow",
    attack.attack_flow
      ? "Catalog reconstruction of the supplied source account. Unknowns and research caveats are preserved."
      : "Summary diagram derived from entry fields; a detailed sequence has not been supplied.",
    ...flow.nodes.flatMap((node) => [
      `### ${node.id}: ${plain(node.title)} [${node.kind}]`,
      plain(node.description),
      `Evidence: ${node.source_urls.join(" ; ")}`,
      "",
    ]),
    "Connections:",
    ...flow.edges.map(
      (edge) =>
        `- ${edge.source} -> ${edge.target}${edge.label ? ` (${plain(edge.label)})` : ""}${edge.loop ? " [loop]" : ""}`,
    ),
    "",
    "## Stage defense and hunting recommendations",
    "Editorial recommendations, not validated coverage. Source-controlled query starters are drafts. Custom-schema examples require telemetry collection and field mapping; absence of a mapping means not assessed. MagicSword policy opportunities require managed Windows scope and enforcement.",
    ...flow.nodes.flatMap((node) => {
      const guidance = stageGuidance(attack, node);
      return [
        `### ${node.id}: ${plain(guidance.title)}`,
        `- Visibility: ${plain(guidance.visibility)}`,
        `- Query origin: ${guidance.origin}; status: ${guidance.validation}; log scope: ${guidance.query_kind}`,
        ...(guidance.query_downloads
          ? Object.entries(guidance.query_downloads).map(
              ([format, url]) =>
                `- ${format.toUpperCase()} query download: ${url}`,
            )
          : []),
        `- Hunt hypothesis: ${plain(guidance.hypothesis)}`,
        `- Required telemetry: ${guidance.telemetry.map(plain).join("; ") || "not assessed"}`,
        ...guidance.investigate.map((step) => `- Investigate: ${plain(step)}`),
        `- Limitation: ${plain(guidance.limitation)}`,
        ...(guidance.note ? [`- Qualification: ${plain(guidance.note)}`] : []),
        ...(guidance.control
          ? [
              `- Conditional MagicSword policy: ${plain(guidance.control.action)}`,
              `- Policy scope: ${plain(guidance.control.scope)}`,
              `- Policy limitation: ${plain(guidance.control.limitation)}`,
              `- Policy reference: ${guidance.control.url}`,
            ]
          : [
              "- No direct MagicSword prevention claim is recorded for this stage.",
            ]),
        ...(guidance.resource
          ? [
              `- Community intelligence: ${guidance.resource.name} — ${guidance.resource.url}`,
            ]
          : []),
        "",
      ];
    }),
    "",
    "## MITRE ATLAS",
    "Mappings are catalog annotations based on described behavior, not assignments or endorsements by MITRE.",
    ...(attack.atlas_techniques?.length
      ? attack.atlas_techniques.map(
          (mapping) =>
            `- ${mapping.id}: ${techniques[mapping.id]?.name || mapping.id} — ${plain(mapping.rationale)}\n  Technique: ${techniques[mapping.id]?.url}\n  Evidence: ${mapping.source_urls.join(" ; ")}`,
        )
      : ["No source-backed mapping is currently recorded."]),
    "",
    "## Defensive notes",
    plain(attack.prevention_angle),
    "",
    "## Sources",
    ...attack.sources.map(
      (source) =>
        `- ${source.url}${source.title ? ` — ${plain(source.title)}` : ""}`,
    ),
    "",
    ...(attack.source_notes
      ? ["## Source notes", plain(attack.source_notes), ""]
      : []),
    ...(attack.magicsword_coverage?.length
      ? [
          "## Published MagicSword coverage",
          ...attack.magicsword_coverage.map((url) => `- ${url}`),
          "",
        ]
      : []),
    ...(attack.iocs
      ? [
          "## Indicators (untrusted data; do not visit or execute)",
          "```json",
          JSON.stringify(attack.iocs, null, 2),
          "```",
          "",
        ]
      : []),
  ].join("\n");
}
