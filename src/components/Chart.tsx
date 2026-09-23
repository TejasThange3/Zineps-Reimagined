import { useEffect, useId, useRef, useState } from "react";

/**
 * Small analytics charts, drawn as SVG and animated on first view.
 *
 * Both shapes share one viewBox and one reveal, so a page can put a line and
 * a bar chart side by side without them animating to different rhythms. The
 * line draws itself with stroke-dashoffset and the bars grow from their
 * baseline, both in CSS and both off the main thread.
 */

const W = 300;
const H = 120;
const PAD = { top: 12, right: 6, bottom: 20, left: 6 };

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [live, setLive] = useState(false);

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
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return { ref, live };
}

function scale(values: number[]) {
  const max = Math.max(...values);
  const min = Math.min(...values, 0);
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  return values.map((v, i) => [
    PAD.left + (i / (values.length - 1 || 1)) * innerW,
    PAD.top + innerH - ((v - min) / (max - min || 1)) * innerH,
  ]);
}

/** A smooth line with a filled area beneath it. */
export function LineChart({
  values,
  labels,
  label,
}: {
  values: number[];
  labels: string[];
  label: string;
}) {
  const { ref, live } = useInView<HTMLDivElement>();
  const id = useId().replace(/:/g, "");
  const points = scale(values);

  // Catmull-Rom through the points, converted to cubic beziers, so the line
  // curves without overshooting the data.
  let d = `M${points[0][0]} ${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i === 0 ? 0 : i - 1];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    d +=
      ` C${p1[0] + (p2[0] - p0[0]) / 6} ${p1[1] + (p2[1] - p0[1]) / 6},` +
      ` ${p2[0] - (p3[0] - p1[0]) / 6} ${p2[1] - (p3[1] - p1[1]) / 6},` +
      ` ${p2[0]} ${p2[1]}`;
  }

  const area = `${d} L${points[points.length - 1][0]} ${H - PAD.bottom} L${points[0][0]} ${H - PAD.bottom} Z`;
  const last = points[points.length - 1];

  return (
    <div className="chart" ref={ref} data-live={live}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
        <defs>
          <linearGradient id={`chart-fill-${id}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.22" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        <g className="chart-grid">
          {[0, 0.5, 1].map((t) => (
            <line
              key={t}
              x1={PAD.left}
              x2={W - PAD.right}
              y1={PAD.top + t * (H - PAD.top - PAD.bottom)}
              y2={PAD.top + t * (H - PAD.top - PAD.bottom)}
            />
          ))}
        </g>

        <path
          className="chart-area"
          d={area}
          style={{ fill: `url(#chart-fill-${id})` }}
        />
        <path
          className="chart-line"
          d={d}
          style={{ "--len": 620 } as React.CSSProperties}
        />
        <circle className="chart-point" cx={last[0]} cy={last[1]} r="3.5" />

        <g className="chart-axis">
          {labels.map((text, i) => (
            <text
              key={text}
              x={points[i][0]}
              y={H - 6}
              textAnchor={
                i === 0 ? "start" : i === labels.length - 1 ? "end" : "middle"
              }
            >
              {text}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
}

/** Columns, with the tallest picked out in the accent. */
export function BarChart({
  values,
  labels,
  label,
  format,
  emphasis = "peak",
}: {
  values: number[];
  labels: string[];
  label: string;
  /** Prints each value above its bar. Omit for an unlabelled chart. */
  format?: (value: number) => string;
  /**
   * Which bar carries the accent. "peak" suits a chart about growth; "low"
   * suits one about cost falling, where the payoff is the shortest bar.
   */
  emphasis?: "peak" | "low";
}) {
  const { ref, live } = useInView<HTMLDivElement>();
  const max = Math.max(...values);
  const paid = values.filter((v) => v > 0);
  const target = emphasis === "low" ? Math.min(...paid) : max;
  const innerW = W - PAD.left - PAD.right;
  const innerH = H - PAD.top - PAD.bottom;
  const slot = innerW / values.length;
  const barW = Math.min(22, slot * 0.56);

  return (
    <div className="chart" ref={ref} data-live={live}>
      <svg viewBox={`0 0 ${W} ${H}`} role="img" aria-label={label}>
        <g className="chart-grid">
          <line
            x1={PAD.left}
            x2={W - PAD.right}
            y1={H - PAD.bottom}
            y2={H - PAD.bottom}
          />
        </g>
        {values.map((v, i) => {
          // A zero still gets a visible stub: an empty slot reads as missing
          // data, not as "costs nothing".
          const h = v > 0 ? (v / max) * innerH : 1.5;
          const x = PAD.left + i * slot + (slot - barW) / 2;
          const y = H - PAD.bottom - h;
          const accent = v === target;
          return (
            <g key={labels[i]} style={{ "--i": i } as React.CSSProperties}>
              <rect
                className={`chart-bar ${accent ? "chart-bar-peak" : ""} ${v === 0 ? "chart-bar-zero" : ""}`}
                x={x}
                y={y}
                width={barW}
                height={h}
                rx={v > 0 ? 2 : 0.75}
              />
              {format ? (
                <text
                  className={`chart-value ${accent ? "chart-value-peak" : ""}`}
                  x={x + barW / 2}
                  y={y - 4}
                  textAnchor="middle"
                >
                  {format(v)}
                </text>
              ) : null}
            </g>
          );
        })}
        <g className="chart-axis">
          {labels.map((text, i) => (
            <text
              key={text}
              x={PAD.left + i * slot + slot / 2}
              y={H - 6}
              textAnchor="middle"
            >
              {text}
            </text>
          ))}
        </g>
      </svg>
    </div>
  );
}
