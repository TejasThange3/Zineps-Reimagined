import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "chrome" });
for (const w of [1440, 1280, 1200, 1100, 1024, 900, 820, 768, 740]) {
  const c = await b.newContext({ viewport: { width: w, height: 900 } });
  const p = await c.newPage();
  await p.goto("http://127.0.0.1:4173/", { waitUntil: "networkidle" });
  const r = await p.evaluate(() => {
    const out = [];
    document.querySelectorAll("h1,h2,h3").forEach((h) => {
      if (!h.querySelector(":scope > .display-line")) return;
      const parent = h.parentElement.getBoundingClientRect();
      const lines = [...h.querySelectorAll(":scope > .display-line")];
      const widest = Math.max(...lines.map((l) => {
        const range = document.createRange();
        range.selectNodeContents(l);
        return Math.max(...[...range.getClientRects()].map((x) => x.width), 0);
      }));
      const rows = lines.reduce((n, l) => {
        const range = document.createRange();
        range.selectNodeContents(l);
        return n + [...range.getClientRects()].filter((x) => x.height > 4).length;
      }, 0);
      out.push({
        cls: h.className || h.tagName,
        lines: lines.length,
        rows,
        widest: Math.round(widest),
        avail: Math.round(parent.width),
        text: h.textContent.slice(0, 30),
      });
    });
    return out;
  });
  for (const x of r) {
    const wrapped = x.rows > x.lines ? " WRAPPED" : "";
    const over = x.widest > x.avail ? " OVERFLOW" : "";
    if (wrapped || over) console.log(w, x.cls, `lines=${x.lines} rows=${x.rows} widest=${x.widest} avail=${x.avail}${wrapped}${over}`, `"${x.text}"`);
  }
  await c.close();
}
console.log("done");
await b.close();
