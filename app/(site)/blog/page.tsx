import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog-posts";
import { catClass } from "./categories";
import "./blog.css";

export const metadata: Metadata = {
  title: "Blog — AI, Health, Business & Free Tools Guides",
  description:
    "Practical guides on AI automation, Indian diet and nutrition, small-business finance, GST, free online PDF and image tools, and digital transformation for India.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog | AIVEXA",
    description:
      "Practical guides on AI automation, Indian diet and nutrition, small-business finance, GST and free online tools.",
    type: "website",
  },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogPage() {
  const sorted = [...blogPosts].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <main className="bl">
      <section className="bl-hero center">
        <div className="bl-wrap">
          <h1>AIVEXA Blog</h1>
          <p>
            Practical guides on AI automation, Indian diet &amp; nutrition, small-business finance and free online
            tools — written for India.
          </p>
        </div>
      </section>

      <section className="bl-wrap">
        <div className="bl-grid">
          {sorted.map((post) => (
            <article key={post.slug} className="bl-card">
              <div className="bl-card-top">
                <span className={catClass(post.category)}>{post.category}</span>
                <span>{post.readTime}</span>
              </div>
              <h2>
                <Link href={`/blog/${post.slug}`}>{post.title}</Link>
              </h2>
              <p>{post.description}</p>
              <div className="bl-card-foot">
                <time dateTime={post.date}>{formatDate(post.date)}</time>
                <Link href={`/blog/${post.slug}`}>Read more →</Link>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
