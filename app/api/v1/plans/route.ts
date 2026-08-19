/**
 * GET /api/v1/plans — public plans listing
 */
import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

export async function GET() {
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ plans: [] });

  const { data } = await db
    .from("pdfapi_plans")
    .select("id, name, price_monthly, price_yearly, credits, parallel, max_pdf_bytes, rate_limit_rpm, features, sort_order")
    .eq("is_active", true)
    .order("sort_order");

  return NextResponse.json({ plans: data ?? [] });
}
