import type { Metadata } from "next";
import AppLanding, { appMetadata } from "@/components/AppLanding";
import { getAivexaApp } from "@/lib/aivexa-apps";

const app = getAivexaApp("tentsaathi")!;
export const metadata: Metadata = appMetadata(app);

export default function Page() {
  return <AppLanding app={app} />;
}
