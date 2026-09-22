import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";
import { ArrowRight, Pause, Play, Package } from "lucide-react";
const cities = [
  ["Amsterdam", 365, 265, "AMS"],
  ["Berlin", 590, 265, "BER"],
  ["London", 230, 340, "LON"],
  ["Paris", 298, 410, "PAR"],
  ["Copenhagen", 478, 108, "CPH"],
  ["Munich", 540, 430, "MUC"],
  ["Milan", 495, 530, "MIL"],
] as const;
const routes = [
  {
    from: 0,
    to: 1,
    d: "M365 265 Q470 135 590 265",
    service: "Routewise Standard",
    days: "2–3 days",
  },
  {
    from: 2,
    to: 3,
    d: "M230 340 Q230 420 298 410",
    service: "Parcelway Economy",
    days: "3–4 days",
  },
  {
    from: 0,
    to: 4,
    d: "M365 265 Q360 125 478 108",
    service: "Swiftline Express",
    days: "1–2 days",
  },
  {
    from: 1,
    to: 5,
    d: "M590 265 Q650 360 540 430",
    service: "Routewise Standard",
    days: "1–2 days",
  },
  {
    from: 3,
    to: 6,
    d: "M298 410 Q450 380 495 530",
    service: "Parcelway Economy",
    days: "3–5 days",
  },
  {
    from: 5,
    to: 6,
    d: "M540 430 Q560 500 495 530",
    service: "Routewise Standard",
    days: "2–3 days",
  },
];
export function NetworkMap() {
  const [active, setActive] = useState(0),
    [paused, setPaused] = useState(false),
    [tabVisible, setTabVisible] = useState(true);
  const ref = useRef<HTMLDivElement>(null),
    inView = useInView(ref),
    reduced = useReducedMotion();
  useEffect(() => {
    const update = () => setTabVisible(!document.hidden);
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);
  const route = routes[active],
    from = cities[route.from],
    to = cities[route.to];
  return (
    <div
      ref={ref}
      className={`network-explorer hero-scene ${inView && tabVisible && !reduced && !paused ? "network-running" : ""}`}
    >
      <div className="scene-meta mono">
        <span>
          <span className="status-dot" /> THE CONNECTED NETWORK
        </span>
        <button
          className="map-pause"
          onClick={() => setPaused(!paused)}
          aria-label={paused ? "Play route animation" : "Pause route animation"}
        >
          {paused ? <Play size={14} /> : <Pause size={14} />}
        </button>
      </div>
      <img
        className="europe-map"
        src="/assets/europe-map.svg"
        width="760"
        height="650"
        alt=""
      />
      <svg
        className="route-overlay"
        viewBox="0 0 760 650"
        role="img"
        aria-label={`Illustrative network connecting seven European cities. Selected route: ${from[0]} to ${to[0]}.`}
      >
        <g fill="none">
          {routes.map((r, i) => (
            <g key={r.d}>
              <path
                d={r.d}
                className={
                  i === active ? "network-route selected" : "network-route"
                }
              />
              <circle
                r={i === active ? 5 : 2.5}
                fill={i === active ? "#d3ffa1" : "#82bfa2"}
                className="network-particle"
                style={{
                  offsetPath: `path('${r.d}')`,
                  animationDuration: `${7 + i * 1.3}s`,
                  animationDelay: `-${i * 2}s`,
                }}
              />
            </g>
          ))}
        </g>
        {cities.map(([name, x, y], i) => (
          <g
            key={name}
            className={
              i === route.from || i === route.to ? "city selected" : "city"
            }
          >
            <circle cx={x} cy={y} r="10" />
            <circle cx={x} cy={y} r="3.5" />
            <text x={x} y={y + (i === 4 ? -18 : 26)} textAnchor="middle">
              {name}
            </text>
          </g>
        ))}
      </svg>
      <div className="network-route-card" aria-live="polite">
        <div className="mono">
          SELECTED LANE <span>ILLUSTRATIVE</span>
        </div>
        <div className="lane-title">
          {from[3]}
          <ArrowRight size={23} />
          {to[3]}
          <Package size={26} />
        </div>
        <div className="lane-description">
          <span>
            {from[0]} → {to[0]}
            <small>{route.service}</small>
          </span>
          <strong>{route.days}</strong>
        </div>
      </div>
      <div className="map-route-controls" aria-label="Select a shipment route">
        {routes.map((r, i) => (
          <button
            key={r.d}
            onClick={() => setActive(i)}
            aria-pressed={i === active}
          >
            {cities[r.from][3]}
            <span>→</span>
            {cities[r.to][3]}
          </button>
        ))}
      </div>
      <div className="scene-bottom mono">
        <span>7 CITIES / 6 EXAMPLE LANES</span>
        <span>EXPLORE THE CONNECTIONS ↗</span>
      </div>
    </div>
  );
}
