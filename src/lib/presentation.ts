import curated from "../data/presentation.json";
import { platformGroups, type Attack } from "./catalog";

export const environments: Record<string, string> = {
  windows: "Windows",
  macos: "macOS",
  linux: "Linux",
  cloud: "Cloud & SaaS",
  web: "Web applications",
  agents: "Agents & MCP",
  development: "Developer workflows",
  browser: "Browser extensions",
  android: "Android",
  business: "Business & social",
  provider: "Provider-side",
  unspecified: "Not specified",
};
export const evidenceTypes: Record<string, string> = {
  campaign: "Reported campaign",
  vulnerability: "Vulnerability report",
  research: "Research demonstration",
  claim: "Unverified claim",
  analysis: "Malware analysis",
  provider: "Provider report",
  finding: "Scanner finding",
  qualified: "Qualified report",
  unclassified: "Not classified",
};
export interface Presentation {
  title: string;
  summary: string;
  environments: string[];
  evidence: string;
}
export function present(attack: Attack): Presentation {
  return (
    (curated as Record<string, Presentation>)[attack.id] || {
      title: attack.name,
      summary:
        attack.technique_summary.length > 210
          ? `${attack.technique_summary.slice(0, 207).replace(/\s+\S*$/, "")}…`
          : attack.technique_summary,
      environments: ["unspecified"],
      evidence: attack.borderline ? "qualified" : "unclassified",
    }
  );
}
export const meaningful = (value?: string | null) =>
  !!value &&
  !/^(unknown|not assessed|not disclosed|not applicable|unspecified)\.?$/i.test(
    value.trim(),
  );
export function catalogIndex(attack: Attack) {
  return {
    id: attack.id,
    ...present(attack),
    platforms: platformGroups(attack),
    reported: attack.date_reported,
    qualification: attack.borderline_note || null,
    source_urls: attack.sources.map((s) => s.url),
  };
}
