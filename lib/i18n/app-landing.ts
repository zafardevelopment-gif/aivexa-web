import type { Metadata } from "next";
import { miftah, miftahPlayUrl, MIFTAH_PLAY_URL_CLEAN, MIFTAH_PACKAGE } from "@/lib/miftah";
import { calivo, calivoPlayUrl, CALIVO_PLAY_URL_CLEAN, CALIVO_PACKAGE, PLAY_BADGE_IMG } from "@/lib/calivo";
import { blogPosts } from "@/lib/blog-posts";
import { siteConfig } from "@/lib/seo/config";
import { LANG_META, type LandingContent, type LangCode } from "@/lib/landing-i18n";
import { langPath, type LandingApp } from "@/components/LocalizedAppLanding";
import { MIFTAH_CONTENT, MIFTAH_LANGS } from "./miftah-content";
import { CALIVO_CONTENT, CALIVO_LANGS } from "./calivo-content";

const GOLD = "#C7A25A";

export const miftahApp: LandingApp = {
  name: "Miftah",
  basePath: "/miftah",
  langs: MIFTAH_LANGS,
  icon: "/miftah/miftah-icon.png",
  playUrl: miftahPlayUrl,
  playUrlClean: MIFTAH_PLAY_URL_CLEAN,
  badgeImg: PLAY_BADGE_IMG,
  category: "LifestyleApplication",
  subCategory: "Prayer times, Quran, Islamic app",
  alternateNames: ["Miftah: Prayer Times & Quran", "Miftah Namaz Time", "مفتاح", "मिफ़्ताह"],
  privacyHref: "/miftah-privacy",
  supportEmail: miftah.supportEmail,
  screenshots: miftah.screenshots,
  brandStyle: { "--cv-green": "#2F5D50", "--cv-green-d": "#1E4438", "--cv-green-l": "#F4EEDF" } as React.CSSProperties,
  heroBackground: "radial-gradient(1200px 500px at 85% 10%, #EFE4C6 0%, transparent 60%), linear-gradient(180deg, #FAF7EE 0%, #fff 100%)",
  h1Gradient: `linear-gradient(90deg, #1E4438, ${GOLD})`,
  bandBackground: "linear-gradient(135deg, #1E4438 0%, #2F5D50 60%, #4A7F6C 100%)",
  stepBackground: "linear-gradient(135deg, #2F5D50, #1E4438)",
  heroVisual: "card",
  posts: blogPosts.filter((p) => p.cta === "miftah").slice(0, 10),
};

export const calivoApp: LandingApp = {
  name: "CALIVO AI",
  basePath: "/calivo-ai",
  langs: CALIVO_LANGS,
  icon: "/calivo/calivo-icon.png",
  playUrl: calivoPlayUrl,
  playUrlClean: CALIVO_PLAY_URL_CLEAN,
  badgeImg: PLAY_BADGE_IMG,
  category: "HealthApplication",
  subCategory: "Calorie counter, diet planner",
  alternateNames: ["CALIVO AI: Calorie Counter"],
  privacyHref: "/calivo-ai/privacy-policy",
  supportEmail: calivo.supportEmail,
  screenshots: [...calivo.screenshots],
  heroVisual: "phones",
  footNote: "CALIVO AI provides estimates for general wellness and is not medical advice.",
  posts: blogPosts.filter((p) => p.cta === "calivo").slice(0, 6),
};

export function contentFor(app: "miftah" | "calivo", lang: string): LandingContent | null {
  const map = app === "miftah" ? MIFTAH_CONTENT : CALIVO_CONTENT;
  return map[lang] ?? null;
}

/** Metadata with canonical + hreflang alternates for every language. */
export function landingMetadata(app: LandingApp, lang: LangCode, c: LandingContent, ogImage: string, packageId: string): Metadata {
  const path = langPath(app, lang);
  const languages: Record<string, string> = {};
  for (const l of app.langs) languages[LANG_META[l].hreflang] = langPath(app, l);
  languages["x-default"] = app.basePath;
  return {
    title: c.title,
    description: c.desc,
    keywords: c.keywords,
    alternates: { canonical: path, languages },
    openGraph: {
      title: c.title,
      description: c.desc,
      url: path,
      type: "website",
      siteName: siteConfig.name,
      locale: lang,
      images: [{ url: ogImage, width: 1200, height: 630, alt: c.title }],
    },
    twitter: { card: "summary_large_image", title: c.title, description: c.desc, images: [ogImage] },
    other: { "google-play-app": `app-id=${packageId}` },
  };
}

export const MIFTAH_OG = "/miftah/miftah-og.png";
export const CALIVO_OG = "/calivo/calivo-og.png";
export { MIFTAH_PACKAGE, CALIVO_PACKAGE };
