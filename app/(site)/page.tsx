import Link from "next/link";
import {
  ArrowRight,
  AudioLines,
  BarChart3,
  CalendarCheck,
  CheckCircle2,
  FileCheck2,
  Home as HomeIcon,
  Lock,
  PhoneCall,
  Play,
  Quote,
  Server,
  Settings as SettingsIcon,
  ShieldCheck,
  Users,
} from "lucide-react";
import Icon from "@/components/Icon";
import Reveal from "@/components/Reveal";
import ContactForm from "@/components/ContactForm";
import {
  getProducts,
  getSettings,
  getStats,
  getSteps,
  getTestimonials,
} from "@/lib/data";

export const revalidate = 60;

const trustedNames = [
  "City Care Hospital",
  "Khan Multispeciality Clinic",
  "Gupta Trading Co.",
  "Al-Shifa Diagnostics",
  "NSC Events",
];

const complianceBadges = [
  { icon: Lock, label: "End-to-end encrypted data" },
  { icon: ShieldCheck, label: "IT Act 2000 compliant" },
  { icon: Server, label: "99.9% uptime infrastructure" },
  { icon: FileCheck2, label: "Full audit logging" },
];

export default async function Home() {
  const [settings, products, steps, stats, testimonials] = await Promise.all([
    getSettings(),
    getProducts(),
    getSteps(),
    getStats(),
    getTestimonials(),
  ]);

  return (
    <main>
      {/* ===== HERO ===== */}
      <section className="hero" id="home">
        <div className="hero-content">
          <div>
            <div className="hero-badge">
              <span className="dot"></span>
              {settings.hero_badge}
            </div>
            <h1>
              AI that runs your <span className="accent">clinic</span> and{" "}
              <span className="accent">business</span> operations
            </h1>
            <p className="sub">{settings.hero_subtitle}</p>
            <div className="hero-btns">
              <a href="#contact" className="btn-primary">
                Book a Demo <ArrowRight size={17} strokeWidth={2.2} />
              </a>
              <a href="#products" className="btn-secondary">
                <Play size={16} strokeWidth={2.2} /> See It in Action
              </a>
            </div>
            <div className="hero-points">
              <div className="hero-point">
                <CheckCircle2 size={17} strokeWidth={2.2} /> No app installs
              </div>
              <div className="hero-point">
                <CheckCircle2 size={17} strokeWidth={2.2} /> Hindi, English &amp; Urdu
              </div>
              <div className="hero-point">
                <CheckCircle2 size={17} strokeWidth={2.2} /> Live in days, not months
              </div>
            </div>
          </div>

          {/* Dashboard mockup */}
          <div style={{ position: "relative" }}>
            <div className="mockup-float float-1">
              <PhoneCall size={18} strokeWidth={2} />
              <span>
                Call answered in 2.1s
                <small>Clinic Voice · AI Receptionist</small>
              </span>
            </div>
            <div className="mockup-float float-2">
              <AudioLines size={18} strokeWidth={2} />
              <span>
                Ledger updated by voice note
                <small>AI Munim · WhatsApp</small>
              </span>
            </div>
            <div className="mockup">
              <div className="mockup-bar">
                <i></i>
                <i></i>
                <i></i>
                <em>app.aivexa.in / dashboard</em>
              </div>
              <div className="mockup-body">
                <div className="mockup-side">
                  <i className="on"><HomeIcon size={16} /></i>
                  <i><CalendarCheck size={16} /></i>
                  <i><PhoneCall size={16} /></i>
                  <i><BarChart3 size={16} /></i>
                  <i><SettingsIcon size={16} /></i>
                </div>
                <div className="mockup-main">
                  <div className="mockup-title">
                    <b>Today&apos;s Overview</b>
                    <span className="live-pill">
                      <span className="dot"></span> AI Agent Live
                    </span>
                  </div>
                  <div className="mockup-stats">
                    <div className="mockup-stat">
                      <b>32</b>
                      <span>Appointments</span> <span className="up">+12%</span>
                    </div>
                    <div className="mockup-stat">
                      <b>118</b>
                      <span>Calls Answered</span> <span className="up">+8%</span>
                    </div>
                    <div className="mockup-stat">
                      <b>0</b>
                      <span>Missed Calls</span> <span className="up">100%</span>
                    </div>
                  </div>
                  <div className="mockup-table">
                    <div className="mockup-row head">
                      <span>Patient</span>
                      <span>Time</span>
                      <span>Status</span>
                    </div>
                    <div className="mockup-row">
                      <b>Anil Sharma</b>
                      <span>10:30 AM</span>
                      <span className="badge-ok">Confirmed</span>
                    </div>
                    <div className="mockup-row">
                      <b>Fatima Begum</b>
                      <span>11:15 AM</span>
                      <span className="badge-ok">Confirmed</span>
                    </div>
                    <div className="mockup-row">
                      <b>Rakesh Yadav</b>
                      <span>12:00 PM</span>
                      <span className="badge-wait">Reminder sent</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TRUSTED BY ===== */}
      <section className="trusted">
        <div className="trusted-inner">
          <div className="trusted-label">
            Trusted by clinics, hospitals and businesses across India
          </div>
          <div className="trusted-logos">
            {trustedNames.map((name) => (
              <div className="trusted-logo" key={name}>
                <Users size={18} strokeWidth={2} /> {name}
              </div>
            ))}
          </div>
          <div className="trusted-badges">
            {complianceBadges.map(({ icon: BadgeIcon, label }) => (
              <span className="trust-badge" key={label}>
                <BadgeIcon size={15} strokeWidth={2.2} /> {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PRODUCTS ===== */}
      <section className="section" id="products">
        <div className="container">
          <div className="section-header center">
            <div className="section-label">Products</div>
            <h2 className="section-title">
              One platform. <span className="accent">Four AI systems.</span>
            </h2>
            <p className="section-desc">
              Purpose-built AI for healthcare and business operations — delivered through
              WhatsApp and Voice, so your team adopts it on day one.
            </p>
          </div>
          <div className="products-grid">
            {products.map((product, i) => (
              <Reveal key={product.slug} delay={i % 2}>
                <div className="product-card">
                  <div className="product-top">
                    <div className="product-icon">
                      <Icon name={product.icon} size={26} strokeWidth={2} />
                    </div>
                    {product.badge && <span className="product-badge">{product.badge}</span>}
                  </div>
                  <h3>{product.name}</h3>
                  <div className="product-tagline">{product.tagline}</div>
                  <p className="product-desc">{product.description}</p>
                  <div className="product-features">
                    {product.features.slice(0, 4).map((feature) => (
                      <div className="product-feat" key={feature}>
                        <CheckCircle2 size={15} strokeWidth={2.2} /> {feature}
                      </div>
                    ))}
                  </div>
                  <Link href={`/products/${product.slug}`} className="product-link">
                    Learn more <ArrowRight size={15} strokeWidth={2.2} />
                  </Link>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== HOW IT WORKS ===== */}
      <section className="section alt" id="how-it-works">
        <div className="container">
          <div className="section-header center">
            <div className="section-label">How It Works</div>
            <h2 className="section-title">
              Live in <span className="accent">four simple steps</span>
            </h2>
            <p className="section-desc">
              From the first call to full automation — our AI systems work through
              WhatsApp and Voice with zero training for your staff.
            </p>
          </div>
          <div className="timeline">
            {steps.map((step, i) => (
              <Reveal key={step.step_no} delay={i}>
                <div className="tstep">
                  <div className="tstep-dot">
                    <Icon name={step.icon} size={22} strokeWidth={2} />
                  </div>
                  <div className="tstep-num">Step {String(step.step_no).padStart(2, "0")}</div>
                  <h4>{step.title}</h4>
                  <p>{step.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== WHY AIVEXA (stats) ===== */}
      <section className="section" id="why-us">
        <div className="container">
          <div className="section-header center">
            <div className="section-label">Why {settings.site_name}</div>
            <h2 className="section-title">
              Measurable results, <span className="accent">from day one</span>
            </h2>
            <p className="section-desc">
              We combine enterprise-grade AI with practical design to deliver outcomes
              your team and your patients can feel.
            </p>
          </div>
          <div className="stats-grid">
            {stats.map((stat, i) => (
              <Reveal key={stat.label} delay={i}>
                <div className="stat-card">
                  <div className="stat-value">{stat.value}</div>
                  <h4>{stat.label}</h4>
                  <p>{stat.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="section alt" id="testimonials">
        <div className="container">
          <div className="section-header center">
            <div className="section-label">Customers</div>
            <h2 className="section-title">
              Teams that <span className="accent">run on AIVEXA</span>
            </h2>
          </div>
          <div className="testimonials-grid">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={i}>
                <div className="testimonial">
                  <Quote size={26} strokeWidth={2} className="quote-mark" />
                  <p className="quote">{t.quote}</p>
                  <div className="testimonial-person">
                    <span className="avatar">
                      {t.name
                        .replace(/^Dr\.\s*/, "")
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")}
                    </span>
                    <span>
                      <b>{t.name}</b>
                      <span>
                        {t.role}, {t.company}
                      </span>
                    </span>
                  </div>
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
            <h2>Ready to put AI to work?</h2>
            <p>
              From your clinic&apos;s phone line to your shop&apos;s daily hisaab — AIVEXA
              automates it end-to-end. Get a personalized walkthrough.
            </p>
            <a href="#contact" className="btn-primary">
              Book a Demo <ArrowRight size={17} strokeWidth={2.2} />
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
            <p className="section-desc">
              Tell us about your clinic or business — we will show you exactly what
              AIVEXA can automate.
            </p>
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
                      <br />
                      GST: {settings.gst_number}
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
