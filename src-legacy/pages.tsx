import { BrandLogo } from "./components/BrandLogo";
import { OutcomeStats, PartnerStats } from "./components/Statistics";
import { AfterPurchase } from "./components/AfterPurchase";
import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  Check,
  ChevronRight,
  Code2,
  FileText,
  Globe2,
  Layers3,
  Package,
  RotateCcw,
  Search,
  ScanLine,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Users,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { ProductWorkspace } from "./components/ProductWorkspace";
import {
  EditorialArt,
  JournalPreview,
  ReachSection,
} from "./components/Editorial";
import { ShippingDemo } from "./components/ShippingDemo";
import { NetworkMap } from "./components/NetworkMap";
import { FAQ } from "./components/Sections";
import { ExternalLink, Modal, Logo } from "./components/ui";
import { links } from "./data/content";
import { articles, directory, plans } from "./data/site";

function PageIntro({
  eyebrow,
  title,
  accent,
  description,
  children,
}: {
  eyebrow: string;
  title: string;
  accent: string;
  description: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="page-intro">
      <div className="container">
        <a href="/" className="breadcrumb">
          Home <ChevronRight size={12} /> <span>{eyebrow}</span>
        </a>
        <div className="eyebrow section-eyebrow">{eyebrow}</div>
        <h1>
          {title}
          <br />
          <span>{accent}</span>
        </h1>
        <p>{description}</p>
        {children}
      </div>
    </section>
  );
}
const merchantFeatures: [LucideIcon, string, string][] = [
  [
    Zap,
    "Shipping rules",
    "Choose services based on destination, parcel weight and product conditions. Keep repeatable decisions consistent.",
  ],
  [
    FileText,
    "Labels & packing slips",
    "Bring order details into the packing process. Prepare labels and branded packing slips from one workspace.",
  ],
  [
    RotateCcw,
    "Branded returns",
    "Give customers a clear path back. Keep the return experience connected to the order and your brand.",
  ],
  [
    Truck,
    "Tracking & notifications",
    "Follow delivery events and keep customers informed through a branded tracking experience.",
  ],
  [
    ScanLine,
    "Scan & Go",
    "Connect the order to the packing station with scan-based fulfilment, helping your team check what goes out.",
  ],
  [
    ShoppingBag,
    "Dynamic checkout",
    "Bring shipping choices closer to the purchase. Configure delivery options for the way your business ships.",
  ],
];
function FeatureGrid({
  items = merchantFeatures,
}: {
  items?: [LucideIcon, string, string][];
}) {
  return (
    <div className="feature-grid">
      {items.map(([Icon, title, copy], i) => (
        <div className="feature-item" key={title}>
          <div className="feature-top">
            <Icon size={27} strokeWidth={1.5} />
            <span className="mono">0{i + 1}</span>
          </div>
          <h3>{title}</h3>
          <p>{copy}</p>
        </div>
      ))}
    </div>
  );
}
export function ShippingPage() {
  return (
    <>
      <PageIntro
        eyebrow="SHIPPING SOFTWARE"
        title="A good day starts"
        accent="with connected shipping."
        description="From your first order to your busiest afternoon. Bring your stores, carrier choices and fulfilment together—and give your team room to grow."
      >
        <div className="intro-actions">
          <ExternalLink href={links.register} className="button dark">
            Start shipping
          </ExternalLink>
          <a href="#workspace" className="text-link">
            Try the workspace <ArrowRight size={17} />
          </a>
        </div>
        <div className="intro-proof">
          <span>
            <Check size={15} /> Your own contracts
          </span>
          <span>
            <Check size={15} /> Partner shipping rates
          </span>
          <span>
            <Check size={15} /> Multi-channel orders
          </span>
        </div>
      </PageIntro>
      <section className="workspace-stage">
        <div className="container">
          <ProductWorkspace />
          <div className="stage-caption">
            <span>ONE WORKSPACE. FROM FIRST CLICK TO FINAL MILE.</span>
            <span>Click through the product example ↑</span>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-heading-row">
            <div>
              <div className="eyebrow section-eyebrow">
                THE DETAILS MAKE THE DIFFERENCE
              </div>
              <h2>
                Everything between
                <br />
                <span className="muted-heading">
                  “ordered” and “delivered.”
                </span>
              </h2>
            </div>
            <p>
              Build a workflow that keeps moving, with less switching between
              tools and more clarity at every handoff.
            </p>
          </div>
          <FeatureGrid />
        </div>
      </section>
      <AfterPurchase />
      <section className="section">
        <div className="container connection-strip">
          <div>
            <div className="eyebrow section-eyebrow">
              KEEP YOUR STACK. CONNECT YOUR SHIPPING.
            </div>
            <h2>Your store belongs here.</h2>
            <p>
              Connect commerce, marketplaces and warehouse tools to the carriers
              you choose.
            </p>
            <a href="/integrations" className="button dark">
              Find your integration <ArrowRight size={17} />
            </a>
          </div>
          <div className="stack-labels">
            {[
              "Shopify",
              "WooCommerce",
              "Bol",
              "Picqer",
              "DHL",
              "PostNL",
              "DPD",
              "UPS",
            ].map((n) => (
              <span key={n}>{n}</span>
            ))}
          </div>
        </div>
      </section>
      <ReachSection />
      <FAQ />
    </>
  );
}
const partnerFeatures: [LucideIcon, string, string][] = [
  [
    Layers3,
    "Services & contracts",
    "Structure your service offering and keep commercial agreements together.",
  ],
  [
    Users,
    "Customers & onboarding",
    "Organize customer groups and bring new merchants into a shared workflow.",
  ],
  [
    BarChart3,
    "Rates & margins",
    "Manage your commercial model alongside the services your customers use.",
  ],
  [
    FileText,
    "Invoicing",
    "Connect administrative work to customer and shipment context.",
  ],
  [
    Settings2,
    "Operations & support",
    "Give your team a common view of the work and the issues that need attention.",
  ],
  [
    Globe2,
    "Partner network",
    "Connect your logistics offering with merchants through the Zineps platform.",
  ],
];
export function PartnerPage() {
  return (
    <>
      <section className="partner-intro">
        <div className="container partner-intro-grid">
          <div>
            <a href="/" className="breadcrumb">
              Home <ChevronRight size={12} /> For logistics partners
            </a>
            <div className="eyebrow">
              <span className="status-dot" /> THE LOGISTICS OPERATING SYSTEM
            </div>
            <h1>
              A bigger picture.
              <br />
              <span>A closer connection.</span>
            </h1>
            <p>
              Your customers. Your services. Your commercial relationships. One
              platform to bring the operation behind them together.
            </p>
            <div className="intro-actions">
              <a href="/contact?interest=partner" className="button mint">
                Let’s talk partnerships <ArrowUpRight size={17} />
              </a>
              <a href="#partner-demo" className="text-link">
                Explore the workspace <ArrowRight size={17} />
              </a>
            </div>
          </div>
          <EditorialArt kind="network" interactive />
        </div>
      </section>
      <PartnerStats />
      <section className="workspace-stage partner-stage">
        <div className="container">
          <ProductWorkspace partner />
          <div className="stage-caption">
            <span>YOUR NETWORK, CONNECTED.</span>
            <span>Explore customers, services and support ↑</span>
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container">
          <div className="section-heading-row">
            <div>
              <div className="eyebrow section-eyebrow">
                MORE THAN A SHIPPING TOOL
              </div>
              <h2>
                The operating layer
                <br />
                <span className="muted-heading">for your next chapter.</span>
              </h2>
            </div>
            <p>
              Keep the customer relationship at the centre. Connect the
              commercial, operational and support work around it.
            </p>
          </div>
          <FeatureGrid items={partnerFeatures} />
        </div>
      </section>
      <section className="partner-process">
        <div className="container">
          <div className="eyebrow section-eyebrow">
            A CONNECTED WAY OF WORKING
          </div>
          <h2>
            From your services.
            <br />
            To their next shipment.
          </h2>
          <div className="process-grid">
            {[
              [
                "Shape your offering",
                "Organize services, contract terms and the customer groups they serve.",
              ],
              [
                "Bring customers aboard",
                "Connect merchant accounts, store integrations and service access.",
              ],
              [
                "Keep operations moving",
                "Follow shipment activity and resolve exceptions with shared context.",
              ],
              [
                "Build on the relationship",
                "Keep invoicing, support and your commercial model close to the customer.",
              ],
            ].map(([t, p], i) => (
              <div key={t}>
                <span className="process-number">0{i + 1}</span>
                <h3>{t}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <section className="section">
        <div className="container partner-contact">
          <div>
            <div className="eyebrow section-eyebrow">
              BUILT AROUND YOUR BUSINESS
            </div>
            <h2>
              Not every network
              <br />
              fits a standard plan.
            </h2>
            <p>
              Discuss your service model, customer base and operational needs
              with the Zineps team. Partner pricing is tailored to your setup.
            </p>
            <a href="/contact?interest=partner" className="button dark">
              Discuss your partner setup <ArrowRight size={17} />
            </a>
          </div>
          <div className="partner-checklist">
            <ShieldCheck size={32} />
            <h3>A conversation worth having.</h3>
            <ul className="check-list">
              <li>
                <Check size={18} /> Your existing carrier relationships
              </li>
              <li>
                <Check size={18} /> Customer and service structure
              </li>
              <li>
                <Check size={18} /> Commercial and operational requirements
              </li>
              <li>
                <Check size={18} /> Onboarding and integration needs
              </li>
            </ul>
            <a href="/blog/partner-operations" className="text-link">
              Read the partner operations guide <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>
      <FAQ />
    </>
  );
}
export function AIPage() {
  return (
    <>
      <section className="ai-intro">
        <div className="container ai-intro-grid">
          <div>
            <a className="breadcrumb" href="/">
              Home <ChevronRight size={12} /> Shipping AI
            </a>
            <div className="eyebrow">
              <span className="status-dot" /> SHIPPING INTELLIGENCE
            </div>
            <h1>
              A clearer choice.
              <br />
              <span>Before you ship.</span>
            </h1>
            <p>
              Shipping is a series of decisions. Bring the options into view,
              understand the trade-offs, and make the next move with more
              context.
            </p>
            <a href="#shipping-ai" className="button mint">
              Try the decision engine <ArrowRight size={18} />
            </a>
            <small className="ai-disclaimer">
              The demo below uses transparent scoring, not a live AI model.
            </small>
          </div>
          <NetworkMap />
        </div>
      </section>
      <ShippingDemo />
      <section className="section">
        <div className="container">
          <div className="section-heading-row">
            <div>
              <div className="eyebrow section-eyebrow">
                INTELLIGENCE YOU CAN UNDERSTAND
              </div>
              <h2>
                No mystery.
                <br />
                <span className="muted-heading">Just a clearer trade-off.</span>
              </h2>
            </div>
            <p>
              Explore a simplified decision, with a visible reason behind the
              result. Actual carrier quotes and delivery estimates depend on
              your account and shipment.
            </p>
          </div>
          <FeatureGrid
            items={[
              [
                Package,
                "Cost, made comparable",
                "The lowest-cost option is the one with the smallest illustrative quote. No hidden random ranking.",
              ],
              [
                Truck,
                "Speed, made visible",
                "The fastest option has the shortest estimated transit time in the selected example lane.",
              ],
              [
                BarChart3,
                "Balance, explained",
                "The balanced score weights normalized price at 55% and delivery time at 45%. The lowest score wins.",
              ],
            ]}
          />
        </div>
      </section>
      <section className="split-feature mint-feature">
        <div className="container split-feature-grid">
          <EditorialArt kind="rules" />
          <div>
            <div className="eyebrow section-eyebrow">
              FROM DECISION TO ROUTINE
            </div>
            <h2>
              A good decision.
              <br />
              Ready to repeat.
            </h2>
            <p>
              Use shipping rules to apply repeatable choices across your orders.
              Start with a destination and parcel condition, then test which
              orders match.
            </p>
            <a href="/shipping#workspace" className="button dark">
              Explore shipping automation <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>
      <JournalPreview />
    </>
  );
}

export function IntegrationsPage() {
  const [query, setQuery] = useState(""),
    [category, setCategory] = useState("All"),
    [selected, setSelected] = useState<(typeof directory)[number] | null>(null);
  const shown = directory.filter(
    (d) =>
      (category === "All" || d.category === category) &&
      d.name.toLowerCase().includes(query.toLowerCase().trim()),
  );
  return (
    <>
      <PageIntro
        eyebrow="INTEGRATIONS"
        title="Your tools."
        accent="A more connected world."
        description="Connect the store you’ve built, the systems you rely on and the carriers that deliver. Your stack belongs in the same workflow."
      />
      <section className="directory-section">
        <div className="container">
          <div className="directory-flow">
            <span>
              <ShoppingBag /> Your sales channels
            </span>
            <i />
            <span className="directory-hub">
              <Logo />
            </span>
            <i />
            <span>
              <Truck /> Your delivery network
            </span>
          </div>
          <div className="directory-toolbar">
            <label className="search-field">
              <Search size={19} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search integrations…"
                aria-label="Search integrations"
              />
            </label>
            <div className="filter-pills" aria-label="Integration category">
              {["All", "Webshops", "Marketplaces", "ERP & WMS", "Carriers"].map(
                (c) => (
                  <button
                    key={c}
                    aria-pressed={category === c}
                    onClick={() => setCategory(c)}
                  >
                    {c}
                  </button>
                ),
              )}
            </div>
          </div>
          <div className="results-line" role="status">
            {shown.length} integrations <span>Find your connection.</span>
          </div>
          <div className="directory-grid">
            {shown.map((d) => (
              <button
                className="directory-card"
                key={d.name}
                onClick={() => setSelected(d)}
              >
                <span className="integration-logo">
                  <BrandLogo name={d.name} />
                </span>
                <span className="directory-name">
                  {d.name}
                  <small>{d.category}</small>
                </span>
                <ArrowUpRight size={20} />
              </button>
            ))}
          </div>
          {!shown.length && (
            <div className="empty-results">
              <Search size={32} />
              <h3>No matching integrations.</h3>
              <p>Try another name or category.</p>
              <button
                className="button dark"
                onClick={() => {
                  setQuery("");
                  setCategory("All");
                }}
              >
                Reset filters
              </button>
            </div>
          )}
          <p className="source-note">
            Names verified against Zineps’s public integration directory and
            carrier references on 15 September 2026. Original brand logos from
            the official directory. Availability and setup vary.
          </p>
          <div className="directory-help">
            <div>
              <h3>Something more specific?</h3>
              <p>
                Talk through your stack, an existing contract or an API-led
                setup.
              </p>
            </div>
            <a href="/contact?interest=integration" className="button dark">
              Let’s connect <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>
      <section className="section integration-steps">
        <div className="container">
          <div className="eyebrow section-eyebrow">
            FROM DISCONNECTED TO READY
          </div>
          <h2>
            One connection.
            <br />A better flow.
          </h2>
          <div className="process-grid">
            {[
              [
                "Choose your integration",
                "Find your commerce platform, marketplace or operational system.",
              ],
              [
                "Configure your setup",
                "Follow the official setup instructions for credentials and permissions.",
              ],
              [
                "Review your shipping options",
                "Connect your contracts or explore available partner services.",
              ],
              [
                "Start with a checked order",
                "Validate the order data and workflow before your first shipment.",
              ],
            ].map(([t, p], i) => (
              <div key={t}>
                <span className="process-number">0{i + 1}</span>
                <h3>{t}</h3>
                <p>{p}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      <Modal
        open={!!selected}
        onClose={() => setSelected(null)}
        title={selected ? `${selected.name} integration` : "Integration"}
      >
        {selected && (
          <div className="integration-modal">
            <span className="eyebrow section-eyebrow">{selected.category}</span>
            <p>{selected.detail}</p>
            <h3>Before you connect</h3>
            <ul className="check-list">
              <li>
                <Check size={17} /> Confirm your account and plan requirements.
              </li>
              <li>
                <Check size={17} /> Review the supported data flow and
                permissions.
              </li>
              <li>
                <Check size={17} /> Follow Zineps’s official setup guidance.
              </li>
            </ul>
            <ExternalLink href={links.integrations} className="button dark">
              View official integrations
            </ExternalLink>
            <p className="source-note">
              This directory does not install or authorize integrations.
            </p>
          </div>
        )}
      </Modal>
    </>
  );
}

export function PricingPage() {
  const [volume, setVolume] = useState(750);
  const [annual, setAnnual] = useState(true);
  const priceFor = (plan: (typeof plans)[number]) =>
    annual ? plan.price : plan.monthlyPrice;
  const recommended = plans.find((p) => volume <= p.limit);
  return (
    <>
      <PageIntro
        eyebrow="PRICING"
        title="A plan for today."
        accent="Room for what’s next."
        description="From your first labels to a busier operation. Find the shipping plan that fits your volume, your channels and your team."
      />
      <section className="pricing-section">
        <div className="container">
          <div className="pricing-billing">
            <div
              className="segmented billing-toggle"
              role="group"
              aria-label="Billing period"
            >
              <button aria-pressed={!annual} onClick={() => setAnnual(false)}>
                Monthly
              </button>
              <button aria-pressed={annual} onClick={() => setAnnual(true)}>
                Annual <span>Save 20%</span>
              </button>
            </div>
            <p>
              {annual
                ? "Monthly equivalents, billed annually."
                : "Monthly subscriptions, billed monthly."}{" "}
              Label fees and postage are separate.
            </p>
          </div>
          <div className="pricing-grid">
            {plans.map((p) => (
              <div
                className={`price-card ${p.name === "Growth" ? "featured" : ""}`}
                key={p.name}
              >
                {p.name === "Growth" && (
                  <span className="plan-ribbon">FOR A GROWING OPERATION</span>
                )}
                <h2>{p.name}</h2>
                <p>{p.summary}</p>
                <div className="plan-price">
                  €{priceFor(p)}
                  <span>/ month</span>
                </div>
                <span className="plan-annual">
                  {p.price
                    ? annual
                      ? `€${p.price * 12} subscription / year`
                      : "Billed monthly"
                    : "No subscription fee"}
                </span>
                <ExternalLink
                  href={links.register}
                  className={`button ${p.name === "Growth" ? "mint" : "outline"}`}
                >
                  {p.price ? "Choose " + p.name : "Start for free"}
                </ExternalLink>
                <div className="plan-volume">
                  Up to <strong>{p.limit.toLocaleString("en-GB")}</strong>{" "}
                  shipments / month
                  <small>€{p.label.toFixed(2)} per label, plus postage</small>
                </div>
                <ul>
                  {p.features.map((f) => (
                    <li key={f}>
                      <Check size={14} />
                      {f}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <p className="source-note">
            Reference prices from{" "}
            <a
              href="https://www.zineps.com/pricing"
              target="_blank"
              rel="noopener noreferrer"
            >
              Zineps’s official pricing page ↗
            </a>
            , checked 15 September 2026. Confirm current prices, taxes, limits
            and terms with Zineps before subscribing.
          </p>
          <div className="cost-estimator">
            <div>
              <span className="eyebrow section-eyebrow">
                A SIMPLE PLANNING TOOL
              </span>
              <h2>Find your starting point.</h2>
              <p>
                Estimate the subscription equivalent and label fees for your
                monthly volume. This is not a carrier quote.
              </p>
              <label htmlFor="volume">
                Estimated shipments per month{" "}
                <strong>{volume.toLocaleString("en-GB")}</strong>
              </label>
              <input
                id="volume"
                type="range"
                min="0"
                max="36000"
                step="50"
                value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
              />
              <div className="range-labels">
                <span>0</span>
                <span>36,000</span>
              </div>
              <label className="volume-input">
                Or enter a volume
                <input
                  type="number"
                  min="0"
                  max="1000000"
                  value={volume}
                  onChange={(e) =>
                    setVolume(
                      Math.max(
                        0,
                        Math.min(
                          1000000,
                          Math.floor(Number(e.target.value) || 0),
                        ),
                      ),
                    )
                  }
                />
              </label>
            </div>
            <div className="estimate-result" aria-live="polite">
              <span className="mono">LOWEST TIER THAT FITS YOUR VOLUME</span>
              <h3>
                {recommended
                  ? recommended.name
                  : "Let’s talk about your volume."}
              </h3>
              {recommended ? (
                <>
                  <div>
                    <span>Subscription / month equivalent</span>
                    <strong>€{priceFor(recommended).toFixed(2)}</strong>
                  </div>
                  <div>
                    <span>
                      {volume.toLocaleString("en-GB")} labels × €
                      {recommended.label.toFixed(2)}
                    </span>
                    <strong>€{(volume * recommended.label).toFixed(2)}</strong>
                  </div>
                  <div className="estimate-total">
                    <span>Estimated monthly equivalent</span>
                    <strong>
                      €
                      {(
                        priceFor(recommended) +
                        volume * recommended.label
                      ).toFixed(2)}
                    </strong>
                  </div>
                  <p>
                    Excludes postage and any applicable taxes or additional
                    charges. Subscription is billed{" "}
                    {annual ? "annually" : "monthly"}; feature needs may require
                    a higher plan.
                  </p>
                </>
              ) : (
                <p>
                  Above the published tier limits, ask Zineps for a tailored
                  proposal.
                </p>
              )}
              <a
                href={
                  recommended
                    ? "/contact?interest=shipping"
                    : "/contact?interest=enterprise"
                }
                className="text-link"
              >
                Discuss your requirements <ArrowRight size={17} />
              </a>
            </div>
          </div>
          <div className="comparison-heading">
            <span className="eyebrow section-eyebrow">
              THE DETAILS, SIDE BY SIDE
            </span>
            <h2>What’s included.</h2>
          </div>
          <div
            className="comparison-scroll"
            tabIndex={0}
            aria-label="Plan comparison, horizontally scrollable"
          >
            <table className="plan-comparison">
              <caption className="sr-only">
                Shipping plans and included limits
              </caption>
              <thead>
                <tr>
                  <th scope="col">Plan details</th>
                  {plans.map((p) => (
                    <th scope="col" key={p.name}>
                      {p.name}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  [
                    "Monthly shipments",
                    ...plans.map((p) => p.limit.toLocaleString("en-GB")),
                  ],
                  [
                    "Integrations",
                    ...plans.map((p) =>
                      p.integrations === Infinity
                        ? "Unlimited"
                        : p.integrations,
                    ),
                  ],
                  [
                    "Shipping rules",
                    ...plans.map((p) =>
                      p.rules === Infinity ? "Unlimited" : p.rules,
                    ),
                  ],
                  [
                    "Users",
                    ...plans.map((p) =>
                      p.users === Infinity ? "Unlimited" : p.users,
                    ),
                  ],
                  [
                    "Own carrier contracts",
                    "—",
                    "Included",
                    "Included",
                    "Included",
                    "Included",
                  ],
                  [
                    "Branded tracking & returns",
                    "—",
                    "Included",
                    "Included",
                    "Included",
                    "Included",
                  ],
                  [
                    "Analytics",
                    "—",
                    "—",
                    "Basic",
                    "Advanced AI",
                    "Advanced AI",
                  ],
                  ["Priority support / SLA", "—", "—", "—", "—", "Included"],
                ].map(([label, ...values]) => (
                  <tr key={label}>
                    <th scope="row">{label}</th>
                    {values.map((v, i) => (
                      <td key={i}>{v}</td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="directory-help">
            <div>
              <span className="eyebrow section-eyebrow">
                FOR LOGISTICS PARTNERS
              </span>
              <h3>
                A different business model?
                <br />
                Let’s build the right conversation.
              </h3>
              <p>
                Partner pricing is tailored to your network and operating needs.
              </p>
            </div>
            <a href="/contact?interest=partner" className="button dark">
              Talk partner pricing <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </section>
      <OutcomeStats />
      <FAQ />
    </>
  );
}

export function BlogPage() {
  const [q, setQ] = useState(""),
    [category, setCategory] = useState("All");
  const filtered = articles.filter(
    (a) =>
      (category === "All" || a.category === category) &&
      `${a.title} ${a.summary}`.toLowerCase().includes(q.toLowerCase()),
  );
  return (
    <>
      <PageIntro
        eyebrow="THE SHIPPING JOURNAL"
        title="Fresh perspective."
        accent="For the road ahead."
        description="Practical ideas for the people behind every parcel. Explore workflows, customer experience and the decisions that keep shipping moving."
      />
      <section className="journal-page">
        <div className="container">
          <div className="directory-toolbar">
            <label className="search-field">
              <Search size={19} />
              <input
                aria-label="Search articles"
                placeholder="Find a perspective…"
                value={q}
                onChange={(e) => setQ(e.target.value)}
              />
            </label>
            <div className="filter-pills" aria-label="Article category">
              {["All", ...new Set(articles.map((a) => a.category))].map((c) => (
                <button
                  key={c}
                  aria-pressed={category === c}
                  onClick={() => setCategory(c)}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
          <div className="results-line" role="status">
            {filtered.length} guides
            <span>Original educational content for this concept.</span>
          </div>
          <div className="article-grid">
            {filtered.map((a) => (
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
          {!filtered.length && (
            <div className="empty-results">
              <h3>No guides found.</h3>
              <button
                className="button dark"
                onClick={() => {
                  setQ("");
                  setCategory("All");
                }}
              >
                Show all guides
              </button>
            </div>
          )}
          <div className="directory-help">
            <div>
              <h3>Looking for company news?</h3>
              <p>
                Visit Zineps’s official blog for their latest articles and
                updates.
              </p>
            </div>
            <ExternalLink
              href="https://www.zineps.com/blog"
              className="button dark"
            >
              The official Zineps blog
            </ExternalLink>
          </div>
        </div>
      </section>
    </>
  );
}
export function ArticlePage({ slug }: { slug: string }) {
  const article = articles.find((a) => a.slug === slug);
  if (!article) return <NotFound />;
  return (
    <>
      <section className="article-intro">
        <div className="container">
          <a href="/blog" className="breadcrumb">
            Journal <ChevronRight size={12} /> {article.category}
          </a>
          <span className="eyebrow section-eyebrow">
            {article.category} · {article.read} read
          </span>
          <h1>{article.title}</h1>
          <p>{article.summary}</p>
          <span className="article-byline">
            Zineps redesign journal · Independent educational guide
          </span>
          <EditorialArt kind={article.art} />
        </div>
      </section>
      <section className="article-content container">
        <aside>
          <span className="mono">IN THIS GUIDE</span>
          <nav aria-label="Article contents">
            {article.sections.map(([title], i) => (
              <a href={`#section-${i}`} key={title}>
                {title}
              </a>
            ))}
          </nav>
          <a href="/shipping" className="text-link">
            Explore the platform <ArrowUpRight size={16} />
          </a>
        </aside>
        <div className="article-prose">
          {article.sections.map(([title, copy], i) => (
            <section key={title} id={`section-${i}`}>
              <span className="mono">0{i + 1}</span>
              <h2>{title}</h2>
              <p>{copy}</p>
            </section>
          ))}
          <div className="article-takeaway">
            <BookOpen size={25} />
            <h3>Put the idea into perspective.</h3>
            <p>
              Explore the local product demonstrations to see how connected
              orders, shipping rules and tracking can fit together.
            </p>
            <a href="/shipping#workspace" className="button dark">
              Try the workspace <ArrowRight size={17} />
            </a>
          </div>
          <p className="source-note">
            Original content created for this independent redesign. Product
            setup, service availability and commercial terms should be confirmed
            with Zineps. This is not official product documentation.
          </p>
        </div>
      </section>
      <JournalPreview />
    </>
  );
}
const helpTopics = [
  {
    title: "Connect your first store",
    icon: ShoppingBag,
    copy: "Find your commerce platform, review setup requirements and bring orders into your workflow.",
    href: "/integrations",
    category: "Getting started",
  },
  {
    title: "Understand shipping options",
    icon: Truck,
    copy: "See how cost, delivery speed and a balanced priority change a sample recommendation.",
    href: "/shipping-ai",
    category: "Shipping",
  },
  {
    title: "Create a shipping rule",
    icon: Zap,
    copy: "Learn how conditions translate into repeatable service choices.",
    href: "/blog/shipping-rules",
    category: "Automation",
  },
  {
    title: "Prepare labels and orders",
    icon: ScanLine,
    copy: "Explore the order queue and label preview in the local shipping workspace.",
    href: "/shipping#workspace",
    category: "Shipping",
  },
  {
    title: "Tracking and returns",
    icon: RotateCcw,
    copy: "Understand the customer journey after checkout and the value of clear updates.",
    href: "/blog/branded-tracking",
    category: "Customer experience",
  },
  {
    title: "Partner operations",
    icon: Users,
    copy: "Explore how services, customers and support fit into a shared workspace.",
    href: "/logistics-operating-system",
    category: "For partners",
  },
  {
    title: "Plans and usage",
    icon: BarChart3,
    copy: "Compare published plan limits and estimate subscription and label fees.",
    href: "/pricing",
    category: "Getting started",
  },
  {
    title: "Cross-border basics",
    icon: Globe2,
    copy: "A starting checklist for taking your workflow into a new destination.",
    href: "/blog/international-shipping",
    category: "Shipping",
  },
];
export function KnowledgePage() {
  const [q, setQ] = useState("");
  const shown = helpTopics.filter((t) =>
    `${t.title} ${t.copy} ${t.category}`
      .toLowerCase()
      .includes(q.toLowerCase()),
  );
  return (
    <>
      <PageIntro
        eyebrow="KNOWLEDGE BASE"
        title="A little guidance."
        accent="A lot more clarity."
        description="Find your starting point, understand the workflow and explore what comes next. These concept guides help you get oriented."
      >
        <label className="search-field help-search">
          <Search size={21} />
          <input
            aria-label="Search knowledge base"
            placeholder="What would you like to understand?"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </label>
      </PageIntro>
      <section className="section help-section">
        <div className="container">
          <div className="results-line" role="status">
            {shown.length} helpful starting points<span>Explore by topic</span>
          </div>
          <div className="help-grid">
            {shown.map(({ title, icon: Icon, copy, href, category }) => (
              <a href={href} className="help-card" key={title}>
                <Icon size={27} strokeWidth={1.5} />
                <span className="mono">{category}</span>
                <h2>{title}</h2>
                <p>{copy}</p>
                <ArrowUpRight size={20} />
              </a>
            ))}
          </div>
          {!shown.length && (
            <div className="empty-results">
              <h3>No matching topics.</h3>
              <button onClick={() => setQ("")} className="button dark">
                Show all topics
              </button>
            </div>
          )}
          <div className="official-help">
            <Code2 size={35} />
            <div>
              <h2>Need exact setup instructions?</h2>
              <p>
                Use the official Zineps knowledge base for account-specific
                configuration, help-centre resources and API information. These
                guides are not a replacement for official documentation.
              </p>
            </div>
            <ExternalLink
              href="https://www.zineps.com/knowledge-base"
              className="button dark"
            >
              Official knowledge base
            </ExternalLink>
          </div>
        </div>
      </section>
      <FAQ />
    </>
  );
}
export function ContactPage() {
  const initial = new URLSearchParams(location.search).get("interest");
  const [interest, setInterest] = useState(
    initial === "partner"
      ? "Logistics partnerships"
      : initial === "integration"
        ? "Integrations & API"
        : "Shipping software",
  );
  return (
    <>
      <PageIntro
        eyebrow="LET’S CONNECT"
        title="Your next move"
        accent="starts with a conversation."
        description="Whether you’re shipping your own orders or connecting a logistics network, find the right starting point with Zineps."
      />
      <section className="section contact-section">
        <div className="container contact-grid">
          <div>
            <span className="eyebrow section-eyebrow">
              WHAT BRINGS YOU HERE?
            </span>
            <div className="contact-options">
              {[
                "Shipping software",
                "Logistics partnerships",
                "Integrations & API",
              ].map((t, i) => {
                const Icon = [Package, Users, Code2][i];
                return (
                  <button
                    key={t}
                    aria-pressed={interest === t}
                    onClick={() => setInterest(t)}
                  >
                    <Icon size={25} />
                    <span>
                      {t}
                      <small>
                        {
                          [
                            "For merchants and growing brands",
                            "For carriers, brokers and logistics providers",
                            "For connecting your existing stack",
                          ][i]
                        }
                      </small>
                    </span>
                    <ArrowRight size={20} />
                  </button>
                );
              })}
            </div>
          </div>
          <div className="contact-panel" aria-live="polite">
            <span className="mono">LET’S TALK / {interest.toUpperCase()}</span>
            <h2>
              {interest === "Shipping software"
                ? "A calmer shipping day."
                : interest === "Logistics partnerships"
                  ? "A more connected network."
                  : "Make your tools work together."}
            </h2>
            <p>
              {interest === "Shipping software"
                ? "Tell the team about your sales channels, monthly shipment volume and existing carrier contracts."
                : interest === "Logistics partnerships"
                  ? "Discuss your service offering, customer groups, commercial model and onboarding needs."
                  : "Share the systems you use, the data you need to connect and the workflow you want to support."}
            </p>
            <h3>Useful things to bring</h3>
            <ul className="check-list">
              {(interest === "Shipping software"
                ? [
                    "Your store or marketplace platforms",
                    "Typical destinations and parcel types",
                    "Your current volume and carrier setup",
                  ]
                : interest === "Logistics partnerships"
                  ? [
                      "Your services and target customer groups",
                      "Existing carrier and contract relationships",
                      "Your operational and integration needs",
                    ]
                  : [
                      "Platform names and current account setup",
                      "The order and shipment data you need",
                      "Your technical requirements and timeline",
                    ]
              ).map((x) => (
                <li key={x}>
                  <Check size={17} />
                  {x}
                </li>
              ))}
            </ul>
            <ExternalLink href={links.contact} className="button dark">
              Contact the Zineps team
            </ExternalLink>
            <p className="source-note">
              You’ll continue to the official Zineps website. This concept does
              not collect personal details or send messages.
            </p>
          </div>
        </div>
      </section>
      <div className="container contact-alternatives">
        <a href="/pricing">
          <BarChart3 />
          <span>
            Comparing plans?<strong>Explore pricing</strong>
          </span>
          <ArrowUpRight />
        </a>
        <a href="/knowledge-base">
          <BookOpen />
          <span>
            Looking for guidance?<strong>Visit the knowledge base</strong>
          </span>
          <ArrowUpRight />
        </a>
      </div>
    </>
  );
}
export function NotFound() {
  return (
    <PageIntro
      eyebrow="404 / OFF THE ROUTE"
      title="This page took"
      accent="a different turn."
      description="The destination you’re looking for isn’t part of this site."
    >
      <a href="/" className="button dark">
        Back to the homepage <ArrowRight size={17} />
      </a>
    </PageIntro>
  );
}
