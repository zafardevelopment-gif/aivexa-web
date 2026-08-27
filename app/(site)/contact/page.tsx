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
    <main className="max-w-3xl mx-auto px-6 py-16">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        › Contact
      </nav>

      <h1 className="text-3xl font-bold mb-2">Contact Us</h1>
      <p className="text-gray-600 mb-10">
        We&rsquo;d love to hear from you — whether you&rsquo;re exploring our AI products,
        need help with a free tool, or just want to say hello.
      </p>

      <div className="grid gap-10 md:grid-cols-2">
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold mb-1">Email</h2>
            <a href="mailto:aivexallp@gmail.com" className="text-blue-600 hover:underline">
              aivexallp@gmail.com
            </a>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-1">WhatsApp</h2>
            <a
              href="https://wa.me/919204298771"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              +91-9204298771
            </a>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-1">Location</h2>
            <p className="text-gray-600">India</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-1">Book a Demo</h2>
            <p className="text-gray-600 mb-2">
              Interested in AI Munim, Clinic Voice, or any other AIVEXA product?
            </p>
            <Link
              href="/#contact"
              className="inline-block bg-black text-white text-sm px-4 py-2 rounded hover:bg-gray-800 transition-colors"
            >
              Book a free demo →
            </Link>
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4">Send us a message</h2>
          <ContactForm />
        </div>
      </div>
    </main>
  );
}
