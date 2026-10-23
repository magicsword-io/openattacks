import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
import type { Attack } from "../../src/lib/catalog";

const attacks: Attack[] = JSON.parse(
  readFileSync(new URL("../../dist/api/attacks.json", import.meta.url), "utf8"),
);

test("search, empty state, clear and keyboard shortcut work", async ({
  page,
}) => {
  await page.goto("/catalog/");
  await page.keyboard.press("/");
  await expect(page.getByRole("searchbox")).toBeFocused();
  await page.getByRole("searchbox").fill("cairn");
  await expect(page.locator("[data-attack-row]:visible")).toHaveCount(
    attacks.filter((a) => JSON.stringify(a).toLowerCase().includes("cairn"))
      .length,
  );
  await page.getByRole("searchbox").fill("nonexistent-attack-xyz");
  await expect(
    page.getByRole("heading", { name: "No matching attacks" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Clear all filters" }).click();
  await expect(page.locator("[data-attack-row]:visible")).toHaveCount(10);
});

test("role and year filters survive reload and reset pagination", async ({
  page,
}) => {
  await page.goto("/catalog/");
  await page.getByRole("button", { name: "Next page" }).click();
  await expect(page.locator("[data-page-status]")).toHaveText(
    `Showing 11–20 of ${attacks.length} entries`,
  );
  await page
    .getByRole("combobox", { name: "Filter by AI role", exact: true })
    .selectOption("ai_tool_as_lure");
  await page
    .getByRole("combobox", { name: "Filter by year", exact: true })
    .selectOption("2024");
  const expected = attacks.filter(
    (a) =>
      a.ai_role === "ai_tool_as_lure" && a.date_reported.startsWith("2024"),
  );
  await expect(page.locator("[data-attack-row]:visible")).toHaveCount(
    expected.length,
  );
  await page.reload();
  await expect(
    page.getByRole("combobox", { name: "Filter by year", exact: true }),
  ).toHaveValue("2024");
  await expect(page.locator("[data-attack-row]:visible")).toHaveCount(
    expected.length,
  );
});

test("all advanced filters and region filters narrow the real data", async ({
  page,
}) => {
  const sample = attacks.find(
    (a) => a.related_magicsword_projects.length && a.regions[0] !== "unknown",
  )!;
  await page.goto("/catalog/");
  await page
    .getByRole("combobox", { name: "Filter by region", exact: true })
    .selectOption(sample.regions[0]);
  await page.getByRole("button", { name: "More filters" }).click();
  await page
    .getByLabel("AI model or tool")
    .selectOption(sample.ai_tooling_and_models[0]);
  await page
    .getByLabel("Victim / sector")
    .selectOption(sample.victims_and_sectors);
  await page
    .getByLabel("Related project")
    .selectOption(sample.related_magicsword_projects[0]);
  await page
    .getByRole("combobox", { name: "Filter by confidence", exact: true })
    .selectOption("unassessed");
  await expect(page.locator("[data-attack-row]:visible")).toHaveCount(1);
  await expect(page.locator("[data-attack-row]:visible")).toHaveAttribute(
    "data-id",
    sample.id,
  );
  await page
    .getByRole("combobox", { name: "Filter by confidence", exact: true })
    .selectOption("high");
  await expect(
    page.getByRole("heading", { name: "No matching attacks" }),
  ).toBeVisible();
});

test("date sort starts with the oldest entry and month precision is preserved", async ({
  page,
}) => {
  await page.goto("/catalog/");
  await page
    .getByRole("button", { name: "Sort by reported date, oldest first" })
    .click();
  await expect(
    page.locator("[data-attack-row]:visible").first(),
  ).toHaveAttribute("data-id", "unit42-android-chatgpt-malware-2023");
  await page.goto("/attacks/cl-unk-1211-unit42-2026-10/");
  await expect(page.locator(".entry-meta time")).toHaveText("October 2026");
  await expect(page.getByText("October 2026 (month only)")).toBeVisible();
});

test("timeline filters match the source records", async ({ page }) => {
  await page.goto("/timeline/");
  await page
    .getByRole("combobox", { name: "Filter timeline by year" })
    .selectOption("2023");
  await page
    .getByRole("combobox", { name: "Filter timeline by AI role" })
    .selectOption("ai_tool_as_lure");
  await expect(page.locator(".timeline-entry:visible")).toHaveCount(1);
  await expect(page.locator("#timeline-count")).toHaveText("1 entry");
});

test("platform and sector groups match descriptions across different source labels", async ({
  page,
}) => {
  await page.goto("/catalog/");
  await page.getByRole("button", { name: "More filters" }).click();
  await page
    .getByLabel("AI model or tool")
    .selectOption("platform:claude-code");
  const claudeCount = attacks.filter((a) =>
    /claude[ -]?code/i.test(a.ai_tooling_and_models.join(" ")),
  ).length;
  await expect(page.locator("[data-results-count]")).toHaveText(
    `Found ${claudeCount} entries of ${attacks.length}`,
  );
  await page.getByLabel("AI model or tool").selectOption("");
  await page.getByLabel("Victim / sector").selectOption("category:government");
  const governmentCount = attacks.filter((a) =>
    /government|state-affiliated|diplomat|public sector/i.test(
      a.victims_and_sectors,
    ),
  ).length;
  await expect(page.locator("[data-attack-row]:visible")).toHaveCount(
    Math.min(10, governmentCount),
  );
  await page.getByLabel("Victim / sector").selectOption("");
  await page.getByLabel("Evidence type").selectOption("research");
  await expect(page.locator("[data-results-count]")).toHaveText(
    `Found ${attacks.filter((attack) => attack.borderline).length} entries of ${attacks.length}`,
  );
});

test("theme persists and mobile pages fit the viewport", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  await page.getByRole("button", { name: "Switch to light mode" }).click();
  await page.reload();
  await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
  for (const path of [
    "/",
    "/catalog/",
    "/timeline/",
    "/regions/",
    "/attacks/cairn-norforge-2026-10/",
    "/attacks/ghostaction-ai-creds-2026-10/",
  ]) {
    await page.goto(path);
    expect(
      await page.evaluate(() => document.body.scrollWidth <= innerWidth),
    ).toBe(true);
  }
});

test("public API is complete and every generated internal link resolves", async ({
  page,
  request,
}) => {
  const response = await request.get("/api/attacks.json");
  expect(await response.json()).toHaveLength(attacks.length);
  await page.goto("/");
  const paths = await page
    .locator('a[href^="/"]')
    .evaluateAll((links) => [
      ...new Set(
        links.map(
          (link) =>
            new URL(link.getAttribute("href")!, location.origin).pathname,
        ),
      ),
    ]);
  for (const path of paths)
    expect((await request.get(path)).status(), path).toBe(200);
});

test("main views meet automated WCAG AA checks in both themes", async ({
  page,
}) => {
  for (const theme of ["dark", "light"]) {
    await page.goto("/");
    if (theme === "light")
      await page.getByRole("button", { name: "Switch to light mode" }).click();
    for (const path of [
      "/",
      "/catalog/",
      "/timeline/",
      "/regions/",
      "/patterns/",
      "/attacks/cairn-norforge-2026-10/",
      "/attacks/ghostaction-ai-creds-2026-10/",
    ]) {
      await page.goto(path);
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(
        result.violations,
        `${theme} ${path}: ${JSON.stringify(result.violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) })))}`,
      ).toEqual([]);
    }
  }
});

test("dot timeline supports highlighting, pausing and reduced motion", async ({
  page,
}) => {
  await page.goto("/");
  await expect(
    page.locator("header .magicsword-logo img:visible"),
  ).toHaveAttribute("src", "/magicsword-logo-dark.svg");
  await page
    .locator('.legend-button[data-highlight="attacker_uses_ai_as_operator"]')
    .click();
  const count = attacks.filter(
    (attack) => attack.ai_role === "attacker_uses_ai_as_operator",
  ).length;
  await expect(page.locator('.chart-entry[data-muted="false"]')).toHaveCount(
    count,
  );
  await page.getByRole("button", { name: "Pause timeline animation" }).click();
  await expect(page.locator("[data-dot-chart]")).toHaveAttribute(
    "data-paused",
    "true",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/timeline/");
  await expect(page.locator("[data-dot-chart]")).toHaveAttribute(
    "data-paused",
    "true",
  );
});

test("map markers lead to normalized region filters", async ({ page }) => {
  await page.goto("/regions/");
  await expect(page.locator(".world-map")).toBeVisible();
  await page
    .getByRole("link", { name: "Hong Kong, 1 entry. Filter catalog." })
    .click();
  await expect(
    page.getByRole("combobox", { name: "Filter by region", exact: true }),
  ).toHaveValue("Hong Kong");
  await expect(page.locator("[data-attack-row]:visible")).toHaveCount(1);
  await expect(page.locator("[data-attack-row]:visible")).toHaveAttribute(
    "data-id",
    "arup-deepfake-video-fraud-2024-01",
  );
});

test("entry flows render with sources and controls; removed sections stay absent", async ({
  page,
}) => {
  await page.goto("/attacks/cairn-norforge-2026-10/");
  await expect(page.locator(".attack-flow-node")).toHaveCount(4);
  const viewport = page.locator(".react-flow__viewport");
  const before = await viewport.getAttribute("style");
  await page.getByRole("button", { name: "Zoom In", exact: true }).click();
  await expect.poll(() => viewport.getAttribute("style")).not.toBe(before);
  await page
    .getByText("Read the flow as text & sources", { exact: true })
    .click();
  await expect(page.locator(".flow-text li")).toHaveCount(4);
  await expect(
    page.getByRole("heading", { name: "MITRE ATLAS" }),
  ).toBeVisible();
  await expect(page.getByRole("heading", { name: "MITRE ATT&CK" })).toHaveCount(
    0,
  );
  await expect(
    page.getByRole("heading", { name: "The prevention angle" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "Related community projects" }),
  ).toHaveCount(0);
});

test("LLM entry points are discoverable on the landing page", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Give your AI the evidence." }),
  ).toBeVisible();
  const response = await request.get("/llms.txt");
  expect(response.ok()).toBe(true);
  const guide = await response.text();
  expect(guide).toContain(`${attacks.length} reported`);
  expect(guide).toContain("/llms-full.txt");
  expect(guide).toContain(`/api/attacks/${attacks[0].id}.md`);
  const entry = await request.get(`/api/attacks/${attacks[0].id}.json`);
  expect((await entry.json()).id).toBe(attacks[0].id);
});
