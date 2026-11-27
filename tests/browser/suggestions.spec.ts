import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const repo = "https://github.com/magicsword-io/openattacks";
const incident = "cairn-norforge-2026-10";
const reportId = process.env.PUBLIC_INCIDENT_REPORT_FORM_ID?.trim();
const configured = Boolean(reportId && /^[a-z0-9]+$/i.test(reportId));

test("the landing hero links to all submission options without JavaScript", async ({
  browser,
  baseURL,
}) => {
  test.skip(
    configured,
    "Checks the GitHub links when the report form is unset.",
  );
  const page = await browser.newPage({ baseURL, javaScriptEnabled: false });
  for (const width of [1440, 360]) {
    await page.setViewportSize({ width, height: 800 });
    await page.goto("/");
    const report = page
      .locator(".catalog-intro")
      .getByRole("link", { name: "Report an incident" });
    await expect(report).toBeInViewport();
    await report.click();
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
        "Report an OpenAttacks vulnerability privately",
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
  const guidance = configured
    ? "Reports go to the OpenAttacks team through Formspree."
    : "Use GitHub to submit a public issue.";
  await expect(
    page.getByRole("main").getByText(guidance, { exact: false }),
  ).toBeVisible();
  const accessibility = await new AxeBuilder({ page })
    .include("main")
    .analyze();
  expect(accessibility.violations).toEqual([]);
});

test("the correction link prefills the related entry", async ({ page }) => {
  await page.goto(`/attacks/${incident}/`);
  await page.getByText("Record & downloads", { exact: true }).click();
  const correction = page.getByRole("link", { name: "Suggest a correction" });
  await expect(correction).toBeVisible();
  const url = new URL((await correction.getAttribute("href"))!, page.url());
  if (configured) {
    expect(url.pathname).toBe("/suggest/");
    expect(url.searchParams.get("type")).toBe("change");
    expect(url.searchParams.get("incident")).toBe(incident);
    await correction.click();
    const main = page.getByRole("main");
    await expect(
      main.getByRole("radio", { name: "Suggestion or correction" }),
    ).toBeChecked();
    await expect(
      main.getByRole("textbox", { name: "Related OpenAttacks entry" }),
    ).toHaveValue(incident);
    return;
  }
  expect(url.origin + url.pathname).toBe(`${repo}/issues/new`);
  expect(url.searchParams.get("template")).toBe("correction.yml");
  expect(url.searchParams.get("title")).toMatch(/^Correction: .+/);
  expect(url.searchParams.get("entry")).toBe(incident);
});

test("the homepage opens a keyboard-accessible incident report dialog", async ({
  page,
}) => {
  await page.setViewportSize({ width: 360, height: 800 });
  await page.goto("/");
  const trigger = page.getByRole("link", { name: "Report an incident" });
  await expect(trigger).toBeInViewport();
  await trigger.focus();
  await trigger.press("Enter");
  const dialog = page.getByRole("dialog", {
    name: "Report or suggest an update",
  });
  await expect(dialog).toBeVisible();
  const result = await new AxeBuilder({ page })
    .include("#incident-report-dialog")
    .analyze();
  expect(result.violations).toEqual([]);
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(trigger).toBeFocused();
});

test("reports stay in the dialog and retain the draft on failure", async ({
  page,
}) => {
  test.skip(!configured, "Requires a build with a test Formspree form ID.");
  let requests = 0;
  await page.route(`https://formspree.io/f/${reportId}`, async (route) => {
    const request = route.request();
    expect(request.method()).toBe("POST");
    expect(request.headers().accept).toBe("application/json");
    expect(request.postData()).toContain("Public example report");
    await route.fulfill({ status: ++requests === 1 ? 500 : 200, json: {} });
  });
  await page.goto("/");
  await page.getByRole("link", { name: "Report an incident" }).click();
  const dialog = page.getByRole("dialog");
  const details = dialog.getByRole("textbox", { name: "Details" });
  const submit = dialog.getByRole("button", { name: "Send report" });
  await dialog.getByRole("radio", { name: "Suggestion or correction" }).check();
  await dialog
    .getByRole("textbox", { name: "Related OpenAttacks entry" })
    .fill(incident);
  await details.fill("Public example report");
  await submit.click();
  await expect(dialog.getByRole("status")).toContainText(
    "Your draft is still here.",
  );
  await expect(details).toHaveValue("Public example report");
  await submit.click();
  await expect(dialog.getByRole("status")).toContainText("Report received");
  await expect(details).toHaveValue("");
  expect(requests).toBe(2);
});
