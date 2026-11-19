import { expect, test } from "@playwright/test";
import { records, validateEntries } from "../app/_content/entries";

const selected = [
  "permanence",
  "recall",
  "greghouse",
  "tks-revenge",
  "debt-escape",
  "tidesense",
  "next-step",
  "dishdash",
];

test("project scope matches the owner's selected eight projects", () => {
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
    await expect(
      page.getByRole("link", { name: `Watch ${entry.title} on YouTube` }),
    ).toHaveAttribute(
      "href",
      `https://www.youtube.com/watch?v=${entry.demoVideoId}`,
    );
    await expect(page.locator("main")).not.toContainText(/hackathon projects/i);
    if (
      [
        "permanence",
        "greghouse",
        "debt-escape",
        "next-step",
        "tidesense",
      ].includes(slug)
    ) {
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
      ["case-study", "/projects/debt-escape"],
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
  expect(bounds[0].width / bounds[0].height).toBeCloseTo(16 / 9, 2);
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
  ).toBeLessThan(-9);
  expect(
    await card.evaluate(
      (el) => getComputedStyle(el, "::before").backgroundImage,
    ),
  ).toContain("235, 47, 51");
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
