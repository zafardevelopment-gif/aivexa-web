import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, ExternalLink, Clock, Smartphone } from "lucide-react";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import { getSettings } from "@/lib/data";
import { getFeaturedDigitalProducts, formatPrice } from "@/lib/digital-products";
import { FileDown, ShoppingCart, Tag } from "lucide-react";
import AddToCartBtn from "@/components/AddToCartBtn";
import { aivexaApps, appUrl, type AivexaApp } from "@/lib/aivexa-apps";
import { COMING_SOON, LIVE_PRODUCT_CARD, LIVE_PRODUCT_SLUGS, MOBILE_APPS } from "@/lib/product-lineup";

export const revalidate = 60;

// Canonical lives here (not in the root layout) so other pages do not inherit "/".
export const metadata: Metadata = { alternates: { canonical: "/" } };

const liveProducts = LIVE_PRODUCT_SLUGS.map((slug) => aivexaApps.find((a) => a.slug === slug)).filter(
  (a): a is AivexaApp => Boolean(a)
);

const steps = [
  { icon: "chat", title: "Pick your product", text: "Rent & society, exam practice, tent-house bookings or GST billing — each built for one job." },
  { icon: "check", title: "Start the free trial", text: "Sign up on the product's website. No card, no installation — it works on your phone." },
  { icon: "brain", title: "Use it in your language", text: "Hindi and English, WhatsApp built in, and simple screens made for Indian users." },
  { icon: "shield", title: "Grow with support", text: "Real people from AIVEXA help you on WhatsApp and email when you need it." },
];

function Logo({ src, name, size = 56 }: { src: string | null; name: string; size?: number }) {
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={`${name} logo`} width={size} height={size} className="lp-logo" style={{ width: size, height: size }} />
  ) : (
    <span className="lp-logo" style={{ width: size, height: size }} />
  );
}

export default async function Home() {
  const [settings, featuredDigital] = await Promise.all([getSettings(), getFeaturedDigitalProducts()]);

  return (
    <main>
      {/* ===== HERO ===== */}
      <section className="hero" id="home">
        <div className="hero-content">
          <div>
            <div className="hero-tagline">AI. VISION. AUTOMATION. EXCELLENCE.</div>
            <div className="hero-badge">
              <span className="dot"></span>
              Made in India · by AIVEXA LLP, Darbhanga
            </div>
            <h1>
              Simple software for <span className="accent">real Indian work</span>
            </h1>
            <p className="sub">
              AIVEXA builds focused apps that people actually use every day — collect rent on WhatsApp, practise for
              CBSE boards, run a tent house without double bookings, make GST bills — plus mobile apps for health and
              prayer.
            </p>
            <div className="hero-btns">
              <a href="#products" className="btn-primary">
                Explore products <ArrowRight size={17} strokeWidth={2.2} />
              </a>
              <a href="#contact" className="btn-secondary">
                Talk to us
              </a>
            </div>
            <div className="hero-points">
              <div className="hero-point">
                <CheckCircle2 size={17} strokeWidth={2.2} /> Free trial on every product
              </div>
              <div className="hero-point">
                <CheckCircle2 size={17} strokeWidth={2.2} /> Hindi &amp; English
              </div>
              <div className="hero-point">
                <CheckCircle2 size={17} strokeWidth={2.2} /> Works on any phone
              </div>
            </div>
          </div>

          {/* Product showcase */}
          <div className="lp-showcase">
            <div className="lp-showcase-head">
              <b>Live today</b>
              <span className="live-pill">
                <span className="dot"></span> {liveProducts.length + MOBILE_APPS.length} products
              </span>
            </div>
            {liveProducts.map((app) => (
              <Link key={app.slug} href={`/${app.slug}`} className="lp-showcase-row">
                <Logo src={app.icon} name={app.name} size={42} />
                <span>
                  <b>{app.name}</b>
                  <small>{app.h1Accent}</small>
                </span>
                <ArrowRight size={16} strokeWidth={2.2} />
              </Link>
            ))}
            <div className="lp-showcase-apps">
              {MOBILE_APPS.map((m) => (
                <Link key={m.slug} href={m.href} className="lp-showcase-app">
                  <Logo src={m.icon} name={m.name} size={30} />
                  <span>
                    <b>{m.name}</b>
                    <small>Android app</small>
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Scrolling products strip */}
        <div className="hero-marquee">
          <div className="hero-marquee-track">
            {[...liveProducts, ...liveProducts].map((app, i) => (
              <Link href={`/${app.slug}`} className="hero-marquee-item" key={`${app.slug}-${i}`}>
                <Logo src={app.icon} name={app.name} size={30} />
                <span>
                  <b>{app.name}</b>
                  <small>{app.h1Accent}</small>
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRODUCTS (live) ===== */}
      <section className="section" id="products">
        <div className="container">
          <div className="section-header center">
            <div className="section-label">Products</div>
            <h2 className="section-title">
              Live products, <span className="accent">built for India</span>
            </h2>
            <p className="section-desc">
              Each product has its own website and a free trial. Read the full details here, or go straight to the
              product.
            </p>
          </div>
          <div className="lp-grid">
            {liveProducts.map((app, i) => {
              const card = LIVE_PRODUCT_CARD[app.slug as keyof typeof LIVE_PRODUCT_CARD];
              return (
                <Reveal key={app.slug} delay={i % 2}>
                  <div className="lp-card" style={{ ["--lp" as string]: app.color, ["--lp-light" as string]: app.colorLight }}>
                    <div className="lp-card-top">
                      <Logo src={app.icon} name={app.name} />
                      <span className="lp-live">
                        <span className="dot"></span> Live
                      </span>
                    </div>
                    <h3>{app.name}</h3>
                    <div className="lp-tagline">{app.h1Accent}</div>
                    <p className="lp-desc">{card.short}</p>
                    <div className="lp-points">
                      {card.points.map((p) => (
                        <div key={p}>
                          <CheckCircle2 size={15} strokeWidth={2.2} /> {p}
                        </div>
                      ))}
                    </div>
                    <div className="lp-trust">{app.trust.join(" · ")}</div>
                    <div className="lp-actions">
                      <Link href={`/${app.slug}`} className="lp-btn lp-btn-primary">
                        View details <ArrowRight size={15} strokeWidth={2.2} />
                      </Link>
                      <a
                        href={appUrl(app, "home_card")}
                        target="_blank"
                        rel="noopener"
                        className="lp-btn lp-btn-ghost"
                      >
                        Visit website <ExternalLink size={14} strokeWidth={2.2} />
                      </a>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== MOBILE APPS ===== */}
      <section className="section alt" id="apps">
        <div className="container">
          <div className="section-header center">
            <div className="section-label">Mobile Apps</div>
            <h2 className="section-title">
              Free apps on <span className="accent">Google Play</span>
            </h2>
          </div>
          <div className="lp-apps">
            {MOBILE_APPS.map((m) => (
              <Reveal key={m.slug}>
                <div className="lp-app">
                  <Logo src={m.icon} name={m.name} size={64} />
                  <div>
                    <h3>{m.name}</h3>
                    <div className="lp-tagline">{m.tagline}</div>
                    <p className="lp-desc">{m.short}</p>
                    <div className="lp-actions">
                      <Link href={m.href} className="lp-btn lp-btn-primary">
                        View details <ArrowRight size={15} strokeWidth={2.2} />
                      </Link>
                      <a href={m.play} target="_blank" rel="noopener" className="lp-btn lp-btn-ghost">
                        <Smartphone size={14} strokeWidth={2.2} /> Get on Google Play
                      </a>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== COMING SOON ===== */}
      <section className="section" id="coming-soon">
        <div className="container">
          <div className="section-header center">
            <div className="section-label">Coming soon</div>
            <h2 className="section-title">
              In the <span className="accent">workshop</span>
            </h2>
            <p className="section-desc">These products are in development. Want early access? Message us.</p>
          </div>
          <div className="lp-soon">
            {COMING_SOON.map((p) => (
              <div key={p.slug} className="lp-soon-card">
                <span className="lp-soon-icon">
                  <Icon name={p.icon} size={20} strokeWidth={2} />
                </span>
                <span>
                  <b>{p.name}</b>
                  <small>{p.tagline}</small>
                </span>
                <span className="lp-soon-badge">
                  <Clock size={12} strokeWidth={2.4} /> Coming soon
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DIGITAL PRODUCTS (featured) ===== */}
      {featuredDigital.length > 0 && (
        <section className="section alt dp-home-section" id="digital-products">
          <div className="container">
            <Reveal>
              <div className="section-header center">
                <div className="section-label">Digital Products</div>
                <h2 className="section-title">
                  Download & <span className="accent">grow instantly</span>
                </h2>
                <p className="section-desc">
                  Ready-to-use PDFs, planners and templates — buy once, download instantly.
                </p>
              </div>
            </Reveal>
            <div className="dp-grid">
              {featuredDigital.map((dp) => (
                <Reveal key={dp.slug}>
                  <Link href={`/store/${dp.slug}`} className="dp-card">
                    {dp.preview_image ? (
                      <div className="dp-card-img">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={dp.preview_image} alt={dp.name} loading="lazy" />
                      </div>
                    ) : (
                      <div className="dp-card-img-placeholder">
                        <FileDown size={28} strokeWidth={1.5} />
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
            <Reveal>
              <div className="dp-show-all">
                <Link href="/store" className="btn-secondary">
                  View All Digital Products <ArrowRight size={16} strokeWidth={2.2} />
                </Link>
              </div>
            </Reveal>
          </div>
        </section>
      )}

      {/* ===== HOW IT WORKS ===== */}
      <section className="section" id="how-it-works">
        <div className="container">
          <div className="section-header center">
            <div className="section-label">How It Works</div>
            <h2 className="section-title">
              Start in <span className="accent">four simple steps</span>
            </h2>
          </div>
          <div className="timeline">
            {steps.map((step, i) => (
              <Reveal key={step.title} delay={i}>
                <div className="tstep">
                  <div className="tstep-dot">
                    <Icon name={step.icon} size={22} strokeWidth={2} />
                  </div>
                  <div className="tstep-num">Step {String(i + 1).padStart(2, "0")}</div>
                  <h4>{step.title}</h4>
                  <p>{step.text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA BAND ===== */}
      <section className="cta-band">
        <Reveal>
          <div className="cta-inner">
            <h2>Have a question about a product?</h2>
            <p>
              Tell us what you need — rent collection, exam practice, tent-house bookings or GST billing — and we will
              help you get started.
            </p>
            <a href="#contact" className="btn-primary">
              Contact us <ArrowRight size={17} strokeWidth={2.2} />
            </a>
          </div>
        </Reveal>
      </section>

      {/* ===== CONTACT ===== */}
      <section className="section" id="contact">
        <div className="container">
          <div className="section-header center">
            <div className="section-label">Contact</div>
            <h2 className="section-title">
              Talk to our <span className="accent">team</span>
            </h2>
          </div>
          <div className="contact-grid">
            <Reveal>
              <div className="contact-card">
                <div className="contact-item">
                  <div className="contact-icon"><Icon name="mail" size={19} strokeWidth={2} /></div>
                  <div>
                    <h4>Email</h4>
                    <p><a href={`mailto:${settings.contact_email}`}>{settings.contact_email}</a></p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon"><Icon name="phone" size={19} strokeWidth={2} /></div>
                  <div>
                    <h4>Phone / WhatsApp</h4>
                    <p>{settings.contact_phone}</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon"><Icon name="pin" size={19} strokeWidth={2} /></div>
                  <div>
                    <h4>Registered Address</h4>
                    <p>{settings.address}</p>
                  </div>
                </div>
                <div className="contact-item">
                  <div className="contact-icon"><Icon name="building" size={19} strokeWidth={2} /></div>
                  <div>
                    <h4>Business Details</h4>
                    <p>
                      Legal Name: {settings.legal_name}
                      <br />
                      Trade Name: {settings.trade_name} ({settings.business_type})
                    </p>
                  </div>
                </div>
              </div>
            </Reveal>
            <Reveal delay={1}>
              <div className="contact-card">
                <ContactForm />
              </div>
            </Reveal>
          </div>
        </div>
      </section>
    </main>
  );
}
