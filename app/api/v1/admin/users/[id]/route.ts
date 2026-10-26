/**
 * Admin — one PDF API customer.
 * GET  /api/v1/admin/users/:id  → account, plan, activity, payments, keys
 * POST /api/v1/admin/users/:id  { action, ... } → send_reset | set_password | confirm_email |
 *                                                suspend | unsuspend | set_plan | reset_credits
 */
import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/pdf-api/admin";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { receiptNo } from "@/lib/pdf-api/billing";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  if (!(await requireAdmin(req))) return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 500 });
  const { id } = await ctx.params;

  const [{ data: profile }, authRes, { data: requests }, { data: payments }, { data: keys }, { data: subs }] = await Promise.all([
    db.from("pdfapi_users")
      .select("id, email, full_name, plan_id, credits_used, credits_reset_at, plan_expires_at, is_active, created_at, billing_name, billing_company, billing_gstin, billing_address, pdfapi_plans(name, credits)")
      .eq("id", id).maybeSingle(),
    db.auth.admin.getUserById(id),
    db.from("pdfapi_requests")
      .select("request_id, endpoint, status, input_type, output_size_bytes, response_ms, error_code, is_test, credits_used, created_at")
      .eq("user_id", id).order("created_at", { ascending: false }).limit(50),
    db.from("pdfapi_payment_orders")
      .select("id, order_id, plan_id, cycle, amount, base_amount, gst_amount, status, payment_id, paid_at, created_at, rzp_subscription_id")
      .eq("user_id", id).order("created_at", { ascending: false }).limit(50),
    db.from("pdfapi_api_keys")
      .select("id, name, key_prefix, key_hint, is_test, is_active, last_used_at, created_at")
      .eq("user_id", id).order("created_at", { ascending: false }),
    db.from("pdfapi_subscriptions")
      .select("rzp_subscription_id, plan_id, cycle, status, current_end, cancel_at_cycle_end, created_at")
      .eq("user_id", id).order("created_at", { ascending: false }).limit(10),
  ]);

  if (!profile) return NextResponse.json({ error: "User not found" }, { status: 404 });
  const au = authRes.data?.user;

  return NextResponse.json({
    profile,
    auth: au ? {
      email_confirmed_at: au.email_confirmed_at ?? null,
      last_sign_in_at: au.last_sign_in_at ?? null,
      created_at: au.created_at,
      providers: au.app_metadata?.providers ?? [],
    } : null,
    requests: requests ?? [],
    payments: (payments ?? []).map((p) => ({ ...p, receipt_no: p.status === "paid" ? receiptNo(p.id, p.paid_at) : null })),
    keys: keys ?? [],
    subscriptions: subs ?? [],
  });
}

export async function POST(req: NextRequest, ctx: Ctx) {
  const admin = await requireAdmin(req);
  if (!admin) return NextResponse.json({ error: "Not allowed" }, { status: 403 });
  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 500 });
  const { id } = await ctx.params;

  let b: Record<string, unknown> = {};
  try { b = await req.json(); } catch { /* empty */ }
  const action = String(b.action ?? "");

  const { data: u } = await db.from("pdfapi_users").select("id, email").eq("id", id).maybeSingle();
  if (!u) return NextResponse.json({ error: "User not found" }, { status: 404 });
  const now = new Date().toISOString();

  switch (action) {
    case "send_reset": {
      const origin = req.headers.get("origin") || "https://www.aivexallp.com";
      const { error } = await db.auth.resetPasswordForEmail(u.email, { redirectTo: `${origin}/pdf-api/reset-password` });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true, message: `Reset link sent to ${u.email}` });
    }
    case "set_password": {
      const pw = String(b.password ?? "");
      if (pw.length < 8) return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
      const { error } = await db.auth.admin.updateUserById(id, { password: pw });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true, message: "Password updated. Ask the user to change it after signing in." });
    }
    case "confirm_email": {
      const { error } = await db.auth.admin.updateUserById(id, { email_confirm: true });
      if (error) return NextResponse.json({ error: error.message }, { status: 500 });
      return NextResponse.json({ ok: true, message: "Email marked as verified." });
    }
    case "suspend":
    case "unsuspend": {
      if (u.email.toLowerCase() === admin.email?.toLowerCase()) {
        return NextResponse.json({ error: "You cannot suspend your own account." }, { status: 400 });
      }
      await db.from("pdfapi_users").update({ is_active: action === "unsuspend", updated_at: now }).eq("id", id);
      return NextResponse.json({ ok: true, message: action === "suspend" ? "Account suspended — API calls are blocked." : "Account active again." });
    }
    case "reset_credits": {
      await db.from("pdfapi_users").update({ credits_used: 0, updated_at: now }).eq("id", id);
      return NextResponse.json({ ok: true, message: "Credits for this month reset to 0." });
    }
    case "set_plan": {
      const planId = String(b.planId ?? "");
      const { data: plan } = await db.from("pdfapi_plans").select("id, name").eq("id", planId).maybeSingle();
      if (!plan) return NextResponse.json({ error: "Unknown plan" }, { status: 400 });
      const days = Math.min(Math.max(parseInt(String(b.days ?? "30")) || 30, 1), 3660);
      const expires = planId === "free" ? null : new Date(Date.now() + days * 86400000).toISOString();
      await db.from("pdfapi_users").update({ plan_id: planId, plan_expires_at: expires, updated_at: now }).eq("id", id);
      return NextResponse.json({ ok: true, message: planId === "free" ? "Moved to Free plan." : `${plan.name} plan given for ${days} days.` });
    }
    default:
      return NextResponse.json({ error: "Unknown action" }, { status: 400 });
  }
}
