import test from "node:test";
import assert from "node:assert/strict";
import { Readable } from "node:stream";
import { isPublicAddress } from "../src/lib/source-urls.mjs";
import {
  checkLinks,
  checkSourceUrl,
  collectLinks,
  readCappedResponse,
  requestStatus,
} from "../scripts/lib/source-links.mjs";

const url = "https://example.org/report";
const check = (request) => checkSourceUrl(url, { request, retryDelayMs: 0 });

test("capped response reads settle when the stream is destroyed", async () => {
  const response = Readable.from([Buffer.from("abcdef")]);
  response.statusCode = 200;
  response.headers = {};
  const result = await readCappedResponse(response, 3);
  assert.equal(result.status, 200);
  assert.equal(result.body, "abc");
});

test("GET confirms a failed HEAD before declaring a link broken", async () => {
  const methods = [];
  const result = await check(async (_, method) => {
    methods.push(method);
    return { status: method === "HEAD" ? 404 : 200 };
  });
  assert.equal(result.status, "ok");
  assert.deepEqual(methods, ["HEAD", "GET"]);
  assert.equal(
    (
      await check(async (_, method) => {
        if (method === "HEAD") throw new Error("HEAD not supported");
        return { status: 200 };
      })
    ).status,
    "ok",
  );
});

test("404 and 410 fail only after GET confirmation and a retry", async () => {
  for (const status of [404, 410]) {
    const methods = [];
    const result = await check(async (_, method) => {
      methods.push(method);
      return { status };
    });
    assert.equal(result.status, "error");
    assert.match(result.detail, /confirmed with GET/);
    assert.deepEqual(methods, ["HEAD", "GET", "HEAD", "GET"]);
  }
  let attempts = 0;
  assert.equal(
    (await check(async () => ({ status: ++attempts < 3 ? 404 : 200 }))).status,
    "ok",
  );
});

test("blocked, rate-limited and unavailable sources produce warnings", async () => {
  for (const status of [401, 403, 405, 429, 500, 503])
    assert.equal(
      (await check(async () => ({ status }))).status,
      "warning",
      String(status),
    );
  for (const code of ["ENOTFOUND", "ECONNRESET", "ABORT_ERR"])
    assert.equal(
      (
        await check(async () => {
          throw Object.assign(new Error(), { code });
        })
      ).status,
      "warning",
      code,
    );
});

test("relative redirects work; loops and excessive redirects fail", async () => {
  const seen = [];
  const result = await check(async (target) => {
    seen.push(target);
    return target === url
      ? { status: 301, location: "/moved" }
      : { status: 200 };
  });
  assert.equal(result.status, "ok");
  assert.deepEqual(seen, [url, "https://example.org/moved"]);
  assert.match(
    (await check(async () => ({ status: 302, location: url }))).detail,
    /redirect loop/,
  );
  assert.match(
    (
      await check(async (target) => ({
        status: 302,
        location: `${target}/more`,
      }))
    ).detail,
    /too many redirects/,
  );
  assert.equal((await check(async () => ({ status: 302 }))).status, "error");
});

test("private and non-HTTP redirect targets are rejected before requesting them", async () => {
  for (const location of [
    "http://127.0.0.1/",
    "http://169.254.169.254/",
    "http://[::1]/",
    "file:///etc/passwd",
    "https://user:pass@example.org/",
  ]) {
    let requests = 0;
    const result = await check(async () => {
      requests++;
      return { status: 302, location };
    });
    assert.equal(result.status, "error", location);
    assert.equal(requests, 1, location);
  }
  await assert.rejects(
    requestStatus("http://10.0.0.1/", "HEAD"),
    /public address/,
  );
  for (const address of [
    "127.0.0.1",
    "10.1.2.3",
    "172.16.0.1",
    "192.168.1.1",
    "169.254.169.254",
    "100.64.0.1",
    "0.0.0.0",
    "::1",
    "fc00::1",
    "fe80::1",
    "::ffff:127.0.0.1",
    "2001:db8::1",
  ])
    assert.equal(isPublicAddress(address), false, address);
  for (const address of ["1.1.1.1", "8.8.8.8", "2606:4700:4700::1111"])
    assert.equal(isPublicAddress(address), true, address);
});

test("collection deduplicates evidence links and excludes IOC and free-text URLs", () => {
  const links = collectLinks([
    {
      filename: "example.yaml",
      data: {
        sources: [{ url }, { url: `${url}#section` }],
        magicsword_coverage: ["https://example.org/post"],
        attack_flow: { nodes: [{ source_urls: [url] }] },
        atlas_techniques: [{ source_urls: [url] }],
        iocs: { urls: ["https://malware.example/payload"] },
        technique_summary: "Payload at https://malware.example/download",
      },
    },
  ]);
  assert.deepEqual([...links.keys()], [url, "https://example.org/post"]);
  assert.equal(links.get(url).size, 4);
});

test("link checking limits parallel requests and handles empty changes", async () => {
  assert.deepEqual(await checkLinks(new Map()), []);
  let active = 0;
  let peak = 0;
  const links = new Map(
    Array.from({ length: 11 }, (_, i) => [
      `${url}/${i}`,
      new Set(["example.yaml"]),
    ]),
  );
  const results = await checkLinks(links, async () => {
    peak = Math.max(peak, ++active);
    await new Promise((resolve) => setImmediate(resolve));
    active--;
    return { status: "ok", detail: "HTTP 200" };
  });
  assert.equal(results.length, 11);
  assert.equal(peak, 4);
});
