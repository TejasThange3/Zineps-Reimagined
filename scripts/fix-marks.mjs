/**
 * Rebuilds the eight partner marks the main pipeline could not recover.
 *
 * build-marks.mjs detects a background plate from the artwork's border and
 * keys it out. On these eight that heuristic misfired: badge-shaped logos
 * whose own fill touches the edge were read as plate, which washed Temu and
 * Deutsche Bahn out to pastel, left crop marks around Amazon and Correos, and
 * erased Moneybird entirely. They were then dropped from the directory, which
 * left grey two-letter placeholders among full-colour logos.
 *
 * The vendor SVGs in public/assets/partners are clean, so these are rasterised
 * straight from source — transparent where the artwork is transparent, and
 * nothing keyed — then measured the same way as every other mark.
 */
import sharp from "sharp";
import { readFileSync, writeFileSync, existsSync } from "node:fs";

const SOURCES = {
  amazon: "amazonnl.svg", // the wordmark, to match bol and Kaufland beside it
  temu: "temu.svg",
  snelstart: "snelstart.svg",
  moneybird: "moneybird.svg",
  stockitup: "stockitup.webp",
  postnl: "postnl.svg",
  correos: "correos.svg",
  dbschenker: "dbschenker.svg",
};

const manifestPath = "src/data/marks.json";
const manifest = JSON.parse(readFileSync(manifestPath, "utf8"));

for (const [id, file] of Object.entries(SOURCES)) {
  const src = `public/assets/partners/${file}`;
  if (!existsSync(src)) throw new Error(`missing ${src}`);

  const png = await sharp(src, { density: 600 })
    .resize({ height: 192, fit: "inside" })
    .trim({ threshold: 1 })
    .png()
    .toBuffer();

  const { data, info } = await sharp(png)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  // Mean luminance of the inked pixels only, weighted by coverage.
  let sum = 0;
  let weight = 0;
  for (let i = 0; i < data.length; i += 4) {
    const a = data[i + 3] / 255;
    if (a < 0.1) continue;
    const [r, g, b] = [data[i], data[i + 1], data[i + 2]].map((v) => {
      const c = v / 255;
      return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
    });
    sum += (0.2126 * r + 0.7152 * g + 0.0722 * b) * a;
    weight += a;
  }
  const lum = weight ? sum / weight : 1;

  writeFileSync(`public/assets/marks-colour/${id}.png`, png);
  manifest[id] = {
    ratio: +(info.width / info.height).toFixed(3),
    // Dark artwork disappears on the dark page; it gets the light chip.
    lift: lum < 0.3,
    lum: +lum.toFixed(3),
  };
  console.log(id.padEnd(11), JSON.stringify(manifest[id]));
}

writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + "\n");
