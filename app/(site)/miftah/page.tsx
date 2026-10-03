import Link from "next/link";
import type { Metadata } from "next";
import { CheckCircle2 } from "lucide-react";
import "../calivo-ai/calivo.css";
import { miftah, miftahPlayUrl, MIFTAH_PLAY_URL_CLEAN, MIFTAH_PACKAGE } from "@/lib/miftah";
import { PLAY_BADGE_IMG } from "@/lib/calivo";
import { blogPosts } from "@/lib/blog-posts";
import { SITE_URL, siteConfig } from "@/lib/seo/config";

const PATH = "/miftah";
const TITLE = "Miftah — Prayer Times, Azan, Quran & Namaz-Wudu Guide App in Hindi & Urdu (Free)";
const DESC =
  "Accurate offline namaz times, Azan and Iqamah alerts, Qibla, Quran with word-by-word meanings, a step-by-step Namaz & Wudu guide, Daily Sunnah, hadith and du'a — in Hindi, Urdu, English, Arabic and Indonesian. Free Muslim app on Google Play.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESC,
  keywords: [
    "Miftah app", "prayer times app", "namaz time app", "azan app", "adhan notification app",
    "iqamah reminder", "qibla compass app", "quran app android", "salah tracker", "muslim app",
    "islamic app", "prayer reminder app", "app blocker for prayer", "namaz reminder app India",
    "quran recitation check", "hijri calendar app", "namaz app in hindi", "quran in hindi app",
    "wudu ka tarika", "namaz ka tarika", "namaz sikhne wala app", "daily sunnah app", "islamic app hindi",
  ],
  alternates: { canonical: PATH },
  openGraph: {
    title: TITLE,
    description: DESC,
    url: PATH,
    type: "website",
    siteName: siteConfig.name,
    images: [{ url: "/miftah/miftah-og.png", width: 1200, height: 630, alt: "Miftah — Prayer Times, Azan, Qibla & Quran" }],
  },
  twitter: { card: "summary_large_image", title: TITLE, description: DESC, images: ["/miftah/miftah-og.png"] },
  other: { "google-play-app": `app-id=${MIFTAH_PACKAGE}` },
};

// Miftah brand: deep green + gold, applied through calivo.css variables.
const brand = {
  "--cv-green": "#2F5D50",
  "--cv-green-d": "#1E4438",
  "--cv-green-l": "#F4EEDF",
} as React.CSSProperties;
const GOLD = "#C7A25A";

function PlayBadge({ source, height = 64 }: { source: string; height?: number }) {
  return (
    <a
      href={miftahPlayUrl(source)}
      target="_blank"
      rel="noopener"
      aria-label="Get Miftah on Google Play"
      style={{ display: "inline-block", lineHeight: 0 }}
    >
      {/* Official Google Play badge (allowed by Google's badge guidelines). */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={PLAY_BADGE_IMG} alt="Get it on Google Play" height={height} style={{ height, width: "auto" }} />
    </a>
  );
}

export default function MiftahPage() {
  const url = `${SITE_URL}${PATH}`;
  const posts = blogPosts.filter((p) => p.cta === "miftah").slice(0, 6);

  const jsonLd: Record<string, unknown>[] = [
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
        { "@type": "ListItem", position: 2, name: "Miftah", item: url },
      ],
    },
    {
      "@context": "https://schema.org",
      "@type": "MobileApplication",
      name: miftah.name,
      alternateName: ["Miftah: Prayer Times & Quran", "Miftah Namaz Time"],
      description: miftah.oneLiner,
      url,
      downloadUrl: MIFTAH_PLAY_URL_CLEAN,
      installUrl: MIFTAH_PLAY_URL_CLEAN,
      sameAs: [MIFTAH_PLAY_URL_CLEAN],
      operatingSystem: "Android",
      applicationCategory: "LifestyleApplication",
      applicationSubCategory: "Prayer times, Quran, Islamic app",
      softwareVersion: "0.1.4",
      dateModified: "2026-10-03",
      keywords: "namaz times, azan, qibla, quran in hindi, wudu ka tarika, namaz ka tarika, daily sunnah, hadith, dua",
      inLanguage: ["en", "hi", "ur", "ar", "id"],
      image: `${SITE_URL}/miftah/miftah-icon.png`,
      ...(miftah.screenshots.length ? { screenshot: miftah.screenshots.map((s) => `${SITE_URL}${s.src}`) } : {}),
      featureList: miftah.features.map((f) => f.title).join(", "),
      offers: { "@type": "Offer", price: "0", priceCurrency: "INR" },
      author: { "@type": "Organization", name: siteConfig.legalName, url: SITE_URL },
      publisher: { "@type": "Organization", name: siteConfig.legalName, url: SITE_URL },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: miftah.faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ];

  return (
    <main className="cv" style={brand}>
      {jsonLd.map((obj, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(obj) }} />
      ))}

      {/* HERO */}
      <section
        className="cv-hero"
        style={{ background: "radial-gradient(1200px 500px at 85% 10%, #EFE4C6 0%, transparent 60%), linear-gradient(180deg, #FAF7EE 0%, #fff 100%)" }}
      >
        <div className="cv-wrap cv-hero-grid">
          <div>
            <div className="cv-brand">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/miftah/miftah-icon.png" alt="Miftah app icon" width={56} height={56} />
              <span>Free Android app · by AIVEXA</span>
            </div>
            <h1 className="cv-h1">
              <em style={{ background: `linear-gradient(90deg, #1E4438, ${GOLD})`, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent" }}>
                Miftah
              </em>{" "}
              — Prayer Times, Azan, Quran &amp; Namaz-Wudu guide
            </h1>
            <p className="cv-sub">
              Accurate namaz times for your city, a reminder before every prayer, the Azan at prayer time and an Iqamah
              alert for jamaat. Read the Quran with word-by-word meanings, learn wudu and namaz step by step with
              diagrams, tick your daily sunnahs, and let Miftah gently pause distracting apps until you have prayed — in
              English, हिन्दी, اردو, العربية and Bahasa Indonesia.
            </p>
            <div className="cv-cta-row">
              <PlayBadge source="hero" height={60} />
              <a href="#features" className="cv-link-btn">See features ↓</a>
            </div>
            <div className="cv-trust">
              <span>✅ <b>Free</b> forever core</span>
              <span>📴 Works <b>offline</b></span>
              <span>🔒 <b>No account</b>, no data selling</span>
              <span>🇮🇳 Now in <b>Hindi</b></span>
            </div>
            <div className="cv-crumb"><Link href="/">Home</Link> › Miftah</div>
          </div>

          <div
            aria-hidden="true"
            style={{ background: "linear-gradient(135deg, #1E4438 0%, #2F5D50 55%, #4A7F6C 100%)", borderRadius: 28, padding: "1.8rem", color: "#fff", boxShadow: "0 24px 60px rgba(30,68,56,.35)" }}
          >
            <div style={{ color: GOLD, fontWeight: 700 }}>Assalamu Alaikum</div>
            <div style={{ opacity: 0.8, fontSize: ".85rem" }}>Next prayer</div>
            <div style={{ fontSize: "2.2rem", fontWeight: 800, margin: ".2rem 0" }}>Asr · 3:58 PM</div>
            <div style={{ opacity: 0.85, fontSize: ".9rem", marginBottom: "1.2rem" }}>01:24:09 remaining</div>
            {miftah.features.slice(0, 4).map((f) => (
              <div key={f.title} style={{ display: "flex", gap: ".8rem", alignItems: "flex-start", padding: ".7rem 0", borderTop: "1px solid rgba(255,255,255,.12)" }}>
                <span style={{ fontSize: "1.3rem" }}>{f.icon}</span>
                <strong style={{ fontSize: ".95rem" }}>{f.title}</strong>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHAT IT IS — plain, quotable answer for search engines and AI assistants */}
      <section className="cv-sec">
        <div className="cv-narrow cv-what">
          <h2 className="cv-h2">What is <em>Miftah</em>?</h2>
          <p>{miftah.oneLiner}</p>
          <p>
            Most prayer apps stop at a time table. Miftah (Arabic for <strong>“the key”</strong>) also helps you actually
            pray on time: it reminds you before each salah, calls the Azan, reminds you again at Iqamah, and — if you
            choose — pauses Instagram, YouTube or games during the prayer window, showing an ayah, hadith or du&apos;a
            instead.
          </p>
          <p>
            <strong>New:</strong> Miftah is now available in <strong>Hindi (हिन्दी)</strong> — the app, the Quran
            translation and word-by-word meanings, du&apos;as, azkar and the 99 Names. It also adds a{" "}
            <strong>Namaz &amp; Wudu guide</strong> with the fara&apos;id and step-by-step method of Wudu, Namaz, Ghusl,
            Tayammum and Roza, and a <strong>Daily Sunnah checklist</strong>.
          </p>
        </div>
      </section>

      {/* SCREENSHOTS (shown once exported to /public/miftah) */}
      {miftah.screenshots.length > 0 && (
        <section className="cv-sec cv-sec-alt">
          <div className="cv-wrap">
            <div className="cv-head">
              <div className="cv-pill">Inside the app</div>
              <h2 className="cv-h2">See Miftah in action</h2>
            </div>
            <div className="cv-shots">
              {miftah.screenshots.map((s) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={s.src} src={s.src} alt={s.alt} width={200} height={356} loading="lazy" />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FEATURES */}
      <section className="cv-sec cv-sec-alt" id="features">
        <div className="cv-wrap">
          <div className="cv-head">
            <div className="cv-pill">Features</div>
            <h2 className="cv-h2">Everything for your <em>daily prayers</em></h2>
          </div>
          <div className="cv-feat-grid">
            {miftah.features.map((f) => (
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
      <section className="cv-sec">
        <div className="cv-wrap">
          <div className="cv-head">
            <div className="cv-pill">How it works</div>
            <h2 className="cv-h2">Start in <em>4 simple steps</em></h2>
          </div>
          <div className="cv-steps">
            {miftah.steps.map((s, i) => (
              <div key={s.title} className="cv-step">
                <div className="cv-step-n" style={{ background: `linear-gradient(135deg, #2F5D50, #1E4438)` }}>{i + 1}</div>
                <h3>{s.title}</h3>
                <p>{s.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* WHO IT'S FOR */}
      <section className="cv-sec cv-sec-alt">
        <div className="cv-wrap">
          <div className="cv-head">
            <div className="cv-pill">Made for</div>
            <h2 className="cv-h2">Who is <em>Miftah</em> for?</h2>
          </div>
          <div className="cv-aud">
            {miftah.audience.map((a) => (
              <div key={a}><CheckCircle2 size={19} strokeWidth={2.2} /> <span>{a}</span></div>
            ))}
          </div>
          <p style={{ textAlign: "center", marginTop: "1.6rem", color: "#475569" }}>{miftah.price}</p>
        </div>
      </section>

      {/* CTA */}
      <section className="cv-wrap" style={{ margin: "4.5rem auto" }}>
        <div className="cv-band" style={{ background: "linear-gradient(135deg, #1E4438 0%, #2F5D50 60%, #4A7F6C 100%)" }}>
          <h2>Download Miftah — it&apos;s free</h2>
          <p>Never miss a salah: prayer times, Azan, Iqamah and Quran in one calm, private app.</p>
          <PlayBadge source="cta_band" height={62} />
        </div>
      </section>

      {/* GUIDES — internal links to the blog cluster */}
      {posts.length > 0 && (
        <section className="cv-sec">
          <div className="cv-wrap">
            <div className="cv-head">
              <div className="cv-pill">Free guides</div>
              <h2 className="cv-h2">Prayer &amp; salah guides</h2>
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

      {/* FAQ — visible on page (required for honest FAQPage schema) */}
      <section className="cv-sec">
        <div className="cv-narrow cv-faq">
          <div className="cv-head">
            <div className="cv-pill">FAQ</div>
            <h2 className="cv-h2">Frequently asked questions</h2>
          </div>
          {miftah.faqs.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <p>{f.a}</p>
            </details>
          ))}
        </div>
      </section>

      <div className="cv-foot cv-wrap">
        Miftah is a product of {siteConfig.legalName}. · <Link href="/miftah-privacy">Privacy policy</Link> · Support:{" "}
        <a href={`mailto:${miftah.supportEmail}`}>{miftah.supportEmail}</a>
      </div>
    </main>
  );
}
