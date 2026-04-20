import { NextRequest, NextResponse } from "next/server";
import { badAuthResponse, isAdminAuthorizedOrDevBypass } from "@/lib/api-auth";
import { isIsoDate, upsertFromAuctionAvg } from "@/lib/auction-upsert";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!isAdminAuthorizedOrDevBypass(auth, process.env.ADMIN_API_TOKEN)) {
    return badAuthResponse();
  }

  try {
    const body = await request.json();
    const date = String(body.date ?? "");

    if (!isIsoDate(date)) {
      return NextResponse.json({ error: "date must be YYYY-MM-DD" }, { status: 400 });
    }

    if (Number.isFinite(Number(body.auctionAvg)) && Number(body.auctionAvg) > 0) {
      const result = await upsertFromAuctionAvg({
        date,
        videoUrl: typeof body.videoUrl === "string" ? body.videoUrl : undefined,
        auctionAvg: Number(body.auctionAvg),
        marketFactor: Number(body.marketFactor),
      });

      return NextResponse.json({ ok: true, mode: "auctionAvg", result });
    }

    return NextResponse.json({ error: "Provide auctionAvg value" }, { status: 400 });
  } catch (error) {
    console.error("POST /api/admin/manual-override failed", error);
    return NextResponse.json({ error: "Failed to save manual override" }, { status: 500 });
  }
}
