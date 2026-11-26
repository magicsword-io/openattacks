import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const config = JSON.parse(
  readFileSync(new URL("../vercel.json", import.meta.url), "utf8"),
);

// Vercel compiles `source` with path-to-regexp in strict mode. `/:path*` does
// not match `/` or a trailing slash, so Astro's trailing-slash HTML pages were
// served with 200 on the duplicate host. `/:path(.*)` captures the remainder,
// including a trailing slash, and the destination stays `:path*`.
const hostRule = (host) =>
  config.redirects.find(
    (rule) =>
      rule.permanent === true &&
      rule.has?.length === 1 &&
      rule.has[0].type === "host" &&
      rule.has[0].value === host,
  );

const locationFor = (pathname) => {
  const match = /^(?:\/(.*))$/.exec(pathname);
  assert.ok(match, pathname);
  return `https://openattacks.ai/${match[1]}`;
};

test("www.openattacks.ai redirects permanently to the apex and keeps the path", () => {
  const rule = hostRule("www.openattacks.ai");
  assert.ok(rule);
  assert.equal(rule.source, "/:path(.*)");
  assert.equal(rule.destination, "https://openattacks.ai/:path*");
  assert.deepEqual(rule.has, [{ type: "host", value: "www.openattacks.ai" }]);
  assert.equal(rule.permanent, true);
  assert.equal("statusCode" in rule, false);

  // No query in the destination, so Vercel appends the request query unchanged.
  assert.equal(rule.destination.includes("?"), false);
  for (const [path, expected] of [
    ["/", "https://openattacks.ai/"],
    ["/about", "https://openattacks.ai/about"],
    ["/about/", "https://openattacks.ai/about/"],
    ["/actors/apt28/", "https://openattacks.ai/actors/apt28/"],
    ["/robots.txt", "https://openattacks.ai/robots.txt"],
    ["/api/attacks.json", "https://openattacks.ai/api/attacks.json"],
  ]) {
    assert.equal(locationFor(path), expected, path);
  }
});

test("other duplicate hosts use the same path-preserving redirect", () => {
  for (const host of ["openattacks.com", "www.openattacks.com"]) {
    const rule = hostRule(host);
    assert.ok(rule, host);
    assert.equal(rule.source, "/:path(.*)");
    assert.equal(rule.destination, "https://openattacks.ai/:path*");
    assert.equal(rule.permanent, true);
  }
});

test("PR 60 response headers and asset redirects stay in place", () => {
  const header = (source) =>
    config.headers.find((entry) => entry.source === source);
  const value = (source, key) =>
    header(source)?.headers.find((item) => item.key === key)?.value;

  assert.equal(value("/api/:path*", "Access-Control-Allow-Origin"), "*");
  assert.equal(value("/llms.txt", "Content-Type"), "text/plain; charset=utf-8");
  assert.equal(
    value("/llms.txt", "Cache-Control"),
    "public, max-age=3600, must-revalidate",
  );
  assert.equal(
    value("/llms-full.txt", "Cache-Control"),
    "public, max-age=3600, must-revalidate",
  );
  assert.equal(
    value("/llms-full.txt", "Link"),
    '</llms.txt>; rel="describedby"',
  );
  assert.equal(
    value("/llms/:path*", "Cache-Control"),
    "public, max-age=3600, must-revalidate",
  );
  assert.equal(value("/llms/:path*", "Link"), '</llms.txt>; rel="describedby"');
  assert.equal(
    value("/skills/openattacks/SKILL.md", "Content-Type"),
    "text/markdown; charset=utf-8",
  );
  assert.equal(
    value("/skills/openattacks/SKILL.md", "Cache-Control"),
    "public, max-age=3600, must-revalidate",
  );
  assert.equal(
    value("/downloads/openattacks-skill.zip", "Content-Type"),
    "application/zip",
  );
  assert.equal(
    value("/downloads/openattacks-skill.zip", "Cache-Control"),
    "public, max-age=3600, must-revalidate",
  );
  assert.equal(
    value("/rss.xml", "Content-Type"),
    "application/rss+xml; charset=utf-8",
  );
  assert.equal(value("/data/attacks.json", "Access-Control-Allow-Origin"), "*");
  assert.equal(
    value("/data/attacks.schema.json", "Access-Control-Allow-Origin"),
    "*",
  );

  for (const source of [
    "/ai-attacks-share.png",
    "/og.png",
    "/openattacks-share.png",
  ]) {
    const rule = config.redirects.find((entry) => entry.source === source);
    assert.equal(rule?.destination, "/openattacks-share-v2.png");
    assert.equal(rule?.permanent, true);
  }
});
