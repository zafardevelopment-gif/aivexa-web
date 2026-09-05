import { redirect } from "next/navigation";
import { CheckCircle2, Download, Mail } from "lucide-react";
import Link from "next/link";
import { createClient } from "@supabase/supabase-js";
import { formatPrice } from "@/lib/digital-products";

export const dynamic = "force-dynamic";

export const metadata = { robots: { index: false, follow: false } };

async function getOrder(orderId: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  const sb = createClient(url, key);
  const { data } = await sb
    .from("aivexa_orders")
    .select("id, buyer_name, buyer_email, amount_paise, status, items, product_slug, razorpay_order_id")
    .eq("razorpay_order_id", orderId)
    .eq("status", "paid")
    .maybeSingle();
  return data;
}

async function getProductFileUrls(slugs: string[]) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key || !slugs.length) return [];
  const sb = createClient(url, key);
  const { data } = await sb
    .from("aivexa_digital_products")
    .select("id, slug, name, file_url")
    .in("slug", slugs);
  return data ?? [];
}

export default async function OrderSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  if (!order) redirect("/store");

  const orderRecord = await getOrder(order);
  if (!orderRecord) redirect("/store");

  // Collect slugs from items JSON or product_slug
  const items: { id: number; slug: string; name: string; price: number }[] =
    Array.isArray(orderRecord.items) && orderRecord.items.length > 0
      ? orderRecord.items
      : orderRecord.product_slug
        ? [{ id: 0, slug: orderRecord.product_slug, name: orderRecord.product_slug, price: 0 }]
        : [];

  const slugs = items.map((i) => i.slug);
  const productFiles = await getProductFileUrls(slugs);

  return (
    <main>
      <section className="section" style={{ paddingTop: "7rem" }}>
        <div className="container">
          <div className="dp-success-card">
            <div className="dp-success-icon">
              <CheckCircle2 size={36} strokeWidth={2} />
            </div>
            <h1 className="dp-success-title">Payment Successful!</h1>
            <p className="dp-success-sub">
              Thank you{orderRecord.buyer_name ? `, ${orderRecord.buyer_name}` : ""}!
              Your purchase of <strong>{formatPrice(orderRecord.amount_paise)}</strong> is confirmed.
            </p>
            {process.env.RESEND_API_KEY && (
              <div className="dp-success-email">
                <Mail size={14} strokeWidth={2} style={{ display: "inline", marginRight: 6 }} />
                Download links sent to <strong>{orderRecord.buyer_email}</strong>
              </div>
            )}

            <div className="dp-success-downloads">
              <p className="dp-success-downloads-label">Your Downloads</p>
              {productFiles.map((pf) => (
                <a
                  key={pf.slug}
                  href={pf.file_url}
                  download
                  target="_blank"
                  rel="noopener noreferrer"
                  className="dp-download-item"
                >
                  <Download size={16} strokeWidth={2.2} />
                  <span>{pf.name}</span>
                </a>
              ))}
              {productFiles.length === 0 && (
                <div className="dp-no-file-notice">
                  <p>
                    Your files will be delivered to <strong>{orderRecord.buyer_email}</strong> within
                    24 hours. For help, email{" "}
                    <a href="mailto:support@aivexallp.com">support@aivexallp.com</a> with your Order ID.
                  </p>
                </div>
              )}
            </div>

            <div className="dp-success-note">
              <p>Keep this page URL saved — download links are available for 48 hours.</p>
              <p>Order ID: <code>{order}</code></p>
            </div>

            <Link href="/store" className="dp-back-link" style={{ marginTop: "1rem", display: "inline-flex" }}>
              ← Back to Store
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
