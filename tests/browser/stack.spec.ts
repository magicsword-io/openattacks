import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import { readFileSync } from "node:fs";
import { matchStack } from "../../src/lib/stack-matching.mjs";
const index = JSON.parse(
  readFileSync(
    new URL("../../dist/api/relevance.json", import.meta.url),
    "utf8",
  ),
);

test("stack selection explains matches and deduplicates reports", async ({
  page,
}) => {
  await page.goto("/stack/");
  await page.getByRole("checkbox", { name: "Cursor", exact: true }).check();
  await page.getByRole("radio", { name: "Yes", exact: true }).check();
  const expected = matchStack(index.entries, { tools: ["cursor"], mcp: "yes" });
  await expect(page.locator("[data-stack-count]")).toHaveText(
    `${expected.length} reports to review`,
  );
  await expect(page.locator("[data-stack-result]:visible")).toHaveCount(4);
  await expect(page.locator("[data-stack-default]")).toBeHidden();
  const first = page.locator("[data-stack-result]:visible").first();
  await expect(first).toContainText("Why it matches");
  await expect(first).toContainText("Start here");
  await expect(first).toContainText("confirm affected version");
  await first.locator("summary").click();
  await expect(first.locator("[data-stack-conditions]")).toContainText(
    "installed version",
  );
  await page
    .getByRole("button", { name: `Show all ${expected.length} reports` })
    .click();
  const ids = await page
    .locator("[data-stack-result]:visible")
    .evaluateAll((rows) =>
      rows.map((row) => row.getAttribute("data-stack-result")),
    );
  expect(new Set(ids).size).toBe(expected.length);
  expect(ids).not.toContain("gtg-1002-anthropic-claude-code-espionage-2025-11");
  await page.getByRole("button", { name: "Clear selections" }).click();
  await expect(page.locator("[data-stack-default]")).toBeVisible();
  await expect(page.locator("[data-stack-results]")).toBeHidden();
});
test("MCP answers and operating systems enforce explicit applicability conditions", async ({
  page,
}) => {
  await page.goto("/stack/?tools=cursor&mcp=no");
  await expect(
    page.locator('[data-stack-result="cursor-mcpoison-cve-2025-54136"]'),
  ).toBeHidden();
  await page.getByRole("radio", { name: "Not sure", exact: true }).check();
  const cursor = page.locator(
    '[data-stack-result="cursor-mcpoison-cve-2025-54136"]',
  );
  await expect(cursor).toBeVisible();
  await cursor.locator("summary").click();
  await expect(cursor).toContainText("you have not confirmed");
  await page.goto("/stack/?tools=claude&os=macos");
  await expect(
    page.getByRole("checkbox", {
      name: "Claude / Claude Desktop",
      exact: true,
    }),
  ).toBeChecked();
  await expect(
    page.locator('[data-stack-result="adception-claude-mac-2026-10"]'),
  ).toBeVisible();
  await expect(page.locator("[data-stack-policy]:visible")).toHaveCount(0);
  await page.goto("/stack/?tools=grok&os=macos");
  await expect(page.locator("[data-stack-empty]")).toBeVisible();
  await expect(page.locator("[data-stack-empty]")).toContainText(
    "missing matches do not establish safety",
  );
});
test("share links preserve multi-select state, can be copied and ignore unknown values", async ({
  page,
  context,
}) => {
  await context.grantPermissions(["clipboard-read", "clipboard-write"]);
  await page.goto(
    "/stack/?tools=claude-code,cursor,unknown&os=windows&mcp=yes#your-stack",
  );
  await expect(
    page.getByRole("checkbox", { name: "Cursor", exact: true }),
  ).toBeChecked();
  await expect(
    page.getByRole("checkbox", { name: "Claude Code", exact: true }),
  ).toBeChecked();
  await page.getByRole("button", { name: "Copy this view" }).click();
  const copied = await page.evaluate(() => navigator.clipboard.readText());
  expect(copied).toContain("tools=cursor%2Cclaude-code");
  expect(copied).toContain("#your-stack");
  expect(copied).not.toContain("unknown");
  await page.goto(copied);
  await expect(
    page.getByRole("checkbox", { name: "Windows", exact: true }),
  ).toBeChecked();
  await expect(
    page.getByRole("radio", { name: "Yes", exact: true }),
  ).toBeChecked();
  await page.getByRole("button", { name: "Clear selections" }).click();
  await expect(page).not.toHaveURL(/tools=/);
});
test("uncertain visitors get distinct inventory and MagicSword MCP handoffs", async ({
  page,
}) => {
  await page.goto("/stack/?mcp=unknown#your-stack");
  await expect(page.locator("[data-stack-inventory]")).toHaveClass(
    /is-uncertain/,
  );
  await expect(page.locator("[data-stack-results]")).toBeHidden();
  await expect(
    page.getByRole("link", { name: "Explore MagicSword inventory" }),
  ).toHaveAttribute(
    "href",
    /https:\/\/www\.magicsword\.io\/use-cases\/endpoint-visibility\?utm_source=openattacks/,
  );
  await expect(
    page.getByRole("link", { name: "Connect MagicSword MCP" }),
  ).toHaveAttribute("href", /\/mcp\?.*utm_source=openattacks.*#connect$/);
  await expect(page.locator("[data-stack-inventory]")).toContainText(
    "requires an Enterprise organization",
  );
});
test("personalized links open the relevant hunt or policy stage directly", async ({
  page,
}) => {
  await page.goto("/stack/?tools=chatgpt&os=windows#your-stack");
  const card = page.locator(
    '[data-stack-result="huntress-plus56-custom-gpt-clickfix-2026-09"]',
  );
  await expect(card).toBeVisible();
  await card.getByRole("link", { name: "Explore draft hunt" }).click();
  await expect(page.locator(".stage-inspector")).toHaveAttribute(
    "data-stage-id",
    "step-3",
  );
  await expect(page.getByRole("tab", { name: /Hunt/ })).toHaveAttribute(
    "aria-selected",
    "true",
  );
  await page.goto(
    "/attacks/huntress-plus56-custom-gpt-clickfix-2026-09/?stage=invalid&view=hunt#attack-flow",
  );
  await expect(page.locator(".stage-inspector")).toHaveCount(0);
  await page.goto("/stack/?tools=chatgpt&os=windows#your-stack");
  await page
    .locator(
      '[data-stack-result="huntress-plus56-custom-gpt-clickfix-2026-09"]',
    )
    .getByRole("link", { name: "Windows policy opportunity" })
    .click();
  await expect(
    page.getByRole("tab", { name: "Prevent", exact: true }),
  ).toHaveAttribute("aria-selected", "true");
  await expect(page.locator(".policy-prerequisite")).toContainText(
    "enforced Windows policy",
  );
});
test("personalization is keyboard operable and accessible on mobile in both themes", async ({
  page,
}) => {
  for (const theme of ["dark", "light"]) {
    await page.goto("/stack/?tools=cursor&mcp=yes#your-stack");
    if (theme === "light")
      await page.getByRole("button", { name: "Switch to light mode" }).click();
    await page.locator(".stack-more-tools > summary").click();
    await page
      .locator("[data-stack-result]:visible")
      .first()
      .locator("summary")
      .click();
    for (const width of [1440, 390]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const result = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(result.violations, `${theme} ${width}`).toEqual([]);
    }
  }
  const cursor = page.getByRole("checkbox", { name: "Cursor", exact: true });
  await cursor.focus();
  await cursor.press("Space");
  await expect(cursor).not.toBeChecked();
});
test("without JavaScript the stack page keeps its catalog and data entry points", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/stack/`);
  await expect(page.locator("noscript .stack-results-context")).toBeVisible();
  await expect(page.locator("noscript .stack-results-context")).toContainText(
    "Stack selection requires JavaScript.",
  );
  await expect(
    page.getByRole("link", { name: "Browse all 68 entries", exact: true }),
  ).toBeVisible();
  await context.close();
});
