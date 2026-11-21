import assert from "node:assert/strict";
import { test } from "node:test";
import {
  getSuggestionConfig,
  handleSuggestion,
} from "../src/lib/suggestions.server.ts";

const env = {
  OPENATTACKS_SUGGESTIONS_ENABLED: "true",
  OPENATTACKS_SUGGESTIONS_GITHUB_TOKEN: "mock-github-token",
  OPENATTACKS_SUGGESTIONS_REDIS_URL: "https://redis.example.test",
  OPENATTACKS_SUGGESTIONS_REDIS_TOKEN: "mock-redis-token",
};
const origin = "https://preview.example.test";
const incident = "cairn-norforge-2026-10";
const input = {
  type: "correction",
  relatedIncident: incident,
  description: "The date in the public report differs.",
  source: "https://reports.example.test/incident",
  consent: true,
  website: "",
};

function request(data = input, headers = {}) {
  return new Request(origin + "/suggest/intake.json", {
    method: "POST",
    headers: { Origin: origin, "Content-Type": "application/json", ...headers },
    body: typeof data === "string" ? data : JSON.stringify(data),
  });
}

function mockServices({ create, redisUnavailable = false } = {}) {
  const stored = new Map();
  const github = [];
  const redis = [];
  const fetcher = async (input, init) => {
    const url = new URL(input);
    if (url.origin === env.OPENATTACKS_SUGGESTIONS_REDIS_URL) {
      redis.push({ ...init, command: JSON.parse(init.body) });
      if (redisUnavailable)
        return Response.json({ error: "DB error" }, { status: 503 });
      const [operation, , numKeys, key, ...params] = redis.at(-1).command;
      assert.equal(operation, "EVAL");
      if (numKeys === 1) {
        const [claim, value, ttl] = params;
        assert.equal(ttl, 86400);
        if (stored.get(key) !== claim) return Response.json({ result: 0 });
        if (value) stored.set(key, value);
        else stored.delete(key);
        return Response.json({ result: 1 });
      }
      const [client, total, claim, clientMax, totalMax, hour, day] = params;
      assert.equal(numKeys, 3);
      assert.equal(hour, 3600);
      assert.equal(day, 86400);
      if (stored.has(key)) return Response.json({ result: stored.get(key) });
      if (
        (stored.get(client) ?? 0) >= clientMax ||
        (stored.get(total) ?? 0) >= totalMax
      ) {
        return Response.json({ result: "limited" });
      }
      for (const bucket of [client, total])
        stored.set(bucket, (stored.get(bucket) ?? 0) + 1);
      stored.set(key, claim);
      return Response.json({ result: "reserved" });
    }
    github.push({ ...init, url: url.href, payload: JSON.parse(init.body) });
    return create ? create() : Response.json({ number: 42 }, { status: 201 });
  };
  const post = (req = request(), options = {}) =>
    handleSuggestion(req, {
      config: getSuggestionConfig(env),
      address: "192.0.2.14",
      incidentExists: async (id) => id === incident,
      fetcher,
      ...options,
    });
  return { post, github, redis };
}

test("posting requires explicit runtime settings and a trusted address", async () => {
  for (const key of Object.keys(env)) {
    assert.equal(getSuggestionConfig({ ...env, [key]: undefined }), null);
  }
  assert.equal(
    getSuggestionConfig({
      ...env,
      OPENATTACKS_SUGGESTIONS_REDIS_URL: "http://redis.example.test",
    }),
    null,
  );
  const { post, github, redis } = mockServices();
  assert.equal((await post(request(), { config: null })).status, 503);
  assert.equal((await post(request(), { address: null })).status, 503);
  assert.equal(github.length + redis.length, 0);
});

test("posts only consented, inert public fields to the fixed GitHub repo", async () => {
  const { post, github, redis } = mockServices();
  const literal =
    "[link](https://untrusted.example.test/) @octocat #42\n\n```\n<img src=x>";
  const payload = { ...input, description: literal };
  const result = await post(request(payload));
  assert.equal(result.status, 201);
  assert.equal(result.headers.get("cache-control"), "no-store");
  assert.deepEqual(await result.json(), {
    result: "posted",
    message: "Your submission was posted as a public GitHub issue.",
    issue: 42,
  });
  assert.equal(github.length, 1);
  assert.equal(
    github[0].url,
    "https://api.github.com/repos/magicsword-io/openattacks/issues",
  );
  assert.equal(github[0].method, "POST");
  assert.equal(github[0].headers.Authorization, "Bearer mock-github-token");
  assert.equal(github[0].redirect, "error");
  assert.deepEqual(github[0].payload, {
    title: "[Site submission] Catalog correction",
    body: [
      "### Related incident\n\n    cairn-norforge-2026-10",
      "### Description\n\n    " + literal.split("\n").join("\n    "),
      "### Source URL\n\n    https://reports.example.test/incident",
    ].join("\n\n"),
  });
  const storeData = JSON.stringify(redis);
  assert.doesNotMatch(
    storeData,
    /192\.0\.2\.14|untrusted\.example|cairn-norforge|mock-github-token/,
  );
  assert.equal(redis[0].headers.Authorization, "Bearer mock-redis-token");

  const duplicate = await post(
    request({
      ...payload,
      description: "  " + literal.replaceAll("\n", "\r\n") + "\n",
    }),
    { address: "192.0.2.15" },
  );
  assert.equal(duplicate.status, 200);
  assert.equal((await duplicate.json()).issue, 42);
  assert.equal(github.length, 1);
});

test("accepts a new incident without optional fields", async () => {
  const { post, github } = mockServices();
  const result = await post(
    request({
      type: "incident",
      description: "An example incident appeared in public reporting.",
      consent: true,
    }),
  );
  assert.equal(result.status, 201);
  assert.deepEqual(github[0].payload, {
    title: "[Site submission] New incident lead",
    body: "### Description\n\n    An example incident appeared in public reporting.",
  });
});

test("rejects cross-origin, oversized and invalid submissions before any external request", async () => {
  const { post, github, redis } = mockServices();
  for (const [payload, expected] of [
    [{ consent: undefined }, 400],
    [{ consent: "true" }, 400],
    [{ website: "filled by bot" }, 400],
    [{ type: "constructor" }, 400],
    [{ type: "other" }, 400],
    [{ relatedIncident: "missing-incident" }, 400],
    [{ description: " \n  " }, 400],
    [{ description: "x".repeat(4001) }, 400],
    [{ description: "\x00control character" }, 400],
    [{ description: "Contact private.person@example.test." }, 400],
    [
      { source: "https://example.test/?reply=private.person%40example.test" },
      400,
    ],
    [{ source: "https://name:password@example.test/" }, 400],
    [{ source: "https://localhost/report" }, 400],
    [{ source: "https://10.0.0.4/report" }, 400],
    [{ source: "file:///etc/hosts" }, 400],
    [{ source: "https://example.test/" + "x".repeat(2049) }, 400],
    [{ replyEmail: "private.person@example.test" }, 400],
    [{ privateNotes: "Confidential text" }, 400],
    [{ description: "x".repeat(33000) }, 413],
  ]) {
    const result = await post(request({ ...input, ...payload }));
    assert.equal(
      result.status,
      expected,
      JSON.stringify(payload).slice(0, 100),
    );
    assert.doesNotMatch(
      await result.text(),
      /private\.person|Confidential text/,
    );
  }
  assert.equal((await post(request("{invalid"))).status, 400);
  assert.equal(
    (await post(request(input, { Origin: "https://elsewhere.test" }))).status,
    403,
  );
  assert.equal((await post(request(input, { Origin: "" }))).status, 403);
  assert.equal(
    (await post(request(input, { "Content-Type": "text/plain" }))).status,
    415,
  );
  assert.equal(github.length + redis.length, 0);
});

test("reserves duplicate submissions across concurrent requests", async () => {
  let announceRequest;
  let finishRequest;
  const requested = new Promise((resolve) => {
    announceRequest = resolve;
  });
  const { post, github } = mockServices({
    create: () => {
      announceRequest();
      return new Promise((resolve) => {
        finishRequest = resolve;
      });
    },
  });
  const pending = post();
  await requested;
  const duplicate = await post();
  assert.equal(duplicate.status, 409);
  assert.equal(github.length, 1);
  finishRequest(Response.json({ number: 42 }, { status: 201 }));
  assert.equal((await pending).status, 201);
});

test("enforces per-client and shared posting caps with retry feedback", async () => {
  const { post, github } = mockServices();
  const report = (i) =>
    request({ ...input, description: `Public report ${i}` });
  for (let i = 0; i < 4; i++) assert.equal((await post(report(i))).status, 201);
  const limited = await post(report(4));
  assert.equal(limited.status, 429);
  assert.equal(limited.headers.get("retry-after"), "3600");
  for (let i = 4; i < 25; i++) {
    assert.equal(
      (await post(report(i), { address: `198.51.100.${i}` })).status,
      201,
    );
  }
  assert.equal(
    (await post(report(25), { address: "198.51.100.25" })).status,
    429,
  );
  assert.equal(github.length, 25);
});

test("does not post when the shared store is unavailable", async () => {
  const { post, github } = mockServices({ redisUnavailable: true });
  assert.equal((await post()).status, 503);
  assert.equal(github.length, 0);
});

test("definitive GitHub rejections allow a retry and hide upstream details", async () => {
  let count = 0;
  const { post, github } = mockServices({
    create: () =>
      ++count === 1
        ? Response.json(
            { message: "Upstream details and mock-github-token" },
            { status: 401 },
          )
        : Response.json({ number: 42 }, { status: 201 }),
  });
  const failed = await post();
  assert.equal(failed.status, 503);
  assert.doesNotMatch(
    await failed.text(),
    /Upstream details|mock-github-token/,
  );
  assert.equal((await post()).status, 201);
  assert.equal(github.length, 2);
});

test("holds the reservation when GitHub may already have created an issue", async () => {
  for (const create of [
    () => Promise.reject(new Error("Connection lost")),
    () => new Response(null, { status: 502 }),
  ]) {
    const { post, github } = mockServices({ create });
    const failed = await post();
    assert.equal(failed.status, 502);
    assert.equal((await failed.json()).result, "unconfirmed");
    assert.equal((await post()).status, 409);
    assert.equal(github.length, 1);
  }
});

test("accepts a confirmed creation with malformed metadata without trusting response links", async () => {
  const { post, github } = mockServices({
    create: () =>
      Response.json(
        { number: "invalid", html_url: "https://elsewhere.test" },
        { status: 201 },
      ),
  });
  const result = await post();
  assert.equal(result.status, 201);
  assert.doesNotMatch(await result.text(), /elsewhere\.test|html_url/);
  assert.equal((await (await post()).json()).result, "duplicate");
  assert.equal(github.length, 1);
});
