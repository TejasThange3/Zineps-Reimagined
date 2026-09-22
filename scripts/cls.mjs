import { chromium } from "@playwright/test";
const BASE = process.env.BASE || "http://127.0.0.1:4173";
const raw = process.env.R || "pricing";
const route = raw.startsWith("/") ? raw : "/" + raw;
const browser = await chromium.launch({ channel: "chrome" });
const ctx = await browser.newContext({ viewport: { width: 390, height: 844 } });
const page = await ctx.newPage();
await page.addInitScript(() => {
  window.__shifts = [];
  new PerformanceObserver((list) => {
    for (const e of list.getEntries()) {
      if (e.hadRecentInput) continue;
      window.__shifts.push({
        value: e.value,
        t: Math.round(e.startTime),
        rects: (e.sources || []).map((s) => ({
          from: s.previousRect && [Math.round(s.previousRect.y), Math.round(s.previousRect.height)],
          to: s.currentRect && [Math.round(s.currentRect.y), Math.round(s.currentRect.height)],
        })),
        sources: (e.sources || []).map((s) => {
          const n = s.node;
          if (!n || !n.tagName) return "unknown";
          return (
            n.tagName.toLowerCase() +
            (n.className && typeof n.className === "string"
              ? "." + n.className.trim().split(/\s+/).join(".")
              : "")
          );
        }),
      });
    }
  }).observe({ type: "layout-shift", buffered: true });
});
await page.goto(BASE + route, { waitUntil: "load" });
await page.waitForTimeout(3000);
const shifts = await page.evaluate(() => window.__shifts);
let total = 0;
for (const s of shifts) {
  total += s.value;
  console.log(
    `${s.value.toFixed(4)} @${s.t}ms  ${s.sources.slice(0, 3).join(" | ")}  ` +
      JSON.stringify(s.rects.slice(0, 3)),
  );
}
console.log("\nCLS total:", total.toFixed(4));
await browser.close();
