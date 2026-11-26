import type { Metadata } from "next";
import "../calivo-ai/calivo.css";
import LocalizedAppLanding from "@/components/LocalizedAppLanding";
import { unscrollApp, UNSCROLL_OG, UNSCROLL_PACKAGE, contentFor, landingMetadata } from "@/lib/i18n/app-landing";

const c = contentFor("unscroll", "en")!;

export const metadata: Metadata = landingMetadata(unscrollApp, "en", c, UNSCROLL_OG, UNSCROLL_PACKAGE);

export default function UnscrollPage() {
  return <LocalizedAppLanding app={unscrollApp} lang="en" c={c} />;
}
