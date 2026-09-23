import { Globe } from "../Globe";
import { optical } from "../../lib/optical";
import { NumberTicker } from "../NumberTicker";

/* Figures published by Zineps on zineps.com, September 2026. */
const figures = [
  {
    value: 300,
    suffix: "+",
    unit: "million",
    label: "goods moved each year with Zineps in the chain",
  },
  {
    value: 100,
    suffix: "+",
    unit: "million",
    label: "in annual economic value created by merchants who ship with us",
  },
  {
    value: 12,
    suffix: "+",
    unit: "million",
    label: "parcels processed through the system every year",
  },
];

export function Scale() {
  return (
    <section className="scale" id="scale" data-surface="deep">
      <div className="shell shell-wide scale-in">
        <div className="scale-top">
          <div className="scale-copy">
            <h2
              className="scale-title"
              style={optical(
                "Most of it you will never see. That is rather the point.",
              )}
            >
              Most of it you will never see. <br className="br-wide" />
              That is rather the point.
            </h2>
            <p className="scale-lead">
              Every parcel below moved because a rate was compared, a label was
              made and a lane was chosen. None of it needed anyone to think
              about it that day.
            </p>
            <a href="/integrations" className="btn btn-ghost scale-cta">
              See the network
            </a>
          </div>

          <Globe className="scale-globe" />
        </div>

        <ol className="scale-figures">
          {figures.map((figure) => (
            <li key={figure.label}>
              <p className="scale-value">
                <NumberTicker value={figure.value} suffix={figure.suffix} />
                <span className="scale-unit">{figure.unit}</span>
              </p>
              <p className="scale-label">{figure.label}</p>
            </li>
          ))}
        </ol>

        <p className="scale-source">
          Figures as published by Zineps on zineps.com. Drag the globe.
        </p>
      </div>
    </section>
  );
}
