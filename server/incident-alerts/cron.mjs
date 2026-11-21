import { randomUUID } from "node:crypto";
import { setTimeout as delay } from "node:timers/promises";
import { digestEmail, readPublishedCatalog, sendEmail } from "./email.mjs";
import { authorizedCron, getSettings } from "./settings.mjs";
import { getStore } from "./store.mjs";

function json(body, status = 200) {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function runDigest(
  request,
  {
    env = process.env,
    storeFor = getStore,
    readCatalog = readPublishedCatalog,
    send = sendEmail,
    log = console,
    pause = delay,
  } = {},
) {
  if (request.method !== "GET")
    return new Response(null, { status: 405, headers: { Allow: "GET" } });
  const settings = getSettings(env);
  if (!settings || (!settings.live && !settings.baseline)) {
    return json({ status: "inactive" }, 503);
  }
  if (!authorizedCron(request, settings.secret)) {
    return json({ status: "unauthorized" }, 401);
  }

  const deadline = Date.now() + 45_000;
  const store = storeFor(settings.databaseUrl);
  const dryRun = new URL(request.url).searchParams.get("dry-run") === "1";
  const lease = randomUUID();

  try {
    if (dryRun) {
      const items = await readCatalog(settings.origin);
      return json({ status: "dry-run", ...(await store.catalogStatus(items)) });
    }
    if (!(await store.acquireLease(lease)))
      return json({ status: "already-running" });

    try {
      const items = await readCatalog(settings.origin);
      const plan = await store.plan(items, settings.sender, settings.baseline);
      const expired = await store.cleanUp();
      if (settings.baseline || plan.baselined) {
        return json({ status: "baseline", ...plan, expired });
      }

      let sent = 0;
      let errors = 0;
      while (Date.now() < deadline) {
        const delivery = await store.claimDelivery();
        if (!delivery) break;
        let receipt;
        try {
          receipt = await send(
            settings.apiKey,
            digestEmail(delivery),
            `incident-digest/${delivery.id}`,
          );
        } catch {
          errors += 1;
          break;
        }
        await store.completeDelivery(delivery.id, receipt);
        sent += 1;
        await pause(250);
      }

      const pending = await store.pendingCount();
      const status = errors ? "retry-needed" : pending ? "pending" : "complete";
      if (pending || expired) {
        log.warn("Incident alert delivery requires attention", {
          pending,
          expired,
          errors,
        });
      }
      return json(
        { status, ...plan, sent, pending, expired },
        pending || expired ? 503 : 200,
      );
    } finally {
      await store.releaseLease(lease);
    }
  } catch {
    log.error("Incident alert scheduled run failed");
    return json({ status: "failed" }, 503);
  }
}
