import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import {
  matchStack,
  normalizeSelection,
  selectionFromURL,
  selectionURL,
  stackTools,
  stackSystems,
  relationships,
} from "../src/lib/stack-matching.mjs";
const read = (path) =>
  JSON.parse(readFileSync(new URL(path, import.meta.url), "utf8"));
const index = read("../dist/api/relevance.json");
const attacks = read("../dist/api/attacks.json");
const annotations = read("../src/data/applicability.json");
const find = (selection) => matchStack(index.entries, selection);
const ids = (selection) => find(selection).map((match) => match.entry.id);

test("relevance exports every record; annotations use real tools, stages and original evidence", () => {
  assert.deepEqual(
    index.entries.map((entry) => entry.id).sort(),
    attacks.map((entry) => entry.id).sort(),
  );
  assert.equal(index.coverage.total, attacks.length);
  assert.equal(
    index.coverage.mapped,
    index.entries.filter((entry) => entry.relevance.status === "mapped").length,
  );
  for (const id of Object.keys(annotations))
    assert.ok(
      attacks.some((attack) => attack.id === id),
      `Stale annotation ${id}`,
    );
  for (const entry of index.entries) {
    const attack = attacks.find((attack) => attack.id === entry.id);
    assert.equal(entry.qualification, attack.borderline_note || null);
    assert.deepEqual(
      entry.source_urls,
      attack.sources.map((source) => source.url),
    );
    assert.ok(
      ["mapped", "not_assessed", "attacker_tool_only"].includes(
        entry.relevance.status,
      ),
    );
    if (entry.relevance.status !== "mapped") {
      assert.deepEqual(entry.relevance.rules, []);
      assert.equal(entry.policy, null);
      continue;
    }
    assert.ok(entry.action && entry.stage_url && entry.relevance.rules.length);
    assert.ok(
      attack.attack_flow.nodes.some(
        (node) => node.id === entry.relevance.stage_id,
      ),
    );
    for (const rule of entry.relevance.rules) {
      assert.ok(
        rule.tools.every((id) => stackTools.some((tool) => tool.id === id)),
      );
      assert.ok(
        rule.systems.every((id) =>
          stackSystems.some((system) => system.id === id),
        ),
      );
      assert.ok(relationships[rule.relationship]);
      assert.equal(typeof rule.mcp, "boolean");
      assert.ok(rule.tools.length || rule.systems.length || rule.mcp);
      assert.ok(
        rule.reason && rule.conditions.length && rule.source_urls.length,
      );
      assert.ok(
        rule.source_urls.every((url) =>
          attack.sources.some((source) => source.url === url),
        ),
      );
    }
    if (entry.policy) {
      assert.match(entry.policy.scope, /Windows/);
      assert.match(entry.policy.limitation, /enforcement/);
    }
    if (entry.hunt_url)
      assert.ok(entry.hunt_url.includes("view=hunt#attack-flow"));
  }
});
test("attacker-side Claude and Gemini use never becomes a product-exposure match", () => {
  const selected = ids({
    tools: ["claude-code", "claude", "gemini"],
    mcp: "no",
  });
  for (const id of [
    "gtg-1002-anthropic-claude-code-espionage-2025-11",
    "gtg-2002-vibe-hacking-extortion-2025-08",
    "cairn-norforge-2026-10",
    "apt41-gemini-c2-osstun-2025-08",
    "anthropic-novice-malware-builder-2025-03",
  ])
    assert.ok(!selected.includes(id), id);
  assert.ok(selected.includes("ghostaction-ai-creds-2026-10"));
  assert.ok(selected.includes("s1ngularity-nx-ai-cli-2025-08"));
});
test("MCP=no excludes existing-MCP requirements; unknown retains explicit conditions", () => {
  const id = "cursor-mcpoison-cve-2025-54136";
  assert.ok(!ids({ tools: ["cursor"], mcp: "no" }).includes(id));
  const unknown = find({ tools: ["cursor"], mcp: "unknown" }).find(
    (match) => match.entry.id === id,
  );
  assert.ok(unknown);
  assert.ok(
    unknown.conditions.some((condition) =>
      condition.includes("have not confirmed"),
    ),
  );
  assert.ok(
    ids({ mcp: "yes" }).includes("invariant-mcp-tool-poisoning-2025-04"),
  );
  assert.ok(
    !ids({ mcp: "yes" }).includes(id),
    "Generic MCP use is not evidence of owning Cursor",
  );
  assert.deepEqual(find({ mcp: "unknown" }), []);
  assert.deepEqual(find({ mcp: "no" }), []);
});
test("OS scope narrows specific reports and multiple tools deduplicate each entry", () => {
  assert.ok(
    ids({ tools: ["claude"], systems: ["macos"] }).includes(
      "adception-claude-mac-2026-10",
    ),
  );
  assert.ok(
    !ids({ tools: ["claude"], systems: ["windows"] }).includes(
      "adception-claude-mac-2026-10",
    ),
  );
  assert.deepEqual(ids({ tools: ["grok"], systems: ["macos"] }), []);
  const combined = ids({ tools: ["cursor", "claude"], mcp: "yes" });
  assert.equal(new Set(combined).size, combined.length);
  assert.equal(
    combined.filter((id) => id === "apex-accelerator-ref8801-2026-10").length,
    1,
  );
});
test("selection URLs round trip, reject unknown values and preserve unrelated parameters", () => {
  const selection = normalizeSelection({
    tools: ["cursor", "cursor", "<script>", "claude-code"],
    systems: ["linux", "invented"],
    mcp: "unknown",
  });
  assert.deepEqual(selection.tools, ["cursor", "claude-code"]);
  assert.deepEqual(selection.systems, ["linux"]);
  const url = selectionURL(
    new URL("https://example.com/?utm_source=research#your-stack"),
    selection,
  );
  assert.deepEqual(selectionFromURL(url.searchParams), selection);
  assert.equal(url.searchParams.get("utm_source"), "research");
  assert.equal(url.hash, "#your-stack");
  assert.deepEqual(
    selectionFromURL(
      new URLSearchParams("tools=malicious&os=unknown&mcp=maybe"),
    ),
    normalizeSelection(),
  );
});
test("relevance reasons and conditions are discoverable in the LLM exports", () => {
  const guide = readFileSync(
    new URL("../dist/llms.txt", import.meta.url),
    "utf8",
  );
  const full = readFileSync(
    new URL("../dist/llms-full.txt", import.meta.url),
    "utf8",
  );
  assert.ok(guide.includes("/api/relevance.json"));
  assert.ok(full.includes("## Prevention"));
  assert.ok(full.includes("## AI involvement confidence"));
  for (const entry of index.entries) {
    const md = readFileSync(
      new URL(`../dist/api/attacks/${entry.id}.md`, import.meta.url),
      "utf8",
    );
    assert.ok(md.includes(entry.relevance.status.replaceAll("_", "\\_")));
    if (entry.relevance.status === "mapped")
      assert.ok(md.includes("Condition to check:"));
  }
});
