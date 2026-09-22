import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({ reducedMotion: "reduce" }),
  page = await context.newPage();
const report = [];
for (const width of [360, 720, 1024, 1920]) {
  await page.setViewportSize({ width, height: 1000 });
  for (const route of [
    "/",
    "/shipping",
    "/logistics-operating-system",
    "/shipping-ai",
    "/integrations",
    "/pricing",
    "/blog",
    "/knowledge-base",
    "/contact",
  ]) {
    await page.goto("http://127.0.0.1:4173" + route);
    await page.waitForSelector("h1");
    report.push({
      width,
      route,
      overflow: await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth,
      ),
    });
  }
}
for (const width of [390, 1440]) {
  await page.setViewportSize({ width, height: 1000 });
  await page.goto("http://127.0.0.1:4173");
  await page
    .locator(".network-explorer")
    .screenshot({ path: `docs/screenshots/revision-map-${width}.png` });
  await page
    .locator(".platform-doors")
    .screenshot({
      path: `docs/screenshots/revision-platform-doors-${width}.png`,
    });
  await page.goto("http://127.0.0.1:4173/shipping");
  for (const tab of ["Orders", "Automation", "Labels", "Tracking"]) {
    await page
      .locator(".console-sidebar")
      .getByRole("button", { name: tab, exact: true })
      .click();
    await page
      .locator(".product-console")
      .screenshot({
        path: `docs/screenshots/revision-workspace-${tab.toLowerCase()}-${width}.png`,
      });
  }
  for (const tab of ["Tracking", "Returns", "Packing slip"]) {
    await page
      .locator(".after-tabs")
      .getByRole("button", { name: tab, exact: true })
      .click();
    await page
      .locator(".after-stage")
      .screenshot({
        path: `docs/screenshots/revision-after-${tab.toLowerCase().replace(" ", "-")}-${width}.png`,
      });
  }
  await page.goto("http://127.0.0.1:4173/pricing");
  await page
    .locator(".cost-estimator")
    .screenshot({ path: `docs/screenshots/revision-estimator-${width}.png` });
}
await fs.writeFile(
  "docs/revision-breakpoints.json",
  JSON.stringify(report, null, 2),
);
console.log(
  JSON.stringify({
    checks: report.length,
    overflow: report.filter((r) => r.overflow),
  }),
);
await browser.close();
