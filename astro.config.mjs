import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

// Vercel supplies its production domain; SITE_URL can override it for a custom host.
const vercelHost =
  process.env.VERCEL_PROJECT_PRODUCTION_URL || process.env.VERCEL_URL;

export default defineConfig({
  site:
    process.env.SITE_URL ||
    (vercelHost ? `https://${vercelHost}` : "https://magicsword-io.github.io"),
  base: process.env.BASE_PATH ?? "/",
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap(), react()],
  devToolbar: { enabled: false },
});
