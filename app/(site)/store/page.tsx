import Link from "next/link";
import type { Metadata } from "next";
import { FileDown, ShoppingCart, Tag } from "lucide-react";
import Reveal from "@/components/Reveal";
import { getDigitalProducts, formatPrice } from "@/lib/digital-products";
import AddToCartBtn from "@/components/AddToCartBtn";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Digital Products — AIVEXA",
  description: "Ready-to-use PDFs, planners, and templates. Buy once, download instantly.",
};

export default async function StorePage() {
  const products = await getDigitalProducts();

  // Group by category
  const categories = Array.from(new Set(products.map((p) => p.category || "Other")));

  return (
    <main>
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
          <div className="container center">
            <p className="admin-muted" style={{ textAlign: "center", padding: "4rem 0" }}>
              Products coming soon. Check back shortly!
            </p>
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
