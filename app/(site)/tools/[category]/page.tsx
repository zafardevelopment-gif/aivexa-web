import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ArrowRight, Clock } from "lucide-react";
import { toolCategories, getCategory } from "@/lib/tools-registry";

export function generateStaticParams() {
  return toolCategories.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) return { title: "Tools — AIVEXA" };
  const path = `/tools/${cat.slug}`;
  return {
    title: `${cat.name} — Free Online Tools — AIVEXA`,
    description: cat.description,
    alternates: { canonical: path },
    openGraph: {
      title: `${cat.name} — Free Online Tools — AIVEXA`,
      description: cat.description,
      url: path,
      type: "website",
      siteName: "AIVEXA",
      images: [{ url: "/aivexa-logo.png", width: 512, height: 512, alt: "AIVEXA" }],
    },
    twitter: {
      card: "summary",
      title: `${cat.name} — Free Online Tools — AIVEXA`,
      description: cat.description,
    },
  };
}

export default async function ToolCategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const cat = getCategory(category);
  if (!cat) notFound();

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="breadcrumb" style={{ justifyContent: "center" }}>
            <Link href="/tools">Free Tools</Link>
            <span>/</span>
            <span>{cat.name}</span>
          </div>
          <h1 className="section-title">
            <span className="accent">{cat.name}</span>
          </h1>
          <p className="section-desc" style={{ margin: "0 auto" }}>
            {cat.description}
          </p>
        </div>
      </section>

      <section style={{ padding: "3rem 2rem 6rem" }}>
        <div className="container">
          <div className="tools-grid-3">
            {cat.tools.map((tool) =>
              tool.status === "live" ? (
                <Link
                  key={tool.slug}
                  href={`/tools/${cat.slug}/${tool.slug}`}
                  className="product-card"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <h3 style={{ fontSize: "1.05rem" }}>{tool.name}</h3>
                  <p style={{ fontSize: ".88rem" }}>{tool.description}</p>
                  <span
                    className="product-link"
                    style={{ fontSize: ".85rem" }}
                  >
                    Open tool <ArrowRight size={15} />
                  </span>
                </Link>
              ) : (
                <div
                  key={tool.slug}
                  className="product-card"
                  style={{ opacity: 0.6 }}
                >
                  <h3 style={{ fontSize: "1.05rem" }}>{tool.name}</h3>
                  <p style={{ fontSize: ".88rem" }}>{tool.description}</p>
                  <span
                    style={{
                      fontSize: ".8rem",
                      color: "var(--muted-2)",
                      display: "inline-flex",
                      alignItems: "center",
                      gap: 5,
                    }}
                  >
                    <Clock size={13} /> Coming soon
                  </span>
                </div>
              )
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
