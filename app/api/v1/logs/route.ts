/**
 * GET /api/v1/logs — last 50 requests for the session user
 */
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { createClient } from "@supabase/supabase-js";

async function getSessionUser(req: NextRequest) {
  const accessToken = req.cookies.get("sb-access-token")?.value ?? null;
  if (!accessToken) return null;
  const client = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { global: { headers: { Authorization: `Bearer ${accessToken}` } } }
  );
  const { data: { user } } = await client.auth.getUser();
  return user;
}

export async function GET(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 500 });

  const { data } = await db
    .from("pdfapi_requests")
    .select("id, request_id, endpoint, status, input_type, output_size_bytes, response_ms, pdf_gen_ms, error_code, is_test, created_at")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(50);

  return NextResponse.json({ logs: data ?? [] });
}
