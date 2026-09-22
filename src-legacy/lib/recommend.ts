import type { Priority, Service } from "../data/shipments";

/** Balanced = 55% normalized price + 45% normalized delivery time, lower wins.
 * Equal ranges contribute zero. Ties: lower price, fewer days, lexicographic ID.
 */
export function recommend(services: Service[], priority: Priority): Service {
  if (!services.length) throw new Error("At least one service is required");
  const minPrice = Math.min(...services.map((s) => s.price));
  const maxPrice = Math.max(...services.map((s) => s.price));
  const minDays = Math.min(...services.map((s) => s.days));
  const maxDays = Math.max(...services.map((s) => s.days));
  const score = (s: Service) =>
    priority === "cost"
      ? s.price
      : priority === "speed"
        ? s.days
        : (0.55 * (s.price - minPrice)) / (maxPrice - minPrice || 1) +
          (0.45 * (s.days - minDays)) / (maxDays - minDays || 1);
  return [...services].sort(
    (a, b) =>
      score(a) - score(b) ||
      a.price - b.price ||
      a.days - b.days ||
      a.id.localeCompare(b.id),
  )[0];
}
