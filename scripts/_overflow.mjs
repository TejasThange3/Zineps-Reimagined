import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "chrome" });
const cases = [["/", 1440], ["/", 1024], ["/integrations", 390], ["/pricing", 390]];
for (const [route, width] of cases) {
  const c = await b.newContext({ viewport: { width, height: 900 } });
  const p = await c.newPage();
  await p.goto("http://127.0.0.1:5173" + route, { waitUntil: "networkidle" });
  await p.waitForTimeout(400);
  const hits = await p.evaluate((w) => {
    const out = [];
    for (const el of document.querySelectorAll("body *")) {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) continue;
      if (r.right > w + 1 || r.left < -1) {
        out.push({
          sel: el.tagName.toLowerCase() +
            (typeof el.className === "string" && el.className
              ? "." + el.className.trim().split(/\s+/).slice(0, 3).join(".")
              : ""),
          left: Math.round(r.left), right: Math.round(r.right),
          w: Math.round(r.width),
        });
      }
    }
    // Keep the outermost offenders only.
    return out.slice(0, 8);
  }, width);
  console.log(`\n${route} @${width}`);
  for (const h of hits) console.log("  ", h.sel, `left=${h.left} right=${h.right} w=${h.w}`);
  await c.close();
}
await b.close();
