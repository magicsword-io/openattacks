import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

export default defineConfig({
  // Keep canonical, sitemap and export links on the public domain, including previews.
  // SITE_URL remains available for an explicitly configured alternate deployment.
  site: process.env.SITE_URL || "https://openattacks.ai",
  base: process.env.BASE_PATH ?? "/",
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap(), react()],
  devToolbar: { enabled: false },
});
