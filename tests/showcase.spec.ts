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
  await expect(showcase.locator("li img")).toHaveCount(5);
  for (const label of [
    "2nd Best Overall, out of 85 projects",
    "3rd Best Overall, out of 86 projects",
    "1st Best Overall, out of 212 projects",
    "1st NVIDIA, out of 21 projects",
    "1st Hugging Face, out of 78 projects",
  ]) {
    await expect(
      showcase.getByRole("listitem", { name: label, exact: true }),
    ).toBeVisible();
  }
  await expect(
    showcase.getByRole("link", { name: "All projects" }),
  ).toHaveCount(0);
  await expect(page.getByRole("button", { name: /motion/ })).toHaveCount(0);
  expect(await showcase.locator("svg").count()).toBe(3);
  await expect(showcase).not.toContainText(
    /HackUSF|Knight Hacks IX|BloomKnights/,
  );
  expect(
    await showcase
      .locator("[data-project='permanence'] [data-award]")
      .evaluateAll((elements) =>
        elements.map((element) => element.getAttribute("data-award")),
      ),
  ).toEqual(["nvidia", "overall", "hugging-face"]);
  expect(
    await showcase
      .locator("[data-project='permanence'] [data-award]")
      .evaluateAll((elements) => {
        const [left, center, right] = elements.map((element) =>
          element.getBoundingClientRect(),
        );
        return center.top < left.top && center.top < right.top;
      }),
  ).toBe(true);
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
  expect(boxes.recall.width).toBeGreaterThan(390);
  expect(boxes.permanence.width).toBeGreaterThan(530);
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
          return { ratio: box.width / box.height, bottom: box.bottom };
        }),
      );
    const sizes = await page.locator("[data-award]").evaluateAll((elements) =>
      elements.map((element) => ({
        width: (element as HTMLElement).offsetWidth,
        height: (element as HTMLElement).offsetHeight,
      })),
    );
    sizes.forEach((size) => expect(size).toEqual(sizes[0]));
    frames.forEach((frame) => {
      expect(frame.ratio).toBeCloseTo(16 / 9, 1);
      expect(Math.abs(frame.bottom - frames[0].bottom)).toBeLessThan(1);
    });
    const bottoms = await page
      .locator("[data-project]")
      .evaluateAll((elements) =>
        elements.map((element) => element.getBoundingClientRect().bottom),
      );
    expect(Math.max(...bottoms) - Math.min(...bottoms)).toBeLessThan(1);
  }
  await page.setViewportSize({ width: 1440, height: 1100 });
  const headingGap = await page.locator("#workspace").evaluate((section) => {
    const heading = section.querySelector("h2")!.getBoundingClientRect();
    const badge = section
      .querySelector("[data-project='recall'] [data-award]")!
      .getBoundingClientRect();
    return badge.top - heading.bottom;
  });
  expect(headingGap).toBeLessThan(75);
  expect(headingGap).toBeGreaterThan(0);
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
  const footer = page.getByRole("contentinfo");
  await expect(footer).toContainText("Made with by Sebastian");
  await expect(footer.getByRole("img", { name: "love" })).toBeVisible();
  await expect(footer.locator(".footer-heart svg")).toHaveCount(1);
  const credit = await footer.locator(".footer-credit").boundingBox();
  expect(Math.abs(credit!.x + credit!.width / 2 - 720)).toBeLessThan(1);
  await footer.screenshot({ path: testInfo.outputPath("showcase-footer.png") });
  await page.getByRole("link", { name: "Permanence", exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/permanence$/);
});

test("scroll reveals in order and hover lifts, zooms, and restores color", async ({
  page,
}, testInfo) => {
  await page.addInitScript(() => {
    const original = Element.prototype.animate;
    const reveals: { project: string; duration: number; delay: number }[] = [];
    const fades: { project: string; duration: number; delay: number }[] = [];
    const projectAnimations: Animation[] = [];
    Object.assign(window, {
      showcaseReveals: reveals,
      showcaseSkeletonFades: fades,
      showcaseAnimations: projectAnimations,
    });
    Element.prototype.animate = function (keyframes, options) {
      const project = this.hasAttribute("data-project-reveal")
        ? this.closest("[data-project]")?.getAttribute("data-project")
        : null;
      if (project && typeof options === "object")
        reveals.push({
          project,
          duration: Number(options.duration),
          delay: Number(options.delay ?? 0),
        });
      if (
        this.hasAttribute("data-project-skeleton") &&
        typeof options === "object"
      ) {
        fades.push({
          project:
            this.closest("[data-project]")!.getAttribute("data-project")!,
          duration: Number(options.duration),
          delay: Number(options.delay ?? 0),
        });
      }
      const animation = original.call(this, keyframes, options);
      if (project || this.hasAttribute("data-project-skeleton")) {
        // Hold the initial state while assertions and screenshots run on slow CI.
        animation.playbackRate = 0;
        projectAnimations.push(animation);
      }
      return animation;
    };
  });
  await page.goto("/");
  await expect(page.locator("[data-motion]")).toHaveAttribute(
    "data-motion",
    "playing",
  );
  await expect(
    page.locator("[data-project='permanence'] [data-project-reveal]"),
  ).toHaveCSS("opacity", "0");
  await page.locator("[data-project-stage]").evaluate((element) =>
    window.scrollTo({
      top: element.getBoundingClientRect().top + window.scrollY - 280,
      behavior: "instant",
    }),
  );
  await expect
    .poll(() =>
      page.evaluate(() =>
        (
          window as Window & { showcaseReveals?: { project: string }[] }
        ).showcaseReveals?.map((reveal) => reveal.project),
      ),
    )
    .toEqual(["recall", "greghouse", "permanence"]);
  const timings = await page.evaluate(
    () =>
      (
        window as Window & {
          showcaseReveals?: { duration: number; delay: number }[];
        }
      ).showcaseReveals!,
  );
  const fades = await page.evaluate(
    () =>
      (
        window as Window & {
          showcaseSkeletonFades?: {
            project: string;
            duration: number;
            delay: number;
          }[];
        }
      ).showcaseSkeletonFades!,
  );
  fades.forEach((fade, index) => {
    expect(fade.duration).toBeLessThan(200);
    expect(timings[index].delay).toBeGreaterThanOrEqual(
      fade.delay + fade.duration,
    );
  });
  timings.forEach((timing, index) => {
    expect(timing.duration).toBeGreaterThanOrEqual(700);
    expect(timing.duration).toBeLessThan(1200);
    if (index)
      expect(timing.delay - timings[index - 1].delay).toBeGreaterThanOrEqual(
        900,
      );
  });
  await expect(
    page.locator("[data-project='permanence'] [data-project-skeleton]"),
  ).toHaveCSS("opacity", "1");
  const shimmer = page
    .locator("[data-project='permanence'] [data-project-skeleton] > div")
    .first();
  expect(
    await shimmer.evaluate(
      (element) => getComputedStyle(element, "::after").animationName,
    ),
  ).not.toBe("none");
  await page
    .locator("#workspace")
    .screenshot({ path: testInfo.outputPath("showcase-skeleton.png") });
  await page.evaluate(() => {
    const animations = (window as Window & { showcaseAnimations?: Animation[] })
      .showcaseAnimations!;
    animations.forEach((animation) => {
      animation.playbackRate = 1;
      animation.play();
    });
  });
  await expect(
    page.locator("[data-project='permanence'] [data-project-reveal]"),
  ).toHaveCSS("opacity", "1");
  await expect(
    page.locator("[data-project='permanence'] [data-project-skeleton]"),
  ).toHaveCSS("opacity", "0");
  expect(
    await shimmer.evaluate(
      (element) => getComputedStyle(element, "::after").animationName,
    ),
  ).toBe("none");
  const project = page.getByRole("link", { name: "Permanence", exact: true });
  const visual = project.locator("[data-showcase-visual]");
  await expect(visual).toHaveCSS("filter", "grayscale(1)");
  const badgeTransforms = () =>
    project.locator("[data-award]").evaluateAll((elements) =>
      elements.map((element) => {
        const matrix = new DOMMatrixReadOnly(
          getComputedStyle(element).transform,
        );
        return {
          angle: Math.atan2(matrix.b, matrix.a),
          scale: Math.hypot(matrix.a, matrix.b),
          x: matrix.e,
          y: matrix.f,
        };
      }),
    );
  const restingBadges = await badgeTransforms();
  expect(restingBadges[0].angle).toBeLessThan(0);
  expect(restingBadges[2].angle).toBeGreaterThan(0);
  for (const slug of ["recall", "greghouse"]) {
    const angle = await page
      .locator(`[data-project='${slug}'] [data-award]`)
      .evaluate((element) => {
        const matrix = new DOMMatrixReadOnly(
          getComputedStyle(element).transform,
        );
        return Math.atan2(matrix.b, matrix.a);
      });
    if (slug === "recall") expect(angle).toBeLessThan(0);
    else expect(angle).toBeGreaterThan(0);
  }
  await project.hover();
  await expect(visual).toHaveCSS("filter", "grayscale(0)");
  await expect(visual).toHaveCSS("transform", "matrix(1.06, 0, 0, 1.06, 0, 0)");
  await expect(project).toHaveCSS(
    "transform",
    "matrix(1.025, 0, 0, 1.025, 0, -8)",
  );
  const hoveringBadges = await badgeTransforms();
  hoveringBadges.forEach((badge, index) => {
    expect(badge.angle).toBeCloseTo(restingBadges[index].angle, 3);
    expect(badge.scale).toBeGreaterThan(restingBadges[index].scale);
    expect(badge.y).toBeLessThan(restingBadges[index].y);
  });
  expect(hoveringBadges[0].x).toBeLessThan(0);
  expect(hoveringBadges[2].x).toBeGreaterThan(0);
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
  const reducedBadges = await badgeTransforms();
  reducedBadges.forEach((badge, index) => {
    expect(badge.angle).toBeCloseTo(restingBadges[index].angle, 3);
    expect(badge.scale).toBeCloseTo(1, 3);
    expect(badge.x).toBe(0);
    expect(badge.y).toBe(0);
  });
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

test("mobile leads with Permanence and keeps visible keyboard links", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  expect(
    await page
      .locator("[data-project]")
      .evaluateAll((elements) =>
        elements.map((element) => element.getAttribute("data-project")),
      ),
  ).toEqual(["permanence", "recall", "greghouse"]);
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
    const badgeSizes = await page
      .locator("[data-award]")
      .evaluateAll((elements) =>
        elements.map((element) => [
          (element as HTMLElement).offsetWidth,
          (element as HTMLElement).offsetHeight,
        ]),
      );
    badgeSizes.forEach((size) => expect(size).toEqual(badgeSizes[0]));
    expect(
      await page.locator("[data-project]").evaluateAll((elements) =>
        elements.every((element) => {
          const frame = element
            .querySelector("[data-showcase-media]")!
            .getBoundingClientRect();
          const title = element
            .querySelector("[data-project-copy]")!
            .getBoundingClientRect();
          const description = element
            .querySelector("[data-project-description]")!
            .getBoundingClientRect();
          const awards = [...element.querySelectorAll("[data-award]")];
          return (
            title.top >= frame.top &&
            title.bottom <= frame.bottom &&
            description.top >= frame.bottom &&
            awards.every((award) => {
              const badge = award.getBoundingClientRect();
              const logo = award.querySelector("img")!.getBoundingClientRect();
              const rank = award
                .querySelector("strong")!
                .getBoundingClientRect();
              return (
                badge.top < frame.top &&
                badge.bottom > frame.top &&
                badge.bottom < frame.top + 40 &&
                logo.left < rank.left
              );
            })
          );
        }),
      ),
      `${width}px title overlay, description below, logo-left awards attached to media`,
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
  await page
    .locator("[data-project='permanence']")
    .screenshot({ path: testInfo.outputPath("showcase-mobile.png") });
  const link = page.getByRole("link", {
    name: "Infrastructure engineering",
    exact: true,
  });
  await link.focus();
  await expect(link).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/experiences#bny$/);
});

test("showcase stays readable without JavaScript and loads only approved media", async ({
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
  ).toHaveCount(2);
  const poster = page.getByRole("img", { name: /Permanence's winning team/ });
  await poster.scrollIntoViewIfNeeded();
  await expect(poster).toBeVisible();
  await expect
    .poll(() =>
      poster.evaluate((element) => (element as HTMLImageElement).naturalWidth),
    )
    .toBeGreaterThan(0);
  expect(media.filter((url) => /ytimg|\.webm|\.mp4/.test(url))).toEqual([]);
  await page.getByRole("link", { name: "Greghouse", exact: true }).click();
  await expect(page).toHaveURL(/\/projects\/greghouse$/);
  await context.close();
});
