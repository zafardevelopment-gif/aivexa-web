/**
 * AIVEXA PDF API — auto-pay helpers (Razorpay Subscriptions).
 * The Razorpay plan amount is the price INCLUDING 18% GST, because that is what gets debited.
 */
import Razorpay from "razorpay";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { withGst } from "@/lib/pdf-api/billing";

export type Cycle = "monthly" | "yearly";

export function razorpay(): Razorpay | null {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return null;
  return new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
}

/** Returns the Razorpay plan id for this plan + cycle, creating a new one if the price changed. */
export async function ensureRazorpayPlan(planId: string, cycle: Cycle): Promise<{ rzpPlanId: string; total: number } | null> {
  const db = supabaseAdmin();
  const rzp = razorpay();
  if (!db || !rzp) return null;

  const { data: plan } = await db
    .from("pdfapi_plans")
    .select("id, name, price_monthly, price_yearly, credits, rzp_plan_monthly, rzp_plan_yearly, rzp_amount_monthly, rzp_amount_yearly, is_active")
    .eq("id", planId)
    .maybeSingle();
  if (!plan || !plan.is_active) return null;

  const base = cycle === "yearly" ? plan.price_yearly : plan.price_monthly;
  if (!base || base <= 0) return null;
  const total = withGst(base).total;

  const existingId = cycle === "yearly" ? plan.rzp_plan_yearly : plan.rzp_plan_monthly;
  const existingAmt = cycle === "yearly" ? plan.rzp_amount_yearly : plan.rzp_amount_monthly;
  if (existingId && existingAmt === total) return { rzpPlanId: existingId, total };

  const created = await rzp.plans.create({
    period: cycle,
    interval: 1,
    item: {
      name: `AIVEXA PDF API — ${plan.name} (${cycle})`,
      amount: total,
      currency: "INR",
      description: `${plan.credits} credits per month, price incl. 18% GST`,
    },
    notes: { product: "pdf-api", planId: plan.id, cycle },
  });

  const update = cycle === "yearly"
    ? { rzp_plan_yearly: created.id, rzp_amount_yearly: total }
    : { rzp_plan_monthly: created.id, rzp_amount_monthly: total };
  await db.from("pdfapi_plans").update(update).eq("id", plan.id);
  return { rzpPlanId: created.id, total };
}

/**
 * Applies one successful (auto-)payment: records it as a paid order with GST split
 * and extends the user's plan until `periodEnd`. Safe to call twice for the same payment.
 */
export async function applySubscriptionPayment(opts: {
  userId: string; planId: string; cycle: Cycle; paymentId: string;
  amount: number; subscriptionId: string; periodEnd: Date;
}): Promise<void> {
  const db = supabaseAdmin();
  if (!db) return;

  const { data: existing } = await db
    .from("pdfapi_payment_orders").select("id").eq("order_id", opts.paymentId).maybeSingle();
  if (existing) return; // already recorded

  // Split the charged total back into base + GST (total = base × 1.18)
  const base = Math.round(opts.amount / 1.18);
  const gst = opts.amount - base;
  const now = new Date();

  const { error } = await db.from("pdfapi_payment_orders").insert({
    order_id: opts.paymentId,
    user_id: opts.userId,
    plan_id: opts.planId,
    cycle: opts.cycle,
    amount: opts.amount,
    base_amount: base,
    gst_amount: gst,
    gst_rate: 18,
    status: "paid",
    payment_id: opts.paymentId,
    paid_at: now.toISOString(),
    rzp_subscription_id: opts.subscriptionId,
  });
  if (error && !/duplicate/i.test(error.message)) throw new Error(error.message);
  if (error) return;

  // A day of grace so a slightly late auto-debit never drops the customer to Free
  const expires = new Date(opts.periodEnd.getTime() + 24 * 3600 * 1000);
  const resetAt = new Date(now);
  resetAt.setMonth(resetAt.getMonth() + 1);
  await db.from("pdfapi_users").update({
    plan_id: opts.planId,
    plan_expires_at: expires.toISOString(),
    credits_used: 0,
    credits_reset_at: resetAt.toISOString(),
    updated_at: now.toISOString(),
  }).eq("id", opts.userId);
}

export function addCycle(from: Date, cycle: Cycle): Date {
  const d = new Date(from);
  if (cycle === "yearly") d.setFullYear(d.getFullYear() + 1); else d.setMonth(d.getMonth() + 1);
  return d;
}
