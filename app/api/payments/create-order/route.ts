/**
 * POST /api/payments/create-order
 * Creates a Razorpay order for plan upgrade.
 */

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { supabaseAdmin } from "@/lib/supabase-admin";
import Razorpay from "razorpay";

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

  let body: { planId?: string; cycle?: string; amount?: number };
  try { body = await req.json(); } catch { body = {}; }

  const { planId, cycle, amount } = body;
  if (!planId || !amount || amount <= 0) {
    return NextResponse.json({ error: "Invalid plan or amount" }, { status: 400 });
  }

  const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });

  const order = await razorpay.orders.create({
    amount: amount, // already in paise
    currency: "INR",
    receipt: `pdf_${user.id.slice(0, 8)}_${Date.now()}`,
    notes: {
      userId: user.id,
      planId: planId ?? "",
      cycle: cycle ?? "monthly",
    },
  });

  // Store pending order in DB
  const db = supabaseAdmin();
  if (db) {
    await db.from("pdfapi_payment_orders").insert({
      order_id: order.id,
      user_id: user.id,
      plan_id: planId,
      cycle: cycle ?? "monthly",
      amount,
      status: "created",
    }).maybeSingle();
  }

  return NextResponse.json({
    orderId: order.id,
    amount: order.amount,
    currency: order.currency,
    keyId: process.env.RAZORPAY_KEY_ID,
    userEmail: user.email,
    userName: user.user_metadata?.full_name ?? "",
  });
}
