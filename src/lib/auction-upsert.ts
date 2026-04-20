import { prisma } from "@/lib/db";
import { getMarketFactor } from "@/lib/settings";

export function isIsoDate(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export function parseDateOnly(value: string) {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(Date.UTC(year, month - 1, day));
}

export async function upsertFromAuctionAvg(input: {
  date: string;
  videoUrl?: string;
  auctionAvg: number;
  marketFactor?: number;
}) {
  const dbMarketFactor = await getMarketFactor();
  const marketFactor = Number.isFinite(Number(input.marketFactor)) && Number(input.marketFactor) > 0
    ? Number(input.marketFactor)
    : dbMarketFactor;
  const auctionAvg = Math.round(Number(input.auctionAvg) * 100) / 100;

  return prisma.auctionPrice.upsert({
    where: { date: parseDateOnly(input.date) },
    update: {
      videoUrl: input.videoUrl ?? "manual://override",
      auctionAvg,
      marketFactor,
      extractedAt: new Date(),
    },
    create: {
      date: parseDateOnly(input.date),
      videoUrl: input.videoUrl ?? "manual://override",
      auctionAvg,
      marketFactor,
      extractedAt: new Date(),
    },
  });
}
