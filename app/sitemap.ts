import type { MetadataRoute } from "next";
import { toolCategories } from "@/lib/tools-registry";
import { blogPosts } from "@/lib/blog-posts";
import { getDigitalProducts } from "@/lib/digital-products";
import { getAllPageSlugs } from "@/lib/data";
import { SITE_URL } from "@/lib/seo/config";

const BASE_URL = SITE_URL;

// AIVEXA product landing pages under /products/<slug>.
const productSlugs = [
  "ai-munim",
  "clinic-voice",
  "ai-hospital",
  "ai-camp",
  "saferide-qr",
  "myrentsaathi",
];

// Legal / low-value content pages that should stay in the sitemap but at
// low priority (they are indexable but rarely the ranking target).
const LEGAL_SLUGS = new Set([
  "privacy",
  "terms",
  "data-deletion",
  "miftah-privacy",
]);

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/tools`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE_URL}/store`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/blog`, lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/contact`, lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE_URL}/pdf-api`, lastModified: now, changeFrequency: "monthly", priority: 0.7 },
  ];

  const categoryEntries: MetadataRoute.Sitemap = toolCategories.map((cat) => ({
    url: `${BASE_URL}/tools/${cat.slug}`,
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const toolEntries: MetadataRoute.Sitemap = toolCategories.flatMap((cat) =>
    cat.tools
      .filter((t) => t.status === "live")
      .map((tool) => ({
        url: `${BASE_URL}/tools/${cat.slug}/${tool.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.85,
      }))
  );

  const blogEntries: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  const productEntries: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${BASE_URL}/products/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  // Digital store products — enumerated from the live data source so the
  // sitemap tracks the catalogue instead of a hand-typed list.
  let storeEntries: MetadataRoute.Sitemap = [];
  try {
    const digital = await getDigitalProducts();
    storeEntries = digital.map((p) => ({
      url: `${BASE_URL}/store/${p.slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.75,
    }));
  } catch {
    storeEntries = [];
  }

  // CMS / content pages (legal + any editor-added pages).
  let contentPageEntries: MetadataRoute.Sitemap = [];
  try {
    const slugs = await getAllPageSlugs();
    contentPageEntries = slugs.map((slug) => ({
      url: `${BASE_URL}/${slug}`,
      lastModified: now,
      changeFrequency: "yearly" as const,
      priority: LEGAL_SLUGS.has(slug) ? 0.3 : 0.5,
    }));
  } catch {
    contentPageEntries = [];
  }

  return [
    ...staticEntries,
    ...categoryEntries,
    ...toolEntries,
    ...blogEntries,
    ...productEntries,
    ...storeEntries,
    ...contentPageEntries,
  ];
}
