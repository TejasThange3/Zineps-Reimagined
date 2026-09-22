export const directory = [
  ...[
    "Shopify",
    "WooCommerce",
    "Lightspeed",
    "PrestaShop",
    "Magento",
    "MijnWebwinkel",
    "CCV Shop",
    "Wix",
  ].map((name) => ({
    name,
    category: "Webshops",
    detail:
      "Bring store orders into one shipping workflow, then prepare labels and follow delivery from the same workspace.",
  })),
  ...["Bol", "Amazon NL", "Kaufland", "Mirakl", "Temu"].map((name) => ({
    name,
    category: "Marketplaces",
    detail:
      "Bring marketplace fulfilment into the same workspace as your other sales channels. Review channel-specific setup requirements before connecting.",
  })),
  ...[
    "Picqer",
    "GoedGepickt",
    "Odoo",
    "Exact Online",
    "ChannelDock",
    "StockitUP",
    "Lyra WMS",
    "Microsoft Dynamics",
    "SnelStart",
    "Moneybird",
  ].map((name) => ({
    name,
    category: "ERP & WMS",
    detail:
      "Connect your operational stack to shipping. The available data flows and configuration depend on the integration; confirm the setup with Zineps.",
  })),
  ...[
    "DHL",
    "PostNL",
    "DPD",
    "UPS",
    "GLS",
    "FedEx",
    "Bpost",
    "Correos",
    "DB Schenker",
  ].map((name) => ({
    name,
    category: "Carriers",
    detail:
      "Bring carrier services into your shipping workflow. Availability, destinations, rates and contract requirements vary by service and account.",
  })),
];
export const plans = [
  {
    name: "Free",
    price: 0,
    monthlyPrice: 0,
    label: 0,
    limit: 200,
    integrations: 2,
    rules: 4,
    users: 1,
    summary: "Find your shipping rhythm.",
    features: [
      "Partner shipping rates",
      "Labels and order management",
      "Self-service support",
    ],
  },
  {
    name: "Start-up",
    price: 20,
    monthlyPrice: 25,
    label: 0.1,
    limit: 500,
    integrations: 4,
    rules: 8,
    users: 2,
    summary: "Make the everyday automatic.",
    features: [
      "Your own carrier contracts",
      "Branded tracking and returns",
      "Scan & Go and dynamic checkout",
    ],
  },
  {
    name: "Growth",
    price: 55,
    monthlyPrice: 69,
    label: 0.09,
    limit: 1500,
    integrations: 8,
    rules: 16,
    users: 4,
    summary: "More channels. Less friction.",
    features: [
      "Everything in Start-up",
      "Basic analytics",
      "More integrations and rules",
    ],
  },
  {
    name: "Scale-up",
    price: 127,
    monthlyPrice: 159,
    label: 0.07,
    limit: 12000,
    integrations: 16,
    rules: 32,
    users: 6,
    summary: "Give complex operations clarity.",
    features: [
      "Advanced AI analytics",
      "Delay prediction and support",
      "Order management / WMS",
    ],
  },
  {
    name: "Enterprise",
    price: 239,
    monthlyPrice: 299,
    label: 0.06,
    limit: 35000,
    integrations: Infinity,
    rules: Infinity,
    users: Infinity,
    summary: "Room for your next chapter.",
    features: [
      "Unlimited integrations and users",
      "Order and returns WMS",
      "Priority support with SLA",
    ],
  },
];
export const articles = [
  {
    slug: "shipping-workflow",
    category: "Operations",
    title: "A better shipping day starts before the first label.",
    summary:
      "A practical order-to-arrival workflow that makes exceptions visible and routine work repeatable.",
    read: "5 min",
    art: "workflow",
    sections: [
      [
        "Start with complete orders",
        "A carrier choice is only as useful as the information behind it. Put orders from your selling channels into a shared queue, and review addresses, parcel weights and product information before generating a label. An incomplete order should be easy to spot, not buried among ready-to-ship work.",
      ],
      [
        "Separate routine work from exceptions",
        "Define a small number of conditions your team can explain: destination country, parcel weight or service requirement. Automate the predictable choices, and leave unusual shipments for review. A fragile product or a missing address needs a different path from an ordinary domestic parcel.",
      ],
      [
        "Make the packing station a checkpoint",
        "Match the items to the order before printing. Check the final package size, because packaging changes can affect the shipping service or price. Keep the label and packing slip together with the correct parcel, and use a scan-based check where your setup supports it.",
      ],
      [
        "Keep delivery in the workflow",
        "Printing is not the end of fulfilment. Follow carrier handover, transit and delivery events. Define who reviews delayed or exceptional shipments and when a customer should receive an update. The handoff between warehouse and support deserves the same care as the handoff to the carrier.",
      ],
      [
        "Try it in the concept",
        "Open the shipping software page and switch between the order queue, automation rule and tracking example. These local demonstrations show the relationships between the steps; they do not connect a real store or create a carrier label.",
      ],
    ],
  },
  {
    slug: "shipping-rules",
    category: "Automation",
    title: "Small rules. A much calmer operation.",
    summary:
      "How to turn repeatable shipping decisions into understandable automation.",
    read: "4 min",
    art: "rules",
    sections: [
      [
        "Choose a repeatable decision",
        "Start with a frequent shipment pattern rather than trying to automate every order. A rule for domestic parcels below a chosen weight is easier to review than a large collection of overlapping exceptions. Write down the intended outcome before configuring the condition.",
      ],
      [
        "Be precise about the condition",
        "Distinguish between destination, weight, dimensions and product attributes. A parcel being light does not mean it is small. Decide how missing information should be handled: it is usually better to flag an order for review than to silently assume a value.",
      ],
      [
        "Test the boundary",
        "Test an order below the threshold, exactly at it and above it. Include a different destination and incomplete input. A good rule behaves predictably on the edge cases, not only on the example you used to create it.",
      ],
      [
        "Review rules as operations change",
        "Carrier services, product ranges and packaging can change. Give rules clear names and an owner, and periodically check whether they still reflect the workflow. Keep an explanation of the selected service visible to the person handling the parcel.",
      ],
    ],
  },
  {
    slug: "shipping-costs",
    category: "Shipping strategy",
    title: "The quote is only one part of the shipping cost.",
    summary:
      "Look beyond the headline rate: packaging, service conditions and returns belong in the decision too.",
    read: "5 min",
    art: "parcel",
    sections: [
      [
        "Compare like with like",
        "Start with the same origin, destination, package and delivery requirement. A low headline rate is not a complete comparison if one option excludes a service you need. Check the applicable carrier conditions and any surcharges in your actual contract or current quote.",
      ],
      [
        "Measure the package you send",
        "The final packed parcel may be larger than the product itself. Record the outside dimensions and actual weight. Some services consider dimensional weight; the divisor, rounding and charging rules depend on the carrier and service, so do not apply one universal formula to every quote.",
      ],
      [
        "Include the operational work",
        "Manual corrections, relabelling and unsuccessful deliveries consume time. Reliable order data and appropriate packaging can make the workflow more predictable. Treat these as operational considerations, not guaranteed savings percentages.",
      ],
      [
        "Make the trade-off explicit",
        "If the customer needs a faster service, a higher quote may be the appropriate choice. If there is no urgency, a slower option may be sufficient. The Shipping AI concept lets you compare cost, speed and a transparent balanced score with fictional examples.",
      ],
    ],
  },
  {
    slug: "branded-tracking",
    category: "Customer experience",
    title: "After checkout, clarity becomes part of your brand.",
    summary:
      "Use tracking and return instructions to keep customers informed after the purchase.",
    read: "4 min",
    art: "tracking",
    sections: [
      [
        "Answer the next question",
        "A useful tracking experience tells a customer what has happened, what is expected next and where to get help. A label-created event is different from a parcel being handed to the carrier. Avoid language that suggests movement before a carrier scan confirms it.",
      ],
      [
        "Be honest about the estimate",
        "Delivery windows are estimates unless the specific service promises otherwise. Keep the latest carrier event visible and make an exception understandable. Reassuring copy should not hide uncertainty or suggest that a delayed parcel is on schedule.",
      ],
      [
        "Keep the return journey readable",
        "Explain how a customer starts a return, what information is needed and what happens after the parcel arrives back. State the actual merchant policy rather than assuming all orders qualify. Make support easy to find when the standard route does not fit.",
      ],
      [
        "Connect support to fulfilment",
        "A customer-service team needs shipment context, not just an order number. When the order, selected service and tracking events are visible together, the team can investigate without repeatedly asking the customer for the same details.",
      ],
    ],
  },
  {
    slug: "partner-operations",
    category: "For partners",
    title: "One view of the network. Room for every customer.",
    summary:
      "Organize services, customer groups, commercial terms and support without losing the relationship.",
    read: "5 min",
    art: "network",
    sections: [
      [
        "Separate service design from customer access",
        "A published service and the customers who can use it are related but distinct. Organize your service catalogue, then make customer group access explicit. Keep contract conditions and commercial terms discoverable for the team maintaining the relationship.",
      ],
      [
        "Make onboarding a shared checklist",
        "Confirm the customer account, required store connections, shipping contracts and service access before the first operational shipment. Record what is ready and what still needs attention. A visible checklist helps avoid assumptions across sales and operations.",
      ],
      [
        "Keep commercial changes reviewable",
        "Changes to rates or terms should be understandable before they are used. Assign ownership, check the effective dates and review which customers are affected. The demo workspace illustrates organization only; it does not publish rates or calculate an invoice.",
      ],
      [
        "Close the loop with support",
        "Link a support issue to its customer and shipment context. Distinguish an operational exception from an administrative question so the right team can respond. A shared view should make responsibility clearer, not simply create another dashboard.",
      ],
    ],
  },
  {
    slug: "international-shipping",
    category: "Shipping strategy",
    title: "Cross a border without losing the thread.",
    summary:
      "A checklist for taking your fulfilment workflow into new destinations.",
    read: "4 min",
    art: "international",
    sections: [
      [
        "Check the destination and service",
        "Confirm that a carrier service supports the route, product and parcel you intend to ship. Delivery estimates, prohibited goods and handover requirements can differ by destination. The animated map on this concept is illustrative, not a coverage guarantee.",
      ],
      [
        "Prepare product and customs information",
        "For routes that require customs documentation, gather accurate product descriptions, values, origin and classification information. Requirements depend on the goods and jurisdictions. Check the applicable carrier and official customs guidance before shipping; this overview is not customs advice.",
      ],
      [
        "Set customer expectations before dispatch",
        "Make the available delivery options clear at checkout. Explain the applicable shipping and returns terms and how customers can follow their parcel. Avoid assuming a domestic process will work unchanged for a cross-border destination.",
      ],
      [
        "Start with a manageable route",
        "Validate a limited workflow before extending it to more destinations. Review delivery exceptions and support questions, and use what you learn to improve the information presented at checkout and during tracking.",
      ],
    ],
  },
];
