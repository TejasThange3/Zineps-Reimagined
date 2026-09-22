import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "chrome" });
for (const [route, width] of [["/", 1440], ["/", 1024], ["/integrations", 390], ["/pricing", 390]]) {
  const c = await b.newContext({ viewport: { width, height: 900 } });
  const p = await c.newPage();
  await p.goto("http://127.0.0.1:5173" + route, { waitUntil: "networkidle" });
  await p.waitForTimeout(400);
  const hits = await p.evaluate((w) => {
    const clipped = (el) => {
      let n = el.parentElement;
      while (n && n !== document.documentElement) {
        const cs = getComputedStyle(n);
        if (/hidden|clip|auto|scroll/.test(cs.overflowX)) return true;
        n = n.parentElement;
      }
      return false;
    };
    const out = [];
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      if (r.right <= w + 1) continue;
      if (clipped(el)) continue;
      out.push({
        sel: el.tagName.toLowerCase() +
          (typeof el.className === "string" && el.className
            ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".")
            : ""),
        right: Math.round(r.right), w: Math.round(r.width),
        parent: el.parentElement?.className?.toString().slice(0, 30),
      });
    }
    return out.slice(0, 6);
  }, width);
  console.log(`\n${route} @${width}  (${hits.length} unclipped)`);
  for (const h of hits) console.log("  ", h.sel, `right=${h.right} w=${h.w} in .${h.parent}`);
  await c.close();
}
await b.close();
