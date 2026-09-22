import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import {
  cityKey,
  euro,
  lanes,
  priorities,
  type Priority,
} from "../data/shipping";
import { rank, savingAgainstDearest } from "../lib/rank";
import { Segmented } from "./Segmented";
import { Surface } from "./Surface";
import { LaneMap } from "./LaneMap";
import { NumberTicker } from "./NumberTicker";

/**
 * The rate console.
 *
 * This is the product argument in miniature: one shipment, several logistics
 * partners, and a ranking that changes with what the merchant is optimising
 * for. The map above the list is the same lane the rows are pricing, so
 * changing the route moves both at once and the panel reads as one
 * instrument rather than a table with a picture over it.
 *
 * Every rate here is example data. Nothing contacts a carrier.
 */
export function RateConsole() {
  const [laneId, setLaneId] = useState(lanes[0].id);
  const [priority, setPriority] = useState<Priority>("balanced");
  const reduce = useReducedMotion();

  const index = Math.max(
    0,
    lanes.findIndex((l) => l.id === laneId),
  );
  const lane = lanes[index];

  /** Wrap around, so stepping never dead-ends at either end of the list. */
  const step = (by: number) =>
    setLaneId(lanes[(index + by + lanes.length) % lanes.length].id);
  const ranked = useMemo(() => rank(lane.services, priority), [lane, priority]);
  const winner = ranked[0];
  const saving = savingAgainstDearest(lane.services, winner);

  return (
    <div className="console">
      <Surface beam className="console-shell">
        <div className="console-core">
          {/* ---- Lane ------------------------------------------------- */}
          <div className="console-map">
            <LaneMap
              from={cityKey(lane.origin) as never}
              to={cityKey(lane.destination) as never}
              fromLabel={lane.from}
              toLabel={lane.to}
            />

            {/* Stepping through the lanes matters as much as the dropdown:
                a single route behind a hidden <select> reads as one static
                label, and the thirty-six lanes behind it stay invisible. */}
            <div className="console-overlay">
              <div className="console-picker">
                <button
                  type="button"
                  className="console-step"
                  onClick={() => step(-1)}
                  aria-label="Previous lane"
                >
                  <svg
                    width="7"
                    height="11"
                    viewBox="0 0 7 11"
                    aria-hidden="true"
                  >
                    <path
                      d="M5.75 1.25 1.5 5.5l4.25 4.25"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <div className="console-lane">
                  <label htmlFor="console-lane" className="sr">
                    Shipping lane
                  </label>
                  <select
                    id="console-lane"
                    className="console-select"
                    value={laneId}
                    onChange={(event) => setLaneId(event.target.value)}
                  >
                    {lanes.map((l) => (
                      <option key={l.id} value={l.id}>
                        {l.origin} to {l.destination}
                      </option>
                    ))}
                  </select>
                  <span className="console-route" aria-hidden="true">
                    <b>{lane.origin}</b>
                    <i className="console-arrow" />
                    <b>{lane.destination}</b>
                    <svg
                      className="console-chev"
                      width="9"
                      height="6"
                      viewBox="0 0 9 6"
                    >
                      <path
                        d="M1 1.25 4.5 4.75 8 1.25"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                </div>

                <button
                  type="button"
                  className="console-step"
                  onClick={() => step(1)}
                  aria-label="Next lane"
                >
                  <svg
                    width="7"
                    height="11"
                    viewBox="0 0 7 11"
                    aria-hidden="true"
                  >
                    <path
                      d="M1.25 1.25 5.5 5.5l-4.25 4.25"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>

                <span className="console-count mono" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}/{lanes.length}
                </span>
              </div>

              <dl className="console-spec">
                <div>
                  <dt>Parcel</dt>
                  <dd className="num">2.0 kg</dd>
                </div>
                <div>
                  <dt>Size</dt>
                  <dd className="num">30 &times; 20 &times; 15</dd>
                </div>
                <div>
                  <dt>Quotes</dt>
                  <dd className="num">{lane.services.length}</dd>
                </div>
              </dl>
            </div>
          </div>

          {/* ---- Priority --------------------------------------------- */}
          <div className="console-priority">
            <span className="console-priority-label">Optimise for</span>
            <Segmented
              name="priority"
              value={priority}
              options={priorities.map((p) => ({
                value: p.id,
                label: p.short,
                title: p.label,
              }))}
              onChange={(value) => setPriority(value as Priority)}
            />
          </div>

          {/* ---- Ranked rates ----------------------------------------- */}
          <motion.ul className="console-rows" layout={!reduce}>
            {ranked.map((service, i) => (
              <motion.li
                key={service.id}
                layout={!reduce}
                transition={
                  reduce
                    ? { duration: 0 }
                    : { type: "spring", duration: 0.45, bounce: 0.12 }
                }
                className="console-row"
                data-match={i === 0 || undefined}
              >
                <span className="console-rank num" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="console-service">
                  <b>{service.name}</b>
                  <em>
                    {service.partner}
                    {service.source === "own" ? " (your rate)" : ""}
                  </em>
                </span>
                <span className="console-days num">
                  {service.days} <i>{service.days === 1 ? "day" : "days"}</i>
                </span>
                <span className="console-price num">{euro(service.price)}</span>
              </motion.li>
            ))}
          </motion.ul>

          {/* ---- Verdict ---------------------------------------------- */}
          <div className="console-foot">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${lane.id}-${priority}`}
                className="console-verdict"
                initial={reduce ? false : { opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={reduce ? undefined : { opacity: 0, y: -5 }}
                transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
              >
                <span className="console-verdict-text">
                  <b>{winner.name}</b> wins this lane at {euro(winner.price)}.
                </span>
                {saving > 0 ? (
                  <span className="console-saving">
                    <NumberTicker
                      key={`${lane.id}-${priority}-s`}
                      value={saving}
                      suffix="%"
                      duration={520}
                    />
                    <i>under the dearest</i>
                  </span>
                ) : null}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </Surface>

      <p className="console-note">
        Example rates and delivery estimates. Not a live carrier quote.
      </p>
    </div>
  );
}
