import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext();
const page = await context.newPage();
const report = [];
for (const width of [360, 390, 720, 768, 1024, 1440, 1920]) {
  await page.setViewportSize({ width, height: 1000 });
  await page.goto("http://127.0.0.1:4173");
  await page.evaluate(() => document.fonts.ready);
  report.push({
    width,
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  });
  await page.screenshot({
    path: `docs/screenshots/viewport-${width}.png`,
    animations: "disabled",
  });
}
await page.setViewportSize({ width: 1440, height: 1000 });
await page.goto("http://127.0.0.1:4173");
await page.getByRole("radio", { name: "Balanced", exact: true }).focus();
await page.keyboard.press("ArrowLeft");
report.push({
  radioKeyboard: await page
    .getByRole("radio", { name: "Fastest delivery", exact: true })
    .isChecked(),
});
await page
  .getByRole("link", { name: "Explore the platform", exact: true })
  .click();
await page.waitForURL("**/shipping");
await page.waitForSelector("#workspace");
await page.evaluate(() => window.scrollTo({ top: 900, behavior: "instant" }));
report.push({
  destination: page.url(),
  headerBottomAfterScroll: await page
    .locator("header")
    .evaluate((el) => el.getBoundingClientRect().bottom),
});
await page.goto("http://127.0.0.1:4173");
await page.getByRole("button", { name: "View shipment" }).click();
await page.keyboard.press("Tab");
report.push({
  drawerFocus: await page.evaluate(
    () => !!document.activeElement?.closest("dialog"),
  ),
});
await page.keyboard.press("Escape");
report.push({
  drawerReturnFocus: await page
    .getByRole("button", { name: "View shipment" })
    .evaluate((el) => el === document.activeElement),
});
await fs.writeFile("docs/layout-checks.json", JSON.stringify(report, null, 2));
console.log(JSON.stringify(report));
await browser.close();
