import assert from "node:assert/strict";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve, join } from "node:path";
import { fileURLToPath } from "node:url";
import { parseDocument } from "yaml";

const root = fileURLToPath(new URL("../", import.meta.url));
export const formats = { sigma: "sigma.yml", kql: "kql", spl: "spl" };

function yaml(file) {
  const document = parseDocument(readFileSync(file, "utf8"), {
    uniqueKeys: true,
  });
  assert.equal(
    document.errors.length,
    0,
    `${file}: ${document.errors.join("; ")}`,
  );
  return document.toJS();
}

export function buildCatalog(base = root) {
  const profiles = {};
  for (const file of readdirSync(join(base, "detections"))
    .filter((f) => f.endsWith(".yaml"))
    .sort()) {
    const definition = yaml(join(base, "detections", file));
    const { id } = definition;
    assert.match(id, /^[a-z][a-z0-9-]*$/, `${file}: invalid ID`);
    assert.equal(file, `${id}.yaml`, `${file}: ID must match filename`);
    assert(!Object.hasOwn(profiles, id), `${file}: duplicate profile`);
    for (const field of [
      "title",
      "hypothesis",
      "visibility",
      "limitation",
      "query_scope",
    ])
      assert.equal(
        typeof definition[field],
        "string",
        `${id}: missing ${field}`,
      );
    for (const field of ["telemetry", "investigate", "search"])
      assert(
        Array.isArray(definition[field]) &&
          definition[field].every((v) => typeof v === "string"),
        `${id}: invalid ${field}`,
      );
    assert.equal(
      definition.origin,
      "catalog_authored",
      `${id}: unsupported origin`,
    );
    assert(
      ["native", "custom_schema", "gap"].includes(definition.query_kind),
      `${id}: invalid query kind`,
    );
    if (definition.query_kind === "gap") {
      assert.equal(
        definition.queries,
        null,
        `${id}: evidence gaps cannot contain queries`,
      );
    } else {
      assert.match(
        definition.reviewed,
        /^\d{4}-\d{2}-\d{2}$/,
        `${id}: missing review date`,
      );
      assert.deepEqual(
        Object.keys(definition.queries || {}).sort(),
        Object.keys(formats).sort(),
        `${id}: missing query formats`,
      );
      for (const format of Object.keys(formats))
        assert(
          typeof definition.queries[format] === "string" &&
            definition.queries[format].trim(),
          `${id}: empty ${format}`,
        );
      const sigma = parseDocument(definition.queries.sigma, {
        uniqueKeys: true,
      });
      assert.equal(sigma.errors.length, 0, `${id}: invalid Sigma YAML`);
      const rule = sigma.toJS();
      assert.equal(
        rule.status,
        "experimental",
        `${id}: catalog queries must remain experimental`,
      );
      assert(
        rule.id && rule.logsource && rule.detection?.condition,
        `${id}: incomplete Sigma rule`,
      );
      if (definition.query_kind === "custom_schema") {
        assert.equal(
          rule.logsource.product,
          "openattacks_audit",
          `${id}: custom Sigma source required`,
        );
        assert(
          definition.queries.kql.includes("OpenAttacksAudit_CL"),
          `${id}: custom KQL source required`,
        );
        assert(
          definition.queries.spl.includes('sourcetype="openattacks:audit"'),
          `${id}: custom SPL source required`,
        );
      }
    }
    profiles[id] = definition;
  }
  assert(Object.keys(profiles).length, "No detection definitions found");
  const stages = JSON.parse(
    readFileSync(join(base, "detections/stages.json"), "utf8"),
  );
  const attacks = readdirSync(join(base, "attacks"))
    .filter((f) => f.endsWith(".yaml"))
    .map((f) => yaml(join(base, "attacks", f)));
  const ids = new Set(attacks.map((a) => a.id));
  for (const id of Object.keys(stages))
    assert(ids.has(id), `Stale detection attack: ${id}`);
  for (const attack of attacks) {
    const nodes = attack.attack_flow?.nodes || [
      { id: "entry" },
      { id: "activity" },
      { id: "ai" },
    ];
    assert(
      stages[attack.id],
      `${attack.id}: add stage mappings (use an explicit gap if needed)`,
    );
    assert.deepEqual(
      Object.keys(stages[attack.id]).sort(),
      nodes.map((n) => n.id).sort(),
      `${attack.id}: missing or stale stage mapping`,
    );
    for (const [node, mapping] of Object.entries(stages[attack.id])) {
      assert(
        Object.hasOwn(profiles, mapping.profile),
        `${attack.id}/${node}: unknown detection profile ${mapping.profile}`,
      );
      if (mapping.control)
        assert(mapping.scope, `${attack.id}/${node}: unscoped policy control`);
    }
  }
  return { version: 1, profiles };
}

export function generate({ base = root, check = false } = {}) {
  const output = JSON.stringify(buildCatalog(base), null, 2) + "\n";
  const destination = join(base, "detections/catalog.json");
  if (check)
    assert.equal(
      readFileSync(destination, "utf8"),
      output,
      "Detection catalog drift: run npm run detections:build",
    );
  else writeFileSync(destination, output);
}

if (
  process.argv[1] &&
  resolve(process.argv[1]) === fileURLToPath(import.meta.url)
) {
  try {
    assert(
      process.argv.slice(2).every((arg) => arg === "--check") &&
        process.argv.length <= 3,
      "Usage: node scripts/build-detections.mjs [--check]",
    );
    generate({ check: process.argv.includes("--check") });
    console.log("Detection definitions and every attack stage validated.");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
