/**
 * What the AIVEXA home page shows, in one place:
 *  - LIVE_PRODUCT_SLUGS: the web products that are live today (each has a
 *    full landing page at /<slug> from lib/aivexa-apps.ts and its own site).
 *  - MOBILE_APPS: Android apps on Google Play.
 *  - COMING_SOON: products still in development — shown as "Coming soon",
 *    their old /products/<slug> pages are noindex and say so.
 */

export const LIVE_PRODUCT_SLUGS = ["myrentsaathi", "testsaathi", "tentsaathi", "ai-munim"] as const;

/** One-line card summary for the home page (the landing page has the full story). */
export const LIVE_PRODUCT_CARD: Record<(typeof LIVE_PRODUCT_SLUGS)[number], { short: string; points: string[] }> = {
  myrentsaathi: {
    short: "Rent and society maintenance collection on WhatsApp with UPI links, receipts, complaints, notices and AI rental agreements.",
    points: ["WhatsApp rent reminders", "0% commission on UPI", "Complaint tickets & notices", "AI rental agreements"],
  },
  testsaathi: {
    short: "CBSE Class 10 & 12 board exam practice — chapter-wise questions with solutions, previous-year papers, mock tests and an AI tutor.",
    points: ["Chapter-wise MCQs + solutions", "Previous-year papers", "Timed mock exams", "AI doubt solver"],
  },
  tentsaathi: {
    short: "Hindi/English booking and accounts app for tent houses and rental businesses — date-wise stock, challans, returns and dues.",
    points: ["No double booking", "Challan & counted returns", "Advance & dues ledger", "WhatsApp in Hindi"],
  },
  "ai-munim": {
    short: "GST billing and invoicing for Indian businesses — invoices, stock across godowns, party ledgers, payments, POS and reports.",
    points: ["GST invoices (CGST/SGST/IGST)", "Inventory & godowns", "Parties ledger & payments", "WhatsApp invoice sharing"],
  },
};

export const MOBILE_APPS = [
  {
    slug: "calivo-ai",
    name: "CALIVO AI",
    icon: "/calivo/calivo-icon.png",
    tagline: "AI calorie counter & Indian diet coach",
    short: "Snap a photo of your thali to count calories, get an Indian diet plan and track weight, water and workouts.",
    href: "/calivo-ai",
    play: "https://play.google.com/store/apps/details?id=com.calivoai.app",
  },
  {
    slug: "miftah",
    name: "Miftah",
    icon: "/miftah/miftah-icon.png",
    tagline: "Prayer times, Quran & Namaz guide",
    short: "Namaz times with Azan and Iqamah alerts, Qibla, the Quran with word-by-word meanings and a Namaz & Wudu guide — in Hindi, Urdu and more.",
    href: "/miftah",
    play: "https://play.google.com/store/apps/details?id=com.aivexallp.miftah",
  },
] as const;

export const COMING_SOON: { slug: string; name: string; icon: string; tagline: string }[] = [
  { slug: "clinic-voice", name: "Clinic Voice", icon: "voice", tagline: "AI phone receptionist for clinics" },
  { slug: "ai-hospital", name: "AI Hospital", icon: "hospital", tagline: "WhatsApp appointment booking for hospitals" },
  { slug: "ai-camp", name: "AI Camp", icon: "camp", tagline: "WhatsApp registration for camps & events" },
  { slug: "saferide-qr", name: "SafeRide QR", icon: "shield", tagline: "Smart QR safety sticker for vehicles" },
];

export const isComingSoon = (slug: string) => COMING_SOON.some((p) => p.slug === slug);
