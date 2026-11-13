#!/usr/bin/env node
import { appendFileSync, readFileSync, writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parseDocument } from "yaml";
import * as prettier from "prettier";
import { changedAttackFiles } from "./lib/changed-attacks.mjs";
import {
  hasRealDetection,
  loadAttackFile,
} from "./lib/attack-entry-checks.mjs";
import {
  detectionSourceEnv,
  queryRules,
  rootsFromEnv,
  startDetectionClient,
} from "./lib/detection-mcp.mjs";
import { fetchPublic } from "./lib/source-links.mjs";

function parseArgs(argv) {
  const args = { base: "", files: [], dryRun: false };
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (arg === "--base") args.base = argv[++index] || "";
    else if (arg === "--dry-run") args.dryRun = true;
    else if (arg.startsWith("-")) throw new Error(`Unknown argument: ${arg}`);
    else args.files.push(arg);
  }
  if (!args.base && !args.files.length)
    throw new Error("Pass attack files or --base <git-rev>");
  if (args.base && args.files.length)
    throw new Error("Use --base or a file list, not both");
  return args;
}

function cleanDetection(detection) {
  const value = { name: detection.name, format: detection.format };
  if (typeof detection.url === "string" && detection.url)
    value.url = detection.url;
  if (typeof detection.notes === "string" && detection.notes)
    value.notes = detection.notes;
  return value;
}

export function mergeDetections(existing, added) {
  const current = (Array.isArray(existing) ? existing : [])
    .filter(
      (item) => item && typeof item === "object" && item.name && item.format,
    )
    .map(cleanDetection);
  const urls = new Set(current.map((item) => item.url).filter(Boolean));
  const appended = [];
  for (const rule of added) {
    if (urls.has(rule.url)) continue;
    urls.add(rule.url);
    const cleaned = cleanDetection(rule);
    current.push(cleaned);
    appended.push(cleaned);
  }
  return { detections: current, appended };
}

export async function writeDetections(file, detections) {
  const raw = readFileSync(file, "utf8");
  const document = parseDocument(raw);
  document.set(
    "detections",
    detections.map((detection) => cleanDetection(detection)),
  );
  let text = String(document);
  if (!text.endsWith("\n")) text += "\n";
  const config = await prettier.resolveConfig(file);
  text = await prettier.format(text, { ...config, filepath: file });
  if (text !== raw) writeFileSync(file, text);
  return text !== raw;
}

function atlasNames() {
  const atlas = JSON.parse(
    readFileSync(
      new URL("../src/data/atlas-techniques.json", import.meta.url),
      "utf8",
    ),
  );
  return new Map(
    Object.entries(atlas.techniques).map(([id, technique]) => [
      id,
      technique.name,
    ]),
  );
}

export function suggestionBody(updates) {
  if (!updates.length) return "";
  const lines = [
    "## Suggested detection rules",
    "",
    "security-detections-mcp matched these Sigma, Splunk, and Elastic rules from the entry techniques, platforms, and indicators. Review the suggestions and add only rules that fit the documented behavior and telemetry.",
    "",
  ];
  for (const update of updates) {
    lines.push(`### \`${update.file}\``);
    lines.push("");
    for (const rule of update.added) {
      lines.push(`- **${rule.name}** (${rule.format})`);
      lines.push(`  - ${rule.url}`);
      if (rule.notes) lines.push(`  - ${rule.notes}`);
    }
    lines.push("");
  }
  return `${lines.join("\n")}\n`;
}

async function keepReachable(rules, readUrl) {
  const kept = [];
  const skipped = [];
  for (const rule of rules) {
    try {
      const result = await readUrl(rule.url);
      if (result.status === 200) kept.push(rule);
      else skipped.push(`${rule.url} returned HTTP ${result.status}`);
    } catch (error) {
      skipped.push(`${rule.url} request failed (${error.message})`);
    }
  }
  return { kept, skipped };
}

export async function enrichFile(file, { client, readUrl, roots, names }) {
  const { data } = loadAttackFile(file);
  if (hasRealDetection(data))
    return { file, added: [], skipped: [], changed: false };
  const matched = await queryRules(client, data, { roots, atlasNames: names });
  const { kept, skipped } = await keepReachable(matched, readUrl);
  const { detections, appended } = mergeDetections(data.detections, kept);
  const changed = appended.length
    ? await writeDetections(file, detections)
    : false;
  return { file, added: appended, skipped, changed };
}

function outputNeeds(needed) {
  if (!process.env.GITHUB_OUTPUT) return;
  appendFileSync(
    process.env.GITHUB_OUTPUT,
    `needs=${needed ? "true" : "false"}\n`,
  );
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const files = args.files.length ? args.files : changedAttackFiles(args.base);
  const pending = [];
  for (const file of files) {
    try {
      const { data } = loadAttackFile(file);
      if (!hasRealDetection(data)) pending.push(file);
    } catch (error) {
      console.error(`${file}: ${error.message}`);
      process.exitCode = 1;
    }
  }
  if (process.exitCode) return;
  outputNeeds(pending.length > 0);
  if (!pending.length) {
    console.log("No changed attack entries need detection rules.");
    return;
  }
  if (args.dryRun) {
    console.log(pending.join("\n"));
    return;
  }

  const detectionEnv = { ...process.env, ...detectionSourceEnv() };
  const roots = rootsFromEnv(detectionEnv);
  const names = atlasNames();
  const client = await startDetectionClient({ env: detectionEnv });
  const updates = [];
  try {
    for (const file of pending) {
      const result = await enrichFile(file, {
        client,
        readUrl: fetchPublic,
        roots,
        names,
      });
      if (result.added.length) updates.push(result);
      console.log(
        result.added.length
          ? `${file}: added ${result.added.length} detection rule(s)`
          : `${file}: no matching detection rules`,
      );
      for (const skip of result.skipped) console.log(`  skipped ${skip}`);
    }
  } finally {
    await client.close();
  }

  const body = suggestionBody(updates);
  const suggestionPath =
    process.env.DETECTION_SUGGESTIONS_PATH || "/tmp/detection-suggestions.md";
  writeFileSync(suggestionPath, body);
  if (process.env.GITHUB_STEP_SUMMARY && body)
    appendFileSync(process.env.GITHUB_STEP_SUMMARY, body);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  await main();
  if (process.exitCode) process.exit(process.exitCode);
}
