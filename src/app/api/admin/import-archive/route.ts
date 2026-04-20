import { NextRequest, NextResponse } from "next/server";
import { badAuthResponse, isAdminAuthorizedOrDevBypass } from "@/lib/api-auth";
import { runAdminJobStep, startArchiveImportJob } from "@/lib/admin-jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ImportBody = {
  filePath?: string;
  minDate?: string;
};

export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!isAdminAuthorizedOrDevBypass(auth, process.env.ADMIN_API_TOKEN)) {
    return badAuthResponse();
  }

  try {
    const body = (await request.json().catch(() => ({}))) as ImportBody;
    const job = await startArchiveImportJob({
      filePath: body.filePath,
      minDate: body.minDate,
    });
    let progress = job;
    while (progress.status === "running" || progress.status === "queued") {
      progress = await runAdminJobStep({ jobId: progress.id, batchSize: 25 });
    }

    return NextResponse.json({
      ok: progress.status !== "failed",
      result: {
        importedDates: progress.totalItems,
        upserts: progress.successCount,
        errors: progress.errorCount,
      },
      job: progress,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Archive import failed";
    console.error("POST /api/admin/import-archive failed", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
