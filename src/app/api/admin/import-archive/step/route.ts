import { NextRequest, NextResponse } from "next/server";
import { badAuthResponse, isAdminAuthorizedOrDevBypass } from "@/lib/api-auth";
import { runAdminJobStep } from "@/lib/admin-jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  jobId?: string;
  batchSize?: number;
};

export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!isAdminAuthorizedOrDevBypass(auth, process.env.ADMIN_API_TOKEN)) {
    return badAuthResponse();
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Body;
    if (!body.jobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 });
    }

    const job = await runAdminJobStep({
      jobId: body.jobId,
      batchSize: body.batchSize,
    });

    return NextResponse.json({ ok: true, job });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to process archive step";
    console.error("POST /api/admin/import-archive/step failed", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
