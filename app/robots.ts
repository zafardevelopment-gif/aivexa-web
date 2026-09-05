import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/config";

const BASE_URL = SITE_URL;

// Paths that must never be indexed: API, admin, authenticated dashboards
// and post-purchase / transactional pages.
const DISALLOW = [
  "/api/",
  "/admin",
  "/admin/",
  "/pdf-api/dashboard",
  "/pdf-api/dashboard/",
  "/pdf-api/login",
  "/store/order-success",
  "/store/*/success",
];

// AI assistant / retrieval crawlers we explicitly welcome so AIVEXA can
// appear in AI answers (ChatGPT, Perplexity, Claude, Gemini, Copilot).
// They inherit the same disallow set as everyone else.
const AI_CRAWLERS = [
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  "PerplexityBot",
  "Perplexity-User",
  "ClaudeBot",
  "Claude-User",
  "anthropic-ai",
  "Google-Extended",
  "CCBot",
  "Bingbot",
  "Applebot-Extended",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: DISALLOW,
      },
      ...AI_CRAWLERS.map((agent) => ({
        userAgent: agent,
        allow: "/",
        disallow: DISALLOW,
      })),
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
