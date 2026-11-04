import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
import type { Attack } from "../../src/lib/catalog";

const browse = JSON.parse(
  readFileSync(new URL("../../dist/api/catalog.json", import.meta.url), "utf8"),
);

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
    .getByRole("combobox", { name: "Filter by attack pattern", exact: true })
    .selectOption("ai_tool_as_lure");
  await page.getByRole("button", { name: "More filters" }).click();
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

test("environment and evidence filters use the browse index and can be removed separately", async ({
  page,
}) => {
  await page.goto("/catalog/?environment=windows&evidence=campaign");
  const expected = browse.entries.filter(
    (a: { environments: string[]; evidence: string }) =>
      a.environments.includes("windows") && a.evidence === "campaign",
  );
  await expect(page.locator("[data-attack-row]:visible")).toHaveCount(
    Math.min(10, expected.length),
  );
  const ids = await page
    .locator("[data-attack-row]:visible")
    .evaluateAll((rows) => rows.map((row) => row.getAttribute("data-id")));
  expect(
    ids.every((id) => expected.some((a: { id: string }) => a.id === id)),
  ).toBe(true);
  await page
    .getByRole("button", { name: "Remove filter: Windows", exact: true })
    .click();
  await expect(
    page.getByRole("combobox", { name: "Filter by environment" }),
  ).toHaveValue("");
  await expect(
    page.getByRole("combobox", { name: "Filter by evidence type" }),
  ).toHaveValue("campaign");
  await expect(page).toHaveURL(/evidence=campaign/);
  await page.reload();
  await expect(
    page.getByRole("combobox", { name: "Filter by evidence type" }),
  ).toHaveValue("campaign");
  await page.getByRole("button", { name: "More filters" }).click();
  await expect(
    page.getByRole("combobox", { name: "Filter by confidence" }),
  ).toHaveCount(0);
  await expect(page.getByLabel("Related project")).toHaveCount(0);
  expect(
    await page
      .getByLabel("Model / platform")
      .locator("option")
      .evaluateAll((options) =>
        options.every(
          (option) =>
            !option.getAttribute("value") ||
            option.getAttribute("value")!.startsWith("platform:"),
        ),
      ),
  ).toBe(true);
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
  await expect(
    page.locator(".entry-meta").getByText(/October 2026 \(month only\)/),
  ).toBeVisible();
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
    .getByLabel("Model / platform")
    .selectOption("platform:claude-code");
  const claudeCount = attacks.filter((a) =>
    /claude[ -]?code/i.test(a.ai_tooling_and_models.join(" ")),
  ).length;
  await expect(page.locator("[data-results-count]")).toHaveText(
    `Found ${claudeCount} entries of ${attacks.length}`,
  );
  await page.getByLabel("Model / platform").selectOption("");
  await page
    .getByRole("combobox", { name: /^Sector/ })
    .selectOption("category:government");
  const governmentCount = attacks.filter((a) =>
    /government|state-affiliated|diplomat|public sector/i.test(
      a.victims_and_sectors,
    ),
  ).length;
  await expect(page.locator("[data-attack-row]:visible")).toHaveCount(
    Math.min(10, governmentCount),
  );
  await page.getByRole("combobox", { name: /^Sector/ }).selectOption("");
  await page
    .getByRole("combobox", { name: "Filter by evidence type" })
    .selectOption("research");
  await expect(page.locator("[data-results-count]")).toHaveText(
    `Found ${browse.entries.filter((entry: { evidence: string }) => entry.evidence === "research").length} entries of ${attacks.length}`,
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

// Give every page/theme scan its own timeout and trace. Sixteen scans in one
// test shared a 30-second budget and timed out on the slower CI runner.
for (const theme of ["dark", "light"]) {
  test.describe(`WCAG AA in ${theme} theme`, () => {
    test.use({ reducedMotion: "reduce" });
    for (const path of [
      "/",
      "/catalog/",
      "/timeline/",
      "/regions/",
      "/patterns/",
      "/attacks/cairn-norforge-2026-10/",
      "/attacks/ghostaction-ai-creds-2026-10/",
      "/attacks/huntress-plus56-custom-gpt-clickfix-2026-09/",
    ]) {
      test(path, async ({ page }) => {
        await page.addInitScript((selectedTheme) => {
          localStorage.setItem("openattacks-theme", selectedTheme);
        }, theme);
        await page.goto(path);
        await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
        const result = await new AxeBuilder({ page })
          .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
          .analyze();
        expect(
          result.violations,
          `${theme} ${path}: ${JSON.stringify(result.violations.map((v) => ({ id: v.id, targets: v.nodes.map((n) => n.target) })))}`,
        ).toEqual([]);
      });
    }
  });
}

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
  await expect(page.locator(".stage-inspector")).toHaveCount(0);
  await page.locator(".technical-details > summary").click();
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
    page.locator("footer").getByRole("link", { name: "llms.txt", exact: true }),
  ).toBeVisible();
  await page.goto("/about/");
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

test("network stages expose scoped policy opportunities and all three hunt formats", async ({
  page,
  request,
}) => {
  await page.goto("/attacks/huntress-plus56-custom-gpt-clickfix-2026-09/");
  await page.locator("#attack-flow").scrollIntoViewIfNeeded();
  await expect(page.locator(".network-orb svg")).toHaveCount(4);
  await page
    .getByRole("button", {
      name: "Inspect stage 3: PowerShell launches the payload chain",
      exact: true,
    })
    .click();
  await expect(page.locator(".stage-inspector")).toHaveAttribute(
    "data-stage-id",
    "step-3",
  );
  await expect(
    page.getByRole("tab", { name: "Evidence", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".stage-evidence a").first()).toHaveAttribute(
    "href",
    "#source-1",
  );
  await page.getByRole("tab", { name: "Prevent", exact: true }).click();
  await expect(page.locator(".stage-control")).toContainText(
    "PREVENT WITH MAGICSWORD",
  );
  await expect(page.locator(".stage-control")).toContainText("Windows");
  await expect(page.locator(".network-control-link")).toHaveAttribute(
    "href",
    /https:\/\/www\.magicsword\.io\/use-cases\/application-control\?utm_source=openattacks/,
  );
  await expect(page.locator(".policy-prerequisite")).toContainText(
    "enforced Windows policy",
  );
  await page.getByRole("tab", { name: /Hunt/ }).click();
  await page
    .getByText("Explore Sigma, KQL & SPL starters", { exact: false })
    .click();
  await page.getByRole("tab", { name: "KQL", exact: true }).click();
  await expect(page.locator(".hunt-code:not(.mcp-brief)")).toContainText(
    "DeviceProcessEvents",
  );
  await page.locator(".hunt-code:not(.mcp-brief)").focus();
  await expect(page.locator(".hunt-code:not(.mcp-brief)")).toBeFocused();
  for (const theme of ["dark", "light"]) {
    if (theme === "light")
      await page.getByRole("button", { name: "Switch to light mode" }).click();
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(result.violations, `${theme} native query`).toEqual([]);
  }
  await page.getByRole("button", { name: "Switch to dark mode" }).click();
  await page.getByRole("tab", { name: "SPL", exact: true }).click();
  await expect(page.locator(".hunt-code:not(.mcp-brief)")).toContainText(
    "EventCode=1",
  );
  await page.getByRole("tab", { name: "SPL", exact: true }).press("ArrowRight");
  await expect(
    page.getByRole("tab", { name: "Sigma", exact: true }),
  ).toBeFocused();
  await expect(page.locator(".hunt-code:not(.mcp-brief)")).toContainText(
    "status: experimental",
  );
  await page
    .getByRole("button", {
      name: "View stage 1: Custom GPT attracts a user",
      exact: true,
    })
    .click();
  await expect(page.locator(".stage-control")).toHaveCount(0);
  await page.getByRole("tab", { name: "Prevent", exact: true }).click();
  await expect(page.locator(".stage-no-control")).toContainText(
    "No MagicSword execution-policy opportunity is mapped",
  );
  await page.getByRole("button", { name: "Close stage details" }).click();
  await expect(page.locator(".stage-inspector")).toHaveCount(0);
  await expect(
    page.getByRole("button", {
      name: "View stage 1: Custom GPT attracts a user",
      exact: true,
    }),
  ).toBeFocused();
  const pack = await request.get(
    "/api/defenses/huntress-plus56-custom-gpt-clickfix-2026-09.json",
  );
  expect((await pack.json()).stages).toHaveLength(4);
});

test("mobile stage navigation and unmapped evidence remain usable", async ({
  page,
}) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto("/attacks/cairn-norforge-2026-10/");
  await page.locator("#attack-flow").scrollIntoViewIfNeeded();
  await expect(page.locator(".react-flow")).toHaveCount(0);
  await expect(page.locator(".mobile-network-stages > li")).toHaveCount(4);
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("#attack-flow").scrollIntoViewIfNeeded();
  await page
    .getByRole("button", {
      name: "View stage 2: Coding agents plan and retry",
      exact: true,
    })
    .click();
  await expect(page.locator(".stage-inspector")).toHaveAttribute(
    "data-stage-id",
    "step-2",
  );
  await expect(page.locator(".react-flow")).toHaveCount(0);
  await expect(page.locator(".mobile-network-stages > li")).toHaveCount(4);
  await expect(page.locator(".mobile-stage-connections button")).toHaveCount(
    attacks.find((a) => a.id === "cairn-norforge-2026-10")!.attack_flow!.edges
      .length,
  );
  await page.getByRole("tab", { name: /Hunt/ }).click();
  await expect(page.locator(".stage-hunt")).toContainText(
    "Provider / operator records",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.goto("/attacks/wormgpt-underground-2023/");
  await page.locator("#attack-flow").scrollIntoViewIfNeeded();
  await page.locator(".network-stage-picker button").first().click();
  await expect(page.getByRole("tab", { name: /Hunt/ })).toHaveCount(0);
  await expect(page.locator(".stage-query-details")).toHaveCount(0);
  await page.goto("/attacks/c2agent-unit42-2026-10/");
  await page.locator("#attack-flow").scrollIntoViewIfNeeded();
  await expect(
    page
      .locator(".mobile-stage-connections button")
      .filter({ hasText: "Repeats to" }),
  ).toHaveCount(1);
  await expect(page.locator(".mobile-stage-connections button")).toHaveCount(
    attacks.find((a) => a.id === "c2agent-unit42-2026-10")!.attack_flow!.edges
      .length,
  );
  await page.goto("/attacks/apex-accelerator-ref8801-2026-10/");
  await page.locator("#attack-flow").scrollIntoViewIfNeeded();
  await expect(page.locator(".mobile-stage-connections button")).toHaveCount(
    attacks.find((a) => a.id === "apex-accelerator-ref8801-2026-10")!
      .attack_flow!.edges.length,
  );
  await expect(page.locator(".mobile-policy-link").first()).toHaveAttribute(
    "href",
    /https:\/\/www\.magicsword\.io\/use-cases\/application-control\?utm_source=openattacks/,
  );
});

test("homepage shows the dot timeline above the searchable catalog and offers optional stack matching", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.locator("[data-dot-chart]")).toBeVisible();
  await expect(page.locator(".chart-entry")).toHaveCount(attacks.length);
  await expect(page.locator("[data-stack-explorer]")).toHaveCount(0);
  await expect(page.locator("[data-attack-row]:visible")).toHaveCount(10);
  const timeline = await page.locator(".home-timeline").boundingBox();
  const catalog = await page.locator("[data-catalog]").boundingBox();
  expect(timeline!.y + timeline!.height).toBeLessThanOrEqual(catalog!.y);
  await page
    .getByRole("link", { name: "Browse the catalog", exact: true })
    .click();
  await expect(page).toHaveURL(/#catalog$/);
  await expect(page.getByRole("searchbox")).toBeInViewport();
  await page
    .getByRole("link", { name: "Find attacks relevant to my stack" })
    .click();
  await expect(page).toHaveURL(/\/stack\/$/);
  await page.getByRole("checkbox", { name: "Cursor", exact: true }).check();
  await expect(page.locator("[data-stack-results]")).toBeVisible();
});

test("qualifications stay before the diagram and custom schema guidance stays explicit", async ({
  page,
}) => {
  await page.goto("/attacks/ghostaction-ai-creds-2026-10/");
  await expect(page.locator(".entry-qualification")).toBeVisible();
  expect(
    await page.evaluate(() => {
      const qualification = document.querySelector(".entry-qualification")!;
      const flow = document.querySelector("#attack-flow")!;
      return !!(
        qualification.compareDocumentPosition(flow) &
        Node.DOCUMENT_POSITION_FOLLOWING
      );
    }),
  ).toBe(true);
  await expect(page.locator(".technical-details")).not.toHaveAttribute(
    "open",
    "",
  );
  await page.goto("/attacks/cairn-norforge-2026-10/");
  await page
    .getByRole("button", {
      name: "View stage 2: Coding agents plan and retry",
      exact: true,
    })
    .click();
  await page.getByRole("tab", { name: /Hunt/ }).click();
  await expect(page.locator(".stage-query-details > summary")).toContainText(
    "custom schema",
  );
  await expect(page.locator(".stage-query-details > summary")).toContainText(
    "Requires log collection and field mapping",
  );
  await page.locator(".stage-query-details > summary").click();
  await page.getByRole("tab", { name: "KQL", exact: true }).click();
  await expect(page.locator(".hunt-code:not(.mcp-brief)")).toContainText(
    "OpenAttacksAudit_CL",
  );
  for (const name of ["Evidence", "Prevent", "Hunt"]) {
    await page.getByRole("tab", { name: new RegExp(`^${name}`) }).click();
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(result.violations, name).toEqual([]);
  }
});
