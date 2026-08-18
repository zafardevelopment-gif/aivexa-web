import type { Metadata } from "next";
import ToolSearch from "@/components/tools/ToolSearch";
import ToolsGrid from "@/components/tools/ToolsGrid";

export const metadata: Metadata = {
  title: "110+ Free Online Tools — PDF, Image, JSON, Calculators & More — AIVEXA",
  description:
    "110+ free browser-based PDF, image, JSON, Islamic, daily-use, finance and document tools by AIVEXA. No signup, no file uploads — everything runs in your browser.",
  keywords: [
    "free online tools",
    "free PDF tools",
    "free image tools",
    "free calculators",
    "JSON converter",
    "Islamic tools online",
    "AIVEXA tools",
  ],
  alternates: { canonical: "/tools" },
  openGraph: {
    title: "110+ Free Online Tools — AIVEXA",
    description:
      "Free browser-based PDF, image, JSON, Islamic, daily-use, finance and document tools by AIVEXA.",
    type: "website",
    url: "/tools",
    siteName: "AIVEXA",
    images: [{ url: "/aivexa-logo.png", width: 512, height: 512, alt: "AIVEXA" }],
  },
  twitter: {
    card: "summary",
    title: "110+ Free Online Tools — AIVEXA",
    description:
      "Free browser-based PDF, image, JSON, finance calculators and Islamic tools — no signup.",
  },
};

export default function ToolsHubPage() {
  return (
    <main>
      <section className="page-hero" style={{ paddingBottom: "2rem" }}>
        <div className="container">
          <span className="section-label">FREE TOOLS</span>
          <h1 className="section-title tools-hero-title">
            Free tools, built by <span className="accent-lg">AIVEXA</span>
          </h1>
          <p className="section-desc" style={{ margin: "0 auto" }}>
            Fast, private, browser-based utilities — your files never leave your device. No signup required.
          </p>
          <ToolSearch />
        </div>
      </section>

      <section style={{ padding: "0 2rem 6rem" }}>
        <div className="container">
          <ToolsGrid />
        </div>
      </section>
    </main>
  );
}
