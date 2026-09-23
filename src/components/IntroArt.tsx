import type { ReactNode } from "react";
import { Mark, type MarkId } from "./Mark";
import { Logo } from "./Logo";
import { NumberTicker } from "./NumberTicker";
import { articles } from "../data/articles";
import { monthlyRate, plans } from "../data/pricing";

/**
 * The inner pages' openings.
 *
 * The homepage opens on an instrument, the rate console, and the inner pages
 * opened on a paragraph beside an empty half-column. Each page now gets a
 * small instrument of its own, built from that page's real subject and data
 * and set in the same language as the console: one framed surface, mono
 * readouts, one quiet motion.
 *
 * The motion is deliberately small. Each instrument plays its entrance once,
 * and at most one element keeps breathing afterwards. They are illustrations
 * of what the page says, so each carries a text summary for assistive tech
 * and hides its decorative parts.
 */

function Instrument({
  label,
  status,
  summary,
  children,
  className = "",
}: {
  label: string;
  status?: ReactNode;
  summary: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <figure className={`ia ${className}`} role="img" aria-label={summary}>
      <div className="ia-head" aria-hidden="true">
        <span className="ia-label mono">{label}</span>
        {status ? <span className="ia-status mono">{status}</span> : null}
      </div>
      <div className="ia-body" aria-hidden="true">
        {children}
      </div>
    </figure>
  );
}

/** Deterministic barcode: the same bars on the server and the client. */
function Barcode({ seed = 7, bars = 46 }: { seed?: number; bars?: number }) {
  return (
    <div className="ia-barcode">
      {Array.from({ length: bars }, (_, i) => (
        <i
          key={i}
          style={{ "--w": (i * seed) % 5 === 0 ? 3 : (i * seed) % 3 === 0 ? 2 : 1 } as React.CSSProperties}
        />
      ))}
    </div>
  );
}

/* ---- /shipping: an order becomes a label ------------------------------- */

export function ShippingArt() {
  return (
    <Instrument
      className="ia-ship"
      label="Desk"
      status={
        <>
          <span className="ia-dot" /> 3 in queue
        </>
      }
      summary="An imported order from Rotterdam to Lyon matches a rule and its Parcelway Economy label prints without anyone touching it."
    >
      <div className="ia-row ia-step" style={{ "--d": 0 } as React.CSSProperties}>
        <span className="mono ia-key">#DEMO-0043</span>
        <span>Rotterdam → Lyon</span>
        <span className="mono ia-dim">1.4 kg</span>
      </div>
      <div className="ia-rule ia-step" style={{ "--d": 1 } as React.CSSProperties}>
        <span className="mono">
          <b>when</b> country is FR <b>and</b> weight &lt; 2 kg
        </span>
        <span className="mono">
          <b>then</b> Parcelway Economy
        </span>
      </div>
      <div className="ia-slot">
        <div className="ia-print">
          <div className="ia-print-head mono">
            <span>PARCELWAY ECONOMY</span>
            <span>NL &gt; FR</span>
          </div>
          <p className="ia-print-to">
            Camille Roux
            <br />
            12 Rue Mercière
            <br />
            69002 Lyon
          </p>
          <Barcode seed={7} />
          <p className="ia-print-track mono">3SZINEPS4820194</p>
        </div>
      </div>
    </Instrument>
  );
}

/* ---- /integrations: everything flows into one queue -------------------- */

const ORBIT: { id: MarkId; name: string }[] = [
  { id: "shopify", name: "Shopify" },
  { id: "bol", name: "bol" },
  { id: "amazon", name: "Amazon" },
  { id: "picqer", name: "Picqer" },
  { id: "dhl", name: "DHL" },
  { id: "postnl", name: "PostNL" },
  { id: "ups", name: "UPS" },
  { id: "exactonline", name: "Exact" },
];

export function IntegrationsArt() {
  return (
    <Instrument
      className="ia-net"
      label="One connection"
      status={
        <>
          <span className="ia-dot" /> 32 live
        </>
      }
      summary="Stores, marketplaces, warehouse software and carriers all feed one Zineps connection."
    >
      <div className="ia-orbit">
        <svg className="ia-spokes" viewBox="0 0 100 100" preserveAspectRatio="none">
          {ORBIT.map((_, i) => {
            const a = (i / ORBIT.length) * Math.PI * 2 - Math.PI / 2;
            return (
              <line
                key={i}
                x1="50"
                y1="50"
                x2={50 + Math.cos(a) * 40}
                y2={50 + Math.sin(a) * 38}
              />
            );
          })}
        </svg>
        {ORBIT.map((m, i) => {
          const a = (i / ORBIT.length) * Math.PI * 2 - Math.PI / 2;
          const x = Math.cos(a) * 40;
          const y = Math.sin(a) * 38;
          return (
            <span
              key={m.id}
              className="ia-node"
              style={
                {
                  left: `${50 + x}%`,
                  top: `${50 + y}%`,
                  "--i": i,
                  "--dx": `${-x}cqw`,
                  "--dy": `${-y}cqh`,
                } as React.CSSProperties
              }
            >
              <span className="chip">
                <Mark id={m.id} name={m.name} base={25} />
              </span>
              <i className="ia-pulse" />
            </span>
          );
        })}
        <span className="ia-hub">
          <Logo />
        </span>
      </div>
    </Instrument>
  );
}

/* ---- /pricing: the bill, itemised ------------------------------------- */

const euro = (v: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: 2,
  }).format(v);

export function PricingArt({
  annual,
  volume,
}: {
  annual: boolean;
  volume: number;
}) {
  // The same plan the estimator below recommends, so the bill and the slider
  // are two views of one state: move the slider and the bill rewrites itself.
  const eligible = plans.filter((p) => p.included >= volume);
  const cost = (p: (typeof plans)[number]) =>
    (annual ? p.annual : monthlyRate(p)) + volume * p.label;
  const plan = eligible.length
    ? eligible.reduce((a, b) => (cost(b) < cost(a) ? b : a))
    : plans[plans.length - 1];
  const platform = annual ? plan.annual : monthlyRate(plan);
  const labels = volume * plan.label;
  const total = platform + labels;
  const each = total / volume;

  return (
    <Instrument
      className="ia-bill"
      label={`This month · ${plan.name}`}
      status={annual ? "Billed annually" : "Billed monthly"}
      summary={`A ${plan.name} month at ${volume} shipments: ${euro(platform)} platform plus ${volume} labels at ${euro(plan.label)}, ${euro(total)} in total, ${euro(each)} a parcel. Postage is separate.`}
    >
      <dl className="ia-lines">
        <div className="ia-step" style={{ "--d": 0 } as React.CSSProperties}>
          <dt>Platform</dt>
          <dd className="mono">{euro(platform)}</dd>
        </div>
        <div className="ia-step" style={{ "--d": 1 } as React.CSSProperties}>
          <dt>
            Labels{" "}
            <span className="mono ia-dim">
              {volume.toLocaleString("en-IE")} × {euro(plan.label)}
            </span>
          </dt>
          <dd className="mono">{euro(labels)}</dd>
        </div>
        <div className="ia-step" style={{ "--d": 2 } as React.CSSProperties}>
          <dt>Partner rates</dt>
          <dd className="mono ia-accent">included</dd>
        </div>
        <div className="ia-step" style={{ "--d": 3 } as React.CSSProperties}>
          <dt>Postage</dt>
          <dd className="mono ia-dim">separate</dd>
        </div>
      </dl>
      <div className="ia-total ia-step" style={{ "--d": 4 } as React.CSSProperties}>
        <span>A month</span>
        <span className="num ia-big">{euro(total).replace(/.00$/, "")}</span>
      </div>
      <p className="ia-each ia-step" style={{ "--d": 5 } as React.CSSProperties}>
        <span className="mono">{euro(each)}</span> a parcel, falling as you grow
      </p>
    </Instrument>
  );
}

/* ---- /blog: the reading list, measured -------------------------------- */

export function BlogArt() {
  const topics = ["Operations", "Costs", "Automation", "Cross-border"] as const;
  const rows = topics.map((topic) => {
    const list = articles.filter((a) => a.topic === topic);
    return { topic, count: list.length, minutes: list.reduce((n, a) => n + a.minutes, 0) };
  });
  const most = Math.max(...rows.map((r) => r.minutes));
  const minutes = rows.reduce((n, r) => n + r.minutes, 0);

  return (
    <Instrument
      className="ia-read"
      label="Reading list"
      status={`${articles.length} guides · ${minutes} min`}
      summary={`${articles.length} guides, ${minutes} minutes of reading, across operations, costs, automation and cross-border.`}
    >
      <ul className="ia-bars">
        {rows.map((r, i) => (
          <li key={r.topic} className="ia-step" style={{ "--d": i } as React.CSSProperties}>
            <span className="ia-bar-label">{r.topic}</span>
            <span className="ia-bar-track">
              <span
                className="ia-bar-fill"
                style={{ "--f": r.minutes / most, "--d": i } as React.CSSProperties}
              />
            </span>
            <span className="mono ia-dim">
              {r.count} · {r.minutes}m
            </span>
          </li>
        ))}
      </ul>
      <p className="ia-foot mono">Written for this concept, not reproduced.</p>
    </Instrument>
  );
}

/* ---- /shipping-ai: the lane, scored ----------------------------------- */

const LANE = [
  { name: "Routewise Standard", score: 96 },
  { name: "Parcelway Economy", score: 92 },
  { name: "Swiftline Express", score: 71, risk: true },
];

export function AIArt() {
  // Swiftline's on-time rate over six weeks: the trend the flag is about.
  const trend = [94, 93, 90, 86, 79, 71];
  // Fitted to the box: the best week sits near the top, the worst near the
  // bottom, so the slide reads at a glance.
  const hi = Math.max(...trend);
  const lo = Math.min(...trend);
  const pts = trend
    .map((v, i) => `${(i / (trend.length - 1)) * 100},${4 + ((hi - v) / (hi - lo)) * 36}`)
    .join(" ");

  return (
    <Instrument
      className="ia-ai"
      label="AMS → VIE · on time, 30 days"
      status={
        <>
          <span className="ia-dot ia-dot-warn" /> 1 flagged
        </>
      }
      summary="On the Amsterdam to Vienna lane, Routewise is on time 96% and Parcelway 92%, while Swiftline has slipped to 71% over six weeks and is flagged before the next label is bought."
    >
      <ul className="ia-scores">
        {LANE.map((c, i) => (
          <li
            key={c.name}
            className={`ia-step ${c.risk ? "ia-risk" : ""}`}
            style={{ "--d": i } as React.CSSProperties}
          >
            <span className="ia-score-name">{c.name}</span>
            <span className="ia-bar-track">
              <span
                className="ia-bar-fill"
                style={{ "--f": c.score / 100, "--d": i } as React.CSSProperties}
              />
            </span>
            <span className="mono">{c.score}%</span>
          </li>
        ))}
      </ul>
      <div className="ia-trend ia-step" style={{ "--d": 3 } as React.CSSProperties}>
        <svg viewBox="0 0 100 44" preserveAspectRatio="none">
          <polyline points={pts} />
        </svg>
        <p className="mono">
          Swiftline, week by week <span className="ia-warn">−23 pts</span>
        </p>
      </div>
    </Instrument>
  );
}

/* ---- /logistics-operating-system: margin per customer group ----------- */

const GROUPS = [
  { name: "Webshops NL", rate: 6.2, cost: 5.1 },
  { name: "Marketplace sellers", rate: 5.8, cost: 5.1 },
  { name: "B2B pallets", rate: 42, cost: 34.4 },
];

export function PartnersArt() {
  return (
    <Instrument
      className="ia-ledger"
      label="Customer groups · this month"
      status={
        <>
          <span className="ia-dot" /> Invoicing on
        </>
      }
      summary="Three customer groups with their own rate, cost and margin: webshops at 18%, marketplace sellers at 12% and B2B pallets at 18%."
    >
      <div className="ia-table">
        <div className="ia-th mono">
          <span>Group</span>
          <span>Rate</span>
          <span>Cost</span>
          <span>Margin</span>
        </div>
        {GROUPS.map((g, i) => {
          const margin = Math.round(((g.rate - g.cost) / g.rate) * 100);
          return (
            <div key={g.name} className="ia-tr ia-step" style={{ "--d": i } as React.CSSProperties}>
              <span>{g.name}</span>
              <span className="mono">{euro(g.rate)}</span>
              <span className="mono ia-dim">{euro(g.cost)}</span>
              <span className="mono ia-accent">
                <NumberTicker value={margin} suffix="%" duration={900} />
              </span>
            </div>
          );
        })}
      </div>
      <div className="ia-total ia-step" style={{ "--d": 3 } as React.CSSProperties}>
        <span>Invoiced this month</span>
        <span className="num ia-big">
          <NumberTicker value={184220} prefix="€" duration={1300} />
        </span>
      </div>
    </Instrument>
  );
}

/* ---- /knowledge-base: search that answers ------------------------------ */

const RESULTS = [
  { title: "Print a test label and check your printer setup", group: "Setup" },
  { title: "Bulk label creation for high-volume days", group: "Running it" },
  { title: "Reprinting, voiding and correcting a label", group: "Running it" },
];

export function KnowledgeArt() {
  return (
    <Instrument
      className="ia-search"
      label="Search the docs"
      status={<kbd className="ia-kbd">⌘ K</kbd>}
      summary="A search for thermal printer returns three guides on printer setup, bulk labels and reprinting."
    >
      <div className="ia-query">
        <span className="ia-glass" />
        <span className="mono ia-typed">thermal printer</span>
        <span className="ia-caret" />
      </div>
      <ul className="ia-results">
        {RESULTS.map((r, i) => (
          <li key={r.title} className="ia-step ia-late" style={{ "--d": i } as React.CSSProperties}>
            <span>{r.title}</span>
            <span className="mono ia-dim">{r.group}</span>
          </li>
        ))}
      </ul>
    </Instrument>
  );
}
