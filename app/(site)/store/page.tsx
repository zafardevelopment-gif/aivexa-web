import Link from "next/link";
import type { Metadata } from "next";
import { FileDown, ShoppingCart, Tag } from "lucide-react";
import Reveal from "@/components/Reveal";
import { getDigitalProducts, formatPrice } from "@/lib/digital-products";
import AddToCartBtn from "@/components/AddToCartBtn";
import { SITE_URL } from "@/lib/seo";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Digital Products — AIVEXA Store | PDFs, Guides & Templates",
  description: "Buy AI-curated digital products: business idea books, prompt packs, planners and templates. Instant download. One-time payment. No subscription.",
  keywords: ["digital products", "AI business ideas", "PDF download", "prompt pack", "business guide", "AIVEXA store"],
  alternates: { canonical: "/store" },
  openGraph: {
    title: "AIVEXA Digital Store — AI-Powered PDFs & Guides",
    description: "Buy AI-curated digital products. Instant download after payment.",
    url: "/store",
    type: "website",
    siteName: "AIVEXA",
    images: [{ url: "/aivexa-logo.png", width: 512, height: 512, alt: "AIVEXA" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIVEXA Digital Store — AI-Powered PDFs & Guides",
    description: "Buy AI-curated digital products. Instant download after payment.",
    images: ["/aivexa-logo.png"],
  },
};

export default async function StorePage() {
  const products = await getDigitalProducts();

  // Group by category
  const categories = Array.from(new Set(products.map((p) => p.category || "Other")));

  const itemListJsonLd =
    products.length > 0
      ? {
          "@context": "https://schema.org",
          "@type": "ItemList",
          itemListElement: products.map((p, i) => ({
            "@type": "ListItem",
            position: i + 1,
            url: `${SITE_URL}/store/${p.slug}`,
            name: p.name,
          })),
        }
      : null;

  return (
    <main>
      {itemListJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListJsonLd) }}
        />
      )}
      <section className="dp-store-hero">
        <div className="container">
          <Reveal>
            <div className="section-label">Digital Products</div>
            <h1>Download & <span style={{opacity:.9}}>grow instantly</span></h1>
            <p>Ready-to-use PDFs, planners and templates — buy once, download instantly. No subscription, no waiting.</p>
          </Reveal>
        </div>
      </section>

      {products.length === 0 ? (
        <section className="section">
          <div className="container" style={{ maxWidth: 760, margin: "0 auto" }}>
            <Reveal>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: ".8rem", textAlign: "center" }}>
                New digital products are on the way
              </h2>
              <p style={{ color: "var(--muted)", lineHeight: 1.75, marginBottom: "1rem" }}>
                The AIVEXA Digital Store is being stocked with AI-curated, ready-to-use
                digital products — business idea books, prompt packs for AI tools,
                budget planners, and professionally designed templates that you can
                download and use immediately after a one-time payment. Every product
                is designed to save you the hours it would otherwise take to research
                or build the same thing from scratch, whether that's a set of validated
                business ideas, a curated prompt library, or a print-ready planner.
              </p>
              <p style={{ color: "var(--muted)", lineHeight: 1.75, marginBottom: "2rem" }}>
                Unlike subscription-based marketplaces, every product here is a
                one-time purchase with instant download and no recurring billing —
                you pay once and keep the file. While we finish curating the first
                batch of products, you can already put AIVEXA to work for free: browse
                our{" "}
                <Link href="/tools">96+ free online tools</Link> for PDFs, images,
                everyday calculators and document generation, or read practical guides
                on our <Link href="/blog">blog</Link> covering everything from GST
                calculations to Islamic finance and productivity tips.
              </p>
              <div style={{ display: "flex", gap: ".9rem", justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/tools" className="btn-primary">
                  Explore free tools
                </Link>
                <Link href="/blog" className="btn-secondary">
                  Read the blog
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      ) : (
        <section className="section">
          <div className="container">
            {categories.map((cat) => {
              const catProducts = products.filter((p) => (p.category || "Other") === cat);
              return (
                <div key={cat} className="dp-category-group">
                  <Reveal>
                    <h2 className="dp-category-heading">
                      <Tag size={16} strokeWidth={2.2} /> {cat}
                    </h2>
                  </Reveal>
                  <div className="dp-grid">
                    {catProducts.map((dp) => (
                      <Reveal key={dp.slug}>
                        <Link href={`/store/${dp.slug}`} className="dp-card">
                          {dp.preview_image ? (
                            <div className="dp-card-img">
                              <img src={dp.preview_image} alt={dp.name} loading="lazy" />
                            </div>
                          ) : (
                            <div className="dp-card-img-placeholder">
                              <FileDown size={32} strokeWidth={1.5} />
                              <span>{dp.category || "Digital Product"}</span>
                            </div>
                          )}
                          <div className="dp-card-body">
                            {dp.category && (
                              <span className="dp-category">
                                <Tag size={11} strokeWidth={2.2} /> {dp.category}
                              </span>
                            )}
                            <h3 className="dp-card-name">{dp.name}</h3>
                            <p className="dp-card-tagline">{dp.tagline}</p>
                            <div className="dp-card-footer">
                              <div className="dp-price-row">
                                <span className="dp-price">{formatPrice(dp.price)}</span>
                                {dp.original_price > 0 && (
                                  <span className="dp-original-price">{formatPrice(dp.original_price)}</span>
                                )}
                              </div>
                              <div className="dp-card-actions">
                                <AddToCartBtn product={{ id: dp.id, slug: dp.slug, name: dp.name, price: dp.price, category: dp.category, preview_image: dp.preview_image }} variant="card" />
                                <span className="dp-buy-btn">
                                  <ShoppingCart size={14} strokeWidth={2.2} /> Buy Now
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      </Reveal>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}
    </main>
  );
}
