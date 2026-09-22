import { chromium } from "@playwright/test";
import sharp from "sharp";

const ROUTES = [
  ["/", [".hero-title", ".scale-title", ".closing-copy h2", ".faq-side h2"]],
  ["/shipping", [".intro-copy h1", ".caps-head h2", ".split-copy h2"]],
  ["/logistics-operating-system", [".intro-copy h1", ".caps-head h2", ".figrow-title"]],
  ["/shipping-ai", [".intro-copy h1", ".caps-head h2"]],
  ["/integrations", [".intro-copy h1", ".api-band-in h2"]],
  ["/pricing", [".intro-copy h1", ".compare-head h2", ".unit-cost-copy h2"]],
  ["/blog", [".intro-copy h1", ".jrn-hero h2"]],
  ["/blog/dimensional-weight", [".prose-head h1"]],
  ["/knowledge-base", [".intro-copy h1"]],
  ["/contact", [".intro-copy h1", ".contact-copy h2"]],
];

const b = await chromium.launch({ channel: "chrome" });
const c = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await c.newPage();
const bad = [];

for (const [route, sels] of ROUTES) {
  await p.goto("http://127.0.0.1:5173" + route, { waitUntil: "networkidle" });
  const h = await p.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 600) { await p.evaluate((t) => window.scrollTo(0, t), y); await p.waitForTimeout(50); }
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(350);

  for (const sel of sels) {
    const el = await p.$(sel);
    if (!el) { console.log(route, sel, "MISSING"); continue; }
    const buf = await el.screenshot();
    const { data, info } = await sharp(buf).greyscale().raw().toBuffer({ resolveWithObject: true });
    const rows = [];
    for (let y = 0; y < info.height; y++) {
      let first = -1;
      for (let x = 0; x < info.width; x++) if (data[y * info.width + x] < 150) { first = x; break; }
      rows.push(first);
    }
    const lines = []; let cur = null; let gap = 0;
    for (const v of rows) {
      if (v === -1) { gap++; if (cur && gap > 3) { lines.push(cur); cur = null; } continue; }
      gap = 0;
      if (!cur) cur = { min: v }; else cur.min = Math.min(cur.min, v);
    }
    if (cur) lines.push(cur);
    const mins = lines.map((l) => l.min);
    const spread = mins.length > 1 ? Math.max(...mins) - Math.min(...mins) : 0;
    const flag = spread > 2 ? "  <-- RAGGED" : "";
    if (spread > 2) bad.push({ route, sel, spread, mins });
    console.log(`${route.padEnd(28)} ${sel.padEnd(20)} lines=${mins.length} ink=[${mins.join(",")}] spread=${spread}${flag}`);
  }
}
console.log(bad.length ? `\n${bad.length} ragged headings` : "\nAll headings aligned within 2px");
await b.close();
