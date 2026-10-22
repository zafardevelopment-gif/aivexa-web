/**
 * POST /api/payments/subscription-verify
 * Called by the checkout handler after the first auto-pay payment.
 * Verifies the Razorpay signature and upgrades the plan right away
 * (the webhook would do the same a moment later — both are idempotent).
 */
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { getSessionUser } from "@/lib/pdf-api/session";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { applySubscriptionPayment, addCycle, Cycle } from "@/lib/pdf-api/subscriptions";
import { withGst } from "@/lib/pdf-api/billing";

export async function POST(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });

  let b: { paymentId?: string; subscriptionId?: string; signature?: string } = {};
  try { b = await req.json(); } catch { /* empty */ }
  const { paymentId, subscriptionId, signature } = b;
  if (!paymentId || !subscriptionId || !signature || !process.env.RAZORPAY_KEY_SECRET) {
    return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
  }

  const expected = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
    .update(`${paymentId}|${subscriptionId}`).digest("hex");
  if (expected.length !== signature.length || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) {
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });

  const { data: sub } = await db.from("pdfapi_subscriptions")
    .select("id, plan_id, cycle").eq("rzp_subscription_id", subscriptionId).eq("user_id", user.id).maybeSingle();
  if (!sub) return NextResponse.json({ error: "Subscription not found" }, { status: 404 });

  const { data: plan } = await db.from("pdfapi_plans")
    .select("price_monthly, price_yearly").eq("id", sub.plan_id).single();
  const cycle = sub.cycle as Cycle;
  const amount = withGst(cycle === "yearly" ? plan!.price_yearly : plan!.price_monthly).total;
  const periodEnd = addCycle(new Date(), cycle);

  // Only one auto-pay per customer: cancel any older active one right away
  const { data: older } = await db.from("pdfapi_subscriptions")
    .select("rzp_subscription_id").eq("user_id", user.id).in("status", ["active", "authenticated", "pending"])
    .neq("rzp_subscription_id", subscriptionId);
  if (older?.length) {
    const { razorpay } = await import("@/lib/pdf-api/subscriptions");
    const rzp = razorpay();
    for (const o of older) {
      try { await rzp?.subscriptions.cancel(o.rzp_subscription_id, false); } catch { /* already gone */ }
      await db.from("pdfapi_subscriptions").update({ status: "cancelled", updated_at: new Date().toISOString() })
        .eq("rzp_subscription_id", o.rzp_subscription_id);
    }
  }

  await applySubscriptionPayment({
    userId: user.id, planId: sub.plan_id, cycle, paymentId, amount, subscriptionId, periodEnd,
  });
  await db.from("pdfapi_subscriptions").update({
    status: "active", current_end: periodEnd.toISOString(), updated_at: new Date().toISOString(),
  }).eq("id", sub.id);

  return NextResponse.json({ ok: true, planId: sub.plan_id });
}
