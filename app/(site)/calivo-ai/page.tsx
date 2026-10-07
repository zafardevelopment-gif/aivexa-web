import type { Metadata } from "next";
import "./calivo.css";
import LocalizedAppLanding from "@/components/LocalizedAppLanding";
import { calivoApp, CALIVO_OG, CALIVO_PACKAGE, contentFor, landingMetadata } from "@/lib/i18n/app-landing";

const c = contentFor("calivo", "en")!;

export const metadata: Metadata = landingMetadata(calivoApp, "en", c, CALIVO_OG, CALIVO_PACKAGE);

export default function CalivoAiPage() {
  return <LocalizedAppLanding app={calivoApp} lang="en" c={c} />;
}
