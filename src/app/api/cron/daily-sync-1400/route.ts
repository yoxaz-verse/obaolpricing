import { NextRequest, NextResponse } from "next/server";
import { badAuthResponse, isAuthorizedFromBearer } from "@/lib/api-auth";
import { syncSpicesBoard } from "@/lib/spicesboard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");

  if (!isAuthorizedFromBearer(auth, process.env.CRON_SECRET)) {
    return badAuthResponse();
  }

  try {
    const result = await syncSpicesBoard({ slot: "slot_1400" });
    return NextResponse.json({ ok: true, result, slot: "slot_1400" });
  } catch (error) {
    console.error("GET /api/cron/daily-sync-1400 failed", error);
    const message = error instanceof Error ? error.message : "Cron sync failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
