import { PrismaClient } from "@prisma/client";
import { DEFAULT_GRADE_MULTIPLIERS } from "../src/lib/pricing";
import { DEFAULT_SOURCE_URL } from "../src/lib/settings";

const prisma = new PrismaClient();

async function main() {
  await prisma.appSetting.upsert({
    where: { key: "market_factor" },
    update: {},
    create: { key: "market_factor", value: 1.02 },
  });

  await prisma.appSetting.upsert({
    where: { key: "source_url" },
    update: {},
    create: { key: "source_url", value: DEFAULT_SOURCE_URL },
  });

  await prisma.appSetting.upsert({
    where: { key: "variant_rupee_addon" },
    update: {},
    create: { key: "variant_rupee_addon", value: 0 },
  });

  await prisma.appSetting.upsert({
    where: { key: "keyword_rules" },
    update: {},
    create: {
      key: "keyword_rules",
      value: ["cardamom", "auction", "avg", "average", "bodinayakanur", "spices board"],
    },
  });

  await prisma.appSetting.upsert({
    where: { key: "grade_multipliers" },
    update: {},
    create: {
      key: "grade_multipliers",
      value: DEFAULT_GRADE_MULTIPLIERS,
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
