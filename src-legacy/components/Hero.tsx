import { ArrowRight, ArrowDown, ArrowUpRight, Check } from "lucide-react";
import { NetworkMap } from "./NetworkMap";
export function Hero() {
  return (
    <section className="hero">
      <div className="container hero-grid">
        <div className="hero-copy">
          <div className="eyebrow">
            <span className="status-dot" /> SHIPPING SOFTWARE. CONNECTED
            INTELLIGENCE.
          </div>
          <h1>
            Every shipment.
            <br />
            <span>A smarter way.</span>
          </h1>
          <p>
            Connect your store, compare shipping options, and move goods through
            one connected platform—for businesses that ship and the partners
            behind them.
          </p>
          <div className="hero-buttons">
            <a href="/shipping" className="button mint">
              Explore the platform <ArrowRight size={18} />
            </a>
            <a href="/logistics-operating-system" className="text-link">
              For logistics partners <ArrowUpRight size={16} />
            </a>
          </div>
          <div className="hero-footnote">
            <span>
              <Check size={14} /> Your contracts. Your choice.
            </span>
            <span>
              <Check size={14} /> One connected platform.
            </span>
          </div>
        </div>
        <NetworkMap />
      </div>
      <div className="container hero-bottom">
        <a href="#shipping-ai">
          <span className="down-circle">
            <ArrowDown size={16} />
          </span>{" "}
          Intelligence, in motion
        </a>
        <span className="mono">FROM ORDER TO ARRIVAL ↗</span>
      </div>
    </section>
  );
}
