import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, ExternalLink } from "lucide-react";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import { getProduct, getProducts } from "@/lib/data";
import { getExternalLink } from "@/lib/external-links";

export const revalidate = 60;

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) return { title: "Product — AIVEXA" };
  return {
    title: `${product.name} — AIVEXA`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProduct(slug);
  if (!product) notFound();

  const others = (await getProducts()).filter((p) => p.slug !== slug);
  const externalUrl = getExternalLink(slug);

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="product-hero-icon">
            <Icon name={product.icon} size={38} strokeWidth={2} />
          </div>
          {product.badge && (
            <span className="product-badge" style={{ marginBottom: "1rem", display: "inline-block" }}>
              {product.badge}
            </span>
          )}
          <h1 className="section-title">
            <span className="accent">{product.name}</span>
          </h1>
          <p className="section-desc" style={{ margin: "0 auto" }}>
            {product.tagline}
          </p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>›</span>
            <Link href="/#products">Products</Link>
            <span>›</span>
            <span>{product.name}</span>
          </div>
        </div>
      </section>

      <section className="section" style={{ paddingTop: "3rem" }}>
        <div className="container" style={{ textAlign: "center" }}>
          <p className="section-desc" style={{ margin: "0 auto 3.2rem" }}>
            {product.description}
          </p>
          <div className="section-header center">
            <div className="section-label">Capabilities</div>
            <h2 className="section-title">
              What <span className="accent">{product.name}</span> does
            </h2>
          </div>
          <div className="feature-list-grid">
            {product.features.map((feature, i) => (
              <Reveal key={feature} delay={i % 3}>
                <div className="feature-tile">
                  <CheckCircle2 size={19} strokeWidth={2.2} /> {feature}
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="cta-band" style={{ marginBottom: "4.5rem" }}>
        <Reveal>
          <div className="cta-inner">
            <h2>Try {product.name} for your organization</h2>
            <p>Talk to us and get a personalized walkthrough.</p>
            <div style={{ display: "flex", gap: ".9rem", justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
              {externalUrl ? (
                <a href={externalUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                  Visit {product.name} <ExternalLink size={16} strokeWidth={2.2} />
                </a>
              ) : (
                <a href="/#contact" className="btn-primary">
                  Book a Demo <ArrowRight size={16} strokeWidth={2.2} />
                </a>
              )}
              {others.length > 0 && (
                <Link href={`/products/${others[0].slug}`} className="btn-secondary">
                  Next: {others[0].name}
                </Link>
              )}
            </div>
          </div>
        </Reveal>
      </section>
    </main>
  );
}
