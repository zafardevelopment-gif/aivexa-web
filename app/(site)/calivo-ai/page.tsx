import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import Reveal from "@/components/Reveal";
import { calivo, calivoPlayUrl, CALIVO_PLAY_URL_CLEAN, PLAY_BADGE_IMG } from "@/lib/calivo";
import { blogPosts } from "@/lib/blog-posts";
import { SITE_URL, siteConfig } from "@/lib/seo/config";

const PATH = "/calivo-ai";
const TITLE = "CALIVO AI — AI Calorie Counter & Indian Diet Plan App (Free)";
const DESC =
  "Scan a photo of your Indian meal to count calories, get AI diet plans for weight loss, PCOS & diabetes, and track water, weight and fasting. Free on Google Play.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: [
    "CALIVO AI", "calorie counter app India", "AI calorie counter", "Indian food calorie counter",
    "food photo calorie app", "Indian diet plan app", "diet plan for weight loss Indian",
    "PCOS diet app", "diabetes diet app India", "calorie counter Hindi", "AI diet coach",
    "intermittent fasting app India", "protein tracker vegetarian",
  ],
  alternates: { canonical: PATH },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: PATH,
    type: "website",
    siteName: siteConfig.name,
    images: [{ url: "/calivo/01_dashboard.webp", width: 540, height: 960, alt: "CALIVO AI app" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/calivo/01_dashboard.webp"] },
  other: { "google-play-app": `app-id=com.calivoai.app` },
};

function PlayBadge({ source, height = 64 }: { source: string; height?: number }) {
  return (
    <a
      href={calivoPlayUrl(source)}
      target="_blank"
      rel="noopener"
      aria-label="Get CALIVO AI on Google Play"
      style={{ display: "inline-block", lineHeight: 0 }}
    >
      {/* Official Google Play badge (allowed by Google's badge guidelines). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={PLAY_BADGE_IMG} alt="Get it on Google Play" height={height} style={{ height, width: "auto" }} />
    </a>
  );
}

export default function CalivoAiPage() {
  const url = `${SITE_URL}${PATH}`;
  const posts = blogPosts.filter((p) => p.cta === "calivo").slice(0, 6);

  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "CALIVO AI", item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "MobileApplication",
      name: calivo.name,
      alternateName: "CALIVO AI: Calorie Counter",
      description: calivo.oneLiner,
      url,
      downloadUrl: CALIVO_PLAY_URL_CLEAN,
      installUrl: CALIVO_PLAY_URL_CLEAN,
      sameAs: [CALIVO_PLAY_URL_CLEAN],
      operatingSystem: "Android",
      applicationCategory: "HealthApplication",
      applicationSubCategory: "Calorie counter, diet planner",
      inLanguage: ["en", "hi", "ur", "ar"],
      image: `${SITE_URL}/calivo/calivo-icon.png`,
      screenshot: calivo.screenshots.map((s) => `${SITE_URL}${s.src}`),
      featureList: calivo.features.map((f) => f.title).join(", "),
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      author: { "@type": "Organization", name: siteConfig.legalName, url: SITE_URL },
      publisher: { "@type": "Organization", name: siteConfig.legalName, url: SITE_URL },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: calivo.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <main>
      {jsonLd.map((obj, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }} />
      ))}

      {/* HERO */}
      <section className="page-hero">
        <div className="container">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/calivo/calivo-icon.png" alt="CALIVO AI app icon" width={96} height={96} style={{ borderRadius: 22, margin: "0 auto 1rem", boxShadow: "0 8px 24px rgba(0,0,0,.12)" }} />
          <div className="section-label" style={{ justifyContent: "center" }}>Free Android app · by AIVEXA</div>
          <h1 className="section-title">
            <span className="accent">CALIVO AI</span> — AI Calorie Counter &amp; Diet Coach for Indian Food
          </h1>
          <p className="section-desc" style={{ margin: "0 auto" }}>
            Click a photo of your thali and know the calories in seconds. Get dietitian-style Indian diet plans for
            weight loss, PCOS or diabetes — in English, हिंदी, اردو and العربية.
          </p>
          <div style={{ display: "flex", gap: "1rem", justifyContent: "center", alignItems: "center", flexWrap: "wrap", marginTop: "1.6rem" }}>
            <PlayBadge source="hero" height={68} />
          </div>
          <p style={{ fontSize: ".85rem", opacity: 0.75, marginTop: ".6rem" }}>Free download · No credit card · Android</p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>›</span>
            <span>CALIVO AI</span>
          </div>
        </div>
      </section>

      {/* WHAT IT IS — plain, quotable answer for search engines and AI assistants */}
      <section className="section" style={{ paddingTop: "2.5rem" }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <h2 className="section-title" style={{ fontSize: "1.6rem" }}>What is CALIVO AI?</h2>
          <p className="section-desc" style={{ margin: "0 auto 1.2rem", textAlign: "left" }}>{calivo.oneLiner}</p>
          <p className="section-desc" style={{ margin: "0 auto", textAlign: "left" }}>
            Most calorie apps are built for burgers and salads. CALIVO AI is built for <strong>dal-chawal, roti-sabzi,
            idli-sambar, poha and biryani</strong>. It understands katori and roti portions, estimates the oil and ghee in
            your cooking, and its AI dietitian plans meals around the foods you already eat at home.
          </p>
        </div>
      </section>

      {/* SCREENSHOTS */}
      <section className="section" style={{ paddingTop: "1rem" }}>
        <div className="container">
          <div className="section-header center">
            <div className="section-label">Inside the app</div>
            <h2 className="section-title">See CALIVO AI in action</h2>
          </div>
          <div style={{ display: "flex", gap: "1rem", overflowX: "auto", paddingBottom: "1rem", scrollSnapType: "x mandatory" }}>
            {calivo.screenshots.map((s) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={s.src} src={s.src} alt={s.alt} width={240} height={427} loading="lazy"
                style={{ width: 240, height: "auto", borderRadius: 18, flex: "0 0 auto", scrollSnapAlign: "start", boxShadow: "0 6px 20px rgba(0,0,0,.10)" }} />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="section" style={{ paddingTop: "1rem" }}>
        <div className="container">
          <div className="section-header center">
            <div className="section-label">Features</div>
            <h2 className="section-title">Everything you need to <span className="accent">eat smarter</span></h2>
          </div>
          <div className="feature-list-grid">
            {calivo.features.map((f, i) => (
              <Reveal key={f.title} delay={i % 3}>
                <div className="feature-tile" style={{ display: "block" }}>
                  <div style={{ fontSize: "1.6rem", marginBottom: ".3rem" }}>{f.icon}</div>
                  <h3 style={{ fontSize: "1rem", fontWeight: 700, margin: "0 0 .3rem" }}>{f.title}</h3>
                  <span>{f.text}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="section" style={{ paddingTop: "1rem" }}>
        <div className="container">
          <div className="section-header center">
            <div className="section-label">How it works</div>
            <h2 className="section-title">Start in 4 simple steps</h2>
          </div>
          <div className="feature-list-grid">
            {calivo.steps.map((s, i) => (
              <Reveal key={s.title} delay={i % 3}>
                <div className="feature-tile" style={{ display: "block" }}>
                  <div className="section-label" style={{ marginBottom: ".4rem" }}>Step {String(i + 1).padStart(2, "0")}</div>
                  <strong style={{ display: "block", marginBottom: ".3rem" }}>{s.title}</strong>
                  <span>{s.text}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="section" style={{ paddingTop: "1rem" }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="section-header center">
            <div className="section-label">Made for</div>
            <h2 className="section-title">Who is CALIVO AI for?</h2>
          </div>
          <div className="feature-list-grid">
            {calivo.audience.map((a, i) => (
              <Reveal key={a} delay={i % 3}>
                <div className="feature-tile"><CheckCircle2 size={19} strokeWidth={2.2} /> {a}</div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-band">
        <Reveal>
          <div className="cta-inner">
            <h2>Download CALIVO AI — it&apos;s free</h2>
            <p>Your AI dietitian for Indian food, in your pocket. Scan your next meal in 5 seconds.</p>
            <div style={{ display: "flex", justifyContent: "center", marginTop: "1rem", position: "relative" }}>
              <PlayBadge source="cta_band" height={64} />
            </div>
          </div>
        </Reveal>
      </section>

      {/* FAQ — visible on page (required for honest FAQPage schema) */}
      <section className="section" style={{ paddingTop: "2.5rem" }}>
        <div className="container" style={{ maxWidth: 820 }}>
          <div className="section-header center">
            <div className="section-label">FAQ</div>
            <h2 className="section-title">Frequently asked questions</h2>
          </div>
          {calivo.faqs.map((f) => (
            <details key={f.q} className="feature-tile" style={{ display: "block", marginBottom: ".7rem", cursor: "pointer" }}>
              <summary style={{ fontWeight: 700 }}>{f.q}</summary>
              <p style={{ marginTop: ".6rem" }}>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* GUIDES — internal links to the blog cluster */}
      {posts.length > 0 && (
        <section className="section" style={{ paddingTop: "1rem" }}>
          <div className="container">
            <div className="section-header center">
              <div className="section-label">Free guides</div>
              <h2 className="section-title">Indian diet &amp; nutrition guides</h2>
            </div>
            <div className="feature-list-grid">
              {posts.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="feature-tile" style={{ display: "block" }}>
                  <strong style={{ display: "block", marginBottom: ".3rem" }}>{p.title}</strong>
                  <span style={{ fontSize: ".85rem", opacity: 0.8 }}>{p.description}</span>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="section" style={{ paddingTop: 0, marginBottom: "3rem" }}>
        <div className="container" style={{ textAlign: "center", fontSize: ".85rem", opacity: 0.8 }}>
          <p>
            CALIVO AI provides estimates for general wellness and is not medical advice. Consult your doctor for medical
            conditions. · <Link href="/calivo-ai/privacy-policy">Privacy policy</Link> · Support:{" "}
            <a href={`mailto:${calivo.supportEmail}`}>{calivo.supportEmail}</a>
          </p>
        </div>
      </section>
    </main>
  );
}
