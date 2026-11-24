import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const repo = "https://github.com/magicsword-io/openattacks";
const incident = "cairn-norforge-2026-10";

test("the landing hero links to all submission options without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const page = await browser.newPage({ baseURL, javaScriptEnabled: false });
  for (const width of [1440, 360]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    const suggest = page
      .locator(".catalog-intro")
      .getByRole("link", { name: "Suggest an update" });
    await expect(suggest).toBeInViewport();
    await suggest.click();
    await expect(
      page.getByRole("heading", { name: "Suggest an update" }),
    ).toBeVisible();
    for (const [name, path] of [
      ["Submit an attack", "issues/new?template=submit-attack.yml"],
      ["Correct an entry", "issues/new?template=correction.yml"],
      [
        "Suggest a catalog improvement",
        "issues/new?title=Catalog+suggestion%3A+",
      ],
      ["Browse public issues", "issues"],
      [
        "Report an OpenAttacks vulnerability privately on GitHub",
        "security/advisories/new",
      ],
    ]) {
      const link = page.getByRole("link", { name });
      await expect(link).toBeVisible();
      await expect(link).toHaveAttribute("href", `${repo}/${path}`);
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await page.close();
});

test("the suggestion page is accessible and explains public submissions", async ({
  page,
}) => {
  await page.goto("/suggest/");
  await expect(
    page.getByText(/sign in to GitHub to submit a public issue/i),
  ).toBeVisible();
  const accessibility = await new AxeBuilder({ page })
    .include("main")
    .analyze();
  expect(accessibility.violations).toEqual([]);
});

test("the correction link prefills the entry in GitHub's issue form", async ({
  page,
}) => {
  await page.goto(`/attacks/${incident}/`);
  await page.getByText("Record & downloads", { exact: true }).click();
  const correction = page.getByRole("link", { name: "Suggest a correction" });
  await expect(correction).toBeVisible();
  const url = new URL((await correction.getAttribute("href"))!);
  expect(url.origin + url.pathname).toBe(`${repo}/issues/new`);
  expect(url.searchParams.get("template")).toBe("correction.yml");
  expect(url.searchParams.get("title")).toMatch(/^Correction: .+/);
  expect(url.searchParams.get("entry")).toBe(incident);
});
