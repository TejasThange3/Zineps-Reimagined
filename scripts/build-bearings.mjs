/**
 * Extract left side bearings from Geist so headings can be optically aligned.
 *
 * A glyph's left side bearing is the gap between its origin and where its ink
 * actually starts. In Geist that gap is 12/1000em for a capital T and
 * 80/1000em for a lowercase b, so a heading beginning with T sits about three
 * pixels further right than the paragraph under it at 44px. The layout is
 * correct; the type just does not look aligned, which is the whole reason
 * optical alignment exists.
 *
 * The site subtracts the measured bearing from the first line, so the ink
 * lines up with the column edge rather than the glyph origin.
 */
import * as fontkit from "fontkit";
import { writeFileSync } from "node:fs";

const FILE =
  "node_modules/@fontsource-variable/geist/files/geist-latin-wght-normal.woff2";

const font = fontkit.openSync(FILE);
const upm = font.unitsPerEm;

const chars =
  "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split("");

const bearings = {};
for (const ch of chars) {
  try {
    const glyph = font.layout(ch).glyphs[0];
    if (!glyph) continue;
    const value = glyph.bbox.minX / upm;
    // Only record what is worth correcting. Below half a percent of an em the
    // shift is invisible and not worth the DOM attribute.
    if (Math.abs(value) < 0.005) continue;
    bearings[ch] = Number(value.toFixed(4));
  } catch {
    /* glyph missing from the subset */
  }
}

writeFileSync(
  "src/data/bearings.json",
  JSON.stringify(bearings) + "\n",
);

const range = Object.values(bearings);
console.log(
  `bearings: ${range.length} glyphs, ` +
    `${(Math.min(...range) * 1000).toFixed(0)} to ` +
    `${(Math.max(...range) * 1000).toFixed(0)} per 1000em`,
);
