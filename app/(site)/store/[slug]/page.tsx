import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowLeft, CheckCircle2, FileDown, Files, HardDrive, Shield, Tag, Zap } from "lucide-react";
import Link from "next/link";
import Reveal from "@/components/Reveal";
import { getDigitalProduct, getDigitalProducts, formatPrice } from "@/lib/digital-products";
import RazorpayButton from "./RazorpayButton";
import AddToCartBtn from "@/components/AddToCartBtn";
import ImageGallery from "./ImageGallery";

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getDigitalProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getDigitalProduct(slug);
  if (!product) return { title: "Product — AIVEXA Store" };
  return {
    title: `${product.name} — AIVEXA Store`,
    description: product.tagline || product.description,
  };
}

export default async function StoreProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getDigitalProduct(slug);
  if (!product) notFound();

  const discount =
    product.original_price > 0
      ? Math.round(((product.original_price - product.price) / product.original_price) * 100)
      : 0;

  // Merge main image + gallery images (deduplicated)
  const allImages = [
    ...(product.preview_image ? [product.preview_image] : []),
    ...(product.preview_images ?? []).filter((u) => u !== product.preview_image),
  ];

  const features   = product.features   ?? [];
  const highlights = product.highlights ?? [];

  return (
    <main>
      <section className="section" style={{ paddingTop: "7rem" }}>
        <div className="container">
          <Reveal>
            <Link href="/store" className="dp-back-link">
              <ArrowLeft size={15} strokeWidth={2.2} /> Back to Store
            </Link>
          </Reveal>

          <div className="dp-detail-grid">
            {/* Left: image gallery */}
            <Reveal>
              <div className="dp-detail-img-wrap">
                {allImages.length > 0 ? (
                  <ImageGallery images={allImages} name={product.name} />
                ) : (
                  <div className="dp-detail-img-placeholder">
                    <FileDown size={56} strokeWidth={1.2} />
                    <p>{product.category || "Digital Product"}</p>
                  </div>
                )}

                {/* File meta stats */}
                {(product.pages_count > 0 || product.file_size) && (
                  <div className="dp-file-meta">
                    {product.pages_count > 0 && (
                      <span className="dp-file-meta-chip">
                        <Files size={13} strokeWidth={2.2} />
                        {product.pages_count} {product.category === "Guide" ? "ideas" : "pages"}
                      </span>
                    )}
                    {product.file_size && (
                      <span className="dp-file-meta-chip">
                        <HardDrive size={13} strokeWidth={2.2} />
                        {product.file_size}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </Reveal>

            {/* Right: info + checkout */}
            <Reveal>
              <div className="dp-detail-info">
                {product.category && (
                  <span className="dp-category">
                    <Tag size={11} strokeWidth={2.2} /> {product.category}
                  </span>
                )}
                <h1 className="dp-detail-title">{product.name}</h1>
                {product.tagline && (
                  <p className="dp-detail-tagline">{product.tagline}</p>
                )}

                {/* Key highlights chips */}
                {highlights.length > 0 && (
                  <div className="dp-highlights">
                    {highlights.map((h, idx) => (
                      <span key={idx} className="dp-highlight-chip">{h}</span>
                    ))}
                  </div>
                )}

                <div className="dp-detail-price-row">
                  <span className="dp-detail-price">{formatPrice(product.price)}</span>
                  {product.original_price > 0 && (
                    <>
                      <span className="dp-original-price dp-original-price--lg">
                        {formatPrice(product.original_price)}
                      </span>
                      <span className="dp-discount-badge">{discount}% OFF</span>
                    </>
                  )}
                </div>

                {product.description && (
                  <p className="dp-detail-desc">{product.description}</p>
                )}

                {/* What's included */}
                {features.length > 0 && (
                  <div className="dp-features-box">
                    <h3 className="dp-features-title">What&apos;s included</h3>
                    <ul className="dp-features-list">
                      {features.map((f, idx) => (
                        <li key={idx}>
                          <CheckCircle2 size={14} strokeWidth={2.2} color="var(--accent)" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="dp-trust-list">
                  <span><Zap size={14} strokeWidth={2.2} /> Instant download after payment</span>
                  <span><Shield size={14} strokeWidth={2.2} /> Secure Razorpay checkout</span>
                  <span><CheckCircle2 size={14} strokeWidth={2.2} /> UPI, Cards &amp; Net Banking</span>
                  <span><CheckCircle2 size={14} strokeWidth={2.2} /> One-time purchase, no subscription</span>
                </div>

                <AddToCartBtn
                  product={{
                    id: product.id,
                    slug: product.slug,
                    name: product.name,
                    price: product.price,
                    category: product.category,
                    preview_image: product.preview_image,
                  }}
                  variant="detail"
                />
                <div className="dp-detail-divider"><span>or pay directly</span></div>
                <RazorpayButton product={product} />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
