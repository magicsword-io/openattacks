import type { Attack, AttackFlow } from "./catalog";

export function attackFlow(attack: Attack): AttackFlow {
  if (attack.attack_flow) return attack.attack_flow;
  const sources = attack.sources.map((source) => source.url);
  // Future entries still get a factual summary diagram when no curated flow is supplied.
  return {
    nodes: [
      {
        id: "entry",
        title: "Reported initial access",
        description: attack.initial_access,
        kind:
          attack.initial_access.toLowerCase() === "unknown"
            ? "unknown"
            : "access",
        source_urls: sources,
      },
      {
        id: "activity",
        title: "Reported activity",
        description: attack.technique_summary,
        kind: "execution",
        source_urls: sources,
      },
      {
        id: "ai",
        title: "AI involvement",
        description:
          attack.ai_role_detail ||
          attack.ai_tooling_and_models.join(" · ") ||
          "Tooling is not disclosed.",
        kind: "ai",
        source_urls: sources,
      },
    ],
    edges: [
      { source: "entry", target: "activity" },
      { source: "ai", target: "activity", label: "AI context" },
    ],
  };
}
