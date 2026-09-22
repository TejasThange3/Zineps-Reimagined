import { chromium } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
import fs from "node:fs/promises";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: "reduce",
});
const page = await context.newPage();
await page.goto("http://127.0.0.1:5173");
for (const width of [1440, 390]) {
  await page.setViewportSize({ width, height: 1000 });
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
    .analyze();
  const violations = scan.violations.map((v) => ({
    id: v.id,
    nodes: v.nodes.map((n) => ({
      target: n.target,
      summary: n.failureSummary,
    })),
  }));
  console.log(JSON.stringify({ width, violations }, null, 2));
}
await page.setViewportSize({ width: 1440, height: 1000 });
for (const [name, selector] of [
  ["hero", ".hero"],
  ["demo", "#shipping-ai"],
  ["audience", "#audiences"],
  ["integrations", "#integrations"],
]) {
  await page
    .locator(selector)
    .screenshot({
      path: `docs/screenshots/detail-${name}.png`,
      animations: "disabled",
    });
}
await page.setViewportSize({ width: 390, height: 844 });
await page
  .locator("#shipping-ai")
  .screenshot({
    path: "docs/screenshots/mobile-demo.png",
    animations: "disabled",
  });
await page.getByRole("radio", { name: "Lowest cost", exact: true }).check();
console.log("checked cost", await page.locator(".recommended").innerText());
await page.getByRole("button", { name: "View shipment" }).click();
const scan = await new AxeBuilder({ page })
  .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
  .analyze();
console.log(
  "drawer",
  JSON.stringify(
    scan.violations.map((v) => ({
      id: v.id,
      nodes: v.nodes.map((n) => ({
        target: n.target,
        summary: n.failureSummary,
      })),
    })),
    null,
    2,
  ),
);
await fs.writeFile("docs/screenshots/diagnostic-complete.txt", "Complete");
await browser.close();
