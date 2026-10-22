/**
 * POST /api/payments/subscribe  { planId, cycle }
 * Starts auto-pay: creates a Razorpay subscription for the plan (price incl. GST).
 * The customer approves the UPI Autopay / card mandate in Razorpay checkout.
 */
import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/pdf-api/session";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { ensureRazorpayPlan, razorpay, Cycle } from "@/lib/pdf-api/subscriptions";

export async function POST(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });

  const rzp = razorpay();
  const db = supabaseAdmin();
  if (!rzp || !db) return NextResponse.json({ error: "Auto-pay is not available right now." }, { status: 503 });

  let body: { planId?: string; cycle?: string } = {};
  try { body = await req.json(); } catch { /* empty */ }
  const planId = String(body.planId ?? "");
  const cycle: Cycle = body.cycle === "yearly" ? "yearly" : "monthly";

  try {
    const plan = await ensureRazorpayPlan(planId, cycle);
    if (!plan) return NextResponse.json({ error: "This plan cannot be bought with auto-pay." }, { status: 400 });

    const sub = await rzp.subscriptions.create({
      plan_id: plan.rzpPlanId,
      total_count: cycle === "yearly" ? 10 : 120, // up to 10 years
      customer_notify: 1,
      notes: { product: "pdf-api", userId: user.id, planId, cycle },
    });

    await db.from("pdfapi_subscriptions").insert({
      user_id: user.id,
      rzp_subscription_id: sub.id,
      plan_id: planId,
      cycle,
      status: "created",
    });

    return NextResponse.json({
      subscriptionId: sub.id,
      keyId: process.env.RAZORPAY_KEY_ID,
      amount: plan.total,
      userEmail: user.email,
    });
  } catch (err) {
    console.error("[autopay] subscribe failed", err);
    return NextResponse.json({ error: "Could not start auto-pay. Please try again or pay once instead." }, { status: 502 });
  }
}
