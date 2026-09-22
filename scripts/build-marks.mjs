/**
 * Normalise the supplied partner logos into mask-ready marks.
 *
 * The originals are raster PNGs wrapped in an SVG, several with a pattern
 * transform that crops the artwork and several with a solid white plate
 * instead of transparency. Rendering those at a fixed height gave a wall of
 * washed out, off-centre, inconsistently weighted logos.
 *
 * Each mark is rasterised at high density, reduced to an alpha channel (from
 * its own transparency, or from its luminance where the plate is opaque),
 * trimmed to its ink, and written as a black PNG whose only information is
 * that alpha. The site paints them through a CSS mask, so the whole wall
 * takes one ink colour and works in both themes.
 */
import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
import * as simpleIcons from "simple-icons";

const SRC = "public/assets/partners";
const OUT = "public/assets/marks";
const COLOUR_OUT = "public/assets/marks-colour";
mkdirSync(OUT, { recursive: true });
mkdirSync(COLOUR_OUT, { recursive: true });

const names = [
  "dhl", "postnl", "dpd", "ups", "fedex", "gls", "bpost", "correos",
  "dbschenker", "shopify", "woocommerce", "magento", "bol", "amazon",
  "lightspeed", "kaufland", "mirakl", "picqer", "prestashop", "wix",
  "odoo", "exactonline", "moneybird", "snelstart", "temu", "mijnwebwinkel",
  "ccvshop", "channeldock", "lyrawms", "microsoftdynamics", "goedgepickt",
  "stockitup",
];

/**
 * Several of the supplied files are too degraded to recover: a low contrast
 * plate, or artwork cropped by the wrapper's pattern transform. Where Simple
 * Icons carries an official single colour vector we use that instead, which
 * is both cleaner and the canonical mark.
 */
const fromSimpleIcons = {
  dhl: "siDhl",
  dpd: "siDpd",
  ups: "siUps",
  fedex: "siFedex",
  shopify: "siShopify",
  woocommerce: "siWoocommerce",
  prestashop: "siPrestashop",
  wix: "siWix",
  odoo: "siOdoo",
  kaufland: "siKaufland",
};

const TMP = "node_modules/.cache/zineps-marks";
mkdirSync(TMP, { recursive: true });

/** Brand hex per mark, where Simple Icons publishes one. */
const brandHex = {};

function simpleIconFile(name) {
  const key = fromSimpleIcons[name];
  const icon = key && simpleIcons[key];
  if (!icon) return null;
  brandHex[name] = `#${icon.hex}`;
  const file = `${TMP}/${name}.svg`;
  writeFileSync(
    file,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="512" height="512"><path fill="#000" d="${icon.path}"/></svg>`,
  );
  return file;
}

async function load(name) {
  const official = simpleIconFile(name);
  if (official) {
    const image = sharp(official, { density: 700 });
    await image.metadata();
    return image;
  }
  for (const candidate of [
    [`${SRC}/${name}.svg`, { density: 700 }],
    [`${SRC}/${name}.png`, {}],
    [`${SRC}/${name}.webp`, {}],
  ]) {
    try {
      const image = sharp(candidate[0], candidate[1]);
      await image.metadata();
      return image;
    } catch {
      /* try the next extension */
    }
  }
  return null;
}

const report = [];
const manifest = {};

for (const name of names) {
  const image = await load(name);
  if (!image) {
    report.push(`${name.padEnd(20)} MISSING`);
    continue;
  }

  try {
    const flat = await image
      .ensureAlpha()
      .resize({ height: 200, fit: "inside", withoutEnlargement: false })
      .png()
      .toBuffer();

    const { data, info } = await sharp(flat)
      .raw()
      .toBuffer({ resolveWithObject: true });

    const { width, height, channels } = info;
    const at = (x, y) => (y * width + x) * channels;
    const lum = (i) =>
      0.2126 * data[i] + 0.7152 * data[i + 1] + 0.0722 * data[i + 2];

    // How much of the artwork is fully opaque? A logo delivered on a solid
    // plate is opaque nearly everywhere, and using that alpha as a mask would
    // paint a filled rectangle.
    let opaqueCount = 0;
    let total = 0;
    for (let i = 3; i < data.length; i += channels) {
      total++;
      if (data[i] >= 250) opaqueCount++;
    }
    const plated = opaqueCount / total > 0.8;

    // When it is plated, work out whether the plate is light or dark by
    // sampling the border, so we know which way round the ink runs.
    let borderLum = 0;
    let borderN = 0;
    for (let x = 0; x < width; x += 2) {
      for (const y of [0, height - 1]) {
        borderLum += lum(at(x, y));
        borderN++;
      }
    }
    for (let y = 0; y < height; y += 2) {
      for (const x of [0, width - 1]) {
        borderLum += lum(at(x, y));
        borderN++;
      }
    }
    const plateLum = borderLum / borderN;
    const lightPlate = plateLum > 128;

    const alpha = Buffer.alloc(width * height);
    for (let p = 0, i = 0; i < data.length; i += channels, p++) {
      if (!plated) {
        alpha[p] = data[i + 3];
        continue;
      }
      // Measure the ink as distance from the plate itself, not from pure
      // white. A DHL yellow plate or a FedEx purple one then knocks out
      // cleanly instead of leaving a grey rectangle behind the mark.
      const l = lum(i);
      const span = lightPlate
        ? Math.max(24, plateLum)
        : Math.max(24, 255 - plateLum);
      const ink = lightPlate ? plateLum - l : l - plateLum;
      alpha[p] = Math.max(
        0,
        Math.min(255, Math.round(((ink / span) * 255 - 10) * 1.22)),
      );
    }

    const inked = await sharp({
      create: { width, height, channels: 3, background: "#000000" },
    })
      .joinChannel(alpha, { raw: { width, height, channels: 1 } })
      .png()
      .toBuffer();

    const final = await sharp(inked)
      .trim({ threshold: 8 })
      .png({ compressionLevel: 9 })
      .toBuffer();

    /* The brand's own colours, trimmed to exactly the same box as the mask so
       the two are interchangeable. A logo wall in full colour needs the real
       artwork; the mask stays for places that want one flat ink. */
    const rgb = Buffer.alloc(width * height * 3);
    /* Simple Icons ships a single-colour path plus the brand's official hex,
       so the colour version is that hex rather than the black we rasterised. */
    const hex = brandHex[name];
    const tint = hex
      ? [
          parseInt(hex.slice(1, 3), 16),
          parseInt(hex.slice(3, 5), 16),
          parseInt(hex.slice(5, 7), 16),
        ]
      : null;

    for (let p = 0, i = 0; i < data.length; i += channels, p++) {
      if (tint) {
        rgb[p * 3] = tint[0];
        rgb[p * 3 + 1] = tint[1];
        rgb[p * 3 + 2] = tint[2];
      } else if (plated) {
        // Knock the plate out and keep the ink's own colour.
        const a = alpha[p] / 255;
        // Un-composite against the plate so edges do not carry a halo.
        for (let ch = 0; ch < 3; ch++) {
          const plate = lightPlate ? 255 : 0;
          const v = a > 0.04 ? (data[i + ch] - plate * (1 - a)) / a : 0;
          rgb[p * 3 + ch] = Math.max(0, Math.min(255, Math.round(v)));
        }
      } else {
        rgb[p * 3] = data[i];
        rgb[p * 3 + 1] = data[i + 1];
        rgb[p * 3 + 2] = data[i + 2];
      }
    }

    const colour = await sharp(rgb, { raw: { width, height, channels: 3 } })
      .joinChannel(alpha, { raw: { width, height, channels: 1 } })
      .png()
      .toBuffer();

    const colourFinal = await sharp(colour)
      .trim({ threshold: 8 })
      .png({ compressionLevel: 9 })
      .toBuffer();

    writeFileSync(`${COLOUR_OUT}/${name}.png`, colourFinal);

    const meta = await sharp(final).metadata();
    writeFileSync(`${OUT}/${name}.png`, final);
    /* How dark is the ink? A navy or near-black wordmark disappears on a dark
       page, so the site needs to know which marks to lift. Measured over the
       opaque pixels only, because the transparent ones are not the logo. */
    const colourRaw = await sharp(colourFinal)
      .raw()
      .toBuffer({ resolveWithObject: true });
    let sum = 0;
    let n = 0;
    const cd = colourRaw.data;
    const cc = colourRaw.info.channels;
    for (let i = 0; i < cd.length; i += cc) {
      const a = cc === 4 ? cd[i + 3] : 255;
      if (a < 160) continue;
      sum += 0.2126 * cd[i] + 0.7152 * cd[i + 1] + 0.0722 * cd[i + 2];
      n++;
    }
    const meanLum = n ? sum / n / 255 : 1;

    manifest[name] = {
      ratio: Number((meta.width / meta.height).toFixed(3)),
      // Below this the mark needs lifting to stay readable on a dark surface.
      lift: meanLum < 0.42,
      lum: Number(meanLum.toFixed(3)),
    };
    report.push(
      `${name.padEnd(20)} ${String(meta.width).padStart(4)}x${meta.height}` +
        `  ratio ${(meta.width / meta.height).toFixed(2).padStart(5)}` +
        `  ${plated ? (lightPlate ? "plate-light" : "plate-dark") : "alpha"}`,
    );
  } catch (error) {
    report.push(`${name.padEnd(20)} FAIL ${String(error.message).slice(0, 70)}`);
  }
}

writeFileSync("src/data/marks.json", JSON.stringify(manifest, null, 2) + "\n");

for (const line of report) console.log(line);
console.log(`wrote src/data/marks.json, ${Object.keys(manifest).length} marks`);
