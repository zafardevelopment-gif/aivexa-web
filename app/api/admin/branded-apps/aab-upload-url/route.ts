// Issues a short-lived signed upload URL so the browser uploads the .aab
// DIRECTLY to private Supabase Storage (bypasses serverless body limits).
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { ADMIN_COOKIE, verifyToken } from "@/lib/admin-auth";

export async function POST(req: NextRequest) {
  const token = (await cookies()).get(ADMIN_COOKIE)?.value;
  if (!verifyToken(token)) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { appId } = await req.json().catch(() => ({}));
  if (!appId) return NextResponse.json({ error: "appId required" }, { status: 400 });

  const db = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
  const path = `${appId}/${Date.now()}.aab`;
  const { data, error } = await db.storage.from("branded-apps").createSignedUploadUrl(path);
  if (error || !data) return NextResponse.json({ error: "Could not create upload URL." }, { status: 500 });
  return NextResponse.json({ signedUrl: data.signedUrl, path });
}
