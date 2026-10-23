// Shared by the static build, browser and tests. Product mentions are never match criteria.
/** @typedef {{tools: string[], systems: string[], mcp: string}} StackSelection */
/** @typedef {{tools: string[], systems: string[], mcp: boolean, relationship: string, reason: string, conditions: string[], source_urls: string[]}} RelevanceRule */
/** @typedef {{id: string, reported: string, relevance: {status: string, rules: RelevanceRule[]}}} RelevanceEntry */

export const stackTools = [
  { id: "cursor", label: "Cursor", primary: true },
  { id: "claude-code", label: "Claude Code", primary: true },
  { id: "github-copilot", label: "GitHub Copilot", primary: true },
  { id: "chatgpt", label: "ChatGPT", primary: true },
  { id: "copilot-studio", label: "Copilot Studio", primary: true },
  { id: "bedrock", label: "AWS Bedrock", primary: true },
  { id: "claude", label: "Claude / Claude Desktop", primary: false },
  { id: "gemini", label: "Gemini / Gemini CLI", primary: false },
  { id: "deepseek", label: "DeepSeek", primary: false },
  { id: "grok", label: "Grok", primary: false },
  { id: "claude-agent-sdk", label: "Claude Agent SDK", primary: false },
  { id: "opencode", label: "opencode", primary: false },
  { id: "mcp-remote", label: "mcp-remote", primary: false },
  { id: "openmcp-client", label: "openmcp-client", primary: false },
  { id: "sequa-mcp", label: "sequa-mcp", primary: false },
  { id: "ai-api-keys", label: "AI API / cloud credentials", primary: false },
  { id: "agent-skills", label: "Agent skills", primary: false },
  { id: "ai-extensions", label: "AI browser extensions", primary: false },
  { id: "ai-email", label: "AI email assistants", primary: false },
  { id: "ai-analysis", label: "AI malware analysis", primary: false },
  { id: "npm-pypi", label: "npm / PyPI dependencies", primary: false },
];
export const stackSystems = [
  { id: "windows", label: "Windows" },
  { id: "macos", label: "macOS" },
  { id: "linux", label: "Linux" },
  { id: "android", label: "Android" },
];
export const relationships = {
  target: "Product / integration report",
  credential: "Credential exposure",
  workflow: "Workflow pattern",
  lure: "Installation / social lure",
  environment: "Broader environment pattern",
};
const priority = {
  target: 0,
  credential: 1,
  workflow: 2,
  lure: 3,
  environment: 4,
};
const unique = (values) => [...new Set(values)];

/** @param {Partial<StackSelection>} [selection] @returns {StackSelection} */
export function normalizeSelection(selection = {}) {
  return {
    tools: stackTools
      .filter((tool) => selection.tools?.includes(tool.id))
      .map((tool) => tool.id),
    systems: stackSystems
      .filter((system) => selection.systems?.includes(system.id))
      .map((system) => system.id),
    mcp: ["yes", "no", "unknown"].includes(selection.mcp || "")
      ? selection.mcp
      : "",
  };
}
/** @param {StackSelection} selection */
export function hasStackCriteria(selection) {
  return (
    selection.tools.length > 0 ||
    selection.systems.length > 0 ||
    selection.mcp === "yes"
  );
}
/** @param {RelevanceRule} rule @param {StackSelection} selection */
export function ruleMatches(rule, selection) {
  if (rule.mcp && selection.mcp === "no") return false;
  if (
    rule.systems.length &&
    selection.systems.length &&
    !rule.systems.some((os) => selection.systems.includes(os))
  )
    return false;
  if (rule.tools.length)
    return rule.tools.some((tool) => selection.tools.includes(tool));
  if (rule.mcp) return selection.mcp === "yes";
  return (
    rule.systems.length > 0 &&
    rule.systems.some((os) => selection.systems.includes(os))
  );
}
/** @template {RelevanceEntry} T @param {T[]} entries @param {Partial<StackSelection>} rawSelection */
export function matchStack(entries, rawSelection) {
  const selection = normalizeSelection(rawSelection);
  if (!hasStackCriteria(selection)) return [];
  return entries
    .flatMap((entry) => {
      const rules = entry.relevance.rules.filter((rule) =>
        ruleMatches(rule, selection),
      );
      if (!rules.length) return [];
      const rank = Math.min(
        ...rules.map((rule) => priority[rule.relationship] ?? 9),
      );
      return [
        {
          entry,
          rules,
          rank,
          reasons: unique(rules.map((rule) => rule.reason)),
          conditions: unique([
            ...(rules.some((rule) => rule.mcp) && selection.mcp !== "yes"
              ? [
                  "Confirm that this tool connects to MCP servers; you have not confirmed that connection.",
                ]
              : []),
            ...rules.flatMap((rule) => rule.conditions),
          ]),
          relationship:
            relationships[
              rules.find((rule) => (priority[rule.relationship] ?? 9) === rank)
                ?.relationship
            ] || "Source-reported pattern",
        },
      ];
    })
    .sort(
      (a, b) =>
        a.rank - b.rank ||
        b.entry.reported.localeCompare(a.entry.reported) ||
        a.entry.id.localeCompare(b.entry.id),
    );
}

/** @param {URLSearchParams} params */
export function selectionFromURL(params) {
  return normalizeSelection({
    tools: (params.get("tools") || "").split(","),
    systems: (params.get("os") || "").split(","),
    mcp: params.get("mcp") || "",
  });
}
/** @param {URL} url @param {StackSelection} selection */
export function selectionURL(url, selection) {
  const result = new URL(url);
  for (const key of ["tools", "os", "mcp"]) result.searchParams.delete(key);
  if (selection.tools.length)
    result.searchParams.set("tools", selection.tools.join(","));
  if (selection.systems.length)
    result.searchParams.set("os", selection.systems.join(","));
  if (selection.mcp) result.searchParams.set("mcp", selection.mcp);
  return result;
}
