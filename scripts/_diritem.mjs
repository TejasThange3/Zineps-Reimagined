import { chromium } from "@playwright/test";

const b = await chromium.launch({ channel: "chrome" });
for (const theme of ["light", "dark"]) {
  const c = await b.newContext({
    viewport: { width: 1440, height: 900 },
    colorScheme: theme,
  });
  await c.addInitScript((t) => localStorage.setItem("zineps-theme", t), theme);
  const p = await c.newPage();
  await p.goto("http://127.0.0.1:5173/integrations", {
    waitUntil: "networkidle",
  });
  await p.waitForTimeout(500);

  // Element screenshots, so the sticky header cannot cover the marks.
  const items = p.locator(".dir-item");
  for (let i = 0; i < 4; i++) {
    await items.nth(i).screenshot({ path: `docs/shots/dir-${theme}-${i}.png` });
  }
  await c.close();
}
await b.close();
console.log("ok");
