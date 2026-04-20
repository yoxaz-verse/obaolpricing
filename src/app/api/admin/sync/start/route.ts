import { NextRequest, NextResponse } from "next/server";
import { badAuthResponse, isAdminAuthorizedOrDevBypass } from "@/lib/api-auth";
import { startSyncJob } from "@/lib/admin-jobs";
import type { DailySyncSlot } from "@/lib/spicesboard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  slot?: DailySyncSlot;
};

export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!isAdminAuthorizedOrDevBypass(auth, process.env.ADMIN_API_TOKEN)) {
    return badAuthResponse();
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Body;
    const slot = body.slot ?? "manual";
    if (!["slot_1100", "slot_1400", "manual"].includes(slot)) {
      return NextResponse.json({ error: "Invalid slot" }, { status: 400 });
    }

    const job = await startSyncJob({ slot });
    return NextResponse.json({ ok: true, job });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to start sync job";
    console.error("POST /api/admin/sync/start failed", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
