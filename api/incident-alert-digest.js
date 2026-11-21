import { runDigest } from "../server/incident-alerts/cron.mjs";

export default { fetch: (request) => runDigest(request) };
