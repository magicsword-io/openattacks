import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

const endpoint = "**/suggest/intake.json";
const incident = "cairn-norforge-2026-10";

test("correction links prefill an accessible public submission form", async ({
  page,
}) => {
  const posted: unknown[] = [];
  await page.route(endpoint, async (route) => {
    if (route.request().method() === "GET") {
      await route.fulfill({ json: { enabled: true } });
      return;
    }
    posted.push(route.request().postDataJSON());
    await route.fulfill({
      status: 201,
      json: {
        result: "posted",
        message: "Your submission was posted as a public GitHub issue.",
        issue: 42,
      },
    });
  });
  await page.goto(`/attacks/${incident}/`);
  const correction = page.getByRole("link", { name: "Suggest a correction" });
  await expect(
    page.locator('a[href*="/suggest/?type=correction"]'),
  ).toHaveCount(1);
  await page
    .locator("details")
    .filter({ has: page.locator('a[href*="/suggest/?type=correction"]') })
    .locator("summary")
    .first()
    .click();
  await correction.click();

  const form = page.locator("#suggestion-form");
  const submit = form.getByRole("button", { name: "Post public issue" });
  await expect(form.getByLabel("Submission type")).toHaveValue("correction");
  await expect(form.getByLabel("Related incident")).toHaveValue(incident);
  await expect(submit).toBeEnabled();
  await expect(form.locator('input[type="email"]')).toHaveCount(0);
  const accessibility = await new AxeBuilder({ page })
    .include("main")
    .analyze();
  expect(accessibility.violations).toEqual([]);

  await page.setViewportSize({ width: 360, height: 800 });
  await expect(submit).toBeVisible();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await form
    .getByLabel("Description")
    .fill("The published report gives a different date.");
  await form
    .getByLabel("Public source URL")
    .fill("https://reports.example.test/incident");
  await submit.click();
  expect(posted).toHaveLength(0);
  await expect(form.getByRole("checkbox")).toBeFocused();
  await form.getByRole("checkbox").check();
  await submit.click();
  await expect(form.getByRole("status")).toHaveText(
    "Your submission was posted as a public GitHub issue.",
  );
  expect(posted).toEqual([
    {
      type: "correction",
      relatedIncident: incident,
      description: "The published report gives a different date.",
      source: "https://reports.example.test/incident",
      consent: true,
      website: "",
    },
  ]);
  await expect(
    form.getByRole("link", { name: "View public issue" }),
  ).toHaveAttribute(
    "href",
    "https://github.com/magicsword-io/openattacks/issues/42",
  );
  await expect(form.getByLabel("Description")).toHaveValue("");
  await expect(form.getByRole("checkbox")).not.toBeChecked();
});

test("shows unavailable intake and preserves public and private GitHub paths", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("link", { name: "Suggest an update" }).click();
  await expect(
    page.getByRole("heading", { name: "Suggest an update" }),
  ).toBeVisible();
  await expect(page.getByRole("status")).toContainText(
    "Website submissions are unavailable.",
  );
  await expect(
    page.getByRole("button", { name: "Post public issue" }),
  ).toBeDisabled();
  for (const [name, path] of [
    ["Submit an incident on GitHub", "issues/new?template=submit-attack.yml"],
    ["Suggest a correction on GitHub", "issues/new?template=correction.yml"],
    ["private vulnerability reporting on GitHub", "security/advisories/new"],
  ]) {
    await expect(page.getByRole("link", { name })).toHaveAttribute(
      "href",
      `https://github.com/magicsword-io/openattacks/${path}`,
    );
  }
});

test("retains the draft and focuses feedback when GitHub cannot confirm posting", async ({
  page,
}) => {
  await page.route(endpoint, (route) =>
    route.request().method() === "GET"
      ? route.fulfill({ json: { enabled: true } })
      : route.fulfill({
          status: 502,
          json: {
            result: "unconfirmed",
            message: "Check recent issues below before posting again.",
          },
        }),
  );
  await page.goto("/suggest/");
  const submit = page.getByRole("button", { name: "Post public issue" });
  await expect(submit).toBeEnabled();
  const description = page.getByLabel("Description");
  await description.fill("A public report merits review.");
  await page.getByRole("checkbox").check();
  await submit.click();
  const feedback = page.getByRole("status");
  await expect(feedback).toHaveText(
    "Check recent issues below before posting again.",
  );
  await expect(feedback).toBeFocused();
  await expect(description).toHaveValue("A public report merits review.");
  await expect(submit).toBeEnabled();
  await expect(
    page.getByRole("link", { name: "View public issue" }),
  ).toHaveCount(0);
});
