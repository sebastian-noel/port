import { expect, test } from "@playwright/test";

test("mobile toolbar resizes preserve tiles while scrolling through projects", async ({
  browser,
}, testInfo) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    isMobile: true,
    hasTouch: true,
  });
  const page = await context.newPage();
  await page.goto("/");
  const field = page.locator(".tile-field");
  await expect(field).toHaveAttribute("data-tile-count", /[1-9]\d*/);
  await expect(page.locator(".intro-name")).toHaveAttribute(
    "data-intro-state",
    "complete",
    { timeout: 10000 },
  );
  const first = await field.locator(".tile").first().elementHandle();
  const result = await field.evaluate(async (element) => {
    let replacements = 0;
    const observer = new MutationObserver((records) => {
      replacements += records.filter(
        (record) => record.type === "childList",
      ).length;
    });
    observer.observe(element, { childList: true });
    const height = innerHeight;
    const descriptor = Object.getOwnPropertyDescriptor(window, "innerHeight");
    const project = document.querySelector("[data-project='permanence']")!;
    const top = project.getBoundingClientRect().top + scrollY;
    for (let step = 0; step < 12; step++) {
      // Model toolbar expansion/collapse without changing the layout viewport.
      Object.defineProperty(window, "innerHeight", {
        configurable: true,
        value: height - (step % 2) * 80,
      });
      window.scrollTo({ top: top + (step % 2) * 300, behavior: "instant" });
      window.dispatchEvent(new Event("resize"));
      await new Promise<void>((resolve) =>
        requestAnimationFrame(() => requestAnimationFrame(() => resolve())),
      );
    }
    if (descriptor) Object.defineProperty(window, "innerHeight", descriptor);
    observer.disconnect();
    return { replacements, scroll: scrollY };
  });
  expect(result.scroll).toBeGreaterThan(0);
  expect(result.replacements).toBe(0);
  expect(await first!.evaluate((tile) => tile.isConnected)).toBe(true);
  await page.locator("[data-project='permanence']").screenshot({
    path: testInfo.outputPath("mobile-featured-project.png"),
  });

  // A real orientation change still rebuilds enough tiles to cover the field.
  await page.setViewportSize({ width: 844, height: 390 });
  await expect
    .poll(() => first!.evaluate((tile) => tile.isConnected))
    .toBe(false);
  expect(
    await field.evaluate((element) => {
      const last = element.lastElementChild!.getBoundingClientRect();
      const bounds = element.getBoundingClientRect();
      return last.right >= bounds.right && last.bottom >= bounds.bottom;
    }),
  ).toBe(true);
  await context.close();
});

test("desktop height changes still resize the decorative field", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const first = await page.locator(".tile").first().elementHandle();
  await page.setViewportSize({ width: 1280, height: 1100 });
  await expect
    .poll(() => first!.evaluate((tile) => tile.isConnected))
    .toBe(false);
  await expect(page.locator(".tile-field")).toHaveCSS("height", "1100px");
});
