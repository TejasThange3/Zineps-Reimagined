import { chromium } from "@playwright/test";
import { mkdirSync } from "node:fs";

const BASE = process.env.BASE || "http://127.0.0.1:5173";
const OUT = process.env.OUT || "docs/shots";
// Git Bash rewrites a bare leading slash into a Windows path, so routes are
// passed without one and normalised here.
const routes = (process.env.ROUTES || "")
  .split(",")
  .map((r) => r.trim())
  .filter(Boolean)
  .map((r) => (r.startsWith("/") ? r : "/" + r))
  .concat((process.env.ROUTES || "").trim() ? [] : ["/"]);
const themes = (process.env.THEMES || "light").split(",");
const width = Number(process.env.W || 1440);
const height = Number(process.env.H || 900);

mkdirSync(OUT, { recursive: true });

const browser = await chromium.launch({
  channel: "chrome",
  // Software WebGL, so the globe renders in headless captures too.
  args: [
    "--use-gl=angle",
    "--use-angle=swiftshader",
    "--enable-unsafe-swiftshader",
  ],
});
for (const theme of themes) {
  const ctx = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor: 1,
    colorScheme: theme === "dark" ? "dark" : "light",
  });
  await ctx.addInitScript(
    (t) => localStorage.setItem("zineps-theme", t),
    theme,
  );
  const page = await ctx.newPage();
  for (const route of routes) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    // Let reveals fire and fonts settle.
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await page.waitForTimeout(1400);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(500);
    const slug = route === "/" ? "home" : route.replace(/\//g, "-").slice(1);
    const name = `${slug}-${theme}-${width}`;
    await page.screenshot({ path: `${OUT}/${name}.png`, fullPage: true });
    console.log("captured", name);
  }
  await ctx.close();
}
await browser.close();
