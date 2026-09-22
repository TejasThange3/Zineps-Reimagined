import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "chrome" });
const c = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await c.newPage();
await p.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
await p.waitForTimeout(800);
console.log("pinned attr:", await p.getAttribute(".stack", "data-pinned"));

// Scroll through the workflow and watch which rail step is current.
const flow = await p.$("#workflow");
const box = await flow.boundingBox();
for (const f of [0, 0.25, 0.5, 0.75, 1]) {
  await p.evaluate((y) => window.scrollTo(0, y), box.y + box.height * f);
  await p.waitForTimeout(700);
  const state = await p.evaluate(() => {
    const steps = [...document.querySelectorAll(".flow-step")];
    const cur = steps.findIndex((s) => s.hasAttribute("data-current"));
    const cards = [...document.querySelectorAll(".stack-card")].map((c) => {
      const r = c.getBoundingClientRect();
      return Math.round(r.top);
    });
    return { current: cur, cardTops: cards };
  });
  console.log(`at ${Math.round(f * 100)}%`, JSON.stringify(state));
}
await b.close();
