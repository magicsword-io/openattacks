import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

test("incident alerts are discoverable and have a keyboard-accessible email form", async ({
  browser,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    viewport: { width: 390, height: 844 },
  });
  const page = await context.newPage();
  await page.goto("/");
  await page
    .getByRole("banner")
    .getByRole("link", { name: "Get alerts" })
    .click();
  await expect(
    page.getByRole("heading", { name: "Get incident alerts" }),
  ).toBeVisible();
  const email = page.getByRole("textbox", { name: "Email address" });
  await expect(email).toHaveAttribute("autocomplete", "email");
  await expect(email).toHaveAttribute("required", "");
  await expect(page.locator('script[src*="googletagmanager"]')).toHaveCount(0);
  await email.fill("reader@example.test");
  await page.route("**/api/incident-alerts", async (route) => {
    expect(route.request().method()).toBe("POST");
    expect(
      new URLSearchParams(route.request().postData() ?? "").get("email"),
    ).toBe("reader@example.test");
    await route.fulfill({
      contentType: "text/html",
      body: "<h1>Check your inbox</h1>",
    });
  });
  await email.press("Enter");
  await expect(
    page.getByRole("heading", { name: "Check your inbox" }),
  ).toBeVisible();
  await context.close();
});

test("incident alert form meets automated accessibility checks", async ({
  page,
}) => {
  await page.goto("/alerts/");
  const result = await new AxeBuilder({ page }).include("main").analyze();
  expect(result.violations).toEqual([]);
});

test("get alerts opens an accessible signup dialog and restores focus", async ({
  page,
}) => {
  await page.goto("/");
  const trigger = page
    .getByRole("banner")
    .getByRole("link", { name: "Get alerts" });
  await trigger.click();
  const dialog = page.getByRole("dialog", { name: "Get incident alerts" });
  await expect(
    dialog.getByRole("textbox", { name: "Email address" }),
  ).toBeVisible();
  const result = await new AxeBuilder({ page })
    .include("#incident-alert-dialog")
    .analyze();
  expect(result.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});
