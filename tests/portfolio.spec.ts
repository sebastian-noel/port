import { expect, test } from "@playwright/test";
import {
  records,
  validateEntries,
  visibleEntries,
  type Entry,
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
    page.getByRole("heading", { name: "Projects.", exact: true }),
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
  await page.locator(".project-link").first().click();
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
  await page.setViewportSize({ width: 390, height: 844 });
  await page.screenshot({
    path: testInfo.outputPath("mobile.png"),
    fullPage: true,
  });
  await page.getByRole("button", { name: "Menu" }).click();
  await page.screenshot({ path: testInfo.outputPath("mobile-menu.png") });
  await page.keyboard.press("Escape");
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
    await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth),
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
  await page.getByRole("dialog").getByRole("link", { name: "Resume", exact: true }).click();
  await expect(page).toHaveURL(/\/resume$/);
});
