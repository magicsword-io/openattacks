import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";
import vercel from "@astrojs/vercel";

const base = process.env.BASE_PATH ?? "/";
const onVercel = process.env.VERCEL === "1";
// /catalog/ repeats the homepage and canonicalizes to /. Keep it crawlable, but
// out of the sitemap, including when BASE_PATH hosts the site under a prefix.
const catalogPath = `${base.replace(/\/$/, "")}/catalog/`;

export default defineConfig({
  // Keep canonical, sitemap and export links on the public domain, including previews.
  // SITE_URL remains available for an explicitly configured alternate deployment.
  site: process.env.SITE_URL || "https://openattacks.ai",
  base,
  output: "static",
  ...(onVercel && {
    adapter: vercel({ maxDuration: 20 }),
    build: { client: "./" },
  }),
  trailingSlash: "always",
  integrations: [
    sitemap({
      filter: (page) => new URL(page).pathname !== catalogPath,
    }),
    react(),
    {
      name: "openattacks-suggestions",
      hooks: {
        "astro:config:setup": ({ command, injectRoute }) => {
          injectRoute({
            pattern: "/suggest/intake.json",
            entrypoint: "./src/lib/suggestions-endpoint.ts",
            prerender: !onVercel && command !== "dev",
          });
        },
      },
    },
  ],
  devToolbar: { enabled: false },
});
