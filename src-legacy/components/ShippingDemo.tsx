import { useState } from "react";
import {
  ArrowRight,
  Box,
  Check,
  CircleHelp,
  Clock3,
  MapPin,
  Package,
  Sparkles,
  Truck,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import {
  lanes,
  money,
  priorities,
  type Priority,
  type Lane,
} from "../data/shipments";
import { recommend } from "../lib/recommend";
import { Modal } from "./ui";

export function LaneRoute({ lane }: { lane: Lane }) {
  return (
    <div className="lane-route">
      <div>
        <span className="mono">FROM</span>
        <strong>{lane.from}</strong>
        <span>{lane.origin}</span>
      </div>
      <div className="lane-line">
        <i />
        <span />
        <Package size={24} />
        <span />
        <i />
      </div>
      <div>
        <span className="mono">TO</span>
        <strong>{lane.to}</strong>
        <span>{lane.destination}</span>
      </div>
    </div>
  );
}
export function ShippingDemo() {
  const [laneId, setLaneId] = useState(lanes[0].id);
  const [priority, setPriority] = useState<Priority>("balanced");
  const [details, setDetails] = useState(false);
  const [rule, setRule] = useState(false);
  const lane = lanes.find((l) => l.id === laneId)!;
  const selected = recommend(lane.services, priority);
  const priorityLabel = priorities.find((p) => p.id === priority)!.label;
  const explanation =
    priority === "cost"
      ? `The lowest example price on this route, at ${money(selected.price)}. A ${selected.days}-day estimate keeps the budget in focus.`
      : priority === "speed"
        ? `The shortest example delivery estimate: ${selected.days} business day. Priority handling when getting there sooner matters most.`
        : `A ${selected.days}-day delivery estimate for ${money(selected.price)}. The best combined score for price and speed in this example.`;
  return (
    <section
      className="section demo-section"
      id="shipping-ai"
      aria-labelledby="demo-title"
    >
      <div className="container">
        <div className="section-heading">
          <div>
            <div className="eyebrow section-eyebrow">
              <span>01 /</span> SHIPPING INTELLIGENCE
            </div>
            <h2 id="demo-title">
              See the decision.
              <br />
              <span className="muted-heading">Before the delivery.</span>
            </h2>
          </div>
          <p>
            Every shipment has a different priority.
            <br className="desktop-break" /> Explore how yours changes the
            recommended option.
          </p>
        </div>
        <div className="demo-workspace">
          <div className="workspace-toolbar">
            <span>
              <span className="workspace-symbol">
                <Sparkles size={16} />
              </span>
              <strong>Shipping intelligence</strong>
              <span className="toolbar-divider" /> Decision workspace
            </span>
            <span className="demo-badge">
              <span /> INTERACTIVE EXAMPLE
            </span>
          </div>
          <div className="demo-layout">
            <div className="demo-inputs">
              <div className="field-number mono">
                01 <span>SET YOUR SHIPMENT</span>
              </div>
              <label htmlFor="lane">Shipping lane</label>
              <select
                id="lane"
                value={laneId}
                onChange={(e) => setLaneId(e.target.value)}
              >
                {lanes.map((l) => (
                  <option key={l.id} value={l.id}>
                    {l.origin} → {l.destination}
                  </option>
                ))}
              </select>
              <div className="parcel-spec">
                <Box size={18} />
                <span>
                  1 parcel <i /> 2.0 kg <i /> 30 × 20 × 15 cm
                </span>
              </div>
              <div className="field-number mono second-field">
                02 <span>CHOOSE YOUR PRIORITY</span>
              </div>
              <fieldset className="priority-group">
                <legend className="sr-only">Shipping priority</legend>
                {priorities.map((p, i) => {
                  const Icon = [Package, Zap, Sparkles][i];
                  return (
                    <label
                      key={p.id}
                      className={`priority-option ${priority === p.id ? "selected" : ""}`}
                    >
                      <input
                        type="radio"
                        name="priority"
                        value={p.id}
                        checked={priority === p.id}
                        onChange={() => setPriority(p.id)}
                      />
                      <Icon size={17} />
                      <span>{p.label}</span>
                      <span className="radio-mark">
                        {priority === p.id && <span />}
                      </span>
                    </label>
                  );
                })}
              </fieldset>
              <button className="rule-link" onClick={() => setRule(true)}>
                <CircleHelp size={14} /> How is this recommendation made?
              </button>
            </div>
            <div className="demo-results">
              <LaneRoute lane={lane} />
              <div className="comparison-title">
                <span className="mono">YOUR SHIPPING OPTIONS</span>
                <span>3 example services</span>
              </div>
              <div
                className="comparison"
                role="group"
                aria-label="Service comparison"
              >
                <div className="comparison-header">
                  <span>Service</span>
                  <span>Est. delivery</span>
                  <span>Rate</span>
                </div>
                {lane.services.map((service, i) => (
                  <div
                    key={service.id}
                    className={`service-row ${selected.id === service.id ? "recommended" : ""}`}
                    data-testid={`service-${service.id}`}
                  >
                    <div className="service-name">
                      <span className={`service-icon service-icon-${i}`}>
                        <Truck size={18} />
                      </span>
                      <div>
                        <strong>{service.name}</strong>
                        <span>{service.feature}</span>
                      </div>
                    </div>
                    <span className="delivery-time">
                      {service.days} business{" "}
                      {service.days === 1 ? "day" : "days"}
                    </span>
                    <span className="service-price">
                      {money(service.price)}
                      <span className="service-selected" aria-hidden="true">
                        {selected.id === service.id && <Check size={13} />}
                      </span>
                      {selected.id === service.id && (
                        <span className="sr-only">Recommended</span>
                      )}
                    </span>
                    {selected.id === service.id && (
                      <motion.div
                        layoutId="recommendation-border"
                        className="recommendation-border"
                        transition={{ duration: 0.25 }}
                      />
                    )}
                  </div>
                ))}
              </div>
              <div className="decision-summary">
                <span className="decision-spark">
                  <Sparkles size={18} />
                </span>
                <div role="status" aria-live="polite" aria-atomic="true">
                  <strong>
                    {selected.name} is your{" "}
                    {priority === "balanced"
                      ? "balanced"
                      : priority === "cost"
                        ? "lowest-cost"
                        : "fastest"}{" "}
                    choice.
                  </strong>
                  <p>{explanation}</p>
                </div>
              </div>
              <div className="result-footer">
                <span>
                  <Check size={14} /> A decision you can understand.
                </span>
                <button
                  className="button dark"
                  onClick={() => setDetails(true)}
                >
                  View shipment <ArrowRight size={16} />
                </button>
              </div>
            </div>
          </div>
          <div className="workspace-disclaimer">
            <CircleHelp size={13} /> Interactive example · Illustrative rates
            and delivery estimates. No live carrier or AI connection.
          </div>
        </div>
        <div className="below-demo">
          <span>YOUR PRIORITIES. A CLEARER PATH.</span>
          <p>
            From the options available to the reason behind the recommendation.
          </p>
        </div>
      </div>
      <Modal
        open={details}
        onClose={() => setDetails(false)}
        title="Shipment details"
        className="shipment-drawer"
      >
        <span className="demo-badge">ILLUSTRATIVE SHIPMENT</span>
        <LaneRoute lane={lane} />
        <dl className="shipment-facts">
          <div>
            <dt>Shipment ID</dt>
            <dd>
              ZNP-DEMO-{lane.from}-{lane.to}
            </dd>
          </div>
          <div>
            <dt>Selected service</dt>
            <dd>{selected.name}</dd>
          </div>
          <div>
            <dt>Priority</dt>
            <dd>{priorityLabel}</dd>
          </div>
          <div>
            <dt>Example rate</dt>
            <dd>{money(selected.price)}</dd>
          </div>
        </dl>
        <h3 className="timeline-heading">A sample journey</h3>
        <ol className="shipment-timeline">
          <li>
            <Box size={16} />
            <div>
              <strong>Order connected</strong>
              <span>Day 0 · Example order imported</span>
            </div>
          </li>
          <li>
            <Sparkles size={16} />
            <div>
              <strong>Service selected</strong>
              <span>
                {selected.name} · {priorityLabel}
              </span>
            </div>
          </li>
          <li>
            <Truck size={16} />
            <div>
              <strong>Collected in {lane.origin}</strong>
              <span>Day 0 · Ready for the journey</span>
            </div>
          </li>
          <li>
            <MapPin size={16} />
            <div>
              <strong>Arrival in {lane.destination}</strong>
              <span>Day {selected.days} · Illustrative delivery estimate</span>
            </div>
          </li>
        </ol>
        <p className="small-note">
          This is a fictional shipment. No label has been purchased and no
          booking has been made.
        </p>
      </Modal>
      <Modal
        open={rule}
        onClose={() => setRule(false)}
        title="A transparent recommendation"
      >
        <p className="modal-copy">
          This example compares a fixed set of fictional services. Lowest cost
          chooses the lowest price; fastest delivery chooses the shortest
          estimate.
        </p>
        <div className="scoring-rule">
          <Sparkles />
          <strong>Balanced = 55% price + 45% delivery time</strong>
          <p>
            Each value is scaled from 0 (best) to 1 (worst) within this route.
            The lowest combined score wins. If all values match, that part
            contributes zero.
          </p>
        </div>
        <p className="modal-copy">
          Ties use the lower price, then the shorter delivery time, then service
          ID. This illustrates a decision rule; it does not reproduce Zineps’s
          proprietary AI.
        </p>
      </Modal>
    </section>
  );
}

export function FaqAnswer({
  open,
  children,
}: {
  open: boolean;
  children: React.ReactNode;
}) {
  return (
    <AnimatePresence initial={false}>
      {open && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="faq-answer"
        >
          <div>{children}</div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export function TransitStatus() {
  return (
    <span className="transit-status">
      <Clock3 size={12} /> In transit
    </span>
  );
}
