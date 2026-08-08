import { notFound, redirect } from "next/navigation";
import { CheckCircle2, Download, Mail } from "lucide-react";
import Link from "next/link";
import { getDigitalProduct } from "@/lib/digital-products";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";

async function getOrderByRazorpayId(orderId: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;

  const sb = createClient(url, key);
  const { data } = await sb
    .from("aivexa_orders")
    .select("id, product_slug, buyer_name, buyer_email, status, razorpay_order_id")
    .eq("razorpay_order_id", orderId)
    .eq("status", "paid")
    .maybeSingle();
  return data;
}

export default async function SuccessPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ order?: string }>;
}) {
  const { slug } = await params;
  const { order } = await searchParams;

  if (!order) redirect(`/store/${slug}`);

  const [product, orderRecord] = await Promise.all([
    getDigitalProduct(slug),
    getOrderByRazorpayId(order),
  ]);

  if (!product) notFound();
  if (!orderRecord || orderRecord.product_slug !== slug) {
    redirect(`/store/${slug}`);
  }

  const hasFile = !!product.file_url;
  const emailEnabled = !!process.env.RESEND_API_KEY;

  return (
    <main>
      <section className="section" style={{ paddingTop: "7rem" }}>
        <div className="container">
          <div className="dp-success-card">

            {/* Icon */}
            <div className="dp-success-icon">
              <CheckCircle2 size={52} strokeWidth={1.5} />
            </div>

            <h1 className="dp-success-title">Payment Successful!</h1>

            <p className="dp-success-sub">
              Thank you{orderRecord.buyer_name ? `, ${orderRecord.buyer_name}` : ""}!
              Your purchase of <strong>{product.name}</strong> is confirmed.
            </p>

            {/* Email notice */}
            {emailEnabled && (
              <div className="dp-success-email">
                <Mail size={14} strokeWidth={2} style={{ display: "inline", marginRight: 6 }} />
                Download link sent to <strong>{orderRecord.buyer_email}</strong>
              </div>
            )}

            {/* Download button */}
            {hasFile ? (
              <a
                href={product.file_url}
                download
                className="dp-download-btn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download size={18} strokeWidth={2.2} />
                Download {product.name}
              </a>
            ) : (
              /* File not yet uploaded — show contact message */
              <div className="dp-no-file-notice">
                <p>
                  Your file will be delivered to <strong>{orderRecord.buyer_email}</strong> within
                  24 hours. If you don&apos;t receive it, contact us at{" "}
                  <a href="mailto:support@aivexallp.com">support@aivexallp.com</a> with your
                  Order ID below.
                </p>
              </div>
            )}

            {/* Order note */}
            <div className="dp-success-note">
              <p>Save this page URL — you can re-download from here anytime.</p>
              <p>
                Order ID: <code>{order}</code>
              </p>
            </div>

            <Link
              href="/store"
              className="dp-back-link"
              style={{ marginTop: "1.5rem", display: "inline-flex" }}
            >
              ← Back to Store
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
