import { expect, test } from "@playwright/test";
import { records, validateEntries } from "../app/_content/entries";

const selected = [
  "permanence",
  "recall",
  "greghouse",
  "tks-revenge",
  "tidesense",
  "next-step",
  "dishdash",
];

test("project scope matches the owner's selected seven projects", () => {
  expect(
    records
      .filter((entry) => entry.collection === "projects")
      .map((e) => e.slug),
  ).toEqual(selected);
  expect(() =>
    validateEntries([{ ...records[0], demoVideoId: "invalid" }]),
  ).toThrow(/demo video/);
});

for (const slug of selected) {
  test(`${slug} has a complete case study, credits, and accessible demo`, async ({
    page,
  }) => {
    const entry = records.find((e) => e.slug === slug)!;
    await page.goto(`/projects/${slug}`);
    expect(
      await page.locator(".detail-body section").count(),
    ).toBeGreaterThanOrEqual(6);
    await expect(page.locator(".project-facts")).toContainText(
      entry.technologies!.join(" · "),
    );
    await expect(page.locator(".project-facts")).toContainText(
      entry.team!.join(", "),
    );
    const frame = page.locator(".project-demo iframe");
    await expect(frame).toHaveAttribute("title", `${entry.title} demo`);
    await expect(frame).toHaveAttribute("loading", "lazy");
    await expect(frame).toHaveAttribute(
      "src",
      `https://www.youtube-nocookie.com/embed/${entry.demoVideoId}`,
    );
    if (!entry.visualStudy) {
      await expect(
        page.getByRole("link", { name: `Watch ${entry.title} on YouTube` }),
      ).toHaveAttribute(
        "href",
        `https://www.youtube.com/watch?v=${entry.demoVideoId}`,
      );
    }
    await expect(page.locator("main")).not.toContainText(/hackathon projects/i);
    if (["greghouse", "next-step", "tidesense"].includes(slug)) {
      await expect(
        page.getByRole("heading", { name: "My contribution", exact: true }),
      ).toBeVisible();
    }
  });
}

test("project collection and case study remain readable at desktop and mobile sizes", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 });
    for (const [name, route] of [
      ["catalog", "/projects"],
      ["case-study", "/projects/tidesense"],
      ["recall", "/projects/recall"],
    ]) {
      await page.goto(route);
      await page.evaluate(() => document.fonts.ready);
      await page.screenshot({
        path: testInfo.outputPath(`${name}-${width}.png`),
        fullPage: true,
      });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= innerWidth,
        ),
      ).toBe(true);
    }
  }
});

test("catalog cards use wide proportions and a smooth accessible scarlet lift", async ({
  browser,
}, testInfo) => {
  const context = await browser.newContext({
    baseURL: "http://127.0.0.1:3000",
    viewport: { width: 1280, height: 900 },
    recordVideo: {
      dir: testInfo.outputPath("motion"),
      size: { width: 1280, height: 900 },
    },
  });
  const page = await context.newPage();
  await page.goto("/projects");
  const cards = page.locator(".catalog-card");
  const card = cards.first();
  const bounds = await cards.evaluateAll((items) =>
    items.map((item) => {
      const r = item.getBoundingClientRect();
      return { x: r.x, y: r.y, width: r.width, height: r.height };
    }),
  );
  expect(bounds[0].y).toBe(bounds[1].y);
  expect(bounds[2].y).toBeGreaterThan(bounds[0].y);
  expect(bounds[0].height).toBeGreaterThan((bounds[0].width * 9) / 16);
  expect(
    await card
      .locator("a")
      .evaluate((link) =>
        Array.from(link.children, (child) => child.className),
      ),
  ).toEqual(["project-title", "cover", "project-copy"]);
  const glow = () =>
    card.evaluate((el) => Number(getComputedStyle(el, "::before").opacity));
  await card.hover();
  await expect.poll(glow).toBe(0.75);
  expect(
    await card.evaluate(
      (el) => new DOMMatrix(getComputedStyle(el).transform).m42,
    ),
  ).toBeLessThan(-7);
  expect(
    await card.evaluate((el) => getComputedStyle(el, "::before").boxShadow),
  ).toContain("235, 47, 51");
  await expect(card.locator("a")).toHaveCSS("border-color", "rgb(235, 47, 51)");
  await page.screenshot({
    path: testInfo.outputPath("projects-hover-desktop.png"),
    fullPage: true,
  });
  await page.mouse.move(0, 0);
  await expect.poll(glow).toBe(0);
  await card.locator("a").focus();
  await expect.poll(glow).toBe(0.75);
  await expect(card.locator("a")).toBeFocused();
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(card).toHaveCSS("transform", "none");
  await page.setViewportSize({ width: 768, height: 900 });
  const tablet = await cards.evaluateAll((items) =>
    items.map((item) => item.getBoundingClientRect().x),
  );
  expect(new Set(tablet).size).toBe(1);
  expect(
    await card
      .locator(".cover")
      .evaluate((el) => el.getBoundingClientRect().height),
  ).toBeGreaterThan(100);
  await page.setViewportSize({ width: 390, height: 844 });
  const mobile = await cards.evaluateAll((items) =>
    items.map((item) => item.getBoundingClientRect().x),
  );
  expect(new Set(mobile).size).toBe(1);
  expect(
    await card.locator(".cover").evaluate((el) => {
      const r = el.getBoundingClientRect();
      return r.width / r.height;
    }),
  ).toBeCloseTo(16 / 9, 2);
  await page.getByRole("heading", { name: "Projects", exact: true }).click();
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.screenshot({
    path: testInfo.outputPath("projects-grid-mobile.png"),
    fullPage: true,
  });
  await context.close();
});

test("Permanence tells a visual, navigable case study with real images", async ({
  page,
}, testInfo) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/projects/permanence");
  await expect(page.locator(".study-diagram")).toHaveCount(3);
  await expect(page.locator(".study-image")).toHaveCount(3);
  await expect(page.locator("#constraints strong").first()).toHaveCSS(
    "font-weight",
    "700",
  );
  await page.getByRole("link", { name: "Architecture", exact: true }).click();
  await expect(page).toHaveURL(/#architecture$/);
  await expect(page.locator("#architecture")).toBeInViewport();
  await expect(page.locator("main")).not.toContainText(
    /My contribution|My role|What this taught me|I built|I surfaced/,
  );
  for (const person of records[0].teamProfiles!) {
    await expect(
      page.getByRole("link", { name: `${person.name} on LinkedIn` }),
    ).toHaveAttribute("href", person.href);
  }
  for (const width of [1280, 950, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.locator(".project-facts").scrollIntoViewIfNeeded();
    await page.screenshot({
      path: testInfo.outputPath(`permanence-facts-${width}.png`),
    });
    await page.locator("#object-states .study-diagram").screenshot({
      path: testInfo.outputPath(`permanence-states-${width}.png`),
    });
    await page.locator("#object-states").scrollIntoViewIfNeeded();
    const contents = page.getByRole("navigation", {
      name: "Case study sections",
    });
    await expect(contents).toHaveCSS("position", "sticky");
    const rail = await contents.boundingBox();
    expect(rail!.y).toBeGreaterThanOrEqual(76);
    expect(rail!.y).toBeLessThan(150);
    if (width <= 1000) expect(rail!.height).toBeLessThan(80);
    await expect(page.locator("#object-states > p").first()).toHaveCSS(
      "text-align",
      "left",
    );
    const prose = await page
      .locator("#object-states > p")
      .first()
      .boundingBox();
    expect(Math.abs(prose!.x + prose!.width / 2 - width / 2)).toBeLessThan(2);
    await expect(page.locator("#object-states h2")).toHaveCSS(
      "text-align",
      "center",
    );
    await expect(page.locator("main")).not.toContainText(
      /README|supplied capture|reconstructed|routing around/,
    );
    await page.screenshot({
      path: testInfo.outputPath(`permanence-navigation-${width}.png`),
    });
    const mobileToggle = contents.getByRole("button", {
      name: /On this page/,
    });
    if (width <= 1000) {
      await expect(mobileToggle).toHaveAttribute("aria-expanded", "false");
      await mobileToggle.click();
      await expect(mobileToggle).toHaveAttribute("aria-expanded", "true");
    }
    await contents.getByRole("link", { name: "Results", exact: true }).click();
    if (width <= 1000)
      await expect(mobileToggle).toHaveAttribute("aria-expanded", "false");
    await expect(page).toHaveURL(/#results$/);
    await expect(page.locator("#results h2")).toBeInViewport();
    if (width <= 1000)
      expect(
        (await page.locator("#results h2").boundingBox())!.y,
      ).toBeGreaterThan(rail!.y + rail!.height);
    await page.evaluate(() => window.scrollTo(0, 0));
    // Load the evidence below the fold before capturing the complete page.
    for (const image of await page
      .locator(".visual-study .study-photo-trigger img")
      .all()) {
      await image.scrollIntoViewIfNeeded();
      await expect
        .poll(() =>
          image.evaluate(
            (el: HTMLImageElement) => el.complete && el.naturalWidth > 0,
          ),
        )
        .toBe(true);
    }
    await page.evaluate(() => window.scrollTo(0, 0));
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    await page.screenshot({
      path: testInfo.outputPath(`permanence-${width}.png`),
      fullPage: true,
    });
  }
});

test("Permanence arrows animate briefly on entry and respect reduced motion", async ({
  browser,
}, testInfo) => {
  const context = await browser.newContext({
    baseURL: "http://127.0.0.1:3000",
    viewport: { width: 1280, height: 900 },
    recordVideo: {
      dir: testInfo.outputPath("motion"),
      size: { width: 1280, height: 900 },
    },
  });
  const page = await context.newPage();
  await page.goto("/projects/permanence");
  const diagram = page.locator(".architecture-diagram");
  await diagram.scrollIntoViewIfNeeded();
  await expect(diagram).toHaveAttribute("data-entered", "true");
  const arrow = diagram.locator(".flow-arrow span").first();
  await expect(arrow).toHaveCSS("animation-name", "study-flow-down");
  await expect(arrow).toHaveCSS("animation-iteration-count", "2");
  await expect
    .poll(() => arrow.evaluate((el) => el.getAnimations().length))
    .toBe(0);
  await page.emulateMedia({ reducedMotion: "reduce" });
  await expect(arrow).toHaveCSS("animation-name", "none");
  await context.close();
});

test("Permanence images open in a captioned, dismissible dialog", async ({
  page,
}, testInfo) => {
  for (const width of [1280, 390]) {
    await page.setViewportSize({ width, height: 900 });
    await page.goto("/projects/permanence");
    const trigger = page.getByRole("button", { name: /Expand image:/ }).first();
    await trigger.click();
    const dialog = page.getByRole("dialog", { name: "Expanded project image" });
    await expect(dialog).toBeVisible();
    await expect(dialog.locator("figcaption")).toContainText("The prototype");
    await expect
      .poll(() =>
        dialog
          .locator("img")
          .evaluate(
            (image: HTMLImageElement) =>
              image.complete && image.naturalWidth > 0,
          ),
      )
      .toBe(true);
    await page.screenshot({
      path: testInfo.outputPath(`image-overlay-${width}.png`),
    });
    await page.keyboard.press("Escape");
    await expect(dialog).not.toBeVisible();
    await expect(trigger).toBeFocused();
    await page.locator(".study-image .study-photo-trigger").first().click();
    const second = page.getByRole("dialog", { name: "Expanded project image" });
    await expect(second).toBeVisible();
    await second.getByRole("button", { name: "Close image" }).click();
    await expect(second).not.toBeVisible();
    await trigger.click();
    await page.mouse.click(5, 100);
    await expect(dialog).not.toBeVisible();
    await expect(
      page.getByRole("navigation", { name: "Project links" }),
    ).toContainText("LinkedIn");
    await expect(
      page.locator(".project-demo p, .project-demo > a"),
    ).toHaveCount(0);
  }
});
