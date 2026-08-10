import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPage } from "@/lib/data";

export const revalidate = 60;

// Legal/content pages served from the aivexa_pages table.
const knownSlugs = ["privacy", "terms", "data-deletion", "miftah-privacy"];

export function generateStaticParams() {
  return knownSlugs.map((slug) => ({ slug }));
}

function plainTextExcerpt(html: string, maxLength = 160): string {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&mdash;/g, "—")
    .replace(/&amp;/g, "&")
    .replace(/\s+/g, " ")
    .trim();
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 1).trimEnd()}…`;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) return { title: "AIVEXA" };

  const title = `${page.title} — AIVEXA`;
  const description = page.subtitle
    ? `${page.title} for AIVEXA. ${plainTextExcerpt(page.content, 120)}`
    : plainTextExcerpt(page.content, 160);
  const path = `/${slug}`;

  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      type: "website",
      siteName: "AIVEXA",
      images: [{ url: "/aivexa-logo.png", width: 512, height: 512, alt: "AIVEXA" }],
    },
    twitter: {
      card: "summary",
      title,
      description,
      images: ["/aivexa-logo.png"],
    },
  };
}

export default async function ContentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const page = await getPage(slug);
  if (!page) notFound();

  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="section-label" style={{ justifyContent: "center" }}>
            Legal
          </div>
          <h1 className="section-title">
            <span className="accent">{page.title}</span>
          </h1>
          {page.subtitle && <p className="legal-update">{page.subtitle}</p>}
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>›</span>
            <span>{page.title}</span>
          </div>
        </div>
      </section>
      <section
        className="legal-page-content"
        dangerouslySetInnerHTML={{ __html: page.content }}
      />
    </main>
  );
}
