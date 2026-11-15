import { expect, test } from "@playwright/test";

test("splash arrow grows around its center on hover and keyboard focus", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  const arrow = page.getByRole("link", {
    name: "Explore the site",
    exact: true,
  });
  const icon = arrow.locator("svg");
  const resting = await icon.boundingBox();
  await arrow.hover();
  await expect(icon).toHaveCSS("transform", "matrix(1.18, 0, 0, 1.18, 0, 0)");
  const expanded = await icon.boundingBox();
  expect(
    Math.abs(
      expanded!.x + expanded!.width / 2 - (resting!.x + resting!.width / 2),
    ),
  ).toBeLessThan(0.1);
  expect(
    Math.abs(
      expanded!.y + expanded!.height / 2 - (resting!.y + resting!.height / 2),
    ),
  ).toBeLessThan(0.1);
  await page.mouse.move(0, 0);
  await arrow.focus();
  await expect(icon).toHaveCSS("transform", "matrix(1.18, 0, 0, 1.18, 0, 0)");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/#workspace$/);
});

test("award logos render on a high-density phone", async ({
  browser,
}, testInfo) => {
  const context = await browser.newContext({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 3,
    isMobile: true,
    hasTouch: true,
    reducedMotion: "reduce",
  });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/");
  await page.evaluate(() => document.fonts.ready);
  const project = page.locator("[data-project='permanence']");
  await project.scrollIntoViewIfNeeded();
  const badges = project.locator("[data-award]");
  await expect(badges).toHaveCount(3);
  for (const badge of await badges.all()) {
    const logo = badge.locator("img");
    await expect(logo).toBeVisible();
    await expect
      .poll(() =>
        logo.evaluate((image) => (image as HTMLImageElement).naturalWidth),
      )
      .toBeGreaterThan(0);
  }
  await project.screenshot({
    path: testInfo.outputPath("phone-badges-3x.png"),
  });
  await context.close();
});
