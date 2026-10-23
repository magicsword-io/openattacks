import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests/browser",
  fullyParallel: true,
  workers: 2,
  use: {
    baseURL: "http://127.0.0.1:4323",
    viewport: { width: 1440, height: 1000 },
    trace: "retain-on-failure",
  },
  webServer: {
    command: "python3 -m http.server 4323 --bind 127.0.0.1 --directory dist",
    url: "http://127.0.0.1:4323",
    reuseExistingServer: !process.env.CI,
  },
});
