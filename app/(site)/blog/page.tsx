import Link from "next/link";
import type { Metadata } from "next";
import { blogPosts } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Blog — Guides, Product Updates & Tips — AIVEXA",
  description:
    "Guides on free online tools, Islamic finance calculations, everyday utilities, and updates on AIVEXA's AI products for retailers and clinics.",
  keywords: [
    "AIVEXA blog",
    "free online tools guides",
    "how to compress pdf",
    "how to calculate zakat",
    "AI Munim",
    "Clinic Voice",
  ],
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog — AIVEXA",
    description:
      "Guides on free online tools, Islamic finance calculations, everyday utilities, and AIVEXA's AI products.",
    type: "website",
    url: "/blog",
    siteName: "AIVEXA",
    images: [{ url: "/aivexa-logo.png", width: 512, height: 512, alt: "AIVEXA" }],
  },
  twitter: {
    card: "summary",
    title: "Blog — AIVEXA",
    description:
      "Guides on free online tools, Islamic finance calculations, everyday utilities, and AIVEXA's AI products.",
  },
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function BlogIndexPage() {
  const posts = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <span className="section-label">BLOG</span>
          <h1 className="section-title">
            Guides, updates & <span className="accent">tips</span>
          </h1>
          <p className="section-desc" style={{ margin: "0 auto" }}>
            How-to guides for our free tools, and updates on AIVEXA&apos;s AI
            products.
          </p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>›</span>
            <span>Blog</span>
          </div>
        </div>
      </section>

      <section style={{ padding: "3rem 2rem 6rem" }}>
        <div className="container">
          <div className="tools-grid-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.slug}`}
                className="product-card"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <span
                  className="section-label"
                  style={{ marginBottom: ".6rem" }}
                >
                  {post.tag}
                </span>
                <h3>{post.title}</h3>
                <p>{post.excerpt}</p>
                <p
                  style={{
                    fontSize: ".8rem",
                    color: "var(--muted-2)",
                    marginTop: ".6rem",
                  }}
                >
                  {formatDate(post.date)} · {post.readingMinutes} min read
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
