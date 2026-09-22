import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "chrome" });
const c = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await c.newPage();
await p.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
await p.waitForTimeout(600);

// Rasterise each heading and find the leftmost inked pixel per text row.
for (const sel of [".rates-lede h2", ".flow-head h2", ".dev-copy h2"]) {
  const el = await p.$(sel);
  if (!el) { console.log(sel, "not found"); continue; }
  const buf = await el.screenshot();
  const sharp = (await import("sharp")).default;
  const { data, info } = await sharp(buf).greyscale().raw().toBuffer({ resolveWithObject: true });
  const rows = [];
  for (let y = 0; y < info.height; y++) {
    let first = -1;
    for (let x = 0; x < info.width; x++) {
      if (data[y * info.width + x] < 140) { first = x; break; }
    }
    rows.push(first);
  }
  // Group consecutive inked rows into lines and take each line's min x.
  const lines = [];
  let cur = null;
  for (let y = 0; y < rows.length; y++) {
    if (rows[y] === -1) { if (cur) { lines.push(cur); cur = null; } continue; }
    if (!cur) cur = { min: rows[y] };
    else cur.min = Math.min(cur.min, rows[y]);
  }
  if (cur) lines.push(cur);
  console.log(sel, "ink left per line:", lines.map((l) => l.min).join(", "));
}
await b.close();
