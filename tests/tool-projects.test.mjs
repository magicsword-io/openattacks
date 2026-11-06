import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import { parse } from "yaml";
import registry from "../src/data/tool-projects.json" with { type: "json" };
import { toolingSegments } from "../src/lib/tool-projects.mjs";

const entries = readdirSync(new URL("../attacks/", import.meta.url))
  .filter((file) => file.endsWith(".yaml"))
  .map((file) =>
    parse(readFileSync(new URL(`../attacks/${file}`, import.meta.url), "utf8")),
  );

test("tool linking preserves every reported label and uses only reviewed destinations", () => {
  const destinations = new Set(registry.projects.map((project) => project.url));
  const used = new Set();
  for (const attack of entries) {
    for (const label of [
      ...attack.ai_tooling_and_models,
      ...attack.other_tooling,
    ]) {
      const segments = toolingSegments(label);
      assert.equal(segments.map((segment) => segment.text).join(""), label);
      for (const { project } of segments) {
        if (!project) continue;
        assert.ok(destinations.has(project.url));
        assert.equal(new URL(project.url).protocol, "https:");
        used.add(project.name);
      }
    }
  }
  assert.deepEqual(
    [...used].sort(),
    registry.projects.map((project) => project.name).sort(),
  );
  const aliases = registry.projects.flatMap((project) =>
    project.aliases.map((alias) => alias.toLowerCase()),
  );
  assert.equal(
    new Set(aliases).size,
    aliases.length,
    "Aliases must identify one project unambiguously",
  );
});

test("specific names win and multiple products keep their own links and version text", () => {
  const label = "Claude Code CLI via ANTHROPIC_BASE_URL to DeepSeek";
  assert.deepEqual(
    toolingSegments(label).map(({ text, project }) => [text, project?.url]),
    [
      ["Claude Code CLI", "https://github.com/anthropics/claude-code"],
      [" via ANTHROPIC_BASE_URL to ", undefined],
      ["DeepSeek", "https://github.com/deepseek-ai"],
    ],
  );
  const sdk = toolingSegments("claude-agent-sdk < 0.2.121");
  assert.equal(
    sdk[0].project.url,
    "https://github.com/anthropics/claude-agent-sdk-python",
  );
  assert.equal(sdk[1].text, " < 0.2.121");
  assert.equal(
    toolingSegments("gemini CLI")[0].project.url,
    "https://github.com/google-gemini/gemini-cli",
  );
  assert.equal(
    toolingSegments("npm open@10.1.2")[0].project.url,
    "https://github.com/sindresorhus/open",
  );
});

test("unknown artifacts, endpoints, paths and worker labels remain plain text", () => {
  for (const label of [
    "StyleSmuggler PoC",
    "SysGoRAT",
    "FraudGPT (claimed)",
    "Attacker MCP arena.apexaccs.org/api/copilot/mcp",
    "193.32.204.199:8080",
    "Worker label claudecode_deepseek-v4.1-flash (AIA0001)",
    "pi_openrouter_deepseek (AIA0002)",
    "CLAUDE.md TTP guide",
    "https://attacker.example/Python",
    "https://Claude.example/",
    "UnknownAmassTool",
    "--dangerously-skip-permissions",
  ]) {
    assert.deepEqual(toolingSegments(label), [{ text: label }]);
  }
});

test("built attack pages and Markdown exports link the researched tools", () => {
  const html = readFileSync(
    new URL(
      "../dist/attacks/cairn-norforge-2026-10/index.html",
      import.meta.url,
    ),
    "utf8",
  );
  const markdown = readFileSync(
    new URL("../dist/api/attacks/cairn-norforge-2026-10.md", import.meta.url),
    "utf8",
  );
  for (const [name, url] of [
    ["Cairn", "https://github.com/oritera/Cairn"],
    ["Amass", "https://github.com/owasp-amass/amass"],
    ["dnsrecon", "https://github.com/darkoperator/dnsrecon"],
    ["Nmap", "https://github.com/nmap/nmap"],
    ["ffuf", "https://github.com/ffuf/ffuf"],
    ["PHPGGC", "https://github.com/ambionics/phpggc"],
  ]) {
    assert.ok(html.includes(`href="${url}"`), name);
    assert.ok(markdown.includes(`[${name}](${url})`), name);
  }
  const artex = readFileSync(
    new URL(
      "../dist/attacks/crowdstrike-artex-sk-finance-2026-10/index.html",
      import.meta.url,
    ),
    "utf8",
  );
  assert.ok(artex.includes('href="https://github.com/RuoJi6/ARTEX"'));
  assert.ok(
    artex.includes(
      "Community-maintained fork; the original repository is unavailable.",
    ),
  );
});
