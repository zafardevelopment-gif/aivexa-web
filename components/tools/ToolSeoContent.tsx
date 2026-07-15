import { getCategory } from "@/lib/tools-registry";
import { buildToolJsonLd, buildToolFaqs } from "@/lib/seo";

/**
 * Renders an "About this tool / FAQ" content block below every free tool,
 * plus WebApplication + FAQPage JSON-LD. This gives each of the 89+ tool
 * pages unique, indexable body copy (helps with both SEO ranking and
 * AdSense's "sufficient content" requirement) instead of just a bare
 * calculator/UI with no text for search engines to read.
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
  const faqs = buildToolFaqs(tool.name);

  return (
    <section style={{ padding: "0 1.25rem 4rem" }}>
      <div className="container" style={{ maxWidth: 760 }}>
        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: ".6rem" }}>
          About the {tool.name}
        </h2>
        <p style={{ color: "var(--muted)", lineHeight: 1.75, marginBottom: "1.75rem" }}>
          {tool.name} is a free, browser-based tool from AIVEXA&apos;s{" "}
          {categoryDef.name.toLowerCase()} collection. {tool.description} It works
          instantly in your browser — no signup, no installation and no watermark —
          and is one of 89+ free tools available on AIVEXA, covering PDF editing,
          image editing, everyday calculators, document generators and Islamic tools.
        </p>

        <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginBottom: ".6rem" }}>
          Frequently Asked Questions
        </h2>
        <div>
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
      </div>

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
        </>
      )}
    </section>
  );
}
