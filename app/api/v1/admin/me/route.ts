/** GET /api/v1/admin/me → { admin: boolean } — decides whether the dashboard shows the Users menu */
import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/pdf-api/session";
import { isAdminEmail } from "@/lib/pdf-api/admin";

export async function GET(req: NextRequest) {
  const user = await getSessionUser(req);
  return NextResponse.json({ admin: !!user && isAdminEmail(user.email) });
}
