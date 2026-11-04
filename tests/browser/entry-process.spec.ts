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
  await expect(page.locator(".entry-outcome")).toContainText(
    "Tool arguments or redirected operations",
  );
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
    return [...actions.children].map(
      (element) => element.id || element.className,
    );
  });
  expect(order.indexOf("entry-protection")).toBeLessThan(
    order.indexOf("entry-detections"),
  );
  expect(order.indexOf("entry-detections")).toBeLessThan(
    order.indexOf("simulation"),
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
    await stage.locator(".detection-query-details > summary").click();
    const pack = await (
      await request.get(
        "/api/defenses/huntress-plus56-custom-gpt-clickfix-2026-09.json",
      )
    ).json();
    const mapped = pack.stages.find(
      (entry: { node_id: string }) => entry.node_id === "step-3",
    );
    for (const format of ["Sigma", "KQL", "SPL"]) {
      await stage.getByRole("tab", { name: format, exact: true }).click();
      await expect(stage.locator(".detection-code:not(.mcp-brief)")).toHaveText(
        mapped.queries[format.toLowerCase()],
      );
    }
    await stage
      .getByRole("tab", { name: "SPL", exact: true })
      .press("ArrowRight");
    await expect(
      stage.getByRole("tab", { name: "Sigma", exact: true }),
    ).toBeFocused();
    await stage
      .getByRole("button", { name: "Copy Sigma", exact: true })
      .click();
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
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
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
    "AI is used by the attacker",
  );
  await expect(page.locator(".entry-exposure")).toContainText(
    "does not by itself establish exposure",
  );
  await expect(page.locator(".entry-reported-access")).toContainText(
    "Unauthenticated web RCE",
  );
  await expect(page.locator(".entry-exposure-rule")).toHaveCount(0);
  await expect(page.locator(".entry-detections")).toContainText(
    "Provider / operator records",
  );
  await page.goto("/attacks/arup-deepfake-video-fraud-2024-01/");
  await expect(page.locator(".entry-exposure-status")).toHaveText(
    "Exposure conditions not assessed",
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
  await stage.locator(".detection-query-details > summary").click();
  await expect(stage.locator(".detection-code:not(.mcp-brief)")).toContainText(
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
