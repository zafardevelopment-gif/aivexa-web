import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  title: "AIVEXA — AI Solutions for Healthcare & Business",
  description:
    "AIVEXA builds enterprise-grade AI systems that answer calls, manage accounts and schedule appointments — on WhatsApp and Voice, in your language.",
  keywords: [
    "AIVEXA",
    "AI Munim",
    "Clinic Voice",
    "WhatsApp Automation",
    "AI Voice Agent",
    "AI Hospital",
    "AI Camp",
    "Healthcare AI",
  ],
  openGraph: {
    title: "AIVEXA — AI Solutions for Healthcare & Business",
    description:
      "Enterprise-grade AI automation for clinics, hospitals and businesses — delivered on WhatsApp and Voice.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={inter.variable}>{children}</body>
    </html>
  );
}
