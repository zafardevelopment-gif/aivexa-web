/**
 * Razorpay sends the customer here (form POST) after the Unscroll checkout on /pay/unscroll.html.
 * We verify the signature, unlock the plan, then show a "go back to the app" page.
 * Renewals are handled by the Razorpay webhook (/api/payments/razorpay-webhook).
 */
import { NextResponse } from "next/server";
import { applyPayment, validCheckoutSignature } from "@/lib/unscroll/billing";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const done = (req: Request, status: "success" | "failed" | "cancelled") =>
  NextResponse.redirect(new URL(`/pay/unscroll-done.html?status=${status}`, process.env.UNSCROLL_SITE_URL || req.url), 303);

export async function POST(req: Request) {
  let f: FormData;
  try { f = await req.formData(); } catch { return done(req, "failed"); }
  const paymentId = String(f.get("razorpay_payment_id") ?? "");
  const subscriptionId = String(f.get("razorpay_subscription_id") ?? "");
  const signature = String(f.get("razorpay_signature") ?? "");
  if (!paymentId || !subscriptionId) return done(req, "failed");
  if (!validCheckoutSignature(paymentId, subscriptionId, signature)) return done(req, "failed");
  try {
    await applyPayment({ subscriptionId, paymentId });
    return done(req, "success");
  } catch (e) {
    console.error("[unscroll] pay return", e);
    return done(req, "failed");
  }
}

export async function GET(req: Request) {
  return done(req, "cancelled");
}
