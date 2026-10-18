import Link from "next/link";
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/seo/config";
import { supabaseAdmin } from "@/lib/supabase-admin";

export const revalidate = 3600;

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "AIVEXA PDF API pricing in INR: Free 100 PDFs/month, Starter ₹999, Growth ₹1,999, Pro ₹3,999 per month. Yearly plans get 2 months free. No credit card needed to start.",
  alternates: { canonical: `${SITE_URL}/pdf-api/pricing` },
};

type Plan = {
  id: string; name: string; price_monthly: number; price_yearly: number;
  credits: number; max_pdf_bytes: number; rate_limit_rpm: number; features: string[];
};

const FALLBACK: Plan[] = [
  { id: "free", name: "Free", price_monthly: 0, price_yearly: 0, credits: 100, max_pdf_bytes: 2097152, rate_limit_rpm: 5, features: [] },
  { id: "starter", name: "Starter", price_monthly: 99900, price_yearly: 999000, credits: 1000, max_pdf_bytes: 5242880, rate_limit_rpm: 20, features: [] },
  { id: "growth", name: "Growth", price_monthly: 199900, price_yearly: 1999000, credits: 2000, max_pdf_bytes: 10485760, rate_limit_rpm: 50, features: [] },
  { id: "pro", name: "Pro", price_monthly: 399900, price_yearly: 3999000, credits: 5000, max_pdf_bytes: 26214400, rate_limit_rpm: 150, features: [] },
];

async function getPlans(): Promise<Plan[]> {
  const db = supabaseAdmin();
  if (!db) return FALLBACK;
  const { data } = await db
    .from("pdfapi_plans")
    .select("id, name, price_monthly, price_yearly, credits, max_pdf_bytes, rate_limit_rpm, features")
    .eq("is_active", true)
    .order("sort_order");
  return data && data.length ? (data as Plan[]) : FALLBACK;
}

const inr = (paise: number) => (paise === 0 ? "₹0" : `₹${(paise / 100).toLocaleString("en-IN")}`);
const mb = (b: number) => `${Math.round(b / 1048576)} MB`;

const FAQ = [
  { q: "Is there a free plan?", a: "Yes. Every account gets 100 PDFs per month free, forever. No credit card is needed to sign up." },
  { q: "What counts as one credit?", a: "One successful PDF or screenshot uses one credit. Failed requests and requests made with a test key do not use credits." },
  { q: "Do unused credits carry over?", a: "No. Credits reset every month on your reset date, which you can see on the Billing page of your dashboard." },
  { q: "How do I pay?", a: "Payments are made in INR through Razorpay — UPI, debit or credit card, net banking and wallets are supported. We never store your card details." },
  { q: "Will I be charged automatically every month?", a: "No. You pay once for a month or a year. There is no auto-renewal; you can renew or change plan any time from the dashboard." },
  { q: "Do I get a receipt?", a: "Yes. Every payment has a downloadable PDF receipt on the Billing page. For a GST tax invoice, email us your receipt number and GSTIN." },
  { q: "Does it support Hindi, Urdu and Arabic?", a: "Yes. The renderer includes Noto fonts for Devanagari, Arabic script (including right-to-left layout) and emoji." },
  { q: "What happens if I run out of credits?", a: "API calls return a QUOTA_EXCEEDED error until your credits reset or you upgrade. Your existing PDFs and keys are not affected." },
];

export default async function PricingPage() {
  const plans = await getPlans();

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
        <p>Start free with 100 PDFs a month. Upgrade only when you need more — pay by UPI, card or net banking. No auto-renewal.</p>
      </section>

      <section className="pr-grid">
        {plans.map((p) => {
          const pro = p.id === "pro";
          const free = p.price_monthly === 0;
          return (
            <div key={p.id} className={`pdfapi-card pr-card${pro ? " is-pro" : ""}`}>
              {pro && <div className="pr-ribbon">MOST POPULAR</div>}
              <h2>{p.name}</h2>
              <div className="pr-price">{inr(p.price_monthly)}<span>{free ? " forever" : " / month"}</span></div>
              <div className="pr-year">{free ? "No card needed" : `or ${inr(p.price_yearly)} / year (2 months free)`}</div>
              <div className="pr-credits">{p.credits.toLocaleString("en-IN")} PDFs / month</div>
              <ul>
                {(Array.isArray(p.features) ? p.features : []).map((f) => <li key={f}>✓ {f}</li>)}
              </ul>
              <Link href={free ? "/pdf-api/login?mode=signup" : "/pdf-api/dashboard/billing"}
                className={`pdfapi-btn ${pro ? "pdfapi-btn-primary" : "pdfapi-btn-secondary"}`} style={{ width: "100%", justifyContent: "center" }}>
                {free ? "Start free" : `Choose ${p.name}`}
              </Link>
            </div>
          );
        })}
      </section>

      <section className="pdfapi-card pr-compare">
        <h2>Compare plans</h2>
        <div style={{ overflowX: "auto" }}>
          <table>
            <thead><tr><th>Feature</th>{plans.map((p) => <th key={p.id}>{p.name}</th>)}</tr></thead>
            <tbody>
              <tr><td>PDFs per month</td>{plans.map((p) => <td key={p.id}>{p.credits.toLocaleString("en-IN")}</td>)}</tr>
              <tr><td>Requests per minute</td>{plans.map((p) => <td key={p.id}>{p.rate_limit_rpm}</td>)}</tr>
              <tr><td>Max PDF size</td>{plans.map((p) => <td key={p.id}>{mb(p.max_pdf_bytes)}</td>)}</tr>
              <tr><td>HTML to PDF, URL to PDF, screenshots</td>{plans.map((p) => <td key={p.id}>✓</td>)}</tr>
              <tr><td>Hindi, Urdu, Arabic fonts</td>{plans.map((p) => <td key={p.id}>✓</td>)}</tr>
              <tr><td>Test keys + Playground</td>{plans.map((p) => <td key={p.id}>✓</td>)}</tr>
              <tr><td>Price per month</td>{plans.map((p) => <td key={p.id}>{inr(p.price_monthly)}</td>)}</tr>
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

      <section className="pdfapi-card pr-cta">
        <div>
          <h2>Need more than 5,000 PDFs a month?</h2>
          <p>Custom volume, GST invoice billing and a dedicated support line.</p>
        </div>
        <a className="pdfapi-btn pdfapi-btn-primary" href="https://wa.me/919204298771?text=Hi%2C%20I%20need%20a%20custom%20AIVEXA%20PDF%20API%20plan" target="_blank" rel="noopener noreferrer">Talk to us on WhatsApp</a>
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
