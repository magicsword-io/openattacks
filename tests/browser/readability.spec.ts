import { test, expect, type Page } from "@playwright/test";

const pages = [
  "/",
  "/catalog/",
  "/timeline/",
  "/regions/",
  "/stack/",
  "/about/",
  "/attacks/cairn-norforge-2026-10/",
];

// Smallest computed font size of any visible HTML text, and where it is.
// SVG text is excluded because its size is in viewBox units.
const smallestText = (page: Page) =>
  page.evaluate(() => {
    let min = { size: Infinity, at: "" };
    for (const el of document.querySelectorAll("body *")) {
      if (el.closest("svg")) continue;
      const ownText = [...el.childNodes].some(
        (n) => n.nodeType === Node.TEXT_NODE && n.textContent?.trim(),
      );
      if (!ownText || !el.getBoundingClientRect().width) continue;
      const size = parseFloat(getComputedStyle(el).fontSize);
      if (size < min.size)
        min = { size, at: `${el.tagName.toLowerCase()}.${el.className}` };
    }
    return min;
  });

for (const width of [390, 1280]) {
  test(`no visible text is smaller than 11px at ${width}px`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
    });
    const page = await context.newPage();
    for (const path of pages) {
      await page.goto(path);
      const min = await smallestText(page);
      expect(min.size, `${path}: ${min.at}`).toBeGreaterThanOrEqual(11);
    }
    await context.close();
  });
}

test("timeline dots are clickable across their whole grid cell", async ({
  page,
}) => {
  await page.goto("/timeline/");
  const dot = page.locator(".chart-entry").first();
  const hit = await dot.locator(".chart-hit").boundingBox();
  const circle = await dot.locator("circle").boundingBox();
  expect(hit!.width).toBeGreaterThan(circle!.width * 1.5);
  expect(hit!.height).toBeGreaterThan(circle!.height * 1.5);
});

test("map markers get a 24px tap area on touch screens", async ({
  browser,
}) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto("/regions/");
  const hit = await page.locator(".map-marker .map-hit-area").first().boundingBox();
  expect(hit!.width).toBeGreaterThanOrEqual(24);
  await context.close();
});

test("long-form paragraphs stay within a readable measure", async ({
  page,
}) => {
  for (const [path, selector] of [
    ["/timeline/", ".timeline-entry p"],
    ["/about/", ".prose p"],
  ]) {
    await page.goto(path);
    const widest = await page.locator(selector).evaluateAll((els) =>
      Math.max(
        ...els.map((el) => {
          // Measure in "0" widths, the same unit as CSS ch.
          const probe = document.createElement("span");
          probe.textContent = "0".repeat(10);
          el.append(probe);
          const ch = probe.getBoundingClientRect().width / 10;
          probe.remove();
          return el.getBoundingClientRect().width / ch;
        }),
      ),
    );
    expect(widest, path).toBeLessThanOrEqual(76);
  }
});
