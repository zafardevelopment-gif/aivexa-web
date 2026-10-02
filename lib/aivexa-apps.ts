/**
 * AIVEXA's own SaaS products that live on their own domains. Each gets a rich
 * landing page on aivexallp.com (/myrentsaathi, /testsaathi, /tentsaathi) that
 * explains it, links to it, and feeds /llms.txt + the sitemap.
 *
 * Every claim here must match the live product. Don't add stats, prices or
 * testimonials that the product site can't back up — AI assistants quote this.
 */

export type AppFeature = { icon: string; title: string; text: string };
export type AppFaq = { q: string; a: string };

export interface AivexaApp {
  slug: string;
  name: string;
  /** Brand colours for the landing page. */
  color: string;
  colorDark: string;
  colorLight: string;
  icon: string | null; // /public path, or null → emoji
  emoji: string;
  url: string; // live product URL (no tracking)
  ctaLabel: string;
  category: string; // schema.org applicationCategory
  platform: string;
  seoTitle: string;
  seoDescription: string;
  keywords: string[];
  badge: string;
  h1: string;
  h1Accent: string;
  sub: string;
  trust: string[];
  oneLiner: string;
  whyText: string;
  features: AppFeature[];
  steps: { title: string; text: string }[];
  audience: string[];
  pricingNote: string;
  faqs: AppFaq[];
}

export const appUrl = (app: AivexaApp, source: string) => {
  const u = new URL(app.url);
  u.searchParams.set("utm_source", "aivexallp.com");
  u.searchParams.set("utm_medium", source);
  u.searchParams.set("utm_campaign", app.slug);
  return u.toString();
};

export const aivexaApps: AivexaApp[] = [
  {
    slug: "myrentsaathi",
    name: "MyRentSaathi",
    color: "#d97706",
    colorDark: "#92400e",
    colorLight: "#fffbeb",
    icon: null,
    emoji: "🏠",
    url: "https://www.myrentsaathi.com/",
    ctaLabel: "Start free trial on MyRentSaathi",
    category: "BusinessApplication",
    platform: "Web, WhatsApp",
    seoTitle: "MyRentSaathi — Rent Collection & Society Management App on WhatsApp (India)",
    seoDescription:
      "MyRentSaathi helps landlords and housing societies in India collect rent and maintenance on WhatsApp with UPI links (0% commission), track complaints, notices, polls and AI rental agreements.",
    keywords: [
      "MyRentSaathi", "rent collection app India", "society management software", "housing society app",
      "RWA management app", "WhatsApp rent reminder", "maintenance collection app", "rental agreement online",
      "landlord app India", "tenant management software",
    ],
    badge: "Rent & society management · by AIVEXA",
    h1: "MyRentSaathi —",
    h1Accent: "rent & society management on WhatsApp",
    sub: "Automatic WhatsApp rent and maintenance reminders with UPI payment links, instant receipts, complaint tickets, notices, polls and AI rental agreements — for landlords, societies and tenants across India.",
    trust: ["0% commission on UPI", "Tenants need no app", "Free trial"],
    oneLiner:
      "MyRentSaathi is a rent and housing-society management platform by AIVEXA LLP for India. Landlords and society committees send automatic WhatsApp reminders with UPI payment links, collect rent and maintenance at 0% commission, issue receipts, track complaints, publish notices, run polls and generate rental agreements — tenants use it from WhatsApp without installing an app.",
    whyText:
      "Rent and maintenance in India still run on WhatsApp groups, cash and Excel. MyRentSaathi keeps WhatsApp — the app everyone already uses — and adds what's missing: payment links, automatic reminders and receipts, a proper complaint ticket system and one dashboard with every rupee.",
    features: [
      { icon: "💰", title: "Rent collection on WhatsApp", text: "Automatic monthly reminders with a UPI payment link and instant receipts. 0% commission on UPI — the money goes to your account." },
      { icon: "🏢", title: "Society maintenance", text: "Auto-generate monthly maintenance for every flat, collect online and see defaulters at a glance." },
      { icon: "📄", title: "AI rental agreements", text: "Generate a rental agreement draft from city templates in minutes, with optional lawyer review and registration support." },
      { icon: "🎫", title: "Complaint tickets", text: "Plumbing, lift, parking — residents raise a ticket, track it and get updates on WhatsApp; unresolved tickets escalate." },
      { icon: "📢", title: "Notices & polls", text: "Publish official notices with one-tap WhatsApp broadcast and run online polls and votes with transparent results." },
      { icon: "🅿️", title: "Parking & visitors", text: "Digital parking slots and vehicle mapping, visitor management and staff management for societies." },
      { icon: "📋", title: "Expenses & reports", text: "Upload bill photos, approve expenses and download income, expense and tax-ready reports as PDF." },
      { icon: "🔒", title: "Document vault", text: "Agreements, KYC, society rules and minutes stored securely with role-based access." },
    ],
    steps: [
      { title: "Sign up", text: "Register as a landlord or society admin and add your bank/UPI details." },
      { title: "Add flats & tenants", text: "Add flats, landlords and tenants — tenants get their login on WhatsApp automatically." },
      { title: "It runs by itself", text: "Monthly reminders, payment links, receipts and complaint updates go out on WhatsApp." },
      { title: "Track everything", text: "One dashboard shows collected, pending, expenses and reports." },
    ],
    audience: [
      "Landlords with one or many rented flats",
      "Housing society / RWA committees and secretaries",
      "Treasurers who want clean expense records",
      "Tenants who want to pay rent by UPI and get receipts",
      "Property managers handling multiple buildings",
      "Societies tired of notices getting lost in WhatsApp groups",
    ],
    pricingNote: "Free trial, no credit card. Society plans are priced per landlord/flat per month — see current pricing on myrentsaathi.com.",
    faqs: [
      { q: "What is MyRentSaathi?", a: "MyRentSaathi is a rent collection and housing-society management platform for India by AIVEXA LLP. It automates WhatsApp rent and maintenance reminders with UPI links, receipts, complaints, notices, polls and rental agreements." },
      { q: "Do tenants need to install an app?", a: "No. Tenants get reminders, payment links and receipts on WhatsApp and can pay by UPI directly." },
      { q: "Does MyRentSaathi take a commission on rent?", a: "No — UPI rent and maintenance payments have 0% commission and go to the landlord's or society's account." },
      { q: "Can it make a rental agreement?", a: "Yes. It generates a rental agreement draft from city templates; lawyer review and registration support are available as paid add-ons." },
      { q: "Is it for housing societies or landlords?", a: "Both — there are separate setups for society/RWA committees and for individual landlords, plus a tenant view." },
      { q: "Which cities does it work in?", a: "It works anywhere in India; the site lists support across 25+ major cities." },
      { q: "Is there a free trial?", a: "Yes, you can start a free trial without a credit card. Current plan prices are on myrentsaathi.com." },
      { q: "Who makes MyRentSaathi?", a: "MyRentSaathi is built by AIVEXA LLP, an Indian AI product studio based in Darbhanga, Bihar." },
    ],
  },
  {
    slug: "testsaathi",
    name: "TestSaathi",
    color: "#f59e0b",
    colorDark: "#b45309",
    colorLight: "#fffbeb",
    icon: "/apps/testsaathi-icon.png",
    emoji: "🎓",
    url: "https://www.testsaathi.com/",
    ctaLabel: "Start free on TestSaathi",
    category: "EducationalApplication",
    platform: "Web (installable app)",
    seoTitle: "TestSaathi — CBSE Class 10 & 12 Question Bank, PYQs, Mock Tests & AI Tutor",
    seoDescription:
      "TestSaathi is a CBSE board exam practice app for Class 10 and Class 12: chapter-wise MCQs, real previous-year papers, timed mock tests and an AI doubt solver. Free 7-day trial.",
    keywords: [
      "TestSaathi", "CBSE Class 10 mock test", "CBSE Class 12 previous year papers", "Class 10 MCQ practice",
      "Class 12 Physics MCQ", "CBSE question bank", "board exam preparation app", "AI doubt solver",
      "chapter wise MCQ", "CBSE PYQ",
    ],
    badge: "CBSE board prep · by AIVEXA",
    h1: "TestSaathi —",
    h1Accent: "CBSE Class 10 & 12 practice, PYQs & mock tests",
    sub: "Chapter-wise practice questions with instant solutions, real previous-year board papers, timed mock exams and a 24×7 AI tutor — for Class 10 (Maths, Science, SST) and Class 12 (Physics, Chemistry, Maths, Biology).",
    trust: ["30,000+ questions", "Class 10 & Class 12", "7-day free trial"],
    oneLiner:
      "TestSaathi is a CBSE board exam preparation platform by AIVEXA LLP for Class 10 (Maths, Science, Social Science) and Class 12 (Physics, Chemistry, Maths, Biology). It offers chapter-wise and difficulty-wise MCQ practice with instant step-by-step solutions, real previous-year question papers, custom timed mock exams and an AI doubt solver, plus teacher and parent accounts.",
    whyText:
      "Board preparation fails when practice is random. TestSaathi organises everything chapter-wise, never repeats a question you have already solved, shows a step-by-step solution after every answer, and lets you sit a timed board-style exam whenever you feel ready.",
    features: [
      { icon: "📚", title: "Chapter-wise question bank", text: "30,000+ questions, chapter-wise and difficulty-wise, with an instant step-by-step solution after every answer." },
      { icon: "🔁", title: "No-repeat practice", text: "Every session serves fresh questions, so revision keeps moving forward instead of looping." },
      { icon: "📄", title: "Previous-year papers", text: "Real CBSE previous-year board questions to practise, including Class 12 Physics, Chemistry, Maths and Biology papers." },
      { icon: "⏱️", title: "Timed mock exams", text: "Pick chapters, difficulty and time; take the exam with auto-submit and get chapter-wise analysis." },
      { icon: "🤖", title: "AI doubt solver", text: "Photograph a question (Scan & Solve) or chat 24×7 with an AI tutor for step-by-step explanations." },
      { icon: "📈", title: "Progress & leaderboard", text: "See strong and weak chapters, accuracy trends and where you stand." },
      { icon: "🧑‍🏫", title: "Teacher classrooms", text: "Teachers create a classroom, add students by code and track their practice." },
      { icon: "👪", title: "Parent accounts", text: "Parents link to their child's account and follow practice and results." },
    ],
    steps: [
      { title: "Create a free account", text: "Sign up with Google or email and choose Class 10 or Class 12." },
      { title: "Practise chapter-wise", text: "Start with any chapter; every answer shows the full solution." },
      { title: "Take a mock exam", text: "Build a timed board-style test and get chapter-wise analysis." },
      { title: "Fix weak chapters", text: "Use the AI tutor and PYQs to close the gaps before the boards." },
    ],
    audience: [
      "CBSE Class 10 students (Maths, Science, Social Science)",
      "CBSE Class 12 science students (Physics, Chemistry, Maths, Biology)",
      "Students who want real previous-year board questions",
      "Parents who want to see their child's practice",
      "Teachers and coaching tutors managing a class",
      "Students who learn better with instant solutions",
    ],
    pricingNote: "Free 7-day trial with 100 practice questions. One paid plan unlocks the full question bank and PYQs — see current prices on testsaathi.com.",
    faqs: [
      { q: "What is TestSaathi?", a: "TestSaathi is a CBSE board exam practice platform for Class 10 and Class 12 by AIVEXA LLP — chapter-wise MCQs with solutions, previous-year papers, timed mock tests and an AI tutor." },
      { q: "Which classes and subjects does TestSaathi cover?", a: "CBSE Class 10 Maths, Science and Social Science, and CBSE Class 12 Physics, Chemistry, Maths and Biology." },
      { q: "Is TestSaathi free?", a: "There is a free 7-day trial with 100 practice questions. A paid plan unlocks the full question bank and previous-year papers." },
      { q: "Does it have CBSE previous year question papers?", a: "Yes. TestSaathi includes real CBSE previous-year board questions, including Class 12 Physics, Chemistry, Maths and Biology papers." },
      { q: "Can I take a full mock test?", a: "Yes. You can build a custom timed mock exam by chapter and difficulty, with auto-submit and chapter-wise analysis." },
      { q: "Is there an AI doubt solver?", a: "Yes. You can photograph a question or chat with the AI tutor for step-by-step explanations." },
      { q: "Is it for ICSE or state boards?", a: "No — TestSaathi is built for the CBSE syllabus only." },
      { q: "Who makes TestSaathi?", a: "TestSaathi is built by AIVEXA LLP, an Indian AI product studio based in Darbhanga, Bihar." },
    ],
  },
  {
    slug: "tentsaathi",
    name: "TentSaathi",
    color: "#7c3aed",
    colorDark: "#5b21b6",
    colorLight: "#f5f3ff",
    icon: "/apps/tentsaathi-icon.png",
    emoji: "⛺",
    url: "https://tentsaathi.com/",
    ctaLabel: "Try TentSaathi free",
    category: "BusinessApplication",
    platform: "Web (installable app, works on phone)",
    seoTitle: "TentSaathi — Tent House & Rental Booking App (Hindi/English) | No Double Booking",
    seoDescription:
      "TentSaathi is a Hindi-English booking and accounts app for tent houses, decorators, sound/DJ, utensil, generator and other rental businesses — date-wise stock, challan, returns, dues and WhatsApp reminders.",
    keywords: [
      "TentSaathi", "tent house app", "tent house booking software", "rental business app India",
      "decorator booking app", "tent house hisab app", "किराये का हिसाब ऐप", "टेंट हाउस ऐप",
      "sound DJ rental software", "shuttering rental app",
    ],
    badge: "Rental business app · by AIVEXA",
    h1: "TentSaathi —",
    h1Accent: "tent house & rental booking app in Hindi",
    sub: "Date-wise stock so nothing is booked twice, delivery challan and counted returns, advance and dues in one ledger, WhatsApp reminders in Hindi — for tent houses, decorators, sound & DJ, utensils, generators and every rental business.",
    trust: ["हिंदी + English", "Works on any phone", "7 days free"],
    oneLiner:
      "TentSaathi is a bilingual (Hindi/English) booking and accounts app by AIVEXA LLP for tent houses, decorators, sound and DJ, utensil, generator, shuttering, cooler and costume rental businesses in India. It tracks date-wise stock so double bookings are impossible, records advances and dues, counts goods back after an event with damage charges, issues invoices and shows real profit — and lists vendors in a public directory where customers can check availability.",
    whyText:
      "Rental businesses lose money in two places: the same chairs promised to two weddings, and the balance nobody wrote down. TentSaathi makes every date know its own stock and every booking carry its own ledger — in Hindi, on the phone the owner already has.",
    features: [
      { icon: "📅", title: "Date-wise stock", text: "Every item has a quantity; goods stay blocked from dispatch until they are counted back — double booking becomes impossible." },
      { icon: "🧾", title: "Bookings & challan", text: "Enquiry and confirmed booking are separate; delivery challan goes out in one tap." },
      { icon: "🔢", title: "Counted returns", text: "Goods are counted back after the event; missing and broken items are priced on the spot at the agreed rate." },
      { icon: "💰", title: "Advance, dues & ledger", text: "Total hire, advance, later payments and breakage charges tracked separately — every balance is a real number." },
      { icon: "💬", title: "WhatsApp in Hindi", text: "Confirmation, challan and payment reminders go out on WhatsApp in Hindi." },
      { icon: "🧮", title: "GST invoices & profit", text: "Invoices with GST fields, and real profit after labour, diesel and godown rent — month-wise and item-wise." },
      { icon: "📍", title: "Public vendor directory", text: "Customers nearby can see what you have free on a date and send a booking request." },
      { icon: "📱", title: "No computer needed", text: "Runs in the phone browser and installs like an app; login with your phone number." },
    ],
    steps: [
      { title: "Write your stock once", text: "Your trade's items come ready — fill in how many you own, the daily rate and the loss price." },
      { title: "Book & deliver", text: "Pick dates; the app shows what is free. Send the challan on WhatsApp." },
      { title: "Count the return", text: "Count goods back; missing and broken items are charged automatically." },
      { title: "Accounts done", text: "Advance, balance, reminders, GST bill and profit — all written for you." },
    ],
    audience: [
      "Tent houses and pandal businesses",
      "Decorators and flower decoration services",
      "Sound, DJ and lighting rentals",
      "Utensil, crockery and bhatti/kitchen rentals",
      "Generator, cooler/AC and shuttering rentals",
      "Costume, camera and other rental shops",
    ],
    pricingNote: "First week free, no card needed. After that a season pass — see current plans on tentsaathi.com.",
    faqs: [
      { q: "What is TentSaathi?", a: "TentSaathi is a Hindi/English booking and accounts app for tent houses and other rental businesses, by AIVEXA LLP. It tracks date-wise stock, bookings, challans, returns, advances, dues and profit." },
      { q: "Does TentSaathi prevent double booking?", a: "Yes. Every date knows its own stock and goods stay blocked until they are counted back, so the app refuses a booking the godown cannot serve." },
      { q: "Is it in Hindi?", a: "Yes. The app is Hindi by default with an English switch, and WhatsApp messages go out in Hindi." },
      { q: "Do I need a computer?", a: "No. TentSaathi runs in your phone's browser and installs like an app. Login is with your phone number." },
      { q: "Which businesses can use it?", a: "Tent houses, decorators, sound & DJ, lighting, utensils & crockery, generators, kitchen/bhatti, shuttering, coolers & AC, costumes, cameras and other rentals." },
      { q: "Is there a free trial?", a: "Yes — the first week is free with no card needed; then a paid season pass. Current prices are on tentsaathi.com." },
      { q: "Is my customer data safe?", a: "Each vendor's bookings, customers, stock and accounts are visible only to that vendor." },
      { q: "Who makes TentSaathi?", a: "TentSaathi is built by AIVEXA LLP, Darbhanga, Bihar — it began with tent houses in Bihar and works anywhere in India." },
    ],
  },
];

export const getAivexaApp = (slug: string) => aivexaApps.find((a) => a.slug === slug);
