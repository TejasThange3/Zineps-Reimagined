import { chromium } from "@playwright/test";
import sharp from "sharp";
const browser = await chromium.launch({ channel: "chrome", headless: true });
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const page = await context.newPage();
await page.goto("http://127.0.0.1:4173");
await page.evaluate(() => document.fonts.ready);
await page
  .locator(".hero-copy")
  .evaluate((el) => el.getAnimations().forEach((a) => a.finish()));
await page.screenshot({
  path: "docs/screenshots/desktop-hero.png",
  clip: { x: 0, y: 0, width: 1440, height: 801 },
  animations: "disabled",
});
await sharp("docs/screenshots/desktop-hero.png")
  .resize(1200, 630, { fit: "cover", position: "top" })
  .png()
  .toFile("public/assets/social-preview.png");
for (const width of [360, 390, 768, 1024, 1440, 1920]) {
  await page.setViewportSize({ width, height: 1000 });
  await page.goto("http://127.0.0.1:4173");
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({
    path: `docs/screenshots/final-${width}.png`,
    fullPage: true,
    animations: "disabled",
  });
}
await page.setViewportSize({ width: 390, height: 844 });
await page.goto("http://127.0.0.1:4173");
await page.screenshot({
  path: "docs/screenshots/mobile-hero.png",
  animations: "disabled",
});
await page.getByRole("button", { name: "View shipment" }).click();
await page.screenshot({
  path: "docs/screenshots/mobile-drawer.png",
  animations: "disabled",
});
await browser.close();
console.log(
  "Final responsive screenshots and 1200 × 630 social preview captured.",
);
