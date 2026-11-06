import { appendFileSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { parseArgs } from "node:util";
import { readCatalog } from "./lib/catalog.mjs";
import { checkLinks, collectLinks } from "./lib/source-links.mjs";

const { values } = parseArgs({
  options: { base: { type: "string" }, all: { type: "boolean" } },
});
if (values.all && values.base) throw new Error("Use --all or --base, not both");
const { entries, errors } = readCatalog();
if (errors.length)
  throw new Error(`Fix catalog validation first:\n${errors.join("\n")}`);
let selected = entries;
if (values.base) {
  const base = execFileSync(
    "git",
    ["rev-parse", "--verify", "--end-of-options", `${values.base}^{commit}`],
    { encoding: "utf8" },
  ).trim();
  const changed = new Set(
    execFileSync(
      "git",
      [
        "diff",
        "--name-only",
        "-z",
        "--diff-filter=AM",
        "--no-renames",
        base,
        "HEAD",
        "--",
        "attacks/",
      ],
      { encoding: "utf8" },
    ).split("\0"),
  );
  selected = entries.filter(({ filename }) =>
    changed.has(`attacks/${filename}`),
  );
}
const results = await checkLinks(collectLinks(selected));
const failures = results.filter(({ status }) => status === "error");
const warnings = results.filter(({ status }) => status === "warning");
const summary = `Checked ${results.length} unique source/coverage URLs in ${selected.length} entries: ${failures.length} errors, ${warnings.length} warnings.`;
console.log(summary);
for (const result of results.filter(({ status }) => status !== "ok"))
  console.log(
    `${result.status.toUpperCase()}: ${result.url} — ${result.detail}\n  ${result.references.join("\n  ")}`,
  );
if (process.env.GITHUB_STEP_SUMMARY) {
  const escape = (value) =>
    value.replace(
      /[<>&`|\r\n]/g,
      (character) => `&#${character.charCodeAt(0)};`,
    );
  appendFileSync(
    process.env.GITHUB_STEP_SUMMARY,
    `## Source link validation\n\n${summary}\n\n${results
      .filter(({ status }) => status !== "ok")
      .map(
        (result) =>
          `- **${result.status}**: ${escape(result.url)} — ${escape(result.detail)}\n${result.references.map((reference) => `  - ${escape(reference)}`).join("\n")}`,
      )
      .join("\n")}\n`,
  );
}
if (failures.length) process.exitCode = 1;
