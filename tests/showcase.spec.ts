import { expect, test } from "@playwright/test";

test.use({ video: { mode: "on", size: { width: 1280, height: 900 } } });

test("showcase has a centered lead project and balanced outer margins", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 1440, height: 1100 });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  const showcase = page.getByRole("region", { name: "Featured Projects" });
  await expect(showcase.getByRole("link")).toHaveCount(3);
  await expect(showcase.getByRole("listitem")).toHaveCount(5);
  await expect(showcase.locator("li svg")).toHaveCount(5);
  await expect(
    showcase.getByRole("link", { name: "All projects" }),
  ).toHaveCount(0);
  await expect(page.getByRole("button", { name: /motion/ })).toHaveCount(0);
  expect(await showcase.locator("svg").count()).toBe(8);
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
  for (const width of [1200, 1280, 1440, 1920]) {
    await page.setViewportSize({ width, height: 1100 });
    const frames = await page
      .locator("[data-showcase-media]")
      .evaluateAll((elements) =>
        elements.map((element) => {
          const box = element.getBoundingClientRect();
          return box.width / box.height;
        }),
      );
    frames.forEach((ratio) => expect(ratio).toBeCloseTo(16 / 9, 1));
  }
  await page.setViewportSize({ width: 1440, height: 1100 });
  expect((await showcase.boundingBox())!.height).toBeLessThan(800);
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
  await page
    .locator("#workspace")
    .screenshot({ path: testInfo.outputPath("showcase-desktop.png") });
  await page
    .getByRole("region", { name: "Featured Experiences" })
    .scrollIntoViewIfNeeded();
  await page.getByRole("region", { name: "Featured Experiences" }).screenshot({
    path: testInfo.outputPath("showcase-experiences.png"),
  });
  await page.getByRole("link", { name: "Permanence", exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/permanence$/);
});

test("scroll reveals in order and hover lifts, zooms, and restores color", async ({
  page,
}, testInfo) => {
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
  await expect(page.locator("[data-project='permanence']")).toHaveCSS(
    "opacity",
    "1",
  );
  const project = page.getByRole("link", { name: "Permanence", exact: true });
  const visual = project.locator("[data-showcase-visual]");
  await expect(visual).toHaveCSS("filter", "grayscale(1)");
  await project.hover();
  await expect(visual).toHaveCSS("filter", "grayscale(0)");
  await expect(visual).toHaveCSS("transform", "matrix(1.06, 0, 0, 1.06, 0, 0)");
  await expect(project).toHaveCSS(
    "transform",
    "matrix(1.025, 0, 0, 1.025, 0, -8)",
  );
  await page
    .locator("#workspace")
    .screenshot({ path: testInfo.outputPath("showcase-hover.png") });
  await page.mouse.move(0, 0);
  await expect(visual).toHaveCSS("filter", "grayscale(1)");
  await project.focus();
  await expect(visual).toHaveCSS("filter", "grayscale(0)");
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(project).toHaveCSS("transform", "none");
  await expect(visual).toHaveCSS("transform", "none");
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
  for (const width of [320, 375, 390, 768, 900, 1024, 1199, 1200, 1920]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
      `${width}px overflow`,
    ).toBe(true);
    expect(
      await page.locator("[data-project-copy]").evaluateAll((elements) =>
        elements.every((element) => {
          const copy = element.getBoundingClientRect();
          const frame = element.parentElement!.getBoundingClientRect();
          return (
            copy.top >= frame.top &&
            copy.bottom <= frame.bottom &&
            element.scrollHeight <= element.clientHeight
          );
        }),
      ),
      `${width}px copy fits inside frame`,
    ).toBe(true);
  }
  await page.setViewportSize({ width: 390, height: 844 });
  await page
    .locator("[data-project='permanence']")
    .evaluate((element) =>
      window.scrollTo(
        0,
        element.getBoundingClientRect().top + window.scrollY - 120,
      ),
    );
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
