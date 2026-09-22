import { PageIntro } from "../components/PageIntro";
import { CapabilityList, SplitFeature } from "../components/blocks";
import { RuleBuilder } from "../components/RuleBuilder";
import { Surface } from "../components/Surface";
import { Workflow } from "../components/home/Workflow";
import { Faq } from "../components/Faq";
import { Closing } from "../components/Closing";

const capabilities = [
  {
    name: "Branded returns portal",
    body: "Customers register a return on a page in your own styling, and the return label reaches them without anyone opening a ticket.",
  },
  {
    name: "Branded packing slips",
    body: "Your logo and layout on the slip in the box, generated from the order rather than pasted in afterwards.",
  },
  {
    name: "Branded track and trace",
    body: "Tracking pages and delivery emails that look like the shop the customer bought from, not like a carrier.",
  },
  {
    name: "Address validation",
    body: "Bad addresses get caught before a label is bought, which is the cheapest moment to catch them.",
  },
  {
    name: "Scan and Go",
    body: "Scan the barcode and the system does the rest. Picking and processing stop being a search through screens.",
  },
  {
    name: "Order status",
    body: "Where every order stands, including what is waiting on you and what is waiting on a carrier.",
  },
  {
    name: "Dynamic checkout",
    body: "Let the buyer choose at checkout: standard, same-day, or a collection point near them.",
  },
  {
    name: "Customs paperwork",
    body: "Commercial invoices and customs data prepared with the label for anything crossing a border.",
  },
];

const faq = [
  {
    q: "Do I have to move all my stores at once?",
    a: "No. Connect one channel, run it alongside whatever you do now, and add the rest when you are satisfied. Orders from connected channels land in the same queue either way.",
  },
  {
    q: "What happens to my existing carrier contracts?",
    a: "They keep working. Connect them from the Start-up plan and they sit next to partner rates in the same comparison. A rule can prefer yours, prefer the partner, or just take whichever is cheaper.",
  },
  {
    q: "Can I print to a thermal label printer?",
    a: "Yes. Labels come out as PDF for a desktop printer or ZPL straight to a thermal printer.",
  },
  {
    q: "How do returns work?",
    a: "The customer registers the return on your branded portal, gets a return label, and the return shows up in the same workspace as the outbound shipment. Higher plans can push it into your WMS.",
  },
  {
    q: "Is there a limit on how many orders I can process?",
    a: "Each plan includes a monthly shipment volume, from 200 on the free plan to 35,000 on Enterprise, and there is custom pricing above that.",
  },
];

export default function Shipping() {
  return (
    <>
      <PageIntro
        eyebrow="Shipping software"
        title={["Your shipping desk,", "minus the desk."]}
        lead="Orders arrive by themselves, rules pick the service, labels come out ready to print, and the customer gets tracking that looks like it came from you. What is left is the packing."
        actions={
          <>
            <a href="/pricing" className="btn btn-primary btn-lg">
              Start shipping
            </a>
            <a href="/integrations" className="btn btn-ghost btn-lg">
              See what it connects to
            </a>
          </>
        }
      />

      <Workflow />

      <SplitFeature
        tinted
        title={["Write the rule once.", "Stop making the decision."]}
        body="Most shipping decisions are the same decision, made again. Set the condition and the service, and every matching order routes itself from then on."
        points={[
          "Conditions on destination, weight, value, product group or channel",
          "Rules can prefer your own contract or the partner network",
          "Anything that matches nothing falls through to a default",
        ]}
        action={
          <a href="/pricing" className="btn btn-primary">
            Start shipping
          </a>
        }
        visual={<RuleBuilder />}
      />

      <CapabilityList
        title={["Everything else the", "job actually involves."]}
        lead="The parts of shipping that nobody puts on a homepage, and that everybody deals with on a Tuesday afternoon."
        items={capabilities}
      />

      <SplitFeature
        flip
        title={["The border is paperwork,", "not distance."]}
        body="Customs documents, VAT treatment and import restrictions are where cross-border orders actually go wrong. Zineps prepares the paperwork with the label and flags the shipments likely to be held."
        points={[
          "Commercial invoice and customs data generated from the order",
          "Restricted and prohibited goods flagged before dispatch",
          "Duty and VAT treatment surfaced at the point of choosing a service",
          "Tracking that carries on working past the border",
        ]}
        action={
          <a href="/shipping-ai" className="link link-accent">
            How Shipping AI scores the risk
          </a>
        }
        visual={
          <div className="customs">
            <Surface className="customs-shell">
              <div className="customs-core">
                <div className="customs-head">
                  <span className="mono">CN23 · COMMERCIAL INVOICE</span>
                  <span className="tag tag-accent">Ready</span>
                </div>
                <dl className="customs-rows">
                  {[
                    ["Contents", "Textile goods, 3 items"],
                    ["HS code", "6109.10"],
                    ["Declared value", "EUR 84.00"],
                    ["Origin", "Netherlands"],
                    ["Incoterm", "DAP"],
                    ["VAT treatment", "IOSS, collected at checkout"],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
                <p className="customs-note">
                  Prepared from the order. Nothing retyped.
                </p>
              </div>
            </Surface>
            <p className="console-note">
              Example document. Requirements vary by destination and goods.
            </p>
          </div>
        }
      />

      <Faq items={faq} heading="Before you move your shipping" />
      <Closing
        title="Print your first label this afternoon."
        body="Connect a store, confirm your sender address, and go. The free plan covers 200 shipments a month with no per-label fee."
      />
    </>
  );
}
