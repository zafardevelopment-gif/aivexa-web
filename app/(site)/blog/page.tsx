import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog-posts";

export const metadata: Metadata = {
  title: "Blog — AI, Tools & Business Insights",
  description:
    "Expert articles on AI automation for healthcare, free online PDF and image tools, WhatsApp business automation, and digital transformation for Indian businesses.",
  alternates: { canonical: "/blog" },
  openGraph: {
    title: "Blog | AIVEXA",
    description:
      "Expert articles on AI automation for healthcare, free online PDF and image tools, WhatsApp business automation, and digital transformation for Indian businesses.",
    type: "website",
  },
};

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

const categoryColors: Record<string, string> = {
  "Healthcare AI": "bg-blue-100 text-blue-800",
  "Health & Nutrition": "bg-emerald-100 text-emerald-800",
  "WhatsApp Automation": "bg-green-100 text-green-800",
  "AI Products": "bg-purple-100 text-purple-800",
  "Free Tools": "bg-orange-100 text-orange-800",
  "Islamic Tools": "bg-teal-100 text-teal-800",
  Business: "bg-yellow-100 text-yellow-800",
};

export default function BlogPage() {
  const sorted = [...blogPosts].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <main className="min-h-screen bg-white">
      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-20 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
          AIVEXA Blog
        </h1>
        <p className="text-slate-300 text-lg max-w-2xl mx-auto">
          Insights on AI automation, free online tools, healthcare technology,
          and digital transformation for Indian businesses.
        </p>
      </section>

      {/* Posts grid */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sorted.map((post) => (
            <article
              key={post.slug}
              className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col"
            >
              <div className="p-6 flex flex-col flex-1">
                {/* Category + read time */}
                <div className="flex items-center gap-3 mb-3">
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                      categoryColors[post.category] ??
                      "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {post.category}
                  </span>
                  <span className="text-xs text-slate-400">{post.readTime}</span>
                </div>

                {/* Title */}
                <h2 className="text-lg font-bold text-slate-900 mb-2 leading-snug">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-blue-600 transition-colors"
                  >
                    {post.title}
                  </Link>
                </h2>

                {/* Description */}
                <p className="text-slate-600 text-sm leading-relaxed flex-1 mb-4">
                  {post.description}
                </p>

                {/* Footer */}
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <time
                    dateTime={post.date}
                    className="text-xs text-slate-400"
                  >
                    {formatDate(post.date)}
                  </time>
                  <Link
                    href={`/blog/${post.slug}`}
                    className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors"
                  >
                    Read more →
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
}
