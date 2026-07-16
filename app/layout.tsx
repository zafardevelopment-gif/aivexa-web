import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import Analytics from "@/components/Analytics";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const SITE_URL = "https://www.aivexallp.com";
const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "AIVEXA LLP — AI. Vision. Automation. Excellence.",
    template: "%s | AIVEXA",
  },
  description:
    "AIVEXA builds enterprise-grade AI systems that answer calls, manage accounts and schedule appointments — on WhatsApp and Voice, in your language. Also home to 89+ free online tools: PDF, image, calculators, generators and Islamic tools.",
  keywords: [
    "AIVEXA",
    "AI Munim",
    "Clinic Voice",
    "WhatsApp Automation",
    "AI Voice Agent",
    "AI Hospital",
    "AI Camp",
    "SafeRide QR",
    "Healthcare AI",
    "free online tools",
    "free PDF tools",
    "free image tools",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AIVEXA LLP — AI. Vision. Automation. Excellence.",
    description:
      "Enterprise-grade AI automation for clinics, hospitals and businesses — delivered on WhatsApp and Voice. Plus 89+ free online tools.",
    type: "website",
    url: SITE_URL,
    siteName: "AIVEXA",
    locale: "en_IN",
    images: [{ url: "/aivexa-logo.png", width: 512, height: 512, alt: "AIVEXA" }],
  },
  twitter: {
    card: "summary",
    title: "AIVEXA LLP — AI. Vision. Automation. Excellence.",
    description:
      "Enterprise-grade AI automation, plus 89+ free online tools — PDF, image, calculators, generators & Islamic tools.",
    images: ["/aivexa-logo.png"],
  },
  icons: {
    icon: "/aivexa-logo-mark.svg",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AIVEXA",
  legalName: "MD ZAFAR EQBAL (MART NEST)",
  url: SITE_URL,
  logo: `${SITE_URL}/aivexa-logo.png`,
  email: "martnest01@gmail.com",
  address: {
    "@type": "PostalAddress",
    streetAddress:
      "2nd Floor, Gehumi Shivdhara Road, Light Pink Building, Front of Dr. Abu Zafar Clinic",
    addressLocality: "Darbhanga",
    addressRegion: "Bihar",
    postalCode: "846004",
    addressCountry: "IN",
  },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "AIVEXA",
  url: SITE_URL,
  potentialAction: {
    "@type": "SearchAction",
    target: `${SITE_URL}/tools?q={search_term_string}`,
    "query-input": "required name=search_term_string",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.variable}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        {ADSENSE_CLIENT_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${ADSENSE_CLIENT_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <Analytics />
        {children}
      </body>
    </html>
  );
}
