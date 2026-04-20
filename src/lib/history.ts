import { prisma } from "@/lib/db";
import { istDateOnly } from "@/lib/time";

function hasDatabaseUrl() {
  return Boolean(process.env.DATABASE_URL);
}

export async function getHistory(days: number) {
  if (!hasDatabaseUrl()) return [];

  const safeDays = Math.min(Math.max(days, 1), 1825);
  const since = new Date();
  since.setDate(since.getDate() - safeDays + 1);
  since.setHours(0, 0, 0, 0);

  try {
    return await prisma.auctionPrice.findMany({
      where: { date: { gte: since } },
      orderBy: { date: "asc" },
    });
  } catch (error) {
    console.error("getHistory failed", error);
    return [];
  }
}

export async function getLatestWithPrevious() {
  if (!hasDatabaseUrl()) {
    return { latest: null, previous: null };
  }

  let latestTwo: any[] = [];
  try {
    latestTwo = await prisma.auctionPrice.findMany({
      orderBy: { date: "desc" },
      take: 2,
    });
  } catch (error) {
    console.error("getLatestWithPrevious failed", error);
  }

  return {
    latest: latestTwo[0] ?? null,
    previous: latestTwo[1] ?? null,
  };
}

export async function getLatestRunForToday() {
  if (!hasDatabaseUrl()) return null;

  const todayUtc = istDateOnly(new Date());

  try {
    return await prisma.extractionRun.findFirst({
      where: { runDate: todayUtc },
      orderBy: { startedAt: "desc" },
    });
  } catch (error) {
    console.error("getLatestRunForToday failed", error);
    return null;
  }
}

type WindowStatus = "success" | "failed" | "pending";

export async function getTodayWindowStatuses() {
  if (!hasDatabaseUrl()) {
    return {
      slot1100: "pending" as WindowStatus,
      slot1400: "pending" as WindowStatus,
    };
  }

  const todayUtc = istDateOnly(new Date());

  try {
    const runs = await prisma.extractionRun.findMany({
      where: {
        runDate: todayUtc,
        runType: "daily",
        videoId: { in: ["slot_1100", "slot_1400"] },
      },
      orderBy: { startedAt: "desc" },
    });

    const latest1100 = runs.find((run) => run.videoId === "slot_1100");
    const latest1400 = runs.find((run) => run.videoId === "slot_1400");

    const mapStatus = (status?: string): WindowStatus => {
      if (status === "success") return "success";
      if (status === "failed") return "failed";
      return "pending";
    };

    return {
      slot1100: mapStatus(latest1100?.status),
      slot1400: mapStatus(latest1400?.status),
    };
  } catch (error) {
    console.error("getTodayWindowStatuses failed", error);
    return {
      slot1100: "pending" as WindowStatus,
      slot1400: "pending" as WindowStatus,
    };
  }
}
