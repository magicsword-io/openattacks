import test from "node:test";
import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import {
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
  mkdirSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { parse } from "yaml";
import * as prettier from "prettier";
import {
  attackPathsFromStatus,
  changedAttackFiles,
} from "../scripts/lib/changed-attacks.mjs";
import {
  entryPlatforms,
  formatReport,
  validateEntryData,
  validateFile,
} from "../scripts/lib/attack-entry-checks.mjs";
import {
  attackTechniqueIds,
  selectRules,
  startDetectionClient,
} from "../scripts/lib/detection-mcp.mjs";
import { enrichFile, writeDetections } from "../scripts/enrich-detections.mjs";
import { fetchPublic } from "../scripts/lib/source-links.mjs";

const fixtureDir = fileURLToPath(
  new URL("./fixtures/attack-detections/", import.meta.url),
);
const ok = async () => ({
  status: 200,
  body: "logsource:\n  product: macos\n",
});
const roots = [
  {
    root: "/opt/sigma/rules",
    urlBase: "https://github.com/SigmaHQ/sigma/blob/master/rules/",
  },
  {
    root: "/opt/splunk/detections",
    urlBase:
      "https://github.com/splunk/security_content/blob/develop/detections/",
  },
  {
    root: "/opt/elastic/rules",
    urlBase: "https://github.com/elastic/detection-rules/blob/main/rules/",
  },
];

test("changed-attack parser keeps added files and rename destinations", () => {
  const files = attackPathsFromStatus(
    [
      "A",
      "attacks/new-entry.yaml",
      "M",
      "attacks/edited.yml",
      "D",
      "attacks/removed.yaml",
      "R100",
      "attacks/old.yaml",
      "attacks/renamed.yaml",
      "M",
      "docs/CI.md",
    ].join("\0") + "\0",
  );
  assert.deepEqual(files, [
    "attacks/edited.yml",
    "attacks/new-entry.yaml",
    "attacks/renamed.yaml",
  ]);
  const exec = (_command, args) => (args[0] === "merge-base" ? "HEAD\n" : "");
  assert.deepEqual(changedAttackFiles("HEAD", { exec }), []);
});

test("changed attacks diff from the merge base", () => {
  const calls = [];
  const exec = (_command, args) => {
    calls.push(args);
    if (args[0] === "merge-base") return "common-base\n";
    return "A\0attacks/new-entry.yaml\0";
  };
  assert.deepEqual(changedAttackFiles("new-main", { cwd: "/repo", exec }), [
    "attacks/new-entry.yaml",
  ]);
  assert.deepEqual(calls[0], ["merge-base", "new-main", "HEAD"]);
  assert.ok(calls[1].includes("common-base"));
  assert.equal(calls[1].includes("new-main"), false);
});

test("missing category, attribution, confidence, detections, and timeline fails", async () => {
  const file = join(fixtureDir, "missing-fields.yaml");
  const result = await validateFile(file, { readUrl: ok });
  const report = formatReport([result]);
  console.log(report);
  assert.equal(
    result.issues.some((issue) => issue.check === "schema"),
    false,
  );
  for (const field of [
    "category",
    "attribution",
    "ai_involvement_confidence",
    "detections",
    "timeline",
  ])
    assert.match(report, new RegExp(`${field} is missing or empty`));
  const cli = spawnSync(
    process.execPath,
    ["scripts/validate-pr-entries.mjs", file],
    { encoding: "utf8" },
  );
  assert.equal(cli.status, 1);
  assert.match(cli.stdout, /missing-fields\.yaml/);
  assert.match(cli.stdout, /1 of 1 changed entry failed/);
});

test("a Windows Sigma rule fails on a macOS-only entry", async () => {
  const file = join(fixtureDir, "platform-mismatch.yaml");
  const result = await validateFile(file, { readUrl: ok });
  const report = formatReport([result]);
  console.log(report);
  assert.match(
    report,
    /detections\[0\] "Scheduled Task Creation Via Schtasks" targets windows, but the entry only describes macos/,
  );
  assert.equal(result.issues.length, 1);
  const both = parse(readFileSync(file, "utf8"));
  both.technique_summary = "The same installer runs on Windows and macOS.";
  both.other_tooling = ["schtasks", "LaunchAgent"];
  const issues = await validateEntryData(both, "platform-mismatch.yaml", {
    readUrl: ok,
  });
  assert.equal(
    issues.some((issue) => issue.check === "platform"),
    false,
  );
});

test("detection URLs must be public HTTP 200 responses", async () => {
  const file = join(fixtureDir, "platform-mismatch.yaml");
  const missing = await validateFile(file, {
    readUrl: async () => ({ status: 404, body: "" }),
  });
  assert.match(formatReport([missing]), /returned HTTP 404/);
  const data = parse(readFileSync(file, "utf8"));
  data.detections[0].url = "http://127.0.0.1/rule.yml";
  const local = await validateEntryData(data, "platform-mismatch.yaml");
  assert.match(
    local.map((issue) => issue.message).join("\n"),
    /public address/,
  );
  await assert.rejects(
    () =>
      fetchPublic("https://example.org/start", {
        request: async (url) =>
          url.endsWith("/start")
            ? { status: 302, location: "http://127.0.0.1/secret" }
            : { status: 200, body: "nope" },
      }),
    /public address/,
  );
});

test("schema errors from entryErrors are included in the report", async () => {
  const data = parse(
    readFileSync(join(fixtureDir, "guidance-only.yaml"), "utf8"),
  );
  data.id = "not-the-filename";
  const issues = await validateEntryData(data, "guidance-only.yaml", {
    readUrl: ok,
  });
  assert.match(
    issues.map((issue) => issue.message).join("\n"),
    /id must match the filename/,
  );
});

test("guidance-only entry receives Sigma, Splunk, and Elastic rules", async () => {
  const directory = mkdtempSync(join(tmpdir(), "openattacks-detections-"));
  const file = join(directory, "guidance-only.yaml");
  writeFileSync(file, readFileSync(join(fixtureDir, "guidance-only.yaml")));
  const seen = [];
  const client = await startDetectionClient({
    command: process.execPath,
    args: [join(fixtureDir, "mock-mcp.mjs")],
    env: process.env,
    timeoutMs: 5000,
  });
  try {
    const result = await enrichFile(file, {
      client,
      roots,
      names: new Map([["AML.T0011", "Persistence"]]),
      readUrl: async (url) => {
        seen.push(url);
        return { status: 200, body: "logsource:\n  product: macos\n" };
      },
    });
    assert.deepEqual(
      result.added.map((rule) => rule.format),
      ["sigma", "splunk", "elastic"],
    );
    assert.equal(
      seen.some((url) => url.includes("/windows/")),
      false,
    );
    const written = parse(readFileSync(file, "utf8"));
    assert.equal(written.detections[0].format, "guidance");
    assert.deepEqual(
      written.detections.slice(1).map((rule) => rule.name),
      [
        "Persistence Via PlistBuddy",
        "MacOS LaunchAgent Persistence",
        "Launch Agent Persistence",
      ],
    );
    const config = await prettier.resolveConfig(file);
    assert.equal(
      await prettier.check(readFileSync(file, "utf8"), {
        ...config,
        filepath: file,
      }),
      true,
    );
    const validation = await validateFile(file, { readUrl: ok });
    assert.deepEqual(validation.issues, []);
    const again = await enrichFile(file, {
      client,
      roots,
      names: new Map(),
      readUrl: ok,
    });
    assert.equal(again.added.length, 0);
    console.log(
      `guidance-only.yaml rules: ${written.detections
        .slice(1)
        .map((rule) => `${rule.format} ${rule.url}`)
        .join("\n")}`,
    );
  } finally {
    await client.close();
    rmSync(directory, { recursive: true, force: true });
  }
});

test("ATT&CK ids do not include ATLAS technique suffixes", () => {
  assert.deepEqual(
    attackTechniqueIds({
      atlas_techniques: [{ id: "AML.T0011" }],
      technique_summary: "Uses T1543.001 on macOS",
    }),
    ["T1543.001"],
  );
});

test("rule selection is deterministic and drops conflicting platforms", () => {
  const entry = parse(
    readFileSync(join(fixtureDir, "guidance-only.yaml"), "utf8"),
  );
  assert.deepEqual([...entryPlatforms(entry)], ["macos"]);
  const rows = [
    {
      row: {
        id: "b",
        name: "B",
        source_type: "elastic",
        platforms: ["macos"],
        file_path: "/opt/elastic/rules/macos/b.toml",
      },
      score: 2,
      reasons: ["T1543.001"],
    },
    {
      row: {
        id: "a",
        name: "A",
        source_type: "sigma",
        platforms: ["windows"],
        file_path: "/opt/sigma/rules/windows/a.yml",
      },
      score: 3,
      reasons: ["T1543.001"],
    },
    {
      row: {
        id: "c",
        name: "C",
        source_type: "sigma",
        platforms: ["macos"],
        file_path: "/opt/sigma/rules/macos/c.yml",
      },
      score: 2,
      reasons: ["fixture-ioc-9f3a2c.example"],
    },
  ];
  const selected = selectRules(entry, rows, roots, 5);
  assert.deepEqual(
    selected.map((rule) => rule.name),
    ["C", "B"],
  );
  assert.deepEqual(selectRules(entry, rows.reverse(), roots, 5), selected);
});

test("writing detections preserves YAML anchors", async () => {
  const directory = mkdtempSync(join(tmpdir(), "openattacks-anchor-"));
  const file = join(directory, "anchor.yaml");
  writeFileSync(
    file,
    "id: anchor\nsources:\n  - url: &report https://example.org/report\ntechnique_summary: Cited in *report\ndetections:\n  - name: Guidance\n    format: guidance\n    notes: keep\n",
  );
  await writeDetections(file, [
    { name: "Guidance", format: "guidance", notes: "keep" },
    {
      name: "Launch agent",
      format: "sigma",
      url: "https://example.org/rules/macos/launch.yml",
      notes: "Matched T1543.001 with security-detections-mcp.",
    },
  ]);
  const raw = readFileSync(file, "utf8");
  assert.match(raw, /&report/);
  assert.match(raw, /\*report/);
  const config = await prettier.resolveConfig(file);
  assert.equal(await prettier.check(raw, { ...config, filepath: file }), true);
  rmSync(directory, { recursive: true, force: true });
});

test("the workflow stays read-only and publishes suggestions as an artifact", () => {
  const source = readFileSync(
    fileURLToPath(
      new URL("../.github/workflows/attack-detections.yml", import.meta.url),
    ),
    "utf8",
  );
  assert.match(source, /^on:\n {2}pull_request:/m);
  assert.equal(source.includes("pull_request_target"), false);
  assert.match(source, /actions\/cache@v4/);
  assert.match(source, /actions\/upload-artifact@v4/);
  assert.match(source, /date -u \+%G-W%V/);
  assert.match(source, /permissions:\n {2}contents: read/);
  assert.match(source, /persist-credentials: false/);
  assert.equal(/secrets\.[A-Z0-9_]+/.test(source), false);
  assert.equal(/git push|createComment/.test(source), false);
});

test(
  "security-detections-mcp index fills a guidance-only entry",
  { skip: !process.env.DETECTION_MCP_INTEGRATION, timeout: 300000 },
  async () => {
    const directory = mkdtempSync(join(tmpdir(), "openattacks-mcp-"));
    const rules = join(directory, "rules", "macos");
    mkdirSync(rules, { recursive: true });
    writeFileSync(
      join(rules, "fixture.yml"),
      `title: Fixture macOS LaunchAgent Rule
id: 11111111-1111-4111-8111-111111111111
status: stable
description: Matches fixture-ioc-9f3a2c
logsource:
  category: file_event
  product: macos
detection:
  selection:
    TargetFilename|contains: /Library/LaunchAgents/fixture-ioc-9f3a2c.plist
  condition: selection
level: medium
tags:
  - attack.persistence
  - attack.t1543.001
`,
    );
    const attack = join(directory, "guidance-only.yaml");
    writeFileSync(attack, readFileSync(join(fixtureDir, "guidance-only.yaml")));
    const db = join(directory, "detections.sqlite");
    const client = await startDetectionClient({
      env: {
        ...process.env,
        SIGMA_PATHS: join(directory, "rules"),
        SPLUNK_PATHS: "",
        ELASTIC_PATHS: "",
        DETECTIONS_DB_PATH: db,
      },
      timeoutMs: 240000,
    });
    try {
      const result = await enrichFile(attack, {
        client,
        roots: [
          {
            root: join(directory, "rules"),
            urlBase: "https://example.org/sigma/rules/",
          },
        ],
        names: new Map([["AML.T0011", "User Execution"]]),
        readUrl: async () => ({ status: 200, body: "product: macos\n" }),
      });
      assert.equal(result.added.length > 0, true);
      assert.equal(
        result.added.some(
          (rule) => rule.name === "Fixture macOS LaunchAgent Rule",
        ),
        true,
      );
      console.log(
        `indexed rules: ${result.added.map((rule) => rule.name).join(", ")}`,
      );
    } finally {
      await client.close();
      rmSync(directory, { recursive: true, force: true });
    }
  },
);
