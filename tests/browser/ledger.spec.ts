import { test, expect } from "@playwright/test";

test("month headings follow the visible results after paging, sorting and filtering", async ({
  page,
}) => {
  async function checkMonths() {
    const groups = await page.locator("[data-entry-list]").evaluate((list) => {
      const results: { heading: string; dates: string[] }[] = [];
      for (const child of list.children) {
        const element = child as HTMLElement;
        if (element.hidden) continue;
        if (element.hasAttribute("data-month-heading")) {
          results.push({
            heading: element.textContent!.replace(/\s+/g, " ").trim(),
            dates: [],
          });
        } else {
          results.at(-1)!.dates.push(element.dataset.month!);
        }
      }
      return results;
    });
    expect(groups.length).toBeGreaterThan(0);
    for (const group of groups) {
      expect(new Set(group.dates).size).toBe(1);
      const label = new Intl.DateTimeFormat("en", {
        month: "long",
        year: "numeric",
        timeZone: "UTC",
      }).format(new Date(`${group.dates[0]}-01T00:00:00Z`));
      expect(group.heading).toBe(
        `Reported in ${label} ${group.dates.length} ${group.dates.length === 1 ? "entry" : "entries"} on this page`,
      );
    }
  }
  await page.goto("/");
  await checkMonths();
  await page.getByRole("button", { name: "Next page" }).click();
  await checkMonths();
  await page
    .getByRole("button", { name: "Sort by reported date, oldest first" })
    .click();
  await checkMonths();
  await page
    .getByRole("combobox", { name: "Filter by environment" })
    .selectOption("windows");
  await checkMonths();
  await page.getByRole("searchbox").fill("nonexistent-attack-xyz");
  await expect(page.locator("[data-month-heading]")).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "No matching attacks" }),
  ).toBeVisible();
});

test("legacy stack links preserve selections on the dedicated stack page", async ({
  page,
}) => {
  await page.goto("/?tools=cursor&os=windows&mcp=yes#your-stack");
  await expect(page).toHaveURL(
    /\/stack\/\?tools=cursor&os=windows&mcp=yes#your-stack$/,
  );
  await expect(
    page.getByRole("checkbox", { name: "Cursor", exact: true }),
  ).toBeChecked();
  await expect(
    page.getByRole("checkbox", { name: "Windows", exact: true }),
  ).toBeChecked();
  await expect(
    page.getByRole("radio", { name: "Yes", exact: true }),
  ).toBeChecked();
});

test("home and the legacy catalog expose working entries without JavaScript and share a canonical URL", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  for (const path of ["/", "/catalog/"]) {
    await page.goto(`${baseURL}${path}`);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      "https://openattacks.ai/",
    );
    await expect(page.locator("[data-attack-row]:visible")).toHaveCount(10);
    await expect(
      page.locator("noscript").getByRole("link", { name: "JSON export" }),
    ).toBeVisible();
    await page
      .locator("[data-attack-row]:visible")
      .first()
      .locator("a.incident-link")
      .click();
    await expect(
      page.getByRole("heading", { name: "What happened", exact: true }),
    ).toBeVisible();
    expect(
      await page
        .locator(".entry-story")
        .evaluate(
          (story) =>
            !!(
              story.compareDocumentPosition(
                document.querySelector("#attack-flow")!,
              ) & Node.DOCUMENT_POSITION_FOLLOWING
            ),
        ),
    ).toBe(true);
  }
  await context.close();
});
