import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import "./calivo.css";
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
    images: [{ url: "/calivo/calivo-og.png", width: 1200, height: 630, alt: "CALIVO AI — AI Calorie & Health Coach" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/calivo/calivo-og.png"] },
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
    <main className="cv">
      {jsonLd.map((obj, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }} />
      ))}

      {/* HERO */}
      <section className="cv-hero">
        <div className="cv-wrap cv-hero-grid">
          <div>
            <div className="cv-brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/calivo/calivo-icon.png" alt="CALIVO AI app icon" width={56} height={56} />
              <span>Free Android app · by AIVEXA</span>
            </div>
            <h1 className="cv-h1">
              <em>CALIVO AI</em> — AI Calorie Counter &amp; Diet Coach for Indian Food
            </h1>
            <p className="cv-sub">
              Click a photo of your thali and know the calories in seconds. Get dietitian-style Indian diet plans for
              weight loss, PCOS or diabetes — in English, हिंदी, اردو and العربية.
            </p>
            <div className="cv-cta-row">
              <PlayBadge source="hero" height={60} />
              <a href="#features" className="cv-link-btn">See features ↓</a>
            </div>
            <div className="cv-trust">
              <span>✅ <b>Free</b> download</span>
              <span>🍛 Built for <b>Indian food</b></span>
              <span>🌐 <b>4</b> languages</span>
            </div>
            <div className="cv-crumb"><Link href="/">Home</Link> › CALIVO AI</div>
          </div>
          <div className="cv-phones" aria-hidden="true">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={calivo.screenshots[1].src} alt="" width={250} height={444} />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={calivo.screenshots[0].src} alt="" width={250} height={444} />
          </div>
        </div>
      </section>

      {/* WHAT IT IS — plain, quotable answer for search engines and AI assistants */}
      <section className="cv-sec">
        <div className="cv-narrow cv-what">
          <h2 className="cv-h2">What is <em>CALIVO AI</em>?</h2>
          <p>{calivo.oneLiner}</p>
          <p>
            Most calorie apps are built for burgers and salads. CALIVO AI is built for <strong>dal-chawal, roti-sabzi,
            idli-sambar, poha and biryani</strong>. It understands katori and roti portions, estimates the oil and ghee in
            your cooking, and its AI dietitian plans meals around the foods you already eat at home.
          </p>
        </div>
      </section>

      {/* SCREENSHOTS */}
      <section className="cv-sec cv-sec-alt">
        <div className="cv-wrap">
          <div className="cv-head">
            <div className="cv-pill">Inside the app</div>
            <h2 className="cv-h2">See CALIVO AI in action</h2>
          </div>
          <div className="cv-shots">
            {calivo.screenshots.map((s) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={s.src} src={s.src} alt={s.alt} width={200} height={356} loading="lazy" />
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="cv-sec" id="features">
        <div className="cv-wrap">
          <div className="cv-head">
            <div className="cv-pill">Features</div>
            <h2 className="cv-h2">Everything you need to <em>eat smarter</em></h2>
          </div>
          <div className="cv-feat-grid">
            {calivo.features.map((f) => (
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
            <div className="cv-pill">How it works</div>
            <h2 className="cv-h2">Start in <em>4 simple steps</em></h2>
          </div>
          <div className="cv-steps">
            {calivo.steps.map((s, i) => (
              <div key={s.title} className="cv-step">
                <div className="cv-step-n">{i + 1}</div>
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
            <div className="cv-pill">Made for</div>
            <h2 className="cv-h2">Who is <em>CALIVO AI</em> for?</h2>
          </div>
          <div className="cv-aud">
            {calivo.audience.map((a) => (
              <div key={a}><CheckCircle2 size={19} strokeWidth={2.2} /> <span>{a}</span></div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cv-wrap" style={{ marginBottom: "4.5rem" }}>
        <div className="cv-band">
          <h2>Download CALIVO AI — it&apos;s free</h2>
          <p>Your AI dietitian for Indian food, in your pocket. Scan your next meal in 5 seconds.</p>
          <PlayBadge source="cta_band" height={62} />
        </div>
      </section>

      {/* FAQ — visible on page (required for honest FAQPage schema) */}
      <section className="cv-sec cv-sec-alt">
        <div className="cv-narrow cv-faq">
          <div className="cv-head">
            <div className="cv-pill">FAQ</div>
            <h2 className="cv-h2">Frequently asked questions</h2>
          </div>
          {calivo.faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      {/* GUIDES — internal links to the blog cluster */}
      {posts.length > 0 && (
        <section className="cv-sec">
          <div className="cv-wrap">
            <div className="cv-head">
              <div className="cv-pill">Free guides</div>
              <h2 className="cv-h2">Indian diet &amp; nutrition guides</h2>
            </div>
            <div className="cv-guides">
              {posts.map((p) => (
                <Link key={p.slug} href={`/blog/${p.slug}`} className="cv-guide">
                  <strong>{p.title}</strong>
                  <span>{p.description}</span>
                  <i>Read guide →</i>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      <div className="cv-foot cv-wrap">
        CALIVO AI provides estimates for general wellness and is not medical advice. Consult your doctor for medical
        conditions. · <Link href="/calivo-ai/privacy-policy">Privacy policy</Link> · Support:{" "}
        <a href={`mailto:${calivo.supportEmail}`}>{calivo.supportEmail}</a>
      </div>
    </main>
  );
}
