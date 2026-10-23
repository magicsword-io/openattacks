import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import react from "@astrojs/react";

// The deploy workflow supplies /ai-attacks; local and validation builds use the root.
export default defineConfig({
  site: process.env.SITE_URL || "https://magicsword-io.github.io",
  base: process.env.BASE_PATH ?? "/",
  output: "static",
  trailingSlash: "always",
  integrations: [sitemap(), react()],
  devToolbar: { enabled: false },
});
