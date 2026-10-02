import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import { type AivexaApp, appUrl } from "@/lib/aivexa-apps";
import { SITE_URL, siteConfig } from "@/lib/seo/config";
import "@/app/(site)/calivo-ai/calivo.css";

/** Shared metadata for an AIVEXA app landing page. */
export function appMetadata(app: AivexaApp): Metadata {
  const path = `/${app.slug}`;
  return {
    title: app.seoTitle,
    description: app.seoDescription,
    keywords: app.keywords,
    alternates: { canonical: path },
    openGraph: { title: app.seoTitle, description: app.seoDescription, url: path, type: "website", siteName: siteConfig.name },
    twitter: { card: "summary_large_image", title: app.seoTitle, description: app.seoDescription },
  };
}

/** Rich landing page (same look as /calivo-ai) for an AIVEXA SaaS product. */
export default function AppLanding({ app }: { app: AivexaApp }) {
  const url = `${SITE_URL}/${app.slug}`;
  const brand = {
    "--cv-green": app.color,
    "--cv-green-d": app.colorDark,
    "--cv-green-l": app.colorLight,
  } as React.CSSProperties;

  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: app.name, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: app.name,
      description: app.oneLiner,
      url: app.url,
      sameAs: [app.url, url],
      applicationCategory: app.category,
      operatingSystem: app.platform,
      featureList: app.features.map((f) => f.title).join(", "),
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR", description: "Free trial" },
      ...(app.icon ? { image: `${SITE_URL}${app.icon}` } : {}),
      author: { "@type": "Organization", name: siteConfig.legalName, url: SITE_URL },
      publisher: { "@type": "Organization", name: siteConfig.legalName, url: SITE_URL },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: app.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  const Icon = ({ size }: { size: number }) =>
    app.icon ? (
      // eslint-disable-next-line @next/next/no-img-element
      <img src={app.icon} alt={`${app.name} logo`} width={size} height={size} />
    ) : (
      <span style={{ width: size, height: size, borderRadius: 14, background: app.colorLight, display: "inline-flex", alignItems: "center", justifyContent: "center", fontSize: size * 0.55 }}>{app.emoji}</span>
    );

  return (
    <main className="cv" style={brand}>
      {jsonLd.map((o, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(o) }} />
      ))}

      <section className="cv-hero" style={{ background: `radial-gradient(1200px 500px at 85% 10%, ${app.colorLight} 0%, transparent 60%), linear-gradient(180deg, ${app.colorLight} 0%, #fff 100%)` }}>
        <div className="cv-wrap cv-hero-grid">
          <div>
            <div className="cv-brand">
              <Icon size={56} />
              <span>{app.badge}</span>
            </div>
            <h1 className="cv-h1">
              {app.h1} <em style={{ background: `linear-gradient(90deg, ${app.colorDark}, ${app.color})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>{app.h1Accent}</em>
            </h1>
            <p className="cv-sub">{app.sub}</p>
            <div className="cv-cta-row">
              <a href={appUrl(app, "hero")} target="_blank" rel="noopener" className="btn-primary" style={{ background: app.color, padding: "1rem 1.6rem", fontSize: "1rem" }}>
                {app.ctaLabel} →
              </a>
              <a href="#features" className="cv-link-btn">See features ↓</a>
            </div>
            <div className="cv-trust">
              {app.trust.map((t) => <span key={t}>✅ <b>{t}</b></span>)}
            </div>
            <div className="cv-crumb"><Link href="/">Home</Link> › {app.name}</div>
          </div>
          <div aria-hidden="true" style={{ background: "#fff", borderRadius: 24, border: "1px solid #e2e8f0", boxShadow: "0 24px 60px rgba(15,23,42,.12)", padding: "1.6rem" }}>
            <div style={{ display: "flex", alignItems: "center", gap: ".7rem", marginBottom: "1rem" }}>
              <Icon size={40} />
              <strong style={{ fontSize: "1.1rem" }}>{app.name}</strong>
            </div>
            {app.features.slice(0, 4).map((f) => (
              <div key={f.title} style={{ display: "flex", gap: ".8rem", alignItems: "flex-start", padding: ".75rem 0", borderTop: "1px solid #f1f5f9" }}>
                <span style={{ fontSize: "1.4rem" }}>{f.icon}</span>
                <div><strong style={{ display: "block", fontSize: ".95rem" }}>{f.title}</strong><span style={{ fontSize: ".85rem", color: "#64748b" }}>{f.text}</span></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cv-sec">
        <div className="cv-narrow cv-what">
          <h2 className="cv-h2">What is <em>{app.name}</em>?</h2>
          <p>{app.oneLiner}</p>
          <p>{app.whyText}</p>
        </div>
      </section>

      <section className="cv-sec cv-sec-alt" id="features">
        <div className="cv-wrap">
          <div className="cv-head">
            <div className="cv-pill">Features</div>
            <h2 className="cv-h2">What you get with <em>{app.name}</em></h2>
          </div>
          <div className="cv-feat-grid">
            {app.features.map((f) => (
              <div key={f.title} className="cv-feat">
                <div className="cv-feat-ic" aria-hidden="true">{f.icon}</div>
                <div><h3>{f.title}</h3><p>{f.text}</p></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cv-sec">
        <div className="cv-wrap">
          <div className="cv-head">
            <div className="cv-pill">How it works</div>
            <h2 className="cv-h2">Start in <em>4 simple steps</em></h2>
          </div>
          <div className="cv-steps">
            {app.steps.map((s, i) => (
              <div key={s.title} className="cv-step">
                <div className="cv-step-n" style={{ background: `linear-gradient(135deg, ${app.color}, ${app.colorDark})` }}>{i + 1}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cv-sec cv-sec-alt">
        <div className="cv-wrap">
          <div className="cv-head">
            <div className="cv-pill">Made for</div>
            <h2 className="cv-h2">Who is <em>{app.name}</em> for?</h2>
          </div>
          <div className="cv-aud">
            {app.audience.map((a) => (
              <div key={a}><CheckCircle2 size={19} strokeWidth={2.2} /> <span>{a}</span></div>
            ))}
          </div>
          <p style={{ textAlign: "center", marginTop: "1.6rem", color: "#475569" }}>{app.pricingNote}</p>
        </div>
      </section>

      <section className="cv-wrap" style={{ margin: "4.5rem auto" }}>
        <div className="cv-band" style={{ background: `linear-gradient(135deg, ${app.colorDark} 0%, ${app.color} 100%)` }}>
          <h2>Try {app.name} today</h2>
          <p>{app.pricingNote}</p>
          <a href={appUrl(app, "cta_band")} target="_blank" rel="noopener" className="btn-primary" style={{ background: "#fff", color: app.colorDark, padding: "1rem 1.8rem" }}>
            {app.ctaLabel} →
          </a>
        </div>
      </section>

      <section className="cv-sec">
        <div className="cv-narrow cv-faq">
          <div className="cv-head">
            <div className="cv-pill">FAQ</div>
            <h2 className="cv-h2">Frequently asked questions</h2>
          </div>
          {app.faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="cv-foot cv-wrap">
        {app.name} is a product of {siteConfig.legalName}. · <a href={appUrl(app, "footer")} target="_blank" rel="noopener">{app.url.replace(/^https?:\/\//, "").replace(/\/$/, "")}</a> · <Link href="/contact">Contact AIVEXA</Link>
      </div>
    </main>
  );
}
