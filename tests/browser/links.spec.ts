import { test, expect } from "@playwright/test";

test("Prevent stays visible on desktop and mobile with MagicSword attribution", async ({
  page,
}) => {
  await page.goto("/");
  const prevent = page
    .getByRole("navigation", { name: "Main navigation" })
    .getByRole("link", { name: "Prevent", exact: true });
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    await expect(prevent).toBeVisible();
    const bounds = await prevent.boundingBox();
    expect(bounds!.x).toBeGreaterThanOrEqual(0);
    expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  const url = new URL((await prevent.getAttribute("href"))!);
  expect(url.hostname).toBe("www.magicsword.io");
  expect(url.searchParams.get("utm_source")).toBe("ai-attacks");
  expect(url.searchParams.get("utm_content")).toBe("nav-prevent");
});

test("client-rendered MagicSword links are attributed before opening or copying", async ({
  page,
}) => {
  await page.goto("/");
  await page.evaluate(() => {
    const link = document.createElement("a");
    link.textContent = "Dynamic MagicSword link";
    link.href = "https://app.magicsword.io/mcp?tab=setup#connect";
    document.querySelector("main")!.prepend(link);
  });
  const link = page.getByRole("link", { name: "Dynamic MagicSword link" });
  await link.dispatchEvent("contextmenu");
  let url = new URL((await link.getAttribute("href"))!);
  expect(url.searchParams.get("utm_source")).toBe("ai-attacks");
  expect(url.searchParams.get("tab")).toBe("setup");
  expect(url.hash).toBe("#connect");
  await link.evaluate((element) => {
    element.setAttribute(
      "href",
      "https://magicsword.io/?utm_source=previous#policy",
    );
    element.addEventListener("click", (event) => event.preventDefault());
  });
  await link.click();
  url = new URL((await link.getAttribute("href"))!);
  expect(url.searchParams.get("utm_source")).toBe("ai-attacks");
  expect(url.hash).toBe("#policy");
});
