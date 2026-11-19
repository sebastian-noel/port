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
