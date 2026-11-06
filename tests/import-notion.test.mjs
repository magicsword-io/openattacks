import test from "node:test";
import assert from "node:assert/strict";
import {
  convertRow,
  slugFor,
  splitTopLevel,
} from "../scripts/import-notion.mjs";
import { entryErrors } from "../src/lib/schema.mjs";

const row = (overrides = {}) => ({
  Headline: "Vendor: actor ran AI agents against banks",
  Summary: "An actor used AI agents to breach several banks.",
  Source: "Example Research",
  URL: "https://example.org/report",
  "Other coverage":
    "https://news.example.com/a, not-a-url, https://example.org/report/",
  "Targeted AI / Vendor": "Claude Code; DeepSeek",
  "Threat Actor": "EXAMPLE PANDA",
  Attribution: '["China"]',
  "Actor Type": "Nation-state",
  Techniques: '["Phishing / social eng.","Agentic operations"]',
  Sectors: '["Finance","Tech / AI"]',
  Confidence: "Confirmed",
  Severity: "High",
  Published: "2026-10-29",
  Novelty: "Evolution",
  ...overrides,
});

test("a Notion row converts to a schema-valid entry with mapped fields", () => {
  const { entry, error } = convertRow(row(), new Set());
  assert.equal(error, undefined);
  assert.deepEqual(entryErrors(entry, `${entry.id}.yaml`), []);
  assert.equal(entry.id, "vendor-actor-ran-ai-agents-against-2026-10");
  assert.equal(entry.ai_role, "attacker_uses_ai_as_operator");
  assert.equal(entry.ai_involvement_confidence, "confirmed");
  assert.deepEqual(entry.ai_tooling_and_models, ["Claude Code", "DeepSeek"]);
  assert.equal(
    entry.victims_and_sectors,
    "Finance; Technology and AI companies",
  );
  // Invalid and duplicate coverage links are dropped.
  assert.deepEqual(
    entry.sources.map((s) => s.url),
    ["https://example.org/report", "https://news.example.com/a"],
  );
  assert.deepEqual(entry.attribution, {
    actor_name: "EXAMPLE PANDA",
    country: "China",
    motivation: "nation-state",
  });
});

test("actor attribution never becomes a victim region", () => {
  const { entry } = convertRow(row(), new Set());
  assert.deepEqual(entry.regions, ["unknown"]);
});

test("technique precedence picks the role; untagged rows become other", () => {
  const role = (techniques) =>
    convertRow(row({ Techniques: JSON.stringify(techniques) }), new Set()).entry
      .ai_role;
  assert.equal(role(["Malware / tooling dev"]), "llm_generated_malware");
  assert.equal(
    role(["Deepfake / voice", "API key / account abuse"]),
    "ai_credential_theft",
  );
  assert.equal(role(["Influence ops"]), "other");
  assert.equal(role([]), "other");
});

test("unverified, undated and bad-URL rows are rejected, not written", () => {
  assert.match(
    convertRow(row({ Confidence: "Claimed / unverified" }), new Set()).error,
    /not imported/,
  );
  assert.match(
    convertRow(row({ Published: null }), new Set()).error,
    /Published/,
  );
  assert.match(
    convertRow(row({ URL: "http://localhost/x" }), new Set()).error,
    /public hostname/,
  );
});

test("research demonstrations are marked borderline with a note", () => {
  const { entry } = convertRow(
    row({ "Actor Type": "Researcher / PoC" }),
    new Set(),
  );
  assert.equal(entry.borderline, true);
  assert.ok(entry.borderline_note);
});

test("slugs stay unique within a batch", () => {
  const taken = new Set();
  assert.equal(
    slugFor("Same title", "2026-10-01", taken),
    "same-title-2026-10",
  );
  assert.equal(
    slugFor("Same title", "2026-10-01", taken),
    "same-title-2026-10-2",
  );
});

test("tool lists split on semicolons outside parentheses only", () => {
  assert.deepEqual(
    splitTopLevel(
      "OpenAI API (default gpt-4; victim key when present); Claude",
    ),
    ["OpenAI API (default gpt-4; victim key when present)", "Claude"],
  );
  const { entry } = convertRow(
    row({ "Targeted AI / Vendor": "A (x; y); B" }),
    new Set(),
  );
  assert.deepEqual(entry.ai_tooling_and_models, ["A (x; y)", "B"]);
});

test("a described but unnamed actor is not recorded as an actor name", () => {
  const { entry } = convertRow(
    row({ "Threat Actor": "Unnamed (operators of the NIK C2 framework)" }),
    new Set(),
  );
  assert.equal(entry.attribution.actor_name, undefined);
  assert.equal(
    entry.attribution_or_cluster,
    "Unnamed (operators of the NIK C2 framework)",
  );
  const bare = convertRow(row({ "Threat Actor": "Unnamed" }), new Set()).entry;
  assert.equal(bare.attribution_or_cluster, "unknown");
});
