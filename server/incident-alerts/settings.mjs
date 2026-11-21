import { timingSafeEqual } from "node:crypto";

export function getSettings(env) {
  if (env.VERCEL_ENV !== "production") return null;

  const databaseUrl = env.INCIDENT_ALERTS_DATABASE_URL;
  if (!databaseUrl) return null;

  const origin = "https://openattacks.ai";
  const mode = env.INCIDENT_ALERTS_MODE;
  const secret = env.CRON_SECRET;
  const apiKey = env.RESEND_API_KEY;
  const from = env.INCIDENT_ALERTS_FROM?.trim();
  const address = env.INCIDENT_ALERTS_MAILING_ADDRESS?.trim();
  const live = Boolean(
    mode === "live" && secret?.length >= 32 && apiKey && from && address,
  );

  return {
    databaseUrl,
    origin,
    secret,
    apiKey,
    sender: { origin, from, address },
    baseline: mode === "baseline",
    live,
  };
}

export function authorizedCron(request, secret) {
  if (!secret || secret.length < 32) return false;
  const expected = Buffer.from(`Bearer ${secret}`);
  const supplied = Buffer.from(request.headers.get("authorization") ?? "");
  return (
    expected.length === supplied.length && timingSafeEqual(expected, supplied)
  );
}
