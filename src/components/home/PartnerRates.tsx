import { Reveal } from "../Reveal";
import { Display } from "../Display";
import { NumberTicker } from "../NumberTicker";
import { WorldMap } from "../WorldMap";

/* Figures published by Zineps on zineps.com, September 2026. */
const figures = [
  { value: 20, suffix: "+", label: "logistics partners" },
  { value: 200, suffix: "+", label: "destination countries" },
  { value: 1000, suffix: "+", label: "shipping methods" },
  { value: 80, suffix: "+", label: "carriers reachable" },
];

export function PartnerRates() {
  return (
    <section className="section rates" id="partner-rates">
      <div className="shell shell-wide">
        <div className="rates-grid">
          <Reveal className="rates-lede">
            <p className="eyebrow">Partner shipping rates</p>
            <Display lines={["Their buying power", "becomes yours."]} />
            <p className="lead">
              Logistics partners on Zineps already hold high-volume deals with
              DHL, PostNL, DPD and dozens more. We match you to the partner
              whose lanes fit your shop, so a shop doing four hundred parcels a
              month can ship on terms written for four hundred thousand.
            </p>
            <a href="/pricing" className="link link-accent">
              See how matching works
            </a>
          </Reveal>

          <div className="rates-map">
            <WorldMap />
          </div>
        </div>

        <ol className="rates-figures">
          {figures.map((figure, i) => (
            <Reveal as="li" key={figure.label} index={i} shift={14}>
              <span className="rates-value">
                <NumberTicker value={figure.value} suffix={figure.suffix} />
              </span>
              <span className="rates-label">{figure.label}</span>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
