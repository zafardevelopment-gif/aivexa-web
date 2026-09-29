import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getPostBySlug, getAllSlugs } from "@/lib/blog-posts";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.title,
    description: post.description,
    alternates: { canonical: `/blog/${post.slug}` },
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      publishedTime: post.date,
    },
  };
}



function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/** Minimal Markdown-to-HTML for our blog content. Handles:
 *  - ## headings
 *  - **bold**
 *  - *italic*
 *  - `code`
 *  - | tables |
 *  - paragraphs & blank-line separation
 */
function renderMarkdown(md: string): string {
  const lines = md.split("\n");
  const html: string[] = [];
  let inTable = false;
  let tableStarted = false;
  let inList = false;

  const closeList = () => {
    if (inList) { html.push("</ul>"); inList = false; }
  };
  const closeTable = () => {
    if (inTable) { html.push("</tbody></table>"); inTable = false; tableStarted = false; }
  };

  const inline = (s: string) =>
    s
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>");

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // Table row
    if (line.trim().startsWith("|")) {
      const cells = line
        .trim()
        .replace(/^\||\|$/g, "")
        .split("|")
        .map((c) => c.trim());

      // Separator row (---|---)
      if (cells.every((c) => /^-+$/.test(c))) {
        if (!tableStarted) {
          // Wrap previous row as header
          const prev = html.pop() ?? "";
          html.push(
            `<table class="w-full border-collapse my-6 text-sm"><thead>${prev
              .replace(/<td/g, "<th")
              .replace(/<\/td>/g, "</th>")}</thead><tbody>`
          );
          tableStarted = true;
          inTable = true;
        }
        continue;
      }

      const tag = !inTable ? "td" : "td";
      const row = `<tr>${cells.map((c) => `<${tag} class="border border-slate-200 px-3 py-2">${inline(c)}</${tag}>`).join("")}</tr>`;

      if (!inTable && !tableStarted) {
        html.push(row);
      } else {
        html.push(row);
      }
      continue;
    } else {
      closeTable();
    }

    // Heading
    if (line.startsWith("## ")) {
      closeList();
      html.push(`<h2 class="text-2xl font-bold text-slate-900 mt-10 mb-4">${inline(line.slice(3))}</h2>`);
      continue;
    }
    if (line.startsWith("### ")) {
      closeList();
      html.push(`<h3 class="text-xl font-semibold text-slate-800 mt-8 mb-3">${inline(line.slice(4))}</h3>`);
      continue;
    }

    // List item
    if (line.startsWith("- ")) {
      if (!inList) { html.push('<ul class="list-disc list-outside ml-6 space-y-2 my-4">'); inList = true; }
      html.push(`<li class="text-slate-700 leading-relaxed">${inline(line.slice(2))}</li>`);
      continue;
    } else {
      closeList();
    }

    // Blank line
    if (line.trim() === "") {
      html.push("");
      continue;
    }

    // Paragraph
    html.push(`<p class="text-slate-700 leading-relaxed my-3">${inline(line)}</p>`);
  }

  closeList();
  closeTable();

  return html.join("\n");
}

const categoryColors: Record<string, string> = {
  "Healthcare AI": "bg-blue-100 text-blue-800",
  "WhatsApp Automation": "bg-green-100 text-green-800",
  "AI Products": "bg-purple-100 text-purple-800",
  "Free Tools": "bg-orange-100 text-orange-800",
  "Islamic Tools": "bg-teal-100 text-teal-800",
  Business: "bg-yellow-100 text-yellow-800",
};

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();

  const otherPosts = blogPosts
    .filter((p) => p.slug !== post.slug)
    .sort(() => Math.random() - 0.5)
    .slice(0, 3);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: { "@type": "Organization", name: "AIVEXA" },
    publisher: {
      "@type": "Organization",
      name: "AIVEXA",
      logo: { "@type": "ImageObject", url: "https://www.aivexallp.com/aivexa-logo.png" },
    },
    mainEntityOfPage: `https://www.aivexallp.com/blog/${post.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
      />

      <main className="min-h-screen bg-white">
        {/* Hero */}
        <section className="bg-gradient-to-br from-slate-900 to-slate-800 py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <Link
              href="/blog"
              className="text-slate-400 hover:text-white text-sm mb-6 inline-flex items-center gap-1 transition-colors"
            >
              ← Back to Blog
            </Link>
            <div className="flex items-center gap-3 mb-4">
              <span
                className={`text-xs font-semibold px-2.5 py-1 rounded-full ${
                  categoryColors[post.category] ?? "bg-slate-100 text-slate-700"
                }`}
              >
                {post.category}
              </span>
              <span className="text-slate-400 text-xs">{post.readTime}</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-white mb-4 leading-snug">
              {post.title}
            </h1>
            <p className="text-slate-300 text-lg mb-6">{post.description}</p>
            <time dateTime={post.date} className="text-slate-500 text-sm">
              {formatDate(post.date)}
            </time>
          </div>
        </section>

        {/* Article body */}
        <article className="max-w-3xl mx-auto px-6 py-12">
          <div
            className="prose-content"
            dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }}
          />
        </article>

        {/* CTA */}
        <section className="bg-slate-50 py-12 px-6 text-center border-t border-slate-200">
          <h2 className="text-2xl font-bold text-slate-900 mb-2">
            Ready to automate your business?
          </h2>
          <p className="text-slate-600 mb-6 max-w-xl mx-auto">
            AIVEXA builds AI systems for Indian businesses — on WhatsApp and Voice, in your customers' languages.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/contact"
              className="inline-block bg-blue-600 text-white font-semibold px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Contact Us
            </Link>
            <Link
              href="/tools"
              className="inline-block bg-white text-slate-800 font-semibold px-6 py-3 rounded-lg border border-slate-300 hover:bg-slate-50 transition-colors"
            >
              Try Free Tools
            </Link>
          </div>
        </section>

        {/* Related posts */}
        {otherPosts.length > 0 && (
          <section className="max-w-6xl mx-auto px-6 py-16">
            <h2 className="text-2xl font-bold text-slate-900 mb-8">More Articles</h2>
            <div className="grid gap-6 md:grid-cols-3">
              {otherPosts.map((p) => (
                <article
                  key={p.slug}
                  className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow"
                >
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      categoryColors[p.category] ?? "bg-slate-100 text-slate-700"
                    }`}
                  >
                    {p.category}
                  </span>
                  <h3 className="text-base font-bold text-slate-900 mt-3 mb-2 leading-snug">
                    <Link
                      href={`/blog/${p.slug}`}
                      className="hover:text-blue-600 transition-colors"
                    >
                      {p.title}
                    </Link>
                  </h3>
                  <p className="text-slate-600 text-sm line-clamp-2">{p.description}</p>
                  <Link
                    href={`/blog/${p.slug}`}
                    className="inline-block mt-3 text-sm text-blue-600 font-medium hover:text-blue-700"
                  >
                    Read →
                  </Link>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
