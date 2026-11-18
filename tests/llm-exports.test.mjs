import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { parse } from "yaml";
import Ajv2020 from "ajv/dist/2020.js";
import addFormats from "ajv-formats";
import {
  approximateTokens,
  buildOutputs,
  categoryKey,
  freshnessErrors,
  generatedAt,
  monthKey,
  readCommitted,
} from "../scripts/build-llm-exports.mjs";

const files = readdirSync(new URL("../attacks/", import.meta.url)).filter((name) =>
  name.endsWith(".yaml"),
);
const seeds = files.map((file) =>
  parse(readFileSync(new URL(`../attacks/${file}`, import.meta.url), "utf8")),
);
const outputs = buildOutputs();

function stamp(entries) {
  let max = "0000-00-00";
  for (const entry of entries) {
    for (const value of [entry.last_reviewed, entry.date_reported]) {
      if (!value) continue;
      const day = value.length === 7 ? `${value}-01` : value.slice(0, 10);
      if (day > max) max = day;
    }
  }
  return `${max}T00:00:00.000Z`;
}

test("token estimate is ceil(chars / 4)", () => {
  assert.equal(approximateTokens(""), 0);
  assert.equal(approximateTokens("abcd"), 1);
  assert.equal(approximateTokens("abcde"), 2);
});

test("staleness check accepts the generator output and rejects drift", () => {
  assert.deepEqual(freshnessErrors(outputs, outputs), []);
  const drifted = new Map(outputs);
  drifted.set("llms.txt", `${outputs.get("llms.txt")}drift\n`);
  assert.ok(freshnessErrors(outputs, drifted).includes("stale llms.txt"));
  const missing = new Map(outputs);
  missing.delete("llms-full.txt");
  assert.ok(freshnessErrors(outputs, missing).includes("missing llms-full.txt"));
  const extra = new Map(outputs);
  extra.set("llms/attacks/not-a-real-attack.md", "# no\n");
  assert.ok(
    freshnessErrors(outputs, extra).includes("unexpected llms/attacks/not-a-real-attack.md"),
  );
});

test("committed LLM exports match the generator", () => {
  assert.deepEqual(freshnessErrors(outputs, readCommitted()), []);
});

test("index, bundles, and JSON cover every attack exactly once", () => {
  const guide = outputs.get("llms.txt");
  const full = outputs.get("llms-full.txt");
  const catalog = JSON.parse(outputs.get("data/attacks.json"));
  assert.equal(catalog.count, seeds.length);
  assert.equal(catalog.attacks.length, seeds.length);
  assert.equal(catalog.generated_at, stamp(seeds));
  assert.equal(catalog.generated_at, generatedAt(seeds));
  assert.equal(Object.keys(catalog).join(","), "generated_at,count,attacks");
  assert.ok(!JSON.stringify(catalog).includes("typefully"));
  assert.ok(guide.startsWith("# OpenAttacks\n\n> "));
  assert.ok(guide.includes(`${seeds.length} reported`));
  assert.ok(full.includes(`${seeds.length} entries`));
  assert.ok(guide.indexOf("## Catalog\n") < guide.indexOf("## Attacks\n"));
  assert.ok(guide.includes("## Optional\n"));
  for (const path of [
    "/api/attacks.json",
    "/patterns/",
    "/actors/",
    "/skills/openattacks/SKILL.md",
    "/downloads/openattacks-skill.zip",
    "/rss.xml",
    "/sitemap-index.xml",
    "/llms-full.txt",
    "/api/catalog.json",
  ]) {
    assert.ok(guide.includes(path), path);
  }
  assert.ok(full.includes("/skills/openattacks/SKILL.md"));
  assert.ok(guide.includes("/api/relevance.json"));
  assert.ok(guide.includes("/data/attacks.json"));

  const guideLines = guide.split("\n");
  for (const seed of seeds) {
    const { typefully, ...expected } = seed;
    assert.deepEqual(
      catalog.attacks.find((attack) => attack.id === seed.id),
      expected,
    );
    const line = guideLines.find((item) => item.includes(`/llms/attacks/${seed.id}.md`));
    assert.ok(line, seed.id);
    assert.equal(line.startsWith("- ["), true);
    assert.ok(line.includes(seed.date_reported));
    assert.ok(line.includes(categoryKey(seed)));
    const doc = outputs.get(`llms/attacks/${seed.id}.md`);
    assert.ok(doc.includes(`- ID: ${seed.id}`));
    assert.ok(doc.includes("## Summary"));
    assert.ok(doc.includes("## Category"));
    assert.ok(doc.includes("## Attribution"));
    assert.ok(doc.includes("## AI involvement confidence"));
    assert.ok(doc.includes("## Scope and targeting"));
    assert.ok(doc.includes("## Attack flow"));
    assert.ok(doc.includes("## MITRE ATLAS"));
    assert.ok(doc.includes("## Prevention"));
    assert.ok(doc.includes("## Detections"));
    assert.ok(doc.includes("## Timeline"));
    assert.ok(doc.includes("## Tools"));
    if (seed.frameworks?.length) {
      assert.ok(doc.includes("### Offensive frameworks"), seed.id);
      assert.ok(line.includes(`frameworks: ${seed.frameworks.join(", ")}`), seed.id);
      for (const id of seed.frameworks) {
        assert.ok(doc.includes(`/tools/${id}/`), `${seed.id} ${id}`);
        assert.ok(outputs.has(`llms/by-framework/${id}.md`));
      }
    } else {
      assert.equal(doc.includes("### Offensive frameworks"), false, seed.id);
    }
    assert.ok(doc.includes("## Source notes"));
    assert.ok(doc.includes("## Sources"));
    for (const source of seed.sources) assert.ok(doc.includes(source.url));
    assert.ok(full.includes(doc.trimEnd()));
    const category = outputs.get(`llms/by-category/${categoryKey(seed)}.md`);
    const month = outputs.get(`llms/by-month/${monthKey(seed.date_reported)}.md`);
    assert.ok(category.includes(doc.trimEnd()));
    assert.ok(month.includes(doc.trimEnd()));
  }
  assert.ok(
    outputs
      .get("llms/attacks/ai-cloned-lawyers-voice-helps-fraudsters-2026-09.md")
      .includes("not yet editorially reviewed"),
  );
});

test("export schema accepts the generated catalog", () => {
  const schema = JSON.parse(outputs.get("data/attacks.schema.json"));
  const catalog = JSON.parse(outputs.get("data/attacks.json"));
  const ajv = new Ajv2020({ strict: true, allErrors: true });
  addFormats(ajv);
  const validate = ajv.compile(schema);
  assert.equal(validate(catalog), true, JSON.stringify(validate.errors));
  assert.equal(schema.required.join(","), "generated_at,count,attacks");
  assert.equal(schema.additionalProperties, false);
  assert.equal(schema.properties.attacks.items.properties.typefully, undefined);
});

test("the site build serves the committed export bytes", () => {
  const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), "utf8");
  for (const path of [
    "llms.txt",
    "llms-full.txt",
    "data/attacks.json",
    "data/attacks.schema.json",
  ]) {
    assert.equal(read(`dist/${path}`), outputs.get(path), path);
  }
  for (const seed of seeds) {
    const path = `llms/attacks/${seed.id}.md`;
    assert.equal(read(`dist/${path}`), outputs.get(path), path);
    const category = `llms/by-category/${categoryKey(seed)}.md`;
    const month = `llms/by-month/${monthKey(seed.date_reported)}.md`;
    assert.equal(read(`dist/${category}`), outputs.get(category));
    assert.equal(read(`dist/${month}`), outputs.get(month));
  }
  for (const path of outputs.keys()) {
    if (path.startsWith("llms/by-framework/"))
      assert.equal(read(`dist/${path}`), outputs.get(path), path);
  }
});
