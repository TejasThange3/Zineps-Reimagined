import { chromium } from "@playwright/test";
const b = await chromium.launch({ channel: "chrome" });
const c = await b.newContext();
const p = await c.newPage();
await p.goto("http://127.0.0.1:4173/knowledge-base", { waitUntil: "networkidle" });
console.log(await p.evaluate(() => ({
  href: location.href,
  pathname: location.pathname,
  h1: document.querySelector("h1")?.textContent?.slice(0, 40),
  firstSection: document.querySelector("main > section")?.className,
})));
await b.close();
