import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: { default: "AIVEXA PDF API — HTML & URL to PDF for Developers", template: "%s | AIVEXA PDF API" },
  description: "Convert HTML and URLs to PDF with a single API call. Chromium-powered, 99.9% uptime, plans from ₹0. Start free — no credit card needed.",
  keywords: ["html to pdf api", "url to pdf", "pdf generation api", "pdf api india", "chromium pdf", "aivexa pdf"],
  authors: [{ name: "AIVEXA LLP", url: "https://aivexa.com" }],
  openGraph: {
    type: "website",
    siteName: "AIVEXA PDF API",
    title: "AIVEXA PDF API — HTML & URL to PDF for Developers",
    description: "Convert HTML or any URL to a pixel-perfect PDF in milliseconds. Chromium-powered. Plans start at ₹0.",
    url: "https://aivexa.com/pdf-api",
    images: [{ url: "https://aivexa.com/og-pdf-api.png", width: 1200, height: 630, alt: "AIVEXA PDF API" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "AIVEXA PDF API — HTML & URL to PDF",
    description: "Developer API to generate PDFs from HTML and URLs. Free plan available.",
  },
  alternates: { canonical: "https://aivexa.com/pdf-api" },
  robots: { index: true, follow: true },
};

export default function PdfApiLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="pdfapi-root">
      {/* Top navbar — minimal, developer-focused */}
      <header className="pdfapi-topbar">
        <div className="pdfapi-topbar-inner">
          <Link href="/pdf-api" className="pdfapi-brand">
            <span className="pdfapi-brand-icon">⬡</span>
            <span className="pdfapi-brand-name">AIVEXA <strong>PDF API</strong></span>
          </Link>
          <nav className="pdfapi-topnav">
            <Link href="/pdf-api/docs">Docs</Link>
            <Link href="/pdf-api/pricing">Pricing</Link>
            <Link href="/pdf-api/dashboard" className="pdfapi-btn pdfapi-btn-primary">Dashboard →</Link>
          </nav>
        </div>
      </header>

      <main className="pdfapi-main">
        {children}
      </main>

      <style>{`
        *, *::before, *::after { box-sizing: border-box; }

        .pdfapi-root {
          --pdf-bg: #0f1117;
          --pdf-surface: #1a1d27;
          --pdf-border: #2a2d3a;
          --pdf-accent: #6366f1;
          --pdf-accent-light: #818cf8;
          --pdf-success: #22c55e;
          --pdf-error: #ef4444;
          --pdf-warning: #f59e0b;
          --pdf-text: #e2e4f0;
          --pdf-muted: #8b8fa8;
          --pdf-sidebar-w: 220px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
          background: var(--pdf-bg);
          color: var(--pdf-text);
          min-height: 100vh;
        }

        /* Topbar */
        .pdfapi-topbar {
          position: sticky; top: 0; z-index: 100;
          background: rgba(15,17,23,0.92);
          backdrop-filter: blur(12px);
          border-bottom: 1px solid var(--pdf-border);
        }
        .pdfapi-topbar-inner {
          max-width: 1280px; margin: 0 auto;
          padding: 0 24px;
          height: 56px;
          display: flex; align-items: center; justify-content: space-between;
        }
        .pdfapi-brand {
          display: flex; align-items: center; gap: 10px;
          text-decoration: none; color: var(--pdf-text);
          font-size: 15px; letter-spacing: -0.01em;
        }
        .pdfapi-brand-icon {
          font-size: 20px; color: var(--pdf-accent);
        }
        .pdfapi-brand-name strong { color: var(--pdf-accent-light); }

        .pdfapi-topnav {
          display: flex; align-items: center; gap: 8px;
        }
        .pdfapi-topnav a {
          color: var(--pdf-muted); text-decoration: none;
          font-size: 14px; padding: 6px 12px; border-radius: 6px;
          transition: color 0.15s, background 0.15s;
        }
        .pdfapi-topnav a:hover { color: var(--pdf-text); background: var(--pdf-surface); }

        /* Buttons */
        .pdfapi-btn {
          display: inline-flex; align-items: center; justify-content: center; gap: 6px;
          padding: 7px 16px; border-radius: 8px;
          font-size: 14px; font-weight: 500; text-decoration: none;
          cursor: pointer; border: none; transition: all 0.15s;
          text-align: center;
        }
        .pdfapi-btn-primary {
          background: var(--pdf-accent); color: #fff;
        }
        .pdfapi-btn-primary:hover { background: var(--pdf-accent-light); color: #fff; }
        .pdfapi-btn-secondary {
          background: var(--pdf-surface); color: var(--pdf-text);
          border: 1px solid var(--pdf-border);
        }
        .pdfapi-btn-secondary:hover { border-color: var(--pdf-accent); }
        .pdfapi-btn-ghost {
          background: transparent; color: var(--pdf-muted);
        }
        .pdfapi-btn-ghost:hover { color: var(--pdf-text); background: var(--pdf-surface); }
        .pdfapi-btn-danger {
          background: transparent; color: var(--pdf-error);
          border: 1px solid var(--pdf-error);
        }
        .pdfapi-btn-danger:hover { background: var(--pdf-error); color: #fff; }

        .pdfapi-main { flex: 1; }

        /* Cards */
        .pdfapi-card {
          background: var(--pdf-surface);
          border: 1px solid var(--pdf-border);
          border-radius: 12px;
          padding: 24px;
        }

        /* Stat tiles */
        .pdfapi-stat-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 16px;
        }
        .pdfapi-stat {
          background: var(--pdf-surface);
          border: 1px solid var(--pdf-border);
          border-radius: 12px;
          padding: 20px 24px;
        }
        .pdfapi-stat-label {
          font-size: 11px; font-weight: 600;
          letter-spacing: 0.08em; text-transform: uppercase;
          color: var(--pdf-muted); margin-bottom: 8px;
        }
        .pdfapi-stat-value {
          font-size: 28px; font-weight: 700;
          color: var(--pdf-text); letter-spacing: -0.02em;
          line-height: 1;
        }
        .pdfapi-stat-sub {
          font-size: 12px; color: var(--pdf-muted); margin-top: 6px;
        }

        /* Badge */
        .pdfapi-badge {
          display: inline-block; padding: 2px 8px;
          border-radius: 100px; font-size: 11px; font-weight: 600;
        }
        .pdfapi-badge-success { background: rgba(34,197,94,0.15); color: var(--pdf-success); }
        .pdfapi-badge-error { background: rgba(239,68,68,0.15); color: var(--pdf-error); }
        .pdfapi-badge-warning { background: rgba(245,158,11,0.15); color: var(--pdf-warning); }
        .pdfapi-badge-info { background: rgba(99,102,241,0.15); color: var(--pdf-accent-light); }
        .pdfapi-badge-muted { background: rgba(139,143,168,0.15); color: var(--pdf-muted); }

        /* Table */
        .pdfapi-table { width: 100%; border-collapse: collapse; font-size: 13px; }
        .pdfapi-table th {
          text-align: left; padding: 10px 16px;
          font-size: 11px; font-weight: 600; letter-spacing: 0.06em;
          text-transform: uppercase; color: var(--pdf-muted);
          border-bottom: 1px solid var(--pdf-border);
        }
        .pdfapi-table td {
          padding: 12px 16px; border-bottom: 1px solid rgba(42,45,58,0.5);
          color: var(--pdf-text);
        }
        .pdfapi-table tr:last-child td { border-bottom: none; }
        .pdfapi-table tr:hover td { background: rgba(255,255,255,0.02); }

        /* Code block */
        .pdfapi-code {
          background: rgba(0,0,0,0.4);
          border: 1px solid var(--pdf-border);
          border-radius: 8px;
          padding: 16px 20px;
          font-family: 'Fira Code', 'Cascadia Code', Consolas, monospace;
          font-size: 13px; line-height: 1.7;
          color: #c9d1d9;
          overflow-x: auto;
          white-space: pre;
        }
        .pdfapi-code .kw { color: #ff79c6; }
        .pdfapi-code .str { color: #f1fa8c; }
        .pdfapi-code .cm { color: #6272a4; }
        .pdfapi-code .var { color: #8be9fd; }

        /* Input */
        .pdfapi-input, .pdfapi-select, .pdfapi-textarea {
          width: 100%;
          background: rgba(0,0,0,0.3);
          border: 1px solid var(--pdf-border);
          border-radius: 8px;
          color: var(--pdf-text);
          font-size: 14px;
          padding: 10px 14px;
          outline: none;
          transition: border-color 0.15s;
        }
        .pdfapi-input:focus, .pdfapi-select:focus, .pdfapi-textarea:focus {
          border-color: var(--pdf-accent);
        }
        .pdfapi-textarea {
          font-family: 'Fira Code', Consolas, monospace;
          font-size: 13px; resize: vertical;
          line-height: 1.6;
        }
        .pdfapi-label {
          display: block; font-size: 12px; font-weight: 600;
          color: var(--pdf-muted); margin-bottom: 6px;
          letter-spacing: 0.04em; text-transform: uppercase;
        }

        /* Progress bar */
        .pdfapi-progress-bar {
          height: 6px; background: var(--pdf-border); border-radius: 99px; overflow: hidden;
        }
        .pdfapi-progress-fill {
          height: 100%; border-radius: 99px;
          background: linear-gradient(90deg, var(--pdf-accent), var(--pdf-accent-light));
          transition: width 0.3s;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .pdfapi-topbar-inner { padding: 0 16px; }
          .pdfapi-stat-grid { grid-template-columns: repeat(2, 1fr); }
        }
      `}</style>
    </div>
  );
}
