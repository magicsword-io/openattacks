import test from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import { buildPromptGroups } from "../src/lib/llm-prompts.mjs";

const attacks = readdirSync(new URL("../attacks/", import.meta.url))
  .filter((name) => name.endsWith(".yaml"))
  .map((name) =>
    parse(readFileSync(new URL(`../attacks/${name}`, import.meta.url), "utf8")),
  );

test("example prompts name current finance and ARTEX entries", () => {
  const groups = buildPromptGroups(attacks);
  assert.deepEqual(
    groups.map((group) => group.id),
    ["threat-intel", "detection", "atlas", "prevention", "briefing", "compare"],
  );
  const text = JSON.stringify(groups);
  const recent = [...attacks].sort((a, b) =>
    String(b.date_reported).localeCompare(String(a.date_reported)),
  );
  const finance = recent.find((attack) =>
    /bank|financ|fintech|bfsi/i.test(attack.victims_and_sectors || ""),
  );
  const artex = recent.find((attack) =>
    /artex/i.test(
      [attack.name, ...(attack.ai_tooling_and_models || [])].join("\n"),
    ),
  );
  assert.ok(finance);
  assert.ok(artex);
  assert.match(text, new RegExp(finance.id));
  assert.match(text, new RegExp(artex.id));
  assert.doesNotMatch(text, /openattacks-mcp|npx -y/);
});

test("skill frontmatter matches the directory and the zip contains only that file", () => {
  const skill = readFileSync(
    new URL("../skills/openattacks/SKILL.md", import.meta.url),
    "utf8",
  );
  assert.match(skill, /^---\nname: openattacks\n/);
  const description = skill.match(/^description: (.+)\n/m)?.[1] || "";
  assert.ok(description.length > 40 && description.length <= 1024);
  assert.match(skill, /llms\.txt/);
  assert.match(skill, /llms\/attacks\/<id>\.md/);
  assert.match(skill, /data\/attacks\.json/);
  assert.doesNotMatch(skill, /openattacks-mcp|npx -y/);
  const root = fileURLToPath(new URL("..", import.meta.url));
  execFileSync(process.execPath, ["scripts/build-skill-zip.mjs"], { cwd: root });
  const listing = execFileSync(
    "python3",
    [
      "-c",
      "import zipfile; z=zipfile.ZipFile('public/downloads/openattacks-skill.zip'); print('\\n'.join(z.namelist())); print(z.read('openattacks/SKILL.md').decode().splitlines()[1])",
    ],
    { cwd: root, encoding: "utf8" },
  );
  assert.equal(listing.trim().split("\n")[0], "openattacks/SKILL.md");
  assert.match(listing, /name: openattacks/);
  assert.equal(listing.trim().split("\n").length, 2);
});
