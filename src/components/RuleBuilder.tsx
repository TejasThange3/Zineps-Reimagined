import { useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { Surface } from "./Surface";

/**
 * Automation rules, shown by letting you build one.
 *
 * The three selects are the real vocabulary of a Zineps rule: a field, a
 * comparison and a value. The chosen service and the sentence underneath are
 * derived, so the page cannot drift out of step with the controls.
 *
 * Illustrative. It does not write a rule to any account.
 */

const fields = [
  { id: "country", label: "Destination country" },
  { id: "weight", label: "Parcel weight" },
  { id: "value", label: "Order value" },
] as const;

type FieldId = (typeof fields)[number]["id"];

const values: Record<
  FieldId,
  { id: string; label: string; service: string; why: string }[]
> = {
  country: [
    {
      id: "nl",
      label: "Netherlands",
      service: "Routewise Standard",
      why: "Domestic parcels go on the cheapest tracked service in the network.",
    },
    {
      id: "de",
      label: "Germany",
      service: "Routewise Standard",
      why: "The partner holding the best German lane picks this one up.",
    },
    {
      id: "us",
      label: "United States",
      service: "Swiftline Express",
      why: "Outside the EU, customs paperwork is generated with the label.",
    },
  ],
  weight: [
    {
      id: "light",
      label: "under 2 kg",
      service: "Pickup Point Direct",
      why: "Light parcels fit a letterbox or collection point, at the lowest rate.",
    },
    {
      id: "mid",
      label: "2 to 10 kg",
      service: "Routewise Standard",
      why: "Standard home delivery with tracking and delivery updates.",
    },
    {
      id: "heavy",
      label: "over 10 kg",
      service: "Freightline Pallet",
      why: "Past the parcel ceiling, the rule moves the shipment to freight.",
    },
  ],
  value: [
    {
      id: "low",
      label: "under 50 euro",
      service: "Parcelway Economy",
      why: "Low-value orders take the cheapest option that still tracks.",
    },
    {
      id: "mid",
      label: "50 to 250 euro",
      service: "Routewise Standard",
      why: "Mid-value orders get a firmer delivery window.",
    },
    {
      id: "high",
      label: "over 250 euro",
      service: "Swiftline Express",
      why: "High-value orders travel signed for, with priority handling.",
    },
  ],
};

export function RuleBuilder() {
  const [field, setField] = useState<FieldId>("country");
  const [valueId, setValueId] = useState("de");
  const reduce = useReducedMotion();

  const options = values[field];
  const selected = useMemo(
    () => options.find((option) => option.id === valueId) ?? options[0],
    [options, valueId],
  );

  const onField = (next: FieldId) => {
    setField(next);
    setValueId(values[next][1].id);
  };

  const comparison = field === "country" ? "is" : "is";

  return (
    <div className="rule">
      <Surface beam className="rule-shell">
        <div className="rule-core">
          <p className="rule-line">
            <span className="rule-kw">When</span>

            <label className="sr" htmlFor="rule-field">
              Order field
            </label>
            <span className="rule-slot">
              <select
                id="rule-field"
                value={field}
                onChange={(event) => onField(event.target.value as FieldId)}
              >
                {fields.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.label}
                  </option>
                ))}
              </select>
              <span aria-hidden="true">
                {fields.find((f) => f.id === field)?.label}
              </span>
            </span>

            <span className="rule-op">{comparison}</span>

            <label className="sr" htmlFor="rule-value">
              Value
            </label>
            <span className="rule-slot">
              <select
                id="rule-value"
                value={valueId}
                onChange={(event) => setValueId(event.target.value)}
              >
                {options.map((option) => (
                  <option key={option.id} value={option.id}>
                    {option.label}
                  </option>
                ))}
              </select>
              <span aria-hidden="true">{selected.label}</span>
            </span>
          </p>

          <div className="rule-out">
            <span className="rule-kw">then ship with</span>
            <AnimatePresence mode="wait" initial={false}>
              <motion.span
                key={selected.service}
                className="rule-service"
                initial={
                  reduce ? false : { opacity: 0, y: 6, filter: "blur(2px)" }
                }
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={
                  reduce
                    ? undefined
                    : { opacity: 0, y: -6, filter: "blur(2px)" }
                }
                transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
              >
                {selected.service}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>
      </Surface>

      <AnimatePresence mode="wait" initial={false}>
        <motion.p
          key={selected.why}
          className="rule-why"
          initial={reduce ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={reduce ? undefined : { opacity: 0 }}
          transition={{ duration: 0.18 }}
        >
          {selected.why}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
