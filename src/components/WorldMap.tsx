import { useEffect, useMemo, useRef, useState } from "react";
import map from "../data/worldmap.json";

/**
 * A dotted world map with live shipping lanes drawn across it.
 *
 * The land is a grid of points sampled from Natural Earth geometry at build
 * time (scripts/build-worldmap.mjs) and stored as grid indices. They expand
 * into one <path> here, so four and a half thousand dots cost a single DOM
 * node and a single fill.
 *
 * Each lane draws itself with stroke-dashoffset, then sends a parcel along
 * the same curve with an offset-path animation. Both run in CSS, off the main
 * thread, and stop entirely under prefers-reduced-motion.
 */

type City = keyof typeof map.cities;

const LANES: { from: City; to: City; label: string; delay: number }[] = [
  { from: "amsterdam", to: "newyork", label: "AMS to JFK", delay: 0 },
  { from: "amsterdam", to: "berlin", label: "AMS to BER", delay: 1.1 },
  { from: "london", to: "dubai", label: "LHR to DXB", delay: 2.2 },
  { from: "shanghai", to: "singapore", label: "PVG to SIN", delay: 1.7 },
  { from: "amsterdam", to: "saopaulo", label: "AMS to GRU", delay: 3.1 },
  { from: "dubai", to: "mumbai", label: "DXB to BOM", delay: 2.6 },
  { from: "tokyo", to: "losangeles", label: "NRT to LAX", delay: 3.8 },
  { from: "madrid", to: "lagos", label: "MAD to LOS", delay: 4.3 },
  { from: "singapore", to: "sydney", label: "SIN to SYD", delay: 0.6 },
];

const NODES: City[] = [
  "amsterdam",
  "london",
  "berlin",
  "paris",
  "madrid",
  "milan",
  "warsaw",
  "istanbul",
  "newyork",
  "saopaulo",
  "dubai",
  "mumbai",
  "singapore",
  "shanghai",
  "tokyo",
  "sydney",
  "johannesburg",
  "lagos",
  "toronto",
  "losangeles",
];

/** Expand the packed grid indices back into one path of small circles. */
const DOTS = (() => {
  const { cells, cols, step } = map;
  const r = 1.05;
  let d = "";
  for (const index of cells) {
    const x = (index % cols) * step + step / 2;
    const y = Math.floor(index / cols) * step + step / 2;
    d += `M${x.toFixed(1)} ${(y - r).toFixed(1)}a${r} ${r} 0 1 0 0.01 0z`;
  }
  return d;
})();

/**
 * A quadratic curve that bows away from the equator, so lanes read as great
 * circles rather than straight chords.
 */
function lane(a: [number, number], b: [number, number]) {
  const [x1, y1] = a;
  const [x2, y2] = b;
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2 - Math.abs(x2 - x1) * 0.22 - 14;
  return `M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}`;
}

export function WorldMap({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);

  const paths = useMemo(
    () =>
      LANES.map((l) => ({
        ...l,
        d: lane(
          map.cities[l.from] as [number, number],
          map.cities[l.to] as [number, number],
        ),
      })),
    [],
  );

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      setLive(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) =>
        entry.isIntersecting && (setLive(true), observer.disconnect()),
      { threshold: 0.15 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <div className={`wmap ${className}`} ref={ref} data-live={live}>
      <svg
        viewBox={`0 0 ${map.width} ${map.height}`}
        role="img"
        aria-label="Shipping lanes across a world map"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          <linearGradient id="wmap-lane" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--mint-400)" stopOpacity="0" />
            <stop offset="35%" stopColor="var(--mint-400)" stopOpacity="0.9" />
            <stop offset="100%" stopColor="var(--mint-300)" stopOpacity="0.5" />
          </linearGradient>
        </defs>

        <path className="wmap-dots" d={DOTS} />

        <g className="wmap-lanes">
          {paths.map((l) => (
            <path
              key={l.label}
              d={l.d}
              style={{ "--delay": `${l.delay}s` } as React.CSSProperties}
            >
              <title>{l.label}</title>
            </path>
          ))}
        </g>

        {/* One parcel per lane, riding the same curve the stroke drew. */}
        <g className="wmap-parcels" aria-hidden="true">
          {paths.map((l) => (
            <circle
              key={l.label}
              r="2.6"
              style={
                {
                  offsetPath: `path("${l.d}")`,
                  "--delay": `${l.delay}s`,
                } as React.CSSProperties
              }
            />
          ))}
        </g>

        <g className="wmap-nodes" aria-hidden="true">
          {NODES.map((name, i) => {
            const [x, y] = map.cities[name] as [number, number];
            return (
              <g
                key={name}
                style={
                  { "--delay": `${(i % 7) * 0.45}s` } as React.CSSProperties
                }
              >
                <circle className="wmap-pulse" cx={x} cy={y} r="3" />
                <circle className="wmap-dot" cx={x} cy={y} r="2.1" />
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
