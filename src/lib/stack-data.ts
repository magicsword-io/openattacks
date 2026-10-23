import annotations from "../data/applicability.json";
import { href, type Attack } from "./catalog";
import { present, evidenceTypes } from "./presentation";
import { attackFlow } from "./attack-flow";
import { stageGuidance } from "./stage-guidance";
import {
  stackTools,
  stackSystems,
  relationships,
  type RelevanceRule,
} from "./stack-matching.mjs";

export interface Applicability {
  status: string;
  reviewed: string | null;
  review_basis: string;
  note?: string;
  stage_id?: string;
  action?: string;
  rules: RelevanceRule[];
}
export function applicabilityFor(attack: Attack): Applicability {
  return (
    (annotations as Record<string, Applicability>)[attack.id] || {
      status: "not_assessed",
      reviewed: null,
      review_basis:
        "No reviewed applicability annotation is available. Product mentions do not establish victim conditions.",
      rules: [],
    }
  );
}
export function stackEntry(attack: Attack) {
  const relevance = applicabilityFor(attack);
  const flow = attackFlow(attack);
  const node = flow.nodes.find((node) => node.id === relevance.stage_id);
  const guidance = node ? stageGuidance(attack, node) : null;
  const page = href(`attacks/${attack.id}/`);
  const stageURL = (id: string, view = "evidence") =>
    `${page}?stage=${encodeURIComponent(id)}&view=${view}#attack-flow`;
  const policyNode =
    relevance.status === "mapped"
      ? flow.nodes.find((node) => stageGuidance(attack, node).control)
      : null;
  const control = policyNode ? stageGuidance(attack, policyNode).control : null;
  return {
    id: attack.id,
    ...present(attack),
    reported: attack.date_reported,
    qualification: attack.borderline_note || null,
    source_urls: attack.sources.map((source) => source.url),
    url: page,
    relevance,
    action: relevance.action || null,
    stage_url: node ? stageURL(node.id) : null,
    hunt_url: node && guidance?.queries ? stageURL(node.id, "hunt") : null,
    policy:
      control && policyNode
        ? { ...control, stage_url: stageURL(policyNode.id, "prevent") }
        : null,
  };
}
export function stackIndex(attacks: Attack[]) {
  const entries = attacks.map(stackEntry);
  return {
    description:
      "Source-linked editorial applicability rules, not an inventory scan, risk score or verification of affected versions. Match reviewed victim-side tools, workflows and stated operating systems; never infer applicability from an attacker using an AI product. Multiple selections are OR within a field; selected operating systems narrow OS-specific rules; MCP=no excludes rules requiring existing MCP connections. Unspecified versions, permissions and other conditions must still be checked. No match is not evidence of safety.",
    tools: stackTools,
    systems: stackSystems,
    relationships,
    evidence_types: evidenceTypes,
    coverage: {
      total: entries.length,
      mapped: entries.filter((entry) => entry.relevance.status === "mapped")
        .length,
      not_assessed: entries.filter(
        (entry) => entry.relevance.status === "not_assessed",
      ).length,
      attacker_tool_only: entries.filter(
        (entry) => entry.relevance.status === "attacker_tool_only",
      ).length,
    },
    entries,
  };
}
export type StackEntry = ReturnType<typeof stackEntry>;
