/**
 * AIVEXA PDF API — GET /api/v1/logs
 * Returns request logs for the logged-in user.
 */

import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { createClient } from "@supabase/supabase-js";

async function getSessionUser(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  // Accept token from Authorization header OR cookie
  const authHeader = req.headers.get("authorization");
  const accessToken =
    (authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null) ??
    req.cookies.get("sb-access-token")?.value ??
    null;
  if (!accessToken) return null;

  const client = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
  const { data: { user } } = await client.auth.getUser();
  return user;
}

export async function GET(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 500 });

  const { searchParams } = new URL(req.url);
  const limit = Math.min(parseInt(searchParams.get("limit") ?? "100"), 500);
  const offset = parseInt(searchParams.get("offset") ?? "0");

  const { data: logs, error } = await db
    .from("pdfapi_requests")
    .select(
      "id, request_id, endpoint, status, input_type, output_size_bytes, response_ms, pdf_gen_ms, error_code, is_test, created_at"
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);

  if (error) {
    return NextResponse.json({ error: "Failed to fetch logs" }, { status: 500 });
  }

  return NextResponse.json({ logs: logs ?? [] });
}
