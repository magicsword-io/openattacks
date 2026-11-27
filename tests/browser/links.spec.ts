import { test, expect } from "@playwright/test";

test("reported tools link to their projects while preserving labels and fork qualifications", async ({
  page,
}) => {
  await page.goto("/attacks/cairn-norforge-2026-10/#tooling");
  const tooling = page.locator("#tooling");
  for (const [name, url] of [
    ["Cairn", "https://github.com/oritera/Cairn"],
    ["Amass", "https://github.com/owasp-amass/amass"],
    ["dnsrecon", "https://github.com/darkoperator/dnsrecon"],
    ["Playwright", "https://github.com/microsoft/playwright"],
  ]) {
    const link = tooling.getByRole("link", { name, exact: true });
    await expect(link).toBeVisible();
    await expect(link).toHaveAttribute("href", url);
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAttribute("rel", "noopener noreferrer");
  }
  await expect(
    tooling.locator(".tool-reported-label").filter({
      hasText: "Claude Code CLI via ANTHROPIC_BASE_URL to DeepSeek",
    }),
  ).toHaveText("Claude Code CLI via ANTHROPIC_BASE_URL to DeepSeek");
  const artifact = tooling
    .locator("li")
    .filter({ hasText: "StyleSmuggler PoC" });
  await expect(artifact).toBeVisible();
  await expect(artifact.locator("a")).toHaveCount(0);
  await page.goto("/attacks/crowdstrike-artex-sk-finance-2026-10/#tooling");
  await expect(
    page.locator("#tooling").getByRole("link", { name: "ARTEX", exact: true }),
  ).toHaveAttribute("href", "https://github.com/RuoJi6/ARTEX");
  await expect(
    page
      .locator("#tooling")
      .getByText(
        "Community-maintained fork; the original repository is unavailable.",
      ),
  ).toBeVisible();
});

test("primary utility links stay visible on desktop and mobile", async ({
  page,
}) => {
  await page.goto("/");
  const navigation = page.getByRole("navigation", { name: "Main navigation" });
  const banner = page.getByRole("banner");
  const prevent = banner.getByRole("link", {
    name: "Prevent",
    exact: true,
  });
  const use = navigation.getByRole("link", {
    name: "Use with an LLM",
    exact: true,
  });
  const api = navigation.getByRole("link", {
    name: "JSON API",
    exact: true,
  });
  const rss = banner.getByRole("link", { name: "Follow via RSS" });
  await expect(navigation.getByRole("link", { name: "Prevent" })).toHaveCount(
    0,
  );
  await expect(
    banner.getByRole("link", { name: "Report an incident" }),
  ).toHaveCount(0);
  for (const width of [360, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    const header = await page.locator(".site-header").boundingBox();
    for (const link of [use, api, prevent, rss]) {
      await expect(link).toBeVisible();
      const bounds = await link.boundingBox();
      expect(bounds!.x).toBeGreaterThanOrEqual(0);
      expect(bounds!.x + bounds!.width).toBeLessThanOrEqual(width);
      expect(bounds!.y + bounds!.height).toBeLessThanOrEqual(
        header!.y + header!.height,
      );
    }
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
  }
  await expect(use).toHaveAttribute("href", "/use/");
  await expect(api).toHaveAttribute("href", "/api/attacks.json");
  await expect(rss).toHaveAttribute("href", "/rss.xml");
  await expect(prevent).toHaveClass("button button-primary");
  const url = new URL((await prevent.getAttribute("href"))!);
  expect(url.hostname).toBe("www.magicsword.io");
  expect(url.searchParams.get("utm_source")).toBe("openattacks");
  expect(url.searchParams.get("utm_content")).toBe("nav-prevent");
  await page.goto("/use/");
  await expect(use).toHaveClass(/active/);
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
  expect(url.searchParams.get("utm_source")).toBe("openattacks");
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
  expect(url.searchParams.get("utm_source")).toBe("openattacks");
  expect(url.hash).toBe("#policy");
});
