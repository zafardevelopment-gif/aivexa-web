/**
 * Per-tool SEO content overrides. Keyed by "category/slug".
 * When present, ToolSeoContent renders these unique intro paragraphs and
 * tool-specific FAQs (merged before the generic ones) instead of only the
 * auto-generated copy — giving each page unique, keyword-rich indexable text.
 */

export type ToolSeoOverride = {
  intro: string[]; // plain-text paragraphs
  faqs: { q: string; a: string }[];
};

export const toolSeoOverrides: Record<string, ToolSeoOverride> = {
  "misc/youtube-tag-generator": {
    intro: [
      "The YouTube Tag Generator helps creators find SEO-optimized tags for their videos in seconds. Instead of guessing keywords, it pulls suggestions from real YouTube search data — the same phrases people actually type into the YouTube search bar — so your tags reflect genuine search demand in your region.",
      "Enter your video topic, pick a country (India, US, UK and more), and get up to 45 relevant tags. Click any tag to include or exclude it, watch the live 500-character counter (YouTube's tag limit), and copy everything in one click — ready to paste into YouTube Studio.",
    ],
    faqs: [
      {
        q: "How many tags should a YouTube video have?",
        a: "YouTube allows up to 500 characters of tags. Most SEO experts recommend 15–30 focused tags: your main keyword first, followed by close variations and related phrases. Quality and relevance matter more than quantity.",
      },
      {
        q: "Do YouTube tags still matter for ranking in 2026?",
        a: "Tags are a minor ranking factor compared to title, description and watch time, but they still help YouTube understand your content, correct for common misspellings, and surface your video in Suggested. They cost nothing to add, so it's worth filling them properly.",
      },
      {
        q: "Where do the generated tags come from?",
        a: "Tags are built from live YouTube search autocomplete suggestions for your keyword and its variations (how-to, best, tutorial, beginner etc.), so they reflect what viewers are actually searching for right now.",
      },
    ],
  },

  "daily/hra-calculator": {
    intro: [
      "The HRA Calculator computes your House Rent Allowance exemption under Section 10(13A) of the Income Tax Act. HRA exemption is the least of three amounts: actual HRA received, rent paid minus 10% of basic salary (plus DA), and 50% of basic for metro cities or 40% for non-metro cities.",
      "Enter your basic salary, HRA received and monthly rent to instantly see how much of your HRA is tax-exempt and how much is taxable. Salaried employees claiming HRA also need rent receipts as proof — you can generate those free with our Rent Receipt Generator.",
    ],
    faqs: [
      {
        q: "Can I claim HRA in the new tax regime?",
        a: "No. HRA exemption under Section 10(13A) is available only in the old tax regime. If you opt for the new regime, HRA received is fully taxable — compare both regimes before choosing.",
      },
      {
        q: "Which cities count as metro for HRA?",
        a: "Only Delhi, Mumbai, Kolkata and Chennai are treated as metro cities (50% of basic). All other cities, including Bengaluru, Hyderabad and Pune, use the 40% limit.",
      },
      {
        q: "Do I need my landlord's PAN to claim HRA?",
        a: "Yes, if your annual rent exceeds ₹1,00,000 you must provide your landlord's PAN to your employer. Rent receipts are typically required as proof for any HRA claim.",
      },
    ],
  },

  "daily/salary-structure-optimizer": {
    intro: [
      "The Salary Structure Optimizer converts your annual CTC into a complete salary breakup — Basic, HRA, special allowance, employer PF contribution and gratuity provision — and then estimates your income tax under both the old and new regimes for FY 2025-26, so you can see which regime leaves more money in hand.",
      "Adjust the Basic-salary percentage to see how it affects HRA (and therefore tax under the old regime), and get an approximate monthly in-hand figure after tax and PF. Useful when evaluating a job offer, negotiating CTC or planning your tax declaration.",
    ],
    faqs: [
      {
        q: "Old vs new tax regime — which is better?",
        a: "It depends on your deductions. The new regime has lower slab rates and a ₹75,000 standard deduction with rebate up to ₹12 lakh income, but no HRA/80C benefits. If your combined deductions (HRA, 80C, 80D, home-loan interest) are large, the old regime can still win. This tool compares both instantly.",
      },
      {
        q: "What percentage of CTC should Basic salary be?",
        a: "Most Indian companies keep Basic at 40–50% of CTC. A higher Basic increases HRA, PF and gratuity but reduces flexible allowances; a lower Basic does the opposite. You can adjust the percentage in this tool to see the effect.",
      },
      {
        q: "Why is my in-hand salary less than CTC ÷ 12?",
        a: "CTC includes employer-side costs (employer PF, gratuity provision, sometimes insurance) that never reach your bank account, plus income tax and employee PF are deducted from gross pay. This tool shows the approximate real monthly in-hand.",
      },
    ],
  },

  "misc/rental-roi-calculator": {
    intro: [
      "The Rental ROI Calculator tells you whether a property is a good rental investment. It computes gross rental yield (annual rent ÷ total cost), net yield after maintenance, property tax and vacancy periods, total ROI including expected appreciation, and the payback period from rent alone.",
      "In India, residential properties typically earn a net yield of 2–4%, while commercial properties earn 6–9%. Comparing a property's net yield against these benchmarks — and against FD or index-fund returns — helps you make an informed buy/skip decision.",
    ],
    faqs: [
      {
        q: "What is a good rental yield in India?",
        a: "Residential yields of 3%+ (net) are considered decent in most Indian cities; commercial yields of 6–9% are typical. Yields vary widely by city and locality — Bengaluru and Hyderabad often out-yield Mumbai and Delhi on residential.",
      },
      {
        q: "What is the difference between gross and net rental yield?",
        a: "Gross yield is annual rent divided by property cost. Net yield subtracts real costs first — maintenance, property tax, vacancy months, repairs — giving a much more honest picture of your return.",
      },
      {
        q: "Should I include registration and interior costs?",
        a: "Yes. Stamp duty, registration, brokerage and interiors can add 8–15% to the purchase price. Ignoring them overstates your yield, which is why this calculator has a separate field for them.",
      },
    ],
  },

  "misc/society-maintenance-calculator": {
    intro: [
      "The Society Maintenance Split Calculator divides a housing society's monthly expenses across all flats using the two methods Indian societies commonly follow: equal division per flat, or per-square-foot division based on carpet/built-up area (larger flats pay proportionally more).",
      "Enter the total monthly expense, choose the split method, and — for area-based splits — add your flat types (1 BHK, 2 BHK, 3 BHK with their areas and counts). You get the per-sq.ft rate and each flat type's monthly share, with a copyable summary for your society WhatsApp group or notice board.",
    ],
    faqs: [
      {
        q: "Should society maintenance be split equally or by area?",
        a: "Model bye-laws in most states suggest service charges (security, housekeeping, common electricity) be split equally, while sinking fund and repair charges be levied per square foot. Many societies simplify to one method — your general body can decide, and this tool supports both.",
      },
      {
        q: "Is GST applicable on society maintenance?",
        a: "GST at 18% applies only if maintenance exceeds ₹7,500 per member per month AND the society's annual turnover exceeds ₹20 lakh. Below either threshold, no GST is charged.",
      },
    ],
  },

  "misc/pan-aadhaar-name-matcher": {
    intro: [
      "The PAN-Aadhaar Name Matcher checks whether the name printed on your PAN card matches the name on your Aadhaar (or any two documents). It gives a similarity score and detects common mismatch patterns — spelling variations, transliteration differences (Md/Mohd/Mohammed), swapped first/last names and initials versus full names — along with advice on which document to correct.",
      "Name mismatches are the most common reason PAN-Aadhaar linking, e-KYC, bank account opening and income-tax e-filing fail. Everything runs entirely in your browser: the names you type are never sent to any server.",
    ],
    faqs: [
      {
        q: "PAN-Aadhaar name mismatch — which document should I correct?",
        a: "Usually correct the document with the error. Aadhaar name/details can be updated online via the UIDAI SSUP portal or at an Aadhaar Seva Kendra; PAN corrections are filed through Protean (NSDL) or UTIITSL with a small fee.",
      },
      {
        q: "Will a small spelling difference block PAN-Aadhaar linking?",
        a: "Minor mismatches are often accepted after OTP-based Aadhaar authentication, but larger differences (different surname, reordered names) typically fail. A score above ~80% on this tool usually indicates a minor variation.",
      },
      {
        q: "Is it safe to enter my name here?",
        a: "Yes. The comparison runs completely in your browser using JavaScript — no name, document number or personal data is uploaded or stored anywhere.",
      },
    ],
  },

  "misc/certificate-qr-generator": {
    intro: [
      "The Certificate Verification QR Generator creates a QR code you can print on certificates so anyone can verify them instantly with a phone camera. Encode either the certificate details directly (institute, recipient, course, certificate number, issue date) or a verification URL that points to your institute's records page.",
      "Coaching institutes, training academies, colleges and event organisers use verification QRs to prevent certificate forgery and make credential checks effortless for employers. Download the QR as a PNG and place it on your certificate design — pairs perfectly with our free Certificate Maker.",
    ],
    faqs: [
      {
        q: "How does a QR code prevent fake certificates?",
        a: "If the QR encodes a verification URL on your institute's own domain, a forger can't fake the page it points to. Scanning instantly shows whether the certificate number exists in your records — far harder to forge than a printed seal.",
      },
      {
        q: "Should I encode details or a URL in the QR?",
        a: "A verification URL is stronger (it can be checked against your live records), but encoding the details directly works offline and needs no website. Many institutes print both the details QR and a certificate number.",
      },
    ],
  },
};

export function getToolSeoOverride(category: string, slug: string) {
  return toolSeoOverrides[`${category}/${slug}`];
}
