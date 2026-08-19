/**
 * AIVEXA PDF API — GET /api/v1/usage
 * Returns usage stats for the logged-in user.
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
  const days = Math.min(parseInt(searchParams.get("days") ?? "30"), 90);

  const since = new Date();
  since.setDate(since.getDate() - days);

  // User record with plan info
  const { data: userData } = await db
    .from("pdfapi_users")
    .select("plan_id, credits_used, credits_reset_at, pdfapi_plans(credits, name)")
    .eq("id", user.id)
    .single();

  // Daily usage breakdown
  const { data: daily } = await db
    .from("pdfapi_requests")
    .select("created_at, status, endpoint")
    .eq("user_id", user.id)
    .gte("created_at", since.toISOString())
    .order("created_at", { ascending: true });

  // Aggregate by day
  const dayMap: Record<string, { total: number; success: number; failed: number }> = {};
  for (const row of daily ?? []) {
    const day = row.created_at.slice(0, 10);
    if (!dayMap[day]) dayMap[day] = { total: 0, success: 0, failed: 0 };
    dayMap[day].total++;
    if (row.status === "completed") dayMap[day].success++;
    else dayMap[day].failed++;
  }

  const plan = (userData?.pdfapi_plans as unknown) as Record<string, unknown> | null;

  return NextResponse.json({
    plan: {
      id: userData?.plan_id,
      name: plan?.name,
      credits: plan?.credits,
      credits_used: userData?.credits_used ?? 0,
      credits_reset_at: userData?.credits_reset_at,
    },
    daily: Object.entries(dayMap).map(([date, stats]) => ({ date, ...stats })),
    totals: {
      total: daily?.length ?? 0,
      success: daily?.filter(r => r.status === "completed").length ?? 0,
      failed: daily?.filter(r => r.status === "failed").length ?? 0,
    },
  });
}
