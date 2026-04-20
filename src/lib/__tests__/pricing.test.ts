import { describe, expect, it } from "vitest";
import { computePrices, getTrendDirection, sanitizeGradeMultipliers } from "@/lib/pricing";

describe("computePrices", () => {
  it("applies formula and expanded grade multipliers", () => {
    const result = computePrices(2500, 1.02);
    expect(result.price7).toBe(2805);
    expect(result.price8).toBe(3225.75);
    expect(result.price6).toBe(2468.4);
    expect(result.price67).toBe(2636.7);
    expect(result.price78).toBe(3001.35);
    expect(result.price8Plus).toBe(3422.1);
  });
});

describe("getTrendDirection", () => {
  it("returns direction relative to previous day", () => {
    expect(getTrendDirection(2100, 2000)).toBe("up");
    expect(getTrendDirection(1900, 2000)).toBe("down");
    expect(getTrendDirection(2000, 2000)).toBe("flat");
    expect(getTrendDirection(2000, null)).toBe("flat");
  });
});

describe("sanitizeGradeMultipliers", () => {
  it("falls back to defaults for invalid values", () => {
    const normalized = sanitizeGradeMultipliers({
      price6: 0,
      price67: 0.95,
      price7: -1,
      price78: 1.09,
      price8: 100,
      price8Plus: 1.25,
    });

    expect(normalized.price6).toBe(0.88);
    expect(normalized.price67).toBe(0.95);
    expect(normalized.price7).toBe(1);
    expect(normalized.price78).toBe(1.09);
    expect(normalized.price8).toBe(1.15);
    expect(normalized.price8Plus).toBe(1.25);
  });
});
