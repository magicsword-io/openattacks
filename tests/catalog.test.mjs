import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { parse } from "yaml";
import { entryErrors } from "../src/lib/schema.mjs";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";

const files = readdirSync(new URL("../attacks/", import.meta.url)).filter(
  (name) => name.endsWith(".yaml"),
);
const seeds = files.map((file) =>
  parse(readFileSync(new URL(`../attacks/${file}`, import.meta.url), "utf8")),
);
const sample = seeds[0];
test("all catalog entries validate and IDs are unique", () => {
  assert.ok(seeds.length > 0);
  files.forEach((filename, index) =>
    assert.deepEqual(entryErrors(seeds[index], filename), []),
  );
  assert.equal(new Set(seeds.map((entry) => entry.id)).size, seeds.length);
});
test("unknown fields and invalid enums fail with field-level errors", () => {
  assert.match(
    entryErrors({ ...sample, typo: true }, `${sample.id}.yaml`).join("\n"),
    /additional properties.*typo/,
  );
  assert.match(
    entryErrors({ ...sample, ai_role: "invented" }, `${sample.id}.yaml`).join(
      "\n",
    ),
    /ai_role/,
  );
  assert.match(
    entryErrors({ ...sample, confidence: "certain" }, `${sample.id}.yaml`).join(
      "\n",
    ),
    /confidence/,
  );
});
test("source URLs, missing sources, filename mismatch and dates are rejected", () => {
  assert.ok(
    entryErrors(
      { ...sample, sources: [{ url: "not-a-url" }] },
      `${sample.id}.yaml`,
    ).length,
  );
  assert.ok(
    entryErrors({ ...sample, sources: [] }, `${sample.id}.yaml`).length,
  );
  assert.ok(entryErrors(sample, "wrong.yaml").length);
  assert.ok(
    entryErrors({ ...sample, date_reported: "yesterday" }, `${sample.id}.yaml`)
      .length,
  );
  assert.ok(
    entryErrors({ ...sample, date_reported: "2026-02-31" }, `${sample.id}.yaml`)
      .length,
  );
  assert.ok(
    entryErrors({ ...sample, last_reviewed: "2026-02-31" }, `${sample.id}.yaml`)
      .length,
  );
  assert.equal(
    entryErrors({ ...sample, date_reported: "2026-10" }, `${sample.id}.yaml`)
      .length,
    0,
  );
});
test("built JSON exactly matches public YAML content and excludes internal tracking", () => {
  const output = JSON.parse(
    readFileSync(new URL("../dist/api/attacks.json", import.meta.url), "utf8"),
  );
  assert.equal(output.length, seeds.length);
  for (const seed of seeds) {
    const { typefully, ...expected } = seed;
    assert.deepEqual(
      output.find((entry) => entry.id === seed.id),
      expected,
    );
  }
  assert.ok(!JSON.stringify(output).includes('"typefully"'));
  assert.ok(!JSON.stringify(output).includes("typefully.com"));
  assert.ok(!JSON.stringify(output).includes('"not_yet_covered"'));
});

test("browse annotations preserve raw evidence and use valid, consistent categories", () => {
  const annotations = JSON.parse(
    readFileSync(
      new URL("../src/data/presentation.json", import.meta.url),
      "utf8",
    ),
  );
  const index = JSON.parse(
    readFileSync(new URL("../dist/api/catalog.json", import.meta.url), "utf8"),
  );
  assert.equal(index.entries.length, seeds.length);
  assert.equal(
    new Set(index.entries.map((entry) => entry.id)).size,
    seeds.length,
  );
  for (const id of Object.keys(annotations))
    assert.ok(
      seeds.some((entry) => entry.id === id),
      `Stale browse annotation: ${id}`,
    );
  for (const entry of seeds) {
    const display = index.entries.find((item) => item.id === entry.id);
    assert.ok(display, entry.id);
    assert.equal(display.reported, entry.date_reported);
    assert.equal(display.qualification, entry.borderline_note || null);
    assert.deepEqual(
      display.source_urls,
      entry.sources.map((source) => source.url),
    );
    assert.ok(
      index.evidence_types[display.evidence],
      `${entry.id}: unknown evidence class`,
    );
    assert.ok(display.environments.length > 0);
    assert.ok(display.environments.every((id) => index.environments[id]));
    assert.equal(
      new Set(display.environments).size,
      display.environments.length,
    );
    if (display.environments.includes("unspecified"))
      assert.deepEqual(display.environments, ["unspecified"]);
    assert.ok(display.title.trim() && display.summary.trim());
    assert.ok(display.summary.length <= 210);
    if (annotations[entry.id]) {
      for (const field of ["title", "summary", "environments", "evidence"])
        assert.deepEqual(display[field], annotations[entry.id][field]);
    } else {
      assert.equal(display.title, entry.name);
      assert.equal(
        display.evidence,
        entry.borderline ? "qualified" : "unclassified",
      );
      assert.deepEqual(display.environments, ["unspecified"]);
    }
  }
  const get = (id) => index.entries.find((entry) => entry.id === id);
  assert.equal(get("ghostaction-ai-creds-2026-10").evidence, "campaign");
  assert.ok(get("ghostaction-ai-creds-2026-10").qualification);
  assert.equal(get("cl-unk-1211-unit42-2026-10").evidence, "campaign");
  assert.equal(get("morris-ii-ai-worm-poc-2024-03").evidence, "research");
  assert.equal(get("wormgpt-underground-2023").evidence, "claim");
  const guide = readFileSync(
    new URL("../dist/llms.txt", import.meta.url),
    "utf8",
  );
  assert.ok(guide.includes("/api/catalog.json"));
});
test("build includes one page per entry, CSV and sitemap", () => {
  assert.equal(
    readdirSync(new URL("../dist/attacks/", import.meta.url)).length,
    seeds.length,
  );
  const csv = readFileSync(
    new URL("../dist/api/attacks.csv", import.meta.url),
    "utf8",
  );
  assert.ok(csv.startsWith("id,name,date_reported,"));
  assert.ok(csv.includes("cairn-norforge-2026-10"));
  assert.ok(!csv.includes("typefully"));
  assert.ok(
    readFileSync(
      new URL("../dist/sitemap-index.xml", import.meta.url),
      "utf8",
    ).includes("sitemap"),
  );
});

test("AI discovery, full context and per-entry exports include every YAML record", () => {
  const guide = readFileSync(
    new URL("../dist/llms.txt", import.meta.url),
    "utf8",
  );
  const full = readFileSync(
    new URL("../dist/llms-full.txt", import.meta.url),
    "utf8",
  );
  assert.ok(guide.includes(`${seeds.length} reported`));
  assert.ok(full.includes(`${seeds.length} entries`));
  for (const entry of seeds) {
    assert.ok(
      guide.includes(`/api/attacks/${entry.id}.md`),
      `Missing guide link for ${entry.id}`,
    );
    assert.ok(
      full.includes(`- ID: ${entry.id}`),
      `Missing context for ${entry.id}`,
    );
    const single = JSON.parse(
      readFileSync(
        new URL(`../dist/api/attacks/${entry.id}.json`, import.meta.url),
        "utf8",
      ),
    );
    const { typefully, ...expected } = entry;
    assert.deepEqual(single, expected);
    const markdown = readFileSync(
      new URL(`../dist/api/attacks/${entry.id}.md`, import.meta.url),
      "utf8",
    );
    for (const source of entry.sources)
      assert.ok(markdown.includes(source.url));
    for (const node of entry.attack_flow?.nodes || [])
      assert.ok(markdown.includes(node.id));
  }
  assert.ok(!guide.includes("typefully.com"));
  assert.ok(!full.includes("typefully.com"));
  const publicSchema = JSON.parse(
    readFileSync(new URL("../dist/api/schema.json", import.meta.url), "utf8"),
  );
  assert.ok(!publicSchema.properties.typefully);
  assert.ok(publicSchema.properties.attack_flow);
  const externalValidator = new Ajv2020({ strict: true });
  addFormats(externalValidator);
  const validate = externalValidator.compile(publicSchema);
  for (const entry of seeds)
    assert.ok(validate(entry), JSON.stringify(validate.errors));
});

test("flow validation rejects dangling edges, duplicate nodes and unlisted evidence", () => {
  const entry = structuredClone(sample);
  entry.attack_flow.edges[0].target = "missing-node";
  assert.match(
    entryErrors(entry, `${entry.id}.yaml`).join("\n"),
    /unknown source or target/,
  );
  entry.attack_flow.edges[0].target = entry.attack_flow.nodes[1].id;
  entry.attack_flow.nodes[1].id = entry.attack_flow.nodes[0].id;
  assert.match(
    entryErrors(entry, `${entry.id}.yaml`).join("\n"),
    /IDs must be unique/,
  );
  entry.attack_flow.nodes[0].source_urls = [
    "https://example.org/unlisted-evidence",
  ];
  assert.match(
    entryErrors(entry, `${entry.id}.yaml`).join("\n"),
    /sources must appear/,
  );
});

test("geography excludes actor and infrastructure labels; ATLAS mappings use official IDs", () => {
  assert.deepEqual(
    seeds.find((entry) => entry.id === "crowdstrike-artex-sk-finance-2026-10")
      .regions,
    ["South Korea"],
  );
  assert.deepEqual(
    seeds.find((entry) => entry.id === "arup-deepfake-video-fraud-2024-01")
      .regions,
    ["Hong Kong"],
  );
  assert.deepEqual(
    seeds.find((entry) => entry.id === "anyrun-fake-ai-tools-2026-10").regions,
    ["Multiple regions"],
  );
  assert.ok(
    entryErrors(
      { ...sample, regions: ["China-speaking actor"] },
      `${sample.id}.yaml`,
    ).length,
  );
  const atlas = JSON.parse(
    readFileSync(
      new URL("../src/data/atlas-techniques.json", import.meta.url),
      "utf8",
    ),
  );
  for (const entry of seeds)
    for (const mapping of entry.atlas_techniques || [])
      assert.ok(atlas.techniques[mapping.id], mapping.id);
});

test("stage defense annotations resolve to real attacks and nodes; exports preserve evidence and scope", () => {
  const annotations = JSON.parse(
    readFileSync(
      new URL("../detections/stages.json", import.meta.url),
      "utf8",
    ),
  );
  const packs = JSON.parse(
    readFileSync(new URL("../dist/api/defenses.json", import.meta.url), "utf8"),
  );
  assert.equal(packs.entries.length, seeds.length);
  for (const [id, stages] of Object.entries(annotations)) {
    const attack = seeds.find((a) => a.id === id);
    assert.ok(attack, `Stale attack annotation: ${id}`);
    for (const nodeId of Object.keys(stages))
      assert.ok(
        attack.attack_flow.nodes.some((n) => n.id === nodeId),
        `${id}: stale stage ${nodeId}`,
      );
  }
  for (const attack of seeds) {
    const pack = packs.entries.find((p) => p.attack_id === attack.id);
    const single = JSON.parse(
      readFileSync(
        new URL(`../dist/api/defenses/${attack.id}.json`, import.meta.url),
        "utf8",
      ),
    );
    assert.deepEqual(single.stages, pack.stages);
    if (attack.attack_flow)
      assert.deepEqual(single.attack_flow, attack.attack_flow);
    assert.ok(single.attack_flow.nodes.length > 0);
    assert.deepEqual(
      pack.stages.map((s) => s.node_id),
      single.attack_flow.nodes.map((n) => n.id),
    );
    for (const stage of pack.stages) {
      const node = single.attack_flow.nodes.find((n) => n.id === stage.node_id);
      assert.deepEqual(stage.evidence, node.source_urls);
      assert.ok(
        stage.evidence.every((url) =>
          attack.sources.some((source) => source.url === url),
        ),
      );
      if (stage.validation === "not_assessed")
        assert.equal(stage.reviewed, null);
      assert.match(
        stage.mcp_prompt,
        /Sigma, Microsoft Defender \/ Sentinel KQL, and Splunk SPL/,
      );
      assert.match(stage.mcp_prompt, /Do not invent matches/);
      if (stage.control) {
        assert.match(stage.control.scope, /Windows/);
        assert.match(stage.control.limitation, /not tested incident coverage/);
        assert.match(stage.control.limitation, /enforcement/);
        assert.equal(new URL(stage.control.url).hostname, "www.magicsword.io");
      }
      if (stage.queries) {
        assert.equal(stage.validation, "draft");
        const rule = parse(stage.queries.sigma);
        assert.equal(rule.status, "experimental");
        assert.ok(rule.logsource);
        assert.ok(Object.keys(rule.detection.selection).length);
        assert.equal(rule.detection.condition, "selection");
        assert.ok(stage.queries.kql.length && stage.queries.spl.length);
      } else
        assert.ok(
          ["not_assessed", "not_applicable"].includes(stage.validation),
        );
    }
  }
  const arup = packs.entries.find(
    (p) => p.attack_id === "arup-deepfake-video-fraud-2024-01",
  );
  assert.ok(arup.stages.every((s) => !s.control));
  const marketing = packs.entries.find(
    (p) => p.attack_id === "wormgpt-underground-2023",
  );
  assert.ok(
    marketing.stages.every(
      (s) => !s.queries && s.validation === "not_applicable",
    ),
  );
  const cairn = packs.entries.find(
    (p) => p.attack_id === "cairn-norforge-2026-10",
  );
  assert.equal(cairn.stages[0].validation, "not_assessed");
  assert.equal(cairn.stages[1].visibility, "Provider / operator records");
  const full = readFileSync(
    new URL("../dist/llms-full.txt", import.meta.url),
    "utf8",
  );
  assert.match(full, /Stage defense and hunting recommendations/);
});

test("script execution starters match encoded execution and exclude unrelated benign processes", () => {
  const packs = JSON.parse(
    readFileSync(new URL("../dist/api/defenses.json", import.meta.url), "utf8"),
  );
  const stage = packs.entries
    .find((p) => p.attack_id === "opencode-mcp-oauth-rce-2026-10")
    .stages.find((s) => s.node_id === "step-3");
  const { selection } = parse(stage.queries.sigma).detection;
  const matches = (event) =>
    Object.entries(selection).every(([field, values]) => {
      const [key, op] = field.split("|");
      return values.some((v) =>
        op === "endswith"
          ? (event[key] || "").toLowerCase().endsWith(v.toLowerCase())
          : (event[key] || "").toLowerCase().includes(v.toLowerCase()),
      );
    });
  assert.ok(
    matches({
      Image: "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
      CommandLine: "powershell.exe -EncodedCommand harmless-fixture",
    }),
  );
  assert.ok(
    !matches({
      Image: "C:\\Windows\\System32\\notepad.exe",
      CommandLine: "notepad readme.txt",
    }),
  );
  assert.ok(
    !matches({
      Image: "C:\\Windows\\System32\\WindowsPowerShell\\v1.0\\powershell.exe",
      CommandLine: "powershell.exe Get-Date",
    }),
  );
  const bedrock = packs.entries
    .find((p) => p.attack_id === "datadog-bedrock-key-testing-2025")
    .stages.find((s) => s.profile === "bedrock");
  assert.deepEqual(parse(bedrock.queries.sigma).detection.selection.eventName, [
    "ListFoundationModels",
    "GetFoundationModel",
  ]);
  assert.match(bedrock.limitation, /Do not assume default CloudTrail/);
});
