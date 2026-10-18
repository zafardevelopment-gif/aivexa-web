/**
 * POST /api/payments/verify
 * Verifies the Razorpay signature and upgrades the plan that was saved
 * with the order (the browser cannot choose the plan here).
 */

import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/pdf-api/session";
import { supabaseAdmin } from "@/lib/supabase-admin";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });

  let body: { orderId?: string; paymentId?: string; signature?: string };
  try { body = await req.json(); } catch { body = {}; }

  const { orderId, paymentId, signature } = body;
  if (!orderId || !paymentId || !signature || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
  }

  const expected = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(String(signature));
  if (a.length !== b.length || !crypto.timingSafeEqual(a, b)) {
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });

  const { data: order } = await db
    .from("pdfapi_payment_orders")
    .select("order_id, user_id, plan_id, cycle, status")
    .eq("order_id", orderId)
    .eq("user_id", user.id)
    .maybeSingle();

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (order.status === "paid") return NextResponse.json({ ok: true, planId: order.plan_id });

  const now = new Date();
  const expires = new Date(now);
  if (order.cycle === "yearly") expires.setFullYear(expires.getFullYear() + 1);
  else expires.setMonth(expires.getMonth() + 1);
  const resetAt = new Date(now);
  resetAt.setMonth(resetAt.getMonth() + 1);

  // Mark paid first (only if still "created") so a replay cannot upgrade twice
  const { data: marked } = await db
    .from("pdfapi_payment_orders")
    .update({ status: "paid", payment_id: paymentId, paid_at: now.toISOString() })
    .eq("order_id", orderId)
    .eq("status", "created")
    .select("order_id");
  if (!marked || marked.length === 0) return NextResponse.json({ ok: true, planId: order.plan_id });

  const { error } = await db.from("pdfapi_users")
    .update({
      plan_id: order.plan_id,
      plan_expires_at: expires.toISOString(),
      credits_used: 0,
      credits_reset_at: resetAt.toISOString(),
      updated_at: now.toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    console.error("[payments] plan upgrade failed", orderId, error.message);
    return NextResponse.json({ error: "Payment received but upgrade failed. Please contact support." }, { status: 500 });
  }

  return NextResponse.json({ ok: true, planId: order.plan_id, expiresAt: expires.toISOString() });
}
