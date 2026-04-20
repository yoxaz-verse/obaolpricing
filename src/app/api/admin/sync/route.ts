import { NextRequest, NextResponse } from "next/server";
import { badAuthResponse, isAdminAuthorizedOrDevBypass } from "@/lib/api-auth";
import { runAdminJobStep, startSyncJob } from "@/lib/admin-jobs";
import type { DailySyncSlot } from "@/lib/spicesboard";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SyncRequestBody = {
  slot?: DailySyncSlot;
};

export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!isAdminAuthorizedOrDevBypass(auth, process.env.ADMIN_API_TOKEN)) {
    return badAuthResponse();
  }

  try {
    const body = (await request.json().catch(() => ({}))) as SyncRequestBody;
    const slot = body.slot ?? "manual";
    if (!["slot_1100", "slot_1400", "manual"].includes(slot)) {
      return NextResponse.json({ error: "Invalid slot" }, { status: 400 });
    }

    const job = await startSyncJob({ slot });
    let progress = job;
    while (progress.status === "running" || progress.status === "queued") {
      progress = await runAdminJobStep({ jobId: progress.id, batchSize: 10 });
    }

    return NextResponse.json({
      ok: progress.status !== "failed",
      result: {
        upserts: progress.successCount,
        errors: progress.errorCount,
        processedDates: progress.processedItems,
      },
      job: progress,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Sync failed";
    console.error("POST /api/admin/sync failed", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
