/**
 * Single source of truth for site-wide SEO / identity data.
 *
 * Change a value here and it propagates to metadata, sitemap, robots,
 * JSON-LD, the web manifest and /llms.txt. Nothing SEO-related should
 * hardcode the domain, company details or brand strings anymore —
 * import from here instead.
 */

// Canonical origin. Read from env so staging/preview can differ, with a
// production fallback. NOTE: the fallback keeps the "www" host that the
// live site already canonicalises to — do not switch to the bare domain
// without also adding a host redirect, or you split canonical signals.
const RAW_SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL?.trim() || "https://www.aivexallp.com";

// Normalise: no trailing slash.
export const SITE_URL = RAW_SITE_URL.replace(/\/+$/, "");

export const siteConfig = {
  /** Short brand name used in titles, OG siteName, JSON-LD. */
  name: "AIVEXA",
  /** Full legal name. */
  legalName: "AIVEXA LLP",
  /** One-line tagline. */
  tagline: "AI. Vision. Automation. Excellence.",
  /** Canonical origin (no trailing slash). */
  url: SITE_URL,
  /** Default locale. */
  locale: "en_IN",
  htmlLang: "en",
  /** Brand / theme colour used by the manifest and <meta theme-color>. */
  themeColor: "#0b1220",
  backgroundColor: "#ffffff",

  /**
   * Default meta description (150–160 chars). Individual pages should
   * still supply their own; this is the root fallback.
   */
  description:
    "AIVEXA builds enterprise-grade AI systems that answer calls, manage accounts and book appointments on WhatsApp and Voice — plus 120+ free online tools.",

  /** Brand-level keyword seed. Page-level keywords are added per route. */
  keywords: [
    "AIVEXA",
    "AI Munim",
    "Clinic Voice",
    "WhatsApp automation",
    "AI voice agent",
    "AI receptionist India",
    "free online tools",
    "free PDF tools",
    "free image tools",
    "PDF API India",
  ],

  /** Legal entity + contact — the address propagates from here. */
  entity: {
    legalName: "AIVEXA LLP",
    email: "aivexallp@gmail.com",
    gstin: "10ACOFA0764H1ZO",
    address: {
      locality: "Darbhanga",
      region: "Bihar",
      country: "IN",
    },
  },

  /** Brand assets (paths under /public). */
  ogImagePath: "/opengraph-image", // dynamic route (see app/opengraph-image.tsx)
  logoPath: "/aivexa-logo.png",
  logoMarkPath: "/aivexa-logo-mark.svg",

  /** Search-console / verification tokens (set in env; empty = omitted). */
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION?.trim() || undefined,
    bing: process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION?.trim() || undefined,
  },

  /** Social handle(s) for Twitter card attribution (optional). */
  twitterHandle: undefined as string | undefined,
} as const;

/** Absolute URL helper — join a path onto SITE_URL. */
export function absoluteUrl(path = "/"): string {
  if (/^https?:\/\//i.test(path)) return path;
  return `${SITE_URL}${path.startsWith("/") ? "" : "/"}${path}`;
}
