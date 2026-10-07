import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { LANG_META, UI, fill, type LandingContent, type LangCode } from "@/lib/landing-i18n";
import { SITE_URL, siteConfig } from "@/lib/seo/config";

export interface LandingApp {
  name: string;
  basePath: string; // "/miftah"
  langs: LangCode[];
  icon: string;
  playUrl: (source: string) => string;
  playUrlClean: string;
  badgeImg: string;
  category: string; // schema.org applicationCategory
  subCategory: string;
  alternateNames: string[];
  privacyHref: string;
  supportEmail: string;
  screenshots: { src: string; alt: string }[];
  /** Optional theming (Miftah = green/gold). */
  brandStyle?: React.CSSProperties;
  heroBackground?: string;
  h1Gradient?: string;
  bandBackground?: string;
  stepBackground?: string;
  /** "card" = Miftah prayer card, "phones" = two screenshots. */
  heroVisual: "card" | "phones";
  footNote?: string;
  posts?: { slug: string; title: string; description: string }[];
}

export function langPath(app: Pick<LandingApp, "basePath">, lang: LangCode): string {
  return lang === "en" ? app.basePath : `${app.basePath}/${lang}`;
}

function PlayBadge({ app, source, height, alt }: { app: LandingApp; source: string; height: number; alt: string }) {
  return (
    <a href={app.playUrl(source)} target="_blank" rel="noopener" aria-label={alt} style={{ display: "inline-block", lineHeight: 0 }}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={app.badgeImg} alt={alt} height={height} style={{ height, width: "auto" }} />
    </a>
  );
}

/** Row of language links — each language is its own indexable URL. */
function LangSwitcher({ app, lang }: { app: LandingApp; lang: LangCode }) {
  return (
    <nav
      aria-label={UI[lang].language}
      style={{ display: "flex", flexWrap: "wrap", gap: ".4rem", alignItems: "center", marginBottom: "1.1rem" }}
    >
      <span style={{ fontSize: ".8rem", color: "#64748b", marginInlineEnd: ".2rem" }}>🌐 {UI[lang].language}:</span>
      {app.langs.map((l) => (
        <Link
          key={l}
          href={langPath(app, l)}
          hrefLang={LANG_META[l].hreflang}
          lang={l}
          aria-current={l === lang ? "page" : undefined}
          style={{
            padding: ".25rem .65rem",
            borderRadius: 999,
            fontSize: ".82rem",
            fontWeight: l === lang ? 800 : 600,
            border: "1px solid " + (l === lang ? "currentColor" : "#e2e8f0"),
            background: l === lang ? "rgba(0,0,0,.04)" : "#fff",
            color: l === lang ? "var(--cv-green-d, #0f766e)" : "#334155",
            textDecoration: "none",
          }}
        >
          {LANG_META[l].label}
        </Link>
      ))}
    </nav>
  );
}

export default function LocalizedAppLanding({ app, lang, c }: { app: LandingApp; lang: LangCode; c: LandingContent }) {
  const ui = UI[lang];
  const meta = LANG_META[lang];
  const path = langPath(app, lang);
  const url = `${SITE_URL}${path}`;
  const vars = { name: app.name, company: siteConfig.legalName };

  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: ui.home, item: SITE_URL },
        { "@type": "ListItem", position: 2, name: app.name, item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "MobileApplication",
      name: app.name,
      alternateName: app.alternateNames,
      description: c.what[0],
      url,
      inLanguage: lang,
      downloadUrl: app.playUrlClean,
      installUrl: app.playUrlClean,
      sameAs: [app.playUrlClean],
      operatingSystem: "Android",
      applicationCategory: app.category,
      applicationSubCategory: app.subCategory,
      image: `${SITE_URL}${app.icon}`,
      ...(app.screenshots.length ? { screenshot: app.screenshots.map((s) => `${SITE_URL}${s.src}`) } : {}),
      featureList: c.features.map((f) => f.title).join(", "),
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      author: { "@type": "Organization", name: siteConfig.legalName, url: SITE_URL },
      publisher: { "@type": "Organization", name: siteConfig.legalName, url: SITE_URL },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      inLanguage: lang,
      mainEntity: c.faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  const em = (s: string) => {
    // Highlight the app name inside a heading.
    const i = s.indexOf(app.name);
    if (i < 0) return s;
    return (
      <>
        {s.slice(0, i)}
        <em>{app.name}</em>
        {s.slice(i + app.name.length)}
      </>
    );
  };

  return (
    <main className="cv" style={app.brandStyle} lang={lang} dir={meta.dir}>
      {jsonLd.map((obj, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }} />
      ))}

      {/* HERO */}
      <section className="cv-hero" style={app.heroBackground ? { background: app.heroBackground } : undefined}>
        <div className="cv-wrap cv-hero-grid">
          <div>
            <LangSwitcher app={app} lang={lang} />
            <div className="cv-brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={app.icon} alt={`${app.name} app icon`} width={56} height={56} />
              <span>{ui.freeApp}</span>
            </div>
            <h1 className="cv-h1">
              <em
                style={
                  app.h1Gradient
                    ? { background: app.h1Gradient, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }
                    : undefined
                }
              >
                {app.name}
              </em>{" "}
              — {c.h1Rest}
            </h1>
            <p className="cv-sub">{c.sub}</p>
            <div className="cv-cta-row">
              <PlayBadge app={app} source={`hero_${lang}`} height={60} alt={ui.getOnPlay} />
              <a href="#features" className="cv-link-btn">{ui.seeFeatures}</a>
            </div>
            <div className="cv-trust">
              {c.trust.map((t) => (
                <span key={t}>{t}</span>
              ))}
            </div>
            <div className="cv-crumb">
              <Link href="/">{ui.home}</Link> › {app.name}
            </div>
          </div>

          {app.heroVisual === "card" && c.heroCard ? (
            <div
              aria-hidden="true"
              style={{
                background: "linear-gradient(135deg, #1E4438 0%, #2F5D50 55%, #4A7F6C 100%)",
                borderRadius: 28,
                padding: "1.8rem",
                color: "#fff",
                boxShadow: "0 24px 60px rgba(30,68,56,.35)",
              }}
            >
              <div style={{ color: "#C7A25A", fontWeight: 700 }}>{c.heroCard.greet}</div>
              <div style={{ opacity: 0.8, fontSize: ".85rem" }}>{c.heroCard.next}</div>
              <div style={{ fontSize: "2.2rem", fontWeight: 800, margin: ".2rem 0" }}>{c.heroCard.prayer}</div>
              <div style={{ opacity: 0.85, fontSize: ".9rem", marginBottom: "1.2rem" }}>{c.heroCard.remaining}</div>
              {c.features.slice(0, 4).map((f) => (
                <div
                  key={f.title}
                  style={{ display: "flex", gap: ".8rem", alignItems: "flex-start", padding: ".7rem 0", borderTop: "1px solid rgba(255,255,255,.12)" }}
                >
                  <span style={{ fontSize: "1.3rem" }}>{f.icon}</span>
                  <strong style={{ fontSize: ".95rem" }}>{f.title}</strong>
                </div>
              ))}
            </div>
          ) : (
            app.screenshots.length >= 2 && (
              <div className="cv-phones" aria-hidden="true">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={app.screenshots[1].src} alt="" width={250} height={444} />
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={app.screenshots[0].src} alt="" width={250} height={444} />
              </div>
            )
          )}
        </div>
      </section>

      {/* WHAT IT IS */}
      <section className="cv-sec">
        <div className="cv-narrow cv-what">
          <h2 className="cv-h2">{em(fill(ui.whatIs, vars))}</h2>
          {c.what.map((p) => (
            <p key={p.slice(0, 40)}>{p}</p>
          ))}
        </div>
      </section>

      {/* SCREENSHOTS */}
      {app.screenshots.length > 0 && (
        <section className="cv-sec cv-sec-alt">
          <div className="cv-wrap">
            <div className="cv-head">
              <div className="cv-pill">{ui.pillInside}</div>
              <h2 className="cv-h2">{fill(ui.insideTitle, vars)}</h2>
            </div>
            <div className="cv-shots" dir="ltr">
              {app.screenshots.map((s) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={s.src} src={s.src} alt={s.alt} width={200} height={356} loading="lazy" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FEATURES */}
      <section className="cv-sec" id="features">
        <div className="cv-wrap">
          <div className="cv-head">
            <div className="cv-pill">{ui.pillFeatures}</div>
            <h2 className="cv-h2">{c.featuresTitle}</h2>
          </div>
          <div className="cv-feat-grid">
            {c.features.map((f) => (
              <div key={f.title} className="cv-feat">
                <div className="cv-feat-ic" aria-hidden="true">{f.icon}</div>
                <div>
                  <h3>{f.title}</h3>
                  <p>{f.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="cv-sec cv-sec-alt">
        <div className="cv-wrap">
          <div className="cv-head">
            <div className="cv-pill">{ui.pillHow}</div>
            <h2 className="cv-h2">{ui.howTitle}</h2>
          </div>
          <div className="cv-steps">
            {c.steps.map((s, i) => (
              <div key={s.title} className="cv-step">
                <div className="cv-step-n" style={app.stepBackground ? { background: app.stepBackground } : undefined}>
                  {i + 1}
                </div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="cv-sec">
        <div className="cv-wrap">
          <div className="cv-head">
            <div className="cv-pill">{ui.pillMade}</div>
            <h2 className="cv-h2">{em(fill(ui.madeTitle, vars))}</h2>
          </div>
          <div className="cv-aud">
            {c.audience.map((a) => (
              <div key={a}>
                <CheckCircle2 size={19} strokeWidth={2.2} /> <span>{a}</span>
              </div>
            ))}
          </div>
          {c.price && <p style={{ textAlign: "center", marginTop: "1.6rem", color: "#475569" }}>{c.price}</p>}
        </div>
      </section>

      {/* CTA */}
      <section className="cv-wrap" style={{ margin: "4.5rem auto" }}>
        <div className="cv-band" style={app.bandBackground ? { background: app.bandBackground } : undefined}>
          <h2>{c.ctaTitle}</h2>
          <p>{c.ctaText}</p>
          <PlayBadge app={app} source={`cta_${lang}`} height={62} alt={ui.getOnPlay} />
        </div>
      </section>

      {/* GUIDES (English blog) */}
      {app.posts && app.posts.length > 0 && (
        <section className="cv-sec">
          <div className="cv-wrap">
            <div className="cv-head">
              <div className="cv-pill">{ui.pillGuides}</div>
            </div>
            <div className="cv-guides" dir="ltr">
              {app.posts.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="cv-guide">
                  <strong>{p.title}</strong>
                  <span>{p.description}</span>
                  <i>{ui.readGuide}</i>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="cv-sec cv-sec-alt">
        <div className="cv-narrow cv-faq">
          <div className="cv-head">
            <div className="cv-pill">{ui.pillFaq}</div>
            <h2 className="cv-h2">{ui.faqTitle}</h2>
          </div>
          {c.faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="cv-foot cv-wrap">
        {app.footNote ? `${app.footNote} · ` : ""}
        {fill(ui.productOf, vars)} · <Link href={app.privacyHref}>{ui.privacy}</Link> · {ui.support}:{" "}
        <a href={`mailto:${app.supportEmail}`}>{app.supportEmail}</a>
      </div>
    </main>
  );
}
