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
    <main>
      <section className="page-hero">
        <div className="container">
          <div className="section-label" style={{ justifyContent: "center" }}>
            Legal
          </div>
          <h1 className="section-title">Terms of Service</h1>
          <p className="legal-update">Last updated: August 27, 2026</p>
          <div className="breadcrumb">
            <Link href="/">Home</Link>
            <span>›</span>
            <span>Terms of Service</span>
          </div>
        </div>
      </section>

      <section className="legal-page-content">
        <h3>1. Acceptance of Terms</h3>
        <p>
          By accessing or using any product or service offered by AIVEXA
          (&ldquo;we&rdquo;, &ldquo;us&rdquo;, or &ldquo;our&rdquo;) — including our website at{" "}
          <strong>aivexallp.com</strong>, our AI automation products (AI Munim, Clinic Voice, AI
          Hospital, AI Camp, SafeRide QR, MyRentSaathi), and our free online tools — you agree to
          be bound by these Terms of Service. If you do not agree, please do not use our services.
        </p>

        <h3>2. Description of Services</h3>
        <p>
          AIVEXA provides enterprise-grade AI automation systems delivered over WhatsApp and
          Voice, along with 89+ free online tools covering PDF processing, image editing,
          calculators, generators, and Islamic utilities. Some services are free; enterprise
          products are offered under separate commercial agreements.
        </p>

        <h3>3. Eligibility</h3>
        <p>
          You must be at least 13 years of age to use our services. By using our services, you
          represent that you meet this requirement. Users under 18 should have parental or
          guardian consent.
        </p>

        <h3>4. Acceptable Use</h3>
        <p>You agree not to:</p>
        <ul>
          <li>Use our services for any unlawful purpose or in violation of applicable laws</li>
          <li>Attempt to gain unauthorised access to our systems or data</li>
          <li>Transmit spam, malware, or any harmful content</li>
          <li>Scrape or extract data from our website without written permission</li>
          <li>Reverse-engineer, copy, or resell our proprietary AI products</li>
          <li>Use our free tools to process content that infringes third-party rights</li>
        </ul>

        <h3>5. Intellectual Property</h3>
        <p>
          All content on this website — including logos, product names, design, copy, and
          software — is the property of AIVEXA and protected under applicable intellectual
          property laws. You may not reproduce, distribute, or create derivative works without
          our express written consent.
        </p>

        <h3>6. Free Tools</h3>
        <p>
          Our free online tools are provided &ldquo;as is&rdquo; without warranty of any kind.
          Files uploaded to our tools are processed in-session and are not stored on our servers
          beyond the time needed to complete your request. We do not access, retain, or share
          the content of files you upload.
        </p>

        <h3>7. Limitation of Liability</h3>
        <p>
          To the maximum extent permitted by applicable law, AIVEXA shall not be liable for any
          indirect, incidental, special, or consequential damages arising out of your use of —
          or inability to use — our services, even if we have been advised of the possibility of
          such damages. Our total liability to you for any claim shall not exceed the amount paid
          by you, if any, for the specific service in the preceding three months.
        </p>

        <h3>8. Disclaimers</h3>
        <p>
          Our services are provided on an &ldquo;as is&rdquo; and &ldquo;as available&rdquo;
          basis. We make no warranties, express or implied, regarding accuracy, reliability, or
          fitness for a particular purpose. We do not guarantee uninterrupted or error-free
          operation of any service.
        </p>

        <h3>9. Third-Party Links</h3>
        <p>
          Our website may contain links to third-party websites. These links are provided for
          convenience only. AIVEXA has no control over the content or practices of third-party
          sites and accepts no responsibility for them.
        </p>

        <h3>10. Privacy</h3>
        <p>
          Your use of our services is also governed by our{" "}
          <Link href="/privacy-policy">Privacy Policy</Link>, which is incorporated into these
          Terms by reference.
        </p>

        <h3>11. Changes to Terms</h3>
        <p>
          We may update these Terms from time to time. We will indicate the date of the latest
          revision at the top of this page. Continued use of our services after any changes
          constitutes your acceptance of the revised Terms.
        </p>

        <h3>12. Governing Law</h3>
        <p>
          These Terms are governed by the laws of India. Any disputes arising out of or related
          to these Terms shall be subject to the exclusive jurisdiction of the courts in India.
        </p>

        <h3>13. Contact Us</h3>
        <p>
          If you have any questions about these Terms, please contact us at{" "}
          <a href="mailto:aivexallp@gmail.com">aivexallp@gmail.com</a>.
        </p>
      </section>
    </main>
  );
}
