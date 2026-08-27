import type { Metadata } from "next";
import Link from "next/link";
import ContactForm from "@/components/ContactForm";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with AIVEXA — for enterprise AI demos, partnership enquiries, or support with our free online tools.",
  alternates: { canonical: "/contact" },
};

export default function ContactPage() {
  return (
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="section-label" style={{ justifyContent: "center" }}>
            Get in Touch
          </div>
          <h1 className="section-title">Contact Us</h1>
          <p className="section-subtitle">
            We&rsquo;d love to hear from you — whether you&rsquo;re exploring our AI products,
            need help with a free tool, or just want to say hello.
          </p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>›</span>
            <span>Contact</span>
          </div>
        </div>
      </section>

      <section className="legal-page-content">
        <div style={{ display: "grid", gap: "3rem", gridTemplateColumns: "1fr 1fr" }}>
          <div>
            <h3>Email</h3>
            <p>
              <a href="mailto:aivexallp@gmail.com">aivexallp@gmail.com</a>
            </p>

            <h3>WhatsApp</h3>
            <p>
              <a href="https://wa.me/919204298771" target="_blank" rel="noopener noreferrer">
                +91-9204298771
              </a>
            </p>

            <h3>Location</h3>
            <p>India</p>

            <h3>Book a Demo</h3>
            <p>Interested in AI Munim, Clinic Voice, or any other AIVEXA product?</p>
            <Link href="/#contact" className="btn btn-primary" style={{ display: "inline-block", marginTop: "0.5rem" }}>
              Book a free demo →
            </Link>
          </div>

          <div>
            <h3>Send us a message</h3>
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}
