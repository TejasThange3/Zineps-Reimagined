import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "chrome" });
for (const r of ["/", "/knowledge-base", "/shipping-ai", "/blog", "/shipping", "/logistics-operating-system", "/contact"]) {
  const c = await b.newContext({ viewport: { width: 1280, height: 900 } });
  const p = await c.newPage();
  const msgs = [];
  p.on("console", (m) => { if (m.type() === "error" || m.type() === "warning") msgs.push(m.text()); });
  p.on("pageerror", (e) => msgs.push("PAGEERROR " + e.message));
  await p.goto("http://127.0.0.1:4173" + r, { waitUntil: "networkidle" });
  await p.waitForTimeout(700);
  console.log(r.padEnd(28), msgs.length ? msgs.slice(0, 3).join(" || ").slice(0, 220) : "clean");
  await c.close();
}
await b.close();
