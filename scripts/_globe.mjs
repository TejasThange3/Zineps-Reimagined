import { chromium } from "@playwright/test";
const b = await chromium.launch({
  channel: "chrome",
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});
const c = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await c.newPage();
await p.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
await p.evaluate(() => document.getElementById("scale")?.scrollIntoView());
await p.waitForTimeout(3000);
const el = await p.$(".globe");
await el.screenshot({ path: "docs/shots/globe-check.png" });
console.log(await p.evaluate(() => {
  const c = document.querySelector(".globe canvas");
  return { w: c?.width, h: c?.height, ready: c?.classList.contains("is-ready"),
           box: c?.getBoundingClientRect().toJSON() };
}));
await b.close();
