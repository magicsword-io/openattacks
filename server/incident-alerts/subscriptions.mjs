import { createHash, createHmac, randomBytes } from "node:crypto";
import { confirmationEmail, sendEmail } from "./email.mjs";
import { getSettings } from "./settings.mjs";
import { getStore } from "./store.mjs";

const endpoint = "/api/incident-alerts";
const confirmationPattern = /^[\w-]{43}$/;
const unsubscribePattern =
  /^[\da-f]{8}-[\da-f]{4}-4[\da-f]{3}-[89ab][\da-f]{3}-[\da-f]{12}$/;
const genericSignup =
  "If this address can be subscribed, you’ll receive a confirmation email. Open its link to finish signing up.";
const pageHeaders = {
  "Cache-Control": "no-store",
  "Content-Type": "text/html; charset=utf-8",
  "Content-Security-Policy":
    "default-src 'none'; style-src 'unsafe-inline'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'",
  "Referrer-Policy": "no-referrer",
  "X-Robots-Tag": "noindex, nofollow",
};

function page(title, message, { status = 200, form = "" } = {}) {
  return new Response(
    `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title} | OpenAttacks</title>
<style>
  :root { color-scheme: dark light; --bg: #08080a; --text: #f4f4f5; --accent: #10b981; --on-accent: #08080a; }
  @media (prefers-color-scheme: light) {
    :root { --bg: #fafafa; --text: #18181b; --accent: #047857; --on-accent: #fff; }
  }
  body { background: var(--bg); color: var(--text); font: 1rem/1.6 system-ui, sans-serif; padding: 2rem 1rem; }
  main { max-width: 40rem; margin: 0 auto; }
  h1 { line-height: 1.15; }
  a { color: var(--accent); }
  button { margin: 0.5rem 0; padding: 0.65rem 1rem; background: var(--accent); color: var(--on-accent); border: 0; border-radius: 6px; font: inherit; font-weight: 650; cursor: pointer; }
  :focus-visible { outline: 2px solid var(--accent); outline-offset: 4px; }
</style>
</head>
<body>
<main>
<a href="/alerts/">OpenAttacks incident alerts</a>
<h1>${title}</h1>
<p>${message}</p>
${form}
</main>
</body>
</html>`,
    { status, headers: pageHeaders },
  );
}

function actionPrompt(action, token) {
  // Token and action have both passed fixed allowlists before interpolation.
  const confirm = action === "confirm";
  const title = confirm
    ? "Confirm incident alerts"
    : "Unsubscribe from incident alerts";
  const message = confirm
    ? "Confirm to get the daily digest of newly published OpenAttacks catalog entries."
    : "Unsubscribe to stop receiving the OpenAttacks daily digest.";
  return page(title, message, {
    form: `<form method="post" action="${endpoint}">
<input type="hidden" name="action" value="${action}">
<input type="hidden" name="token" value="${token}">
<button type="submit">${confirm ? "Confirm subscription" : "Unsubscribe"}</button>
</form>`,
  });
}

function unavailable() {
  return page("Incident alerts are unavailable", "Please try again later.", {
    status: 503,
  });
}

function invalidLink() {
  return page(
    "This link is invalid or has expired",
    "Open the incident alerts page to request a new confirmation email.",
    { status: 400 },
  );
}

function emailAddress(value) {
  const email = typeof value === "string" ? value.trim().toLowerCase() : "";
  return email.length <= 254 &&
    /^[a-z\d.!#$%&'*+/=?^_`{|}~-]+@[a-z\d-]+(?:\.[a-z\d-]+)+$/.test(email)
    ? email
    : null;
}

async function readForm(request) {
  const contentType = request.headers.get("content-type") || "";
  if (
    !/^(application\/x-www-form-urlencoded|multipart\/form-data)(?:;|$)/i.test(
      contentType,
    )
  )
    return null;
  if (Number(request.headers.get("content-length")) > 4096) return null;
  const body = await request.arrayBuffer();
  if (body.byteLength > 4096) return null;

  try {
    return await new Response(body, {
      headers: { "Content-Type": contentType },
    }).formData();
  } catch {
    return null;
  }
}

export async function subscriptionRequest(
  request,
  {
    env = process.env,
    storeFor = getStore,
    send = sendEmail,
    log = console,
  } = {},
) {
  const settings = getSettings(env);
  const url = new URL(request.url);
  if (!settings || url.origin !== settings.origin) return unavailable();

  const confirmToken = url.searchParams.get("confirm") ?? "";
  const unsubscribeToken = url.searchParams.get("unsubscribe") ?? "";
  if (request.method === "GET") {
    if (confirmationPattern.test(confirmToken))
      return actionPrompt("confirm", confirmToken);
    if (unsubscribePattern.test(unsubscribeToken))
      return actionPrompt("unsubscribe", unsubscribeToken);
    return invalidLink();
  }

  if (request.method !== "POST") {
    return new Response(null, {
      status: 405,
      headers: { ...pageHeaders, Allow: "GET, POST" },
    });
  }

  const oneClick = url.searchParams.has("unsubscribe");
  try {
    const form = await readForm(request);
    if (oneClick) {
      if (
        !unsubscribePattern.test(unsubscribeToken) ||
        form?.get("List-Unsubscribe") !== "One-Click"
      ) {
        return invalidLink();
      }
      await storeFor(settings.databaseUrl).unsubscribe(unsubscribeToken);
      return new Response(null, { headers: pageHeaders });
    }

    const token = form?.get("token") ?? "";
    switch (form?.get("action")) {
      case "subscribe": {
        if (!settings.live) return unavailable();
        if (request.headers.get("origin") !== settings.origin) {
          return page(
            "Request declined",
            "Open the OpenAttacks incident alerts page to continue.",
            { status: 403 },
          );
        }
        const email = emailAddress(form.get("email"));
        if (!email)
          return page(
            "Enter a valid email address",
            "Return to the incident alerts form and check the email address.",
            { status: 400 },
          );
        const store = storeFor(settings.databaseUrl);
        const ip = request.headers.get("x-vercel-forwarded-for") || "unknown";
        const bucket = createHmac("sha256", settings.secret)
          .update(ip)
          .digest("hex");
        if (await store.allowSignup(bucket)) {
          const confirmation = randomBytes(32).toString("base64url");
          const hash = createHash("sha256").update(confirmation).digest("hex");
          if (await store.requestConfirmation(email, hash)) {
            try {
              await send(
                settings.apiKey,
                confirmationEmail(settings.sender, email, confirmation),
                `incident-confirmation/${hash}`,
              );
            } catch {
              log.warn("Incident alert confirmation could not be sent");
            }
          }
        }
        return page("Check your inbox", genericSignup);
      }
      case "confirm": {
        if (!settings.live) return unavailable();
        if (typeof token !== "string" || !confirmationPattern.test(token))
          return invalidLink();
        const hash = createHash("sha256").update(token).digest("hex");
        if (!(await storeFor(settings.databaseUrl).confirm(hash)))
          return invalidLink();
        return page(
          "You’re subscribed",
          "You’ll receive a daily digest when new incidents are published. Every digest includes an unsubscribe link.",
        );
      }
      case "unsubscribe":
        if (typeof token !== "string" || !unsubscribePattern.test(token))
          return invalidLink();
        await storeFor(settings.databaseUrl).unsubscribe(token);
        return page(
          "You’re unsubscribed",
          "You’ll no longer receive OpenAttacks incident alerts.",
        );
      default:
        return invalidLink();
    }
  } catch {
    log.error("Incident alert subscription request failed");
    return unavailable();
  }
}
