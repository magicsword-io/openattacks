import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import YAML from "yaml";
import {
  buildPewPew,
  canonicalCountry,
  countryRefs,
} from "../src/lib/country-refs.mjs";

const atlas = JSON.parse(
  readFileSync(
    new URL("../node_modules/world-atlas/countries-110m.json", import.meta.url),
    "utf8",
  ),
);
// Mirrors geography.ts: atlas names, its US alias, and hand-placed extras.
const known = new Set([
  ...atlas.objects.countries.geometries.map(({ properties: { name } }) =>
    name === "United States of America" ? "United States" : name,
  ),
  "Hong Kong",
  "Singapore",
]);
const dir = new URL("../attacks/", import.meta.url);
const attacks = readdirSync(dir)
  .filter((file) => file.endsWith(".yaml"))
  .map((file) => YAML.parse(readFileSync(new URL(file, dir), "utf8")));
const base = {
  id: "fixture",
  name: "Fixture",
  technique_summary: "",
  regions: ["unknown"],
  sources: [],
};

test("structured fields win over text mentions and aliases normalise", () => {
  const refs = countryRefs(
    {
      ...base,
      attribution: { country: "DPRK" },
      regions: ["United States", "Multiple regions"],
      technique_summary:
        "Infrastructure hosted in the U.S. and Singapore; North Korea again.",
    },
    known,
  );
  assert.deepEqual(refs, [
    { country: "North Korea", role: "origin" },
    { country: "United States", role: "target" },
    { country: "Singapore", role: "mentioned" },
  ]);
});

test("unknown, multi-country and ambiguous values never become countries", () => {
  assert.equal(canonicalCountry("Unknown", known), null);
  assert.equal(canonicalCountry("Multiple (27 countries)", known), null);
  const refs = countryRefs(
    {
      ...base,
      attribution: { country: "Unknown" },
      technique_summary:
        "Michael Jordan in Georgia told us about Chadwick and Indiana.",
    },
    known,
  );
  assert.deepEqual(refs, []);
});

test("reported arcs require an attributed origin and a reported target", () => {
  const { arcs } = buildPewPew(
    [
      {
        ...base,
        id: "a",
        attribution: { country: "Russia" },
        regions: ["Ukraine"],
        technique_summary: "Mentions Germany.",
      },
      { ...base, id: "b", technique_summary: "China and Japan." },
    ],
    known,
  );
  assert.deepEqual(arcs, [
    { id: "a", from: "Russia", to: "Ukraine", kind: "reported" },
    { id: "a", from: "Russia", to: "Germany", kind: "vibes" },
    { id: "b", from: "China", to: "Japan", kind: "vibes" },
  ]);
});

test("catalog index groups every referencing entry under each country", () => {
  const { countries, arcs, entries } = buildPewPew(attacks, known);
  assert.ok(entries.length > 0);
  for (const { country, refs } of countries) {
    assert.ok(known.has(country), `${country} must be placeable`);
    for (const { id } of refs)
      assert.ok(
        entries.find((e) => e.id === id).refs.some((r) => r.country === country),
      );
  }
  // Every reported arc is backed by the YAML: attribution.country -> regions.
  for (const arc of arcs.filter((a) => a.kind === "reported")) {
    const attack = attacks.find((a) => a.id === arc.id);
    assert.equal(canonicalCountry(attack.attribution.country, known), arc.from);
    assert.ok(attack.regions.includes(arc.to), `${arc.id} targets ${arc.to}`);
  }
  // APT28 PROMPTSTEAL is the canonical Russia -> Ukraine report.
  assert.ok(
    arcs.some(
      (a) =>
        a.id === "promptsteal-lamehug-apt28-2025-07" &&
        a.from === "Russia" &&
        a.to === "Ukraine" &&
        a.kind === "reported",
    ),
  );
});
