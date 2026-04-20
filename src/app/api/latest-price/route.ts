import { NextResponse } from "next/server";
import { getLatestRunForToday, getLatestWithPrevious, getTodayWindowStatuses } from "@/lib/history";
import { getTrendDirection } from "@/lib/pricing";
import { getMarketFactor, getVariantDefinitions, getVariantRupeeAddon } from "@/lib/settings";
import { computeVariantValue, getActiveVariants } from "@/lib/variants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const [{ latest, previous }, latestRun, windows, marketFactor, variantRupeeAddon, allVariants] = await Promise.all([
      getLatestWithPrevious(),
      getLatestRunForToday(),
      getTodayWindowStatuses(),
      getMarketFactor(),
      getVariantRupeeAddon(),
      getVariantDefinitions(),
    ]);
    const variants = getActiveVariants(allVariants);

    if (!latest) {
      return NextResponse.json({
        latest: null,
        trend: "flat",
        previousAuctionAvg: null,
        todayComputedVariants: [],
        variantRupeeAddon,
        extractionStatus: latestRun
          ? {
              status: latestRun.status,
              error: latestRun.error,
              startedAt: latestRun.startedAt,
              finishedAt: latestRun.finishedAt,
              sourceRef: latestRun.videoId,
              dailyWindows: windows,
            }
          : { dailyWindows: windows },
      });
    }

    return NextResponse.json({
      latest,
      trend: getTrendDirection(latest.auctionAvg, previous?.auctionAvg ?? null),
      previousAuctionAvg: previous?.auctionAvg ?? null,
      todayComputedVariants: variants.map((variant) => ({
        id: variant.id,
        label: variant.label,
        value: computeVariantValue(latest.auctionAvg, marketFactor, variant.multiplier, variantRupeeAddon),
        active: variant.active,
        highlight: Boolean(variant.highlight),
        multiplier: variant.multiplier,
      })),
      variantRupeeAddon,
      extractionStatus: latestRun
        ? {
            status: latestRun.status,
            error: latestRun.error,
            startedAt: latestRun.startedAt,
            finishedAt: latestRun.finishedAt,
            sourceRef: latestRun.videoId,
            dailyWindows: windows,
          }
        : { dailyWindows: windows },
    });
  } catch (error) {
    console.error("GET /api/latest-price failed", error);
    return NextResponse.json({ error: "Failed to load latest price" }, { status: 500 });
  }
}
