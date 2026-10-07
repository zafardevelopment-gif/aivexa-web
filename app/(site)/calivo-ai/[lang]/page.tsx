import type { Metadata } from "next";
import { notFound } from "next/navigation";
import "../calivo.css";
import LocalizedAppLanding from "@/components/LocalizedAppLanding";
import { calivoApp, CALIVO_OG, CALIVO_PACKAGE, contentFor, landingMetadata } from "@/lib/i18n/app-landing";
import type { LangCode } from "@/lib/landing-i18n";

type Params = { lang: string };

export const dynamicParams = false;

export function generateStaticParams(): Params[] {
  return calivoApp.langs.filter((l) => l !== "en").map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { lang } = await params;
  const c = contentFor("calivo", lang);
  if (!c || lang === "en") return {};
  return landingMetadata(calivoApp, lang as LangCode, c, CALIVO_OG, CALIVO_PACKAGE);
}

export default async function CalivoLangPage({ params }: { params: Promise<Params> }) {
  const { lang } = await params;
  const c = contentFor("calivo", lang);
  if (!c || lang === "en") notFound();
  return <LocalizedAppLanding app={{ ...calivoApp, posts: [] }} lang={lang as LangCode} c={c} />;
}
