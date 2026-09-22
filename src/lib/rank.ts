import type { Priority, Service } from "../data/shipping";

/**
 * Rank services for a stated priority, best first.
 *
 * cost     -> lowest price
 * speed    -> fewest business days
 * balanced -> 0.55 * normalised price + 0.45 * normalised days
 *
 * Values are normalised inside the selected lane, so a lane where every
 * service costs the same contributes nothing from the price term. Ties break
 * on price, then days, then service id, which keeps the order deterministic.
 */
export function rank(services: Service[], priority: Priority): Service[] {
  if (!services.length) return [];

  const prices = services.map((s) => s.price);
  const days = services.map((s) => s.days);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const minDays = Math.min(...days);
  const maxDays = Math.max(...days);

  const score = (s: Service) => {
    if (priority === "cost") return s.price;
    if (priority === "speed") return s.days;
    const p = (s.price - minPrice) / (maxPrice - minPrice || 1);
    const d = (s.days - minDays) / (maxDays - minDays || 1);
    return 0.55 * p + 0.45 * d;
  };

  return [...services].sort(
    (a, b) =>
      score(a) - score(b) ||
      a.price - b.price ||
      a.days - b.days ||
      a.id.localeCompare(b.id),
  );
}

/** Saving of the ranked winner against the most expensive option in the lane. */
export function savingAgainstDearest(services: Service[], winner: Service) {
  const dearest = Math.max(...services.map((s) => s.price));
  if (dearest <= winner.price) return 0;
  return Math.round(((dearest - winner.price) / dearest) * 100);
}
