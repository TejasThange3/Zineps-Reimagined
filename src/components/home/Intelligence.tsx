import { useEffect, useRef, useState } from "react";
import { Display } from "../Display";
import { Reveal } from "../Reveal";
import { LineChart } from "../Chart";
import { Surface } from "../Surface";

/**
 * Shipping AI.
 *
 * The claim is that Zineps spots a carrier likely to run late and offers a
 * different one before the label is bought. The visual is that comparison:
 * three services on one lane, scored, with the flagged one demoted. The bars
 * draw themselves once when the section is first seen, which is the only
 * automatic motion on the page.
 */

const readings = [
  {
    service: "Swiftline Express",
    partner: "Alpen Fracht",
    onTime: 71,
    state: "flagged" as const,
    note: "Hub congestion on this lane for nine days",
  },
  {
    service: "Routewise Standard",
    partner: "Vinkveld Logistiek",
    onTime: 96,
    state: "picked" as const,
    note: "Holding its window, and €1.20 cheaper",
  },
  {
    service: "Parcelway Economy",
    partner: "Noordkust Parcel",
    onTime: 92,
    state: "ok" as const,
    note: "Steady, one day slower",
  },
];

export function Intelligence() {
  const ref = useRef<HTMLDivElement>(null);
  const [drawn, setDrawn] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          observer.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="section intel" id="intelligence">
      <div className="shell shell-wide">
        <div className="intel-grid">
          <Reveal className="intel-copy">
            <p className="eyebrow">Shipping AI</p>
            <Display
              lines={["The cheapest label is not", "the cheapest shipment."]}
            />
            <p className="lead">
              A late parcel costs you a support ticket, a refund and sometimes
              the customer. Zineps reads how each service has actually been
              performing on your lane and says so before you buy the label, not
              after the buyer emails you.
            </p>
            <ul className="intel-list">
              <li>Delay risk scored per service, per lane</li>
              <li>An alternative offered when the risk is real</li>
              <li>Customs and VAT checks before the parcel leaves</li>
              <li>Return patterns fed back into the next recommendation</li>
            </ul>
            <a href="/shipping-ai" className="link link-accent">
              How Shipping AI decides
            </a>
          </Reveal>

          <div className="intel-panel" ref={ref}>
            <Surface beam className="intel-panel-shell">
              <div className="intel-panel-core">
                <div className="intel-panel-head">
                  <span className="mono">AMS &rsaquo; VIE</span>
                  <span className="mono intel-panel-window">
                    ON TIME, LAST 30 DAYS
                  </span>
                </div>

                <ul className="intel-bars">
                  {readings.map((reading, i) => (
                    <li key={reading.service} data-state={reading.state}>
                      <div className="intel-bar-top">
                        <span className="intel-bar-name">
                          {reading.service}
                          <em>{reading.partner}</em>
                        </span>
                        <span className="intel-bar-value num">
                          {reading.onTime}%
                        </span>
                      </div>
                      <div className="intel-bar-track">
                        <span
                          className="intel-bar-fill"
                          style={{
                            transform: `scaleX(${drawn ? reading.onTime / 100 : 0})`,
                            transitionDelay: `${120 + i * 90}ms`,
                          }}
                        />
                      </div>
                      <p className="intel-bar-note">{reading.note}</p>
                    </li>
                  ))}
                </ul>

                <div className="intel-trend">
                  <div className="intel-trend-head">
                    <span className="mono">
                      SWIFTLINE ON-TIME, WEEK BY WEEK
                    </span>
                    <span className="intel-trend-drop num">-23 pts</span>
                  </div>
                  <LineChart
                    label="Swiftline Express on-time rate falling from 94% to 71% over six weeks"
                    values={[94, 93, 89, 84, 77, 71]}
                    labels={["w1", "w2", "w3", "w4", "w5", "w6"]}
                  />
                </div>

                <p className="intel-verdict">
                  Zineps moved this shipment to Routewise Standard. One day
                  later, and far more likely to actually arrive on it.
                </p>
              </div>
            </Surface>
            <p className="console-note">
              Example performance data. Illustrates the feature, not a live
              model output.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
