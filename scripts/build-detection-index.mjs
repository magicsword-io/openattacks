#!/usr/bin/env node
import { existsSync, mkdirSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { join } from "node:path";
import {
  detectionSourceEnv,
  detectionSourcesDir,
  startDetectionClient,
} from "./lib/detection-mcp.mjs";

function git(args, cwd) {
  const result = spawnSync("git", args, {
    cwd,
    stdio: "inherit",
    env: { ...process.env, GIT_TERMINAL_PROMPT: "0" },
  });
  if (result.status !== 0) throw new Error(`git ${args.join(" ")} failed`);
}

function ensureClone(parent, name, url, paths) {
  const directory = join(parent, name);
  if (!existsSync(join(directory, ".git"))) {
    mkdirSync(parent, { recursive: true });
    git(
      ["clone", "--depth", "1", "--filter=blob:none", "--sparse", url, name],
      parent,
    );
  }
  git(["sparse-checkout", "set", ...paths], directory);
  return directory;
}

const root = detectionSourcesDir();
ensureClone(root, "sigma", "https://github.com/SigmaHQ/sigma.git", ["rules"]);
ensureClone(
  root,
  "security_content",
  "https://github.com/splunk/security_content.git",
  ["detections"],
);
ensureClone(
  root,
  "detection-rules",
  "https://github.com/elastic/detection-rules.git",
  ["rules"],
);

const client = await startDetectionClient({
  env: { ...process.env, ...detectionSourceEnv(root) },
  timeoutMs: 600000,
});
try {
  const sample = await client.call("search", { query: '"process"', limit: 1 });
  const count = sample?.count ?? sample?.detections?.length ?? 0;
  console.log(`Detection index ready (sample hits: ${count}).`);
  if (!count) throw new Error("security-detections-mcp indexed no rules");
} finally {
  await client.close();
}
