import type { MetadataRoute } from "next";
import { toolCategories } from "@/lib/tools-registry";

const BASE_URL = "https://www.aivexallp.com";

const productSlugs = [
  "ai-munim",
  "clinic-voice",
  "ai-hospital",
  "ai-camp",
  "saferide-qr",
  "myrentsaathi",
];

const legalSlugs = ["privacy", "terms", "data-deletion"];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}/`, lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: `${BASE_URL}/tools`, lastModified: now, changeFrequency: "weekly", priority: 0.9 },
  ];

  const productEntries: MetadataRoute.Sitemap = productSlugs.map((slug) => ({
    url: `${BASE_URL}/products/${slug}`,
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const legalEntries: MetadataRoute.Sitemap = legalSlugs.map((slug) => ({
    url: `${BASE_URL}/${slug}`,
    lastModified: now,
    changeFrequency: "yearly",
    priority: 0.3,
  }));

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

  return [...staticEntries, ...categoryEntries, ...toolEntries, ...productEntries, ...legalEntries];
}
