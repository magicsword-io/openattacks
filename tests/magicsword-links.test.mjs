import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync, readdirSync } from "node:fs";
import {
  isMagicSwordURL,
  magicswordURL,
} from "../src/lib/magicsword-links.mjs";

test("MagicSword attribution preserves destinations, queries and the MCP connect fragment", () => {
  for (const destination of [
    "https://magicsword.io/",
    "https://www.magicsword.io/use-cases/application-control?plan=free#policy",
    "https://app.magicsword.io/mcp?utm_source=old&utm_content=existing#connect",
    "https://www.magicsword.io/mcp#connect",
  ]) {
    const original = new URL(destination);
    const tracked = new URL(magicswordURL(destination));
    assert.equal(tracked.origin, original.origin);
    assert.equal(tracked.pathname, original.pathname);
    assert.equal(tracked.hash, original.hash);
    assert.equal(tracked.searchParams.get("utm_source"), "openattacks");
    assert.equal(tracked.searchParams.get("utm_medium"), "referral");
    assert.equal(
      tracked.searchParams.get("plan"),
      original.searchParams.get("plan"),
    );
    assert.equal(magicswordURL(tracked.href), tracked.href);
  }
  assert.equal(
    new URL(
      magicswordURL("https://magicsword.io/?utm_content=existing"),
    ).searchParams.get("utm_content"),
    "existing",
  );
  assert.equal(
    new URL(
      magicswordURL("https://magicsword.io/", "nav-prevent"),
    ).searchParams.get("utm_content"),
    "nav-prevent",
  );
});

test("attribution leaves other destinations and relative links intact", () => {
  for (const destination of [
    "https://github.com/magicsword-io/openattacks",
    "https://magicsword.io.example.com/",
    "https://notmagicsword.io/",
    "https://example.com/?next=https://magicsword.io/",
    "https://unrelated.vercel.app/",
    "/catalog/",
    "#attack-flow",
    "javascript:alert(1)",
  ]) {
    assert.equal(isMagicSwordURL(destination), false);
    assert.equal(magicswordURL(destination), destination);
  }
});

test("every built MagicSword anchor and exported stage control carries attribution", () => {
  const root = new URL("../dist/", import.meta.url);
  let checked = 0;
  for (const path of readdirSync(root, { recursive: true })) {
    if (!path.endsWith(".html")) continue;
    const html = readFileSync(new URL(path, root), "utf8");
    for (const [, encoded] of html.matchAll(/<a\b[^>]*href="([^"]+)"/g)) {
      const href = encoded.replaceAll("&amp;", "&");
      if (!isMagicSwordURL(href)) continue;
      assert.equal(
        new URL(href).searchParams.get("utm_source"),
        "openattacks",
        `${path}: ${href}`,
      );
      checked++;
    }
  }
  assert.ok(
    checked > 70,
    "Includes navigation, inventory, MCP, footers and stage links",
  );
  const packs = JSON.parse(
    readFileSync(new URL("api/defenses.json", root), "utf8"),
  );
  let controls = 0;
  for (const pack of packs.entries) {
    for (const stage of pack.stages) {
      if (!stage.control) continue;
      assert.equal(
        new URL(stage.control.url).searchParams.get("utm_source"),
        "openattacks",
      );
      controls++;
    }
  }
  assert.ok(controls > 0);
});
