import test from "node:test";
import assert from "node:assert/strict";
import {
  cpSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parse, stringify } from "yaml";
import {
  buildCatalog,
  formats,
  generate,
} from "../scripts/build-detections.mjs";

const root = new URL("../", import.meta.url);
const read = (file) => readFileSync(new URL(file, root), "utf8");
const annotations = JSON.parse(read("detections/stages.json"));
const compiled = JSON.parse(read("detections/catalog.json"));
const packs = JSON.parse(read("dist/api/defenses.json")).entries;

test("every phase publishes its detection status; pages show only applicable queries", () => {
  assert.equal(packs.length, Object.keys(annotations).length);
  for (const pack of packs) {
    const page = read(`dist/attacks/${pack.attack_id}/index.html`);
    const queryStages = pack.stages.filter((stage) => stage.queries);
    assert.equal(page.includes('id="detections"'), queryStages.length > 0);
    assert.equal(
      page.includes('class="detection-available"'),
      queryStages.length > 0,
    );
    assert.equal(
      (page.match(/<details class="detection-stage"/g) || []).length,
      queryStages.length,
      pack.attack_id,
    );
    assert.deepEqual(
      pack.stages.map((s) => s.node_id).sort(),
      Object.keys(annotations[pack.attack_id]).sort(),
    );
    for (const stage of pack.stages) {
      assert.equal(
        page.includes(`id="detection-${stage.node_id}"`),
        !!stage.queries,
        `${pack.attack_id}/${stage.node_id}`,
      );
      assert.equal(stage.origin, "catalog_authored");
      assert.equal(
        stage.query_kind,
        compiled.profiles[stage.profile].query_kind,
      );
      assert.deepEqual(stage.queries, compiled.profiles[stage.profile].queries);
      if (stage.queries) assert.equal(stage.validation, "draft");
      else {
        assert.equal(stage.query_downloads, null);
        assert.equal(stage.query_kind, "gap");
      }
    }
  }
});

test("downloaded queries exactly match canonical definitions and API payloads", () => {
  assert.deepEqual(buildCatalog(), compiled);
  for (const profile of Object.values(compiled.profiles)) {
    if (!profile.queries) continue;
    const original = parse(read(`detections/${profile.id}.yaml`));
    for (const [format, extension] of Object.entries(formats)) {
      assert.equal(
        read(`dist/api/detections/${profile.id}.${extension}`),
        original.queries[format],
      );
      for (const stage of packs
        .flatMap((p) => p.stages)
        .filter((s) => s.profile === profile.id))
        assert.equal(stage.queries[format], original.queries[format]);
    }
  }
});

test("native collectors, custom schemas, and evidence gaps remain distinguishable", () => {
  const native = compiled.profiles["windows-shell"];
  const custom = compiled.profiles["agent-input"];
  assert.equal(native.query_kind, "native");
  assert.match(native.queries.kql, /DeviceProcessEvents/);
  assert.equal(custom.query_kind, "custom_schema");
  assert.match(custom.queries.kql, /SCHEMA TEMPLATE/);
  assert.match(custom.queries.kql, /agent.input.ingest/);
  assert.equal(compiled.profiles.unobserved.queries, null);
  const originalGaps = packs.find(
    (p) => p.attack_id === "wormgpt-underground-2023",
  );
  assert(originalGaps.stages.every((stage) => !stage.queries));
  const unknown = packs
    .find((p) => p.attack_id === "apt41-gemini-c2-osstun-2025-08")
    .stages.find((s) => s.node_id === "step-4");
  assert.equal(unknown.validation, "not_applicable");
  assert.equal(unknown.queries, null);
});

function scratch(run) {
  const base = mkdtempSync(join(tmpdir(), "openattacks-detections-"));
  try {
    for (const folder of ["attacks", "detections"])
      cpSync(new URL(folder, root), join(base, folder), { recursive: true });
    run(base);
  } finally {
    rmSync(base, { recursive: true, force: true });
  }
}

test("validation rejects missing phases, stale references and unknown profiles", () =>
  scratch((base) => {
    const file = join(base, "detections/stages.json");
    const stages = JSON.parse(readFileSync(file, "utf8"));
    const id = Object.keys(stages)[0];
    const node = Object.keys(stages[id])[0];
    const saved = stages[id][node];
    delete stages[id][node];
    writeFileSync(file, JSON.stringify(stages));
    assert.throws(() => buildCatalog(base), /missing or stale stage/);
    stages[id][node] = { ...saved, profile: "invented-profile" };
    writeFileSync(file, JSON.stringify(stages));
    assert.throws(() => buildCatalog(base), /unknown detection profile/);
    stages[id][node] = saved;
    stages["invented-attack"] = {};
    writeFileSync(file, JSON.stringify(stages));
    assert.throws(() => buildCatalog(base), /Stale detection attack/);
  }));

test("validation rejects fabricated gap queries, duplicate YAML keys and catalog drift", () =>
  scratch((base) => {
    const file = join(base, "detections/unobserved.yaml");
    const original = readFileSync(file, "utf8");
    const gap = parse(original);
    gap.queries = { sigma: "invented" };
    writeFileSync(file, stringify(gap));
    assert.throws(
      () => buildCatalog(base),
      /evidence gaps cannot contain queries/,
    );
    writeFileSync(file, original + "id: duplicate\n");
    assert.throws(() => buildCatalog(base), /Map keys must be unique/);
    writeFileSync(file, original);
    writeFileSync(join(base, "detections/catalog.json"), "{}\n");
    assert.throws(
      () => generate({ base, check: true }),
      /Detection catalog drift/,
    );
  }));
