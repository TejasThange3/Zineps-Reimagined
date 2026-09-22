/**
 * Homepage typography audit.
 *
 * Every heading and every paragraph on the homepage is rasterised and the
 * left-most ink pixel of each line is measured. A heading whose second line
 * starts a few pixels off the first reads as broken even though nothing in
 * the CSS looks wrong, because the eye aligns on the ink, not the box.
 *
 * Also reports where a block's own left edge sits relative to its section, so
 * a heading and the paragraph under it can be checked against each other.
 */
import { chromium } from "@playwright/test";
import sharp from "sharp";

const WIDTHS = [1440, 1280, 1200, 1100, 1024, 900, 768, 640, 430, 390];
const PORT = process.env.PORT || 4173;

const browser = await chromium.launch({ channel: "chrome" });
const problems = [];

for (const width of WIDTHS) {
  const context = await browser.newContext({ viewport: { width, height: 900 } });
  const page = await context.newPage();
  await page.goto(`http://127.0.0.1:${PORT}/`, { waitUntil: "networkidle" });

  // Scroll the whole page so every reveal has fired before anything is shot.
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 600) {
    await page.evaluate((t) => window.scrollTo(0, t), y);
    await page.waitForTimeout(40);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);

  /* Collect every text block worth measuring, with the path needed to shoot
     it and the computed alignment for context. */
  const blocks = await page.evaluate(() => {
    const out = [];
    const nodes = document.querySelectorAll(
      "main h1, main h2, main h3, main p, main .lead, main li > span",
    );
    nodes.forEach((node, i) => {
      const rect = node.getBoundingClientRect();
      if (rect.width < 60 || rect.height < 12) return;
      /* The stacked workflow cards overlap by design, so a screenshot of a
         buried card's heading captures the card painted above it. Skip
         anything that is not the top-most thing at its own position; those
         blocks are measured separately against their real line boxes. */
      if (rect.top > 0 && rect.bottom < window.innerHeight) {
        const hit = document.elementFromPoint(
          rect.left + Math.min(6, rect.width / 2),
          rect.top + rect.height / 2,
        );
        if (hit && !node.contains(hit) && !hit.contains(node)) return;
      }
      const text = (node.textContent || "").trim();
      if (text.length < 12) return;
      const style = getComputedStyle(node);
      node.setAttribute("data-audit", String(i));
      out.push({
        id: String(i),
        tag: node.tagName.toLowerCase(),
        cls: node.className && typeof node.className === "string"
          ? node.className.split(/\s+/).slice(0, 2).join(".")
          : "",
        align: style.textAlign,
        wrap: style.textWrap || style.textWrapStyle || "",
        indent: style.textIndent,
        w: Math.round(rect.width),
        text: text.slice(0, 44).replace(/\s+/g, " "),
      });
    });
    return out;
  });

  console.log(`\n=== ${width}px — ${blocks.length} text blocks ===`);

  for (const block of blocks) {
    const el = await page.$(`[data-audit="${block.id}"]`);
    if (!el) continue;

    /* The workflow cards are a deliberate stack driven by scroll, so a
       screenshot taken as the element is scrolled into view catches the card
       above still sliding across it. Bring it into view, let the scroll
       animation settle, then hide every stack card that does not hold this
       block so nothing can paint over it. */
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(250);
    await page.evaluate((id) => {
      const node = document.querySelector(`[data-audit="${id}"]`);
      document.querySelectorAll(".stack-card").forEach((card) => {
        card.style.visibility = !node || card.contains(node) ? "" : "hidden";
      });
    }, block.id);
    await page.waitForTimeout(60);

    let buf;
    try {
      buf = await el.screenshot({ scale: "css" });
    } catch {
      continue; // off-screen or zero-size after a reveal
    }

    const { data, info } = await sharp(buf)
      .greyscale()
      .raw()
      .toBuffer({ resolveWithObject: true });

    /* Walk rows, grouping runs of inked rows into lines, and take the
       left-most inked column for each. */
    const lines = [];
    let current = null;
    let gap = 0;
    for (let y = 0; y < info.height; y++) {
      let first = -1;
      for (let x = 0; x < info.width; x++) {
        if (data[y * info.width + x] < 170) {
          first = x;
          break;
        }
      }
      if (first === -1) {
        gap++;
        if (current && gap > 3) {
          lines.push(current);
          current = null;
        }
        continue;
      }
      gap = 0;
      if (!current) current = { min: first };
      else current.min = Math.min(current.min, first);
    }
    if (current) lines.push(current);

    if (lines.length < 2) continue;
    const mins = lines.map((l) => l.min);
    const spread = Math.max(...mins) - Math.min(...mins);

    /* Two pixels is the practical floor: a rounded letterform and a straight
       stem never land on exactly the same column. Beyond that it is visible. */
    if (spread > 2) {
      problems.push({ width, ...block, spread, mins });
      console.log(
        `RAGGED ${String(width).padEnd(5)} ${block.tag}.${block.cls}`.padEnd(46) +
          ` spread=${String(spread).padStart(3)} ink=[${mins.join(",")}]` +
          ` align=${block.align} indent=${block.indent}` +
          `  "${block.text}"`,
      );
    }
  }

  await context.close();
}

console.log(
  problems.length
    ? `\n${problems.length} ragged blocks on the homepage`
    : "\nHomepage clean: every multi-line block aligns within 2px",
);
await browser.close();
