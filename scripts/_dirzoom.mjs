import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "chrome" });
for (const theme of ["light", "dark"]) {
  const c = await b.newContext({ viewport: { width: 1440, height: 900 }, colorScheme: theme });
  await c.addInitScript((t) => localStorage.setItem("zineps-theme", t), theme);
  const p = await c.newPage();
  await p.goto("http://127.0.0.1:5173/integrations", { waitUntil: "networkidle" });
  await p.waitForTimeout(600);
  const grid = await p.$(".dir-grid");
  await grid.screenshot({ path: `docs/shots/dirgrid-${theme}.png` });
  await c.close();
}
await b.close();
console.log("captured");
