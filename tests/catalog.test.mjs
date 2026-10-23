import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { parse } from "yaml";
import { entryErrors } from "../src/lib/schema.mjs";
import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

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
  for (const entry of seeds) assert.ok(validate(entry), JSON.stringify(validate.errors));
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
