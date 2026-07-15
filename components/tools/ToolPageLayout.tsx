import Link from "next/link";
import type { ReactNode } from "react";

export default function ToolPageLayout({
  title,
  description,
  categoryHref,
  categoryName,
  children,
}: {
  title: string;
  description: string;
  categoryHref: string;
  categoryName: string;
  children: ReactNode;
}) {
  return (
    <main>
      <section className="page-hero" style={{ padding: "7.5rem 2rem 2.5rem" }}>
        <div className="container">
          <div className="breadcrumb" style={{ justifyContent: "center" }}>
            <Link href="/tools">Free Tools</Link>
            <span>/</span>
            <Link href={categoryHref}>{categoryName}</Link>
          </div>
          <h1 className="section-title">
            <span className="accent">{title}</span>
          </h1>
          <p className="section-desc" style={{ margin: ".6rem auto 0" }}>
            {description}
          </p>
        </div>
      </section>

      <section style={{ padding: "1rem 1.25rem 4rem" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          {children}
        </div>
      </section>

      <ToolCTABanner />
    </main>
  );
}

export function ToolCTABanner() {
  return (
    <section style={{ padding: "0 1.25rem 5rem" }}>
      <div
        className="container"
        style={{
          maxWidth: 760,
          background: "var(--indigo-light)",
          border: "1px solid #e0e7ff",
          borderRadius: "var(--radius, 16px)",
          padding: "1.6rem 1.8rem",
          display: "flex",
          flexWrap: "wrap",
          gap: "1rem",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div>
          <strong style={{ display: "block", marginBottom: ".2rem" }}>
            Need a custom tool built for your business?
          </strong>
          <span style={{ color: "var(--muted)", fontSize: ".92rem" }}>
            AIVEXA builds AI-powered automation on WhatsApp and Voice.
          </span>
        </div>
        <Link href="/#contact" className="btn-primary">
          Talk to AIVEXA
        </Link>
      </div>
      <p
        style={{
          textAlign: "center",
          marginTop: "1.5rem",
          fontSize: ".82rem",
          color: "var(--muted-2)",
        }}
      >
        Powered by{" "}
        <Link href="/" style={{ color: "var(--indigo)", fontWeight: 600 }}>
          AIVEXA
        </Link>
      </p>
    </section>
  );
}
