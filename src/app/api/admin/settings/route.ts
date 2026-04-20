import { NextRequest, NextResponse } from "next/server";
import { badAuthResponse, isAdminAuthorizedOrDevBypass } from "@/lib/api-auth";
import { ensureDefaultSettings, getAdminSettings, updateAdminSettings } from "@/lib/settings";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function isValidMultiplierObject(value: unknown) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return true;
}

export async function GET(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!isAdminAuthorizedOrDevBypass(auth, process.env.ADMIN_API_TOKEN)) {
    return badAuthResponse();
  }

  try {
    await ensureDefaultSettings();
    const settings = await getAdminSettings();
    return NextResponse.json(settings);
  } catch (error) {
    console.error("GET /api/admin/settings failed", error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  const auth = request.headers.get("authorization");
  if (!isAdminAuthorizedOrDevBypass(auth, process.env.ADMIN_API_TOKEN)) {
    return badAuthResponse();
  }

  try {
    const body = await request.json();

    const updated = await updateAdminSettings({
      marketFactor: Number(body.marketFactor),
      variantRupeeAddon: Number(body.variantRupeeAddon),
      gradeMultipliers: isValidMultiplierObject(body.gradeMultipliers) ? body.gradeMultipliers : undefined,
      variantDefinitions: Array.isArray(body.variantDefinitions) ? body.variantDefinitions : undefined,
      sourceUrl: typeof body.sourceUrl === "string" ? body.sourceUrl : undefined,
      keywordRules: Array.isArray(body.keywordRules) ? body.keywordRules.map((item: unknown) => String(item)) : undefined,
    });

    return NextResponse.json({ ok: true, settings: updated });
  } catch (error) {
    console.error("PUT /api/admin/settings failed", error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
