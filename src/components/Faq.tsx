import { useId, useState } from "react";
import { optical } from "../lib/optical";

export type QA = { q: string; a: string };

/**
 * Accordion built on a grid-template-rows transition, so the panel animates
 * to its real height without measuring anything in JavaScript.
 */
export function Faq({
  items,
  heading = "Questions people actually ask",
  aside,
}: {
  items: QA[];
  heading?: string;
  aside?: React.ReactNode;
}) {
  const [open, setOpen] = useState<number | null>(0);
  const id = useId();

  return (
    <section className="section faq" id="faq">
      <div className="shell shell-wide">
        <div className="faq-grid">
          <div className="faq-side">
            <h2 style={optical(heading)}>{heading}</h2>
            {aside}
          </div>

          <div className="faq-list">
            {items.map((item, i) => {
              const expanded = open === i;
              return (
                <div className="disclosure" key={item.q}>
                  <h3>
                    <button
                      type="button"
                      className="disclosure-trigger"
                      aria-expanded={expanded}
                      aria-controls={`${id}-${i}`}
                      onClick={() => setOpen(expanded ? null : i)}
                    >
                      {item.q}
                      <span className="disclosure-mark" aria-hidden="true" />
                    </button>
                  </h3>
                  <div
                    className="disclosure-body"
                    id={`${id}-${i}`}
                    data-open={expanded}
                    role="region"
                  >
                    <div>
                      <p>{item.a}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
