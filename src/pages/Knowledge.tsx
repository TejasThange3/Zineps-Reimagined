import { useState } from "react";
import { optical } from "../lib/optical";
import { PageIntro } from "../components/PageIntro";
import { Closing } from "../components/Closing";
import { Reveal } from "../components/Reveal";
import { Surface } from "../components/Surface";
import { Segmented } from "../components/Segmented";

/**
 * Knowledge base.
 *
 * Each area gets a small diagram of the thing it covers, built from the same
 * geometry as the rest of the site, so the index is scannable by shape before
 * it is read.
 */

type Section = {
  id: string;
  title: string;
  group: "Setup" | "Running it" | "Building on it";
  blurb: string;
  items: string[];
  art: React.ReactNode;
};

const box = (x: number, y: number, w: number, h: number, on = false) => (
  <rect
    x={x}
    y={y}
    width={w}
    height={h}
    rx="3"
    className={on ? "kb-on" : "kb-off"}
  />
);

const sections: Section[] = [
  {
    id: "start",
    title: "Getting started",
    group: "Setup",
    blurb: "Account, sender address, first connection, first label.",
    items: [
      "Create an account and confirm your sender address",
      "Connect your first store or marketplace",
      "Choose between partner rates and your own contracts",
      "Print a test label and check your printer setup",
    ],
    art: (
      <svg viewBox="0 0 120 64" aria-hidden="true">
        {[0, 1, 2, 3].map((i) => (
          <g key={i}>
            <circle
              className={i < 3 ? "kb-node-on" : "kb-node"}
              cx={18 + i * 28}
              cy="32"
              r="5"
            />
            {i < 3 ? (
              <path
                className={i < 2 ? "kb-link-on" : "kb-link"}
                d={`M${23 + i * 28} 32 H${41 + i * 28}`}
              />
            ) : null}
          </g>
        ))}
      </svg>
    ),
  },
  {
    id: "orders",
    title: "Orders and labels",
    group: "Running it",
    blurb: "Importing, bulk printing, Scan and Go, corrections.",
    items: [
      "How orders are imported and how often they sync",
      "Bulk label creation for high-volume days",
      "Scan and Go: barcode picking and processing",
      "Reprinting, voiding and correcting a label",
    ],
    art: (
      <svg viewBox="0 0 120 64" aria-hidden="true">
        {Array.from({ length: 14 }, (_, i) => (
          <rect
            key={i}
            className={i % 3 === 0 ? "kb-on" : "kb-off"}
            x={16 + i * 6}
            y={16 + (i % 3) * 2}
            width={i % 4 === 0 ? 3 : 1.6}
            height={32 - (i % 3) * 4}
            rx="0.8"
          />
        ))}
      </svg>
    ),
  },
  {
    id: "rules",
    title: "Automation rules",
    group: "Running it",
    blurb: "Conditions, ordering, defaults, testing before you switch on.",
    items: [
      "Conditions, comparisons and the order rules are evaluated in",
      "Setting a default service for orders that match nothing",
      "Preferring your own contract over a partner rate, or the reverse",
      "Testing a rule against past orders before you switch it on",
    ],
    art: (
      <svg viewBox="0 0 120 64" aria-hidden="true">
        <path className="kb-link" d="M14 32 H44" />
        <path className="kb-link-on" d="M44 32 C60 32 60 14 76 14" />
        <path className="kb-link" d="M44 32 C60 32 60 32 76 32" />
        <path className="kb-link" d="M44 32 C60 32 60 50 76 50" />
        <circle className="kb-node-on" cx="44" cy="32" r="4" />
        {box(78, 8, 28, 12, true)}
        {box(78, 26, 22, 12)}
        {box(78, 44, 18, 12)}
      </svg>
    ),
  },
  {
    id: "returns",
    title: "Returns and tracking",
    group: "Running it",
    blurb: "Branded portal, approval rules, notifications, WMS handoff.",
    items: [
      "Configuring the branded returns portal",
      "Automatic approval rules and the manual review queue",
      "Branded track and trace pages and notification emails",
      "Pushing returns into your WMS",
    ],
    art: (
      <svg viewBox="0 0 120 64" aria-hidden="true">
        <path className="kb-link-on" d="M20 22 C48 6 72 6 100 22" />
        <path className="kb-link kb-dash" d="M100 42 C72 58 48 58 20 42" />
        {box(12, 16, 12, 12, true)}
        {box(96, 36, 12, 12)}
      </svg>
    ),
  },
  {
    id: "cross-border",
    title: "Cross-border",
    group: "Running it",
    blurb: "Customs data, incoterms, VAT, and what to do with a hold.",
    items: [
      "Customs data, HS codes and commercial invoices",
      "Choosing an incoterm and what it means for your customer",
      "IOSS and VAT handling for EU destinations",
      "What to do when a shipment is held",
    ],
    art: (
      <svg viewBox="0 0 120 64" aria-hidden="true">
        <rect className="kb-doc" x="34" y="8" width="52" height="48" rx="4" />
        <path className="kb-link" d="M42 22 H78" />
        {box(42, 30, 26, 4, true)}
        {box(42, 40, 34, 4)}
        <path className="kb-dash-v" d="M60 4 V60" />
      </svg>
    ),
  },
  {
    id: "api",
    title: "API reference",
    group: "Building on it",
    blurb: "Auth, rates, labels, webhooks, limits and error codes.",
    items: [
      "Authentication and API keys",
      "Quoting rates for a shipment",
      "Creating a shipment and fetching a label as PDF or ZPL",
      "Tracking webhooks and the shared event schema",
      "Rate limits, idempotency and error codes",
    ],
    art: (
      <svg viewBox="0 0 120 64" aria-hidden="true">
        {box(16, 12, 30, 5, true)}
        {box(16, 22, 46, 5)}
        {box(24, 32, 38, 5)}
        {box(24, 42, 26, 5)}
        <path className="kb-link-on" d="M70 30 H96" />
        <path className="kb-link-on" d="M88 24 L96 30 L88 36" />
      </svg>
    ),
  },
];

const groups = ["All", "Setup", "Running it", "Building on it"] as const;

export default function Knowledge() {
  const [group, setGroup] = useState<string>("All");
  const shown =
    group === "All" ? sections : sections.filter((s) => s.group === group);

  return (
    <>
      <PageIntro
        title={["How it works, written down."]}
        lead="Setup, rules, returns, customs and the API. The reference material for people who would rather read than open a ticket."
        actions={
          <Segmented
            name="Area"
            value={group}
            options={groups.map((g) => ({ value: g, label: g }))}
            onChange={setGroup}
          />
        }
      />

      <section className="section kb">
        <div className="shell shell-wide">
          <ul className="kb-grid">
            {shown.map((section, i) => (
              <Reveal as="li" key={section.id} index={i % 3} shift={16}>
                <Surface className="kb-card">
                  <div className="kb-art">{section.art}</div>
                  <div className="kb-body">
                    <p className="jrn-meta mono">{section.group}</p>
                    <h2 id={section.id} style={optical(section.title)}>
                      {section.title}
                    </h2>
                    <p className="kb-blurb">{section.blurb}</p>
                    <ul>
                      {section.items.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </Surface>
              </Reveal>
            ))}
          </ul>

          <p className="plans-note">
            This concept lists the topics a Zineps knowledge base covers. The
            live articles are on{" "}
            <a
              className="link link-static"
              href="https://www.zineps.com/knowledge-base"
              target="_blank"
              rel="noreferrer"
            >
              zineps.com
            </a>
            .
          </p>
        </div>
      </section>

      <Closing
        title="Or skip the reading and print a label."
        body="Most of the setup takes minutes. The documentation is there for the parts that do not."
      />
    </>
  );
}
