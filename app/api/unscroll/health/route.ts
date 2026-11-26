import { NextResponse } from "next/server";
import { one } from "@/lib/unscroll/db";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/** Quick check after deploy: https://www.aivexallp.com/api/unscroll/health */
export async function GET() {
  try {
    const r = await one<{ n: string }>(`SELECT count(*) AS n FROM unscroll_users`);
    return NextResponse.json({ ok: true, db: true, users: Number(r?.n ?? 0), push: !!(process.env.UNSCROLL_FCM_SERVICE_ACCOUNT_FILE || process.env.UNSCROLL_FCM_SERVICE_ACCOUNT_JSON) });
  } catch (e) {
    return NextResponse.json({ ok: false, db: false, error: String((e as Error).message ?? e) }, { status: 503 });
  }
}
