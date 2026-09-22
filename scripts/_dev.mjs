import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "chrome" });
const c = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await c.newPage();
await p.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
await p.evaluate(() => document.getElementById("developers")?.scrollIntoView());
await p.waitForTimeout(900);
console.log(await p.evaluate(() => {
  const s = document.getElementById("developers");
  if (!s) return "missing section";
  const grid = s.querySelector(".dev-grid");
  const copy = s.querySelector(".dev-copy");
  const win = s.querySelector(".dev-window");
  const pre = s.querySelector(".dev-code");
  const r = (el) => el ? el.getBoundingClientRect().toJSON() : null;
  return {
    sectionH: s.getBoundingClientRect().height,
    grid: r(grid), copyH: copy?.getBoundingClientRect().height,
    winH: win?.getBoundingClientRect().height,
    preH: pre?.getBoundingClientRect().height,
    copyOpacity: copy ? getComputedStyle(copy).opacity : null,
    winOpacity: win ? getComputedStyle(win).opacity : null,
    lines: s.querySelectorAll(".dev-line").length,
  };
}));
await b.close();
