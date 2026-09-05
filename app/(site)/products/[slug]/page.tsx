import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, CheckCircle2, ExternalLink, Phone, MessageCircle } from "lucide-react";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import { getProduct, getProducts } from "@/lib/data";
import { getExternalLink } from "@/lib/external-links";
import { getProductContent } from "@/lib/product-content";
import { SITE_URL, siteConfig } from "@/lib/seo/config";

export const revalidate = 60;

const CALL_NUMBER = "+91-9204298771";
const CALL_TEL = "+919204298771";
const WHATSAPP_URL =
  "https://wa.me/919204298771?text=" +
  encodeURIComponent("Hi AIVEXA, I'd like to know more about your AI products.");

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

  const content = getProductContent(slug);
  const path = `/products/${slug}`;

  const title = content?.seoTitle ?? `${product.name} — AIVEXA`;
  const description = content?.seoDescription ?? product.description;

  return {
    title,
    description,
    keywords: content?.keywords,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      siteName: siteConfig.name,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
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
  const content = getProductContent(slug);
  const rich = Boolean(content?.intro);
  const path = `${SITE_URL}/products/${slug}`;

  // Structured data — Product/SoftwareApplication + FAQPage + Breadcrumb.
  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Products", item: `${SITE_URL}/#products` },
        { "@type": "ListItem", position: 3, name: product.name, item: path },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: product.name,
      applicationCategory: "BusinessApplication",
      operatingSystem: "WhatsApp / Web / Voice",
      url: path,
      description: content?.seoDescription ?? product.description,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "INR",
        description: "Free pilot for eligible businesses",
      },
      provider: {
        "@type": "Organization",
        name: siteConfig.legalName,
        url: SITE_URL,
      },
    },
  ];

  if (content?.faqs && content.faqs.length > 0) {
    jsonLd.push({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: content.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    });
  }

  return (
    <main>
      {jsonLd.map((obj, i) => (
        <script
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }}
        />
      ))}

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
            {content?.heroSubhead ?? product.tagline}
          </p>
          <div style={{ display: "flex", gap: ".9rem", justifyContent: "center", flexWrap: "wrap", marginTop: "1.6rem" }}>
            {externalUrl ? (
              <a href={externalUrl} target="_blank" rel="noopener noreferrer" className="btn-primary">
                Visit {product.name} <ExternalLink size={16} strokeWidth={2.2} />
              </a>
            ) : (
              <a href={`tel:${CALL_TEL}`} className="btn-primary">
                <Phone size={16} strokeWidth={2.2} /> Call {CALL_NUMBER}
              </a>
            )}
            <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <MessageCircle size={16} strokeWidth={2.2} /> WhatsApp Us
            </a>
          </div>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>›</span>
            <Link href="/#products">Products</Link>
            <span>›</span>
            <span>{product.name}</span>
          </div>
        </div>
      </section>

      {/* Long-form intro — the crawlable, AI-quotable "what it is". */}
      {rich && content?.intro && (
        <section className="section" style={{ paddingTop: "2.5rem" }}>
          <div className="container" style={{ maxWidth: "820px" }}>
            {content.intro.map((para, i) => (
              <p
                key={i}
                className="section-desc"
                style={{ margin: "0 auto 1.4rem", textAlign: "left" }}
              >
                {para}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Capabilities (kept for every product). */}
      <section className="section" style={{ paddingTop: rich ? "1rem" : "3rem" }}>
        <div className="container" style={{ textAlign: "center" }}>
          {!rich && (
            <p className="section-desc" style={{ margin: "0 auto 3.2rem" }}>
              {product.description}
            </p>
          )}
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

      {rich && content && content.audience && content.steps && content.benefits && content.pilot && content.faqs && (
        <>
          {/* Who it's for. */}
          <section className="section" style={{ paddingTop: "1rem" }}>
            <div className="container" style={{ maxWidth: "820px" }}>
              <div className="section-header center">
                <div className="section-label">Best fit</div>
                <h2 className="section-title">{content.audience.heading}</h2>
              </div>
              <div className="feature-list-grid">
                {content.audience.items.map((item, i) => (
                  <Reveal key={item} delay={i % 3}>
                    <div className="feature-tile">
                      <CheckCircle2 size={19} strokeWidth={2.2} /> {item}
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* How it works. */}
          <section className="section" style={{ paddingTop: "1rem" }}>
            <div className="container">
              <div className="section-header center">
                <div className="section-label">How it works</div>
                <h2 className="section-title">
                  {product.name} in four steps
                </h2>
              </div>
              <div className="feature-list-grid">
                {content.steps.map((step, i) => (
                  <Reveal key={step.title} delay={i % 3}>
                    <div className="feature-tile" style={{ display: "block" }}>
                      <div className="section-label" style={{ marginBottom: ".4rem" }}>
                        Step {String(i + 1).padStart(2, "0")}
                      </div>
                      <strong style={{ display: "block", marginBottom: ".3rem" }}>{step.title}</strong>
                      <span>{step.description}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Benefits. */}
          <section className="section" style={{ paddingTop: "1rem" }}>
            <div className="container">
              <div className="section-header center">
                <div className="section-label">Why it matters</div>
                <h2 className="section-title">Results you can feel</h2>
              </div>
              <div className="feature-list-grid">
                {content.benefits.map((b, i) => (
                  <Reveal key={b.label} delay={i % 3}>
                    <div className="feature-tile" style={{ display: "block" }}>
                      <div className="accent" style={{ fontSize: "1.9rem", fontWeight: 800 }}>{b.stat}</div>
                      <strong style={{ display: "block", margin: ".2rem 0" }}>{b.label}</strong>
                      <span>{b.description}</span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
          </section>

          {/* Free pilot CTA. */}
          <section className="cta-band">
            <Reveal>
              <div className="cta-inner">
                <h2>{content.pilot.heading}</h2>
                <p>{content.pilot.body}</p>
                <div style={{ display: "flex", gap: ".6rem", justifyContent: "center", flexWrap: "wrap", margin: "1rem 0 1.4rem" }}>
                  {content.pilot.bullets.map((b) => (
                    <span key={b} className="feature-tile" style={{ fontSize: ".85rem" }}>
                      <CheckCircle2 size={15} strokeWidth={2.2} /> {b}
                    </span>
                  ))}
                </div>
                <div style={{ display: "flex", gap: ".9rem", justifyContent: "center", flexWrap: "wrap" }}>
                  <a href={`tel:${CALL_TEL}`} className="btn-primary">
                    <Phone size={16} strokeWidth={2.2} /> Call {CALL_NUMBER}
                  </a>
                  <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                    <MessageCircle size={16} strokeWidth={2.2} /> Start on WhatsApp
                  </a>
                </div>
              </div>
            </Reveal>
          </section>

          {/* FAQ — visible on-page (required for FAQPage schema to be honest). */}
          <section className="section" style={{ paddingTop: "2.5rem" }}>
            <div className="container" style={{ maxWidth: "820px" }}>
              <div className="section-header center">
                <div className="section-label">FAQ</div>
                <h2 className="section-title">Common questions</h2>
              </div>
              <div>
                {content.faqs.map((f) => (
                  <details key={f.q} className="feature-tile" style={{ display: "block", marginBottom: ".7rem", cursor: "pointer" }}>
                    <summary style={{ fontWeight: 700 }}>{f.q}</summary>
                    <p style={{ marginTop: ".6rem" }}>{f.a}</p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {/* Fallback CTA for lean (no-content) products. */}
      {!rich && (
        <section className="cta-band" style={{ marginBottom: "4.5rem" }}>
          <Reveal>
            <div className="cta-inner">
              <h2>Try {product.name} for your organization</h2>
              <p>Talk to us and get a personalized walkthrough.</p>
              <div style={{ display: "flex", gap: ".9rem", justifyContent: "center", flexWrap: "wrap", position: "relative" }}>
                <a href={`tel:${CALL_TEL}`} className="btn-primary">
                  <Phone size={16} strokeWidth={2.2} /> Call {CALL_NUMBER}
                </a>
                <a href={WHATSAPP_URL} target="_blank" rel="noopener noreferrer" className="btn-secondary">
                  <MessageCircle size={16} strokeWidth={2.2} /> WhatsApp Us
                </a>
              </div>
            </div>
          </Reveal>
        </section>
      )}

      {others.length > 0 && (
        <section className="section" style={{ paddingTop: 0, marginBottom: "3rem" }}>
          <div className="container" style={{ textAlign: "center" }}>
            <Link href={`/products/${others[0].slug}`} className="btn-secondary">
              Next: {others[0].name} <ArrowRight size={16} strokeWidth={2.2} />
            </Link>
          </div>
        </section>
      )}
    </main>
  );
}
