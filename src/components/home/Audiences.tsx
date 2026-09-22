import { useState } from "react";
import { Display } from "../Display";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Segmented } from "../Segmented";

/**
 * Zineps sells to two sides of the same transaction. Rather than putting the
 * two propositions in adjacent columns and asking the visitor to read both,
 * the section asks which one they are and shows only that.
 */

const sides = {
  merchant: {
    title: "You sell things and something has to carry them.",
    body: "Bring your stores and marketplaces into one queue, let rules choose the service, and hand the buyer tracking that looks like it came from you.",
    points: [
      "Carrier selection on price and speed, automatically",
      "Labels, customs papers and branded packing slips",
      "Pickup and return handling from the same screen",
      "Delivery options in your checkout",
      "Your own contracts, partner rates, or both",
    ],
    cta: { href: "/shipping", label: "See the shipping software" },
    who: ["Online stores", "Marketplace sellers", "Dropshippers"],
  },
  partner: {
    title: "You move things and the admin is eating the margin.",
    body: "Publish your rates once, set the margin per customer group, invoice automatically, and bring the merchants you already serve onto one system.",
    points: [
      "Publish rates, conditions and service catalogues",
      "Contracts, customer groups and margins in one place",
      "Automatic invoicing per customer or per shipment",
      "Onboarding and support in the same workflow",
      "You keep the commercial relationship",
    ],
    cta: {
      href: "/logistics-operating-system",
      label: "See the partner platform",
    },
    who: ["Carriers", "Freight forwarders", "3PLs"],
  },
} as const;

type Side = keyof typeof sides;

export function Audiences() {
  const [side, setSide] = useState<Side>("merchant");
  const reduce = useReducedMotion();
  const content = sides[side];

  return (
    <section className="section aud" id="audiences">
      <div className="shell shell-wide">
        <div className="aud-head">
          <Display lines={["Which side of the", "parcel are you on?"]} />
          <Segmented
            name="Audience"
            value={side}
            options={[
              { value: "merchant", label: "I ship goods" },
              { value: "partner", label: "I move goods" },
            ]}
            onChange={(value) => setSide(value as Side)}
          />
        </div>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={side}
            className="aud-body"
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduce ? undefined : { opacity: 0, y: -8 }}
            transition={{ duration: 0.28, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="aud-copy">
              <h3>{content.title}</h3>
              <p className="lead">{content.body}</p>
              <a href={content.cta.href} className="btn btn-primary">
                {content.cta.label}
              </a>
              <p className="aud-who">
                Built for {content.who.join(", ").toLowerCase()}.
              </p>
            </div>

            <ul className="aud-points">
              {content.points.map((point, i) => (
                <motion.li
                  key={point}
                  initial={reduce ? false : { opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.36,
                    delay: 0.04 + i * 0.045,
                    ease: [0.23, 1, 0.32, 1],
                  }}
                >
                  {point}
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}
