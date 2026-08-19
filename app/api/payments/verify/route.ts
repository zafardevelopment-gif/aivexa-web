/**
 * POST /api/payments/verify
 * Verifies Razorpay payment signature and upgrades the user's plan.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase-admin";
import crypto from "crypto";

async function getSessionUser(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const authHeader = req.headers.get("authorization");
  const accessToken =
    (authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null) ??
    req.cookies.get("sb-access-token")?.value ?? null;
  if (!accessToken) return null;
  const client = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
  });
  const { data: { user } } = await client.auth.getUser();
  return user;
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let body: { orderId?: string; paymentId?: string; signature?: string; planId?: string; cycle?: string };
  try { body = await req.json(); } catch { body = {}; }

  const { orderId, paymentId, signature, planId } = body;
  if (!orderId || !paymentId || !signature || !planId) {
    return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
  }

  // Verify signature
  const expectedSignature = crypto
    .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${orderId}|${paymentId}`)
    .digest("hex");

  if (expectedSignature !== signature) {
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 500 });

  // Upgrade user's plan
  const now = new Date();
  const resetAt = new Date(now);
  resetAt.setMonth(resetAt.getMonth() + 1);

  await db.from("pdfapi_users")
    .update({
      plan_id: planId,
      credits_used: 0,
      credits_reset_at: resetAt.toISOString(),
    })
    .eq("id", user.id);

  // Mark order as paid
  await db.from("pdfapi_payment_orders")
    .update({ status: "paid", payment_id: paymentId, paid_at: now.toISOString() })
    .eq("order_id", orderId)
    .eq("user_id", user.id);

  return NextResponse.json({ ok: true });
}
