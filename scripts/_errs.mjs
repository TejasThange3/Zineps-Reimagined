import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "chrome" });
const c = await b.newContext({ viewport: { width: 1440, height: 900 } });
const p = await c.newPage();
const out = [];
p.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") out.push(m.type()+": "+m.text()); });
p.on("pageerror", (e) => out.push("PAGEERROR " + e.message));
await p.goto("http://127.0.0.1:5173/", { waitUntil: "networkidle" });
await p.evaluate(() => window.scrollTo(0, document.body.scrollHeight * 0.75));
await p.waitForTimeout(2500);
console.log(out.slice(0, 8).join("\n") || "no console errors");
console.log("\nglobe canvas:", await p.evaluate(() => {
  const c = document.querySelector(".globe canvas");
  if (!c) return "missing";
  return { w: c.width, h: c.height, ready: c.classList.contains("is-ready"), ctx: !!c.getContext("webgl") };
}));
await b.close();
