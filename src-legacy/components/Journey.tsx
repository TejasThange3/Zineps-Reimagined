import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import {
  ArrowRight,
  Box,
  Check,
  CheckCheck,
  FileText,
  Package,
  ShoppingBag,
  Sparkles,
  Truck,
} from "lucide-react";
import { stages } from "../data/story";

function StoryProduct({ stage }: { stage: number }) {
  return (
    <div className="story-product">
      <div className="story-product-top">
        <span>
          <span className="status-dot" /> SHIPMENT WORKSPACE
        </span>
        <span>DEMO / 0042</span>
      </div>
      <div className="story-route" aria-hidden="true">
        {[ShoppingBag, Sparkles, FileText, CheckCheck].map((Icon, i) => (
          <div key={i} className={i <= stage ? "complete" : ""}>
            <span>
              <Icon size={18} />
            </span>
            {i < 3 && <i />}
          </div>
        ))}
      </div>
      <div className="story-state">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.22 }}
          >
            {stage === 0 && (
              <>
                <div className="state-label">
                  <ShoppingBag size={16} /> Order imported{" "}
                  <span>
                    <Check size={12} /> Connected
                  </span>
                </div>
                <h3>A good beginning.</h3>
                <div className="order-product">
                  <span className="parcel-icon">
                    <Package size={44} strokeWidth={1} />
                  </span>
                  <div>
                    <strong>The Everyday Set</strong>
                    <span>Sample Studio · Fictional order</span>
                    <span className="mono">SKU / EVERYDAY-02</span>
                  </div>
                  <span>× 1</span>
                </div>
                <div className="order-details">
                  <span>
                    Order reference<strong>#DEMO-0042</strong>
                  </span>
                  <span>
                    Destination<strong>Berlin, Germany</strong>
                  </span>
                  <span>
                    Parcel weight<strong>2.0 kg</strong>
                  </span>
                </div>
                <div className="state-bottom">
                  <Check size={14} /> Order details, together and ready.
                </div>
              </>
            )}
            {stage === 1 && (
              <>
                <div className="state-label">
                  <Sparkles size={16} /> Service comparison{" "}
                  <span>Balanced</span>
                </div>
                <h3>The right next move.</h3>
                <div className="story-choice">
                  <span className="parcel-icon">
                    <Truck size={32} strokeWidth={1.4} />
                  </span>
                  <div>
                    <strong>Routewise Standard</strong>
                    <span>Fictional example service</span>
                  </div>
                  <Check size={20} />
                </div>
                <div className="choice-metrics">
                  <div>
                    <span>EXAMPLE RATE</span>
                    <strong>€7.90</strong>
                  </div>
                  <div>
                    <span>EST. DELIVERY</span>
                    <strong>
                      2 <small>days</small>
                    </strong>
                  </div>
                </div>
                <div className="state-bottom">
                  <Sparkles size={14} /> Price and speed, considered together.
                </div>
              </>
            )}
            {stage === 2 && (
              <>
                <div className="state-label">
                  <FileText size={16} /> Print preview <span>A6 · Sample</span>
                </div>
                <div className="shipping-label">
                  <div className="shipping-label-top">
                    <strong>
                      AMS <ArrowRight size={18} /> BER
                    </strong>
                    <Box size={24} />
                  </div>
                  <div className="label-address">
                    <span>SHIP TO / FICTIONAL RECIPIENT</span>
                    <strong>Example Recipient</strong>
                    <span>Sample address · Berlin, Germany</span>
                  </div>
                  <div className="label-spec">
                    <span>2.0 KG</span>
                    <span>ROUTEWISE STANDARD</span>
                  </div>
                  <div className="barcode" aria-hidden="true" />
                  <span className="mono">
                    DEMO ONLY · NOT VALID FOR SHIPPING
                  </span>
                </div>
              </>
            )}
            {stage === 3 && (
              <>
                <div className="state-label">
                  <CheckCheck size={16} /> Tracking overview{" "}
                  <span>
                    <Check size={12} /> Delivered
                  </span>
                </div>
                <h3>
                  A little clarity.
                  <br />
                  All the way home.
                </h3>
                <div className="delivery-proof">
                  <span>
                    <Check size={28} />
                  </span>
                  <div>
                    <strong>Arrived in Berlin</strong>
                    <span>Day 2 · Sample delivery completed</span>
                  </div>
                </div>
                <div className="mini-timeline">
                  <span>
                    <Check size={12} /> Collected in Amsterdam
                  </span>
                  <span>
                    <Check size={12} /> Out for delivery
                  </span>
                  <span>
                    <Check size={12} /> Delivered to recipient
                  </span>
                </div>
              </>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="story-product-footer">
        <span>Amsterdam</span>
        <span className="mono">ILLUSTRATIVE WORKFLOW</span>
        <span>Berlin</span>
      </div>
    </div>
  );
}
export function Journey() {
  const [stage, setStage] = useState(0);
  const root = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const nodes = root.current?.querySelectorAll<HTMLElement>("[data-stage]");
    if (!nodes) return;
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries)
          if (entry.isIntersecting)
            setStage(Number((entry.target as HTMLElement).dataset.stage));
      },
      { rootMargin: "-25% 0px -45% 0px", threshold: 0 },
    );
    nodes.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);
  return (
    <section
      className="section journey-section"
      id="platform"
      aria-labelledby="journey-title"
    >
      <div className="container">
        <div className="section-heading">
          <div>
            <div className="eyebrow section-eyebrow">
              <span>02 /</span> THE CONNECTED JOURNEY
            </div>
            <h2 id="journey-title">
              From checkout
              <br />
              <span className="muted-heading">to doorstep.</span>
            </h2>
          </div>
          <p>
            One connected workflow.
            <br />
            More room to focus on what’s next.
          </p>
        </div>
        <div className="journey-grid" ref={root}>
          <div className="journey-steps">
            {stages.map((s, i) => (
              <article
                className={`journey-step ${i === stage ? "active" : ""}`}
                key={s.title}
                data-stage={i}
              >
                <div className="step-copy">
                  <span className="step-number mono">0{i + 1}</span>
                  <div>
                    <h3>{s.title}</h3>
                    <strong>{s.benefit}</strong>
                    <p>{s.detail}</p>
                    <span className="mono step-tag">{s.tag}</span>
                  </div>
                </div>
                <div className="mobile-story">
                  <StoryProduct stage={i} />
                </div>
              </article>
            ))}
          </div>
          <div className="sticky-story">
            <StoryProduct stage={stage} />
            <p className="story-caption">
              <span className="status-dot" /> Follow one shipment. See the whole
              platform.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
