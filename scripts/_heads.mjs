import { chromium } from "@playwright/test";
import sharp from "sharp";

const b = await chromium.launch({ channel: "chrome" });
for (const width of [1440, 1024]) {
  const c = await b.newContext({ viewport: { width, height: 900 } });
  const p = await c.newPage();
  await p.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
  const h = await p.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < h; y += 500) { await p.evaluate((t) => window.scrollTo(0, t), y); await p.waitForTimeout(60); }
  await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(400);

  for (const [sel, name] of [
    [".rates-lede h2", "rates"], [".flow-head h2", "flow"],
    [".aud-head h2", "aud"], [".intel-copy h2", "intel"], [".dev-copy h2", "dev"],
  ]) {
    const el = await p.$(sel);
    if (!el) { console.log(width, name, "missing"); continue; }
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
    console.log(`${width} ${name.padEnd(6)} lines=${mins.length} ink=[${mins.join(",")}] spread=${spread}px`);
  }
  await c.close();
}
await b.close();
