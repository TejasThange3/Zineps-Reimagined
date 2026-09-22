import {
  ArrowRight,
  Box,
  Check,
  Package,
  ScanLine,
  Truck,
  Zap,
} from "lucide-react";
import { articles } from "../data/site";
import { Logo } from "./ui";
import { Globe } from "./Globe";

export function EditorialArt({
  kind = "parcel",
  interactive = false,
}: {
  kind?: string;
  interactive?: boolean;
}) {
  return (
    <div className={`editorial-art art-${kind}`}>
      <div className="art-grid" />
      {kind === "network" ? (
        <Globe interactive={interactive} />
      ) : kind === "international" ? (
        <div
          className="international-art"
          role="img"
          aria-label="A parcel journey across international borders"
        >
          <span className="mono">ACROSS BORDERS</span>
          <div>
            <span>AMS</span>
            <i />
            <span>SIN</span>
          </div>
          <Package size={68} />
          <small>ONE CONNECTED JOURNEY</small>
        </div>
      ) : kind === "rules" ? (
        <div className="rule-stack">
          <div>
            <Zap size={20} />
            <span>IF destination = DE</span>
          </div>
          <i />
          <div>
            <Truck size={20} />
            <span>THEN select service</span>
            <Check size={18} />
          </div>
        </div>
      ) : kind === "tracking" ? (
        <div className="art-phone">
          <div className="phone-notch" />
          <span>SAMPLE STUDIO</span>
          <Package size={34} />
          <strong>
            Your next good thing.
            <br />
            On its way.
          </strong>
          <div className="phone-track">
            <i />
            <i />
            <i />
            <i />
          </div>
          <small>Order → Arrival</small>
        </div>
      ) : kind === "workflow" ? (
        <div className="workflow-illustration">
          <div>
            <Box size={26} />
            <span>Order received</span>
            <Check size={18} />
          </div>
          <div>
            <ScanLine size={26} />
            <span>Label prepared</span>
            <Check size={18} />
          </div>
          <div>
            <Truck size={26} />
            <span>Ready to go</span>
            <ArrowRight size={18} />
          </div>
        </div>
      ) : (
        <svg className="parcel-illustration" viewBox="0 0 500 340">
          <ellipse
            cx="262"
            cy="267"
            rx="106"
            ry="18"
            fill="#92704b"
            opacity=".12"
          />
          <g className="drawn-parcel">
            <path
              d="M151 113 248 70 354 119 257 166Z"
              fill="#dfb585"
              stroke="#b28d60"
              strokeWidth=".6"
            />
            <path
              d="M151 113 257 166 257 271 151 218Z"
              fill="#cba070"
              stroke="#ad8459"
              strokeWidth=".6"
            />
            <path
              d="M257 166 354 119 354 224 257 271Z"
              fill="#a97d50"
              stroke="#997045"
              strokeWidth=".6"
            />
            <path d="M193 94 215 84 322 134 300 145Z" fill="#efdfbc" />
            <path d="M300 145 322 134 322 162 300 173Z" fill="#d3bc94" />
            <g transform="matrix(1 .5 0 1 179 157)">
              <rect width="53" height="48" rx="1" fill="#f9f3e1" />
              <text
                x="7"
                y="12"
                fontFamily="monospace"
                fontSize="5"
                letterSpacing=".6"
                fill="#37452c"
              >
                WITH CARE.
              </text>
              <path
                d="M7 19v20m4-20v20m3-20v20m6-20v20m3-20v20m5-20v20m4-20v20m5-20v20"
                stroke="#263323"
                strokeWidth="2"
              />
              <text
                x="7"
                y="45"
                fontFamily="monospace"
                fontSize="3"
                fill="#37452c"
              >
                ORDER / ARRIVAL
              </text>
            </g>
            <path
              d="M276 222v15m-4-11 4-4 4 4m8-10v15m-4-11 4-4 4 4"
              stroke="#674d33"
              strokeWidth="1.7"
              fill="none"
            />
          </g>
          <text
            x="250"
            y="318"
            textAnchor="middle"
            fontFamily="monospace"
            fontSize="8"
            letterSpacing="1.4"
            fill="#6a5944"
          >
            A BETTER WAY FROM A TO B.
          </text>
        </svg>
      )}
    </div>
  );
}
export function JournalPreview() {
  return (
    <section className="section journal-preview">
      <div className="container">
        <div className="section-heading-row">
          <div>
            <div className="eyebrow section-eyebrow">THE SHIPPING JOURNAL</div>
            <h2>
              A little perspective.
              <br />
              <span className="muted-heading">For your next move.</span>
            </h2>
          </div>
          <a href="/blog" className="text-link">
            Explore the journal <ArrowRight size={17} />
          </a>
        </div>
        <div className="article-grid">
          {articles.slice(0, 3).map((a) => (
            <a href={`/blog/${a.slug}`} className="article-card" key={a.slug}>
              <EditorialArt kind={a.art} />
              <div className="article-meta mono">
                {a.category}
                <span>{a.read} read</span>
              </div>
              <h3>{a.title}</h3>
              <p>{a.summary}</p>
              <span className="text-link">
                Read the guide <ArrowRight size={16} />
              </span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
export function PlatformDoors() {
  return (
    <section className="section platform-doors">
      <div className="container">
        <div className="section-heading-row">
          <div>
            <div className="eyebrow section-eyebrow">
              ONE PLATFORM. YOUR WAY FORWARD.
            </div>
            <h2>
              Built around the way
              <br />
              <span className="muted-heading">your business moves.</span>
            </h2>
          </div>
          <p>
            From the first order to a growing logistics network. Find the
            workspace that fits your side of shipping.
          </p>
        </div>
        <div className="door-grid">
          <a href="/shipping" className="platform-door merchant-door">
            <span className="mono">01 / FOR BUSINESSES THAT SHIP</span>
            <h3>
              Less busywork.
              <br />
              More business.
            </h3>
            <p>
              Orders, automation, labels and tracking.
              <br />
              One continuous workflow.
            </p>
            <div className="door-visual">
              <div>
                <Package size={22} />
                <span>
                  Orders connected<small>All your channels, together.</small>
                </span>
                <span className="state-pill">Ready</span>
              </div>
              <div>
                <Zap size={22} />
                <span>
                  Rules applied<small>The right service for this order.</small>
                </span>
                <Check size={18} />
              </div>
              <div>
                <ScanLine size={22} />
                <span>
                  Labels prepared<small>Your next shipment starts here.</small>
                </span>
                <Check size={18} />
              </div>
            </div>
            <span className="door-link">
              Explore shipping software <ArrowRight size={22} />
            </span>
          </a>
          <a
            href="/logistics-operating-system"
            className="platform-door partner-door"
          >
            <span className="mono">02 / FOR BUSINESSES THAT MOVE GOODS</span>
            <h3>
              Your network.
              <br />
              Working as one.
            </h3>
            <p>
              Customers, services, contracts and support.
              <br />
              Give your operations a connected home.
            </p>
            <div className="partner-orbit">
              <div className="orbit-ring" />
              <div className="orbit-ring inner" />
              <span className="orbit-centre">
                <Logo />
                <span>PARTNER OS</span>
              </span>
              {["Customers", "Services", "Contracts", "Support"].map((x, i) => (
                <span className={`orbit-node n${i}`} key={x}>
                  {x}
                </span>
              ))}
            </div>
            <span className="door-link">
              Explore the partner platform <ArrowRight size={22} />
            </span>
          </a>
        </div>
      </div>
    </section>
  );
}
export function ReachSection() {
  return (
    <section className="reach-section">
      <div className="container reach-grid">
        <div>
          <div className="eyebrow">
            <span className="status-dot" /> BEYOND YOUR NEXT BORDER
          </div>
          <h2>
            Think bigger.
            <br />
            <span>Ship connected.</span>
          </h2>
          <p>
            New destinations shouldn’t mean disconnected workflows. Keep your
            carrier choices, customs preparation and shipment updates in the
            same conversation.
          </p>
          <a href="/blog/international-shipping" className="button mint">
            Explore cross-border shipping <ArrowRight size={18} />
          </a>
          <div className="reach-notes">
            <span>
              <Check size={16} /> International carrier options
            </span>
            <span>
              <Check size={16} /> Your contracts or partner rates
            </span>
            <span>
              <Check size={16} /> Tracking from order to arrival
            </span>
          </div>
        </div>
        <div className="reach-visual">
          <EditorialArt kind="network" interactive />
          <div className="reach-label mono">
            FROM LOCAL AMBITION
            <br />
            TO YOUR NEXT DESTINATION.
          </div>
          <small>
            200+ countries · 50+ logistics partners · 1,000+ methods
          </small>
        </div>
      </div>
      <div className="container global-scale-stats">
        {[
          ["300+ million", "Goods transported annually"],
          ["100+ million", "Economic value created annually"],
          ["12+ million", "Parcels processed annually"],
        ].map(([value, label]) => (
          <div key={label}>
            <strong>{value}</strong>
            <span>{label}</span>
          </div>
        ))}
        <p>Global scale figures published by Zineps in the original website.</p>
      </div>
    </section>
  );
}
