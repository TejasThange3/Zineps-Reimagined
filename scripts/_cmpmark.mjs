import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "chrome" });
const c = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await c.newPage();

await p.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
const wall = await p.evaluate(() => {
  const li = [...document.querySelectorAll(".wall-run li")].find((n) =>
    n.querySelector('img[src*="shopify"]'),
  );
  const chip = li.querySelector(".chip");
  const img = li.querySelector("img");
  const cs = getComputedStyle(chip), is = getComputedStyle(img);
  return { chipPad: cs.padding, chipBg: cs.backgroundColor,
           imgBox: img.getBoundingClientRect().toJSON(),
           imgW: is.width, imgH: is.height, fit: is.objectFit };
});

await p.goto("http://127.0.0.1:5173/integrations", { waitUntil: "networkidle" });
const dir = await p.evaluate(() => {
  const item = [...document.querySelectorAll(".dir-item")].find((n) =>
    n.querySelector('img[src*="shopify"]'),
  );
  const chip = item.querySelector(".chip");
  const img = item.querySelector("img");
  const cs = chip ? getComputedStyle(chip) : null;
  const is = getComputedStyle(img);
  return { hasChip: !!chip, chipPad: cs?.padding, chipBg: cs?.backgroundColor,
           imgBox: img.getBoundingClientRect().toJSON(),
           imgW: is.width, imgH: is.height, fit: is.objectFit,
           markHeight: img.style.getPropertyValue("--mark-h") };
});

console.log("WALL:", JSON.stringify(wall, null, 1));
console.log("DIR :", JSON.stringify(dir, null, 1));
await b.close();
