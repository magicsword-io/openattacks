import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("entry pages connect the story, exposure and actions to the existing evidence", async ({
  page,
  request,
}) => {
  await page.goto("/attacks/invariant-mcp-tool-poisoning-2025-04/");
  const headings = await page
    .locator("article > section > h2, article > section > div > div > h2")
    .allTextContents();
  expect(headings).toEqual([
    "What happened",
    "How it happened",
    "Why it matters",
    "What you can do",
  ]);
  await expect(page.locator(".entry-exposure")).toContainText(
    "An agent must consume malicious or changed MCP tool descriptions",
  );
  await expect(page.locator(".entry-exposure")).toContainText(
    "not a confirmed campaign against every MCP user",
  );
  await expect(page.locator(".entry-exposure")).toContainText(
    "Tool arguments or redirected operations",
  );
  await expect(
    page.getByRole("heading", { name: "Could this affect you?" }),
  ).toHaveCount(0);
  await expect(
    page.getByRole("heading", { name: "What’s at risk?" }),
  ).toHaveCount(0);
  await expect(page.locator(".entry-protection")).toContainText(
    "Inspect complete tool descriptions",
  );
  const pack = await (
    await request.get("/api/defenses/invariant-mcp-tool-poisoning-2025-04.json")
  ).json();
  await expect(page.locator(".detection-stage")).toHaveCount(
    pack.stages.length,
  );
  await expect(
    page.locator(".entry-detections .entry-download"),
  ).toHaveAttribute(
    "href",
    "/api/defenses/invariant-mcp-tool-poisoning-2025-04.json",
  );
  const order = await page.locator(".entry-actions").evaluate((actions) => {
    return [...actions.children].map((element) => ({
      id: element.id,
      classes: [...element.classList],
    }));
  });
  const indexOf = (value: string) =>
    order.findIndex(({ id, classes }) => id === value || classes.includes(value));
  expect(indexOf("entry-protection")).toBeLessThan(
    indexOf("entry-detections"),
  );
  expect(indexOf("entry-detections")).toBeLessThan(
    indexOf("simulation"),
  );
  await expect(page.locator("#simulation-heading")).toHaveText(
    "Test this behavior",
  );
});

for (const width of [1440, 390]) {
  test(`stage detection links open the matching queries at ${width}px`, async ({
    page,
    context,
    request,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto("/attacks/huntress-plus56-custom-gpt-clickfix-2026-09/");
    await page.locator("#attack-flow").scrollIntoViewIfNeeded();
    const link = page.locator(
      `${width < 900 ? ".mobile-detection-link" : ".network-detection-link"}[href="#detection-step-3"]`,
    );
    await link.click();
    const stage = page.locator("#detection-step-3");
    await expect(page).toHaveURL(/#detection-step-3$/);
    await expect(stage).toHaveAttribute("open", "");
    await expect(
      stage.getByText("Required logs", { exact: true }),
    ).toBeVisible();
    const pack = await (
      await request.get(
        "/api/defenses/huntress-plus56-custom-gpt-clickfix-2026-09.json",
      )
    ).json();
    const mapped = pack.stages.find(
      (entry: { node_id: string }) => entry.node_id === "step-3",
    );
    for (const format of ["Sigma", "KQL", "SPL"]) {
      const details = stage
        .locator(".detection-query-format")
        .filter({ has: page.locator(`summary:text-is("${format}")`) });
      if (!(await details.evaluate((element) => (element as HTMLDetailsElement).open))) {
        await details.locator("summary").click();
      }
      await expect(details.locator("code")).toHaveText(
        mapped.queries[format.toLowerCase()],
      );
    }
    await stage.getByRole("button", { name: "Copy Sigma", exact: true }).click();
    expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
      mapped.queries.sigma,
    );
    for (const theme of ["dark", "light"]) {
      await page.evaluate(
        (value) => document.documentElement.setAttribute("data-theme", value),
        theme,
      );
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
      const result = await new AxeBuilder({ page })
        .include(".entry-relevance")
        .include(".entry-actions")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"])
        .analyze();
      expect(result.violations, `${width}px ${theme}`).toEqual([]);
    }
    await stage
      .getByRole("link", { name: "View attack stage 3", exact: true })
      .click();
    await expect(page.locator(".stage-inspector")).toHaveAttribute(
      "data-stage-id",
      "step-3",
    );
    await expect(
      page.getByRole("tab", { name: "Evidence", exact: true }),
    ).toHaveAttribute("aria-selected", "true");
  });
}

test("attacker tooling and unassessed exposure remain qualified", async ({
  page,
}) => {
  await page.goto("/attacks/cairn-norforge-2026-10/");
  await expect(page.locator(".entry-exposure")).toContainText(
    "using the named AI products does not by itself establish exposure",
  );
  await expect(page.locator(".entry-relevance-summary")).toContainText(
    "Unauthenticated web RCE",
  );
  await expect(page.locator(".entry-exposure-rule")).toHaveCount(0);
  await expect(page.locator(".entry-detections")).toContainText(
    "Provider / operator records",
  );
  await page.goto("/attacks/arup-deepfake-video-fraud-2024-01/");
  await expect(page.locator(".entry-relevance-summary")).toContainText(
    "applicability to your setup has not been assessed",
  );
  await expect(page.locator(".entry-exposure-rule")).toHaveCount(0);
});

test("direct detection links expand on load and after a second selection", async ({
  page,
}) => {
  await page.goto("/attacks/cairn-norforge-2026-10/#detection-step-2");
  await expect(page.locator("#detection-step-2")).toHaveAttribute("open", "");
  await page
    .locator(".network-detection-link[href='#detection-step-3']")
    .click();
  await expect(page.locator("#detection-step-3")).toHaveAttribute("open", "");
  await page.reload();
  await expect(page.locator("#detection-step-3")).toHaveAttribute("open", "");
  await page.locator("#detection-step-3 > summary").click();
  await expect(page.locator("#detection-step-3")).not.toHaveAttribute(
    "open",
    "",
  );
  await page
    .locator(".network-detection-link[href='#detection-step-3']")
    .click();
  await expect(page.locator("#detection-step-3")).toHaveAttribute("open", "");
});

test("exposure, prevention and detection evidence can be read without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto(`${baseURL}/attacks/invariant-mcp-tool-poisoning-2025-04/`);
  await expect(page.locator(".entry-exposure")).toContainText(
    "MCP connection required",
  );
  await expect(page.locator(".entry-protection")).toContainText(
    "pin tool hashes",
  );
  const stage = page.locator("#detection-step-2");
  await stage.locator(":scope > summary").click();
  await expect(stage.getByText("Required logs", { exact: true })).toBeVisible();
  const sigma = stage
    .locator(".detection-query-format")
    .filter({ has: page.locator('summary:text-is("Sigma")') });
  await sigma.locator("summary").click();
  await expect(sigma.locator("code")).toContainText(
    "status: experimental",
  );
  await expect(
    page.getByRole("link", { name: "Read the original source", exact: true }),
  ).toHaveAttribute(
    "href",
    "https://invariantlabs.ai/blog/mcp-security-notification-tool-poisoning-attacks",
  );
  await context.close();
});
