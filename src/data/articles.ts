/* ==========================================================================
   Original guides written for this concept.

   These are not reproductions of anything on zineps.com. They cover the
   operational ground the product sits on, which is what a shipping platform's
   blog is for.
   ========================================================================== */

export type Block =
  | { t: "p"; v: string }
  | { t: "h"; v: string }
  | { t: "list"; v: string[] }
  | { t: "quote"; v: string }
  | { t: "table"; head: string[]; rows: string[][] };

export type Article = {
  slug: string;
  topic: "Operations" | "Costs" | "Cross-border" | "Automation";
  title: string;
  standfirst: string;
  minutes: number;
  date: string;
  body: Block[];
};

export const articles: Article[] = [
  {
    slug: "dimensional-weight",
    topic: "Costs",
    title: "Why your parcels cost more than the rate card says",
    standfirst:
      "Carriers bill on the space a parcel occupies, not what it weighs. Most shops discover this one invoice at a time.",
    minutes: 6,
    date: "2026-09-02",
    body: [
      {
        t: "p",
        v: "A rate card is a table of weights and prices. It is also, for most shops, a poor predictor of the invoice. The gap between the two has a name: dimensional weight, or volumetric weight, and it is the single most common reason a shipping budget is wrong.",
      },
      {
        t: "h",
        v: "What carriers actually charge for",
      },
      {
        t: "p",
        v: "A van holds a fixed volume long before it holds a meaningful weight. Fill it with pillows and it leaves the depot full and barely loaded. Carriers therefore bill on whichever is greater: the actual weight, or a figure derived from the parcel's dimensions.",
      },
      {
        t: "p",
        v: "The usual European formula divides length by width by height in centimetres by a divisor, commonly 5000. A 40 by 30 by 20 centimetre box comes out at 4.8 kg of dimensional weight. If the thing inside weighs 900 grams, you are billed as though it weighs 4.8 kg.",
      },
      {
        t: "table",
        head: ["Box, cm", "Volume", "Dim weight at 5000", "Actual", "Billed"],
        rows: [
          ["40 x 30 x 20", "24,000", "4.8 kg", "0.9 kg", "4.8 kg"],
          ["30 x 20 x 15", "9,000", "1.8 kg", "2.0 kg", "2.0 kg"],
          ["50 x 40 x 30", "60,000", "12.0 kg", "3.5 kg", "12.0 kg"],
        ],
      },
      {
        t: "p",
        v: "The second row is the only one where the rate card told the truth. That is a packaging outcome, not a negotiating one.",
      },
      { t: "h", v: "Where the money leaks" },
      {
        t: "list",
        v: [
          "A single box size for everything, chosen because buying one size is cheaper.",
          "Void fill used to stop movement in a box that was too big to begin with.",
          "Product dimensions recorded for the website but never for the parcel.",
          "Multi-item orders packed into one large box when two small ones would bill for less.",
        ],
      },
      {
        t: "p",
        v: "The last one surprises people. Two parcels at 1.8 kg dimensional weight frequently beat one at 12 kg, because the divisor punishes volume much harder than the second label costs.",
      },
      { t: "h", v: "What to do about it" },
      {
        t: "p",
        v: "Record real dimensions per product, not per catalogue. Hold three or four box sizes rather than one. Then let the shipping layer compare services using the dimensional weight it can calculate, rather than the weight a human typed in. If the system knows the box, it can tell you which service is genuinely cheaper for that box, which is a different question from which rate card looks cheapest.",
      },
      {
        t: "quote",
        v: "The cheapest rate card line and the cheapest shipment are rarely the same line.",
      },
    ],
  },
  {
    slug: "automation-rules",
    topic: "Automation",
    title: "The shipping decisions you are making twice a day",
    standfirst:
      "Most manual shipping work is one decision, repeated. Writing it down once is the entire trick.",
    minutes: 5,
    date: "2026-08-24",
    body: [
      {
        t: "p",
        v: "Watch someone process orders for twenty minutes and you will see the same judgement made over and over. German order, under five kilos, standard service. High-value order, signed for. Local order, collection point. None of it is difficult. All of it is attention, and attention is the thing in shortest supply on a busy afternoon.",
      },
      { t: "h", v: "Start with what you already do" },
      {
        t: "p",
        v: "The mistake is to design an automation scheme. The better approach is to notice the rules you are already following and write those down, in order of how often they fire. Four rules that cover eighty percent of orders is a better day than twenty rules that cover everything and that nobody trusts.",
      },
      {
        t: "list",
        v: [
          "Destination country decides the service more often than anything else.",
          "Weight brackets usually split into letterbox, parcel and freight.",
          "Order value tends to decide whether something travels signed for.",
          "Product group catches the awkward cases: fragile, hazardous, oversized.",
        ],
      },
      { t: "h", v: "Always have a default" },
      {
        t: "p",
        v: "A rule set without a fallback fails in the worst possible way: silently, on the orders nobody anticipated. Every rule set needs a default service and a visible queue of orders that matched nothing. That queue is also your backlog. When the same kind of order shows up in it three times, you have found your next rule.",
      },
      { t: "h", v: "Let the rule prefer a source, not a carrier" },
      {
        t: "p",
        v: "A rule that names one carrier ages badly. The carrier changes its surcharges, or a partner rate undercuts it, and the rule keeps firing anyway. A rule that says cheapest tracked service to Germany under five kilos keeps making the right call as the rates underneath it move.",
      },
      {
        t: "p",
        v: "This is also where having both partner rates and your own contracts in the same comparison earns its keep. The rule does not need to know which one won. It needs to know what you were optimising for.",
      },
    ],
  },
  {
    slug: "delivery-promises",
    topic: "Operations",
    title: "The delivery date is a promise, so treat it like one",
    standfirst:
      "Checkout estimates are usually a static guess. That guess is doing more conversion damage than the shipping price.",
    minutes: 6,
    date: "2026-08-15",
    body: [
      {
        t: "p",
        v: "Most checkouts show a delivery estimate that was typed into a settings field once and has not been revisited since. It ignores the cut-off time, the day of the week, the destination and the carrier's current performance. It is not a forecast. It is a decoration.",
      },
      { t: "h", v: "What a real estimate accounts for" },
      {
        t: "list",
        v: [
          "The cut-off: an order at 16:58 and an order at 17:02 do not ship on the same day.",
          "The calendar: Friday afternoon orders inherit the weekend.",
          "The lane: Amsterdam to Rotterdam and Amsterdam to Vienna are not the same promise.",
          "Recent reality: a service holding 71% of its window this month is not a two-day service this month.",
        ],
      },
      { t: "h", v: "Under-promise, but not by much" },
      {
        t: "p",
        v: "Padding every estimate by two days makes you accurate and uncompetitive. The useful move is narrower: promise the window the data supports, and be honest when it widens. Shoppers forgive a four-day delivery that said four days. They do not forgive a two-day delivery that took four.",
      },
      { t: "h", v: "The estimate outlives the checkout" },
      {
        t: "p",
        v: "The date you show at checkout should be the date on the confirmation email, the tracking page and the support screen. When those disagree, the customer contacts you, and the cost of the ticket usually exceeds whatever the faster service would have cost in the first place.",
      },
      {
        t: "quote",
        v: "A missed delivery date is a support ticket you paid to create.",
      },
    ],
  },
  {
    slug: "returns-that-do-not-cost",
    topic: "Operations",
    title: "Returns are a process, not an apology",
    standfirst:
      "The average return is handled by a person reading an email. It does not have to be.",
    minutes: 5,
    date: "2026-08-06",
    body: [
      {
        t: "p",
        v: "Returns get treated as an exception even in shops where a fifth of orders come back. That framing is expensive. An exception is handled by a person; a process is handled by the system, and only the genuinely unusual cases reach a person.",
      },
      { t: "h", v: "Three things to decide once" },
      {
        t: "list",
        v: [
          "Who pays, and whether that changes by reason, value or destination.",
          "What is automatically approved, and what needs a human to look.",
          "Where the parcel goes back to, which is not always where it came from.",
        ],
      },
      {
        t: "p",
        v: "Write those down and most of the queue disappears. A return that is inside the window, under the value threshold and for a stated reason can be approved, labelled and tracked without anyone opening anything.",
      },
      { t: "h", v: "Put the portal in your own branding" },
      {
        t: "p",
        v: "A return is a moment of doubt. Sending the customer to a carrier's generic form at that moment is a strange thing to do deliberately. A return page in your own styling, with your own policy in your own words, is a cheap piece of reassurance.",
      },
      { t: "h", v: "Read the reasons" },
      {
        t: "p",
        v: "The return reason field is the most under-read data in e-commerce. Reasons cluster: a size that runs small, a photograph that flatters, a service that damages. Each cluster is a fixable cause, and fixing the cause is the only return strategy that reduces the number of returns rather than the cost of processing them.",
      },
    ],
  },
  {
    slug: "carrier-mix",
    topic: "Costs",
    title: "One carrier is a single point of failure",
    standfirst:
      "The advice to pick one carrier and negotiate hard made sense when integrating a second one was a project.",
    minutes: 5,
    date: "2026-07-28",
    body: [
      {
        t: "p",
        v: "Consolidating volume with one carrier buys a better rate. It also buys a correlated risk: when that carrier has a bad month, every one of your parcels has a bad month, and you have no lever to pull.",
      },
      { t: "h", v: "What a mix is actually for" },
      {
        t: "p",
        v: "The argument for multiple carriers is not primarily price, although price is usually part of it. It is that different carriers are good at different things, and those differences are stable enough to route on.",
      },
      {
        t: "list",
        v: [
          "Domestic density: the carrier with the most drivers in your country wins on cost.",
          "Cross-border lanes: a regional specialist frequently beats a global network on its own routes.",
          "Collection points: lockers and shops are a different network from home delivery.",
          "Heavy and oversized: past the parcel ceiling it is a freight decision, not a parcel one.",
        ],
      },
      { t: "h", v: "The objection, and the answer" },
      {
        t: "p",
        v: "The reason shops stayed single-carrier was integration cost. Every additional carrier meant another API, another label format, another tracking webhook and another set of edge cases to maintain. That was a real reason.",
      },
      {
        t: "p",
        v: "It stops being a reason when the integration is done once, at the layer above the carriers. At that point adding a carrier is a configuration change, and the question returns to the one that should have been asked all along: which service is right for this parcel?",
      },
    ],
  },
  {
    slug: "cross-border-holds",
    topic: "Cross-border",
    title: "Parcels are not held at the border. They are held by the paperwork",
    standfirst:
      "Cross-border shipments fail for boring, preventable reasons, almost all of them decided before dispatch.",
    minutes: 6,
    date: "2026-07-19",
    body: [
      {
        t: "p",
        v: "It is tempting to treat customs as weather: unpredictable, external, somebody else's fault. In practice the majority of held parcels are held for reasons that were fixed at the moment the label was created, by a field that was blank or wrong.",
      },
      { t: "h", v: "The usual causes" },
      {
        t: "list",
        v: [
          "A description like goods or gift, which tells a customs officer nothing.",
          "A missing or guessed HS code.",
          "A declared value that does not match the commercial invoice.",
          "No EORI or VAT identifier where the destination requires one.",
          "An incoterm nobody chose, so the buyer is surprised by a duty bill.",
        ],
      },
      { t: "h", v: "Decide the incoterm on purpose" },
      {
        t: "p",
        v: "DAP means the buyer pays duties on arrival. DDP means you do. Both are legitimate. What is not legitimate is not choosing, because the default becomes an unexpected invoice landing on your customer's doormat, which converts into a refused delivery and a return you also pay for.",
      },
      { t: "h", v: "Generate, do not retype" },
      {
        t: "p",
        v: "Every field above already exists somewhere in the order. Descriptions are in the product catalogue, values are on the order line, the destination is in the address. Paperwork generated from those records is correct by construction. Paperwork retyped at dispatch is correct by luck.",
      },
      {
        t: "quote",
        v: "A held parcel is almost always a blank field, discovered three weeks late.",
      },
    ],
  },
];

export const byTopic = (topic: string) =>
  topic === "All" ? articles : articles.filter((a) => a.topic === topic);

export const topics = [
  "All",
  "Operations",
  "Costs",
  "Automation",
  "Cross-border",
];

export const formatDate = (iso: string) =>
  new Date(iso).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
