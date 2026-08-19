import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "AIVEXA PDF API — HTML & URL to PDF for Developers",
  description: "Generate pixel-perfect PDFs from HTML and URLs with a single API call. Fast Chromium-based rendering. Start free.",
};

const CODE_EXAMPLE = `curl -X POST https://aivexa.com/api/v1/pdf \\
  -H "Authorization: Bearer avx_pdf_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{
    "html": "<h1>Invoice #1001</h1><p>Amount: ₹25,000</p>",
    "format": "A4",
    "orientation": "portrait",
    "printBackground": true
  }' --output invoice.pdf`;

const FEATURES = [
  { icon: "⚡", title: "Chromium Rendering", desc: "Full JavaScript execution, CSS, web fonts, SVG, custom @media print styles — rendered exactly as Chrome would." },
  { icon: "🔐", title: "Secure API Keys", desc: "Test and live keys with separate prefixes. SHA-256 hashed storage. Revoke anytime from the dashboard." },
  { icon: "📄", title: "All PDF Options", desc: "A3–A6, Letter, Legal, custom dimensions, margins, headers/footers, encryption, page numbers, background graphics." },
  { icon: "🌐", title: "URL to PDF", desc: "Render any public URL to PDF. waitForSelector, networkidle, and custom delay support for SPAs and dynamic pages." },
  { icon: "📸", title: "Screenshot API", desc: "Capture PNG or JPEG screenshots at custom viewport sizes. Full-page or viewport-only." },
  { icon: "📊", title: "Usage Dashboard", desc: "Track every request. Request IDs, response times, file sizes, success/failure — all in your dashboard." },
  { icon: "🛡️", title: "SSRF Protected", desc: "All URL-to-PDF requests are validated. Private IPs, localhost, metadata endpoints are blocked by default." },
  { icon: "🔢", title: "Request IDs", desc: "Every response includes a unique req_xxx ID for logging, debugging, and support." },
];

const PLANS = [
  { name: "Free", price: "₹0", credits: "100 PDFs/month", cta: "Get Started", primary: false },
  { name: "Starter", price: "₹999", credits: "1,000 PDFs/month", cta: "Start Starter", primary: false },
  { name: "Growth", price: "₹1,999", credits: "2,000 PDFs/month", cta: "Start Growth", primary: false },
  { name: "Pro", price: "₹3,999", credits: "5,000 PDFs/month", cta: "Start Pro", primary: true },
];

export default function PdfApiLanding() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "0 24px" }}>

      {/* Hero */}
      <section style={{ padding: "80px 0 64px", textAlign: "center" }}>
        <div style={{
          display: "inline-block",
          background: "rgba(99,102,241,0.12)",
          border: "1px solid rgba(99,102,241,0.3)",
          borderRadius: 100, padding: "5px 16px",
          fontSize: 12, fontWeight: 600, letterSpacing: "0.08em",
          color: "var(--pdf-accent-light)", marginBottom: 24,
          textTransform: "uppercase",
        }}>
          By AIVEXA LLP
        </div>
        <h1 style={{
          fontSize: "clamp(32px, 6vw, 56px)",
          fontWeight: 800, letterSpacing: "-0.03em",
          lineHeight: 1.1, margin: "0 0 20px",
          color: "var(--pdf-text)",
        }}>
          HTML & URL to PDF<br />
          <span style={{
            background: "linear-gradient(135deg, var(--pdf-accent), var(--pdf-accent-light))",
            WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
          }}>
            API for Developers
          </span>
        </h1>
        <p style={{
          fontSize: "clamp(16px, 2.5vw, 20px)",
          color: "var(--pdf-muted)", maxWidth: 560, margin: "0 auto 36px",
          lineHeight: 1.7,
        }}>
          Send HTML or a URL. Receive a professionally rendered PDF.
          Powered by Chromium. Start free, scale as you grow.
        </p>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
          <Link href="/pdf-api/dashboard" className="pdfapi-btn pdfapi-btn-primary" style={{ padding: "12px 28px", fontSize: 16 }}>
            Start Free →
          </Link>
          <Link href="/pdf-api/dashboard/playground" className="pdfapi-btn pdfapi-btn-secondary" style={{ padding: "12px 28px", fontSize: 16 }}>
            Try Playground
          </Link>
          <Link href="/pdf-api/docs" className="pdfapi-btn pdfapi-btn-ghost" style={{ padding: "12px 28px", fontSize: 16 }}>
            Read Docs
          </Link>
        </div>
      </section>

      {/* Code example */}
      <section style={{ marginBottom: 80 }}>
        <div className="pdfapi-card" style={{ padding: 0 }}>
          <div style={{
            padding: "12px 20px", borderBottom: "1px solid var(--pdf-border)",
            display: "flex", alignItems: "center", gap: 8,
          }}>
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#ef4444" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#f59e0b" }} />
            <div style={{ width: 12, height: 12, borderRadius: "50%", background: "#22c55e" }} />
            <span style={{ marginLeft: 8, fontSize: 12, color: "var(--pdf-muted)" }}>Terminal</span>
          </div>
          <pre className="pdfapi-code" style={{ margin: 0, borderRadius: "0 0 12px 12px", border: "none" }}>
            {CODE_EXAMPLE}
          </pre>
        </div>
      </section>

      {/* Features */}
      <section style={{ marginBottom: 80 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: "center", marginBottom: 48, letterSpacing: "-0.02em" }}>
          Everything you need for PDF generation
        </h2>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 20,
        }}>
          {FEATURES.map((f) => (
            <div key={f.title} className="pdfapi-card" style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ fontSize: 28 }}>{f.icon}</div>
              <div style={{ fontWeight: 700, fontSize: 15 }}>{f.title}</div>
              <div style={{ fontSize: 13, color: "var(--pdf-muted)", lineHeight: 1.65 }}>{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ marginBottom: 80 }}>
        <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: "center", marginBottom: 48, letterSpacing: "-0.02em" }}>
          How it works
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 24, textAlign: "center" }}>
          {[
            { step: "01", title: "Get an API Key", desc: "Sign up free, create an API key from the dashboard. Use test keys for development." },
            { step: "02", title: "Send HTML or URL", desc: "POST your HTML string or a public URL with your desired PDF options." },
            { step: "03", title: "Receive your PDF", desc: "Get binary PDF in the response, or a download URL for larger files." },
          ].map((s) => (
            <div key={s.step} className="pdfapi-card" style={{ textAlign: "center" }}>
              <div style={{
                fontSize: 12, fontWeight: 800, letterSpacing: "0.12em",
                color: "var(--pdf-accent)", marginBottom: 12,
              }}>
                STEP {s.step}
              </div>
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{s.title}</div>
              <div style={{ fontSize: 13, color: "var(--pdf-muted)", lineHeight: 1.6 }}>{s.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing */}
      <section style={{ marginBottom: 80 }} id="pricing">
        <h2 style={{ fontSize: 28, fontWeight: 700, textAlign: "center", marginBottom: 48, letterSpacing: "-0.02em" }}>
          Simple, credit-based pricing
        </h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16 }}>
          {PLANS.map((p) => (
            <div
              key={p.name}
              className="pdfapi-card"
              style={{
                borderColor: p.primary ? "var(--pdf-accent)" : "var(--pdf-border)",
                background: p.primary ? "rgba(99,102,241,0.06)" : undefined,
                position: "relative",
              }}
            >
              {p.primary && (
                <div style={{
                  position: "absolute", top: -1, left: "50%", transform: "translateX(-50%)",
                  background: "var(--pdf-accent)", color: "#fff",
                  fontSize: 10, fontWeight: 700, padding: "3px 14px",
                  borderRadius: "0 0 8px 8px", letterSpacing: "0.06em",
                }}>POPULAR</div>
              )}
              <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8 }}>{p.name}</div>
              <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: "-0.02em", marginBottom: 4 }}>{p.price}</div>
              <div style={{ fontSize: 13, color: "var(--pdf-muted)", marginBottom: 20 }}>/month</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 24 }}>{p.credits}</div>
              <Link
                href="/pdf-api/dashboard"
                className={`pdfapi-btn ${p.primary ? "pdfapi-btn-primary" : "pdfapi-btn-secondary"}`}
                style={{ width: "100%", justifyContent: "center" }}
              >
                {p.cta}
              </Link>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", marginTop: 20, fontSize: 13, color: "var(--pdf-muted)" }}>
          Need more? <a href="mailto:mdzafareqbal@gmail.com" style={{ color: "var(--pdf-accent-light)" }}>Contact us</a> for enterprise pricing.
        </p>
      </section>

      {/* CTA */}
      <section style={{
        marginBottom: 80, textAlign: "center",
        padding: "60px 40px",
        background: "var(--pdf-surface)",
        border: "1px solid var(--pdf-border)",
        borderRadius: 20,
      }}>
        <h2 style={{ fontSize: 32, fontWeight: 800, margin: "0 0 16px", letterSpacing: "-0.02em" }}>
          Start generating PDFs today
        </h2>
        <p style={{ fontSize: 16, color: "var(--pdf-muted)", marginBottom: 32 }}>
          Free plan. No credit card required. 100 PDFs/month on us.
        </p>
        <Link href="/pdf-api/dashboard" className="pdfapi-btn pdfapi-btn-primary" style={{ padding: "14px 36px", fontSize: 17 }}>
          Get Started Free →
        </Link>
      </section>

      {/* Footer */}
      <footer style={{
        borderTop: "1px solid var(--pdf-border)",
        padding: "24px 0",
        display: "flex", justifyContent: "space-between", alignItems: "center",
        flexWrap: "wrap", gap: 12,
        fontSize: 13, color: "var(--pdf-muted)",
      }}>
        <span>© {new Date().getFullYear()} AIVEXA LLP. All rights reserved.</span>
        <div style={{ display: "flex", gap: 20 }}>
          <Link href="/pdf-api/docs" style={{ color: "var(--pdf-muted)", textDecoration: "none" }}>Docs</Link>
          <Link href="/pdf-api/pricing" style={{ color: "var(--pdf-muted)", textDecoration: "none" }}>Pricing</Link>
          <Link href="/" style={{ color: "var(--pdf-muted)", textDecoration: "none" }}>AIVEXA.com</Link>
        </div>
      </footer>
    </div>
  );
}
