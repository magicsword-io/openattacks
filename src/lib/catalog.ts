import { getCollection } from "astro:content";

export interface Attack {
  id: string;
  name: string;
  date_reported: string;
  researcher: string;
  org: string;
  sources: { url: string; title?: string; publisher?: string }[];
  ai_role: string;
  ai_role_secondary?: string | null;
  ai_role_detail?: string | null;
  technique_summary: string;
  initial_access: string;
  ai_tooling_and_models: string[];
  other_tooling: string[];
  victims_and_sectors: string;
  regions: string[];
  region_notes?: string;
  attribution_or_cluster: string;
  scale_and_metrics: string;
  prevention_angle: string;
  related_magicsword_projects: string[];
  borderline: boolean;
  borderline_note?: string | null;
  confidence?: "high" | "medium" | "low";
  last_reviewed?: string;
  source_notes?: string | null;
  magicsword_coverage?: string[];
  atlas_techniques?: { id: string; rationale: string; source_urls: string[] }[];
  attack_flow?: AttackFlow;
  iocs?: Record<string, string[]>;
  tags?: string[];
  aliases?: string[];
}
export interface AttackFlowNode {
  id: string;
  title: string;
  description: string;
  kind: "access" | "ai" | "execution" | "impact" | "unknown";
  source_urls: string[];
}
export interface AttackFlow {
  nodes: AttackFlowNode[];
  edges: { source: string; target: string; label?: string; loop?: boolean }[];
}
export const roles: Record<
  string,
  {
    label: string;
    short: string;
    color: string;
    icon: string;
    description: string;
  }
> = {
  ai_agent_or_mcp_as_target: {
    label: "Agent / MCP as target",
    short: "Agent as target",
    color: "#c0a0fa",
    icon: "target",
    description: "Agents, IDEs and MCP connections become the attack surface.",
  },
  attacker_uses_ai_as_operator: {
    label: "AI as operator",
    short: "AI as operator",
    color: "#f9a16c",
    icon: "terminal",
    description:
      "Attackers use models and agent loops to carry out intrusion steps.",
  },
  ai_tool_as_lure: {
    label: "AI tool as lure",
    short: "AI tool as lure",
    color: "#76b8f7",
    icon: "hook",
    description:
      "AI branding persuades victims to install malware or share access.",
  },
  llm_generated_malware: {
    label: "LLM-generated malware",
    short: "Generated malware",
    color: "#e78eae",
    icon: "code",
    description: "Models generate, rewrite or obfuscate malicious code.",
  },
  ai_credential_theft: {
    label: "AI credential theft",
    short: "Credential theft",
    color: "#e2cb76",
    icon: "key",
    description: "Stolen keys and sessions provide access to AI services.",
  },
  other: {
    label: "Other AI-enabled attacks",
    short: "Other",
    color: "#a5aebc",
    icon: "layers",
    description: "Deepfake fraud and other documented AI-enabled techniques.",
  },
  ai_infra_as_c2: {
    label: "AI infrastructure as C2",
    short: "AI as C2",
    color: "#79cbb2",
    icon: "network",
    description:
      "AI services carry commands or support an implant control channel.",
  },
};
export const projects: Record<string, string> = {
  LOLSkills: "https://lolskills.io",
  LOLRMM: "https://lolrmm.io",
  LOLDrivers: "https://loldrivers.io",
  GTFOBins: "https://gtfobins.github.io",
  LOLBAS: "https://lolbas-project.github.io",
  HijackLibs: "https://hijacklibs.net",
  LOTTunnels: "https://lottunnels.github.io",
};
export const repo = "https://github.com/magicsword-io/openattacks";
export const reviewed = "2026-10-20";
// Search groups derive only from words present in the source descriptions; raw data is preserved.
export const platforms = [
  { id: "claude-code", label: "Claude Code", pattern: /claude[ -]?code/i },
  { id: "claude", label: "Claude / Anthropic", pattern: /claude|anthropic/i },
  { id: "chatgpt", label: "ChatGPT", pattern: /chatgpt/i },
  { id: "openai", label: "OpenAI", pattern: /openai|chatgpt|gpt-\d/i },
  { id: "deepseek", label: "DeepSeek", pattern: /deepseek/i },
  { id: "gemini", label: "Gemini", pattern: /gemini/i },
  { id: "copilot", label: "Copilot", pattern: /copilot/i },
  { id: "mcp", label: "MCP", pattern: /\bmcp\b|model context protocol/i },
  { id: "cursor", label: "Cursor", pattern: /cursor/i },
  { id: "bedrock", label: "AWS Bedrock", pattern: /bedrock/i },
  { id: "ollama", label: "Ollama", pattern: /ollama/i },
  { id: "huggingface", label: "Hugging Face", pattern: /hugging[ -]?face/i },
  { id: "grok", label: "Grok", pattern: /grok/i },
];
export const sectors = [
  {
    id: "government",
    label: "Government / public sector",
    pattern: /government|state-affiliated|diplomat|public sector/i,
  },
  {
    id: "finance",
    label: "Finance / cryptocurrency",
    pattern: /financ|bank|payment|crypto|fintech/i,
  },
  {
    id: "commerce",
    label: "E-commerce / retail",
    pattern: /commerce|merchant|retail/i,
  },
  {
    id: "technology",
    label: "Technology / developers",
    pattern: /developer|software|technology|tech compan|cloud|\bIT\b|SaaS/i,
  },
  { id: "engineering", label: "Engineering", pattern: /engineering/i },
  {
    id: "health",
    label: "Healthcare / pharmaceuticals",
    pattern: /health|pharma/i,
  },
  {
    id: "consumer",
    label: "Consumers / individual users",
    pattern: /\busers\b|consumer|individual|job.seek/i,
  },
  { id: "unknown", label: "Unknown / not disclosed", pattern: /^unknown$/i },
];
export const platformGroups = (attack: Attack) =>
  platforms
    .filter((group) =>
      group.pattern.test(attack.ai_tooling_and_models.join(" ")),
    )
    .map((group) => group.id);
export const sectorGroups = (attack: Attack) =>
  sectors
    .filter((group) => group.pattern.test(attack.victims_and_sectors))
    .map((group) => group.id);
export const href = (path = "") =>
  `${import.meta.env.BASE_URL.replace(/\/$/, "")}/${path.replace(/^\//, "")}`;
// A partial date sorts at the start of its month; precision is preserved everywhere displayed.
export const dateKey = (date: string) =>
  date.length === 7 ? `${date}-01` : date;
export const formatDate = (date: string, long = false) =>
  new Intl.DateTimeFormat("en-US", {
    month: long ? "long" : "short",
    ...(date.length > 7 ? { day: "numeric" as const } : {}),
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(`${dateKey(date)}T12:00:00Z`));
export async function getAttacks(): Promise<Attack[]> {
  const entries = await getCollection("attacks");
  return entries
    .map((entry) => entry.data as unknown as Attack)
    .sort(
      (a, b) =>
        dateKey(b.date_reported).localeCompare(dateKey(a.date_reported)) ||
        a.name.localeCompare(b.name),
    );
}
export function toCSV(attacks: Attack[]) {
  const columns = [
    "id",
    "name",
    "date_reported",
    "ai_role",
    "researcher",
    "org",
    "technique_summary",
    "initial_access",
    "ai_tooling_and_models",
    "other_tooling",
    "victims_and_sectors",
    "regions",
    "attribution_or_cluster",
    "scale_and_metrics",
    "prevention_angle",
    "related_magicsword_projects",
    "confidence",
    "borderline",
    "borderline_note",
    "last_reviewed",
    "sources",
    "magicsword_coverage",
    "ai_role_secondary",
    "ai_role_detail",
    "date_activity_start",
    "date_activity_end",
    "atlas_techniques",
    "attack_flow",
    "region_notes",
    "source_notes",
    "iocs",
    "tags",
    "aliases",
  ];
  const quote = (value: unknown) => {
    let text =
      value == null
        ? ""
        : typeof value === "object"
          ? JSON.stringify(value)
          : String(value);
    // Prevent formula execution when opened in a spreadsheet.
    if (/^[=+@\-\t\r]/.test(text)) text = `'${text}`;
    return `"${text.replaceAll('"', '""')}"`;
  };
  return (
    [
      columns.join(","),
      ...attacks.map((attack) =>
        columns
          .map((key) =>
            quote((attack as unknown as Record<string, unknown>)[key]),
          )
          .join(","),
      ),
    ].join("\r\n") + "\r\n"
  );
}
