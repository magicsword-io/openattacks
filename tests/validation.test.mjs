import test from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { parse, stringify } from "yaml";
import { entryErrors } from "../src/lib/schema.mjs";
import { readCatalog } from "../scripts/lib/catalog.mjs";

const sample = parse(
  readFileSync(
    new URL(
      "../attacks/arup-deepfake-video-fraud-2024-01.yaml",
      import.meta.url,
    ),
    "utf8",
  ),
);

test("published URL fields reject non-web schemes, credentials, whitespace and private destinations", () => {
  for (const url of [
    "javascript:alert(1)",
    "file:///etc/passwd",
    "ftp://example.org/report",
    "https://user:secret@example.org/report",
    "https://example.org/a b",
    "https://example.org\\report",
    "http://localhost/report",
    "http://127.1/report",
    "http://10.0.0.1/report",
    "http://[::1]/report",
    "http://[::ffff:127.0.0.1]/report",
    "http://metadata.google.internal/report",
  ]) {
    const entry = structuredClone(sample);
    entry.sources[0].url = url;
    assert.ok(entryErrors(entry, `${entry.id}.yaml`).length, url);
  }
  for (const url of [
    "https://example.org/report?q=1#section",
    "http://example.org/report",
  ])
    assert.equal(
      entryErrors(
        { ...sample, magicsword_coverage: [url] },
        `${sample.id}.yaml`,
      ).length,
      0,
      url,
    );
  for (const change of [
    (entry) => {
      entry.magicsword_coverage = ["javascript:alert(1)"];
    },
    (entry) => {
      entry.attack_flow.nodes[0].source_urls = ["file:///tmp/report"];
    },
    (entry) => {
      entry.atlas_techniques = [
        {
          id: "AML.T0000",
          rationale: "test",
          source_urls: ["ftp://example.org/report"],
        },
      ];
    },
  ]) {
    const entry = structuredClone(sample);
    change(entry);
    assert.ok(entryErrors(entry, `${entry.id}.yaml`).length);
  }
});

test("duplicate source URLs fail while distinct reports from the same publisher remain valid", () => {
  const entry = structuredClone(sample);
  entry.sources.push({ ...entry.sources[0], title: "A different title" });
  assert.match(
    entryErrors(entry, `${entry.id}.yaml`).join("\n"),
    /source URLs must be unique/,
  );
  entry.sources[entry.sources.length - 1].url =
    "https://example.org/another-report";
  assert.deepEqual(entryErrors(entry, `${entry.id}.yaml`), []);
});

test("catalog validation rejects duplicate YAML keys and merge markers inside text blocks", (t) => {
  const directory = mkdtempSync(join(tmpdir(), "openattacks-validation-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  const filename = `${sample.id}.yaml`;
  writeFileSync(
    join(directory, filename),
    `${stringify(sample)}name: Duplicate name\n`,
  );
  assert.match(readCatalog(directory).errors.join("\n"), /unique|same key/i);
  for (const marker of [
    "<<<<<<< HEAD",
    "=======",
    ">>>>>>> incoming",
    "||||||| base",
  ]) {
    writeFileSync(
      join(directory, filename),
      `${stringify(sample)}source_notes: |\n  ${marker}\n`,
    );
    assert.match(
      readCatalog(directory).errors.join("\n"),
      /merge conflict marker/,
    );
  }
  writeFileSync(join(directory, filename), stringify(sample));
  assert.deepEqual(readCatalog(directory).errors, []);
  writeFileSync(join(directory, "duplicate.yaml"), stringify(sample));
  const errors = readCatalog(directory).errors.join("\n");
  assert.match(errors, /id must match the filename/);
  assert.match(errors, /duplicate id/);
});

test("empty catalogs and non-object YAML fail cleanly", (t) => {
  const directory = mkdtempSync(join(tmpdir(), "openattacks-empty-"));
  t.after(() => rmSync(directory, { recursive: true, force: true }));
  assert.match(readCatalog(directory).errors.join("\n"), /no YAML entries/);
  writeFileSync(join(directory, "empty.yaml"), "null\n");
  assert.match(readCatalog(directory).errors.join("\n"), /must be object/);
});
