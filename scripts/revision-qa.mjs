import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext();
const page = await context.newPage();
const errors = [];
page.on("pageerror", (e) => errors.push(e.message));
const routes = [
  "/",
  "/shipping",
  "/logistics-operating-system",
  "/shipping-ai",
  "/integrations",
  "/pricing",
  "/blog",
  "/knowledge-base",
  "/contact",
  "/blog/shipping-workflow",
];
const report = [];
for (const width of [390, 768, 1440]) {
  await page.setViewportSize({ width, height: 1000 });
  for (const route of routes) {
    await page.goto("http://127.0.0.1:4173" + route);
    await page.waitForSelector("h1");
    await page.evaluate(() => document.fonts.ready);
    const overflow = await page.evaluate(() => ({
      page: document.documentElement.scrollWidth > innerWidth,
      elements: [...document.querySelectorAll("body *")]
        .filter((e) => {
          const r = e.getBoundingClientRect();
          return (
            r.width > 0 &&
            (r.right > innerWidth + 2 || r.left < -2) &&
            getComputedStyle(e).position !== "absolute" &&
            getComputedStyle(e).position !== "fixed"
          );
        })
        .slice(0, 8)
        .map((e) => ({ tag: e.tagName, class: e.className })),
    }));
    const axe = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    report.push({
      width,
      route,
      overflow,
      violations: axe.violations.map((v) => ({
        id: v.id,
        nodes: v.nodes.map((n) => ({
          target: n.target,
          summary: n.failureSummary,
        })),
      })),
    });
    await page.screenshot({
      path: `docs/screenshots/revision-${route === "/" ? "home" : route.slice(1).replaceAll("/", "-")}-${width}.png`,
      fullPage: true,
      animations: "disabled",
    });
  }
}
await fs.writeFile(
  "docs/revision-qa.json",
  JSON.stringify({ report, errors }, null, 2),
);
console.log(
  JSON.stringify({
    checks: report.length,
    overflow: report.filter((x) => x.overflow.page),
    violations: report.filter((x) => x.violations.length),
    errors,
  }),
);
await browser.close();
