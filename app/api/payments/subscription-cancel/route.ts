/**
 * POST /api/payments/subscription-cancel
 * Turns auto-renew off. The plan stays active until the end of the period already paid for.
 */
import { NextRequest, NextResponse } from "next/server";
import { getSessionUser } from "@/lib/pdf-api/session";
import { supabaseAdmin } from "@/lib/supabase-admin";
import { razorpay } from "@/lib/pdf-api/subscriptions";

export async function POST(req: NextRequest) {
  const user = await getSessionUser(req);
  if (!user) return NextResponse.json({ error: "Please sign in again." }, { status: 401 });
  const db = supabaseAdmin();
  const rzp = razorpay();
  if (!db || !rzp) return NextResponse.json({ error: "Service unavailable" }, { status: 503 });

  const { data: subs } = await db.from("pdfapi_subscriptions")
    .select("id, rzp_subscription_id").eq("user_id", user.id)
    .in("status", ["active", "authenticated", "pending", "created"]).eq("cancel_at_cycle_end", false);

  if (!subs?.length) return NextResponse.json({ error: "Auto-renew is not on." }, { status: 400 });

  for (const s of subs) {
    try {
      await rzp.subscriptions.cancel(s.rzp_subscription_id, true); // stop at the end of the current cycle
    } catch (err) {
      console.error("[autopay] cancel failed", s.rzp_subscription_id, err);
      // A subscription that never got authorised cannot be cancelled "at cycle end" — cancel it now
      try { await rzp.subscriptions.cancel(s.rzp_subscription_id, false); } catch { /* ignore */ }
    }
    await db.from("pdfapi_subscriptions")
      .update({ cancel_at_cycle_end: true, updated_at: new Date().toISOString() }).eq("id", s.id);
  }
  return NextResponse.json({ ok: true });
}
