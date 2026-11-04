import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
import { createHash } from "node:crypto";
const catalog = JSON.parse(
  readFileSync(
    new URL("../../simulations/catalog.json", import.meta.url),
    "utf8",
  ),
);
const attackIds = [
  ...new Set(
    catalog.simulations.flatMap((s: any) =>
      s.attack_mappings.map((m: any) => m.attack_id),
    ),
  ),
] as string[];
for (const width of [1440, 390])
  for (const attackId of attackIds) {
    test(`packaged simulations on ${attackId} at ${width}px`, async ({
      page,
      context,
    }) => {
      await page.setViewportSize({ width, height: 1000 });
      const errors: string[] = [];
      page.on("pageerror", (e) => errors.push(e.message));
      await page.goto(`/attacks/${attackId}/`);
      await page.locator("header.entry-heading .simulation-available").click();
      const expected = catalog.simulations.filter((s: any) =>
        s.attack_mappings.some((m: any) => m.attack_id === attackId),
      );
      await expect(page.locator("[data-simulation]")).toHaveCount(
        expected.length,
      );
      await context.grantPermissions(["clipboard-read", "clipboard-write"]);
      for (const sim of expected) {
        const card = page.locator(`[data-simulation="${sim.id}"]`);
        await expect(card.locator(".simulation-tags")).not.toContainText(
          "AAT-",
        );
        await expect(card.locator(".simulation-footer")).not.toContainText(
          "Adapted from",
        );
        await expect(card).toContainText("macOS · ARM64 runner checked");
        await expect(card).toContainText("Linux · ARM64 runner checked");
        await card.locator("summary").click();
        await expect(card).toContainText(
          "Node.js 22.22+ is the only runtime dependency",
        );
        await expect(card).not.toContainText("mcp:lab");
        const prepare = await card.locator("pre code").first().textContent();
        expect(prepare).toContain(`npm run simulate -- prepare ${sim.id}`);
        expect(prepare).not.toContain("\\n");
        expect(prepare?.split("\n").length).toBeGreaterThan(1);
        for (const block of await card
          .locator(".simulation-copy-block")
          .all()) {
          await block.locator("button").click();
          expect(
            await page.evaluate(() => navigator.clipboard.readText()),
          ).toBe(await block.locator("code").textContent());
        }
      }
      await page.locator("#attack-flow").scrollIntoViewIfNeeded();
      const stageLinks = page.locator(
        width < 900 ? ".mobile-simulation-link" : ".network-simulation-link",
      );
      await expect(stageLinks.first()).toBeVisible();
      await stageLinks.first().click();
      await expect(page).toHaveURL(/#simulation$/);
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth + 1,
        ),
      ).toBe(true);
      for (const theme of ["dark", "light"]) {
        await page.evaluate(
          (t) => document.documentElement.setAttribute("data-theme", t),
          theme,
        );
        const result = await new AxeBuilder({ page })
          .include("#simulation")
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        expect(result.violations).toEqual([]);
      }
      expect(errors).toEqual([]);
    });
  }
test("lab download and exports match the seven checked definitions", async ({
  request,
  page,
}) => {
  const response = await request.get("/downloads/openattacks-labs.tar.gz");
  expect(response.ok()).toBe(true);
  const manifest = await (
    await request.get("/downloads/openattacks-labs.manifest.json")
  ).json();
  expect(
    createHash("sha256")
      .update(await response.body())
      .digest("hex"),
  ).toBe(manifest.sha256);
  expect(manifest.definition_count).toBe(7);
  const api = await (await request.get("/api/simulations.json")).json();
  expect(api).toEqual(catalog);
  for (const path of ["/", "/catalog/"]) {
    await page.goto(`${path}?q=invariant-mcp-tool-poisoning-2025-04`);
    const badge = page.locator(".simulation-catalog-badge:visible");
    await expect(badge).toHaveCount(1);
    await badge.click();
    await expect(page).toHaveURL(
      /\/attacks\/invariant-mcp-tool-poisoning-2025-04\/#simulation$/,
    );
    await expect(page.locator("#simulation-heading")).toBeVisible();
  }
  await page.goto("/attacks/cairn-norforge-2026-10/");
  await expect(page.locator("[data-simulation]")).toHaveCount(0);
  await expect(page.locator(".simulation-available")).toHaveCount(0);
});
test("lab instructions are available without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(
    `${baseURL}/attacks/invariant-mcp-tool-poisoning-2025-04/`,
  );
  await page.locator('[data-simulation="mcp-tool-poisoning"] summary').click();
  await expect(
    page.locator('[data-simulation="mcp-tool-poisoning"] .simulation-prompt'),
  ).toContainText("Summarize synthetic issue");
  await context.close();
});
