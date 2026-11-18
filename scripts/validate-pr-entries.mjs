#!/usr/bin/env node
import { appendFileSync } from "node:fs";
import { changedAttackFiles } from "./lib/changed-attacks.mjs";
import { formatReport, validateFiles } from "./lib/attack-entry-checks.mjs";

function parseArgs(argv) {
  const args = { base: "", files: [] };
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (arg === "--base") args.base = argv[++index] || "";
    else if (arg.startsWith("-")) throw new Error(`Unknown argument: ${arg}`);
    else args.files.push(arg);
  }
  if (!args.base && !args.files.length)
    throw new Error("Pass attack files or --base <git-rev>");
  if (args.base && args.files.length)
    throw new Error("Use --base or a file list, not both");
  return args;
}

const args = parseArgs(process.argv.slice(2));
const files = args.files.length ? args.files : changedAttackFiles(args.base);
const results = await validateFiles(files);
const report = formatReport(results);
console.log(report);
if (process.env.GITHUB_STEP_SUMMARY)
  appendFileSync(
    process.env.GITHUB_STEP_SUMMARY,
    `## Attack detections\n\n\`\`\`\n${report}\`\`\`\n`,
  );
if (results.some((result) => result.issues.length)) process.exitCode = 1;
