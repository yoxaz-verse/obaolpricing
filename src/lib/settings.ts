import { prisma } from "@/lib/db";
import { getMarketFactorDefault } from "@/lib/env";
import { DEFAULT_GRADE_MULTIPLIERS, sanitizeGradeMultipliers, type GradeMultipliers } from "@/lib/pricing";
import {
  defaultVariantDefinitions,
  sanitizeVariantDefinitions,
  toCanonicalMultiplierMap,
  type VariantDefinition,
} from "@/lib/variants";

const SETTINGS_KEYS = {
  marketFactor: "market_factor",
  variantRupeeAddon: "variant_rupee_addon",
  sourceUrl: "source_url",
  keywordRules: "keyword_rules",
  gradeMultipliers: "grade_multipliers",
  variantDefinitions: "variant_definitions",
};

export const DEFAULT_SOURCE_URL =
  "https://www.indianspices.com/marketing/price/domestic/daily-price-small.html";

export async function getMarketFactor() {
  const row = await prisma.appSetting.findUnique({ where: { key: SETTINGS_KEYS.marketFactor } });
  if (!row) return getMarketFactorDefault();
  const value = Number(row.value);
  return Number.isFinite(value) && value > 0 ? value : getMarketFactorDefault();
}

export async function ensureDefaultSettings() {
  await prisma.appSetting.upsert({
    where: { key: SETTINGS_KEYS.marketFactor },
    update: {},
    create: { key: SETTINGS_KEYS.marketFactor, value: getMarketFactorDefault() },
  });

  await prisma.appSetting.upsert({
    where: { key: SETTINGS_KEYS.sourceUrl },
    update: {},
    create: { key: SETTINGS_KEYS.sourceUrl, value: DEFAULT_SOURCE_URL },
  });

  await prisma.appSetting.upsert({
    where: { key: SETTINGS_KEYS.variantRupeeAddon },
    update: {},
    create: { key: SETTINGS_KEYS.variantRupeeAddon, value: 0 },
  });

  await prisma.appSetting.upsert({
    where: { key: SETTINGS_KEYS.keywordRules },
    update: {},
    create: {
      key: SETTINGS_KEYS.keywordRules,
      value: ["cardamom", "auction", "avg", "average", "bodinayakanur", "spices board"],
    },
  });

  await prisma.appSetting.upsert({
    where: { key: SETTINGS_KEYS.gradeMultipliers },
    update: {},
    create: {
      key: SETTINGS_KEYS.gradeMultipliers,
      value: DEFAULT_GRADE_MULTIPLIERS,
    },
  });

  await prisma.appSetting.upsert({
    where: { key: SETTINGS_KEYS.variantDefinitions },
    update: {},
    create: {
      key: SETTINGS_KEYS.variantDefinitions,
      value: defaultVariantDefinitions(),
    },
  });
}

export async function getGradeMultipliers() {
  const variants = await getVariantDefinitions();
  if (variants.length > 0) {
    return sanitizeGradeMultipliers(toCanonicalMultiplierMap(variants) as Partial<GradeMultipliers>);
  }

  const row = await prisma.appSetting.findUnique({ where: { key: SETTINGS_KEYS.gradeMultipliers } });
  if (!row || typeof row.value !== "object" || Array.isArray(row.value)) {
    return DEFAULT_GRADE_MULTIPLIERS;
  }
  return sanitizeGradeMultipliers(row.value as Partial<GradeMultipliers>);
}

export async function getVariantDefinitions() {
  const row = await prisma.appSetting.findUnique({ where: { key: SETTINGS_KEYS.variantDefinitions } });
  return sanitizeVariantDefinitions(row?.value);
}

export async function getVariantRupeeAddon() {
  const row = await prisma.appSetting.findUnique({ where: { key: SETTINGS_KEYS.variantRupeeAddon } });
  const value = Number(row?.value);
  return Number.isFinite(value) ? value : 0;
}

export async function getAdminSettings() {
  const [marketFactor, variantRupeeAddon, gradeMultipliers, variantDefinitions, sourceUrl, keywordRules] = await Promise.all([
    getMarketFactor(),
    getVariantRupeeAddon(),
    getGradeMultipliers(),
    getVariantDefinitions(),
    prisma.appSetting.findUnique({ where: { key: SETTINGS_KEYS.sourceUrl } }),
    prisma.appSetting.findUnique({ where: { key: SETTINGS_KEYS.keywordRules } }),
  ]);

  return {
    marketFactor,
    variantRupeeAddon,
    gradeMultipliers,
    sourceUrl:
      typeof sourceUrl?.value === "string"
        ? sourceUrl.value
        : DEFAULT_SOURCE_URL,
    keywordRules: Array.isArray(keywordRules?.value) ? keywordRules?.value : [],
    variantDefinitions,
  };
}

export async function updateAdminSettings(input: {
  marketFactor?: number;
  variantRupeeAddon?: number;
  gradeMultipliers?: Partial<GradeMultipliers>;
  variantDefinitions?: VariantDefinition[];
  sourceUrl?: string;
  keywordRules?: string[];
}) {
  if (input.marketFactor !== undefined) {
    const value = Number(input.marketFactor);
    if (Number.isFinite(value) && value > 0) {
      await prisma.appSetting.upsert({
        where: { key: SETTINGS_KEYS.marketFactor },
        update: { value },
        create: { key: SETTINGS_KEYS.marketFactor, value },
      });
    }
  }

  if (input.variantRupeeAddon !== undefined) {
    const value = Number(input.variantRupeeAddon);
    if (Number.isFinite(value)) {
      await prisma.appSetting.upsert({
        where: { key: SETTINGS_KEYS.variantRupeeAddon },
        update: { value },
        create: { key: SETTINGS_KEYS.variantRupeeAddon, value },
      });
    }
  }

  if (input.gradeMultipliers) {
    const sanitized = sanitizeGradeMultipliers(input.gradeMultipliers);
    await prisma.appSetting.upsert({
      where: { key: SETTINGS_KEYS.gradeMultipliers },
      update: { value: sanitized },
      create: { key: SETTINGS_KEYS.gradeMultipliers, value: sanitized },
    });
  }

  if (Array.isArray(input.variantDefinitions)) {
    const sanitizedVariants = sanitizeVariantDefinitions(input.variantDefinitions);
    await prisma.appSetting.upsert({
      where: { key: SETTINGS_KEYS.variantDefinitions },
      update: { value: sanitizedVariants },
      create: { key: SETTINGS_KEYS.variantDefinitions, value: sanitizedVariants },
    });

    const canonical = sanitizeGradeMultipliers(toCanonicalMultiplierMap(sanitizedVariants) as Partial<GradeMultipliers>);
    await prisma.appSetting.upsert({
      where: { key: SETTINGS_KEYS.gradeMultipliers },
      update: { value: canonical },
      create: { key: SETTINGS_KEYS.gradeMultipliers, value: canonical },
    });
  }

  if (input.sourceUrl && input.sourceUrl.startsWith("http")) {
    await prisma.appSetting.upsert({
      where: { key: SETTINGS_KEYS.sourceUrl },
      update: { value: input.sourceUrl },
      create: { key: SETTINGS_KEYS.sourceUrl, value: input.sourceUrl },
    });
  }

  if (Array.isArray(input.keywordRules)) {
    const cleaned = input.keywordRules.map((item) => item.trim()).filter(Boolean);
    await prisma.appSetting.upsert({
      where: { key: SETTINGS_KEYS.keywordRules },
      update: { value: cleaned },
      create: { key: SETTINGS_KEYS.keywordRules, value: cleaned },
    });
  }

  return getAdminSettings();
}

export async function getSourceUrl() {
  const row = await prisma.appSetting.findUnique({ where: { key: SETTINGS_KEYS.sourceUrl } });
  if (typeof row?.value === "string" && row.value.startsWith("http")) {
    return row.value;
  }
  return DEFAULT_SOURCE_URL;
}
