import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "chrome" });
const c = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await c.newPage();
await p.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
await p.waitForTimeout(500);

console.log(await p.evaluate(() => {
  const h = [...document.querySelectorAll("h2")].find((n) =>
    n.textContent.includes("buying power"),
  );
  if (!h) return "not found";
  const box = h.getBoundingClientRect();
  const cs = getComputedStyle(h);

  // Measure where ink actually starts on each line using a Range per line.
  const text = h.firstChild;
  const range = document.createRange();
  const lines = [];
  let last = null;
  for (let i = 0; i < text.length; i++) {
    range.setStart(text, i);
    range.setEnd(text, i + 1);
    const r = range.getBoundingClientRect();
    if (r.width === 0 && r.height === 0) continue;
    if (last === null || r.top > last + 2) {
      lines.push({ char: text.data[i], left: +(r.left - box.left).toFixed(2) });
      last = r.top;
    }
  }
  return {
    boxLeft: +box.left.toFixed(2),
    textIndent: cs.textIndent,
    paddingLeft: cs.paddingLeft,
    textWrap: cs.textWrap,
    fontSize: cs.fontSize,
    lineStarts: lines,
  };
}));
await b.close();
