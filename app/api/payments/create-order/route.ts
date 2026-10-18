/**
 * POST /api/payments/create-order
 * Creates a Razorpay order for a PDF API plan upgrade.
 * The price is always taken from the database — never from the browser.
 */

import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/pdf-api/session";
import { supabaseAdmin } from "@/lib/supabase-admin";
import Razorpay from "razorpay";

export async function POST(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });

  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json({ error: "Online payment is not available right now. Please contact support." }, { status: 503 });
  }

  let body: { planId?: string; cycle?: string };
  try { body = await req.json(); } catch { body = {}; }

  const planId = String(body.planId ?? "");
  const cycle = body.cycle === "yearly" ? "yearly" : "monthly";

  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });

  const { data: plan } = await db
    .from("pdfapi_plans")
    .select("id, name, price_monthly, price_yearly, is_active")
    .eq("id", planId)
    .maybeSingle();

  if (!plan || !plan.is_active) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }
  const amount = cycle === "yearly" ? plan.price_yearly : plan.price_monthly; // paise
  if (!amount || amount <= 0) {
    return NextResponse.json({ error: "This plan cannot be purchased." }, { status: 400 });
  }

  try {
    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount,
      currency: "INR",
      receipt: `pdf_${user.id.slice(0, 8)}_${Date.now()}`,
      notes: { userId: user.id, planId: plan.id, cycle, product: "pdf-api" },
    });

    const { error } = await db.from("pdfapi_payment_orders").insert({
      order_id: order.id,
      user_id: user.id,
      plan_id: plan.id,
      cycle,
      amount,
      status: "created",
    });
    if (error) {
      console.error("[payments] could not save order", error.message);
      return NextResponse.json({ error: "Could not start payment. Please try again." }, { status: 500 });
    }

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
      planName: plan.name,
      userEmail: user.email,
      userName: user.user_metadata?.full_name ?? "",
    });
  } catch (err) {
    console.error("[payments] create-order failed", err);
    return NextResponse.json({ error: "Could not start payment. Please try again." }, { status: 502 });
  }
}
