import assert from "node:assert/strict";
import { createHash, randomUUID } from "node:crypto";
import { readFile } from "node:fs/promises";
import { test } from "node:test";
import postgres from "postgres";
import { runDigest } from "../server/incident-alerts/cron.mjs";
import {
  catalogItems,
  digestEmail,
  sendEmail,
} from "../server/incident-alerts/email.mjs";
import { createStore } from "../server/incident-alerts/store.mjs";
import { subscriptionRequest } from "../server/incident-alerts/subscriptions.mjs";

const origin = "https://openattacks.ai";
const env = {
  VERCEL_ENV: "production",
  INCIDENT_ALERTS_MODE: "live",
  INCIDENT_ALERTS_DATABASE_URL: "mock-db",
  INCIDENT_ALERTS_FROM: "OpenAttacks <incidents@example.test>",
  INCIDENT_ALERTS_MAILING_ADDRESS: "Test address",
  CRON_SECRET: "mock-secret-long-enough-for-testing-only",
  RESEND_API_KEY: "mock-resend-key",
};
const log = { warn() {}, error() {} };
const recipient = "reader@example.test";
const baseline = { id: "previous", name: "Previous title" };
const published = {
  id: "new-entry",
  name: "New issue at https://example.test/resource",
  date_reported: "2010-03",
  ai_role: "ai_agent_or_mcp_as_target",
  technique_summary: "Full public catalog narrative",
  iocs: { domains: ["sample.test"] },
};

function subRequest({ query = "", body, source = origin, host = origin } = {}) {
  return new Request(
    `${host}/api/incident-alerts${query}`,
    body && {
      method: "POST",
      headers: { Origin: source, "x-vercel-forwarded-for": "192.0.2.12" },
      body: body instanceof FormData ? body : new URLSearchParams(body),
    },
  );
}

function cronRequest(query = "", secret = env.CRON_SECRET) {
  return new Request(
    `https://example.vercel.app/api/incident-alert-digest${query}`,
    {
      headers: { Authorization: `Bearer ${secret}` },
    },
  );
}

test("signup requires a valid address, sends privately and confirms only on POST", async () => {
  let pendingHash;
  let token;
  let unsubscribed;
  const store = {
    allowSignup: async (bucket) => {
      assert.match(bucket, /^[a-f\d]{64}$/);
      return true;
    },
    requestConfirmation: async (email, hash) => {
      assert.equal(email, recipient);
      if (pendingHash) return false;
      pendingHash = hash;
      return true;
    },
    confirm: async (hash) => {
      if (hash !== pendingHash) return false;
      pendingHash = undefined;
      return true;
    },
    unsubscribe: async (id) => {
      unsubscribed = id;
    },
  };
  const send = async (key, message, idempotencyKey) => {
    assert.equal(key, env.RESEND_API_KEY);
    assert.deepEqual(message.to, [recipient]);
    token = new URL(message.text.split("\n")[1]).searchParams.get("confirm");
    assert.equal(createHash("sha256").update(token).digest("hex"), pendingHash);
    assert.equal(idempotencyKey, `incident-confirmation/${pendingHash}`);
    return "receipt";
  };
  const handle = (options) =>
    subscriptionRequest(subRequest(options), {
      env,
      storeFor: () => store,
      send,
      log,
    });
  assert.equal(
    (await handle({ body: { action: "subscribe", email: "bad-email" } }))
      .status,
    400,
  );
  assert.equal(
    (
      await handle({
        body: { action: "subscribe", email: recipient },
        source: "https://example.test",
      })
    ).status,
    403,
  );
  const signup = await handle({
    body: { action: "subscribe", email: " Reader@Example.test " },
  });
  const signupText = await signup.text();
  assert.match(signupText, /Check your inbox/);
  assert.ok(!signupText.includes(recipient));
  const repeatedSignup = await handle({
    body: { action: "subscribe", email: recipient },
  });
  assert.equal(await repeatedSignup.text(), signupText);
  const prompt = await handle({ query: `?confirm=${token}` });
  assert.match(await prompt.text(), /Confirm subscription/);
  assert.equal(prompt.headers.get("referrer-policy"), "no-referrer");
  assert.equal(prompt.headers.get("cache-control"), "no-store");
  assert.ok(pendingHash);
  assert.match(
    await (
      await handle({ body: { action: "confirm", token }, source: "null" })
    ).text(),
    /You’re subscribed/,
  );
  assert.equal(
    (await handle({ body: { action: "confirm", token } })).status,
    400,
  );

  const consentId = randomUUID();
  assert.equal(
    (await handle({ query: `?unsubscribe=${consentId}` })).status,
    200,
  );
  assert.equal(unsubscribed, undefined);
  const multipart = new FormData();
  multipart.append("List-Unsubscribe", "One-Click");
  assert.equal(
    (
      await handle({
        query: `?unsubscribe=${consentId}`,
        body: multipart,
        source: "null",
      })
    ).status,
    200,
  );
  assert.equal(unsubscribed, consentId);
});

test("production settings and the cron secret gate sending and previews", async () => {
  const fail = () => assert.fail("inactive request performed work");
  const options = { storeFor: fail, readCatalog: fail, send: fail, log };
  const request = subRequest({
    body: { action: "subscribe", email: recipient },
  });
  for (const disabled of [
    { ...env, VERCEL_ENV: "preview" },
    { ...env, VERCEL_ENV: undefined },
    { ...env, INCIDENT_ALERTS_MODE: undefined },
    { ...env, INCIDENT_ALERTS_DATABASE_URL: undefined },
    { ...env, RESEND_API_KEY: undefined },
    { ...env, CRON_SECRET: undefined },
  ]) {
    assert.equal(
      (
        await subscriptionRequest(request.clone(), {
          env: disabled,
          ...options,
        })
      ).status,
      503,
    );
    assert.equal(
      (await runDigest(cronRequest(), { env: disabled, ...options })).status,
      503,
    );
  }
  assert.equal(
    (await runDigest(cronRequest("", "incorrect"), { env, ...options })).status,
    401,
  );
});

test("dry runs and duplicate scheduler invocations do not claim deliveries", async () => {
  const options = {
    env,
    log,
    readCatalog: async () => catalogItems([baseline]),
    storeFor: () => ({
      acquireLease: async () => false,
      catalogStatus: async () => ({
        initialized: false,
        unseen: 1,
        pending: 0,
      }),
    }),
    send: () => assert.fail("dry run attempted to send"),
  };
  assert.deepEqual(
    await (await runDigest(cronRequest("?dry-run=1"), options)).json(),
    { status: "dry-run", initialized: false, unseen: 1, pending: 0 },
  );
  assert.deepEqual(await (await runDigest(cronRequest(), options)).json(), {
    status: "already-running",
  });
});

test("digest content stays private and the same delivery uses a stable provider key", async () => {
  const items = catalogItems([published]);
  const delivery = {
    id: randomUUID(),
    consent_id: randomUUID(),
    email: recipient,
    items,
    sender: {
      origin,
      from: env.INCIDENT_ALERTS_FROM,
      address: "Example address",
    },
  };
  const email = digestEmail(delivery);
  assert.deepEqual(email.to, [recipient]);
  assert.match(email.text, /Targets an AI agent or its tool connections/);
  assert.match(email.text, /https:\/\/openattacks\.ai\/attacks\/new-entry\//);
  assert.doesNotMatch(
    email.text,
    /example\.test|Full public catalog narrative|sample\.test|2010/,
  );
  assert.ok(email.headers["List-Unsubscribe"].includes(delivery.consent_id));
  assert.equal(
    email.headers["List-Unsubscribe-Post"],
    "List-Unsubscribe=One-Click",
  );

  let completed = false;
  const keys = new Set();
  const options = {
    env,
    log,
    readCatalog: async () => items,
    pause: async () => {},
    storeFor: () => ({
      acquireLease: async () => true,
      releaseLease: async () => {},
      plan: async () => ({ baselined: false, newEntries: 0 }),
      cleanUp: async () => 0,
      claimDelivery: async () => (completed ? undefined : delivery),
      completeDelivery: async (id, receipt) => {
        assert.equal(id, delivery.id);
        assert.equal(receipt, "mock-receipt");
        completed = true;
      },
      pendingCount: async () => (completed ? 0 : 1),
    }),
    send: (key, message, idempotencyKey) =>
      sendEmail(key, message, idempotencyKey, async (url, init) => {
        assert.equal(url, "https://api.resend.com/emails");
        assert.equal(
          init.headers["Idempotency-Key"],
          `incident-digest/${delivery.id}`,
        );
        assert.deepEqual(JSON.parse(init.body), email);
        if (!keys.has(idempotencyKey)) {
          keys.add(idempotencyKey);
          throw new Error("mock network interruption after acceptance");
        }
        return Response.json({ id: "mock-receipt" });
      }),
  };
  assert.equal((await runDigest(cronRequest(), options)).status, 503);
  assert.deepEqual(await (await runDigest(cronRequest(), options)).json(), {
    status: "complete",
    baselined: false,
    newEntries: 0,
    sent: 1,
    pending: 0,
    expired: 0,
  });
  assert.equal(
    (await (await runDigest(cronRequest(), options)).json()).sent,
    0,
  );
  assert.equal(keys.size, 1);
});

const testDatabase = process.env.ALERTS_TEST_DATABASE_URL;
test(
  "Postgres persists consent, catalog snapshots, leases and delivery idempotency",
  { skip: !testDatabase },
  async () => {
    assert.ok(
      ["localhost", "127.0.0.1", "[::1]"].includes(
        new URL(testDatabase).hostname,
      ),
      "a local test database is required",
    );
    const schema = `alerts_test_${randomUUID().replaceAll("-", "")}`;
    const sql = postgres(testDatabase, {
      connection: { search_path: schema },
      onnotice() {},
    });
    try {
      await sql`CREATE SCHEMA ${sql(schema)}`;
      await sql.unsafe(
        await readFile(
          new URL("../server/incident-alerts/schema.sql", import.meta.url),
          "utf8",
        ),
      );
      const store = createStore(sql);
      const duplicate = await Promise.all([
        store.requestConfirmation(recipient, "first-confirmation"),
        store.requestConfirmation(recipient, "duplicate-confirmation"),
      ]);
      assert.equal(duplicate.filter(Boolean).length, 1);
      const confirmation = duplicate[0]
        ? "first-confirmation"
        : "duplicate-confirmation";
      await store.requestConfirmation(
        "pending@example.test",
        "pending-confirmation",
      );
      await store.requestConfirmation(
        "unsubscribed@example.test",
        "other-confirmation",
      );
      assert.equal(await store.confirm("fake-confirmation"), false);
      assert.equal(await store.confirm(confirmation), true);
      assert.equal(await store.confirm(confirmation), false);
      assert.equal(
        await store.requestConfirmation(recipient, "attempt-to-resubscribe"),
        false,
      );
      await store.confirm("other-confirmation");
      const [{ consent_id }] = await sql`
      SELECT consent_id FROM incident_alert_subscribers WHERE email = 'unsubscribed@example.test'
    `;
      await store.unsubscribe(consent_id);

      const concurrentLease = [randomUUID(), randomUUID()];
      const leases = await Promise.all(
        concurrentLease.map((id) => store.acquireLease(id)),
      );
      assert.equal(leases.filter(Boolean).length, 1);
      await store.releaseLease(concurrentLease[leases.indexOf(true)]);

      const sender = {
        origin,
        from: env.INCIDENT_ALERTS_FROM,
        address: "Example address",
      };
      const initial = catalogItems([baseline]);
      assert.deepEqual(await store.catalogStatus(initial), {
        initialized: false,
        unseen: 1,
        pending: 0,
      });
      assert.deepEqual(await store.plan(initial, sender, true), {
        baselined: true,
        newEntries: 0,
      });
      assert.equal(await store.pendingCount(), 0);
      const items = catalogItems([
        { ...baseline, name: "Edited title" },
        published,
      ]);
      assert.equal((await store.plan(items, sender, true)).newEntries, 0);
      assert.equal((await store.plan(items, sender, false)).newEntries, 1);
      assert.equal((await store.plan(items, sender, false)).newEntries, 0);
      assert.equal(await store.pendingCount(), 1);

      const delivery = await store.claimDelivery();
      assert.equal(delivery.email, recipient);
      assert.deepEqual(delivery.items, [catalogItems([published])[0]]);
      assert.equal(await store.claimDelivery(), undefined);
      await sql`UPDATE incident_alert_deliveries SET next_attempt_at = now()`;
      assert.deepEqual(await store.claimDelivery(), delivery);
      await store.completeDelivery(delivery.id, "mock-receipt");
      assert.equal(await store.pendingCount(), 0);
      assert.equal(await store.claimDelivery(), undefined);

      // A different UTC day with catalog edits and the same IDs is empty.
      await sql.begin((transaction) => [
        transaction`
        INSERT INTO incident_alert_digests
        SELECT digest_day - 1, items, sender FROM incident_alert_digests
      `,
        transaction`UPDATE incident_alert_deliveries SET digest_day = digest_day - 1`,
        transaction`DELETE FROM incident_alert_digests WHERE digest_day = (now() AT TIME ZONE 'UTC')::date`,
        transaction`UPDATE incident_alert_state SET last_digest_day = (now() AT TIME ZONE 'UTC')::date - 1`,
      ]);
      assert.equal((await store.plan(items, sender, false)).newEntries, 0);
      assert.equal(await store.pendingCount(), 0);
      await sql`UPDATE incident_alert_state SET last_digest_day = (now() AT TIME ZONE 'UTC')::date - 1`;
      assert.equal(
        (
          await store.plan(
            catalogItems([published, { id: "another-new", name: "Another" }]),
            sender,
            false,
          )
        ).newEntries,
        1,
      );
      await store.unsubscribe(delivery.consent_id);
      assert.equal(await store.claimDelivery(), undefined);
      await store.cleanUp();
      assert.equal(await store.pendingCount(), 0);
    } finally {
      await sql`DROP SCHEMA IF EXISTS ${sql(schema)} CASCADE`;
      await sql.end();
    }
  },
);
