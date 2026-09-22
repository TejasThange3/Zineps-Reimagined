import { chromium } from "@playwright/test";
import fs from "node:fs/promises";
await fs.mkdir("docs/screenshots", { recursive: true });
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage();
for (const width of [1440, 390]) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto("http://127.0.0.1:5173");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: `docs/screenshots/foundation-${width}.png`,
    fullPage: true,
  });
  console.log({
    width,
    overflow: await page.evaluate(
      () => document.documentElement.scrollWidth > innerWidth,
    ),
  });
}
await browser.close();
