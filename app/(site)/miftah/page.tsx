import type { Metadata } from "next";
import "../calivo-ai/calivo.css";
import LocalizedAppLanding from "@/components/LocalizedAppLanding";
import { contentFor, landingMetadata, miftahApp, MIFTAH_OG, MIFTAH_PACKAGE } from "@/lib/i18n/app-landing";

const c = contentFor("miftah", "en")!;

export const metadata: Metadata = landingMetadata(miftahApp, "en", c, MIFTAH_OG, MIFTAH_PACKAGE);

export default function MiftahPage() {
  return <LocalizedAppLanding app={miftahApp} lang="en" c={c} />;
}
