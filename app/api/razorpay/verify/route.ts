import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";

// ── Email helper (Resend) ─────────────────────────────────────────────────────
// Set RESEND_API_KEY in Vercel env to enable. Skipped silently if not set.
async function sendDownloadEmail(opts: {
  buyerName: string;
  buyerEmail: string;
  productName: string;
  fileUrl: string;
  orderId: string;
  successUrl: string;
}) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return; // not configured — skip silently

  const from = process.env.EMAIL_FROM ?? "AIVEXA Store <store@aivexallp.com>";
  const { buyerName, buyerEmail, productName, fileUrl, orderId, successUrl } = opts;

  const html = `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:sans-serif">
  <table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08)">
        <!-- Header -->
        <tr><td style="background:#4F46E5;padding:28px 32px">
          <p style="margin:0;font-size:13px;color:#A5B4FC;font-weight:700;letter-spacing:.08em">AIVEXA STORE</p>
          <h1 style="margin:8px 0 0;font-size:22px;color:#fff">Your download is ready!</h1>
        </td></tr>
        <!-- Body -->
        <tr><td style="padding:28px 32px">
          <p style="margin:0 0 16px;color:#334155;font-size:15px">
            Hi ${buyerName || "there"},
          </p>
          <p style="margin:0 0 20px;color:#334155;font-size:15px;line-height:1.6">
            Thank you for purchasing <strong>${productName}</strong>. Your payment was successful and your file is ready to download.
          </p>

          <!-- Download Button -->
          ${fileUrl ? `
          <table cellpadding="0" cellspacing="0" style="margin:0 0 20px">
            <tr><td style="background:#4F46E5;border-radius:8px;padding:0">
              <a href="${fileUrl}" style="display:inline-block;padding:14px 28px;color:#fff;font-size:15px;font-weight:700;text-decoration:none">
                ⬇ Download ${productName}
              </a>
            </td></tr>
          </table>
          ` : ""}

          <!-- View Order Page -->
          <p style="margin:0 0 8px;color:#64748B;font-size:13px">
            Or open your order page (also works for future re-downloads):
          </p>
          <a href="${successUrl}" style="color:#4F46E5;font-size:13px;word-break:break-all">${successUrl}</a>

          <hr style="border:none;border-top:1px solid #E2E8F0;margin:24px 0">
          <p style="margin:0;color:#94A3B8;font-size:12px">
            Order ID: <code style="background:#F1F5F9;padding:2px 6px;border-radius:4px">${orderId}</code><br>
            If you have questions, reply to this email or visit <a href="https://aivexallp.com" style="color:#4F46E5">aivexallp.com</a>
          </p>
        </td></tr>
        <!-- Footer -->
        <tr><td style="background:#F8FAFC;padding:16px 32px;text-align:center">
          <p style="margin:0;color:#94A3B8;font-size:11px">
            © 2026 AIVEXA · aivexallp.com<br>
            This email was sent because you made a purchase on our store.
          </p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;

  try {
    await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        from,
        to: [buyerEmail],
        subject: `Your Download: ${productName} — AIVEXA Store`,
        html,
      }),
    });
  } catch (err) {
    // Email is non-critical — log but don't fail the payment flow
    console.error("Email send failed:", err);
  }
}

// ── Main verify handler ───────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      await req.json();

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json({ success: false, error: "Missing payment details." }, { status: 400 });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ success: false, error: "Server misconfiguration." }, { status: 500 });
    }

    // Verify HMAC signature
    const body = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSig = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    if (expectedSig !== razorpay_signature) {
      return NextResponse.json({ success: false, error: "Invalid payment signature." }, { status: 400 });
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseServiceKey) {
      const sb = createClient(supabaseUrl, supabaseServiceKey);

      // STEP 1: Update status to paid — separate from select to avoid
      // failures if optional columns (items) don't exist yet.
      await sb
        .from("aivexa_orders")
        .update({ razorpay_payment_id, razorpay_signature, status: "paid" })
        .eq("razorpay_order_id", razorpay_order_id);

      // STEP 2: Fetch order details separately for email
      const { data: order } = await sb
        .from("aivexa_orders")
        .select("buyer_name, buyer_email, product_slug, amount_paise")
        .eq("razorpay_order_id", razorpay_order_id)
        .maybeSingle();

      // STEP 3: Also try to get items if cart column exists (non-fatal)
      let items: { slug: string }[] = [];
      try {
        const { data: cartRow } = await sb
          .from("aivexa_orders")
          .select("items")
          .eq("razorpay_order_id", razorpay_order_id)
          .maybeSingle();
        if (Array.isArray(cartRow?.items)) items = cartRow.items;
      } catch { /* items column may not exist — skip */ }

      // STEP 4: Send download email (non-blocking)
      if (order?.buyer_email) {
        const { buyer_name, buyer_email, product_slug } = order;
        const isCart = items.length > 0;
        const siteBase = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aivexallp.com";

        if (isCart) {
          const slugs = items.map((it) => it.slug);
          const { data: products } = await sb
            .from("aivexa_digital_products")
            .select("name, slug, file_url")
            .in("slug", slugs);

          const firstProduct = products?.[0];
          sendDownloadEmail({
            buyerName: buyer_name ?? "",
            buyerEmail: buyer_email,
            productName: products && products.length > 1
              ? `${products[0].name} + ${products.length - 1} more`
              : firstProduct?.name ?? "Your purchase",
            fileUrl: firstProduct?.file_url ?? "",
            orderId: razorpay_order_id,
            successUrl: `${siteBase}/store/order-success?order=${razorpay_order_id}`,
          });
        } else if (product_slug) {
          const { data: product } = await sb
            .from("aivexa_digital_products")
            .select("name, file_url")
            .eq("slug", product_slug)
            .maybeSingle();

          sendDownloadEmail({
            buyerName: buyer_name ?? "",
            buyerEmail: buyer_email,
            productName: product?.name ?? product_slug,
            fileUrl: product?.file_url ?? "",
            orderId: razorpay_order_id,
            successUrl: `${siteBase}/store/${product_slug}/success?order=${razorpay_order_id}`,
          });
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("verify error:", err);
    return NextResponse.json({ success: false, error: "Internal server error." }, { status: 500 });
  }
}
