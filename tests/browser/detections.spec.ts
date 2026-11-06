import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const native = "huntress-plus56-custom-gpt-clickfix-2026-09";
const custom = "invariant-mcp-tool-poisoning-2025-04";

for (const width of [1440, 390]) {
  test(`detection links reach the correct phase without a simulation at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto(`/attacks/${native}/`);
    await expect(page.locator("[data-simulation]")).toHaveCount(0);
    await page.locator("#attack-flow").scrollIntoViewIfNeeded();
    const stageThree = page.locator(
      `${width < 900 ? ".mobile-network-stage" : ".network-stage"}[data-stage-id="step-3"]`,
    );
    await expect(
      stageThree.locator('[data-capability="detection"]'),
    ).toHaveCount(1);
    await expect(
      stageThree.locator('[data-capability="prevention"]'),
    ).toHaveCount(1);
    await expect(
      stageThree.locator('[data-capability="simulation"]'),
    ).toHaveCount(0);
    const links = page.locator(
      width < 900 ? ".mobile-detection-link" : ".network-detection-link",
    );
    await expect(links).toHaveCount(4);
    await links.nth(2).click();
    await expect(page).toHaveURL(/#detection-step-3$/);
    const stage = page.locator("#detection-step-3");
    await expect(stage).toHaveAttribute("open", "");
    await expect(stage).toContainText("Native logs · Draft");
    await expect(
      stage.locator(".detection-copy-block pre").nth(1),
    ).toContainText("DeviceProcessEvents");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth + 1,
      ),
    ).toBe(true);
    expect(errors).toEqual([]);
  });

  test(`custom telemetry, clipboard and simulation links at ${width}px`, async ({
    page,
    context,
    request,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await context.grantPermissions(["clipboard-read", "clipboard-write"]);
    await page.goto(`/attacks/${custom}/#detection-step-2`);
    const stageTwo = page.locator(
      `${width < 900 ? ".mobile-network-stage" : ".network-stage"}[data-stage-id="step-2"]`,
    );
    await expect(
      stageTwo.locator('[data-capability="detection"]'),
    ).toHaveCount(1);
    await expect(
      stageTwo.locator('[data-capability="prevention"]'),
    ).toHaveCount(0);
    await expect(
      stageTwo.locator('[data-capability="simulation"]'),
    ).toHaveCount(1);
    const stage = page.locator("#detection-step-2");
    await expect(stage).toHaveAttribute("open", "");
    await expect(stage).toContainText("Custom schema · Draft");
    await expect(stage).toContainText("not out-of-box detectors");
    for (const format of ["Sigma", "KQL", "SPL"]) {
      const details = stage
        .locator(".detection-query-format")
        .filter({ has: page.locator(`summary:text-is("${format}")`) });
      if (
        !(await details.evaluate(
          (element) => (element as HTMLDetailsElement).open,
        ))
      )
        await details.locator("summary").click();
      await details
        .getByRole("button", { name: `Copy ${format}`, exact: true })
        .click();
      const query = await details.locator("code").textContent();
      expect(await page.evaluate(() => navigator.clipboard.readText())).toBe(
        query,
      );
      const download = details.getByRole("link", {
        name: `Download ${format}`,
        exact: true,
      });
      const response = await request.get(
        (await download.getAttribute("href"))!,
      );
      expect(response.ok()).toBe(true);
      expect(await response.text()).toBe(query);
    }
    await stage.locator(".detection-investigation > summary").click();
    await expect(stage.locator(".detection-investigation ol")).toBeVisible();
    await expect(stage).not.toContainText("Detection MCP");
    await expect(
      stage.getByRole("button", { name: "Copy MCP research brief" }),
    ).toHaveCount(0);
    await stage
      .getByRole("link", { name: "Test this stage", exact: true })
      .click();
    await expect(page).toHaveURL(/#simulation$/);
  });
}

for (const width of [1440, 390]) {
  test(`phases without applicable detections are omitted at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(
      "/attacks/apt41-gemini-c2-osstun-2025-08/?stage=step-3&view=hunt#attack-flow",
    );
    const links = page.locator(
      width < 900 ? ".mobile-detection-link" : ".network-detection-link",
    );
    await expect(links).toHaveCount(3);
    await expect(page.getByRole("tab", { name: /Hunt/ })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    await page.locator(".network-stage-picker button").nth(3).click();
    await expect(page.getByRole("tab", { name: /Hunt/ })).toHaveCount(0);
    await expect(
      page.getByRole("tab", { name: "Evidence", exact: true }),
    ).toHaveAttribute("aria-selected", "true");
    await expect(
      page.locator(
        '.network-detection-link[href="#detection-step-4"], .mobile-detection-link[href="#detection-step-4"]',
      ),
    ).toHaveCount(0);
    await expect(page.locator("#detection-step-4")).toHaveCount(0);
    await expect(page.locator("[data-detection-stage]")).toHaveCount(3);

    await page.goto(
      "/attacks/wormgpt-underground-2023/?stage=step-1&view=hunt#attack-flow",
    );
    await expect(page.locator(".stage-inspector")).toBeVisible();
    await expect(
      page.getByRole("tab", { name: "Evidence", exact: true }),
    ).toHaveAttribute("aria-selected", "true");
    await expect(page.getByRole("tab", { name: /Hunt/ })).toHaveCount(0);
    await expect(links).toHaveCount(0);
    await expect(
      page.locator(".detection-available, .inspector-detection-link"),
    ).toHaveCount(0);
    await expect(page.locator("#detections")).toHaveCount(0);
    await expect(page.locator("[data-detection-stage]")).toHaveCount(0);
  });
}

test("detection cards retain their original phase numbers after filtering", async ({
  page,
}) => {
  await page.goto("/attacks/cairn-norforge-2026-10/#detections");
  await expect(page.locator(".detection-stage-nav a").first()).toHaveText(
    "Stage 02",
  );
  await expect(page.locator(".detection-stage").first()).toHaveAttribute(
    "id",
    "detection-step-2",
  );
  await expect(page.locator(".detection-stage").first()).toHaveAttribute(
    "open",
    "",
  );
  await expect(page.locator(".detection-stage-number").first()).toHaveText(
    "02",
  );
});

test("all phase content and downloads are available without JavaScript", async ({
  browser,
  baseURL,
}) => {
  const context = await browser.newContext({
    javaScriptEnabled: false,
    baseURL,
  });
  const page = await context.newPage();
  await page.goto(`/attacks/${native}/`);
  await expect(page.locator("[data-detection-stage]")).toHaveCount(4);
  const stage = page.locator("#detection-step-3");
  await stage.locator(":scope > summary").click();
  await expect(
    stage.getByRole("link", { name: "Download KQL", exact: true }),
  ).toBeVisible();
  await expect(
    stage.locator(".detection-query-format").nth(1).locator("code"),
  ).toContainText("DeviceProcessEvents");
  await context.close();
});

for (const width of [1440, 390])
  test(`detection cards meet accessibility checks in both themes at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 1000 });
    await page.goto(`/attacks/${native}/#detection-step-3`);
    for (const theme of ["dark", "light"]) {
      await page.evaluate(
        (value) => document.documentElement.setAttribute("data-theme", value),
        theme,
      );
      const result = await new AxeBuilder({ page })
        .include("#detections")
        .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
        .analyze();
      expect(result.violations, theme).toEqual([]);
    }
  });
