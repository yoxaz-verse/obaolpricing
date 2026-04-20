import { NextRequest, NextResponse } from "next/server";
import { badAuthResponse, isAdminAuthorizedOrDevBypass } from "@/lib/api-auth";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!isAdminAuthorizedOrDevBypass(auth, process.env.ADMIN_API_TOKEN)) {
    return badAuthResponse();
  }

  try {
    const pageRaw = Number(request.nextUrl.searchParams.get("page") ?? 1);
    const pageSizeRaw = Number(request.nextUrl.searchParams.get("pageSize") ?? 25);
    const pageSize = Math.min(Math.max(Number.isFinite(pageSizeRaw) ? Math.floor(pageSizeRaw) : 25, 1), 100);
    const page = Math.max(Number.isFinite(pageRaw) ? Math.floor(pageRaw) : 1, 1);
    const skip = (page - 1) * pageSize;

    const [items, total] = await Promise.all([
      prisma.extractionRun.findMany({
        orderBy: { startedAt: "desc" },
        skip,
        take: pageSize,
      }),
      prisma.extractionRun.count(),
    ]);
    const totalPages = Math.max(Math.ceil(total / pageSize), 1);

    return NextResponse.json({
      items,
      total,
      page,
      pageSize,
      totalPages,
      runs: items,
    });
  } catch (error) {
    console.error("GET /api/admin/runs failed", error);
    return NextResponse.json({ error: "Failed to fetch extraction runs" }, { status: 500 });
  }
}
