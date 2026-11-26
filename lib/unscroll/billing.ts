import crypto from "crypto";
import { razorpay } from "@/lib/pdf-api/subscriptions";
import { one, q } from "./db";
import { HttpError } from "./http";

/**
 * Unscroll plans sold with Razorpay (UPI Autopay / card mandate) on aivexallp.com.
 * Prices are in paise and INCLUDE GST — that is what the customer pays.
 * Change a price here and a new Razorpay plan is created automatically on the next purchase
 * (existing subscribers keep their old price).
 */
/** Default prices. The live prices are edited in Admin › App Analytics › Unscroll (table unscroll_plan_prices). */
export const PLANS = {
  pro_monthly:    { tier: "individual_premium", cycle: "monthly", amount: 4900,  name: "Unscroll Pro — monthly" },
  pro_yearly:     { tier: "individual_premium", cycle: "yearly",  amount: 29900, name: "Unscroll Pro — yearly" },
  family_monthly: { tier: "family_premium",     cycle: "monthly", amount: 9900,  name: "Unscroll Family — monthly" },
  family_yearly:  { tier: "family_premium",     cycle: "yearly",  amount: 59900, name: "Unscroll Family — yearly" },
} as const;
export type PlanKey = keyof typeof PLANS;
export const isPlanKey = (k: unknown): k is PlanKey => typeof k === "string" && k in PLANS;

/** Access is kept a little past the paid period so a late renewal never locks anyone out. */
const GRACE_MS = 2 * 86400_000;
const SITE = process.env.UNSCROLL_SITE_URL || "https://www.aivexallp.com";

export function rzp() {
  const r = razorpay();
  if (!r) throw new HttpError(503, "Payments are not available right now");
  return r;
}

let priceTableReady = false;
async function ensurePriceTable() {
  if (priceTableReady) return;
  await q(`CREATE TABLE IF NOT EXISTS unscroll_plan_prices (plan_key text PRIMARY KEY, amount int NOT NULL, updated_at timestamptz NOT NULL DEFAULT now())`);
  priceTableReady = true;
}

/** Current price of every plan in paise (admin overrides, else defaults). */
export async function currentPrices(): Promise<Record<PlanKey, number>> {
  await ensurePriceTable();
  const rows = await q<{ plan_key: string; amount: number }>(`SELECT plan_key, amount FROM unscroll_plan_prices`);
  const out = {} as Record<PlanKey, number>;
  for (const key of Object.keys(PLANS) as PlanKey[]) out[key] = PLANS[key].amount;
  for (const r of rows) if (isPlanKey(r.plan_key) && r.amount > 0) out[r.plan_key] = r.amount;
  return out;
}

/** Saves new prices (paise). Existing subscribers keep the price they signed up with. */
export async function savePrices(prices: Partial<Record<PlanKey, number>>): Promise<void> {
  await ensurePriceTable();
  for (const [key, amount] of Object.entries(prices)) {
    if (!isPlanKey(key)) continue;
    const a = Math.round(Number(amount));
    if (!Number.isFinite(a) || a < 100 || a > 10_000_000) throw new Error(`Invalid price for ${key}`);
    await q(`INSERT INTO unscroll_plan_prices (plan_key, amount, updated_at) VALUES ($1, $2, now())
             ON CONFLICT (plan_key) DO UPDATE SET amount = EXCLUDED.amount, updated_at = now()`, [key, a]);
  }
}

const rupees = (paise: number) => `₹${Number.isInteger(paise / 100) ? paise / 100 : (paise / 100).toFixed(2)}`;

export async function publicPlans() {
  const prices = await currentPrices();
  return (Object.keys(PLANS) as PlanKey[]).map(key => ({
    key, tier: PLANS[key].tier, cycle: PLANS[key].cycle, amountPaise: prices[key], name: PLANS[key].name,
    price: rupees(prices[key]),
  }));
}

async function ensurePlan(key: PlanKey): Promise<string> {
  const p = { ...PLANS[key], amount: (await currentPrices())[key] };
  const row = await one<{ rzp_plan_id: string; amount: number }>(`SELECT rzp_plan_id, amount FROM unscroll_rzp_plans WHERE plan_key = $1`, [key]);
  if (row && row.amount === p.amount) return row.rzp_plan_id;
  const created = await rzp().plans.create({
    period: p.cycle, interval: 1,
    item: { name: p.name, amount: p.amount, currency: "INR", description: "Price incl. GST" },
    notes: { product: "unscroll", plan: key },
  });
  await q(
    `INSERT INTO unscroll_rzp_plans (plan_key, amount, rzp_plan_id) VALUES ($1, $2, $3)
     ON CONFLICT (plan_key) DO UPDATE SET amount = EXCLUDED.amount, rzp_plan_id = EXCLUDED.rzp_plan_id, created_at = now()`,
    [key, p.amount, created.id]);
  return created.id;
}

/** Starts a Razorpay subscription and returns the website checkout link the app opens. */
export async function startCheckout(user: { id: string; email: string }, key: PlanKey): Promise<{ checkoutUrl: string; subscriptionId: string }> {
  const planId = await ensurePlan(key);
  const sub = await rzp().subscriptions.create({
    plan_id: planId,
    total_count: PLANS[key].cycle === "yearly" ? 10 : 120,
    customer_notify: 1,
    notes: { product: "unscroll", userId: user.id, plan: key },
  });
  await q(`INSERT INTO unscroll_rzp_checkouts (rzp_subscription_id, user_id, plan_key) VALUES ($1, $2, $3)`, [sub.id, user.id, key]);
  const u = new URL("/pay/unscroll.html", SITE);
  u.searchParams.set("sub", sub.id);
  u.searchParams.set("key", process.env.RAZORPAY_KEY_ID ?? "");
  u.searchParams.set("email", user.email);
  u.searchParams.set("plan", PLANS[key].name);
  return { checkoutUrl: u.toString(), subscriptionId: sub.id };
}

/** Checks Razorpay's checkout signature: HMAC_SHA256(payment_id|subscription_id, key_secret). */
export function validCheckoutSignature(paymentId: string, subscriptionId: string, signature: string): boolean {
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret || !signature) return false;
  const expected = crypto.createHmac("sha256", secret).update(`${paymentId}|${subscriptionId}`).digest("hex");
  return expected.length === signature.length && crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

function periodEnd(key: PlanKey, from = new Date()): Date {
  const d = new Date(from);
  if (PLANS[key].cycle === "yearly") d.setFullYear(d.getFullYear() + 1);
  else d.setMonth(d.getMonth() + 1);
  return d;
}

/**
 * Records one successful payment and gives the user the plan until the end of the paid period.
 * Safe to call more than once for the same payment (checkout return + webhook).
 */
export async function applyPayment(opts: { subscriptionId: string; paymentId: string; amount?: number; currentEnd?: Date | null }): Promise<boolean> {
  const c = await one<{ user_id: string; plan_key: string }>(`SELECT user_id, plan_key FROM unscroll_rzp_checkouts WHERE rzp_subscription_id = $1`, [opts.subscriptionId]);
  if (!c || !isPlanKey(c.plan_key)) return false;
  const key = c.plan_key;
  const amount = opts.amount ?? (await one<{ amount: number }>(`SELECT amount FROM unscroll_rzp_plans WHERE plan_key = $1`, [key]))?.amount ?? PLANS[key].amount;
  const fresh = await one(`INSERT INTO unscroll_payments (payment_id, user_id, plan_key, amount, rzp_subscription_id) VALUES ($1, $2, $3, $4, $5)
    ON CONFLICT (payment_id) DO NOTHING RETURNING payment_id`, [opts.paymentId, c.user_id, key, amount, opts.subscriptionId]);
  const end = new Date((opts.currentEnd ?? periodEnd(key)).getTime() + GRACE_MS);
  await q(`UPDATE unscroll_rzp_checkouts SET status = 'active', updated_at = now() WHERE rzp_subscription_id = $1`, [opts.subscriptionId]);
  await q(
    `INSERT INTO unscroll_subscriptions (user_id, tier, status, expires_at, verified_at, provider, plan_key, rzp_subscription_id, cancel_at_period_end, updated_at)
       VALUES ($1, $2, 'active', $3, now(), 'razorpay', $4, $5, false, now())
     ON CONFLICT (user_id) DO UPDATE SET tier = EXCLUDED.tier, status = 'active',
       expires_at = GREATEST(COALESCE(unscroll_subscriptions.expires_at, EXCLUDED.expires_at), EXCLUDED.expires_at),
       verified_at = now(), provider = 'razorpay', plan_key = EXCLUDED.plan_key,
       rzp_subscription_id = EXCLUDED.rzp_subscription_id, cancel_at_period_end = false, updated_at = now()`,
    [c.user_id, PLANS[key].tier, end, key, opts.subscriptionId]);
  return !!fresh;
}

/** Status changes from Razorpay (cancelled, halted, completed…). Access stays until expires_at. */
export async function applyStatus(subscriptionId: string, status: string): Promise<void> {
  await q(`UPDATE unscroll_rzp_checkouts SET status = $2, updated_at = now() WHERE rzp_subscription_id = $1`, [subscriptionId, status]);
  if (status === "cancelled" || status === "completed" || status === "halted" || status === "expired") {
    await q(`UPDATE unscroll_subscriptions SET cancel_at_period_end = true, updated_at = now() WHERE rzp_subscription_id = $1`, [subscriptionId]);
  }
}

/** Razorpay webhook events for Unscroll (called from /api/payments/razorpay-webhook). */
export async function handleWebhook(evt: {
  event?: string;
  payload?: { subscription?: { entity?: { id: string; status: string; current_end?: number } }; payment?: { entity?: { id: string; amount: number } } };
}): Promise<void> {
  const sub = evt.payload?.subscription?.entity;
  if (!sub) return;
  if (evt.event === "subscription.charged" || evt.event === "subscription.activated") {
    const pay = evt.payload?.payment?.entity;
    if (pay?.id) {
      await applyPayment({
        subscriptionId: sub.id, paymentId: pay.id, amount: pay.amount,
        currentEnd: sub.current_end ? new Date(sub.current_end * 1000) : null,
      });
    }
  }
  if (sub.status && sub.status !== "active") await applyStatus(sub.id, sub.status);
}

/** Cancels at the end of the paid period (the user keeps access until then). */
export async function cancelAtPeriodEnd(userId: string): Promise<void> {
  const s = await one<{ rzp_subscription_id: string | null }>(`SELECT rzp_subscription_id FROM unscroll_subscriptions WHERE user_id = $1`, [userId]);
  if (!s?.rzp_subscription_id) throw new HttpError(404, "No active subscription");
  await rzp().subscriptions.cancel(s.rzp_subscription_id, true);
  await q(`UPDATE unscroll_subscriptions SET cancel_at_period_end = true, updated_at = now() WHERE user_id = $1`, [userId]);
}
