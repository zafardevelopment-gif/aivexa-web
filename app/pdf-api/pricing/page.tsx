import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo/config";
import { getPdfPlans } from "@/lib/pdf-api/plans";
import PlanPicker from "@/components/pdf-api/PlanPicker";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "AIVEXA PDF API pricing in INR: Free 100 credits/month, Startup ₹749, Standard ₹2,099, Scale ₹3,249 per month + GST. Yearly plans get 2 months free. No credit card needed to start.",
  alternates: { canonical: `${SITE_URL}/pdf-api/pricing` },
};

const inr = (paise: number) => (paise === 0 ? "₹0" : `₹${(paise / 100).toLocaleString("en-IN")}`);
const mb = (b: number) => `${Math.round(b / 1048576)} MB`;

const FAQ = [
  { q: "Is there a free plan?", a: "Yes. Every account gets 100 PDFs per month free, forever. No credit card is needed to sign up." },
  { q: "What counts as one credit?", a: "Each started 5 MB of a generated PDF or screenshot uses one credit, so a normal invoice or certificate uses exactly one. Failed requests and test-key requests use no credits." },
  { q: "Do unused credits carry over?", a: "No. Credits reset every month on your reset date, which you can see on the Billing page of your dashboard." },
  { q: "How do I pay?", a: "Payments are made in INR through Razorpay — UPI, debit or credit card, net banking and wallets are supported. 18% GST is added at checkout. We never store your card details." },
  { q: "Will I be charged automatically every month?", a: "Only if you choose auto-renew at checkout. Auto-renew uses UPI Autopay or a card mandate, you get a notice before each debit, and you can cancel it anytime from the Billing page — your plan then stays active until the paid period ends. You can also pay once without auto-renew." },
  { q: "Do I get a GST invoice?", a: "Yes. Every payment has a downloadable GST tax invoice on the Billing page. Add your company name and GSTIN under Billing details before paying to have them on the invoice." },
  { q: "Does it support Hindi, Urdu and Arabic?", a: "Yes. The renderer includes Noto fonts for Devanagari, Arabic script (including right-to-left layout) and emoji." },
  { q: "What happens if I run out of credits?", a: "API calls return a QUOTA_EXCEEDED error until your credits reset or you upgrade. Your existing PDFs and keys are not affected." },
];

export default async function PricingPage() {
  const plans = await getPdfPlans();

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Product",
      name: "AIVEXA PDF API",
      description: "HTML to PDF and URL to PDF REST API with INR pricing.",
      brand: { "@type": "Organization", name: "AIVEXA LLP" },
      offers: plans.map((p) => ({
        "@type": "Offer",
        name: `${p.name} (monthly)`,
        price: String(p.price_monthly / 100),
        priceCurrency: "INR",
        url: `${SITE_URL}/pdf-api/pricing`,
        availability: "https://schema.org/InStock",
      })),
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
    },
  ];

  return (
    <div className="pr">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />

      <section className="pr-hero">
        <h1>Simple pricing in rupees</h1>
        <p>Start free with 100 credits a month. Upgrade only when you need more — pay by UPI, card or net banking. Prices exclude 18% GST. Pay once, or turn on auto-renew.</p>
      </section>

      <section className="pdfapi-card" style={{ padding: "28px 24px", marginBottom: 32 }}>
        <PlanPicker plans={plans} />
      </section>

      <section className="pdfapi-card pr-compare">
        <h2>Compare plans</h2>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead><tr><th>Feature</th>{plans.map((p) => <th key={p.id}>{p.name}</th>)}</tr></thead>
            <tbody>
              <tr><td>Credits per month</td>{plans.map((p) => <td key={p.id}>{p.credits.toLocaleString("en-IN")}</td>)}</tr>
              <tr><td>Parallel conversions</td>{plans.map((p) => <td key={p.id}>{p.parallel ?? 1}</td>)}</tr>
              <tr><td>Requests per minute</td>{plans.map((p) => <td key={p.id}>{p.rate_limit_rpm}</td>)}</tr>
              <tr><td>Max PDF size</td>{plans.map((p) => <td key={p.id}>{mb(p.max_pdf_bytes)}</td>)}</tr>
              <tr><td>HTML to PDF, URL to PDF, screenshots</td>{plans.map((p) => <td key={p.id}>✓</td>)}</tr>
              <tr><td>Hindi, Urdu, Arabic fonts</td>{plans.map((p) => <td key={p.id}>✓</td>)}</tr>
              <tr><td>Test keys + Playground</td>{plans.map((p) => <td key={p.id}>✓</td>)}</tr>
              <tr><td>Price per month (+ GST)</td>{plans.map((p) => <td key={p.id}>{inr(p.price_monthly)}</td>)}</tr>
            </tbody>
          </table>
        </div>
      </section>

      <section className="pr-faq">
        <h2>Frequently asked questions</h2>
        {FAQ.map((f) => (
          <details key={f.q} className="pdfapi-card">
            <summary>{f.q}</summary>
            <p>{f.a}</p>
          </details>
        ))}
      </section>

      <style>{`
        .pr { max-width: 1100px; margin: 0 auto; padding: 0 20px 80px; }
        .pr-hero { text-align: center; padding: 64px 0 40px; }
        .pr-hero h1 { font-size: clamp(28px, 5vw, 42px); margin: 0 0 12px; letter-spacing: -0.02em; }
        .pr-hero p { color: var(--pdf-muted); max-width: 620px; margin: 0 auto; font-size: 16px; line-height: 1.6; }
        .pr-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-bottom: 32px; }
        .pr-card { position: relative; display: flex; flex-direction: column; }
        .pr-card.is-pro { border-color: var(--pdf-accent); background: rgba(99,102,241,0.06); }
        .pr-card h2 { font-size: 17px; margin: 0 0 8px; }
        .pr-price { font-size: 32px; font-weight: 800; letter-spacing: -0.02em; }
        .pr-price span { font-size: 13px; font-weight: 400; color: var(--pdf-muted); }
        .pr-year { font-size: 12px; color: var(--pdf-muted); margin: 4px 0 14px; }
        .pr-credits { font-weight: 600; margin-bottom: 12px; }
        .pr-card ul { list-style: none; padding: 0; margin: 0 0 18px; display: flex; flex-direction: column; gap: 7px; font-size: 13px; color: var(--pdf-muted); flex: 1; }
        .pr-ribbon { position: absolute; top: -1px; right: 16px; background: var(--pdf-accent); color: #fff; font-size: 10px; font-weight: 700; letter-spacing: .08em; padding: 3px 10px; border-radius: 0 0 8px 8px; }
        .pr-compare { margin-bottom: 32px; }
        .pr-compare h2, .pr-faq h2 { font-size: 20px; margin: 0 0 16px; }
        .pr-compare table { width: 100%; border-collapse: collapse; font-size: 14px; min-width: 560px; }
        .pr-compare th, .pr-compare td { text-align: left; padding: 10px 12px; border-bottom: 1px solid var(--pdf-border); }
        .pr-compare th { color: var(--pdf-muted); font-weight: 500; font-size: 13px; }
        .pr-faq { margin-bottom: 32px; display: flex; flex-direction: column; gap: 10px; }
        .pr-faq details { padding: 14px 18px; }
        .pr-faq summary { cursor: pointer; font-weight: 600; font-size: 15px; }
        .pr-faq p { color: var(--pdf-muted); margin: 10px 0 0; line-height: 1.6; font-size: 14px; }
        .pr-cta { display: flex; justify-content: space-between; align-items: center; gap: 16px; flex-wrap: wrap; }
        .pr-cta h2 { font-size: 18px; margin: 0 0 4px; }
        .pr-cta p { margin: 0; color: var(--pdf-muted); font-size: 14px; }
      `}</style>
    </div>
  );
}
