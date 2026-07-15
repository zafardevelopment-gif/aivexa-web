import Link from "next/link";
import type { Metadata } from "next";
import {
  FileText,
  Image as ImageIcon,
  Moon,
  Calculator,
  FileSignature,
  Sparkles,
} from "lucide-react";

export const metadata: Metadata = {
  title: "Free Online Tools — AIVEXA",
  description:
    "Free browser-based PDF, image, Islamic, daily-use, document and educational tools by AIVEXA. No signup, no file uploads — everything runs in your browser.",
  openGraph: {
    title: "Free Online Tools — AIVEXA",
    description:
      "Free browser-based PDF, image, Islamic, daily-use, document and educational tools by AIVEXA.",
    type: "website",
  },
};

const categories = [
  {
    slug: "pdf",
    name: "PDF Tools",
    icon: FileText,
    description: "Merge, split, compress, convert and edit PDFs — free.",
  },
  {
    slug: "image",
    name: "Image Tools",
    icon: ImageIcon,
    description: "Compress, resize, crop, convert and edit images.",
  },
  {
    slug: "islamic",
    name: "Islamic Tools",
    icon: Moon,
    description: "Zakat, prayer times, Hijri calendar, inheritance & more.",
  },
  {
    slug: "daily",
    name: "Daily Use Tools",
    icon: Calculator,
    description: "Calculators and everyday utilities for quick tasks.",
  },
  {
    slug: "generators",
    name: "Generators & Documents",
    icon: FileSignature,
    description: "CV, invoices, biodata, certificates and more — as PDF.",
  },
  {
    slug: "misc",
    name: "Misc & Educational",
    icon: Sparkles,
    description: "Fun, educational and everyday utility tools.",
  },
];

export default function ToolsHubPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <span className="section-label">FREE TOOLS</span>
          <h1 className="section-title">
            Free tools, <span className="accent">built by AIVEXA</span>
          </h1>
          <p className="section-desc" style={{ margin: "0 auto" }}>
            Fast, private, browser-based utilities — your files never leave
            your device. No signup required.
          </p>
        </div>
      </section>

      <section style={{ padding: "3rem 2rem 6rem" }}>
        <div className="container">
          <div className="tools-grid-3">
            {categories.map((cat) => (
              <Link
                key={cat.slug}
                href={`/tools/${cat.slug}`}
                className="product-card"
                style={{ textDecoration: "none", color: "inherit" }}
              >
                <div className="product-icon">
                  <cat.icon size={26} strokeWidth={2} />
                </div>
                <h3>{cat.name}</h3>
                <p>{cat.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
