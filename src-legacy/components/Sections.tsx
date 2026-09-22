import { useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  Box,
  Check,
  CheckCheck,
  Globe2,
  Layers3,
  Minus,
  Plus,
  Settings2,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Users,
} from "lucide-react";
import { motion } from "motion/react";
import { integrations, links } from "../data/content";
import { ExternalLink, Logo } from "./ui";
import { FaqAnswer, TransitStatus } from "./ShippingDemo";
import { BrandLogo } from "./BrandLogo";

export function ProofBand() {
  const brands = ["Mate", "Monkey", "Trent", "The Tester", "101Kruiden"];
  return (
    <div className="proof-band trusted-band">
      <div className="container">
        <div className="trusted-heading">
          <p>Trusted by</p>
        </div>
        <div className="trusted-window" tabIndex={0} role="region" aria-label="Trusted brands">
          <div className="trusted-track">
            {[0, 1].map((copy) => (
              <div
                className="trusted-group"
                key={copy}
                aria-hidden={copy === 1 ? true : undefined}
              >
                {brands.map((name) => (
                  <BrandLogo name={name} key={name} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export function Audiences({
  partner,
  setPartner,
}: {
  partner: boolean;
  setPartner: (value: boolean) => void;
}) {
  const benefits = partner
    ? [
        "Manage rates, contracts and margins",
        "Organize customers and onboarding",
        "Connect invoicing and support",
        "Bring your merchants onto the platform",
      ]
    : [
        "Connect your stores and orders",
        "Compare services in one workspace",
        "Use partner rates or your own contracts",
        "Manage shipping labels and tracking",
      ];
  return (
    <section
      className="section audience-section"
      id="audiences"
      aria-labelledby="audience-title"
    >
      <div className="container">
        <div className="section-heading">
          <div>
            <div className="eyebrow section-eyebrow">
              <span>03 /</span> TWO SIDES. ONE PLATFORM.
            </div>
            <h2 id="audience-title">
              Built for both sides
              <br />
              <span className="muted-heading">of every shipment.</span>
            </h2>
          </div>
          <div
            className="segmented audience-toggle"
            role="group"
            aria-label="Your role"
          >
            <button aria-pressed={!partner} onClick={() => setPartner(false)}>
              <ShoppingBag size={16} /> I ship goods.
            </button>
            <button aria-pressed={partner} onClick={() => setPartner(true)}>
              <Truck size={16} /> I move goods.
            </button>
          </div>
        </div>
        <div className="audience-panel">
          <div className="audience-copy">
            <span className="mono audience-kicker">
              {partner
                ? "FOR LOGISTICS PARTNERS"
                : "FOR MERCHANTS & GROWING BRANDS"}
            </span>
            <h3>
              {partner ? (
                <>
                  Your network.
                  <br />
                  Your next chapter.
                </>
              ) : (
                <>
                  Big ambitions.
                  <br />
                  Simpler shipping.
                </>
              )}
            </h3>
            <p>
              {partner
                ? "Keep the relationships. Connect the operations. Give your logistics business one place to work."
                : "Bring your orders, options and deliveries together. Make room for the business you’re building."}
            </p>
            <ul>
              {benefits.map((b) => (
                <li key={b}>
                  <Check size={15} />
                  {b}
                </li>
              ))}
            </ul>
            <a
              href={partner ? "/logistics-operating-system" : "/shipping"}
              className="button dark"
            >
              {partner
                ? "Explore the partner platform"
                : "Explore shipping software"}
            </a>
          </div>
          <motion.div
            key={String(partner)}
            initial={{ opacity: 1, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="audience-workspace"
          >
            <div className="audience-app-header">
              <span>
                <Layers3 size={17} />{" "}
                {partner ? "Partner operations" : "My shipping workspace"}
              </span>
              <span className="avatar">{partner ? "NP" : "SS"}</span>
            </div>
            <div className="audience-app-body">
              <div className="app-title">
                <div>
                  <span className="mono">
                    {partner ? "NORTHLINE PARTNERS" : "SAMPLE STUDIO"} / DEMO
                  </span>
                  <h4>
                    {partner
                      ? "Your network, connected."
                      : "Ready for the next delivery."}
                  </h4>
                </div>
                <span className="app-icon">
                  {partner ? <Users size={20} /> : <Box size={20} />}
                </span>
              </div>
              <div className="app-stat-row">
                <div>
                  <span>{partner ? "Customer groups" : "Ready to ship"}</span>
                  <strong>
                    {partner ? "03" : "08"}
                    <span>{partner ? "Organized" : "Orders"}</span>
                  </strong>
                </div>
                <div>
                  <span>{partner ? "Published services" : "In transit"}</span>
                  <strong>
                    {partner ? "12" : "16"}
                    <span>{partner ? "Available" : "Shipments"}</span>
                  </strong>
                </div>
                <div>
                  <span>{partner ? "Open invoices" : "Delivered"}</span>
                  <strong>
                    {partner ? "04" : "24"}
                    <span>{partner ? "To review" : "This week"}</span>
                  </strong>
                </div>
              </div>
              <div className="app-list-heading">
                <strong>
                  {partner ? "Customer overview" : "Recent shipments"}
                </strong>
                <span>Sample records</span>
              </div>
              <div className="app-records">
                {(partner
                  ? ["Sample Studio", "Example Supply", "Demo Collective"]
                  : ["#DEMO-0042", "#DEMO-0041", "#DEMO-0040"]
                ).map((name, i) => (
                  <div className="app-record" key={name}>
                    <span className="record-icon">
                      {partner ? <Users size={16} /> : <Box size={16} />}
                    </span>
                    <div>
                      <strong>{name}</strong>
                      <span>
                        {partner
                          ? [
                              "Standard group",
                              "Wholesale group",
                              "Retail group",
                            ][i]
                          : [
                              "Amsterdam → Berlin",
                              "Paris → Brussels",
                              "Berlin → Vienna",
                            ][i]}
                      </span>
                    </div>
                    {partner ? (
                      <span className="record-status">
                        <Check size={11} /> Active
                      </span>
                    ) : i === 1 ? (
                      <TransitStatus />
                    ) : (
                      <span className="record-status">
                        <Check size={11} /> {i === 0 ? "Ready" : "Delivered"}
                      </span>
                    )}
                  </div>
                ))}
              </div>
              <div className="app-note">
                <ShieldCheck size={13} />{" "}
                {partner
                  ? "Your customers. Your commercial relationship."
                  : "Your contracts and partner rates, side by side."}
              </div>
            </div>
            <div className="app-demo-label mono">
              ILLUSTRATIVE WORKSPACE · FICTIONAL RECORDS
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export function Integrations() {
  const [filter, setFilter] = useState("All");
  const [active, setActive] = useState<string | null>(null);
  const groups = ["Commerce", "Carriers"];
  const selected = integrations.find((i) => i.name === active);
  return (
    <section
      className="section integrations-section"
      id="integrations"
      aria-labelledby="integrations-title"
    >
      <div className="container integration-layout">
        <div className="integration-copy">
          <div className="eyebrow section-eyebrow">
            <span>04 /</span> MADE TO CONNECT
          </div>
          <h2 id="integrations-title">
            Your stack.
            <br />
            <span className="muted-heading">Already connected.</span>
          </h2>
          <p>
            Keep the tools you know. Connect the stores, marketplaces and
            carriers that move your business.
          </p>
          <div
            className="segmented integration-filters"
            role="group"
            aria-label="Filter integrations"
          >
            {["All", ...groups].map((f) => (
              <button
                key={f}
                aria-pressed={filter === f}
                onClick={() => {
                  setFilter(f);
                  setActive(null);
                }}
              >
                {f}
              </button>
            ))}
          </div>
          <a href="/integrations" className="text-link">
            Browse integrations
          </a>
        </div>
        <div className={`integration-network filter-${filter.toLowerCase()}`}>
          <div className="network-diagram">
            <div className="network-hub">
              <Logo />
              <span className="mono">ONE CONNECTED PLATFORM</span>
            </div>
            {groups.map((group) => (
              <div
                key={group}
                className={`integration-group group-${group.toLowerCase()}`}
                hidden={filter !== "All" && filter !== group}
              >
                <span className="mono">
                  {group === "Commerce" ? "YOUR STORES" : "YOUR CARRIERS"}
                </span>
                {integrations
                  .filter((i) => i.category === group)
                  .map((integration) => (
                    <button
                      key={integration.name}
                      className={`integration-tile ${active === integration.name ? "active" : ""}`}
                      aria-pressed={active === integration.name}
                      onClick={() => setActive(integration.name)}
                      onFocus={() => setActive(integration.name)}
                    >
                      <BrandLogo name={integration.name} />
                      <ArrowUpRight size={14} />
                    </button>
                  ))}
              </div>
            ))}
          </div>
          <div className="integration-detail" role="status" aria-live="polite">
            <span className="status-dot" />
            <span>
              {selected
                ? `${selected.name} — ${selected.detail}`
                : "Select an integration to explore the connection."}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Reassurance() {
  return (
    <div className="reassurance">
      <div className="container">
        <div>
          <Globe2 size={25} strokeWidth={1.4} />
          <div>
            <h3>Beyond borders.</h3>
            <p>A connected international carrier network.</p>
          </div>
        </div>
        <div>
          <Layers3 size={25} strokeWidth={1.4} />
          <div>
            <h3>Built to connect.</h3>
            <p>Your stores and shipping in one workflow.</p>
          </div>
        </div>
        <div>
          <Settings2 size={25} strokeWidth={1.4} />
          <div>
            <h3>On your terms.</h3>
            <p>Partner rates, your own contracts, or both.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const faqs = [
  [
    "What is Zineps?",
    "Zineps connects businesses that ship with logistics providers. Its platform brings store orders, shipping options, labels and tracking into a connected workflow.",
  ],
  [
    "Can I use my own shipping contracts?",
    "Yes. You can connect your existing shipping contracts, use rates from Zineps’s logistics partners, or combine both in the same platform.",
  ],
  [
    "Which platforms can I connect?",
    "Zineps lists integrations with Shopify, WooCommerce, Amazon and other commerce platforms, alongside carriers including DHL, PostNL, DPD and UPS. Check the official integration directory for the current options and setup details.",
  ],
  [
    "Is this for merchants or logistics providers?",
    "Both. Merchants manage their shipping workflow; logistics providers manage services, rates, contracts, customers and operations through the partner platform.",
  ],
  [
    "How do I get started?",
    "Use “Start Shipping” to visit Zineps’s official registration page. If you’re a logistics provider or want to discuss your needs first, use “Talk to Zineps” to contact their team. This independent concept does not create accounts or book shipments.",
  ],
];
export function FAQ() {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <section className="section faq-section" aria-labelledby="faq-title">
      <div className="container faq-layout">
        <div>
          <div className="eyebrow section-eyebrow">
            <span>05 /</span> A LITTLE MORE CLARITY
          </div>
          <h2 id="faq-title">
            Good questions.
            <br />
            <span className="muted-heading">Clear answers.</span>
          </h2>
          <p>Something else on your mind?</p>
          <ExternalLink href={links.contact} className="text-link">
            Talk to the Zineps team
          </ExternalLink>
        </div>
        <div className="faq-list">
          {faqs.map(([q, a], i) => (
            <div className={`faq-item ${open === i ? "open" : ""}`} key={q}>
              <h3>
                <button
                  aria-expanded={open === i}
                  aria-controls={`faq-answer-${i}`}
                  id={`faq-question-${i}`}
                  onClick={() => setOpen(open === i ? null : i)}
                >
                  <span className="mono">0{i + 1}</span>
                  <span>{q}</span>
                  {open === i ? <Minus size={17} /> : <Plus size={17} />}
                </button>
              </h3>
              <div id={`faq-answer-${i}`} aria-labelledby={`faq-question-${i}`}>
                <FaqAnswer open={open === i}>
                  <p>{a}</p>
                  {i === 2 && (
                    <ExternalLink
                      href={links.integrations}
                      className="text-link"
                    >
                      Official integration directory
                    </ExternalLink>
                  )}
                </FaqAnswer>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Closing() {
  return (
    <>
      <section className="closing">
        <div className="container">
          <div className="eyebrow">
            <span className="status-dot" /> THE NEXT MOVE IS YOURS
          </div>
          <div className="closing-grid">
            <div>
              <h2>
                Make your next move
                <br />
                <span>a smarter one.</span>
              </h2>
              <p>Connect your shipping. Find your way forward.</p>
              <div className="closing-buttons">
                <ExternalLink href={links.register} className="button mint">
                  Start Shipping
                </ExternalLink>
                <ExternalLink
                  href={links.contact}
                  className="button closing-secondary"
                >
                  Talk to Zineps
                </ExternalLink>
              </div>
            </div>
            <div
              className="arrival-graphic"
              aria-label="A shipment arrives at its destination"
            >
              <svg viewBox="0 0 360 210" aria-hidden="true">
                <path
                  d="M0 165H80Q135 165 135 110V90Q135 40 185 40H300"
                  fill="none"
                  stroke="#314a3b"
                  strokeWidth="1"
                />
                <path
                  d="M0 165H80Q135 165 135 110V90Q135 40 185 40H300"
                  fill="none"
                  stroke="#9de8ca"
                  strokeWidth="1.5"
                  strokeDasharray="3 5"
                />
                <circle
                  cx="300"
                  cy="40"
                  r="35"
                  fill="#1c3526"
                  stroke="#3d654b"
                />
                <circle cx="300" cy="40" r="23" fill="#9de8ca" />
                <path
                  d="m289 40 7 7 14-14"
                  fill="none"
                  stroke="#17241f"
                  strokeWidth="2"
                />
              </svg>
              <span className="mono">
                <CheckCheck size={14} /> A CLEARER WAY. ALL THE WAY.
              </span>
            </div>
          </div>
        </div>
      </section>
      <footer className="footer">
        <div className="container">
          <div className="footer-main">
            <div>
              <a href="/" aria-label="Zineps home">
                <Logo />
              </a>
              <p>
                The intelligence between
                <br />
                order and arrival.
              </p>
            </div>
            <nav aria-label="Footer platform links">
              <span className="mono">PLATFORM</span>
              <a href="/shipping">Shipping software</a>
              <a href="/shipping-ai">Shipping intelligence</a>
              <a href="/logistics-operating-system">For logistics partners</a>
              <a href="/integrations">Integrations</a>
              <a href="/pricing">Pricing</a>
            </nav>
            <nav aria-label="Footer company links">
              <span className="mono">GO FURTHER</span>
              <a href="/blog">The shipping journal</a>
              <a href="/knowledge-base">Knowledge base</a>
              <a href="/contact">Contact Zineps</a>
              <ExternalLink href={links.official} className="footer-link">
                Official website
              </ExternalLink>
            </nav>
            <a className="back-top" href="#top" aria-label="Back to top">
              <ArrowRight size={22} />
            </a>
          </div>
          <div className="footer-bottom">
            <p>
              Independent redesign concept. Not the official Zineps website.
            </p>
            <span className="mono">DESIGNED AROUND THE JOURNEY.</span>
          </div>
        </div>
      </footer>
    </>
  );
}
