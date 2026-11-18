import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("regions page links to the pew pew map", async ({ page }) => {
  await page.goto("/regions/");
  await page.getByRole("link", { name: "Open the pew pew map" }).click();
  await expect(page).toHaveURL(/\/pewpew\/$/);
  await expect(page.getByRole("heading", { name: "Pew pew." })).toBeVisible();
});

test("homepage easter egg links to the map and 'pew' opens it", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("link", { name: "pew pew" })).toHaveAttribute(
    "href",
    "/pewpew/",
  );
  // Typing in search must not trigger it.
  await page.getByRole("searchbox").fill("pew");
  await expect(page).toHaveURL(/\?q=pew$/);
  await expect(page).not.toHaveURL(/pewpew/);
  await page.getByRole("searchbox").blur();
  await page.keyboard.type("pew");
  await expect(page).toHaveURL(/\/pewpew\/$/);
});

test("every map marker has a matching country group with entries", async ({
  page,
}) => {
  await page.goto("/pewpew/");
  const markers = page.locator("[data-country]");
  const groups = page.locator("details.pewpew-country");
  await expect(groups).toHaveCount(await markers.count());
  expect(await markers.count()).toBeGreaterThan(0);

  await page.locator('[data-country="country-ukraine"]').click();
  const ukraine = page.locator("#country-ukraine");
  await expect(ukraine).toHaveAttribute("open", "");
  await expect(
    ukraine.getByRole("link", { name: /PROMPTSTEAL|LAMEHUG|APT28/i }),
  ).toBeVisible();
  await expect(ukraine.getByText("Reported target").first()).toBeVisible();
});

test("lasers fire and can be paused", async ({ page }) => {
  await page.goto("/pewpew/");
  const count = page.locator("[data-pew-count]");
  await expect(count).not.toHaveText("0");
  const toggle = page.getByRole("button", { name: "Pause the lasers" });
  await toggle.click();
  await expect(
    page.getByRole("button", { name: "Resume the lasers" }),
  ).toHaveAttribute("aria-pressed", "true");
  const frozen = await count.textContent();
  await page.waitForTimeout(1000);
  await expect(count).toHaveText(frozen!);
});

test("reduced motion starts paused", async ({ browser }) => {
  const context = await browser.newContext({ reducedMotion: "reduce" });
  const page = await context.newPage();
  await page.goto("/pewpew/");
  await expect(
    page.getByRole("button", { name: "Resume the lasers" }),
  ).toBeVisible();
  await page.waitForTimeout(1000);
  await expect(page.locator("[data-pew-count]")).toHaveText("0");
  await context.close();
});

test("wall mode fills the viewport and exits with Escape", async ({
  page,
}) => {
  await page.setViewportSize({ width: 1920, height: 1080 });
  await page.goto("/pewpew/?wall");
  const screen = page.locator("[data-pewpew]");
  await expect(screen).toHaveClass(/is-wall/);
  const box = (await screen.boundingBox())!;
  expect(box.width).toBe(1920);
  expect(box.height).toBe(1080);
  // The map takes most of the wall, not a postage stamp in the corner.
  const map = (await page.locator(".pewpew-map").boundingBox())!;
  expect(map.width).toBeGreaterThan(1300);
  await expect(page.locator("[data-pew-log] li").first()).not.toHaveText(
    "Awaiting pews…",
  );
  await page.keyboard.press("Escape");
  await expect(screen).not.toHaveClass(/is-wall/);
  await expect(
    page.getByRole("button", { name: "Full screen" }),
  ).toBeVisible();
});

for (const theme of ["dark", "light"]) {
  test(`pew pew map has no axe violations (${theme})`, async ({ page }) => {
    await page.addInitScript((selectedTheme) => {
      localStorage.setItem("openattacks-theme", selectedTheme);
    }, theme);
    await page.goto("/pewpew/");
    await page.locator("#country-ukraine summary").click();
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
      .analyze();
    expect(
      result.violations,
      JSON.stringify(
        result.violations.map((v) => ({
          id: v.id,
          targets: v.nodes.map((n) => n.target),
        })),
      ),
    ).toEqual([]);
  });
}
