import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "Terms and conditions for using AIVEXA products and services — AI automation, free online tools, and more.",
  alternates: { canonical: "/terms-of-service" },
};

export default function TermsOfServicePage() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-16">
      <nav className="text-sm text-gray-500 mb-6">
        <Link href="/" className="hover:underline">
          Home
        </Link>{" "}
        › Terms of Service
      </nav>

      <h1 className="text-3xl font-bold mb-2">Terms of Service</h1>
      <p className="text-sm text-gray-500 mb-10">Last updated: August 27, 2026</p>

      <div className="prose prose-gray max-w-none space-y-8">
        <section>
          <h2 className="text-xl font-semibold mb-3">1. Acceptance of Terms</h2>
          <p>
            By accessing or using any product or service offered by AIVEXA
            (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) — including our website at{" "}
            <strong>aivexallp.com</strong>, our AI automation products (AI Munim, Clinic Voice, AI
            Hospital, AI Camp, SafeRide QR, MyRentSaathi), and our free online tools — you agree to
            be bound by these Terms of Service. If you do not agree, please do not use our services.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">2. Description of Services</h2>
          <p>
            AIVEXA provides enterprise-grade AI automation systems delivered over WhatsApp and
            Voice, along with 89+ free online tools covering PDF processing, image editing,
            calculators, generators, and Islamic utilities. Some services are free; enterprise
            products are offered under separate commercial agreements.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">3. Eligibility</h2>
          <p>
            You must be at least 13 years of age to use our services. By using our services, you
            represent that you meet this requirement. Users under 18 should have parental or
            guardian consent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">4. Acceptable Use</h2>
          <p>You agree not to:</p>
          <ul className="list-disc pl-6 space-y-1 mt-2">
            <li>Use our services for any unlawful purpose or in violation of applicable laws</li>
            <li>Attempt to gain unauthorised access to our systems or data</li>
            <li>Transmit spam, malware, or any harmful content</li>
            <li>Scrape or extract data from our website without written permission</li>
            <li>Reverse-engineer, copy, or resell our proprietary AI products</li>
            <li>Use our free tools to process content that infringes third-party rights</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">5. Intellectual Property</h2>
          <p>
            All content on this website — including logos, product names, design, copy, and
            software — is the property of AIVEXA and protected under applicable intellectual
            property laws. You may not reproduce, distribute, or create derivative works without
            our express written consent.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">6. Free Tools</h2>
          <p>
            Our free online tools are provided &ldquo;as is&rdquo; without warranty of any kind.
            Files uploaded to our tools are processed in-session and are not stored on our servers
            beyond the time needed to complete your request. We do not access, retain, or share
            the content of files you upload.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">7. Limitation of Liability</h2>
          <p>
            To the maximum extent permitted by applicable law, AIVEXA shall not be liable for any
            indirect, incidental, special, or consequential damages arising out of your use of —
            or inability to use — our services, even if we have been advised of the possibility of
            such damages. Our total liability to you for any claim shall not exceed the amount paid
            by you, if any, for the specific service in the preceding three months.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">8. Disclaimers</h2>
          <p>
            Our services are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo;
            basis. We make no warranties, express or implied, regarding accuracy, reliability, or
            fitness for a particular purpose. We do not guarantee uninterrupted or error-free
            operation of any service.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">9. Third-Party Links</h2>
          <p>
            Our website may contain links to third-party websites. These links are provided for
            convenience only. AIVEXA has no control over the content or practices of third-party
            sites and accepts no responsibility for them.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">10. Privacy</h2>
          <p>
            Your use of our services is also governed by our{" "}
            <Link href="/privacy-policy" className="text-blue-600 hover:underline">
              Privacy Policy
            </Link>
            , which is incorporated into these Terms by reference.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">11. Changes to Terms</h2>
          <p>
            We may update these Terms from time to time. We will indicate the date of the latest
            revision at the top of this page. Continued use of our services after any changes
            constitutes your acceptance of the revised Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">12. Governing Law</h2>
          <p>
            These Terms are governed by the laws of India. Any disputes arising out of or related
            to these Terms shall be subject to the exclusive jurisdiction of the courts in India.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-3">13. Contact Us</h2>
          <p>
            If you have any questions about these Terms, please contact us at{" "}
            <a href="mailto:aivexallp@gmail.com" className="text-blue-600 hover:underline">
              aivexallp@gmail.com
            </a>
            .
          </p>
        </section>
      </div>
    </main>
  );
}
