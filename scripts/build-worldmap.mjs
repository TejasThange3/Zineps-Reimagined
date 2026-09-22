/**
 * Build the dotted world map used by the network section.
 *
 * Rather than ship a bitmap, this samples a regular grid over an equirectangular
 * projection of the land geometry and keeps the points that fall on land. The
 * result is a few thousand coordinates the page can render as SVG circles,
 * which stays crisp at any size, takes its colour from the theme, and lets
 * individual dots be animated.
 *
 * Source geometry: world-atlas land-110m (Natural Earth, public domain).
 */
import { readFileSync, writeFileSync } from "node:fs";
import { feature } from "topojson-client";
import { geoEquirectangular, geoPath, geoContains } from "d3-geo";

const WIDTH = 1000;
const HEIGHT = 500;
const STEP = 5.2; // spacing between dots in projected pixels

const topo = JSON.parse(
  readFileSync("node_modules/world-atlas/land-110m.json", "utf8"),
);
const land = feature(topo, topo.objects.land);

const projection = geoEquirectangular().fitSize([WIDTH, HEIGHT], land);
const path = geoPath(projection);

const dots = [];

for (let y = STEP / 2; y < HEIGHT; y += STEP) {
  for (let x = STEP / 2; x < WIDTH; x += STEP) {
    const coords = projection.invert([x, y]);
    if (!coords) continue;
    if (!geoContains(land, coords)) continue;
    // Antarctica adds a heavy band along the bottom and says nothing about
    // shipping lanes, so it is dropped.
    if (coords[1] < -58) continue;
    dots.push([Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
  }
}

/* Cities used as endpoints for the animated lanes, projected into the same
   space so the arcs line up with the dots. */
const cities = {
  amsterdam: [4.9041, 52.3676],
  brussels: [4.3517, 50.8503],
  vienna: [16.3738, 48.2082],
  hamburg: [9.9937, 53.5511],
  copenhagen: [12.5683, 55.6761],
  prague: [14.4378, 50.0755],
  lisbon: [-9.1393, 38.7223],
  dublin: [-6.2603, 53.3498],
  stockholm: [18.0686, 59.3293],
  rome: [12.4964, 41.9028],
  london: [-0.1276, 51.5072],
  berlin: [13.405, 52.52],
  paris: [2.3522, 48.8566],
  madrid: [-3.7038, 40.4168],
  milan: [9.19, 45.4642],
  warsaw: [21.0122, 52.2297],
  istanbul: [28.9784, 41.0082],
  newyork: [-74.006, 40.7128],
  saopaulo: [-46.6333, -23.5505],
  dubai: [55.2708, 25.2048],
  mumbai: [72.8777, 19.076],
  singapore: [103.8198, 1.3521],
  shanghai: [121.4737, 31.2304],
  tokyo: [139.6503, 35.6762],
  sydney: [151.2093, -33.8688],
  johannesburg: [28.0473, -26.2041],
  lagos: [3.3792, 6.5244],
  toronto: [-79.3832, 43.6532],
  losangeles: [-118.2437, 34.0522],
};

const projected = {};
for (const [name, lonlat] of Object.entries(cities)) {
  const point = projection(lonlat);
  projected[name] = [
    Math.round(point[0] * 10) / 10,
    Math.round(point[1] * 10) / 10,
  ];
}

/* The dots sit on a regular grid, so each one is just a cell index rather
   than a coordinate pair. That turns 177 kB of path data into about 22 kB of
   integers, and the component expands it back into a single <path> once at
   module load. */
const cols = Math.ceil(WIDTH / STEP);
const cells = dots.map(([x, y]) => {
  const col = Math.round((x - STEP / 2) / STEP);
  const row = Math.round((y - STEP / 2) / STEP);
  return row * cols + col;
});

/* A second, much finer grid over Europe alone, for the hero's lane map.
   Cropping the world grid there left about 25 dots across the panel, which
   reads as scattered confetti rather than a coastline. Sampling the same
   projection at a third of the spacing gives a proper dotted Europe. */
/* Wider than Europe alone. The hero panel is roughly 3.4:1, so a box the
   shape of Europe gets cropped top and bottom to fill it, which is how
   Madrid and Rome fell off the bottom of the frame. A wide box lets the map
   fill the panel and still show every European endpoint. */
const EU = { lon: [-26, 46], lat: [32, 64] };
const EU_STEP = 1.5;
const euTopLeft = projection([EU.lon[0], EU.lat[1]]);
const euBottomRight = projection([EU.lon[1], EU.lat[0]]);
const euView = {
  x: Math.round(euTopLeft[0] * 10) / 10,
  y: Math.round(euTopLeft[1] * 10) / 10,
  w: Math.round((euBottomRight[0] - euTopLeft[0]) * 10) / 10,
  h: Math.round((euBottomRight[1] - euTopLeft[1]) * 10) / 10,
};

const euCols = Math.ceil(euView.w / EU_STEP);
const euCells = [];
for (let row = 0; row * EU_STEP < euView.h; row++) {
  for (let col = 0; col < euCols; col++) {
    const x = euView.x + col * EU_STEP + EU_STEP / 2;
    const y = euView.y + row * EU_STEP + EU_STEP / 2;
    const coords = projection.invert([x, y]);
    if (!coords || !geoContains(land, coords)) continue;
    euCells.push(row * euCols + col);
  }
}

writeFileSync(
  "src/data/worldmap.json",
  JSON.stringify({
    width: WIDTH,
    height: HEIGHT,
    step: STEP,
    cols,
    cells,
    cities: projected,
    europe: {
      view: euView,
      step: EU_STEP,
      cols: euCols,
      cells: euCells,
    },
  }) + "\n",
);

console.log(
  `europe grid: ${euCells.length} dots across ${euCols} columns`,
);
console.log(
  `world map: ${dots.length} dots, ${Object.keys(projected).length} cities, ` +
    `${(JSON.stringify(dots).length / 1024).toFixed(1)} kB of coordinates`,
);
console.log("land bounds check:", path.bounds(land).map((p) => p.map(Math.round)));
