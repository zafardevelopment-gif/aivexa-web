import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { blogPosts, getAllBlogSlugs, getBlogPost } from "@/lib/blog-posts";
import { buildBlogMetadata, buildBlogJsonLd } from "@/lib/seo";

export function generateStaticParams() {
  return getAllBlogSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "AIVEXA Blog" };
  return buildBlogMetadata(post);
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const jsonLd = buildBlogJsonLd(post);

  // Simple related-posts pick: same tag first, otherwise the next two posts.
  const related = blogPosts
    .filter((p) => p.slug !== post.slug)
    .sort((a, b) => (a.tag === post.tag ? -1 : 0) - (b.tag === post.tag ? -1 : 0))
    .slice(0, 3);

  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <section className="page-hero">
        <div className="container">
          <span className="section-label">{post.tag}</span>
          <h1 className="section-title">{post.title}</h1>
          <p className="legal-update">
            {formatDate(post.date)} · {post.readingMinutes} min read
          </p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>›</span>
            <Link href="/blog">Blog</Link>
            <span>›</span>
            <span>{post.title}</span>
          </div>
        </div>
      </section>

      <section
        className="legal-page-content"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {related.length > 0 && (
        <section style={{ padding: "0 2rem 6rem" }}>
          <div className="container" style={{ maxWidth: 820 }}>
            <h3
              style={{
                fontSize: "1.05rem",
                fontWeight: 700,
                marginBottom: "1rem",
              }}
            >
              More from the blog
            </h3>
            <div className="tools-grid-3">
              {related.map((r) => (
                <Link
                  key={r.slug}
                  href={`/blog/${r.slug}`}
                  className="product-card"
                  style={{ textDecoration: "none", color: "inherit" }}
                >
                  <span
                    className="section-label"
                    style={{ marginBottom: ".6rem" }}
                  >
                    {r.tag}
                  </span>
                  <h3>{r.title}</h3>
                  <p>{r.excerpt}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </main>
  );
}
