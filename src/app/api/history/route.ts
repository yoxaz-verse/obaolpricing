import { NextRequest, NextResponse } from "next/server";
import { getHistory } from "@/lib/history";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const daysRaw = request.nextUrl.searchParams.get("days");
    const parsed = daysRaw ? Number(daysRaw) : 365;
    const days = Number.isFinite(parsed) ? parsed : 365;
    const safeDays = Math.min(Math.max(days, 1), 1825);
    const pageRaw = Number(request.nextUrl.searchParams.get("page") ?? 1);
    const pageSizeRaw = Number(request.nextUrl.searchParams.get("pageSize") ?? 15);
    const page = Math.max(Number.isFinite(pageRaw) ? Math.floor(pageRaw) : 1, 1);
    const pageSize = Math.min(Math.max(Number.isFinite(pageSizeRaw) ? Math.floor(pageSizeRaw) : 15, 1), 100);
    const history = await getHistory(safeDays);
    const orderedDesc = history.slice().sort((a, b) => b.date.getTime() - a.date.getTime());
    const total = orderedDesc.length;
    const totalPages = Math.max(Math.ceil(total / pageSize), 1);
    const start = (page - 1) * pageSize;
    const items = orderedDesc.slice(start, start + pageSize);

    return NextResponse.json({
      days: safeDays,
      count: total,
      items,
      total,
      page,
      pageSize,
      totalPages,
      history,
    });
  } catch (error) {
    console.error("GET /api/history failed", error);
    return NextResponse.json({ error: "Failed to load history" }, { status: 500 });
  }
}
