import { describe, expect, it } from "vitest";
import { lanes, type Service } from "../data/shipments";
import { recommend } from "./recommend";

describe("shipping recommendations", () => {
  for (const lane of lanes) {
    it(`chooses three meaningful options for ${lane.origin} → ${lane.destination}`, () => {
      expect(recommend(lane.services, "cost").id).toBe("economy");
      expect(recommend(lane.services, "speed").id).toBe("express");
      expect(recommend(lane.services, "balanced").id).toBe("standard");
      expect(recommend(lane.services, "cost").price).toBe(
        Math.min(...lane.services.map((s) => s.price)),
      );
      expect(recommend(lane.services, "speed").days).toBe(
        Math.min(...lane.services.map((s) => s.days)),
      );
    });
  }
  const option = (id: string, price: number, days: number): Service => ({
    id,
    price,
    days,
    name: id,
    feature: "Example",
  });
  it("resolves equal fastest estimates by cost", () => {
    expect(recommend([option("a", 9, 1), option("b", 8, 1)], "speed").id).toBe(
      "b",
    );
  });
  it("resolves equal cheapest prices by delivery time", () => {
    expect(recommend([option("a", 5, 3), option("b", 5, 2)], "cost").id).toBe(
      "b",
    );
  });
  it("handles zero ranges and resolves identical options consistently", () => {
    expect(
      recommend([option("b", 5, 2), option("a", 5, 2)], "balanced").id,
    ).toBe("a");
  });
  it("normalizes delivery when all prices are identical", () => {
    expect(
      recommend([option("a", 5, 4), option("b", 5, 2)], "balanced").id,
    ).toBe("b");
  });
  it("normalizes price when all delivery times are identical", () => {
    expect(
      recommend([option("a", 10, 2), option("b", 5, 2)], "balanced").id,
    ).toBe("b");
  });
  it("does not mutate service order", () => {
    const options = [option("z", 10, 2), option("a", 5, 1)];
    recommend(options, "balanced");
    expect(options.map((s) => s.id)).toEqual(["z", "a"]);
  });
  it("handles one option and rejects an empty list", () => {
    expect(recommend([option("a", 5, 2)], "balanced").id).toBe("a");
    expect(() => recommend([], "cost")).toThrow("At least one service");
  });
});
