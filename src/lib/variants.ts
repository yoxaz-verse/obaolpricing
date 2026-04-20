export type VariantDefinition = {
  id: string;
  label: string;
  multiplier: number;
  active: boolean;
  order: number;
  highlight?: boolean;
};

const DEFAULTS: VariantDefinition[] = [
  { id: "price7", label: "7 Grade", multiplier: 1, active: true, order: 1, highlight: true },
  { id: "price78", label: "7 to 8", multiplier: 1.07, active: true, order: 2 },
  { id: "price8", label: "8 Grade", multiplier: 1.15, active: true, order: 3 },
  { id: "price8Plus", label: "8+ Grade", multiplier: 1.22, active: true, order: 4 },
  { id: "price6", label: "6 Grade", multiplier: 0.88, active: true, order: 5 },
  { id: "price67", label: "6 to 7", multiplier: 0.94, active: true, order: 6 },
];

const CANONICAL_IDS = new Set(["price6", "price67", "price7", "price78", "price8", "price8Plus"]);

export function defaultVariantDefinitions() {
  return DEFAULTS.map((item) => ({ ...item }));
}

export function sanitizeVariantDefinitions(raw: unknown): VariantDefinition[] {
  if (!Array.isArray(raw)) {
    return defaultVariantDefinitions();
  }

  const dedup = new Set<string>();
  const sanitized: VariantDefinition[] = [];

  for (let index = 0; index < raw.length; index += 1) {
    const item = raw[index];
    if (!item || typeof item !== "object") continue;

    const maybe = item as Partial<VariantDefinition>;
    const id = String(maybe.id ?? "").trim();
    if (!id || dedup.has(id)) continue;
    dedup.add(id);

    const multiplier = Number(maybe.multiplier);
    const order = Number(maybe.order);
    const active = Boolean(maybe.active);
    const label = String(maybe.label ?? id).trim();

    sanitized.push({
      id,
      label: label || id,
      multiplier: Number.isFinite(multiplier) && multiplier > 0 && multiplier < 10 ? multiplier : 1,
      active,
      order: Number.isFinite(order) ? order : index + 1,
      highlight: Boolean(maybe.highlight),
    });
  }

  for (const fallback of DEFAULTS) {
    if (!sanitized.some((item) => item.id === fallback.id)) {
      sanitized.push({ ...fallback });
    }
  }

  return sanitized.sort((a, b) => a.order - b.order || a.id.localeCompare(b.id));
}

export function toCanonicalMultiplierMap(variants: VariantDefinition[]) {
  const output: Record<string, number> = {
    price6: 0.88,
    price67: 0.94,
    price7: 1,
    price78: 1.07,
    price8: 1.15,
    price8Plus: 1.22,
  };

  for (const variant of variants) {
    if (!CANONICAL_IDS.has(variant.id)) continue;
    output[variant.id] = variant.multiplier;
  }

  return output;
}

export function computeVariantValue(
  auctionAvg: number,
  marketFactor: number,
  multiplier: number,
  variantRupeeAddon = 0,
) {
  const base = auctionAvg * marketFactor;
  return Math.round((base * multiplier + variantRupeeAddon) * 100) / 100;
}

export function getActiveVariants(variants: VariantDefinition[]) {
  return variants.filter((variant) => variant.active).sort((a, b) => a.order - b.order);
}
