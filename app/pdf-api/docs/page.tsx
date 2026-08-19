import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Documentation — AIVEXA PDF API",
};

const SECTIONS = [
  "Overview", "Quick Start", "Authentication", "HTML to PDF",
  "URL to PDF", "Screenshot", "PDF Options", "Headers & Footers",
  "JavaScript Rendering", "Errors", "Rate Limits",
];

export default function DocsPage() {
  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "40px 24px", display: "grid", gridTemplateColumns: "200px 1fr", gap: 40 }}>

      {/* Sidebar */}
      <aside style={{ position: "sticky", top: 96, height: "fit-content" }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: "0.08em", color: "var(--pdf-muted)", textTransform: "uppercase", marginBottom: 12 }}>
          On this page
        </div>
        {SECTIONS.map((s) => (
          <a key={s} href={`#${s.toLowerCase().replace(/ /g, "-")}`} style={{
            display: "block", padding: "6px 0",
            fontSize: 13, color: "var(--pdf-muted)",
            textDecoration: "none", borderLeft: "2px solid var(--pdf-border)",
            paddingLeft: 12, marginBottom: 2,
            transition: "color 0.1s",
          }}>{s}</a>
        ))}
      </aside>

      {/* Content */}
      <article style={{ maxWidth: 780 }}>
        <h1 style={{ fontSize: 36, fontWeight: 800, letterSpacing: "-0.03em", marginTop: 0, marginBottom: 8 }}>
          Documentation
        </h1>
        <p style={{ fontSize: 16, color: "var(--pdf-muted)", marginBottom: 48, lineHeight: 1.6 }}>
          AIVEXA PDF API converts HTML and URLs to PDF using headless Chromium. Full JavaScript support, custom fonts, CSS print styles, and all standard PDF options.
        </p>

        {/* Overview */}
        <section id="overview" style={{ marginBottom: 56 }}>
          <h2 style={h2Style}>Overview</h2>
          <p style={pStyle}>The AIVEXA PDF API is a REST API that accepts HTML markup or a publicly accessible URL and returns a professionally rendered PDF file. The rendering engine is based on Chromium, which means the output is identical to what you would see in a Chrome browser with <code style={codeStyle}>Print to PDF</code>.</p>
          <p style={pStyle}>Base URL: <code style={codeStyle}>https://aivexa.com/api/v1</code></p>
        </section>

        {/* Quick Start */}
        <section id="quick-start" style={{ marginBottom: 56 }}>
          <h2 style={h2Style}>Quick Start</h2>
          <p style={pStyle}>1. Sign up and create an API key in your <a href="/pdf-api/dashboard/api-keys" style={linkStyle}>dashboard</a>.</p>
          <p style={pStyle}>2. Make a POST request:</p>
          <pre style={preStyle}>{`curl -X POST https://aivexa.com/api/v1/pdf \\
  -H "Authorization: Bearer avx_pdf_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{"html": "<h1>Hello World</h1>", "format": "A4"}' \\
  --output document.pdf`}</pre>
          <p style={pStyle}>3. The response is a binary PDF. Save it directly to a file with <code style={codeStyle}>--output</code>.</p>
        </section>

        {/* Authentication */}
        <section id="authentication" style={{ marginBottom: 56 }}>
          <h2 style={h2Style}>Authentication</h2>
          <p style={pStyle}>All API requests require an API key sent in the <code style={codeStyle}>Authorization</code> header:</p>
          <pre style={preStyle}>{`Authorization: Bearer avx_pdf_live_YOUR_KEY`}</pre>
          <table style={tableStyle}>
            <thead><tr><th style={thStyle}>Key Type</th><th style={thStyle}>Prefix</th><th style={thStyle}>Behaviour</th></tr></thead>
            <tbody>
              <tr><td style={tdStyle}>Live</td><td style={tdStyle}><code style={codeStyle}>avx_pdf_live_</code></td><td style={tdStyle}>Consumes credits, production use</td></tr>
              <tr><td style={tdStyle}>Test</td><td style={tdStyle}><code style={codeStyle}>avx_pdf_test_</code></td><td style={tdStyle}>Free, no credits consumed, for development</td></tr>
            </tbody>
          </table>
          <p style={{ ...pStyle, fontSize: 13, color: "var(--pdf-muted)" }}>
            ⚠️ Never expose API keys in browser JavaScript, public repositories, or client-side code.
          </p>
        </section>

        {/* HTML to PDF */}
        <section id="html-to-pdf" style={{ marginBottom: 56 }}>
          <h2 style={h2Style}>HTML to PDF</h2>
          <p style={pStyle}><strong>POST</strong> <code style={codeStyle}>/api/v1/pdf</code></p>
          <table style={tableStyle}>
            <thead><tr><th style={thStyle}>Parameter</th><th style={thStyle}>Type</th><th style={thStyle}>Required</th><th style={thStyle}>Description</th></tr></thead>
            <tbody>
              {[
                ["html", "string", "Yes", "Full HTML markup to convert"],
                ["format", "string", "No", "A3, A4, A5, A6, Letter, Legal, Tabloid. Default: A4"],
                ["orientation", "string", "No", "portrait or landscape. Default: portrait"],
                ["margin", "object", "No", "{top, right, bottom, left} in mm. e.g. \"10mm\""],
                ["printBackground", "boolean", "No", "Print background colors and images. Default: true"],
                ["scale", "number", "No", "Content scale 0.1–2.0. Default: 1"],
                ["mediaType", "string", "No", "print or screen. Default: screen"],
                ["displayHeaderFooter", "boolean", "No", "Enable header and footer"],
                ["headerTemplate", "string", "No", "HTML for page header"],
                ["footerTemplate", "string", "No", "HTML for page footer"],
                ["waitForSelector", "string", "No", "CSS selector to wait for before rendering"],
                ["waitUntil", "string", "No", "load | domcontentloaded | networkidle0 | networkidle2"],
                ["delay", "number", "No", "Delay in ms before rendering (max 10000)"],
                ["filename", "string", "No", "PDF filename in Content-Disposition header"],
              ].map(([p, t, r, d]) => (
                <tr key={p}><td style={tdStyle}><code style={codeStyle}>{p}</code></td><td style={tdStyle}>{t}</td><td style={tdStyle}>{r}</td><td style={tdStyle}>{d}</td></tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* URL to PDF */}
        <section id="url-to-pdf" style={{ marginBottom: 56 }}>
          <h2 style={h2Style}>URL to PDF</h2>
          <p style={pStyle}><strong>POST</strong> <code style={codeStyle}>/api/v1/url-to-pdf</code></p>
          <p style={pStyle}>Same options as HTML to PDF, but accepts a <code style={codeStyle}>url</code> parameter instead of <code style={codeStyle}>html</code>. The URL must be publicly accessible. Private IPs, localhost, and metadata endpoints are blocked.</p>
          <pre style={preStyle}>{`{
  "url": "https://example.com/invoice/123",
  "format": "A4",
  "waitForSelector": "#invoice-loaded",
  "waitUntil": "networkidle0"
}`}</pre>
        </section>

        {/* Screenshot */}
        <section id="screenshot" style={{ marginBottom: 56 }}>
          <h2 style={h2Style}>Screenshot</h2>
          <p style={pStyle}><strong>POST</strong> <code style={codeStyle}>/api/v1/screenshot</code></p>
          <table style={tableStyle}>
            <thead><tr><th style={thStyle}>Parameter</th><th style={thStyle}>Type</th><th style={thStyle}>Description</th></tr></thead>
            <tbody>
              {[
                ["html / url", "string", "HTML markup or public URL (one required)"],
                ["format", "string", "png or jpeg. Default: png"],
                ["fullPage", "boolean", "Capture full scrollable page. Default: false"],
                ["viewportWidth", "number", "Viewport width in px. Default: 1280"],
                ["viewportHeight", "number", "Viewport height in px. Default: 800"],
                ["quality", "number", "JPEG quality 1–100. Default: 90"],
              ].map(([p, t, d]) => (
                <tr key={p}><td style={tdStyle}><code style={codeStyle}>{p}</code></td><td style={tdStyle}>{t}</td><td style={tdStyle}>{d}</td></tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Headers & Footers */}
        <section id="headers-&-footers" style={{ marginBottom: 56 }}>
          <h2 style={h2Style}>Headers & Footers</h2>
          <p style={pStyle}>Set <code style={codeStyle}>displayHeaderFooter: true</code> and provide HTML templates. The following CSS classes are available:</p>
          <table style={tableStyle}>
            <thead><tr><th style={thStyle}>Class</th><th style={thStyle}>Replaced with</th></tr></thead>
            <tbody>
              {[
                [".date", "Formatted print date"],
                [".title", "Document title"],
                [".url", "Page URL"],
                [".pageNumber", "Current page number"],
                [".totalPages", "Total number of pages"],
              ].map(([c, d]) => (
                <tr key={c}><td style={tdStyle}><code style={codeStyle}>{c}</code></td><td style={tdStyle}>{d}</td></tr>
              ))}
            </tbody>
          </table>
          <pre style={preStyle}>{`"footerTemplate": "<div style='font-size:10px;text-align:center;width:100%'>Page <span class='pageNumber'></span> of <span class='totalPages'></span></div>"`}</pre>
        </section>

        {/* Errors */}
        <section id="errors" style={{ marginBottom: 56 }}>
          <h2 style={h2Style}>Errors</h2>
          <p style={pStyle}>All errors return a JSON body with consistent structure:</p>
          <pre style={preStyle}>{`{
  "error": {
    "code": "QUOTA_EXCEEDED",
    "message": "Monthly PDF quota exceeded. Upgrade your plan to continue.",
    "request_id": "req_01KXX..."
  }
}`}</pre>
          <table style={tableStyle}>
            <thead><tr><th style={thStyle}>Code</th><th style={thStyle}>HTTP</th><th style={thStyle}>Meaning</th></tr></thead>
            <tbody>
              {[
                ["MISSING_API_KEY", "401", "No Authorization header provided"],
                ["INVALID_API_KEY", "401", "Key does not exist"],
                ["API_KEY_REVOKED", "401", "Key was revoked"],
                ["QUOTA_EXCEEDED", "429", "Monthly credit limit reached"],
                ["RATE_LIMIT_EXCEEDED", "429", "Too many requests per minute"],
                ["INVALID_HTML", "400", "HTML could not be rendered"],
                ["INVALID_URL", "400", "URL is not valid HTTP/HTTPS"],
                ["BLOCKED_URL", "400", "URL points to private address"],
                ["HTML_TOO_LARGE", "400", "HTML exceeds 10 MB limit"],
                ["RENDERING_TIMEOUT", "500", "Rendering exceeded time limit"],
                ["BROWSER_ERROR", "500", "Unexpected browser error"],
                ["INTERNAL_ERROR", "500", "Server-side error"],
              ].map(([c, h, m]) => (
                <tr key={c}><td style={tdStyle}><code style={codeStyle}>{c}</code></td><td style={tdStyle}>{h}</td><td style={tdStyle}>{m}</td></tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* Rate Limits */}
        <section id="rate-limits" style={{ marginBottom: 56 }}>
          <h2 style={h2Style}>Rate Limits</h2>
          <p style={pStyle}>Rate limits are per API key, per minute:</p>
          <table style={tableStyle}>
            <thead><tr><th style={thStyle}>Plan</th><th style={thStyle}>Requests/min</th></tr></thead>
            <tbody>
              {[["Free", "5"], ["Starter", "20"], ["Growth", "50"], ["Pro", "150"]].map(([p, r]) => (
                <tr key={p}><td style={tdStyle}>{p}</td><td style={tdStyle}>{r}</td></tr>
              ))}
            </tbody>
          </table>
          <p style={pStyle}>Rate limit headers are included in every response:</p>
          <pre style={preStyle}>{`X-RateLimit-Limit: 20
X-RateLimit-Remaining: 18
X-Request-ID: req_01KXX...`}</pre>
        </section>
      </article>
    </div>
  );
}

const h2Style: React.CSSProperties = {
  fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em",
  marginTop: 0, marginBottom: 16,
  paddingBottom: 10, borderBottom: "1px solid var(--pdf-border)",
};
const pStyle: React.CSSProperties = { fontSize: 15, lineHeight: 1.7, color: "var(--pdf-muted)", marginBottom: 14 };
const codeStyle: React.CSSProperties = { fontFamily: "monospace", fontSize: 13, background: "rgba(99,102,241,0.1)", padding: "2px 6px", borderRadius: 4, color: "var(--pdf-accent-light)" };
const preStyle: React.CSSProperties = {
  background: "rgba(0,0,0,0.4)", border: "1px solid var(--pdf-border)",
  borderRadius: 8, padding: "16px 20px",
  fontFamily: "monospace", fontSize: 13, lineHeight: 1.65,
  color: "#c9d1d9", overflowX: "auto", whiteSpace: "pre",
  marginBottom: 20,
};
const tableStyle: React.CSSProperties = { width: "100%", borderCollapse: "collapse", marginBottom: 20, fontSize: 13 };
const thStyle: React.CSSProperties = { textAlign: "left", padding: "8px 12px", borderBottom: "1px solid var(--pdf-border)", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--pdf-muted)" };
const tdStyle: React.CSSProperties = { padding: "10px 12px", borderBottom: "1px solid rgba(42,45,58,0.5)", color: "var(--pdf-text)" };
const linkStyle: React.CSSProperties = { color: "var(--pdf-accent-light)" };
