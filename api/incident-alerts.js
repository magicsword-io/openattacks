import { subscriptionRequest } from "../server/incident-alerts/subscriptions.mjs";

export default { fetch: (request) => subscriptionRequest(request) };
