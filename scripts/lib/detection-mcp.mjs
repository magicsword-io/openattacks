import { spawn } from "node:child_process";
import { homedir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { once } from "node:events";
import { isPublicAddress } from "../../src/lib/source-urls.mjs";
import {
  entryPlatforms,
  normalizeOs,
  platformsConflict,
  platformsFromPath,
} from "./attack-entry-checks.mjs";

export const MCP_PACKAGE = "security-detections-mcp@3.3.4";
export const SOURCE_ORDER = ["sigma", "splunk_escu", "elastic"];
const FORMAT = { sigma: "sigma", splunk_escu: "splunk", elastic: "elastic" };
const URL_BASES = [
  ["SIGMA_PATHS", "https://github.com/SigmaHQ/sigma/blob/master/rules/"],
  [
    "SPLUNK_PATHS",
    "https://github.com/splunk/security_content/blob/develop/detections/",
  ],
  [
    "ELASTIC_PATHS",
    "https://github.com/elastic/detection-rules/blob/main/rules/",
  ],
];

const repoRoot = fileURLToPath(new URL("../../", import.meta.url));

export function detectionSourcesDir() {
  return (
    process.env.DETECTION_SOURCES_DIR || join(repoRoot, ".cache", "detection-sources")
  );
}

export function detectionSourceEnv(root = detectionSourcesDir()) {
  return {
    SIGMA_PATHS: join(root, "sigma", "rules"),
    SPLUNK_PATHS: join(root, "security_content", "detections"),
    ELASTIC_PATHS: join(root, "detection-rules", "rules"),
    DETECTIONS_DB_PATH: join(
      homedir(),
      ".cache",
      "security-detections-mcp",
      "detections.sqlite",
    ),
  };
}

export function rootsFromEnv(env = process.env) {
  const roots = [];
  for (const [key, urlBase] of URL_BASES)
    for (const root of String(env[key] || "")
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean))
      roots.push({ root, urlBase });
  return roots;
}

export function attackTechniqueIds(entry) {
  const ids = new Set();
  // ATLAS ids such as AML.T0011 contain a dotted T-number and are not ATT&CK.
  for (const match of JSON.stringify(entry).matchAll(
    /(?<![A-Za-z.])T\d{4}(?:\.\d{3})?\b/g,
  ))
    ids.add(match[0]);
  return [...ids].sort();
}

export function atlasTechniqueIds(entry) {
  return [
    ...new Set(
      (entry?.atlas_techniques || [])
        .map((technique) => technique?.id)
        .filter((id) => typeof id === "string" && id),
    ),
  ].sort();
}

export function iocTokens(entry) {
  const iocs = entry?.iocs || {};
  const values = [
    ...(iocs.domains || []),
    ...(iocs.ips || []),
    ...(iocs.hashes || []),
    ...(iocs.urls || []),
  ];
  const tokens = [];
  for (const value of values) {
    if (typeof value !== "string") continue;
    const cleaned = value.replaceAll("[.]", ".").replaceAll("(dot)", ".").trim();
    if (cleaned.length < 6 || cleaned.length > 160) continue;
    if (/^\d{1,3}(?:\.\d{1,3}){3}$/.test(cleaned) && !isPublicAddress(cleaned))
      continue;
    tokens.push(cleaned);
  }
  return [...new Set(tokens)].sort().slice(0, 8);
}

export function ftsQuote(value) {
  return `"${String(value).replaceAll('"', '""')}"`;
}

export function detectionUrl(filePath, roots) {
  const normalized = String(filePath || "").replaceAll("\\", "/");
  const sorted = [...roots].sort((a, b) => b.root.length - a.root.length);
  for (const root of sorted) {
    const base = root.root.replaceAll("\\", "/").replace(/\/$/, "");
    if (!normalized.startsWith(`${base}/`)) continue;
    const relative = normalized.slice(base.length + 1);
    return (
      root.urlBase.replace(/\/$/, "") +
      "/" +
      relative
        .split("/")
        .map((segment) => encodeURIComponent(segment))
        .join("/")
    );
  }
  return null;
}

function rowPlatforms(row) {
  const found = platformsFromPath(row.file_path || "");
  for (const value of row.platforms || []) {
    const platform = normalizeOs(value, { allowShort: true });
    if (platform) found.add(platform);
  }
  const product = normalizeOs(row.logsource_product, { allowShort: true });
  if (product) found.add(product);
  return found;
}

function usable(row) {
  if (!row || !FORMAT[row.source_type] || !row.name || !row.id) return false;
  if (row.status && /deprecated|unsupported/i.test(row.status)) return false;
  if (/deprecated/i.test(row.file_path || "")) return false;
  return true;
}

export function selectRules(entry, candidates, roots, limit = 5) {
  const entryOs = entryPlatforms(entry);
  const best = new Map();
  for (const candidate of candidates) {
    const row = candidate.row;
    if (!usable(row)) continue;
    const ruleOs = rowPlatforms(row);
    if (entryOs.size && (!ruleOs.size || platformsConflict(entryOs, ruleOs)))
      continue;
    const url = detectionUrl(row.file_path, roots);
    if (!url) continue;
    const key = `${row.source_type}:${row.id}`;
    const current = best.get(key);
    if (!current || candidate.score > current.score) {
      best.set(key, {
        score: candidate.score,
        reasons: new Set(candidate.reasons || []),
        rule: {
          name: row.name,
          format: FORMAT[row.source_type],
          url,
          source: row.source_type,
          id: row.id,
        },
      });
    } else if (current && candidate.score === current.score)
      for (const reason of candidate.reasons || []) current.reasons.add(reason);
  }
  return [...best.values()]
    .sort((a, b) => {
      if (b.score !== a.score) return b.score - a.score;
      const source =
        SOURCE_ORDER.indexOf(a.rule.source) - SOURCE_ORDER.indexOf(b.rule.source);
      if (source) return source;
      return (
        a.rule.name.localeCompare(b.rule.name) || a.rule.id.localeCompare(b.rule.id)
      );
    })
    .slice(0, limit)
    .map((item) => ({
      name: item.rule.name,
      format: item.rule.format,
      url: item.rule.url,
      notes: `Matched ${[...item.reasons].sort().join(", ")} with security-detections-mcp.`,
    }));
}

function rowsOf(payload) {
  if (!payload || payload.error) return [];
  if (Array.isArray(payload.detections)) return payload.detections;
  if (Array.isArray(payload.results)) return payload.results;
  return [];
}

export async function queryRules(client, entry, { roots, atlasNames, limit = 5 }) {
  const candidates = [];
  const add = (rows, score, reason) => {
    for (const row of rows)
      candidates.push({ row, score, reasons: reason ? [reason] : [] });
  };
  for (const technique of attackTechniqueIds(entry)) {
    const queries = technique.includes(".")
      ? [technique, technique.split(".")[0]]
      : [technique];
    for (const [index, query] of queries.entries()) {
      const payload = await client.call("list_by_mitre", {
        technique_id: query,
        limit: 10,
      });
      add(rowsOf(payload), index === 0 ? 3 : 2, query);
    }
  }
  for (const id of atlasTechniqueIds(entry)) {
    const name = atlasNames?.get(id);
    for (const query of [id, name].filter(Boolean)) {
      const payload = await client.call("search", {
        query: ftsQuote(query),
        limit: 10,
      });
      add(rowsOf(payload), 2, id);
    }
  }
  for (const token of iocTokens(entry)) {
    const payload = await client.call("search", {
      query: ftsQuote(token),
      limit: 5,
    });
    add(rowsOf(payload), 2, token);
  }
  // Platform is applied in selectRules so a Windows rule is not suggested for
  // an entry that only describes macOS. Technique and IOC queries stay the
  // recall path; a platform-only browse would add unrelated rules.
  return selectRules(entry, candidates, roots, limit);
}

// security-detections-mcp speaks newline-delimited JSON-RPC on stdio.
function encodeMessage(message) {
  return `${JSON.stringify(message)}\n`;
}

async function readMessages(stream, onMessage) {
  let buffer = "";
  for await (const chunk of stream) {
    buffer += chunk.toString("utf8");
    let newline = buffer.indexOf("\n");
    while (newline !== -1) {
      const line = buffer.slice(0, newline).replace(/\r$/, "");
      buffer = buffer.slice(newline + 1);
      if (line.trim()) onMessage(JSON.parse(line));
      newline = buffer.indexOf("\n");
    }
  }
}

export async function startDetectionClient({
  command = "npx",
  args = ["-y", MCP_PACKAGE],
  env = { ...process.env, ...detectionSourceEnv() },
  timeoutMs = 600000,
} = {}) {
  const child = spawn(command, args, {
    env: { ...env, NPM_CONFIG_UPDATE_NOTIFIER: "false" },
    stdio: ["pipe", "pipe", "pipe"],
  });
  let stderr = "";
  child.stderr.on("data", (chunk) => {
    stderr += chunk.toString("utf8");
    if (stderr.length > 20000) stderr = stderr.slice(-20000);
  });
  const pending = new Map();
  let nextId = 1;
  let failed;
  const fail = (error) => {
    if (failed) return;
    failed = error;
    for (const waiter of pending.values()) waiter.reject(error);
    pending.clear();
  };
  child.on("error", fail);
  child.on("exit", (code) => {
    if (code) fail(new Error(stderr.trim() || `detection server exited ${code}`));
  });
  const reading = readMessages(child.stdout, (message) => {
    if (message.id == null) return;
    const waiter = pending.get(message.id);
    if (!waiter) return;
    pending.delete(message.id);
    if (message.error)
      waiter.reject(new Error(message.error.message || "MCP error"));
    else waiter.resolve(message.result);
  }).catch(fail);

  function send(message) {
    if (failed) throw failed;
    child.stdin.write(encodeMessage(message));
  }
  function request(method, params) {
    const id = nextId++;
    const response = new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        pending.delete(id);
        reject(new Error(`MCP ${method} timed out after ${timeoutMs}ms`));
      }, timeoutMs);
      pending.set(id, {
        resolve: (value) => {
          clearTimeout(timer);
          resolve(value);
        },
        reject: (error) => {
          clearTimeout(timer);
          reject(error);
        },
      });
    });
    send({ jsonrpc: "2.0", id, method, params });
    return response;
  }

  try {
    await request("initialize", {
      protocolVersion: "2024-11-05",
      capabilities: {},
      clientInfo: { name: "openattacks-ci", version: "1.0.0" },
    });
    send({ jsonrpc: "2.0", method: "notifications/initialized" });
  } catch (error) {
    child.kill("SIGTERM");
    throw new Error(
      `${error.message}${stderr ? `\n${stderr.trim()}` : ""}`,
    );
  }

  return {
    async call(name, args) {
      const result = await request("tools/call", { name, arguments: args });
      const text = result?.content?.find((item) => item.type === "text")?.text;
      if (!text) return result;
      try {
        return JSON.parse(text);
      } catch {
        return { error: true, message: text };
      }
    },
    async close() {
      child.stdin.end();
      if (child.exitCode == null) child.kill("SIGTERM");
      await Promise.race([
        once(child, "exit").catch(() => {}),
        new Promise((resolve) => setTimeout(resolve, 2000)),
      ]);
      reading.catch(() => {});
    },
  };
}
