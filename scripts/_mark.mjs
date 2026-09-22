import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "chrome" });
const c = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await c.newPage();
await p.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
console.log(await p.evaluate(() => {
  const m = document.querySelector(".wall-run .mark");
  const s = getComputedStyle(m);
  return {
    tag: m.tagName, cls: m.className, src: m.getAttribute("src"),
    w: s.width, h: s.height, bg: s.backgroundColor,
    mask: s.maskImage, wMask: s.webkitMaskImage,
    objectFit: s.objectFit, natural: [m.naturalWidth, m.naturalHeight],
    filter: s.filter, mixBlend: s.mixBlendMode,
  };
}));
await b.close();
