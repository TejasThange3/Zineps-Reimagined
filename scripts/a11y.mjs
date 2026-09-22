/**
 * Accessibility sweep. Runs axe over every route in both themes and at two
 * widths, and reports violations grouped by rule.
 */
import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

const BASE = process.env.BASE || "http://127.0.0.1:5173";

const routes = [
  "/",
  "/shipping",
  "/logistics-operating-system",
  "/shipping-ai",
  "/integrations",
  "/pricing",
  "/blog",
  "/blog/dimensional-weight",
  "/knowledge-base",
  "/contact",
  "/no-such-page",
];

const browser = await chromium.launch({ channel: "chrome" });
const found = new Map();
let checks = 0;

for (const theme of ["light", "dark"]) {
  for (const width of [1440, 390]) {
    const ctx = await browser.newContext({
      viewport: { width, height: 900 },
      colorScheme: theme,
    });
    await ctx.addInitScript(
      (t) => localStorage.setItem("zineps-theme", t),
      theme,
    );
    const page = await ctx.newPage();

    for (const route of routes) {
      await page.goto(BASE + route, { waitUntil: "networkidle" });
      await page.waitForTimeout(250);
      const { violations } = await new AxeBuilder({ page })
        .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
        .analyze();
      checks++;

      for (const violation of violations) {
        const key = violation.id;
        if (!found.has(key))
          found.set(key, {
            impact: violation.impact,
            help: violation.help,
            where: new Set(),
            sample: violation.nodes[0]?.html?.slice(0, 160),
          });
        found.get(key).where.add(`${route} ${theme} ${width}`);
      }
    }
    await ctx.close();
  }
}

await browser.close();

console.log(`\n${checks} page checks across ${routes.length} routes.\n`);

if (!found.size) {
  console.log("No WCAG 2.1 A or AA violations detected.");
} else {
  for (const [id, info] of found) {
    console.log(`[${info.impact}] ${id}: ${info.help}`);
    console.log(`  on: ${[...info.where].slice(0, 6).join(", ")}`);
    if (info.sample) console.log(`  eg: ${info.sample}`);
    console.log();
  }
  process.exitCode = 1;
}
