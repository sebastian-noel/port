import { expect, test } from "@playwright/test";

test("showcase has a centered lead project and balanced outer margins", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const boxes = await page.locator("[data-project]").evaluateAll((elements) =>
    Object.fromEntries(
      elements.map((element) => {
        const box = element.getBoundingClientRect();
        return [
          element.getAttribute("data-project"),
          { left: box.left, right: box.right, width: box.width },
        ];
      }),
    ),
  );
  expect(boxes.recall.right).toBeLessThan(boxes.permanence.left);
  expect(boxes.permanence.right).toBeLessThan(boxes.greghouse.left);
  expect(boxes.permanence.width).toBeGreaterThan(boxes.recall.width * 1.3);
  expect(
    Math.abs(boxes.recall.left - (1440 - boxes.greghouse.right)),
  ).toBeLessThan(1);
  expect(
    Math.abs((boxes.permanence.left + boxes.permanence.right) / 2 - 720),
  ).toBeLessThan(1);
  await page
    .locator("#workspace")
    .evaluate((element) =>
      window.scrollTo(
        0,
        element.getBoundingClientRect().top + window.scrollY - 100,
      ),
    );
  await page.screenshot({ path: testInfo.outputPath("showcase-desktop.png") });
  await page
    .getByRole("region", { name: "Featured Experiences" })
    .scrollIntoViewIfNeeded();
  await page.screenshot({
    path: testInfo.outputPath("showcase-experiences.png"),
  });
  await page.getByRole("link", { name: "Permanence", exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/permanence$/);
});

test("scroll reveals Recall, Greghouse, then Permanence and pause stops ambient motion", async ({
  page,
}) => {
  await page.addInitScript(() => {
    const original = Element.prototype.animate;
    const reveals: string[] = [];
    Object.assign(window, { showcaseReveals: reveals });
    Element.prototype.animate = function (keyframes, options) {
      const project = this.getAttribute("data-project");
      if (project) reveals.push(project);
      return original.call(this, keyframes, options);
    };
  });
  await page.goto("/");
  await expect(page.locator("[data-motion]")).toHaveAttribute(
    "data-motion",
    "playing",
  );
  await expect(page.locator("[data-project='permanence']")).toHaveCSS(
    "opacity",
    "0",
  );
  await page.locator("[data-project-stage]").evaluate((element) =>
    window.scrollTo({
      top: element.getBoundingClientRect().top + window.scrollY - 280,
      behavior: "instant",
    }),
  );
  await expect
    .poll(() =>
      page.evaluate(
        () =>
          (window as Window & { showcaseReveals?: string[] }).showcaseReveals,
      ),
    )
    .toEqual(["recall", "greghouse", "permanence"]);
  const pause = page.getByRole("button", { name: "Pause motion" });
  await pause.click();
  await expect(page.locator("[data-motion]")).toHaveAttribute(
    "data-motion",
    "paused",
  );
  await expect(
    page.getByRole("button", { name: "Resume motion" }),
  ).toHaveAttribute("aria-pressed", "true");
  expect(
    await page
      .locator("[data-project]")
      .evaluateAll((elements) =>
        elements.every((element) => getComputedStyle(element).opacity === "1"),
      ),
  ).toBe(true);
  await page.getByRole("button", { name: "Resume motion" }).click();
  await expect(page.locator("[data-motion]")).toHaveAttribute(
    "data-motion",
    "playing",
  );
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(page.locator("[data-motion]")).toHaveAttribute(
    "data-motion",
    "paused",
  );
  expect(
    await page
      .locator("[data-project]")
      .evaluateAll((elements) =>
        elements.every((element) => getComputedStyle(element).opacity === "1"),
      ),
  ).toBe(true);
});

test("mobile keeps the reveal reading order and visible keyboard links", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const topPositions = await page
    .locator("[data-project]")
    .evaluateAll((elements) =>
      elements.map((element) => element.getBoundingClientRect().top),
    );
  expect(topPositions[0]).toBeLessThan(topPositions[1]);
  expect(topPositions[1]).toBeLessThan(topPositions[2]);
  for (const width of [320, 375, 390, 768, 900, 1024, 1920]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      `${width}px overflow`,
    ).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page.locator("[data-project='permanence']").scrollIntoViewIfNeeded();
  await page.screenshot({ path: testInfo.outputPath("showcase-mobile.png") });
  const link = page.getByRole("link", {
    name: "Infrastructure engineering",
    exact: true,
  });
  await link.focus();
  await expect(link).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/experiences\/bny$/);
});

test("showcase stays readable without JavaScript and requests no replacement media", async ({
  browser,
}) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  const media: string[] = [];
  page.on("request", (request) => {
    if (["image", "media"].includes(request.resourceType()))
      media.push(request.url());
  });
  await page.goto("/");
  await expect(page.locator("[data-project]")).toHaveCount(3);
  await expect(
    page.getByText("Video placeholder", { exact: true }),
  ).toHaveCount(3);
  expect(
    media.filter((url) => /ytimg|\/media\/|\.webm|\.mp4/.test(url)),
  ).toEqual([]);
  await page.getByRole("link", { name: "Greghouse", exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/greghouse$/);
  await context.close();
});
