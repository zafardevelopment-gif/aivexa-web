import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getPostBySlug, getAllSlugs } from "@/lib/blog-posts";
import { calivoPlayUrl, PLAY_BADGE_IMG } from "@/lib/calivo";
import { miftahPlayUrl } from "@/lib/miftah";
import { getDigitalProduct, formatPrice } from "@/lib/digital-products";
import { catClass } from "../categories";
import "../blog.css";

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
      .replace(/`(.+?)`/g, "<code>$1</code>")
      // [text](url) — internal links stay same-tab; external open in a new tab.
      .replace(/\[([^\]]+)\]\(([^)\s]+)\)/g, (_m, text, href) =>
        href.startsWith("/")
          ? `<a href="${href}" class="text-blue-700 underline font-medium">${text}</a>`
          : `<a href="${href}" target="_blank" rel="noopener" class="text-blue-700 underline font-medium">${text}</a>`);

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



export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) notFound();
  const storeProduct = post.storeSlug ? await getDigitalProduct(post.storeSlug).catch(() => null) : null;

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

      <main className="bl">
        <section className="bl-hero">
          <div className="bl-narrow">
            <Link href="/blog" className="bl-back">← Back to Blog</Link>
            <div className="bl-meta">
              <span className={catClass(post.category)}>{post.category}</span>
              <span>{post.readTime}</span>
            </div>
            <h1>{post.title}</h1>
            <p>{post.description}</p>
            <time dateTime={post.date} className="bl-date">{formatDate(post.date)}</time>
          </div>
        </section>

        <article className="bl-narrow bl-article">
          <div className="bl-prose" dangerouslySetInnerHTML={{ __html: renderMarkdown(post.content) }} />
        </article>

        {post.cta === "calivo" && (
          <section className="bl-narrow">
            <div className="bl-box bl-box-calivo">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="icon" src="/calivo/calivo-icon.png" alt="CALIVO AI app icon" width={64} height={64} />
              <h2>Count calories in Indian food with one photo</h2>
              <p>
                CALIVO AI is a free AI calorie counter &amp; diet coach for Indian meals — photo scanning, AI diet plans
                for weight loss, PCOS and diabetes, protein tracking and fasting timer. English, Hindi, Urdu &amp; Arabic.
              </p>
              <a href={calivoPlayUrl(`blog_${post.slug}`)} target="_blank" rel="noopener" aria-label="Get CALIVO AI on Google Play" style={{ display: "inline-block", lineHeight: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={PLAY_BADGE_IMG} alt="Get it on Google Play" height={60} style={{ height: 60, width: "auto" }} />
              </a>
              <div className="more"><Link href="/calivo-ai">Learn more about CALIVO AI →</Link></div>
            </div>
          </section>
        )}

        {post.cta === "miftah" && (
          <section className="bl-narrow">
            <div className="bl-box bl-box-calivo" style={{ background: "linear-gradient(135deg, #1E4438 0%, #2F5D50 60%, #4A7F6C 100%)" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="icon" src="/miftah/miftah-icon.png" alt="Miftah app icon" width={64} height={64} />
              <h2>Never miss a salah</h2>
              <p>
                Miftah is a free prayer app: accurate offline namaz times, before-prayer, Azan &amp; Iqamah alerts, Qibla,
                the Holy Quran, a salah tracker and a gentle app pause during prayer time.
              </p>
              <a href={miftahPlayUrl(`blog_${post.slug}`)} target="_blank" rel="noopener" aria-label="Get Miftah on Google Play" style={{ display: "inline-block", lineHeight: 0 }}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={PLAY_BADGE_IMG} alt="Get it on Google Play" height={60} style={{ height: 60, width: "auto" }} />
              </a>
              <div className="more"><Link href="/miftah">Learn more about Miftah →</Link></div>
            </div>
          </section>
        )}

        {storeProduct && (
          <section className="bl-narrow">
            <div className="bl-box bl-box-store">
              {storeProduct.preview_image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={storeProduct.preview_image} alt={storeProduct.name} loading="lazy" />
              )}
              <div style={{ flex: 1 }}>
                <span className="tag">AIVEXA Store · Instant download</span>
                <h2>{storeProduct.name}</h2>
                {storeProduct.tagline && <p>{storeProduct.tagline}</p>}
                <div className="bl-price">
                  <b>{formatPrice(storeProduct.price)}</b>
                  {storeProduct.original_price > 0 && <s>{formatPrice(storeProduct.original_price)}</s>}
                  <Link href={`/store/${storeProduct.slug}`} className="bl-btn">View &amp; buy →</Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {!post.cta && !storeProduct && (
          <section className="bl-cta">
            <h2>Ready to automate your business?</h2>
            <p>AIVEXA builds AI systems for Indian businesses — on WhatsApp and Voice, in your customers&apos; languages.</p>
            <div className="row">
              <Link href="/contact" className="bl-btn">Contact Us</Link>
              <Link href="/tools" className="bl-btn-ghost">Try Free Tools</Link>
            </div>
          </section>
        )}

        {otherPosts.length > 0 && (
          <section className="bl-wrap bl-related">
            <h2>More Articles</h2>
            <div className="bl-grid">
              {otherPosts.map((p) => (
                <article key={p.slug} className="bl-card">
                  <div className="bl-card-top"><span className={catClass(p.category)}>{p.category}</span></div>
                  <h3><Link href={`/blog/${p.slug}`}>{p.title}</Link></h3>
                  <p>{p.description}</p>
                  <div className="bl-card-foot"><span>{p.readTime}</span><Link href={`/blog/${p.slug}`}>Read →</Link></div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>
    </>
  );
}
