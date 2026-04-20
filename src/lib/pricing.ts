export type ComputedPrices = {
  auctionAvg: number;
  marketFactor: number;
  price6: number;
  price67: number;
  price7: number;
  price78: number;
  price8: number;
  price8Plus: number;
};

export type GradeMultipliers = {
  price6: number;
  price67: number;
  price7: number;
  price78: number;
  price8: number;
  price8Plus: number;
};

export const DEFAULT_GRADE_MULTIPLIERS: GradeMultipliers = {
  price6: 0.88,
  price67: 0.94,
  price7: 1.0,
  price78: 1.07,
  price8: 1.15,
  price8Plus: 1.22,
};

function round2(value: number) {
  return Math.round(value * 100) / 100;
}

export function sanitizeGradeMultipliers(raw?: Partial<GradeMultipliers>): GradeMultipliers {
  const source = raw ?? {};
  const keys = Object.keys(DEFAULT_GRADE_MULTIPLIERS) as Array<keyof GradeMultipliers>;
  const normalized: Partial<GradeMultipliers> = {};

  for (const key of keys) {
    const value = Number(source[key]);
    normalized[key] =
      Number.isFinite(value) && value > 0 && value < 10
        ? value
        : DEFAULT_GRADE_MULTIPLIERS[key];
  }

  return normalized as GradeMultipliers;
}

export function computePrices(
  auctionAvg: number,
  marketFactor = 1.02,
  multipliers?: Partial<GradeMultipliers>,
): ComputedPrices {
  const safeMultipliers = sanitizeGradeMultipliers(multipliers);
  const basePrice7 = round2(auctionAvg * 1.1 * marketFactor);

  return {
    auctionAvg: round2(auctionAvg),
    marketFactor,
    price6: round2(basePrice7 * safeMultipliers.price6),
    price67: round2(basePrice7 * safeMultipliers.price67),
    price7: round2(basePrice7 * safeMultipliers.price7),
    price78: round2(basePrice7 * safeMultipliers.price78),
    price8: round2(basePrice7 * safeMultipliers.price8),
    price8Plus: round2(basePrice7 * safeMultipliers.price8Plus),
  };
}

export function getTrendDirection(current: number, previous: number | null) {
  if (previous === null) return "flat" as const;
  if (current > previous) return "up" as const;
  if (current < previous) return "down" as const;
  return "flat" as const;
}
