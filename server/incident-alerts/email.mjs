const roleSummaries = {
  ai_agent_or_mcp_as_target: "Targets an AI agent or its tool connections.",
  ai_credential_theft:
    "Involves unauthorized access to AI credentials or services.",
  ai_infra_as_c2:
    "Involves misuse of AI infrastructure to support malicious activity.",
  ai_tool_as_lure: "Uses AI branding or tools as a lure.",
  attacker_uses_ai_as_operator:
    "Describes the use of AI to assist an intrusion.",
  llm_generated_malware:
    "Describes AI-assisted creation or modification of malicious software.",
  other: "Documents a security case involving AI.",
};

export function catalogItems(catalog) {
  if (!Array.isArray(catalog) || !catalog.length) {
    throw new Error("Expected a nonempty published catalog");
  }

  const ids = new Set();
  return catalog.map((entry) => {
    const { id, name, ai_role: role, borderline } = entry;
    if (
      typeof id !== "string" ||
      !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(id) ||
      typeof name !== "string" ||
      !name.trim() ||
      ids.has(id)
    ) {
      throw new Error("Invalid entry in the published catalog");
    }
    ids.add(id);
    const title = name
      .replace(/\s+/g, " ")
      .replace(/[\p{Cc}\p{Cf}]/gu, "")
      .replace(/\bhttps?:\/\/\S+/gi, "[link omitted]")
      .replace(
        /\b(?:[a-z\d-]+\.)+[a-z]{2,}\b|\b(?:\d{1,3}\.){3}\d{1,3}\b/gi,
        (value) => value.replaceAll(".", "[.]"),
      )
      .trim()
      .slice(0, 200);
    const summary =
      (Object.hasOwn(roleSummaries, role)
        ? roleSummaries[role]
        : roleSummaries.other) +
      (borderline === true
        ? " See the catalog entry for evidence and qualifications."
        : "");
    return { id, title, summary };
  });
}

export async function readPublishedCatalog(origin) {
  const url = new URL("/api/attacks.json", origin);
  url.searchParams.set("incident-alerts", Date.now().toString());
  const response = await fetch(url, {
    cache: "no-store",
    redirect: "error",
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok) throw new Error("Published catalog unavailable");
  return catalogItems(await response.json());
}

function actionUrl(origin, action, token) {
  const url = new URL("/api/incident-alerts", origin);
  url.searchParams.set(action, token);
  return url.href;
}

export function confirmationEmail(settings, email, token) {
  return {
    from: settings.from,
    to: [email],
    subject: "Confirm your OpenAttacks incident alerts",
    text: [
      "Confirm that you want the OpenAttacks daily email digest of newly published incidents:",
      actionUrl(settings.origin, "confirm", token),
      "",
      "This link expires in 24 hours. If you did not request alerts, you can ignore this email.",
    ].join("\n"),
  };
}

export function digestEmail({ email, consent_id, items, sender }) {
  const unsubscribe = actionUrl(sender.origin, "unsubscribe", consent_id);
  return {
    from: sender.from,
    to: [email],
    subject: "OpenAttacks incident digest",
    text: [
      "Newly published in the OpenAttacks catalog",
      "",
      ...items.flatMap(({ id, title, summary }) => [
        title,
        summary,
        new URL(`/attacks/${id}/`, sender.origin).href,
        "",
      ]),
      "You receive this email because you opted in to OpenAttacks incident alerts.",
      `Unsubscribe: ${unsubscribe}`,
      `OpenAttacks by MagicSword · ${sender.address}`,
    ].join("\n"),
    headers: {
      "List-Unsubscribe": `<${unsubscribe}>`,
      "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
    },
  };
}

export async function sendEmail(
  apiKey,
  message,
  idempotencyKey,
  request = fetch,
) {
  const response = await request("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      "Idempotency-Key": idempotencyKey,
    },
    body: JSON.stringify(message),
    signal: AbortSignal.timeout(5000),
  });
  if (!response.ok)
    throw new Error(`Email provider returned ${response.status}`);
  const { id } = await response.json();
  if (typeof id !== "string" || !id)
    throw new Error("Missing email provider receipt");
  return id;
}
