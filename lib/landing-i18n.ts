/**
 * Shared types + UI strings for the multi-language app landing pages
 * (/miftah/[lang], /calivo-ai/[lang]). Each language has its OWN URL so
 * Google indexes every language separately (hreflang), which is what
 * actually brings search traffic in Hindi, Urdu, Bangla, etc.
 */

export type LangCode = "en" | "hi" | "ur" | "bn" | "ml" | "ar" | "id";

export const LANG_META: Record<LangCode, { label: string; dir: "ltr" | "rtl"; hreflang: string }> = {
  en: { label: "English", dir: "ltr", hreflang: "en" },
  hi: { label: "हिन्दी", dir: "ltr", hreflang: "hi" },
  ur: { label: "اردو", dir: "rtl", hreflang: "ur" },
  bn: { label: "বাংলা", dir: "ltr", hreflang: "bn" },
  ml: { label: "മലയാളം", dir: "ltr", hreflang: "ml" },
  ar: { label: "العربية", dir: "rtl", hreflang: "ar" },
  id: { label: "Indonesia", dir: "ltr", hreflang: "id" },
};

export type Feature = { icon: string; title: string; text: string };
export type Step = { title: string; text: string };
export type Faq = { q: string; a: string };

export interface LandingContent {
  title: string; // <title>
  desc: string; // meta description
  keywords: string[];
  h1Rest: string; // after the brand name in the H1
  sub: string;
  trust: string[];
  what: string[]; // "What is X?" paragraphs (first one = oneLiner)
  featuresTitle: string;
  features: Feature[];
  steps: Step[];
  audience: string[];
  price?: string;
  faqs: Faq[];
  ctaTitle: string;
  ctaText: string;
  /** Miftah hero card (prayer countdown mock-up). */
  heroCard?: { greet: string; next: string; prayer: string; remaining: string };
}

export interface UiStrings {
  freeApp: string;
  seeFeatures: string;
  home: string;
  whatIs: string; // "What is {name}?"
  pillInside: string;
  insideTitle: string; // "See {name} in action"
  pillFeatures: string;
  pillHow: string;
  howTitle: string;
  pillMade: string;
  madeTitle: string; // "Who is {name} for?"
  pillFaq: string;
  faqTitle: string;
  pillGuides: string;
  readGuide: string;
  productOf: string; // "{name} is a product of {company}."
  privacy: string;
  support: string;
  language: string;
  getOnPlay: string;
}

export const UI: Record<LangCode, UiStrings> = {
  en: {
    freeApp: "Free Android app · by AIVEXA",
    seeFeatures: "See features ↓",
    home: "Home",
    whatIs: "What is {name}?",
    pillInside: "Inside the app",
    insideTitle: "See {name} in action",
    pillFeatures: "Features",
    pillHow: "How it works",
    howTitle: "Start in 4 simple steps",
    pillMade: "Made for",
    madeTitle: "Who is {name} for?",
    pillFaq: "FAQ",
    faqTitle: "Frequently asked questions",
    pillGuides: "Free guides",
    readGuide: "Read guide →",
    productOf: "{name} is a product of {company}.",
    privacy: "Privacy policy",
    support: "Support",
    language: "Language",
    getOnPlay: "Get it on Google Play",
  },
  hi: {
    freeApp: "मुफ़्त Android ऐप · AIVEXA द्वारा",
    seeFeatures: "फ़ीचर देखें ↓",
    home: "होम",
    whatIs: "{name} क्या है?",
    pillInside: "ऐप के अंदर",
    insideTitle: "{name} को देखें",
    pillFeatures: "फ़ीचर",
    pillHow: "कैसे काम करता है",
    howTitle: "4 आसान क़दमों में शुरू करें",
    pillMade: "किनके लिए",
    madeTitle: "{name} किसके लिए है?",
    pillFaq: "सवाल-जवाब",
    faqTitle: "अक्सर पूछे जाने वाले सवाल",
    pillGuides: "मुफ़्त गाइड",
    readGuide: "गाइड पढ़ें →",
    productOf: "{name}, {company} का प्रोडक्ट है।",
    privacy: "प्राइवेसी पॉलिसी",
    support: "सपोर्ट",
    language: "भाषा",
    getOnPlay: "Google Play पर पाएँ",
  },
  ur: {
    freeApp: "مفت اینڈرائیڈ ایپ · AIVEXA کی جانب سے",
    seeFeatures: "فیچرز دیکھیں ↓",
    home: "ہوم",
    whatIs: "{name} کیا ہے؟",
    pillInside: "ایپ کے اندر",
    insideTitle: "{name} دیکھیں",
    pillFeatures: "فیچرز",
    pillHow: "کیسے کام کرتی ہے",
    howTitle: "4 آسان مراحل میں شروع کریں",
    pillMade: "کن کے لیے",
    madeTitle: "{name} کس کے لیے ہے؟",
    pillFaq: "سوال و جواب",
    faqTitle: "اکثر پوچھے جانے والے سوالات",
    pillGuides: "مفت گائیڈ",
    readGuide: "گائیڈ پڑھیں ←",
    productOf: "{name}، {company} کی پروڈکٹ ہے۔",
    privacy: "پرائیویسی پالیسی",
    support: "سپورٹ",
    language: "زبان",
    getOnPlay: "Google Play سے حاصل کریں",
  },
  bn: {
    freeApp: "ফ্রি অ্যান্ড্রয়েড অ্যাপ · AIVEXA",
    seeFeatures: "ফিচার দেখুন ↓",
    home: "হোম",
    whatIs: "{name} কী?",
    pillInside: "অ্যাপের ভেতরে",
    insideTitle: "{name} দেখুন",
    pillFeatures: "ফিচার",
    pillHow: "কীভাবে কাজ করে",
    howTitle: "৪টি সহজ ধাপে শুরু করুন",
    pillMade: "কাদের জন্য",
    madeTitle: "{name} কাদের জন্য?",
    pillFaq: "প্রশ্নোত্তর",
    faqTitle: "সাধারণ প্রশ্ন",
    pillGuides: "ফ্রি গাইড",
    readGuide: "গাইড পড়ুন →",
    productOf: "{name} হলো {company}-এর একটি প্রোডাক্ট।",
    privacy: "প্রাইভেসি পলিসি",
    support: "সাপোর্ট",
    language: "ভাষা",
    getOnPlay: "Google Play থেকে নিন",
  },
  ml: {
    freeApp: "സൗജന്യ ആൻഡ്രോയിഡ് ആപ്പ് · AIVEXA",
    seeFeatures: "ഫീച്ചറുകൾ കാണുക ↓",
    home: "ഹോം",
    whatIs: "{name} എന്താണ്?",
    pillInside: "ആപ്പിനുള്ളിൽ",
    insideTitle: "{name} കാണുക",
    pillFeatures: "ഫീച്ചറുകൾ",
    pillHow: "എങ്ങനെ പ്രവർത്തിക്കുന്നു",
    howTitle: "4 എളുപ്പ ഘട്ടങ്ങളിൽ തുടങ്ങാം",
    pillMade: "ആർക്കുവേണ്ടി",
    madeTitle: "{name} ആർക്കുവേണ്ടി?",
    pillFaq: "ചോദ്യോത്തരം",
    faqTitle: "പതിവ് ചോദ്യങ്ങൾ",
    pillGuides: "സൗജന്യ ഗൈഡുകൾ",
    readGuide: "ഗൈഡ് വായിക്കുക →",
    productOf: "{name} {company}-യുടെ ഉൽപ്പന്നമാണ്.",
    privacy: "സ്വകാര്യതാ നയം",
    support: "സപ്പോർട്ട്",
    language: "ഭാഷ",
    getOnPlay: "Google Play-യിൽ നേടുക",
  },
  ar: {
    freeApp: "تطبيق أندرويد مجاني · من AIVEXA",
    seeFeatures: "شاهد المزايا ↓",
    home: "الرئيسية",
    whatIs: "ما هو {name}؟",
    pillInside: "داخل التطبيق",
    insideTitle: "شاهد {name}",
    pillFeatures: "المزايا",
    pillHow: "كيف يعمل",
    howTitle: "ابدأ في 4 خطوات بسيطة",
    pillMade: "لمن",
    madeTitle: "لمن {name}؟",
    pillFaq: "الأسئلة",
    faqTitle: "الأسئلة الشائعة",
    pillGuides: "أدلة مجانية",
    readGuide: "اقرأ الدليل ←",
    productOf: "{name} من منتجات {company}.",
    privacy: "سياسة الخصوصية",
    support: "الدعم",
    language: "اللغة",
    getOnPlay: "احصل عليه من Google Play",
  },
  id: {
    freeApp: "Aplikasi Android gratis · oleh AIVEXA",
    seeFeatures: "Lihat fitur ↓",
    home: "Beranda",
    whatIs: "Apa itu {name}?",
    pillInside: "Di dalam aplikasi",
    insideTitle: "Lihat {name}",
    pillFeatures: "Fitur",
    pillHow: "Cara kerja",
    howTitle: "Mulai dalam 4 langkah mudah",
    pillMade: "Untuk siapa",
    madeTitle: "Untuk siapa {name}?",
    pillFaq: "FAQ",
    faqTitle: "Pertanyaan yang sering diajukan",
    pillGuides: "Panduan gratis",
    readGuide: "Baca panduan →",
    productOf: "{name} adalah produk {company}.",
    privacy: "Kebijakan privasi",
    support: "Dukungan",
    language: "Bahasa",
    getOnPlay: "Dapatkan di Google Play",
  },
};

export function fill(s: string, vars: Record<string, string>): string {
  return s.replace(/\{(\w+)\}/g, (_, k) => vars[k] ?? "");
}
