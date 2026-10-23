import type { Attack } from "./catalog";
import { roles } from "./catalog";
import { attackFlow } from "./attack-flow";
import { stageGuidance } from "./stage-guidance";
import atlas from "../data/atlas-techniques.json";

// Treat catalog content as quoted data. Only explicit http(s) source URLs become Markdown links.
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
  const flow = attackFlow(attack);
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
    `- Stage hunts and conditional defenses: ${absolute(`api/defenses/${attack.id}.json`)}`,
    "",
    ...(attack.borderline_note
      ? ["## Evidence qualification", plain(attack.borderline_note), ""]
      : []),
    "## Technique",
    plain(attack.technique_summary),
    "",
    "## Initial access",
    plain(attack.initial_access),
    "",
    "## AI tooling and models",
    list(attack.ai_tooling_and_models),
    "",
    "## Other tooling",
    list(attack.other_tooling),
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
    "Editorial recommendations, not validated coverage. Query starters are drafts. Custom-schema examples require telemetry collection and field mapping; absence of a mapping means not assessed. MagicSword policy opportunities require managed Windows scope and enforcement. Upstream detection MCP searches are not run by this site.",
    ...flow.nodes.flatMap((node) => {
      const guidance = stageGuidance(attack, node);
      return [
        `### ${node.id}: ${plain(guidance.title)}`,
        `- Visibility: ${plain(guidance.visibility)}`,
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
