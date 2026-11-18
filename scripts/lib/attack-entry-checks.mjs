import { readFileSync } from "node:fs";
import { basename } from "node:path";
import { parseDocument } from "yaml";
import { entryErrors } from "../../src/lib/schema.mjs";
import { stackSystems } from "../../src/lib/stack-matching.mjs";
import { fetchPublic } from "./source-links.mjs";

const OS_IDS = new Set(stackSystems.map((system) => system.id));
const CONFLICT =
  /^\s*(?:<{7}(?: .*)?|={7}|>{7}(?: .*)?|\|{7}(?: .*)?)\s*$/m;

// Words in the attack record, using the same OS ids as stack matching.
const OS_TEXT = [
  ["windows", /\bwindows\b|\bpowershell\b|\bschtasks\b|\bcmd\.exe\b/i],
  ["macos", /\bmacos\b|\bmac\s?os\b|\bosx\b|\blaunch\s?agents?\b|\bplistbuddy\b/i],
  ["linux", /\blinux\b|\bsystemd\b/i],
  ["android", /\bandroid\b/i],
];

export const REQUIRED_FIELDS = [
  "category",
  "attribution",
  "ai_involvement_confidence",
  "detections",
  "timeline",
];

function filledString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function filledValue(value) {
  if (filledString(value)) return true;
  if (Array.isArray(value)) return value.some(filledValue);
  if (value && typeof value === "object")
    return Object.values(value).some(filledValue);
  return false;
}

export function completenessIssues(entry) {
  const issues = [];
  for (const field of REQUIRED_FIELDS) {
    const value = entry?.[field];
    const present =
      field === "detections"
        ? Array.isArray(value) && value.length > 0
        : field === "attribution" || field === "timeline"
          ? Boolean(value) &&
            typeof value === "object" &&
            !Array.isArray(value) &&
            filledValue(value)
          : filledString(value);
    if (!present)
      issues.push({
        check: "completeness",
        message: `${field} is missing or empty`,
      });
  }
  return issues;
}

export function hasRealDetection(entry) {
  return (
    Array.isArray(entry?.detections) &&
    entry.detections.some(
      (item) =>
        item &&
        typeof item === "object" &&
        filledString(item.format) &&
        item.format !== "guidance",
    )
  );
}

function entryText(entry) {
  const parts = [];
  const walk = (value) => {
    if (typeof value === "string") parts.push(value);
    else if (Array.isArray(value)) value.forEach(walk);
    else if (value && typeof value === "object")
      Object.values(value).forEach(walk);
  };
  // Detection text is excluded so a rule name cannot hide a platform mismatch.
  walk({
    technique_summary: entry?.technique_summary,
    initial_access: entry?.initial_access,
    ai_tooling_and_models: entry?.ai_tooling_and_models,
    other_tooling: entry?.other_tooling,
    victims_and_sectors: entry?.victims_and_sectors,
    prevention_angle: entry?.prevention_angle,
    source_notes: entry?.source_notes,
    attack_flow: entry?.attack_flow,
    tags: entry?.tags,
    ai_role_detail: entry?.ai_role_detail,
  });
  return parts.join("\n");
}

export function entryPlatforms(entry) {
  const text = entryText(entry);
  const found = new Set();
  for (const [id, pattern] of OS_TEXT)
    if (OS_IDS.has(id) && pattern.test(text)) found.add(id);
  return found;
}

export function normalizeOs(value, { allowShort = false } = {}) {
  if (value == null) return null;
  const text = String(value).trim().toLowerCase();
  if (["macos", "osx", "darwin"].includes(text)) return "macos";
  if (text === "mac" && allowShort) return "macos";
  if (text === "windows") return "windows";
  if (text === "win" && allowShort) return "windows";
  if (text === "linux") return "linux";
  if (text === "android") return "android";
  return OS_IDS.has(text) ? text : null;
}

export function platformsFromPath(value) {
  const found = new Set();
  const segments = String(value)
    .toLowerCase()
    .split(/[^a-z0-9]+/);
  for (const segment of segments) {
    const platform = normalizeOs(segment, { allowShort: true });
    if (platform) found.add(platform);
  }
  return found;
}

export function platformsFromBody(body) {
  const found = new Set();
  const add = (value) => {
    const platform = normalizeOs(value, { allowShort: true });
    if (platform) found.add(platform);
  };
  const logsource = String(body).match(/logsource:\s*\n((?:[ \t]+.*\n)*)/);
  const product = (logsource ? logsource[1] : String(body).slice(0, 4000)).match(
    /^\s*product:\s*["']?([A-Za-z0-9_.-]+)/m,
  );
  if (product) add(product[1]);
  const tagged = String(body).match(
    /product:\s*\n((?:\s*-\s*["']?[A-Za-z0-9_.-]+["']?\s*\n)+)/,
  );
  if (tagged)
    for (const match of tagged[1].matchAll(/-\s*["']?([A-Za-z0-9_.-]+)/g))
      add(match[1]);
  return found;
}

export function rulePlatforms({ url = "", body = "", platforms = [], product } = {}) {
  const fromPath = platformsFromPath(url);
  // A platform directory or Sigma filename is the rule target. Body text is
  // only used when the URL path does not name an OS.
  if (fromPath.size) return fromPath;
  const found = new Set(platformsFromBody(body));
  for (const value of platforms) {
    const platform = normalizeOs(value, { allowShort: true });
    if (platform) found.add(platform);
  }
  const fromProduct = normalizeOs(product, { allowShort: true });
  if (fromProduct) found.add(fromProduct);
  return found;
}

export function platformsConflict(entryOs, ruleOs) {
  if (!entryOs.size || !ruleOs.size) return false;
  for (const platform of ruleOs) if (entryOs.has(platform)) return false;
  return true;
}

function listPlatforms(platforms) {
  return [...platforms].sort().join(", ");
}

async function readDetection(url, readUrl) {
  let last;
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      last = await readUrl(url);
      if (last.status !== 429 && last.status !== 503) return last;
    } catch (error) {
      last = error;
    }
  }
  if (last instanceof Error) throw last;
  return last;
}

export async function detectionIssues(entry, { readUrl = fetchPublic } = {}) {
  if (!Array.isArray(entry?.detections)) return [];
  const entryOs = entryPlatforms(entry);
  const issues = [];
  for (let index = 0; index < entry.detections.length; index++) {
    const detection = entry.detections[index];
    if (!detection || typeof detection !== "object") continue;
    const label = filledString(detection.name)
      ? detection.name
      : `item ${index + 1}`;
    const where = `detections[${index}] "${label}"`;
    if (detection.format === "guidance" && !filledString(detection.url))
      continue;
    if (!filledString(detection.url)) {
      issues.push({
        check: "url",
        message: `${where} needs an HTTP URL`,
      });
      continue;
    }
    let body = "";
    try {
      const result = await readDetection(detection.url, readUrl);
      body = result.body || "";
      if (result.status !== 200)
        issues.push({
          check: "url",
          message: `${where} returned HTTP ${result.status}: ${detection.url}`,
        });
    } catch (error) {
      issues.push({
        check: "url",
        message: `${where} request failed (${error.message}): ${detection.url}`,
      });
    }
    if (detection.format === "guidance") continue;
    const ruleOs = rulePlatforms({ url: detection.url, body });
    if (platformsConflict(entryOs, ruleOs))
      issues.push({
        check: "platform",
        message: `${where} targets ${listPlatforms(ruleOs)}, but the entry only describes ${listPlatforms(entryOs)}`,
      });
  }
  return issues;
}

export async function validateEntryData(entry, filename, options = {}) {
  const issues = [];
  for (const message of entryErrors(entry, filename))
    issues.push({ check: "schema", message });
  issues.push(...completenessIssues(entry));
  issues.push(...(await detectionIssues(entry, options)));
  return issues;
}

export function loadAttackFile(file) {
  const raw = readFileSync(file, "utf8");
  if (CONFLICT.test(raw)) throw new Error("unresolved merge conflict marker");
  const document = parseDocument(raw, { uniqueKeys: true });
  if (document.errors.length)
    throw new Error(document.errors.map((error) => error.message).join("; "));
  return { raw, data: document.toJS() };
}

export async function validateFile(file, options = {}) {
  try {
    const { data } = loadAttackFile(file);
    return {
      file,
      data,
      issues: await validateEntryData(data, basename(file), options),
    };
  } catch (error) {
    return {
      file,
      data: null,
      issues: [{ check: "schema", message: error.message }],
    };
  }
}

export async function validateFiles(files, options = {}) {
  const results = [];
  for (const file of files) results.push(await validateFile(file, options));
  return results;
}

export function formatReport(results) {
  if (!results.length) return "No changed attack entries.\n";
  const lines = ["Attack entry detection report", ""];
  for (const result of results) {
    lines.push(result.file);
    if (!result.issues.length) {
      lines.push("  ok");
      continue;
    }
    for (const issue of result.issues)
      lines.push(`  ${issue.check}: ${issue.message}`);
    lines.push("");
  }
  const failed = results.filter((result) => result.issues.length).length;
  lines.push(
    `${failed} of ${results.length} changed ${results.length === 1 ? "entry" : "entries"} failed.`,
  );
  return `${lines.join("\n")}\n`;
}
