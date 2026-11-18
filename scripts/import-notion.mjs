// Convert rows exported from the "AI Threat Feed" Notion database into
// attacks/<id>.yaml entries.
//
// Usage:
//   node scripts/import-notion.mjs [--dry-run] <export.json> [<export.json> ...]
//
// Each export is the JSON a Notion data-source SQL query returns
// ({"results": [...]}), or a plain array of rows. Rows use the Notion
// property names as keys. See dataspec.md, "Importing from Notion".
//
// The script never overwrites an existing file, skips rows whose source URL is
// already cited by an entry, and validates every entry against schema.yaml
// before writing. Fields Notion does not capture (researcher, target regions,
// initial access, scale, prevention) are written as "unknown" for review.

import { existsSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import { parseArgs } from "node:util";
import { parse, stringify } from "yaml";
import { entryErrors } from "../src/lib/schema.mjs";
import { sourceUrlError } from "../src/lib/source-urls.mjs";

const attacksDir = new URL("../attacks/", import.meta.url);
const stagesFile = new URL("../detections/stages.json", import.meta.url);
// Node IDs of the summary flow src/lib/attack-flow.ts generates for an entry
// without a curated attack_flow.
const GENERATED_STAGES = ["entry", "activity", "ai"];

// Earlier entries win: the first matching technique sets ai_role.
const ROLE_BY_TECHNIQUE = [
  ["Agentic operations", "attacker_uses_ai_as_operator"],
  ["Malware / tooling dev", "llm_generated_malware"],
  ["API key / account abuse", "ai_credential_theft"],
  ["Prompt injection", "ai_agent_or_mcp_as_target"],
  ["AI supply chain", "ai_agent_or_mcp_as_target"],
  ["AI infra intrusion", "ai_agent_or_mcp_as_target"],
  ["Vuln discovery / exploit", "attacker_uses_ai_as_operator"],
  ["Recon / OSINT", "attacker_uses_ai_as_operator"],
  ["Phishing / social eng.", "attacker_uses_ai_as_operator"],
  ["Jailbreak / misuse", "attacker_uses_ai_as_operator"],
  ["Deepfake / voice", "other"],
  ["Influence ops", "other"],
  ["Fraud / IT-worker schemes", "other"],
  ["Model theft / distillation", "other"],
  ["Data poisoning", "other"],
];
const SECTOR_LABELS = {
  Government: "Government",
  Defense: "Defense",
  "Tech / AI": "Technology and AI companies",
  Finance: "Finance",
  Healthcare: "Healthcare",
  "Critical infra": "Critical infrastructure",
  Education: "Education",
  "Multiple / broad": "Multiple sectors",
};
const MOTIVATION = {
  "Nation-state": "nation-state",
  Cybercrime: "cybercrime",
  Hacktivist: "hacktivism",
};
const COUNTRIES = new Set(["China", "Russia", "Iran", "North Korea"]);
const AI_CONFIDENCE = { Confirmed: "confirmed", Reported: "vendor-asserted" };
const TARGET_TECHNIQUES = new Set([
  "API key / account abuse",
  "Prompt injection",
  "AI infra intrusion",
  "Model theft / distillation",
  "Data poisoning",
]);
const STOPWORDS = new Set(
  "a an and are as at by for from has in into is its of on or says that the their them to was were with".split(
    " ",
  ),
);

const list = (value) => {
  if (value == null || value === "") return [];
  if (Array.isArray(value)) return value;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [String(parsed)];
  } catch {
    return [String(value)];
  }
};
const text = (value) => (typeof value === "string" ? value.trim() : "");
export function normalizeUrl(value) {
  const url = new URL(value.trim());
  url.hash = "";
  for (const key of [...url.searchParams.keys()])
    if (/^(?:utm_.+|fbclid|gclid|mc_cid|mc_eid)$/i.test(key))
      url.searchParams.delete(key);
  url.searchParams.sort();
  const host = url.host.toLowerCase().replace(/^www\./, "");
  const path = url.pathname.replace(/\/+$/, "");
  return `${host}${path}${url.search}`;
}

export function primaryAlreadyCited(value, cited) {
  const primary = text(value);
  return !sourceUrlError(primary) && cited.has(normalizeUrl(primary));
}

// Split on ";" outside parentheses: "A (x; y); B" -> ["A (x; y)", "B"].
export function splitTopLevel(value) {
  const items = [];
  let depth = 0;
  let current = "";
  for (const character of value) {
    if (character === "(") depth++;
    if (character === ")") depth = Math.max(0, depth - 1);
    if (character === ";" && depth === 0) {
      items.push(current);
      current = "";
    } else current += character;
  }
  items.push(current);
  return items.map((item) => item.trim()).filter(Boolean);
}

export function slugFor(headline, published, taken) {
  const words = headline
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .split(" ")
    .filter((word) => word && !STOPWORDS.has(word))
    .slice(0, 6);
  const base = `${words.join("-")}-${published.slice(0, 7)}`;
  let id = base;
  for (let n = 2; taken.has(id); n++) id = `${base}-${n}`;
  taken.add(id);
  return id;
}

function rolesFor(row, techniques) {
  const context = [row.Headline, row.Summary, row["Targeted AI / Vendor"]]
    .map(text)
    .join("\n");
  if (
    /(?:\bAI\b|\bLLM\b|OpenAI|Anthropic|Claude|Gemini|Assistants API).{0,80}\b(?:C2|command[- ]and[- ]control)\b|\b(?:C2|command[- ]and[- ]control)\b.{0,80}(?:\bAI\b|\bLLM\b|OpenAI|Anthropic|Claude|Gemini|Assistants API)/i.test(
      context,
    )
  )
    return ["ai_infra_as_c2"];
  if (
    /\bfake AI\b|\bAI[- ](?:branded|themed)\b|\bimpersonat(?:e|ed|ing)\b.{0,40}\bAI\b/i.test(
      context,
    )
  )
    return ["ai_tool_as_lure"];
  const roles = [];
  for (const [technique, role] of ROLE_BY_TECHNIQUE)
    if (techniques.includes(technique) && !roles.includes(role))
      roles.push(role);
  return roles.length ? roles : ["other"];
}

function categoryFor(techniques, roles) {
  if (
    roles.some((role) =>
      [
        "ai_infra_as_c2",
        "ai_tool_as_lure",
        "attacker_uses_ai_as_operator",
        "llm_generated_malware",
      ].includes(role),
    )
  )
    return "adversary-use-of-ai";
  return techniques.some((technique) => TARGET_TECHNIQUES.has(technique)) ||
    roles.some((role) =>
      ["ai_agent_or_mcp_as_target", "ai_credential_theft"].includes(role),
    )
    ? "attacks-on-ai"
    : "adversary-use-of-ai";
}

// Returns { entry } or { error }. `taken` holds IDs already in use.
export function convertRow(row, taken) {
  const headline = text(row.Headline);
  const published = text(row.Published).slice(0, 10);
  const primary = text(row.URL);
  if (!headline) return { error: "missing Headline" };
  if (!/^\d{4}-\d{2}-\d{2}$/.test(published))
    return { error: `missing or invalid Published date (${row.Published})` };
  const urlIssue = sourceUrlError(primary);
  if (urlIssue) return { error: `URL ${urlIssue}` };
  if (!AI_CONFIDENCE[row.Confidence])
    return { error: `Confidence "${row.Confidence}" is not imported` };

  const publisher = text(row.Source);
  const sources = [{ url: primary, ...(publisher && { publisher }) }];
  const seen = new Set([normalizeUrl(primary)]);
  for (const url of text(row["Other coverage"]).split(/[\s,]+/)) {
    if (!url || sourceUrlError(url) || seen.has(normalizeUrl(url))) continue;
    seen.add(normalizeUrl(url));
    sources.push({ url });
  }

  const techniques = list(row.Techniques);
  const roles = rolesFor(row, techniques);
  const [aiRole, secondary] = roles;
  const sectors = list(row.Sectors).map((s) => SECTOR_LABELS[s] || s);
  const actor = text(row["Threat Actor"]);
  // "Unnamed (operators of X)" describes an actor without naming one.
  const named = actor && !/^(unnamed|unknown|unattributed)\b/i.test(actor);
  const countries = list(row.Attribution).filter((c) => COUNTRIES.has(c));
  const research = row["Actor Type"] === "Researcher / PoC";

  const attribution = {
    ...(named && { actor_name: actor }),
    ...(countries.length === 1 && { country: countries[0] }),
    ...(MOTIVATION[row["Actor Type"]] && {
      motivation: MOTIVATION[row["Actor Type"]],
    }),
  };
  const notes = [
    "Imported from the AI Threat Watch Notion feed (an automated daily scan); not yet editorially reviewed.",
    row.Severity && `Feed severity: ${row.Severity}.`,
    row.Novelty && `Feed novelty: ${row.Novelty}.`,
  ].filter(Boolean);

  const entry = {
    id: slugFor(headline, published, taken),
    name: headline,
    date_reported: published,
    researcher: "unknown",
    org: publisher || "unknown",
    sources,
    borderline: research,
    ...(research && {
      borderline_note:
        "Researcher or evaluation demonstration reported by the source, not an in-the-wild attack.",
    }),
    ai_role: aiRole,
    ...(secondary && { ai_role_secondary: secondary }),
    technique_summary: text(row.Summary) || headline,
    initial_access: "unknown",
    ai_tooling_and_models: splitTopLevel(text(row["Targeted AI / Vendor"])),
    other_tooling: [],
    victims_and_sectors: sectors.length ? sectors.join("; ") : "unknown",
    regions: ["unknown"],
    region_notes:
      "Target geography was not captured by the Notion feed. Actor attribution is not used as a victim location.",
    attribution_or_cluster:
      actor && !/^unnamed$/i.test(actor) ? actor : "unknown",
    scale_and_metrics: "unknown",
    prevention_angle: "unknown",
    related_magicsword_projects: [],
    source_notes: notes.join(" "),
    tags: [
      "notion-import",
      ...techniques.map((t) =>
        t
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, ""),
      ),
    ],
    category: categoryFor(techniques, roles),
    ...(Object.keys(attribution).length && { attribution }),
    ai_involvement_confidence: AI_CONFIDENCE[row.Confidence],
  };
  const errors = entryErrors(entry, `${entry.id}.yaml`);
  return errors.length ? { error: errors.join("; "), entry } : { entry };
}

export function readRows(path) {
  const data = JSON.parse(readFileSync(path, "utf8"));
  const rows = Array.isArray(data) ? data : data.results;
  if (!Array.isArray(rows)) throw new Error(`${path}: no "results" array`);
  return rows;
}

function main() {
  const { values, positionals } = parseArgs({
    allowPositionals: true,
    options: { "dry-run": { type: "boolean" } },
  });
  if (!positionals.length)
    throw new Error(
      "Usage: node scripts/import-notion.mjs [--dry-run] <export.json>...",
    );

  const taken = new Set();
  const cited = new Set();
  for (const file of readdirSync(attacksDir).filter((f) =>
    f.endsWith(".yaml"),
  )) {
    const existing = parse(readFileSync(new URL(file, attacksDir), "utf8"));
    taken.add(existing.id);
    for (const source of existing.sources || [])
      cited.add(normalizeUrl(source.url));
  }

  const written = [];
  const skipped = [];
  const failed = [];
  for (const path of positionals)
    for (const row of readRows(path)) {
      const label = row.Headline || row.notion_url || "(untitled row)";
      if (primaryAlreadyCited(row.URL, cited)) {
        skipped.push(`${label} (source already cited)`);
        continue;
      }
      const { entry, error } = convertRow(row, taken);
      if (error) {
        failed.push(`${label}: ${error}`);
        continue;
      }
      const target = new URL(`${entry.id}.yaml`, attacksDir);
      if (existsSync(target)) {
        failed.push(`${label}: attacks/${entry.id}.yaml already exists`);
        continue;
      }
      cited.add(normalizeUrl(row.URL));
      if (!values["dry-run"])
        writeFileSync(target, stringify(entry, { lineWidth: 0 }));
      written.push(`attacks/${entry.id}.yaml`);
    }

  // Every attack stage needs a detection mapping. Imported entries have no
  // curated flow, so their generated stages get the explicit "unassessed" gap.
  if (!values["dry-run"] && written.length) {
    const stages = JSON.parse(readFileSync(stagesFile, "utf8"));
    for (const path of written) {
      const id = path.slice("attacks/".length, -".yaml".length);
      stages[id] ??= Object.fromEntries(
        GENERATED_STAGES.map((stage) => [stage, { profile: "unassessed" }]),
      );
    }
    writeFileSync(stagesFile, JSON.stringify(stages, null, 2) + "\n");
  }

  const verb = values["dry-run"] ? "Would write" : "Wrote";
  console.log(`${verb} ${written.length} entries.`);
  for (const item of written) console.log(`  + ${item}`);
  if (skipped.length) {
    console.log(`Skipped ${skipped.length} rows already in the catalog:`);
    for (const item of skipped) console.log(`  = ${item}`);
  }
  if (failed.length) {
    console.error(`Could not convert ${failed.length} rows:`);
    for (const item of failed) console.error(`  ! ${item}`);
    process.exitCode = 1;
  }
}

if (import.meta.url === `file://${process.argv[1]}`) main();
