import Link from "next/link";
import { getCategory } from "@/lib/tools-registry";
import { buildToolJsonLd, getMergedToolFaqs } from "@/lib/seo";
import { getToolSeoOverride } from "@/lib/tool-seo-overrides";
import { getRelatedTools } from "@/lib/related-tools";

/**
 * Renders an "About this tool / FAQ / Related Tools" content block below every
 * free tool, plus WebApplication + FAQPage + BreadcrumbList JSON-LD.
 *
 * This gives each of the 100+ tool pages:
 *  - Unique, indexable body copy  (SEO ranking + AdSense "sufficient content")
 *  - FAQPage schema  → eligible for rich-result FAQ dropdowns in Google
 *  - WebApplication schema  → eligible for app-style rich results
 *  - BreadcrumbList schema  → site-link breadcrumbs in search snippets
 *  - Related Tools section  → increases pages-per-session + distributes link equity
 */
export default function ToolSeoContent({
  category,
  slug,
}: {
  category: string;
  slug: string;
}) {
  const categoryDef = getCategory(category);
  const tool = categoryDef?.tools.find((t) => t.slug === slug);
  if (!tool || !categoryDef) return null;

  const jsonLd = buildToolJsonLd(category, slug);
  const faqs = getMergedToolFaqs(category, slug, tool.name);
  const override = getToolSeoOverride(category, slug);
  const relatedTools = getRelatedTools(category, slug);

  return (
    <section style={{ padding: "0 1.25rem 4rem" }}>
      <div className="container" style={{ maxWidth: 760 }}>

        {/* ── About section ── */}
        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: ".6rem" }}>
          About the {tool.name}
        </h2>
        {override?.intro.map((para) => (
          <p
            key={para.slice(0, 40)}
            style={{ color: "var(--muted)", lineHeight: 1.75, marginBottom: "1rem" }}
          >
            {para}
          </p>
        ))}
        <p style={{ color: "var(--muted)", lineHeight: 1.75, marginBottom: "1.75rem" }}>
          {tool.name} is a free, browser-based tool from AIVEXA&apos;s{" "}
          {categoryDef.name.toLowerCase()} collection. {tool.description} It works
          instantly in your browser — no signup, no installation and no watermark —
          and is one of 100+ free tools available on AIVEXA, covering PDF editing,
          image editing, everyday calculators, document generators and Islamic tools.
        </p>

        {/* ── FAQ section ── */}
        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: ".6rem" }}>
          Frequently Asked Questions
        </h2>
        <div style={{ marginBottom: "2.5rem" }}>
          {faqs.map((faq) => (
            <details
              key={faq.q}
              style={{
                borderBottom: "1px solid #e5e7eb",
                padding: ".9rem 0",
              }}
            >
              <summary style={{ fontWeight: 600, cursor: "pointer" }}>{faq.q}</summary>
              <p style={{ color: "var(--muted)", marginTop: ".5rem", lineHeight: 1.7 }}>
                {faq.a}
              </p>
            </details>
          ))}
        </div>

        {/* ── Related Tools section ── */}
        {relatedTools.length > 0 && (
          <div>
            <h2
              style={{
                fontSize: "1.4rem",
                fontWeight: 700,
                marginBottom: "1rem",
              }}
            >
              You Might Also Need
            </h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
                gap: ".75rem",
              }}
            >
              {relatedTools.map((rt) => (
                <Link
                  key={rt.href}
                  href={rt.href}
                  style={{
                    display: "block",
                    padding: ".85rem 1rem",
                    border: "1px solid #e5e7eb",
                    borderRadius: 10,
                    textDecoration: "none",
                    transition: "border-color .15s, box-shadow .15s",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      fontWeight: 600,
                      fontSize: ".9rem",
                      color: "var(--indigo)",
                      marginBottom: ".25rem",
                    }}
                  >
                    {rt.name}
                  </span>
                  <span
                    style={{
                      display: "block",
                      fontSize: ".8rem",
                      color: "var(--muted)",
                      lineHeight: 1.5,
                    }}
                  >
                    {rt.description}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ── JSON-LD structured data ── */}
      {jsonLd && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.webApplication) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.faqPage) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd.breadcrumbList) }}
          />
        </>
      )}
    </section>
  );
}
