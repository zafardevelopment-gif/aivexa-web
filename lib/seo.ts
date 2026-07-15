import type { Metadata } from "next";
import { getCategory } from "./tools-registry";

export const SITE_URL = "https://www.aivexallp.com";

/**
 * Builds full page metadata for a tool page: keeps the page's own
 * hand-written title/description, and adds keywords, canonical URL,
 * Open Graph and Twitter card data sourced from the shared tools registry.
 */
export function buildToolMetadata(
  categorySlug: string,
  toolSlug: string,
  overrides: { title: string; description: string }
): Metadata {
  const category = getCategory(categorySlug);
  const tool = category?.tools.find((t) => t.slug === toolSlug);
  const path = `/tools/${categorySlug}/${toolSlug}`;
  const { title, description } = overrides;
  const toolNameLower = tool?.name?.toLowerCase() ?? "tool";

  const keywords = Array.from(
    new Set(
      [
        tool?.name,
        `${toolNameLower} online`,
        `free ${toolNameLower}`,
        `${toolNameLower} no signup`,
        category?.name,
        "free online tools",
        "AIVEXA tools",
      ].filter((v): v is string => Boolean(v))
    )
  );

  return {
    title,
    description,
    keywords,
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

export function buildToolJsonLd(categorySlug: string, toolSlug: string) {
  const category = getCategory(categorySlug);
  const tool = category?.tools.find((t) => t.slug === toolSlug);
  if (!tool) return null;

  const path = `${SITE_URL}/tools/${categorySlug}/${toolSlug}`;

  const webApplication = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: tool.name,
    url: path,
    description: tool.description,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (Web Browser)",
    isAccessibleForFree: true,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "INR",
    },
    isPartOf: {
      "@type": "WebSite",
      name: "AIVEXA",
      url: SITE_URL,
    },
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: buildToolFaqs(tool.name).map((faq) => ({
      "@type": "Question",
      name: faq.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.a,
      },
    })),
  };

  return { webApplication, faqPage };
}

export function buildToolFaqs(toolName: string) {
  return [
    {
      q: `Is ${toolName} free to use?`,
      a: `Yes, ${toolName} on AIVEXA is completely free to use with no signup, no watermark and no hidden limits.`,
    },
    {
      q: `Do I need to create an account?`,
      a: `No account or login is required. Just open the tool and use it directly in your browser.`,
    },
    {
      q: `Is my data safe when I use this tool?`,
      a: `Most AIVEXA tools run entirely in your browser (client-side), which means your files and inputs are processed on your own device and are not uploaded to a server.`,
    },
    {
      q: `Can I use this tool on mobile?`,
      a: `Yes, this tool works on any modern browser — desktop, Android or iOS — without installing an app.`,
    },
  ];
}
