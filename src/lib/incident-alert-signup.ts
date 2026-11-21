import { getSettings } from "../../server/incident-alerts/settings.mjs";

// Keep static previews and mirrors useful while the production service is off.
export const incidentAlertSignupAvailable = process.env.VERCEL_ENV
  ? Boolean(getSettings(process.env)?.live)
  : import.meta.env.BASE_URL === "/";
