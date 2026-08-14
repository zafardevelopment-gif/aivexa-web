import type { Metadata } from "next";
import Link from "next/link";
import { FileCode } from "lucide-react";
import { getCategory } from "@/lib/tools-registry";

export const metadata: Metadata = {
  title: "Markdown Converter Tools — Convert Any File to .md — AIVEXA",
  description:
    "Free browser-based tools to convert PDF, Word, Excel, CSV, image, HTML and plain text files to Markdown (.md) — no signup, no upload.",
  alternates: { canonical: "/tools/markdown" },
  openGraph: {
    title: "Markdown Converter Tools — AIVEXA",
    description:
      "Convert PDF, DOCX, XLSX, CSV, image, HTML and TXT to Markdown — free and browser-only.",
    type: "website",
    url: "/tools/markdown",
    siteName: "AIVEXA",
    images: [{ url: "/aivexa-logo.png", width: 512, height: 512, alt: "AIVEXA" }],
  },
};

const tools = [
  {
    slug: "convert",
    name: "File to Markdown Converter",
    description:
      "Upload a PDF, Word doc, Excel sheet, CSV, image, HTML or plain text file and download a clean .md file instantly.",
    formats: ["PDF", "DOCX", "XLSX", "CSV", "Image", "HTML", "TXT", "JSON"],
  },
];

export default function MarkdownCategoryPage() {
  return (
    <main>
      <section className="page-hero" style={{ padding: "7.5rem 2rem 3rem" }}>
        <div className="container">
          <div className="breadcrumb" style={{ justifyContent: "center" }}>
            <Link href="/tools">Free Tools</Link>
            <span>/</span>
            <span>Markdown Converter</span>
          </div>
          <h1 className="section-title">
            <span className="accent">Markdown</span> Converter Tools
          </h1>
          <p className="section-desc" style={{ margin: "0 auto" }}>
            Convert any file type to clean Markdown — entirely in your browser. No upload, no
            signup.
          </p>
        </div>
      </section>

      <section style={{ padding: "1rem 2rem 6rem" }}>
        <div className="container" style={{ maxWidth: 840 }}>
          <div className="tools-grid-3" style={{ gridTemplateColumns: "1fr" }}>
            {tools.map((t) => (
              <Link
                key={t.slug}
                href={`/tools/markdown/${t.slug}`}
                className="product-card"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="product-icon">
                  <FileCode size={26} strokeWidth={2} />
                </div>
                <h3>{t.name}</h3>
                <p>{t.description}</p>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: ".4rem",
                    marginTop: ".8rem",
                  }}
                >
                  {t.formats.map((f) => (
                    <span
                      key={f}
                      style={{
                        fontSize: ".72rem",
                        fontWeight: 600,
                        padding: ".2rem .55rem",
                        borderRadius: 6,
                        background: "var(--indigo-light, #eef2ff)",
                        color: "var(--indigo, #4f46e5)",
                        letterSpacing: ".02em",
                      }}
                    >
                      {f}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
