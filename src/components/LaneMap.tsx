import { useEffect, useMemo, useRef, useState } from "react";
import map from "../data/worldmap.json";

/**
 * The selected lane, drawn on a dotted map that frames itself around the two
 * endpoints.
 *
 * A fixed viewBox cannot serve thirty-six lanes: Europe cropped to the
 * panel's shape pushed Madrid and Rome off the bottom, and Singapore was
 * never in it at all. The box is computed per lane from the two cities,
 * padded, and forced to the panel's aspect ratio, so both ends stay visible
 * and the arc sits centred whatever the route.
 *
 * Dragging pans the map, and it eases back to the framed view on release, so
 * exploring never loses the lane.
 */

type City = keyof typeof map.cities;

const EU = map.europe;

/** Each cell grid expands into one path, once at module load. */
const EU_DOTS = (() => {
  const r = 0.42;
  let d = "";
  for (const index of EU.cells) {
    const x = EU.view.x + (index % EU.cols) * EU.step + EU.step / 2;
    const y = EU.view.y + Math.floor(index / EU.cols) * EU.step + EU.step / 2;
    d += `M${x.toFixed(2)} ${(y - r).toFixed(2)}a${r} ${r} 0 1 0 0.01 0z`;
  }
  return d;
})();

const WORLD_DOTS = (() => {
  const r = 1.1;
  let d = "";
  for (const index of map.cells) {
    const x = (index % map.cols) * map.step + map.step / 2;
    const y = Math.floor(index / map.cols) * map.step + map.step / 2;
    d += `M${x.toFixed(1)} ${(y - r).toFixed(1)}a${r} ${r} 0 1 0 0.01 0z`;
  }
  return d;
})();

const EU_BOX = EU.view;
const WORLD_BOX = { x: 20, y: 30, w: 960, h: 420 };

const CONTEXT = Object.keys(map.cities) as City[];

/** The hero panel, near enough. */
const ASPECT = 3.2;

const clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

/**
 * A box around the two endpoints: padded, widened to the panel's aspect, and
 * kept inside whichever grid is being drawn.
 */
function frame(
  a: [number, number],
  b: [number, number],
  bounds: typeof EU_BOX,
) {
  const minX = Math.min(a[0], b[0]);
  const maxX = Math.max(a[0], b[0]);
  const minY = Math.min(a[1], b[1]);
  const maxY = Math.max(a[1], b[1]);
  const cx = (minX + maxX) / 2;
  const cy = (minY + maxY) / 2;

  /* Padded generously: a lane needs its surroundings to read as a place, and
     the arc bows above the straight line between the two points. */
  const padX = Math.max(26, (maxX - minX) * 0.5);
  const padY = Math.max(16, (maxY - minY) * 0.7);

  let w = maxX - minX + padX * 2;
  let h = maxY - minY + padY * 2;

  // Force the panel's aspect, growing whichever side is short.
  if (w / h < ASPECT) w = h * ASPECT;
  else h = w / ASPECT;

  // Never ask for more than the grid actually covers.
  w = Math.min(w, bounds.w);
  h = Math.min(h, bounds.h);
  if (w / h > ASPECT) w = h * ASPECT;

  /* The lane picker is a pill sitting over the bottom-left of the panel, so
     a lane centred in the frame can put its southern end underneath it —
     which is exactly how Madrid went missing. Pushing the view down moves the
     map up, seating both ends in the clear upper band. */
  const lift = h * 0.17;

  return {
    x: clamp(cx - w / 2, bounds.x, bounds.x + bounds.w - w),
    y: clamp(cy - h / 2 + lift, bounds.y, bounds.y + bounds.h - h),
    w,
    h,
  };
}

export function LaneMap({
  from,
  to,
  fromLabel,
  toLabel,
}: {
  from: City;
  to: City;
  fromLabel: string;
  toLabel: string;
}) {
  const a = map.cities[from] as [number, number];
  const b = map.cities[to] as [number, number];

  const inside = (p: [number, number]) =>
    p[0] >= EU_BOX.x &&
    p[0] <= EU_BOX.x + EU_BOX.w &&
    p[1] >= EU_BOX.y &&
    p[1] <= EU_BOX.y + EU_BOX.h;

  const european = inside(a) && inside(b);
  const bounds = european ? EU_BOX : WORLD_BOX;
  const dots = european ? EU_DOTS : WORLD_DOTS;

  const box = useMemo(
    () => frame(a, b, bounds),
    // a and b are stable per lane
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [a[0], a[1], b[0], b[1], bounds],
  );

  /* Everything scales with the zoom: a lane framed tightly needs thinner
     strokes and smaller labels than one spanning an ocean. */
  const s = box.w / 120;

  const d = useMemo(() => {
    const [x1, y1] = a;
    const [x2, y2] = b;
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2 - Math.hypot(x2 - x1, y2 - y1) * 0.28 - s * 2;
    return `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [a[0], a[1], b[0], b[1], s]);

  /* ---- Drag to pan ------------------------------------------------------
     The offset lives in a ref and is written straight to the viewBox, so a
     drag costs one attribute write per frame instead of a React render. */
  const svg = useRef<SVGSVGElement>(null);
  const pan = useRef({ x: 0, y: 0 });
  const grab = useRef<{ x: number; y: number; px: number; py: number } | null>(
    null,
  );
  const [dragging, setDragging] = useState(false);
  /* The hint only earns its place until the map has been dragged once. */
  const [touched, setTouched] = useState(false);

  useEffect(() => {
    const node = svg.current;
    if (!node) return;

    const apply = () =>
      node.setAttribute(
        "viewBox",
        `${box.x + pan.current.x} ${box.y + pan.current.y} ${box.w} ${box.h}`,
      );

    // A new lane resets the pan, so the new route arrives centred.
    pan.current = { x: 0, y: 0 };
    apply();

    const limit = Math.max(box.w, box.h) * 0.8;

    const down = (event: PointerEvent) => {
      grab.current = {
        x: event.clientX,
        y: event.clientY,
        px: pan.current.x,
        py: pan.current.y,
      };
      node.setPointerCapture(event.pointerId);
      setDragging(true);
      setTouched(true);
    };

    const move = (event: PointerEvent) => {
      const start = grab.current;
      if (!start) return;
      // Convert pixel travel into user units so the map tracks the cursor.
      const scale = box.w / node.getBoundingClientRect().width;
      pan.current = {
        x: clamp(start.px - (event.clientX - start.x) * scale, -limit, limit),
        y: clamp(start.py - (event.clientY - start.y) * scale, -limit, limit),
      };
      apply();
    };

    const up = () => {
      if (!grab.current) return;
      grab.current = null;
      setDragging(false);

      // Ease back, rather than leaving the lane parked off screen.
      const origin = { ...pan.current };
      const began = performance.now();
      const settle = (now: number) => {
        const t = Math.min(1, (now - began) / 420);
        const e = 1 - Math.pow(1 - t, 3);
        pan.current = { x: origin.x * (1 - e), y: origin.y * (1 - e) };
        apply();
        if (t < 1) requestAnimationFrame(settle);
      };
      requestAnimationFrame(settle);
    };

    node.addEventListener("pointerdown", down);
    node.addEventListener("pointermove", move);
    node.addEventListener("pointerup", up);
    node.addEventListener("pointercancel", up);
    return () => {
      node.removeEventListener("pointerdown", down);
      node.removeEventListener("pointermove", move);
      node.removeEventListener("pointerup", up);
      node.removeEventListener("pointercancel", up);
    };
  }, [box, from, to]);

  /* Short hops put the two labels on top of each other, so the far end flips
     above its node when the pair is closer than the labels are wide. */
  const tight = Math.hypot(b[0] - a[0], b[1] - a[1]) < box.w * 0.2;

  /* A label hangs below its node, and the lane picker sits over the bottom of
     the panel, so a southern end had its name tucked underneath the pill.
     Anything in the lower third of the frame wears its label above instead. */
  const below = (p: [number, number]) => (p[1] - box.y) / box.h < 0.62;
  const dy = (p: [number, number], flip = false) =>
    below(p) && !flip ? 3.4 * s : -2.4 * s;

  return (
    <div
      className="lanemap"
      data-dragging={dragging || undefined}
      data-touched={touched || undefined}
    >
      <svg
        ref={svg}
        viewBox={`${box.x} ${box.y} ${box.w} ${box.h}`}
        role="img"
        aria-label={`${fromLabel} to ${toLabel}`}
        preserveAspectRatio="xMidYMid slice"
        style={{ "--s": s } as React.CSSProperties}
      >
        <path className="lanemap-dots" d={dots} />

        <g className="lanemap-context">
          {CONTEXT.filter((c) => c !== from && c !== to).map((c) => {
            const [x, y] = map.cities[c] as [number, number];
            return <circle key={c} cx={x} cy={y} r={0.5 * s} />;
          })}
        </g>

        {/* keyed on the lane so the draw restarts when the route changes */}
        <g key={`${from}-${to}`}>
          <path className="lanemap-arc-ghost" d={d} />
          <path className="lanemap-arc" d={d} />
          <circle
            className="lanemap-parcel"
            r={1.1 * s}
            style={{ offsetPath: `path("${d}")` } as React.CSSProperties}
          />
        </g>

        <g className="lanemap-ends">
          <circle className="lanemap-pulse" cx={a[0]} cy={a[1]} r={1.3 * s} />
          <circle className="lanemap-end" cx={a[0]} cy={a[1]} r={1.1 * s} />
          <circle className="lanemap-pulse" cx={b[0]} cy={b[1]} r={1.3 * s} />
          <circle className="lanemap-end" cx={b[0]} cy={b[1]} r={1.1 * s} />
        </g>

        <g className="lanemap-labels">
          <text x={a[0]} y={a[1] + dy(a)} textAnchor="middle">
            {fromLabel}
          </text>
          <text x={b[0]} y={b[1] + dy(b, tight)} textAnchor="middle">
            {toLabel}
          </text>
        </g>
      </svg>
      <span className="lanemap-hint" aria-hidden="true">
        drag to pan
      </span>
    </div>
  );
}
