import { PageIntro } from "../components/PageIntro";
import { CapabilityList, SplitFeature } from "../components/blocks";
import { Intelligence } from "../components/home/Intelligence";
import { Faq } from "../components/Faq";
import { Closing } from "../components/Closing";

const capabilities = [
  {
    name: "Predictive delay detection",
    body: "Historical and live performance per carrier, per lane. When a service starts slipping, the shipment is flagged before the label is bought and an alternative is offered.",
  },
  {
    name: "Smart routing",
    body: "The fastest and least expensive route for the shipment in front of you, adjusted for the conditions on that lane rather than a rate card average.",
  },
  {
    name: "Rate intelligence",
    body: "Weight, volume, destination and urgency scored together, because the cheapest rate card line is regularly not the cheapest shipment.",
  },
  {
    name: "Cross-border compliance",
    body: "Customs data, VAT treatment and import restrictions checked before dispatch, which is where held parcels and surprise returns actually start.",
  },
  {
    name: "Learning from returns",
    body: "Return patterns feed back into the recommendations, so the services that quietly generate returns stop being recommended.",
  },
  {
    name: "Explainable, not magic",
    body: "Every recommendation shows the numbers behind it: on-time rate, price difference, transit days. You can disagree with it and pick something else.",
  },
];

const faq = [
  {
    q: "Does the AI choose for me?",
    a: "Only if you tell it to. By default it recommends and shows its reasoning. You can let a rule take the recommendation automatically, or leave the decision with a person.",
  },
  {
    q: "What is it actually looking at?",
    a: "Carrier and service performance on your lanes, transit times, rate differences, customs and restriction data, and return patterns. It is delivery data, not a language model guessing.",
  },
  {
    q: "Which plans include it?",
    a: "AI delay prediction and advanced analytics are on the Scale-up and Enterprise plans. Rate comparison and matching are on every plan, including the free one.",
  },
  {
    q: "What happens when it is wrong?",
    a: "You see the score, not just the verdict, so a recommendation you disagree with is easy to overrule. Outcomes feed back in, which is how the scoring on your lanes improves.",
  },
];

export default function ShippingAI() {
  return (
    <>
      <PageIntro
        eyebrow="Shipping AI"
        title={["Know which carrier is", "about to let you down."]}
        lead="A late parcel is not a shipping problem, it is a support ticket, a refund and sometimes a lost customer. Shipping AI scores the risk on your lanes while you can still do something about it."
        actions={
          <>
            <a href="/pricing" className="btn btn-primary btn-lg">
              Start shipping
            </a>
            <a href="/contact" className="btn btn-ghost btn-lg">
              Talk to sales
            </a>
          </>
        }
      />

      <Intelligence />

      <CapabilityList
        title={["What it watches,", "and what it does about it."]}
        items={capabilities}
      />

      <SplitFeature
        tinted
        title={["It shows its working."]}
        body="A recommendation you cannot interrogate is just an opinion with better formatting. Every suggestion carries the numbers that produced it, so you can check them and overrule them."
        points={[
          "On-time performance for the service, on your lane, over a stated window",
          "The price difference against the option you were going to pick",
          "Transit days, and how reliably that window has been met",
          "Why the flagged option was flagged, in a sentence",
        ]}
        visual={
          <div className="explain">
            <div className="explain-shell">
              <div className="explain-core">
                <p className="explain-head mono">WHY THIS RECOMMENDATION</p>
                <ol className="explain-steps">
                  {[
                    [
                      "Performance",
                      "Swiftline Express held 71% of its window on AMS to VIE over the last 30 days, against a 94% baseline for the lane.",
                    ],
                    [
                      "Cause",
                      "Nine consecutive days of hub congestion, not a one-off weather event.",
                    ],
                    [
                      "Alternative",
                      "Routewise Standard held 96% over the same window and costs €1.20 less.",
                    ],
                    [
                      "Trade-off",
                      "One extra day in transit. Stated, not hidden.",
                    ],
                  ].map(([title, body], i) => (
                    <li key={title}>
                      <span className="explain-index num">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span className="explain-body">
                        <b>{title}</b>
                        <span>{body}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <p className="console-note">
              Example reasoning. Illustrates the output, not a live model.
            </p>
          </div>
        }
      />

      <Faq items={faq} heading="Reasonable scepticism, answered" />
      <Closing
        title="Stop finding out from the customer."
        body="Delay prediction and advanced analytics are on Scale-up and above. Rate matching is on every plan, including free."
      />
    </>
  );
}
