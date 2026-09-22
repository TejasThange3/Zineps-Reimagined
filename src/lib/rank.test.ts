import { describe, expect, it } from "vitest";
import { rank, savingAgainstDearest } from "./rank";
import { lanes } from "../data/shipping";
import type { Service } from "../data/shipping";

const service = (
  id: string,
  price: number,
  days: number,
  partner = "Test Partner",
): Service => ({
  id,
  name: id,
  partner,
  source: "partner",
  price,
  days,
  note: "",
});

describe("rank", () => {
  const set = [
    service("cheap-slow", 5, 6),
    service("dear-fast", 20, 1),
    service("middle", 9, 3),
  ];

  it("returns an empty array for no services", () => {
    expect(rank([], "balanced")).toEqual([]);
  });

  it("orders by price for cost", () => {
    expect(rank(set, "cost").map((s) => s.id)).toEqual([
      "cheap-slow",
      "middle",
      "dear-fast",
    ]);
  });

  it("orders by transit days for speed", () => {
    expect(rank(set, "speed").map((s) => s.id)).toEqual([
      "dear-fast",
      "middle",
      "cheap-slow",
    ]);
  });

  it("picks the compromise for balanced", () => {
    expect(rank(set, "balanced")[0].id).toBe("middle");
  });

  it("does not divide by zero when every price is equal", () => {
    const flat = [service("a", 8, 1), service("b", 8, 4)];
    expect(rank(flat, "balanced").map((s) => s.id)).toEqual(["a", "b"]);
  });

  it("does not divide by zero when every transit time is equal", () => {
    const flat = [service("a", 12, 2), service("b", 7, 2)];
    expect(rank(flat, "balanced").map((s) => s.id)).toEqual(["b", "a"]);
  });

  it("breaks ties on price, then days, then id", () => {
    const tied = [service("b", 10, 2), service("a", 10, 2)];
    expect(rank(tied, "balanced").map((s) => s.id)).toEqual(["a", "b"]);
  });

  it("does not mutate the array it is given", () => {
    const original = [...set];
    rank(set, "cost");
    expect(set).toEqual(original);
  });

  it("returns every service, for every lane and priority", () => {
    for (const lane of lanes) {
      for (const priority of ["cost", "speed", "balanced"] as const) {
        const result = rank(lane.services, priority);
        expect(result).toHaveLength(lane.services.length);
        expect(new Set(result.map((s) => s.id)).size).toBe(result.length);
      }
    }
  });
});

describe("savingAgainstDearest", () => {
  const set = [service("a", 5, 4), service("b", 10, 2)];

  it("reports the percentage under the most expensive option", () => {
    expect(savingAgainstDearest(set, set[0])).toBe(50);
  });

  it("reports nothing when the winner is the dearest option", () => {
    expect(savingAgainstDearest(set, set[1])).toBe(0);
  });
});
