import { describe, expect, it } from "vitest";
import { computeVariantValue, getActiveVariants, sanitizeVariantDefinitions } from "@/lib/variants";

describe("computeVariantValue", () => {
  it("computes live variant value from auction avg and market factor", () => {
    const result = computeVariantValue(2500, 1.02, 1.15);
    expect(result).toBe(2932.5);
  });

  it("applies global rupee add-on after multiplier", () => {
    const result = computeVariantValue(2774.74, 1, 1, 50);
    expect(result).toBe(2824.74);
  });
});

describe("sanitizeVariantDefinitions", () => {
  it("preserves default variants and returns active list in order", () => {
    const variants = sanitizeVariantDefinitions([
      { id: "price7", label: "7 Grade", multiplier: 1, active: true, order: 1 },
      { id: "custom", label: "Custom", multiplier: 1.3, active: false, order: 2 },
    ]);
    const active = getActiveVariants(variants);
    expect(active[0]?.id).toBe("price7");
    expect(active.some((variant) => variant.id === "custom")).toBe(false);
    expect(variants.some((variant) => variant.id === "price8Plus")).toBe(true);
  });
});
