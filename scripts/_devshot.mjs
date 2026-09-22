import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "chrome" });
const c = await b.newContext({ viewport: { width: 1440, height: 1000 } });
const p = await c.newPage();
await p.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
const h = await p.evaluate(() => document.body.scrollHeight);
for (let y = 0; y < h; y += 500) { await p.evaluate((t) => window.scrollTo(0, t), y); await p.waitForTimeout(70); }
await p.evaluate(() => document.getElementById("developers")?.scrollIntoView({ block: "center" }));
await p.waitForTimeout(1500);
await (await p.$("#developers")).screenshot({ path: "docs/shots/devsec.png" });
console.log(await p.evaluate(() => {
  const s = document.getElementById("developers");
  const copy = s.querySelector(".dev-copy");
  const win = s.querySelector(".dev-window");
  return { copy: getComputedStyle(copy).opacity, win: getComputedStyle(win).opacity,
           copyShown: copy.dataset.shown, winShown: win.dataset.shown,
           h: s.getBoundingClientRect().height };
}));
await b.close();
