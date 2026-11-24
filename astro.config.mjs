import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

const base = process.env.BASE_PATH ?? "/";
// /catalog/ repeats the homepage and canonicalizes to /. Keep it crawlable, but
// out of the sitemap, including when BASE_PATH hosts the site under a prefix.
const catalogPath = `${base.replace(/\/$/, "")}/catalog/`;

export default defineConfig({
  // Keep canonical, sitemap and export links on the public domain, including previews.
  // SITE_URL remains available for an explicitly configured alternate deployment.
  site: process.env.SITE_URL || "https://openattacks.ai",
  base,
  output: "static",
  trailingSlash: "always",
  integrations: [
    sitemap({
      filter: (page) => new URL(page).pathname !== catalogPath,
    }),
    react(),
  ],
  devToolbar: { enabled: false },
});
