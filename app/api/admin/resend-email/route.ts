import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { cookies } from "next/headers";
import { ADMIN_COOKIE, verifyToken } from "@/lib/admin-auth";

async function isAdmin() {
  const store = await cookies();
  return verifyToken(store.get(ADMIN_COOKIE)?.value);
}

export async function POST(req: NextRequest) {
  const authed = await isAdmin();
  if (!authed) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { orderId } = await req.json();
  if (!orderId) return NextResponse.json({ error: "orderId required" }, { status: 400 });

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const resendKey   = process.env.RESEND_API_KEY;
  const siteBase    = process.env.NEXT_PUBLIC_SITE_URL ?? "https://aivexallp.com";
  const from        = process.env.EMAIL_FROM ?? "AIVEXA Store <store@aivexallp.com>";

  if (!resendKey) return NextResponse.json({ error: "RESEND_API_KEY not set in Vercel env" }, { status: 500 });

  const sb = createClient(supabaseUrl, supabaseKey);

  const { data: order } = await sb
    .from("aivexa_orders")
    .select("id, razorpay_order_id, buyer_name, buyer_email, product_slug, status")
    .eq("id", orderId)
    .maybeSingle();

  if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (order.status !== "paid") return NextResponse.json({ error: `Order status is '${order.status}', not paid` }, { status: 400 });

  const { data: product } = await sb
    .from("aivexa_digital_products")
    .select("name, file_url")
    .eq("slug", order.product_slug)
    .maybeSingle();

  const fileUrl     = product?.file_url ?? "";
  const productName = product?.name ?? order.product_slug;
  const successUrl  = `${siteBase}/store/${order.product_slug}/success?order=${order.razorpay_order_id}`;

  if (!fileUrl) {
    return NextResponse.json({ error: "Product has no file_url set — add it in Admin > Digital Store first" }, { status: 400 });
  }

  const html = `<!DOCTYPE html><html><head><meta charset="utf-8"></head>
<body style="margin:0;padding:0;background:#F1F5F9;font-family:sans-serif">
<table width="100%" cellpadding="0" cellspacing="0" style="padding:32px 16px"><tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="background:#fff;border-radius:12px;overflow:hidden;box-shadow:0 2px 12px rgba(0,0,0,.08)">
<tr><td style="background:#4F46E5;padding:28px 32px">
  <p style="margin:0;font-size:13px;color:#A5B4FC;font-weight:700">AIVEXA STORE</p>
  <h1 style="margin:8px 0 0;font-size:22px;color:#fff">Your download is ready!</h1>
</td></tr>
<tr><td style="padding:28px 32px">
  <p style="margin:0 0 16px;color:#334155;font-size:15px">Hi ${order.buyer_name || "there"},</p>
  <p style="margin:0 0 20px;color:#334155;font-size:15px;line-height:1.6">
    Thank you for purchasing <strong>${productName}</strong>. Your payment was successful and your file is ready to download.
  </p>
  <table cellpadding="0" cellspacing="0" style="margin:0 0 20px">
    <tr><td style="background:#4F46E5;border-radius:8px">
      <a href="${fileUrl}" style="display:inline-block;padding:14px 28px;color:#fff;font-size:15px;font-weight:700;text-decoration:none">
        ⬇ Download ${productName}
      </a>
    </td></tr>
  </table>
  <p style="margin:0 0 8px;color:#64748B;font-size:13px">Or open your order page to re-download anytime:</p>
  <a href="${successUrl}" style="color:#4F46E5;font-size:13px">${successUrl}</a>
  <hr style="border:none;border-top:1px solid #E2E8F0;margin:24px 0">
  <p style="margin:0;color:#94A3B8;font-size:12px">
    Order ID: <code style="background:#F1F5F9;padding:2px 6px;border-radius:4px">${order.razorpay_order_id}</code>
  </p>
</td></tr>
<tr><td style="background:#F8FAFC;padding:16px 32px;text-align:center">
  <p style="margin:0;color:#94A3B8;font-size:11px">© 2026 AIVEXA · aivexallp.com</p>
</td></tr>
</table></td></tr></table>
</body></html>`;

  const emailRes = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${resendKey}` },
    body: JSON.stringify({ from, to: [order.buyer_email], subject: `Your Download: ${productName} — AIVEXA Store`, html }),
  });

  const emailData = await emailRes.json();
  if (!emailRes.ok) {
    return NextResponse.json({ error: "Resend API error", details: emailData }, { status: 500 });
  }

  return NextResponse.json({ success: true, sentTo: order.buyer_email, emailId: emailData.id });
}
