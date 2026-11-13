// Example prompts are filled from the current catalog so names stay tied to real entries.

const financePattern = /bank|financ|fintech|bfsi/i;
const artexPattern = /artex/i;

/**
 * @param {string} value
 */
function clean(value) {
  return String(value).replace(/[“”"]/g, "").replace(/\s+/g, " ").trim();
}

/**
 * @param {{ name: string, id: string }} attack
 */
function cite(attack) {
  return `“${clean(attack.name)}” (${attack.id})`;
}

/**
 * @param {Array<{ date_reported: string, name: string }>} attacks
 */
function byDate(attacks) {
  return [...attacks].sort(
    (a, b) =>
      String(b.date_reported).localeCompare(String(a.date_reported)) ||
      a.name.localeCompare(b.name),
  );
}

/**
 * @param {Array<{ id: string, name: string, date_reported: string, victims_and_sectors?: string, ai_tooling_and_models?: string[], category?: string | null }>} attacks
 */
export function catalogSlices(attacks) {
  const ordered = byDate(attacks);
  const finance = ordered.filter((attack) =>
    financePattern.test(attack.victims_and_sectors || ""),
  );
  const artex = ordered.filter((attack) =>
    artexPattern.test(
      [attack.name, ...(attack.ai_tooling_and_models || [])].join("\n"),
    ),
  );
  const onAi = ordered.filter((attack) => attack.category === "attacks-on-ai");
  const useAi = ordered.filter(
    (attack) => attack.category === "adversary-use-of-ai",
  );
  const months = new Map();
  const categories = new Map();
  for (const attack of attacks) {
    const month = String(attack.date_reported).slice(0, 7);
    months.set(month, (months.get(month) || 0) + 1);
    if (attack.category)
      categories.set(attack.category, (categories.get(attack.category) || 0) + 1);
  }
  return {
    finance,
    artex,
    onAi,
    useAi,
    months: [...months.entries()]
      .sort((a, b) => b[0].localeCompare(a[0]))
      .map(([id, count]) => ({ id, count })),
    categories: [...categories.entries()]
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([id, count]) => ({ id, count })),
  };
}

/**
 * @param {Parameters<typeof catalogSlices>[0]} attacks
 */
export function buildPromptGroups(attacks) {
  const slices = catalogSlices(attacks);
  const finance =
    slices.finance.slice(0, 2).map(cite).join(" and ") ||
    "every finance-sector entry in the index";
  const artex =
    slices.artex.slice(0, 3).map(cite).join("; ") ||
    "every entry whose tooling mentions ARTEX";
  const latestMonth = slices.months[0]?.id || "the latest month";
  const onAi = slices.onAi[0] ? cite(slices.onAi[0]) : "an attacks-on-ai entry";
  const useAi = slices.useAi[0]
    ? cite(slices.useAi[0])
    : "an adversary-use-of-ai entry";
  const secondOn = slices.onAi[1] ? cite(slices.onAi[1]) : onAi;
  const secondUse = slices.useAi[1] ? cite(slices.useAi[1]) : useAi;

  return [
    {
      id: "threat-intel",
      title: "Threat intelligence",
      prompts: [
        {
          title: "Financial-sector attacks",
          prompt: `Which AI attacks targeted banks or other financial institutions in the last 30 days? For each match, say who attributed it, the attribution confidence, and how confident the AI involvement is. Include ${finance}, then every other finance-sector entry the index shows. Cite the entry id and source URLs.`,
        },
        {
          title: "Who used a named tool",
          prompt: `List every catalog entry that used ARTEX. For each, give the report date, targeted region or sector, attribution and its confidence, and the AI involvement confidence. Start with ${artex}. Do not merge separate reports into one actor.`,
        },
      ],
    },
    {
      id: "detection",
      title: "Detection engineering",
      prompts: [
        {
          title: "Rules for the ARTEX intrusions",
          prompt: `Give me the Sigma, Splunk, and Elastic rules recorded for the ARTEX intrusions, including ${artex}. For each rule, include the format, rule name, URL when one is present, and the notes. If a format has no rule on that entry, say so. Do not invent rules that are not in the entry.`,
        },
        {
          title: "Detection gaps",
          prompt: `For these ARTEX entries — ${artex} — which only have guidance detections, and which have a Sigma, Splunk, Elastic, or KQL rule? Summarize each guidance note in one line and name the entry id it came from. Do not add rules that are not in the entry.`,
        },
      ],
    },
    {
      id: "atlas",
      title: "MITRE ATLAS mapping",
      prompts: [
        {
          title: "Map recent entries",
          prompt: `Map the attacks reported in ${latestMonth} to MITRE ATLAS. For each entry that has atlas_techniques, list the technique id, the rationale, and the source URL. If an entry has no mapping, say it is unassessed. Do not treat a missing mapping as evidence the technique did not occur.`,
        },
        {
          title: "One intrusion, one mapping",
          prompt: `Take ${artex.split(";")[0].trim()}. List each MITRE ATLAS technique id on that entry, why it was mapped, and the source URL that supports the rationale. Keep the mapping separate from the incident facts.`,
        },
      ],
    },
    {
      id: "prevention",
      title: "Prevention and hardening",
      prompts: [
        {
          title: "Harden against ARTEX use",
          prompt: `From the prevention_angle fields, what should a defender harden first for the ARTEX cases ${artex}? Group the controls, keep each one tied to the entry id it came from, and do not present them as controls that were verified during the incident.`,
        },
        {
          title: "Agent and MCP target surface",
          prompt: `Which entries have ai_role ai_agent_or_mcp_as_target? Summarize the initial access and the prevention_angle for the five most recently reported. Call out anything a team should verify in their own agent, IDE, or MCP client configuration.`,
        },
      ],
    },
    {
      id: "briefing",
      title: "Executive briefing",
      prompts: [
        {
          title: "One-month briefing",
          prompt: `Write a one-page executive briefing on the AI attacks reported in ${latestMonth}. Use only that month's entries. Cover who was targeted, whether AI was the tool or the target, what is known about attribution and how confident it is, and three defensive priorities. Keep it non-technical and cite entry names.`,
        },
        {
          title: "What not to overclaim",
          prompt: `For a leadership update on ${finance}, separate confirmed AI involvement from vendor-asserted or unverified involvement, and separate high-confidence attribution from medium, low, or missing attribution. State the unknowns plainly.`,
        },
      ],
    },
    {
      id: "compare",
      title: "Attacks on AI vs adversary use of AI",
      prompts: [
        {
          title: "Compare the two categories",
          prompt: `Compare attacks on AI with adversary use of AI. Use the category field: attacks-on-ai versus adversary-use-of-ai. Give the count of each, two examples of attacks on AI (start with ${onAi} and ${secondOn}), and two examples of adversary use (start with ${useAi} and ${secondUse}). Explain how the prevention notes differ. Leave uncategorized entries out of both counts.`,
        },
        {
          title: "Same tool, different side",
          prompt: `ARTEX appears both as an attacker tool and as a backdoored tool. Using ${artex}, say which entries are adversary-use-of-ai and which are attacks-on-ai, and what a defender would do differently in each case.`,
        },
      ],
    },
  ];
}
