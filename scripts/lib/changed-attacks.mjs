import { execFileSync } from "node:child_process";
import { appendFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const repoRoot = fileURLToPath(new URL("../../", import.meta.url));

export function isAttackYaml(path) {
  return /^attacks\/[^/]+\.ya?ml$/.test(path);
}

// `git diff --name-status -z` emits `M\0path\0` and `R100\0old\0new\0`.
export function attackPathsFromStatus(text) {
  const parts = text.split("\0").filter((part) => part.length);
  const files = [];
  for (let index = 0; index < parts.length;) {
    const status = parts[index++];
    const code = status[0];
    if (code === "R" || code === "C") {
      index += 1;
      const path = parts[index++] || "";
      if (isAttackYaml(path)) files.push(path);
    } else {
      const path = parts[index++] || "";
      if ("AM".includes(code) && isAttackYaml(path)) files.push(path);
    }
  }
  return [...new Set(files)].sort();
}

export function changedAttackFiles(
  base,
  { cwd = repoRoot, exec = execFileSync } = {},
) {
  const mergeBase = exec("git", ["merge-base", base, "HEAD"], {
    cwd,
    encoding: "utf8",
  }).trim();
  const output = exec(
    "git",
    [
      "diff",
      "--name-status",
      "-z",
      "--find-renames",
      "--diff-filter=AMR",
      mergeBase,
      "HEAD",
      "--",
      "attacks",
    ],
    { cwd, encoding: "utf8" },
  );
  return attackPathsFromStatus(output);
}

function readArgs(argv) {
  const args = { base: "", count: false };
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (arg === "--base") args.base = argv[++index] || "";
    else if (arg === "--count") args.count = true;
    else throw new Error(`Unknown argument: ${arg}`);
  }
  if (!args.base) throw new Error("--base is required");
  return args;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  const args = readArgs(process.argv.slice(2));
  const files = changedAttackFiles(args.base);
  if (args.count) console.log(String(files.length));
  else if (files.length) console.log(files.join("\n"));
  if (process.env.GITHUB_OUTPUT) {
    appendFileSync(
      process.env.GITHUB_OUTPUT,
      `count=${files.length}\nfiles<<EOF\n${files.join("\n")}\nEOF\n`,
    );
  }
}
