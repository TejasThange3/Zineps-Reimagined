import fs from "node:fs/promises";
import { geoOrthographic, geoPath, geoGraticule10 } from "d3-geo";
import { feature } from "topojson-client";
const world = JSON.parse(
  await fs.readFile("node_modules/world-atlas/countries-110m.json", "utf8"),
);
const projection = geoOrthographic()
  .rotate([-5, -25])
  .scale(177)
  .translate([250, 205]);
const path = geoPath(projection);
const countries = feature(world, world.objects.countries);
const destinations = [
  [-74, 40.7],
  [4.9, 52.37],
  [13.4, 52.52],
  [55.3, 25.2],
  [18.4, -33.9],
  [72.8, 19.1],
];
const nodes = destinations.map((d) => projection(d));
const connections = nodes
  .slice(1)
  .map(([x, y], i) => {
    const [sx, sy] = nodes[0];
    return `<path d="M${sx} ${sy} Q${(sx + x) / 2} ${Math.min(sy, y) - 55 - i * 5} ${x} ${y}"/>`;
  })
  .join("");
const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="500" height="410" viewBox="0 0 500 410"><defs><radialGradient id="ocean" cx="35%" cy="30%"><stop stop-color="#335a41"/><stop offset="1" stop-color="#122d22"/></radialGradient><radialGradient id="shade" cx="33%" cy="25%" r="80%"><stop offset=".3" stop-color="#0b2119" stop-opacity="0"/><stop offset="1" stop-color="#061c14" stop-opacity=".75"/></radialGradient><pattern id="dots" width="4" height="4" patternUnits="userSpaceOnUse"><circle cx="2" cy="2" r=".65" fill="#b4d697"/></pattern><clipPath id="land"><path d="${path(countries)}"/></clipPath></defs><circle cx="250" cy="205" r="192" fill="none" stroke="#8aba6b" stroke-opacity=".13"/><path d="${path({ type: "Sphere" })}" fill="url(#ocean)" stroke="#70985e" stroke-opacity=".6"/><path d="${path(geoGraticule10())}" fill="none" stroke="#91b279" stroke-width=".55" opacity=".16"/><path d="${path(countries)}" fill="#507a48" stroke="#9ab880" stroke-width=".35" opacity=".7"/><g clip-path="url(#land)"><rect width="500" height="410" fill="url(#dots)" opacity=".6"/></g><circle cx="250" cy="205" r="177" fill="url(#shade)"/><g fill="none" stroke="#c9eea2" stroke-width="1.3" opacity=".8">${connections}</g>${nodes.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#b7e894" opacity=".17"/><circle cx="${x}" cy="${y}" r="2.6" fill="#d8f3bc"/>`).join("")}<text x="62" y="115" fill="#c6dfb2" font-size="8" font-family="monospace" letter-spacing="1.5">CONNECTED BY POSSIBILITY</text><path d="M65 125H130" stroke="#a6ce85" stroke-opacity=".5"/><text x="335" y="355" fill="#b3cf9d" font-size="7" font-family="monospace">ILLUSTRATIVE NETWORK</text></svg>`;
await fs.writeFile("public/assets/connected-globe.svg", svg);
