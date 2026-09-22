import { useState } from "react";
import {
  ArrowRight,
  Box,
  Check,
  CheckCircle2,
  FileText,
  Layers3,
  Package,
  Search,
  Settings2,
  Truck,
  Users,
  Zap,
} from "lucide-react";
import { Modal } from "./ui";
const orders = [
  {
    id: "DEMO-1048",
    store: "Sample Studio",
    city: "Berlin",
    country: "Germany",
    weight: 1.2,
  },
  {
    id: "DEMO-1049",
    store: "Example Supply",
    city: "Paris",
    country: "France",
    weight: 3.4,
  },
  {
    id: "DEMO-1050",
    store: "Demo Collective",
    city: "Munich",
    country: "Germany",
    weight: 4.8,
  },
  {
    id: "DEMO-1051",
    store: "Sample Studio",
    city: "Copenhagen",
    country: "Denmark",
    weight: 0.8,
  },
];
export function ProductWorkspace({ partner = false }: { partner?: boolean }) {
  const tabs = partner
    ? ["Overview", "Customers", "Services", "Support"]
    : ["Orders", "Automation", "Labels", "Tracking"];
  const [tab, setTab] = useState(tabs[0]),
    [selected, setSelected] = useState<string[]>([]),
    [labels, setLabels] = useState<string[]>([]),
    [country, setCountry] = useState("Germany"),
    [weight, setWeight] = useState("2"),
    [ruleRun, setRuleRun] = useState(false),
    [preview, setPreview] = useState(false),
    [customer, setCustomer] = useState("Sample Studio");
  const matching = orders.filter(
    (o) => o.country === country && o.weight <= Number(weight),
  );
  const previewOrder =
    orders.find((order) => order.id === labels[0]) || orders[0];
  return (
    <div
      className="product-console"
      id={partner ? "partner-demo" : "workspace"}
    >
      <div className="console-top">
        <span>
          <Layers3 size={19} />{" "}
          {partner
            ? "Northline / Partner workspace"
            : "Sample Studio / Shipping workspace"}
        </span>
        <span className="demo-badge">INTERACTIVE DEMO</span>
      </div>
      <div className="console-shell">
        <div className="console-sidebar">
          <div className="mono">
            {partner ? "YOUR NETWORK" : "YOUR WORKSPACE"}
          </div>
          {tabs.map((t, i) => {
            const Icon = [Box, partner ? Users : Zap, FileText, Truck][i];
            return (
              <button
                key={t}
                aria-pressed={tab === t}
                onClick={() => setTab(t)}
              >
                <Icon size={18} />
                {t}
                {t === "Labels" && labels.length > 0 ? (
                  <span>{labels.length}</span>
                ) : null}
              </button>
            );
          })}
          <div className="console-sidebar-note">
            <span className="status-dot" /> Demo environment
            <br />
            No live connections
          </div>
        </div>
        <div className="console-body" key={tab}>
          <div className="console-heading">
            <div>
              <span className="mono">
                {partner ? "PARTNER OPERATIONS" : "FULFILMENT, CONNECTED"}
              </span>
              <h3>
                {tab === "Overview"
                  ? "A clear view of your network."
                  : tab === "Automation"
                    ? "Let the routine run itself."
                    : tab === "Orders"
                      ? "Ready for the next delivery."
                      : tab === "Tracking"
                        ? "Every update. In one place."
                        : tab === "Labels"
                          ? "Your packing station."
                          : tab === "Customers"
                            ? "Relationships, organized."
                            : tab === "Services"
                              ? "Your service catalogue."
                              : "Keep the conversation moving."}
              </h3>
            </div>
            <span className="console-avatar">{partner ? "NP" : "SS"}</span>
          </div>
          {!partner && tab === "Orders" && (
            <>
              <div className="console-stats">
                <div>
                  <span>Sample orders</span>
                  <strong>04</strong>
                </div>
                <div>
                  <span>Labels prepared</span>
                  <strong>{String(labels.length).padStart(2, "0")}</strong>
                </div>
                <div>
                  <span>Sales channels</span>
                  <strong>03</strong>
                </div>
              </div>
              <div className="console-toolbar">
                <span>
                  <Search size={15} /> Order queue
                </span>
                <button
                  className="button dark small-button"
                  disabled={!selected.length}
                  onClick={() => {
                    setLabels([...new Set([...labels, ...selected])]);
                    setSelected([]);
                    setTab("Labels");
                  }}
                >
                  Prepare {selected.length || ""} labels{" "}
                  <ArrowRight size={15} />
                </button>
              </div>
              <div className="console-orders">
                {orders.map((o) => (
                  <label className="console-order" key={o.id}>
                    <input
                      type="checkbox"
                      checked={selected.includes(o.id)}
                      onChange={(e) =>
                        setSelected(
                          e.target.checked
                            ? [...selected, o.id]
                            : selected.filter((id) => id !== o.id),
                        )
                      }
                    />
                    <span className="order-box">
                      <Package size={18} />
                    </span>
                    <span>
                      <strong>#{o.id}</strong>
                      <small>{o.store}</small>
                    </span>
                    <span>
                      {o.city}
                      <small>
                        {o.weight} kg · {o.country}
                      </small>
                    </span>
                    <span className="state-pill">
                      {labels.includes(o.id) ? "Label ready" : "Ready to ship"}
                    </span>
                  </label>
                ))}
              </div>
              <p className="console-hint">
                Select sample orders, then prepare their demo labels.
              </p>
            </>
          )}
          {!partner && tab === "Automation" && (
            <>
              <div className="rule-builder">
                <span className="rule-icon">
                  <Zap size={24} />
                </span>
                <div className="rule-line">
                  <b>WHEN</b>
                  <label>
                    Destination
                    <select
                      aria-label="Destination"
                      value={country}
                      onChange={(e) => {
                        setCountry(e.target.value);
                        setRuleRun(false);
                      }}
                    >
                      {["Germany", "France", "Denmark"].map((c) => (
                        <option key={c}>{c}</option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Weight up to
                    <select
                      aria-label="Weight up to"
                      value={weight}
                      onChange={(e) => {
                        setWeight(e.target.value);
                        setRuleRun(false);
                      }}
                    >
                      {["1", "2", "5"].map((w) => (
                        <option key={w} value={w}>
                          {w} kg
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div className="rule-connector" />
                <div className="rule-line">
                  <b>THEN</b>
                  <div className="rule-result">
                    <Truck size={20} />
                    <span>
                      Select Routewise Standard
                      <small>
                        Example service · all other orders stay in review
                      </small>
                    </span>
                    <Check size={17} />
                  </div>
                </div>
                <button
                  className="button dark"
                  onClick={() => setRuleRun(true)}
                >
                  Test on sample orders <Zap size={16} />
                </button>
              </div>
              <div className="rule-feedback" role="status">
                {ruleRun ? (
                  <>
                    <CheckCircle2 size={19} />
                    <span>
                      <strong>
                        {matching.length} of 4 orders match this rule.
                      </strong>
                      <small>
                        {matching.length
                          ? matching.map((o) => `#${o.id}`).join(" · ")
                          : "No matching orders. Try a different destination or weight."}
                      </small>
                    </span>
                  </>
                ) : (
                  <>
                    <Settings2 size={19} />
                    <span>
                      Adjust the conditions and test the outcome.
                      <small>
                        This rule only evaluates the four fictional orders
                        above.
                      </small>
                    </span>
                  </>
                )}
              </div>
            </>
          )}
          {!partner && tab === "Labels" && (
            <div className="label-workspace">
              <div className="sample-label">
                <div className="label-brand">
                  {previewOrder.store.toUpperCase()} <Package size={23} />
                </div>
                <div className="mono">DEMO ONLY / NOT VALID FOR SHIPPING</div>
                <hr />
                <small>SHIP TO</small>
                <h4>
                  Example recipient
                  <br />
                  {previewOrder.city}, {previewOrder.country}
                </h4>
                <div className="label-service">
                  Routewise Standard <span>{previewOrder.weight} KG</span>
                </div>
                <div className="barcode" />
                <div className="mono">{previewOrder.id} / PREVIEW</div>
              </div>
              <div>
                <span className="eyebrow">PRINT. PACK. GO.</span>
                <h4>
                  {labels.length
                    ? `${labels.length} demo labels prepared.`
                    : "A little less work at the packing station."}
                </h4>
                <p>
                  Order details become a label preview, ready to check alongside
                  your packing slip.
                </p>
                {labels.length > 0 && (
                  <ul className="prepared-list">
                    {labels.map((id) => (
                      <li key={id}>
                        <Check size={14} />
                        {id}
                      </li>
                    ))}
                  </ul>
                )}
                <button
                  className="button dark"
                  onClick={() => setPreview(true)}
                >
                  Open label preview <FileText size={16} />
                </button>
                <small>No carrier label is purchased or downloaded.</small>
              </div>
            </div>
          )}
          {!partner && tab === "Tracking" && (
            <div className="tracking-workspace">
              <div className="tracking-brand">
                <span className="mono">SAMPLE STUDIO</span>
                <Package size={38} />
                <h4>Your order is on its way.</h4>
                <p>Amsterdam → Berlin</p>
                <span className="state-pill">Illustrative shipment</span>
              </div>
              <ol className="tracking-events">
                {[
                  [
                    "Order prepared",
                    "Mon, 09:10",
                    "Your items are packed and the label is ready.",
                  ],
                  [
                    "Collected by the carrier",
                    "Mon, 16:35",
                    "The parcel has entered the delivery network.",
                  ],
                  [
                    "In transit",
                    "Tue, 07:20",
                    "Moving through the destination sorting centre.",
                  ],
                  ["Delivery", "Next step", "Awaiting the next carrier event."],
                ].map(([title, time, copy], i) => (
                  <li key={title} className={i === 3 ? "pending" : ""}>
                    <span>
                      {i === 3 ? <Package size={15} /> : <Check size={15} />}
                    </span>
                    <div>
                      <small>{time}</small>
                      <strong>{title}</strong>
                      <p>{copy}</p>
                    </div>
                  </li>
                ))}
              </ol>
            </div>
          )}
          {partner && tab === "Overview" && (
            <>
              <div className="console-stats">
                <div>
                  <span>Sample customers</span>
                  <strong>03</strong>
                </div>
                <div>
                  <span>Service groups</span>
                  <strong>02</strong>
                </div>
                <div>
                  <span>Open cases</span>
                  <strong>01</strong>
                </div>
              </div>
              <div className="partner-overview">
                <div>
                  <span className="mono">ILLUSTRATIVE ORDER MIX</span>
                  <h4>Activity across the network</h4>
                  <div className="activity-chart">
                    {[35, 56, 43, 76, 64, 90, 72].map((n, i) => (
                      <div key={i}>
                        <span style={{ height: `${n}%` }} />
                        <small>{["M", "T", "W", "T", "F", "S", "S"][i]}</small>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="partner-actions">
                  <h4>Needs your attention</h4>
                  <button onClick={() => setTab("Customers")}>
                    <Users size={20} />
                    <span>
                      Customer onboarding<small>Review Demo Collective</small>
                    </span>
                    <ArrowRight size={16} />
                  </button>
                  <button onClick={() => setTab("Support")}>
                    <Truck size={20} />
                    <span>
                      Shipment exception<small>One sample case to review</small>
                    </span>
                    <ArrowRight size={16} />
                  </button>
                  <p>Example records, not business metrics.</p>
                </div>
              </div>
            </>
          )}
          {partner && tab === "Customers" && (
            <>
              <div
                className="customer-selector"
                aria-label="Select a sample customer"
              >
                {["Sample Studio", "Example Supply", "Demo Collective"].map(
                  (c) => (
                    <button
                      key={c}
                      aria-pressed={customer === c}
                      onClick={() => setCustomer(c)}
                    >
                      <Users size={18} />
                      {c}
                    </button>
                  ),
                )}
              </div>
              <div className="customer-detail">
                <span className="mono">CUSTOMER PROFILE / FICTIONAL</span>
                <h4>{customer}</h4>
                <div className="customer-fields">
                  <div>
                    <span>Customer group</span>
                    <strong>
                      {customer === "Example Supply" ? "Wholesale" : "Retail"}
                    </strong>
                  </div>
                  <div>
                    <span>Service access</span>
                    <strong>Standard & Express</strong>
                  </div>
                  <div>
                    <span>Onboarding</span>
                    <strong>
                      {customer === "Demo Collective"
                        ? "In progress"
                        : "Complete"}
                    </strong>
                  </div>
                </div>
                <ul className="check-list">
                  <li>
                    <CheckCircle2 size={18} /> Account details reviewed
                  </li>
                  <li>
                    <CheckCircle2 size={18} /> Service group assigned
                  </li>
                  <li>
                    {customer === "Demo Collective" ? (
                      <Settings2 size={18} />
                    ) : (
                      <CheckCircle2 size={18} />
                    )}{" "}
                    {customer === "Demo Collective"
                      ? "Store connection awaiting setup"
                      : "Store connection ready"}
                  </li>
                </ul>
              </div>
            </>
          )}
          {partner && tab === "Services" && (
            <div className="service-catalogue">
              {[
                [
                  "Standard delivery",
                  "Domestic & European lanes",
                  "Retail + Wholesale",
                ],
                [
                  "Express delivery",
                  "Time-sensitive shipments",
                  "Retail + Wholesale",
                ],
                [
                  "Custom contract",
                  "Customer-specific agreement",
                  "Assigned customers",
                ],
              ].map(([name, copy, group], i) => (
                <div key={name}>
                  <span className="service-number">0{i + 1}</span>
                  <div>
                    <h4>{name}</h4>
                    <p>{copy}</p>
                    <span className="state-pill">{group}</span>
                  </div>
                  <Truck size={24} />
                </div>
              ))}
              <p className="console-hint">
                Illustrative catalogue. Rates and contracts are configured with
                the partner team, not in this demo.
              </p>
            </div>
          )}
          {partner && tab === "Support" && (
            <div className="support-case">
              <span className="state-pill">Sample case · Needs review</span>
              <h4>Delivery update requested</h4>
              <p>Sample Studio · Shipment DEMO-1048</p>
              <div className="case-message">
                <strong>Customer note</strong>
                <p>
                  Can you check the latest status of our shipment to Berlin?
                </p>
              </div>
              <div className="case-context">
                <Truck size={25} />
                <span>
                  Last sample event
                  <strong>In transit · Destination sorting centre</strong>
                </span>
              </div>
              <p className="console-hint">
                A shared shipment context helps the operations team investigate.
                No message is sent from this concept.
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="console-bottom">
        <span>
          <span className="status-dot" /> LOCAL PRODUCT EXAMPLE
        </span>
        <span>Fictional records. No account or carrier connection.</span>
      </div>
      <Modal
        open={preview}
        onClose={() => setPreview(false)}
        title="Demo label preview"
      >
        <div className="large-label">
          <Package size={36} />
          <h3>Routewise Standard</h3>
          <p>{previewOrder.store} → Example recipient</p>
          <p>Amsterdam → {previewOrder.city}</p>
          <p>
            {previewOrder.id} · {previewOrder.weight} kg
          </p>
          <div className="barcode" />
          <strong>DEMO ONLY — NOT VALID FOR SHIPPING</strong>
          <p>
            {labels.length
              ? `${labels.length} labels prepared in this session.`
              : "Sample label layout. Select orders to prepare demo labels."}
          </p>
        </div>
      </Modal>
    </div>
  );
}
