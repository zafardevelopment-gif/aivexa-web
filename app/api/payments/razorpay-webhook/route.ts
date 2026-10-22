/**
 * POST /api/payments/razorpay-webhook
 * Razorpay → AIVEXA PDF API. Handles auto-pay renewals and status changes.
 * Only events whose subscription notes say product = "pdf-api" are processed;
 * everything else (other apps on the same Razorpay account) is acknowledged and ignored.
 */
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { applySubscriptionPayment, Cycle } from "@/lib/pdf-api/subscriptions";

export const runtime = "nodejs";

type Sub = { id: string; status: string; current_end?: number; notes?: Record<string, string> };
type Pay = { id: string; amount: number; status?: string };

export async function POST(req: NextRequest) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET;
  const raw = await req.text();
  const sig = req.headers.get("x-razorpay-signature") ?? "";
  if (!secret) return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });

  const expected = crypto.createHmac("sha256", secret).update(raw).digest("hex");
  if (expected.length !== sig.length || !crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  let evt: { event?: string; payload?: { subscription?: { entity?: Sub }; payment?: { entity?: Pay } } };
  try { evt = JSON.parse(raw); } catch { return NextResponse.json({ ok: true }); }

  const sub = evt.payload?.subscription?.entity;
  if (!sub || sub.notes?.product !== "pdf-api") return NextResponse.json({ ok: true, ignored: true });

  const db = supabaseAdmin();
  if (!db) return NextResponse.json({ error: "DB unavailable" }, { status: 500 });

  const { data: row } = await db.from("pdfapi_subscriptions")
    .select("id, user_id, plan_id, cycle").eq("rzp_subscription_id", sub.id).maybeSingle();
  if (!row) return NextResponse.json({ ok: true, unknown: true });

  const currentEnd = sub.current_end ? new Date(sub.current_end * 1000) : null;
  await db.from("pdfapi_subscriptions").update({
    status: sub.status,
    ...(currentEnd ? { current_end: currentEnd.toISOString() } : {}),
    updated_at: new Date().toISOString(),
  }).eq("id", row.id);

  if (evt.event === "subscription.charged") {
    const pay = evt.payload?.payment?.entity;
    if (pay?.id && currentEnd) {
      await applySubscriptionPayment({
        userId: row.user_id, planId: row.plan_id, cycle: row.cycle as Cycle,
        paymentId: pay.id, amount: pay.amount, subscriptionId: sub.id, periodEnd: currentEnd,
      });
    }
  }

  return NextResponse.json({ ok: true });
}
