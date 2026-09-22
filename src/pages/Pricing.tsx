import { useMemo, useState } from "react";
import { Display } from "../components/Display";
import { optical } from "../lib/optical";
import { PageIntro } from "../components/PageIntro";
import { Segmented } from "../components/Segmented";
import { Faq } from "../components/Faq";
import { Closing } from "../components/Closing";
import { Reveal } from "../components/Reveal";
import { Surface } from "../components/Surface";
import { BarChart } from "../components/Chart";
import { NumberTicker } from "../components/NumberTicker";
import {
  comparison,
  monthlyRate,
  plans,
  pricingFaq,
  type Plan,
} from "../data/pricing";

const euro0 = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
});
const euro2 = new Intl.NumberFormat("en-IE", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});

/* A log-ish volume scale: fine control at the low end where most shops sit,
   coarser as the numbers get large. */
const steps = [
  50, 100, 150, 200, 300, 400, 500, 750, 1000, 1500, 2000, 3000, 4000, 5000,
  7500, 10000, 15000, 20000, 25000, 35000,
];

function monthlyCost(plan: Plan, volume: number, annual: boolean) {
  const base = annual ? plan.annual : monthlyRate(plan);
  return base + volume * plan.label;
}

/** The cheapest plan that can actually carry this volume. */
function bestPlan(volume: number, annual: boolean) {
  const eligible = plans.filter((plan) => plan.included >= volume);
  if (!eligible.length) return null;
  return eligible.reduce((best, plan) =>
    monthlyCost(plan, volume, annual) < monthlyCost(best, volume, annual)
      ? plan
      : best,
  );
}

export default function Pricing() {
  const [annual, setAnnual] = useState(true);
  const [stepIndex, setStepIndex] = useState(6); // 500 a month
  const volume = steps[stepIndex];

  const recommended = useMemo(() => bestPlan(volume, annual), [volume, annual]);

  return (
    <>
      <PageIntro
        title={["You pay for what you ship,", "and not a parcel more."]}
        lead="A platform fee plus a few cents a label. The per-label fee falls as you grow, so the more you ship the less each shipment costs to process. Postage is separate."
        actions={
          <Segmented
            name="Billing period"
            value={annual ? "annual" : "monthly"}
            options={[
              { value: "annual", label: "Annual, save 20%" },
              { value: "monthly", label: "Monthly" },
            ]}
            onChange={(value) => setAnnual(value === "annual")}
          />
        }
      />

      {/* ---- Estimator: the volume slider drives the plan recommendation --- */}
      <section className="section-tight estimator">
        <div className="shell shell-wide">
          <Surface beam className="est-shell">
            <div className="est-core">
              <div className="est-control">
                <label htmlFor="volume" className="est-label">
                  Shipments a month
                </label>
                <output className="est-volume num" htmlFor="volume">
                  {volume.toLocaleString("en-IE")}
                </output>
                <input
                  id="volume"
                  className="range"
                  type="range"
                  min={0}
                  max={steps.length - 1}
                  step={1}
                  value={stepIndex}
                  onChange={(event) => setStepIndex(Number(event.target.value))}
                  style={
                    {
                      "--fill": `${(stepIndex / (steps.length - 1)) * 100}%`,
                    } as React.CSSProperties
                  }
                  aria-valuetext={`${volume} shipments a month`}
                />
                <div className="est-scale mono" aria-hidden="true">
                  <span>50</span>
                  <span>35,000</span>
                </div>
              </div>

              <div className="est-result">
                {recommended ? (
                  <>
                    <p className="est-result-label">
                      Cheapest plan that covers it
                    </p>
                    <p className="est-plan">{recommended.name}</p>
                    <p className="est-total">
                      <span className="num">
                        {euro0.format(
                          Math.round(monthlyCost(recommended, volume, annual)),
                        )}
                      </span>
                      <span className="est-per">a month</span>
                    </p>
                    <p className="est-unit">
                      <NumberTicker
                        key={`${recommended.id}-${volume}`}
                        value={
                          Math.round(
                            (monthlyCost(recommended, volume, annual) /
                              volume) *
                              100,
                          ) / 100
                        }
                        decimals={2}
                        prefix="€"
                        duration={480}
                      />{" "}
                      per shipment
                    </p>
                    <p className="est-breakdown">
                      {euro0.format(
                        annual ? recommended.annual : monthlyRate(recommended),
                      )}{" "}
                      platform
                      {recommended.label > 0 ? (
                        <>
                          {" "}
                          plus {volume.toLocaleString("en-IE")} labels at{" "}
                          {euro2.format(recommended.label)}
                        </>
                      ) : (
                        <>, and no per-label fee</>
                      )}
                      . Postage not included.
                    </p>
                  </>
                ) : (
                  <>
                    <p className="est-result-label">Above the listed tiers</p>
                    <p className="est-plan">Custom</p>
                    <p className="est-breakdown">
                      Past 35,000 shipments a month the platform price is shaped
                      around your volumes, features and SLA.
                    </p>
                    <a href="/contact" className="btn btn-primary">
                      Talk to sales
                    </a>
                  </>
                )}
              </div>
            </div>
          </Surface>
        </div>
      </section>

      {/* ---- Plans ------------------------------------------------------- */}
      <section className="section-tight plans-section">
        <div className="shell shell-wide">
          <ol className="plans">
            {plans.map((plan, i) => {
              const price = annual ? plan.annual : monthlyRate(plan);
              const isPick = recommended?.id === plan.id;
              return (
                <Reveal
                  as="li"
                  key={plan.id}
                  index={i}
                  className="plan"
                  shift={14}
                >
                  <div className="plan-in" data-pick={isPick || undefined}>
                    <div className="plan-head">
                      <h2>{plan.name}</h2>
                      {plan.popular ? (
                        <span className="tag tag-accent">Most chosen</span>
                      ) : null}
                      {isPick && !plan.popular ? (
                        <span className="tag tag-accent">Your volume</span>
                      ) : null}
                    </div>

                    <p className="plan-price">
                      <span className="num">{euro0.format(price)}</span>
                      <span className="plan-per">a month</span>
                    </p>
                    <p className="plan-label">
                      {plan.label > 0
                        ? `plus ${euro2.format(plan.label)} a label`
                        : "no per-label fee"}
                      {" · "}
                      up to {plan.included.toLocaleString("en-IE")} a month
                    </p>

                    <p className="plan-summary">{plan.summary}</p>

                    <a
                      href={
                        plan.id === "enterprise" ? "/contact" : "/pricing#plans"
                      }
                      className={`btn ${isPick ? "btn-primary" : "btn-ghost"}`}
                    >
                      {plan.annual === 0
                        ? "Start free"
                        : plan.id === "enterprise"
                          ? "Talk to sales"
                          : "Start shipping"}
                    </a>

                    <ul className="plan-features">
                      {plan.features.map((feature) => (
                        <li key={feature}>{feature}</li>
                      ))}
                    </ul>
                  </div>
                </Reveal>
              );
            })}
          </ol>
          <p className="plans-note">
            Prices exclude VAT. Every plan includes matched partner shipping
            rates. Postage is charged separately and depends on the service you
            pick.
          </p>
        </div>
      </section>

      {/* ---- Comparison --------------------------------------------------- */}
      <section className="section compare-section" id="compare">
        <div className="shell shell-wide">
          <div className="compare-head">
            <h2 style={optical("Line by line")}>Line by line</h2>
            <p className="lead">
              Five plans, grouped by what actually differs between them. The
              column matching your volume is highlighted.
            </p>
          </div>

          <div
            className="compare-scroll"
            tabIndex={0}
            role="region"
            aria-label="Plan comparison, scrolls horizontally"
          >
            <table className="compare">
              <caption className="sr">
                Feature comparison across the five Zineps plans
              </caption>
              <thead>
                <tr>
                  <th scope="col">
                    <span className="sr">Feature</span>
                  </th>
                  {plans.map((plan) => (
                    <th
                      key={plan.id}
                      scope="col"
                      data-pick={recommended?.id === plan.id || undefined}
                    >
                      <span className="compare-plan">{plan.name}</span>
                      <span className="compare-price num">
                        {euro0.format(annual ? plan.annual : monthlyRate(plan))}
                        <i>/mo</i>
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>

              {comparison.map((group) => (
                <tbody key={group.group}>
                  <tr className="compare-group">
                    <th scope="colgroup" colSpan={plans.length + 1}>
                      {group.group}
                    </th>
                  </tr>
                  {group.rows.map((row) => (
                    <tr key={row.label}>
                      <th scope="row">{row.label}</th>
                      {row.values.map((value, i) => (
                        <td
                          key={plans[i].id}
                          data-pick={
                            recommended?.id === plans[i].id || undefined
                          }
                        >
                          {value === "y" ? (
                            <>
                              <span aria-hidden="true" className="tick" />
                              <span className="sr">Included</span>
                            </>
                          ) : value === "n" ? (
                            <>
                              <span aria-hidden="true" className="dash" />
                              <span className="sr">Not included</span>
                            </>
                          ) : (
                            <span className="compare-value">{value}</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              ))}
            </table>
          </div>
        </div>
      </section>

      <section className="section-tight unit-cost">
        <div className="shell shell-wide">
          <div className="unit-cost-in">
            <div className="unit-cost-copy">
              <Display
                lines={["The more you ship,", "the less each one costs."]}
              />
              <p className="lead">
                Platform fee plus label fee, divided by the volume each tier is
                built for. Most software charges you more for growing. This
                charges you less per parcel.
              </p>
            </div>
            <div className="unit-cost-chart">
              <BarChart
                label="Cost per shipment by plan, at each plan's included volume"
                values={[10, 14, 13, 18, 17].map((_, i) => {
                  const plan = plans[i];
                  const cents =
                    ((plan.annual + plan.included * plan.label) /
                      plan.included) *
                    100;
                  return Math.round(cents);
                })}
                labels={plans.map((plan) => plan.name.replace("-", "‑"))}
              />
              <p className="unit-cost-note">
                Cents per shipment at each plan's included volume. Postage is
                separate.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Faq items={pricingFaq} heading="What people ask before they sign up" />
      <Closing
        title="Start on the free plan and see the rates for yourself."
        body="Two hundred shipments a month, no per-label fee, partner rates included. Move up when the numbers say so."
      />
    </>
  );
}
