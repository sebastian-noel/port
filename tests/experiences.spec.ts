import { expect, test } from "@playwright/test";

test("experience details open individually, globally, and with the keyboard", async ({
  page,
}) => {
  await page.goto("/experiences");
  const first = page.locator("#bny");
  const disclosure = first.locator("summary");
  await expect(page.locator("details[open]")).toHaveCount(0);
  await expect(first.getByRole("heading", { level: 2 })).toBeVisible();
  await expect(first.getByText(/Building cloud infrastructure/)).toBeVisible();
  await expect(first.getByRole("link", { name: /LinkedIn/ })).not.toBeVisible();
  await disclosure.focus();
  await page.keyboard.press("Enter");
  await expect(first.locator("details")).toHaveAttribute("open", "");
  await expect(first.getByRole("link", { name: /LinkedIn/ })).toBeVisible();
  await expect(page.locator("details[open]")).toHaveCount(1);
  await page
    .getByRole("button", { name: "Show all details", exact: true })
    .click();
  await expect(page.locator("details[open]")).toHaveCount(7);
  await expect(
    page.getByRole("button", { name: "Hide all details", exact: true }),
  ).toHaveAttribute("aria-expanded", "true");
  await disclosure.click();
  await expect(page.locator("details[open]")).toHaveCount(6);
  await expect(
    page.getByRole("button", { name: "Show all details", exact: true }),
  ).toHaveAttribute("aria-expanded", "false");
  await page
    .getByRole("button", { name: "Show all details", exact: true })
    .click();
  await page
    .getByRole("button", { name: "Hide all details", exact: true })
    .click();
  await expect(page.locator("details[open]")).toHaveCount(0);
});

test("image carousels support controls and keyboard without leaving their bounds", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/experiences");
  const gallery = page
    .locator("#bny")
    .getByRole("region", { name: "BNY image gallery" });
  await expect(
    gallery.getByRole("button", { name: "Previous image" }),
  ).toBeDisabled();
  await gallery.getByRole("button", { name: "Next image" }).click();
  await expect(
    gallery.getByRole("button", { name: "Show image 2" }),
  ).toHaveAttribute("aria-pressed", "true");
  const viewport = gallery.getByLabel(
    "Images. Use left and right arrow keys to browse.",
    { exact: true },
  );
  await viewport.focus();
  await page.keyboard.press("End");
  await expect(
    gallery.getByRole("button", { name: "Next image" }),
  ).toBeDisabled();
  await page.keyboard.press("ArrowRight");
  await expect(
    gallery.getByRole("button", { name: "Show image 3" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("ArrowLeft");
  await expect(
    gallery.getByRole("button", { name: "Show image 2" }),
  ).toHaveAttribute("aria-pressed", "true");
  await page.keyboard.press("Home");
  await expect(
    gallery.getByRole("button", { name: "Previous image" }),
  ).toBeDisabled();
  await gallery.getByRole("button", { name: "Show image 3" }).click();
  await expect(
    gallery.getByRole("button", { name: "Next image" }),
  ).toBeDisabled();
  await expect(
    page.locator("#bny-spring").getByRole("button", { name: "Show image 1" }),
  ).toHaveAttribute("aria-pressed", "true");
});

test("timeline tracks scrolling, navigates anchors, and leaves mobile navigation clear", async ({
  page,
}) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/experiences");
  const timeline = page.getByRole("navigation", {
    name: "Experience timeline",
  });
  const jump = timeline.getByRole("link", { name: /Jan 2026.*Knight Hacks/ });
  await jump.click();
  await expect(page).toHaveURL(/#knight-hacks$/);
  await expect(page.locator("#knight-hacks h2")).toBeFocused();
  await expect(jump).toHaveAttribute("aria-current", "step");
  await expect(page.locator("#knight-hacks details")).not.toHaveAttribute(
    "open",
  );
  await page.locator("#fsec").scrollIntoViewIfNeeded();
  await expect(
    timeline.getByRole("link", { name: /May 2025.*FSEC/ }),
  ).toHaveAttribute("aria-current", "step");
  await page.setViewportSize({ width: 390, height: 844 });
  await expect(timeline).toBeHidden();
  await expect(page.getByRole("combobox")).toHaveCount(0);
  await page.getByRole("button", { name: "Show all details" }).click();
  const mentors = page.getByRole("heading", { name: /^mentors?$/i });
  await expect(mentors).toHaveCount(1);
  await expect(
    page.locator("#ucf-ai").getByRole("heading", { name: "Mentors" }),
  ).toBeVisible();
});

test("rounded cards fit phone, tablet, wide desktop, and enlarged text", async ({
  page,
}, testInfo) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/experiences");
  for (const width of [1600, 1280, 900, 768, 390, 320]) {
    await page.setViewportSize({ width, height: 1000 });
    await expect(page.locator("#bny .experience-card")).toBeVisible();
    const card = page.locator("#bny .experience-card");
    expect((await card.boundingBox())!.width).toBeLessThanOrEqual(720);
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBe(true);
    if (width === 1280 || width === 390) {
      await page.screenshot({
        path: testInfo.outputPath(`experiences-${width}.png`),
      });
    }
  }
  await page.addStyleTag({ content: "html { font-size: 200%; }" });
  await page
    .getByRole("button", { name: "Show all details", exact: true })
    .click();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(
    await page
      .locator("#bny")
      .evaluate((element) => element.getAnimations({ subtree: true }).length),
  ).toBe(0);
  expect(errors).toEqual([]);
});

test("details remain usable without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("http://127.0.0.1:3000/experiences#bny");
  await page.locator("#bny summary").click();
  await expect(
    page.locator("#bny").getByRole("link", { name: /LinkedIn/ }),
  ).toBeVisible();
  await expect(page.locator("#bny h2")).toHaveText("Software Engineer Intern");
  await context.close();
});
