import { useState } from "react";
import { Display } from "../Display";
import { StackCards } from "../StackCards";
import { Surface } from "../Surface";

/**
 * One shipment, followed through the four things Zineps does to it.
 *
 * The stages are cards that pin and stack as you scroll, so the parcel's
 * progress and the page's progress are the same gesture. The rail above
 * tracks which card is in front. Below the tablet breakpoint, and under
 * reduced motion, the stack degrades to a plain list.
 */

const ORDER = {
  ref: "#DEMO-0042",
  buyer: "Lotte Brandsma",
  city: "Berlin, Germany",
  weight: "2.0 kg",
  items: 3,
};

const stages = [
  {
    id: "order",
    rail: "Order",
    title: "The order arrives on its own.",
    blurb:
      "Shopify, Bol, your WMS or the API. Orders land in one queue with the address already validated, so nothing waits on a copy and paste.",
    visual: (
      <dl className="flow-record">
        <div>
          <dt>Reference</dt>
          <dd className="num">{ORDER.ref}</dd>
        </div>
        <div>
          <dt>Ship to</dt>
          <dd>
            {ORDER.buyer}
            <br />
            <span className="flow-soft">{ORDER.city}</span>
          </dd>
        </div>
        <div>
          <dt>Parcel</dt>
          <dd className="num">
            {ORDER.weight} · {ORDER.items} items
          </dd>
        </div>
        <div>
          <dt>Channel</dt>
          <dd>Shopify</dd>
        </div>
        <div>
          <dt>Imported</dt>
          <dd className="num">09:04</dd>
        </div>
        <div>
          <dt>Address</dt>
          <dd className="flow-ok">Validated</dd>
        </div>
      </dl>
    ),
  },
  {
    id: "rule",
    rail: "Rule",
    title: "A rule picks the service.",
    blurb:
      "Set the logic once, by destination, weight, value or product group. Every matching order routes itself from then on.",
    visual: (
      <div className="flow-rule">
        <code className="flow-code">
          <span className="flow-kw">when</span> country{" "}
          <span className="flow-op">is</span> DE{" "}
          <span className="flow-kw">and</span> weight{" "}
          <span className="flow-op">&lt;</span> 5 kg
          <br />
          <span className="flow-kw">then</span> Routewise Standard
        </code>
        <p className="flow-matched">
          <span className="flow-dot" aria-hidden="true" />
          Matched. Routewise Standard on the Vinkveld contract, 2 days, €7.90.
        </p>
        <ul className="flow-compare">
          {[
            ["Routewise Standard", "€7.90", "2 days", true],
            ["Pickup Point Direct", "€6.95", "3 days", false],
            ["Swiftline Express", "€14.50", "1 day", false],
          ].map(([name, price, days, win]) => (
            <li key={name as string} data-win={(win as boolean) || undefined}>
              <span>{name}</span>
              <span className="num">{days}</span>
              <span className="num">{price}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  },
  {
    id: "label",
    rail: "Label",
    title: "The label is already made.",
    blurb:
      "Carrier label, customs paperwork and a packing slip in your own branding, generated from the order you already have.",
    visual: (
      <div className="flow-label">
        <div className="flow-label-head">
          <span className="mono">ROUTEWISE STANDARD</span>
          <span className="mono">NL &gt; DE</span>
        </div>
        <p className="flow-label-to">
          {ORDER.buyer}
          <br />
          Winsstraße 42
          <br />
          10405 Berlin
        </p>
        <div className="flow-barcode" aria-hidden="true">
          {Array.from({ length: 52 }, (_, i) => (
            <i
              key={i}
              style={
                { "--w": (i * 7) % 3 === 0 ? 3 : 1 } as React.CSSProperties
              }
            />
          ))}
        </div>
        <p className="flow-track num">3SZINEPS4820193</p>
      </div>
    ),
  },
  {
    id: "track",
    rail: "Delivery",
    title: "Everyone can see where it is.",
    blurb:
      "Tracking in your own branding for the buyer, exception alerts for you, and a return portal when it comes back.",
    visual: (
      <ol className="flow-events">
        {[
          ["09:12", "Label created", true],
          ["11:40", "Collected, Amsterdam", true],
          ["04:05", "In transit, Osnabrück hub", true],
          ["07:22", "At delivery depot, Berlin", true],
          ["Today", "Out for delivery", false],
        ].map(([time, event, done]) => (
          <li key={event as string} data-done={(done as boolean) || undefined}>
            <span className="flow-events-time num">{time}</span>
            <span className="flow-events-label">{event}</span>
          </li>
        ))}
      </ol>
    ),
  },
];

export function Workflow() {
  const [active, setActive] = useState(0);

  return (
    <section className="section flow" id="workflow">
      <div className="shell shell-wide">
        <div className="flow-head">
          <Display
            lines={[
              "From an order you did not touch",
              "to a parcel you did not chase.",
            ]}
          />
          <p className="lead">
            Four steps, one shipment. Scroll and follow it through.
          </p>
        </div>

        <ol className="flow-rail" aria-hidden="true">
          <span
            className="flow-rail-fill"
            style={{ transform: `scaleX(${(active + 1) / stages.length})` }}
          />
          {stages.map((stage, i) => (
            <li
              key={stage.id}
              className="flow-step"
              data-done={i <= active || undefined}
              data-current={i === active || undefined}
            >
              <span className="flow-step-dot" />
              <span className="flow-step-label">{stage.rail}</span>
            </li>
          ))}
        </ol>

        <StackCards
          onActive={setActive}
          cards={stages.map((stage, i) => (
            <Surface key={stage.id} className="flow-panel">
              <div className="flow-pane">
                <div className="flow-text">
                  <span className="flow-index num" aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3>{stage.title}</h3>
                  <p>{stage.blurb}</p>
                </div>
                <div className="flow-visual">{stage.visual}</div>
              </div>
            </Surface>
          ))}
        />
      </div>
    </section>
  );
}
