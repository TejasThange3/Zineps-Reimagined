import fs from "node:fs/promises";
import sharp from "sharp";
const originals = (await fs.readdir("current site ss")).filter((f) =>
  f.endsWith(".png"),
);
const tiles = [];
for (const [i, file] of originals.entries()) {
  tiles.push({
    input: await sharp(`current site ss/${file}`)
      .resize(500, 290, { fit: "inside" })
      .toBuffer(),
    left: (i % 3) * 510,
    top: Math.floor(i / 3) * 320,
  });
  tiles.push({
    input: Buffer.from(
      `<svg width="500" height="25"><text x="5" y="18" font-family="Arial" font-size="14">${file}</text></svg>`,
    ),
    left: (i % 3) * 510,
    top: Math.floor(i / 3) * 320 + 290,
  });
}
await sharp({
  create: { width: 1530, height: 960, channels: 3, background: "#fff" },
})
  .composite(tiles)
  .jpeg()
  .toFile("docs/reference-sheets/current-site-comparison.jpg");
const files = (await fs.readdir("docs/screenshots")).filter(
  (f) => f.startsWith("revision-") && f.endsWith("-1440.png"),
);
for (const file of files) {
  const meta = await sharp(`docs/screenshots/${file}`).metadata();
  await sharp(`docs/screenshots/${file}`)
    .extract({
      left: 0,
      top: 0,
      width: meta.width,
      height: Math.min(1100, meta.height),
    })
    .resize(1200)
    .png()
    .toFile(`docs/screenshots/inspect-${file}`);
}
