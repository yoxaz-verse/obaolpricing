import { NextRequest, NextResponse } from "next/server";
import { badAuthResponse, isAdminAuthorizedOrDevBypass } from "@/lib/api-auth";
import { startArchiveImportJob } from "@/lib/admin-jobs";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Body = {
  filePath?: string;
  minDate?: string;
};

export async function POST(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!isAdminAuthorizedOrDevBypass(auth, process.env.ADMIN_API_TOKEN)) {
    return badAuthResponse();
  }

  try {
    const body = (await request.json().catch(() => ({}))) as Body;
    const job = await startArchiveImportJob({
      filePath: body.filePath,
      minDate: body.minDate,
    });

    return NextResponse.json({ ok: true, job });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to start archive import job";
    console.error("POST /api/admin/import-archive/start failed", error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
