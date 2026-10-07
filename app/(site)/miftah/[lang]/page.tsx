import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../../calivo-ai/calivo.css";
import LocalizedAppLanding from "@/components/LocalizedAppLanding";
import { contentFor, landingMetadata, miftahApp, MIFTAH_OG, MIFTAH_PACKAGE } from "@/lib/i18n/app-landing";
import type { LangCode } from "@/lib/landing-i18n";

type Params = { lang: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return miftahApp.langs.filter((l) => l !== "en").map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang } = await params;
  const c = contentFor("miftah", lang);
  if (!c || lang === "en") return {};
  return landingMetadata(miftahApp, lang as LangCode, c, MIFTAH_OG, MIFTAH_PACKAGE);
}

export default async function MiftahLangPage({ params }: { params: Promise<Params> }) {
  const { lang } = await params;
  const c = contentFor("miftah", lang);
  if (!c || lang === "en") notFound();
  return <LocalizedAppLanding app={{ ...miftahApp, posts: [] }} lang={lang as LangCode} c={c} />;
}
