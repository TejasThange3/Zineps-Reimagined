/**
 * Typography and layout audit.
 *
 * Walks every route at three widths and reports the things that make a page
 * look unconsidered: headings breaking into too many lines, a last line left
 * with a single short word, text overflowing its box, and anything spilling
 * past the viewport.
 */
import { chromium } from "@playwright/test";

const BASE = process.env.BASE || "http://127.0.0.1:5173";
const routes = [
  "/",
  "/shipping",
  "/logistics-operating-system",
  "/shipping-ai",
  "/integrations",
  "/pricing",
  "/blog",
  "/blog/dimensional-weight",
  "/knowledge-base",
  "/contact",
];
const widths = [1440, 1024, 390];

const browser = await chromium.launch({
  channel: "chrome",
  args: ["--use-gl=angle", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"],
});

const findings = [];

for (const width of widths) {
  const ctx = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await ctx.newPage();

  for (const route of routes) {
    await page.goto(BASE + route, { waitUntil: "networkidle" });
    await page.waitForTimeout(250);

    const issues = await page.evaluate(() => {
      const out = [];
      const text = (el) => el.textContent.replace(/\s+/g, " ").trim();

      /* Line count and the last line's share of the box, measured with a
         Range so it reflects what actually rendered. */
      const lines = (el) => {
        const node = [...el.childNodes].find(
          (n) => n.nodeType === 3 && n.data.trim(),
        );
        if (!node) return null;
        const range = document.createRange();
        const box = el.getBoundingClientRect();
        const rows = [];
        for (let i = 0; i < node.length; i++) {
          range.setStart(node, i);
          range.setEnd(node, i + 1);
          const r = range.getBoundingClientRect();
          if (!r.width && !r.height) continue;
          const row = rows[rows.length - 1];
          if (!row || r.top > row.top + 2) {
            rows.push({ top: r.top, left: r.left, right: r.right });
          } else {
            row.right = Math.max(row.right, r.right);
          }
        }
        return { rows, width: box.width };
      };

      for (const el of document.querySelectorAll("h1, h2")) {
        if (!el.offsetParent && el.offsetHeight === 0) continue;
        const info = lines(el);
        if (!info || info.rows.length < 2) continue;

        if (info.rows.length > 3) {
          out.push({
            kind: "lines",
            n: info.rows.length,
            text: text(el).slice(0, 70),
          });
        }
        const last = info.rows[info.rows.length - 1];
        const share = (last.right - last.left) / info.width;
        if (info.rows.length >= 2 && share < 0.16) {
          out.push({
            kind: "orphan",
            share: +share.toFixed(2),
            text: text(el).slice(0, 70),
          });
        }
      }

      /* Anything wider than its parent, which is how text ends up sitting
         over a neighbour. */
      for (const el of document.querySelectorAll(
        "h1, h2, h3, p, li, td, th, .btn",
      )) {
        if (el.scrollWidth > el.clientWidth + 2 && el.clientWidth > 0) {
          const style = getComputedStyle(el);
          if (style.overflowX !== "visible") continue;
          if (style.textOverflow === "ellipsis") continue;
          out.push({
            kind: "overflow",
            by: el.scrollWidth - el.clientWidth,
            text: text(el).slice(0, 50),
          });
        }
      }

      /* body has overflow-x: clip, so scrollWidth still reports clipped
         content. What matters is whether the page actually scrolls sideways,
         so test that directly. */
      const before = window.scrollX;
      window.scrollTo(99999, window.scrollY);
      const moved = window.scrollX > before;
      window.scrollTo(0, window.scrollY);
      if (moved) {
        out.push({
          kind: "page-scrolls-sideways",
          by: document.documentElement.scrollWidth - window.innerWidth,
        });
      }

      /* Controls that cannot be reached because they overflow a row that
         does not scroll. */
      for (const el of document.querySelectorAll(".seg-rail, .compare-scroll")) {
        const cs = getComputedStyle(el);
        if (!/auto|scroll/.test(cs.overflowX)) continue;
        if (el.getBoundingClientRect().width > window.innerWidth + 1) {
          out.push({
            kind: "rail-too-wide",
            by: Math.round(el.getBoundingClientRect().width),
            text: el.className,
          });
        }
      }

      return out;
    });

    for (const issue of issues) findings.push({ route, width, ...issue });
  }
  await ctx.close();
}

await browser.close();

if (!findings.length) {
  console.log("No typography issues found.");
} else {
  const byKind = {};
  for (const f of findings) (byKind[f.kind] ??= []).push(f);
  for (const [kind, list] of Object.entries(byKind)) {
    console.log(`\n${kind} (${list.length})`);
    for (const f of list.slice(0, 14)) {
      console.log(
        `  ${String(f.width).padStart(4)} ${f.route.padEnd(28)} ` +
          `${f.n ?? f.share ?? f.by ?? ""} ${f.text ?? ""}`,
      );
    }
    if (list.length > 14) console.log(`  ... ${list.length - 14} more`);
  }
  process.exitCode = 1;
}
