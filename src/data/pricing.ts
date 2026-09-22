/* ==========================================================================
   Plans as published on zineps.com/pricing, read September 2026.

   Listed prices are the annual-billing rate. Zineps states that annual
   billing saves 20%, so the monthly rate is derived from that and rounded to
   the euro. Postage is charged separately and is not modelled here.
   ========================================================================== */

export type Plan = {
  id: string;
  name: string;
  /** Euro per month when billed annually. */
  annual: number;
  /** Euro per label, on top of the plan. */
  label: number;
  /** Included shipments per month. */
  included: number;
  integrations: string;
  rules: string;
  users: string;
  summary: string;
  features: string[];
  popular?: boolean;
};

export const plans: Plan[] = [
  {
    id: "free",
    name: "Free",
    annual: 0,
    label: 0,
    included: 200,
    integrations: "2",
    rules: "4",
    users: "1",
    summary: "Enough to run a real shop, not a trial.",
    features: [
      "Partner shipping rates",
      "Labels and order management",
      "Self-serve support",
    ],
  },
  {
    id: "startup",
    name: "Start-up",
    annual: 20,
    label: 0.1,
    included: 500,
    integrations: "4",
    rules: "8",
    users: "2",
    summary: "Your own contracts, and the branded touches.",
    features: [
      "Your own carrier contracts",
      "Scan and Go",
      "Dynamic checkout",
      "Branded tracking, returns and packing slips",
      "Zineps API",
      "Email and phone support",
    ],
  },
  {
    id: "growth",
    name: "Growth",
    annual: 55,
    label: 0.09,
    included: 1500,
    integrations: "8",
    rules: "16",
    users: "4",
    summary: "Where most shops settle.",
    popular: true,
    features: [
      "Everything in Start-up",
      "Basic analytics",
      "More integrations and rules",
      "Four users",
    ],
  },
  {
    id: "scaleup",
    name: "Scale-up",
    annual: 127,
    label: 0.07,
    included: 12000,
    integrations: "16",
    rules: "32",
    users: "6",
    summary: "Analytics and delay prediction turned on.",
    features: [
      "Everything in Growth",
      "Advanced AI analytics",
      "AI delay prediction",
      "Support module on your own contract",
      "Order to WMS",
    ],
  },
  {
    id: "enterprise",
    name: "Enterprise",
    annual: 239,
    label: 0.06,
    included: 35000,
    integrations: "Unlimited",
    rules: "Unlimited",
    users: "Unlimited",
    summary: "No ceilings, and an SLA.",
    features: [
      "Everything in Scale-up",
      "Unlimited integrations, rules and users",
      "Return to WMS",
      "Priority support with an SLA",
    ],
  },
];

/** Annual billing saves 20%, so the monthly rate is the annual rate over 0.8. */
export const monthlyRate = (plan: Plan) => Math.round(plan.annual / 0.8);

export type CompareRow = { label: string; values: string[] };
export type CompareGroup = { group: string; rows: CompareRow[] };

/* Grouped rather than a flat run of sixteen rows. A long table with a
   hairline under every line is the hardest possible way to compare five
   things; clusters give the eye somewhere to rest. */
export const comparison: CompareGroup[] = [
  {
    group: "Limits",
    rows: [
      { label: "Integrations", values: ["2", "4", "8", "16", "Unlimited"] },
      {
        label: "Automation rules",
        values: ["4", "8", "16", "32", "Unlimited"],
      },
      { label: "Users", values: ["1", "2", "4", "6", "Unlimited"] },
      {
        label: "Shipments a month",
        values: ["200", "500", "1,500", "12,000", "35,000"],
      },
    ],
  },
  {
    group: "Rates and carriers",
    rows: [
      { label: "Partner shipping rates", values: ["y", "y", "y", "y", "y"] },
      {
        label: "Your own carrier contracts",
        values: ["n", "y", "y", "y", "y"],
      },
      { label: "Dynamic checkout", values: ["n", "y", "y", "y", "y"] },
      { label: "Scan and Go", values: ["n", "y", "y", "y", "y"] },
    ],
  },
  {
    group: "Your branding",
    rows: [
      { label: "Branded track and trace", values: ["n", "y", "y", "y", "y"] },
      { label: "Branded returns portal", values: ["n", "y", "y", "y", "y"] },
      { label: "Branded packing slips", values: ["n", "y", "y", "y", "y"] },
    ],
  },
  {
    group: "Intelligence",
    rows: [
      {
        label: "Analytics",
        values: ["n", "n", "Basic", "Advanced", "Advanced"],
      },
      { label: "AI delay prediction", values: ["n", "n", "n", "y", "y"] },
    ],
  },
  {
    group: "Systems and support",
    rows: [
      { label: "Zineps API", values: ["n", "y", "y", "y", "y"] },
      { label: "Order to WMS", values: ["n", "n", "n", "y", "y"] },
      { label: "Return to WMS", values: ["n", "n", "n", "n", "y"] },
      {
        label: "Support",
        values: [
          "Self-serve",
          "Email, phone",
          "Email, phone",
          "Email, phone",
          "Priority, SLA",
        ],
      },
    ],
  },
];

export const pricingFaq = [
  {
    q: "Is the free plan really free?",
    a: "Yes. Up to 200 shipments a month, at zero per label, with partner shipping rates included. No card. Postage is separate, as it is on every plan.",
  },
  {
    q: "What is the per-label fee?",
    a: "A small charge on top of the plan for each label you create, between 10 and 6 cents depending on the tier. It falls as you move up, which is why higher volumes cost less per shipment overall.",
  },
  {
    q: "Is postage included in these prices?",
    a: "No. The plan and the per-label fee cover the software. What you pay to actually move the parcel depends on the service you choose, whether it sits on a partner rate or your own contract, and where it is going.",
  },
  {
    q: "Can I switch plans later?",
    a: "Yes, up or down. The higher tiers are cheaper per shipment, so a shop crossing a volume threshold generally pays less in total after upgrading, not more.",
  },
  {
    q: "Are these prices excluding VAT?",
    a: "Prices are shown excluding VAT. What is added depends on your country and VAT status.",
  },
  {
    q: "What if none of these fit?",
    a: "Above Enterprise volume the platform pricing is shaped around your shipments, features, users, integrations and SLA, and Zineps still matches you with partners whose lanes suit your operation. Talk to sales.",
  },
];
