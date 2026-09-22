import fs from "node:fs/promises";
import { geoMercator, geoPath } from "d3-geo";
import { feature } from "topojson-client";
import sharp from "sharp";

const world = JSON.parse(
  await fs.readFile("node_modules/world-atlas/countries-110m.json", "utf8"),
);
const projection = geoMercator()
  .center([4.9041, 52.3676])
  .scale(1500)
  .translate([365, 265])
  .clipExtent([
    [0, 0],
    [760, 650],
  ]);
const path = geoPath(projection);
const shapes = feature(world, world.objects.countries)
  .features.map((country) => `<path d="${path(country) || ""}"/>`)
  .join("");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="760" height="650" viewBox="0 0 760 650"><defs><pattern id="grid" width="42" height="42" patternUnits="userSpaceOnUse"><path d="M42 0H0V42" fill="none" stroke="#284031" stroke-width=".6"/></pattern><pattern id="dots" width="6" height="6" patternUnits="userSpaceOnUse"><circle cx="3" cy="3" r=".8" fill="#50715a"/></pattern></defs><rect width="760" height="650" fill="#101917"/><rect width="760" height="650" fill="url(#grid)"/><g fill="#192b20" stroke="#38533f" stroke-width=".75">${shapes}</g><g fill="url(#dots)" stroke="none" opacity=".55">${shapes}</g></svg>`;
await fs.writeFile("public/assets/europe-map.svg", svg);

await fs.mkdir("docs/reference-sheets", { recursive: true });
const files = (await fs.readdir("SS")).filter((f) => f.endsWith(".png")).sort();
for (let batch = 0; batch < Math.ceil(files.length / 12); batch++) {
  const overlays = [];
  for (let slot = 0; slot < 12 && batch * 12 + slot < files.length; slot++) {
    const file = files[batch * 12 + slot];
    const left = (slot % 4) * 400,
      top = Math.floor(slot / 4) * 260;
    overlays.push({
      input: await sharp(`SS/${file}`)
        .resize(390, 225, { fit: "inside" })
        .toBuffer(),
      left,
      top,
    });
    overlays.push({
      input: Buffer.from(
        `<svg width="390" height="25"><text x="5" y="17" font-size="14" font-family="Arial">${file}</text></svg>`,
      ),
      left,
      top: top + 230,
    });
  }
  await sharp({
    create: { width: 1600, height: 780, channels: 3, background: "#fff" },
  })
    .composite(overlays)
    .jpeg()
    .toFile(`docs/reference-sheets/sheet-${batch}.jpg`);
}
console.log("Created geographic SVG and reference contact sheets.");
