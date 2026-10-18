/**
 * AIVEXA PDF API — billing summary for the dashboard
 * GET  /api/v1/billing  → current plan, payments, billing details
 * PUT  /api/v1/billing  → update billing details (name, company, GSTIN, address)
 */

import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/pdf-api/session";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { receiptNo } from "@/lib/pdf-api/billing";

export async function GET(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 500 });

  const { data: u } = await db
    .from("pdfapi_users")
    .select("plan_id, credits_used, credits_reset_at, plan_expires_at, billing_name, billing_company, billing_gstin, billing_address, pdfapi_plans(name, credits, price_monthly, price_yearly)")
    .eq("id", user.id)
    .single();

  const { data: payments } = await db
    .from("pdfapi_payment_orders")
    .select("id, order_id, plan_id, cycle, amount, status, payment_id, paid_at, created_at")
    .eq("user_id", user.id)
    .eq("status", "paid")
    .order("paid_at", { ascending: false })
    .limit(50);

  const lastPaid = payments?.[0] ?? null;
  const plan = (u?.pdfapi_plans as unknown) as Record<string, unknown> | null;

  return NextResponse.json({
    plan: {
      id: u?.plan_id ?? "free",
      name: plan?.name ?? "Free",
      credits: plan?.credits ?? 100,
      credits_used: u?.credits_used ?? 0,
      credits_reset_at: u?.credits_reset_at ?? null,
      expires_at: u?.plan_expires_at ?? null,
      cycle: lastPaid?.cycle ?? null,
      price: lastPaid ? lastPaid.amount : 0,
    },
    payments: (payments ?? []).map((p) => ({
      id: p.id,
      receipt_no: receiptNo(p.id, p.paid_at),
      plan_id: p.plan_id,
      cycle: p.cycle,
      amount: p.amount,
      paid_at: p.paid_at,
      payment_id: p.payment_id,
    })),
    billing: {
      name: u?.billing_name ?? "",
      company: u?.billing_company ?? "",
      gstin: u?.billing_gstin ?? "",
      address: u?.billing_address ?? "",
      email: user.email ?? "",
    },
  });
}

export async function PUT(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 500 });

  let b: Record<string, unknown> = {};
  try { b = await req.json(); } catch { /* empty */ }
  const clean = (v: unknown, max: number) => String(v ?? "").trim().slice(0, max);
  const gstin = clean(b.gstin, 15).toUpperCase();
  if (gstin && !/^[0-9]{2}[A-Z0-9]{13}$/.test(gstin)) {
    return NextResponse.json({ error: "GSTIN should be 15 characters, e.g. 10ABCDE1234F1Z5" }, { status: 400 });
  }

  const { error } = await db.from("pdfapi_users").update({
    billing_name: clean(b.name, 120) || null,
    billing_company: clean(b.company, 160) || null,
    billing_gstin: gstin || null,
    billing_address: clean(b.address, 400) || null,
    updated_at: new Date().toISOString(),
  }).eq("id", user.id);

  if (error) return NextResponse.json({ error: "Could not save details" }, { status: 500 });
  return NextResponse.json({ ok: true });
}
