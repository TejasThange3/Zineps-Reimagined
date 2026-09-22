/* Checks that every lane's auto-framed viewBox actually contains both
   endpoints, at the panel's real aspect ratio. Throwaway verification. */
import { readFileSync } from "node:fs";

const map = JSON.parse(readFileSync("src/data/worldmap.json", "utf8"));
const src = readFileSync("src/data/shipping.ts", "utf8");

const EU_BOX = map.europe.view;
const WORLD_BOX = { x: 20, y: 30, w: 960, h: 420 };
const ASPECT = 3.2;
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function frame(a, b, bounds) {
  const minX = Math.min(a[0], b[0]);
  const maxX = Math.max(a[0], b[0]);
  const minY = Math.min(a[1], b[1]);
  const maxY = Math.max(a[1], b[1]);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;
  const padX = Math.max(26, (maxX - minX) * 0.5);
  const padY = Math.max(16, (maxY - minY) * 0.7);
  let w = maxX - minX + padX * 2;
  let h = maxY - minY + padY * 2;
  if (w / h < ASPECT) w = h * ASPECT;
  else h = w / ASPECT;
  w = Math.min(w, bounds.w);
  h = Math.min(h, bounds.h);
  if (w / h > ASPECT) w = h * ASPECT;
  return {
    x: clamp(cx - w / 2, bounds.x, bounds.x + bounds.w - w),
    y: clamp(cy - h / 2 + h * 0.17, bounds.y, bounds.y + bounds.h - h),
    w,
    h,
  };
}

const inEU = (p) =>
  p[0] >= EU_BOX.x &&
  p[0] <= EU_BOX.x + EU_BOX.w &&
  p[1] >= EU_BOX.y &&
  p[1] <= EU_BOX.y + EU_BOX.h;

const key = (name) => name.toLowerCase().replace(/[^a-z]/g, "");

/* The lane list is generated at import time, so take the city pool straight
   out of the data module's source rather than re-deriving it. */
const pool = [...src.matchAll(/name:\s*"([^"]+)"/g)].map((m) => m[1]);

let checked = 0;
let bad = 0;
let worst = 0;

for (const from of pool) {
  for (const to of pool) {
    if (from === to) continue;
    const a = map.cities[key(from)];
    const b = map.cities[key(to)];
    if (!a || !b) continue;
    const eu = inEU(a) && inEU(b);
    const box = frame(a, b, eu ? EU_BOX : WORLD_BOX);
    // preserveAspectRatio="slice" fills the panel, so the box itself is what
    // must contain both points, with a little room for the label below.
    const margin = (box.w / 120) * 4;
    const holds = (p) =>
      p[0] >= box.x + margin &&
      p[0] <= box.x + box.w - margin &&
      p[1] >= box.y + margin &&
      p[1] <= box.y + box.h - margin;
    checked++;
    if (!holds(a) || !holds(b)) {
      bad++;
      if (bad <= 8) {
        console.log(`OUT ${from} -> ${to}`, { a, b, box, eu });
      }
    }
    worst = Math.max(worst, box.w / 120);
  }
}

console.log(
  `${checked} pairs checked, ${bad} with an endpoint outside the frame, ` +
    `largest scale ${worst.toFixed(2)}`,
);

for (const [f, t] of [
  ["Amsterdam", "Madrid"],
  ["Milan", "Singapore"],
  ["Amsterdam", "Berlin"],
  ["Stockholm", "Lisbon"],
]) {
  const a = map.cities[key(f)];
  const b = map.cities[key(t)];
  const eu = inEU(a) && inEU(b);
  const box = frame(a, b, eu ? EU_BOX : WORLD_BOX);
  const rel = (p) => [
    +(((p[0] - box.x) / box.w) * 100).toFixed(1),
    +(((p[1] - box.y) / box.h) * 100).toFixed(1),
  ];
  console.log(
    `${f} -> ${t}`,
    eu ? "EU" : "WORLD",
    "from at", rel(a), "% ",
    "to at", rel(b), "% ",
    "scale", (box.w / 120).toFixed(2),
  );
}
