import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getPage } from "@/lib/data";

// This route existed before the CALIVO AI page and is used by Miftah's
// Play Store listing. It renders the "privacy-policy" DB slug directly,
// the same way the generic /[slug] catch-all does, so this URL keeps
// serving Miftah's original privacy policy content.
export const revalidate = 60;

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

export async function generateMetadata(): Promise<Metadata> {
  const page = await getPage("privacy-policy");
  if (!page) return { title: "AIVEXA" };

  const title = `${page.title} — AIVEXA`;
  const description = page.subtitle
    ? `${page.title}. ${plainTextExcerpt(page.content, 120)}`
    : plainTextExcerpt(page.content, 160);

  return {
    title,
    description,
    alternates: { canonical: "/privacy-policy" },
    openGraph: {
      title,
      description,
      url: "/privacy-policy",
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

export default async function PrivacyPolicyPage() {
  const page = await getPage("privacy-policy");
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
