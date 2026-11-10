import { expect, test } from "@playwright/test";
import {
  records,
  validateEntries,
  visibleEntries,
  type Entry,
  collectionEntries,
} from "../app/_content/entries";
import { site } from "../app/_lib/site";

const routes = [
  "/",
  "/projects",
  "/experiences",
  "/about",
  "/resume",
  ...records.map((entry) => `/${entry.collection}/${entry.slug}`),
];

test("content records validate and publication excludes drafts", () => {
  expect(() => validateEntries(records)).not.toThrow();
  expect(visibleEntries(records, false)).toHaveLength(records.length);
  expect(visibleEntries(records, true)).toEqual(
    records.filter((entry) => entry.published),
  );
  const additional: Entry = { ...records[0], slug: "another-project" };
  expect(() => validateEntries([...records, additional])).not.toThrow();
  expect(() => validateEntries([...records, records[0]])).toThrow(/duplicate/);
  expect(() =>
    validateEntries([{ ...records[0], slug: "../escape" }]),
  ).toThrow();
  expect(() => validateEntries([{ ...records[0], published: true }])).toThrow(
    /real media/,
  );
  expect(() =>
    validateEntries([
      { ...records[0], links: [{ label: "Bad", href: "javascript:alert(1)" }] },
    ]),
  ).toThrow();
});

for (const route of routes) {
  test(`page and metadata: ${route}`, async ({ page }) => {
    const response = await page.goto(route);
    expect(response?.status()).toBe(200);
    await expect(page.locator("main h1")).toHaveCount(1);
    await expect(page.locator('link[rel="canonical"]')).toHaveAttribute(
      "href",
      `${site.origin}${route === "/" ? "" : route}`,
    );
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute(
      "content",
      "noindex, nofollow",
    );
    await expect(page.locator('meta[property="og:image"]')).toHaveCount(1);
    await expect(
      page.locator("a[href^='tel:'], a[href^='mailto:']"),
    ).toHaveCount(0);
    for (const width of [1280, 768, 390, 320]) {
      await page.setViewportSize({ width, height: 900 });
      expect(
        await page.evaluate(
          () => document.documentElement.scrollWidth <= window.innerWidth,
        ),
        `${route} at ${width}px`,
      ).toBe(true);
    }
  });
}

test("mobile menu traps focus, closes with Escape, restores focus, and navigates", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/");
  const menu = page.getByRole("button", { name: "Menu" });
  await menu.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  await expect(menu).toHaveAttribute("aria-expanded", "true");
  await expect(dialog.getByRole("button", { name: "Close" })).toBeFocused();
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Tab");
    expect(
      await page.evaluate(() => !!document.activeElement?.closest("dialog")),
    ).toBe(true);
  }
  for (let i = 0; i < 12; i++) {
    await page.keyboard.press("Shift+Tab");
    expect(
      await page.evaluate(() => !!document.activeElement?.closest("dialog")),
    ).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).not.toBeVisible();
  await expect(menu).toBeFocused();
  await expect(menu).toHaveAttribute("aria-expanded", "false");
  await menu.click();
  await dialog.getByRole("link", { name: "Projects", exact: true }).click();
  await expect(page).toHaveURL(/\/projects$/);
  await expect(
    page.getByRole("heading", { name: "Projects", exact: true }),
  ).toBeVisible();
  await expect(dialog).not.toBeVisible();
  await page.goBack();
  await expect(
    page.getByRole("heading", { name: "Sebastian Noel", exact: true }),
  ).toBeVisible();
});

test("skip link and project navigation work with the keyboard", async ({
  page,
}) => {
  await page.goto("/");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  const projectLink = page
    .getByRole("region", { name: "Featured Projects" })
    .getByRole("link", { name: /Permanence/ });
  await projectLink.focus();
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/projects\/permanence$/);
  await page.reload();
  await expect(
    page.getByRole("heading", { name: "Permanence", exact: true }),
  ).toBeVisible();
  await page.getByRole("link", { name: "All projects" }).click();
  await expect(page).toHaveURL(/\/projects$/);
});

test("missing content returns 404 and indexing endpoints stay closed for preview", async ({
  request,
}) => {
  for (const path of [
    "/projects/missing",
    "/experiences/missing",
    "/other/permanence",
    "/missing",
  ]) {
    expect((await request.get(path)).status()).toBe(404);
  }
  const sitemap = await request.get("/sitemap.xml");
  expect(sitemap.status()).toBe(200);
  expect(await sitemap.text()).not.toContain("<loc>");
  const robots = await request.get("/robots.txt");
  expect(await robots.text()).toContain("User-Agent: GPTBot");
  expect(await robots.text()).toContain("Disallow: /");
  expect(
    (await request.get("/opengraph-image")).headers()["content-type"],
  ).toContain("image/png");
});

test("About structured data matches public profiles", async ({ page }) => {
  await page.goto("/about");
  const profile = JSON.parse(
    await page.locator('script[type="application/ld+json"]').innerText(),
  );
  expect(profile.mainEntity.name).toBe(site.name);
  expect(profile.mainEntity.sameAs).toEqual(
    site.profiles.map((profile) => profile.href),
  );
  expect(profile.mainEntity).not.toHaveProperty("telephone");
  expect(profile.mainEntity).not.toHaveProperty("email");
});

test("capture desktop and mobile with reduced motion", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: testInfo.outputPath("desktop.png"),
    fullPage: true,
  });
  await page.goto("/projects");
  await page.screenshot({
    path: testInfo.outputPath("projects.png"),
    fullPage: true,
  });
  await page.goto("/experiences");
  await page.screenshot({
    path: testInfo.outputPath("experiences.png"),
    fullPage: true,
  });
  await page.goto("/");
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: testInfo.outputPath("mobile.png"),
    fullPage: true,
  });
  await page.getByRole("button", { name: "Menu" }).click();
  await page.screenshot({ path: testInfo.outputPath("mobile-menu.png") });
  await page.keyboard.press("Escape");
  await page.goto("/projects");
  await page.screenshot({
    path: testInfo.outputPath("mobile-projects.png"),
    fullPage: true,
  });
  await page.goto("/experiences");
  await page.screenshot({
    path: testInfo.outputPath("mobile-experiences.png"),
    fullPage: true,
  });
  await page.goto("/projects/permanence");
  await page.screenshot({
    path: testInfo.outputPath("mobile-detail.png"),
    fullPage: true,
  });
  expect(errors).toEqual([]);
});

test("enlarged text and landscape keep navigation usable", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 700 });
  await page.goto("/");
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  await page.getByRole("button", { name: "Menu" }).click();
  await expect(page.getByRole("dialog")).toBeVisible();
  expect(
    await page.evaluate(() => {
      const dialog = document.querySelector("dialog")!;
      return dialog.scrollWidth <= dialog.clientWidth;
    }),
  ).toBe(true);
  await page.keyboard.press("Escape");
  await page.setViewportSize({ width: 844, height: 390 });
  await page.reload();
  await page.getByRole("button", { name: "Menu" }).click();
  const resume = page.getByRole("dialog").getByRole("link", {
    name: "Resume (PDF, opens in a new tab)",
    exact: true,
  });
  await expect(resume).toHaveAttribute("target", "_blank");
  await expect(resume).toHaveAttribute("href", "/resume.pdf");
});

test("home hierarchy, PDF new tab, and public PDF asset", async ({
  page,
  request,
}) => {
  await page.goto("/");
  await expect(page.locator("main a[href='/about']")).toHaveCount(0);
  await expect(page.locator(".wordmark")).toHaveText("snoel.dev");
  const featured = page.getByRole("region", { name: "Featured Projects" });
  const projectTitles = featured.getByRole("heading", { level: 3 });
  await expect(projectTitles).toHaveText(["Permanence", "Recall", "GregHouse"]);
  const cards = featured.locator(".project-card");
  const cardRows = await cards.evaluateAll((items) =>
    items.map((card) => card.getBoundingClientRect().top),
  );
  expect(new Set(cardRows).size).toBe(1);
  await expect(page.locator(".game-space").getByRole("button")).toHaveCount(0);
  await expect(page.locator(".game-space > :not(.sr-only)")).toHaveCount(0);
  expect(
    await page
      .locator(".game-space")
      .evaluate((el) => el.getBoundingClientRect().width),
  ).toBeGreaterThan(
    await page
      .locator(".home-sidebar")
      .evaluate((el) => el.getBoundingClientRect().width),
  );
  const resume = page.locator(".resume-link");
  await expect(resume).toHaveAttribute("target", "_blank");
  await expect(resume).toHaveAttribute("href", "/resume.pdf");
  const pdfNavigation = page
    .context()
    .waitForEvent(
      "request",
      (request) =>
        request.url().endsWith("/resume.pdf") && request.isNavigationRequest(),
    );
  const popupPromise = page.waitForEvent("popup");
  await resume.click();
  const popup = await popupPromise;
  const navigation = await pdfNavigation;
  expect(navigation.method()).toBe("GET");
  await expect(page).toHaveURL("/");
  await popup.close();
  const pdf = await request.get("/resume.pdf");
  expect(pdf.status()).toBe(200);
  expect(pdf.headers()["content-type"]).toContain("application/pdf");
  expect((await pdf.body()).subarray(0, 5).toString()).toBe("%PDF-");
});

test("project search covers names, technology, teammate, event, and reset", async ({
  page,
}) => {
  await page.goto("/projects");
  const search = page.getByRole("searchbox", { name: "Search projects" });
  await expect(page.locator(".project-card")).toHaveCount(12);
  for (const [query, title] of [
    ["permanence", "Permanence"],
    ["mongodb", "DishDash"],
    ["carlos rincon", "Next Step"],
    ["shellhacks", "Next Step"],
  ]) {
    await search.fill(query);
    await expect(page.locator(".project-card")).toHaveCount(1);
    await expect(page.locator(".project-card h2")).toHaveText(title);
  }
  await search.fill("no-such-project");
  await expect(page.getByText(/No projects match/)).toBeVisible();
  await expect(page.getByRole("status")).toHaveText("0 projects shown");
  await page.getByRole("button", { name: "Clear search" }).click();
  await expect(page.locator(".project-card")).toHaveCount(12);
  await expect(page.locator(".project-card.is-placeholder a")).toHaveCount(0);
  for (const width of [1280, 390, 320]) {
    await page.setViewportSize({ width, height: 900 });
    const sizes = await page.locator(".project-card").evaluateAll((cards) =>
      cards.map((c) => ({
        width: c.getBoundingClientRect().width,
        height: c.getBoundingClientRect().height,
      })),
    );
    expect(
      Math.max(...sizes.map((s) => s.width)) -
        Math.min(...sizes.map((s) => s.width)),
    ).toBeLessThan(1);
    expect(
      Math.max(...sizes.map((s) => s.height)) -
        Math.min(...sizes.map((s) => s.height)),
    ).toBeLessThan(1);
  }
});

test("experience chronology and timeline descriptions", async ({ page }) => {
  const items = collectionEntries("experiences");
  expect(items.map((e) => e.startDate ?? "")).toEqual([
    "2026-08",
    "2026-01",
    "2026-01",
    "2025-07",
    "",
    "",
  ]);
  expect(() =>
    validateEntries([{ ...records[0], startDate: "2026-13" }]),
  ).toThrow(/timeline/);
  expect(() =>
    validateEntries([
      { ...records[0], startDate: "2026-08", endDate: "2025-01" },
    ]),
  ).toThrow(/timeline/);
  await page.goto("/experiences");
  await expect(page.locator(".experience-card")).toHaveCount(6);
  await expect(
    page.locator(".experience-card").first().getByRole("listitem"),
  ).toHaveCount(3);
  await expect(page.locator("time").first()).toHaveText("Aug 2026");
});

test("intro replays on home navigation and refresh", async ({
  browser,
}, testInfo) => {
  const context = await browser.newContext({
    baseURL: "http://127.0.0.1:3000",
    viewport: { width: 1280, height: 900 },
    recordVideo: {
      dir: testInfo.outputPath("motion"),
      size: { width: 960, height: 675 },
    },
  });
  const page = await context.newPage();
  const errors: string[] = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto("/");
  const intro = page.locator(".intro-name");
  await expect(intro).toHaveAttribute("data-intro-state", "typing");
  await expect(intro).toHaveCSS("background-color", "rgb(3, 32, 61)");
  await expect(
    page.getByRole("heading", { name: "Sebastian Noel", exact: true }),
  ).toBeVisible();
  await expect(page.locator(".tile-field")).toHaveAttribute(
    "data-wave",
    "active",
  );
  const caret = intro.locator(".caret");
  await expect(caret).toHaveCSS("animation-iteration-count", "3, 1");
  await expect(caret).toHaveCSS("animation-duration", "1s, 0.26s");
  await expect(caret).toHaveCSS("animation-delay", "0s, 3.5s");
  await page.screenshot({ path: testInfo.outputPath("intro-wave.png") });
  await expect(intro).toHaveAttribute("data-intro-state", "complete");
  await expect(caret).toHaveCSS("opacity", "0");
  await expect(page.locator(".tile-field")).toHaveAttribute(
    "data-wave",
    "idle",
  );
  await expect(page.locator(".tile").first().locator("i")).toHaveCount(1);
  await expect(page.locator(".tile").first()).toHaveCSS("width", "20px");
  await expect(page.locator(".motion-toggle")).toHaveCount(0);
  await page
    .getByRole("navigation", { name: "Main", exact: true })
    .getByRole("link", { name: "Projects", exact: true })
    .click();
  await page
    .getByRole("navigation", { name: "Main", exact: true })
    .getByRole("link", { name: "Home", exact: true })
    .click();
  await expect(intro).toHaveAttribute("data-intro-state", "typing");
  await expect(page.locator(".tile-field")).toHaveAttribute(
    "data-wave",
    "active",
  );
  await page.reload();
  await expect(intro).toHaveAttribute("data-intro-state", "typing");
  await expect(page.locator(".tile-field")).toHaveAttribute(
    "data-wave",
    "active",
  );
  expect(errors).toEqual([]);
  await context.close();
});

test("reduced motion and early navigation cancel decorative motion", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/");
  await expect(page.locator(".intro-name")).toHaveAttribute(
    "data-intro-state",
    "complete",
  );
  await expect(page.locator(".intro-name .caret")).toHaveCSS("opacity", "0");
  expect(
    await page
      .locator(".tile-field")
      .evaluate((el) => el.getAnimations({ subtree: true }).length),
  ).toBe(0);
  await page.emulateMedia({ reducedMotion: "no-preference" });
  await page.reload();
  await page
    .getByRole("navigation", { name: "Main", exact: true })
    .getByRole("link", { name: "Projects", exact: true })
    .click();
  await page.waitForTimeout(2100);
  expect(
    await page
      .locator(".tile-field")
      .evaluate((el) => el.getAnimations({ subtree: true }).length),
  ).toBe(0);
});
