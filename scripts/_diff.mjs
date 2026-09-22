import { chromium } from "@playwright/test";
import fs from "node:fs";

const route = "/" + (process.env.R || "knowledge-base").replace(/^\//, "");
const file = "dist" + route + "/index.html";
const html = fs.readFileSync(file, "utf8");
const m = html.match(/<div id="root">([\s\S]*)<\/div>\s*<noscript>/);
const server = m ? m[1] : "";

const b = await chromium.launch({ channel: "chrome" });
const c = await b.newContext({ viewport: { width: 1280, height: 900 } });
const p = await c.newPage();
// Load the built page but strip the prerendered markup so React renders fresh.
await p.route("**/*", async (r) => {
  if (r.request().resourceType() === "document") {
    const res = await r.fetch();
    let body = await res.text();
    body = body.replace(/<div id="root">[\s\S]*?<\/div>\s*<noscript>/, '<div id="root"></div><noscript>');
    await r.fulfill({ response: res, body });
  } else await r.continue();
});
await p.goto("http://127.0.0.1:4173" + route, { waitUntil: "networkidle" });
await p.waitForTimeout(600);
const client = await p.evaluate(() => document.getElementById("root").innerHTML);
await b.close();

// Find the first divergence.
let i = 0;
while (i < server.length && i < client.length && server[i] === client[i]) i++;
if (i >= server.length && i >= client.length) { console.log("identical"); process.exit(0); }
console.log("first difference at", i);
console.log("\nSERVER: ...", JSON.stringify(server.slice(Math.max(0, i - 180), i + 180)));
console.log("\nCLIENT: ...", JSON.stringify(client.slice(Math.max(0, i - 180), i + 180)));
