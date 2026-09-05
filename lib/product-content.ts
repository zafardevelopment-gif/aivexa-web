/**
 * Rich, SEO/GEO/AEO-oriented content for the flagship product pages.
 *
 * The base product data (name, tagline, features) lives in the products
 * table / fallback-content. This module ADDS the long-form, question-led
 * content that lets a page (a) rank in Google, (b) be quoted by AI answer
 * engines, and (c) actually convert — a substantive intro, "who it's for",
 * how-it-works steps, outcome-led benefits and real FAQs.
 *
 * Only products with an entry here get the rich layout; others keep the
 * existing lean layout. Every claim here must stay honest — AI engines and
 * Google both penalise pages that promise things the product can't do.
 */

export interface ProductFaq {
  q: string;
  a: string;
}

export interface ProductStep {
  title: string;
  description: string;
}

export interface ProductBenefit {
  stat: string;
  label: string;
  description: string;
}

export interface ProductContent {
  /** SEO title (~55-60 chars) — reads like a search result. */
  seoTitle: string;
  /** Meta description (150-160 chars). */
  seoDescription: string;
  /** Keyword seed for this page. */
  keywords: string[];
  /** Short H1-supporting promise shown under the title. */
  heroSubhead?: string;
  /** 2-3 substantive intro paragraphs (the crawlable "what it is"). */
  intro?: string[];
  /** Who this is built for (audience clarity for both users and AI). */
  audience?: { heading: string; items: string[] };
  /** Concrete, ordered how-it-works steps. */
  steps?: ProductStep[];
  /** Outcome-led benefits (why it matters). */
  benefits?: ProductBenefit[];
  /** Free-pilot offer copy. */
  pilot?: { heading: string; body: string; bullets: string[] };
  /** Real FAQs — the questions people actually ask (AEO gold). */
  faqs?: ProductFaq[];
}

export const productContent: Record<string, ProductContent> = {
  "ai-munim": {
    seoTitle: "AI Munim — WhatsApp Accounting for Indian Shops & Traders",
    seoDescription:
      "AI Munim is a WhatsApp-based AI accounting assistant. Record sales, stock, udhaar and ledgers by voice note in Hindi. Free pilot for Indian retailers & traders.",
    keywords: [
      "WhatsApp accounting app India",
      "AI accounting assistant Hindi",
      "voice note bookkeeping",
      "hisaab kitab app for shopkeepers",
      "udhaar khata WhatsApp",
      "GST billing WhatsApp",
      "AI Munim",
    ],
    heroSubhead:
      "Record your shop's daily hisaab by sending a WhatsApp voice note — sales, purchases, stock and udhaar, in your own language.",
    intro: [
      "AI Munim is a WhatsApp-based AI accounting assistant built for Indian retailers, traders and small businesses. Instead of writing in a bahi-khata or learning complicated accounting software, you simply send a voice note or text on WhatsApp — \"Ramesh ko 5000 ka maal udhaar diya\" — and AI Munim records the sale, updates the ledger and tracks the payment for you.",
      "It works entirely inside WhatsApp, the app your team already uses every day, so there is nothing new to install and no training needed. AI Munim understands Hindi, English and Hinglish, handles sales and purchase entries, inventory, customer ledgers (udhaar khata), staff records and daily reports — all through simple conversation.",
      "For a shopkeeper or trader who loses hours every week on manual hisaab and often forgets who owes what, AI Munim turns the whole process into a two-minute WhatsApp habit — and gives you a clean daily report every evening without opening a single spreadsheet.",
    ],
    audience: {
      heading: "Who AI Munim is for",
      items: [
        "Kirana stores, retail shops and wholesalers who track daily sales and stock",
        "Traders and distributors managing customer udhaar (credit) ledgers",
        "Small businesses that rely on WhatsApp and voice notes, not software",
        "Owners who want a daily hisaab report without hiring an accountant",
        "Anyone tired of manual bahi-khata or complicated billing apps",
      ],
    },
    steps: [
      {
        title: "Send a voice note or text",
        description:
          "Message AI Munim on WhatsApp in plain Hindi or English — \"Aaj 12,000 ki sale hui\" or \"Suresh se 8000 mila\". No forms, no menus.",
      },
      {
        title: "AI understands and records",
        description:
          "AI Munim detects the language and intent, then posts the entry to the right ledger — sale, purchase, payment or stock — automatically.",
      },
      {
        title: "Get instant confirmation",
        description:
          "You receive a confirmation on WhatsApp with the updated balance, so you always know the entry was captured correctly.",
      },
      {
        title: "Receive your daily report",
        description:
          "Every evening AI Munim sends a summary — total sales, pending udhaar, low-stock alerts and cash position — with zero effort from you.",
      },
    ],
    benefits: [
      {
        stat: "10 min",
        label: "Month-end hisaab",
        description:
          "Closing that used to take two days is ready from your running WhatsApp ledger.",
      },
      {
        stat: "0",
        label: "New apps to learn",
        description:
          "Runs inside WhatsApp — your staff adopt it on day one with no training.",
      },
      {
        stat: "24/7",
        label: "Always available",
        description:
          "Record a sale at midnight or on the go — the ledger is always up to date.",
      },
    ],
    pilot: {
      heading: "Start free — no card, no commitment",
      body: "AIVEXA is onboarding a limited number of shops and traders on a free pilot. Set up AI Munim for your business at no cost, use it for your real daily hisaab, and decide only after you see it working.",
      bullets: [
        "Free setup and onboarding support",
        "Works with your existing WhatsApp number",
        "Cancel anytime — no lock-in",
      ],
    },
    faqs: [
      {
        q: "How does AI Munim record my accounts on WhatsApp?",
        a: "You send AI Munim a voice note or text message on WhatsApp describing what happened — a sale, a purchase, an udhaar or a payment. It understands your Hindi or English, identifies the transaction, and posts it to the correct ledger automatically, then replies with a confirmation and the updated balance.",
      },
      {
        q: "Do I need to install any app or learn software?",
        a: "No. AI Munim works entirely inside WhatsApp, which you and your staff already use. There is no separate app to download and no accounting knowledge required — if you can send a WhatsApp message, you can use AI Munim.",
      },
      {
        q: "Can AI Munim understand Hindi and Hinglish voice notes?",
        a: "Yes. AI Munim is built for Indian businesses and understands Hindi, English and mixed Hinglish in both voice notes and text, so you can speak the way you normally talk to your customers.",
      },
      {
        q: "Does it track customer udhaar (credit) and payments?",
        a: "Yes. AI Munim maintains a running ledger for each customer, so you always know who owes how much. When a customer pays, you tell AI Munim and it updates the balance — no more forgotten udhaar entries.",
      },
      {
        q: "Is AI Munim free to try?",
        a: "AIVEXA is currently offering a free pilot to a limited number of shops and traders. Setup and onboarding are free during the pilot, and you can stop anytime. Contact the team to check availability for your business.",
      },
      {
        q: "Is my business data safe?",
        a: "Your data is processed on encrypted cloud infrastructure with access controls and audit logging. AIVEXA does not sell your data. AI Munim acts only as a record-keeping assistant for your own business ledgers.",
      },
      {
        q: "Can AI Munim generate GST invoices and reports?",
        a: "AI Munim focuses on recording sales, purchases, stock and ledgers and sending you daily summaries. Structured reports for your accountant are part of the roadmap — the team can walk you through exactly what is available today during your pilot.",
      },
      {
        q: "Who is AI Munim best suited for?",
        a: "It is built for kirana stores, retailers, wholesalers, traders and small businesses in India that track daily sales, stock and customer credit but do not want to run complicated accounting software.",
      },
    ],
  },

  "clinic-voice": {
    seoTitle: "Clinic Voice — 24/7 AI Receptionist for Indian Clinics",
    seoDescription:
      "Clinic Voice is an AI phone receptionist for clinics & doctors. It answers every call 24/7, books appointments by voice in Hindi & English. Free pilot available.",
    keywords: [
      "AI receptionist for clinic",
      "AI phone answering for doctors India",
      "24/7 clinic call answering",
      "voice appointment booking Hindi",
      "missed call recovery clinic",
      "AI voice agent healthcare India",
      "Clinic Voice",
    ],
    heroSubhead:
      "An AI voice agent that answers every patient call 24/7, books appointments by voice in Hindi and English, and sends instant WhatsApp confirmations.",
    intro: [
      "Clinic Voice is an AI-powered phone receptionist built for clinics, doctors and small hospitals in India. It answers incoming patient calls around the clock — including nights, Sundays and lunch breaks — understands what the patient wants, books or reschedules appointments by voice, and sends an instant WhatsApp confirmation. No call goes unanswered, and no patient is lost to a busy tone.",
      "Every missed call at a clinic is usually a lost appointment and a patient who simply calls the next doctor. A human front desk cannot pick up every call, especially during OPD rush or after hours. Clinic Voice fills that gap: it speaks naturally in Hindi, English and Urdu, follows your doctors' real availability, and hands over to your staff whenever a human is genuinely needed.",
      "Because confirmations and reminders go out automatically on WhatsApp, no-shows drop and your front-desk team is freed to focus on the patients physically in the clinic instead of the phone that never stops ringing.",
    ],
    audience: {
      heading: "Who Clinic Voice is for",
      items: [
        "Single-doctor and multi-doctor clinics with high call volume",
        "Diagnostic centres and small hospitals with busy OPD scheduling",
        "Clinics that miss calls after hours, on holidays or during rush",
        "Practices losing patients to missed calls and no-shows",
        "Doctors who want appointments booked without adding front-desk staff",
      ],
    },
    steps: [
      {
        title: "Patient calls your clinic number",
        description:
          "Calls to your existing clinic line are answered instantly by Clinic Voice — 24 hours a day, in the patient's language.",
      },
      {
        title: "AI understands the request",
        description:
          "It recognises whether the patient wants a new appointment, a reschedule, timings or directions, and responds naturally in Hindi, English or Urdu.",
      },
      {
        title: "Appointment booked by voice",
        description:
          "Clinic Voice checks the doctor's real availability and books the slot by voice — no app, no typing for the patient.",
      },
      {
        title: "Instant WhatsApp confirmation",
        description:
          "The patient gets an immediate WhatsApp confirmation, and an automatic reminder before the visit to reduce no-shows.",
      },
    ],
    benefits: [
      {
        stat: "0",
        label: "Missed calls",
        description:
          "Every call is answered, even at 11 pm or during peak OPD — no more busy tones.",
      },
      {
        stat: "24/7",
        label: "Always on",
        description:
          "Patients book appointments any time, without waiting for the clinic to open.",
      },
      {
        stat: "3 langs",
        label: "Hindi · English · Urdu",
        description:
          "Patients speak naturally in their own language and are understood.",
      },
    ],
    pilot: {
      heading: "Try it free on your clinic line",
      body: "AIVEXA is onboarding a limited number of clinics on a free pilot. Point your calls to Clinic Voice, watch it handle real patient bookings, and continue only if it earns its place at your front desk.",
      bullets: [
        "Free setup and configuration for your doctors' schedules",
        "Keeps your existing clinic phone number",
        "No long-term contract — stop anytime",
      ],
    },
    faqs: [
      {
        q: "How does Clinic Voice answer patient calls?",
        a: "Clinic Voice is an AI voice agent that picks up calls to your clinic number automatically. It listens to the patient, understands their request in Hindi, English or Urdu, and responds in a natural voice — answering common questions and booking appointments without a human receptionist.",
      },
      {
        q: "Can it book appointments in Hindi and other languages?",
        a: "Yes. Clinic Voice books appointments entirely by voice and understands Hindi, English and Urdu, so patients can speak the way they normally would. It checks the doctor's availability and confirms the slot during the same call.",
      },
      {
        q: "What happens to calls after clinic hours?",
        a: "Clinic Voice answers 24/7, including nights, Sundays and holidays. Patients who call after hours can still book or reschedule appointments, so you stop losing them to missed calls.",
      },
      {
        q: "Does the patient need to install an app?",
        a: "No. The patient just makes a normal phone call. Clinic Voice answers and books by voice, then sends the confirmation over WhatsApp — nothing to download on the patient's side.",
      },
      {
        q: "Will it replace my front-desk staff?",
        a: "No — it supports them. Clinic Voice handles the repetitive call-answering and booking so your staff can focus on patients in the clinic. It hands over to a human whenever a call genuinely needs one.",
      },
      {
        q: "How does it reduce no-shows?",
        a: "Every booking gets an instant WhatsApp confirmation, and Clinic Voice sends an automatic reminder before the appointment. Patients who are reminded are far more likely to show up, which cuts empty slots.",
      },
      {
        q: "Is Clinic Voice free to try?",
        a: "AIVEXA is offering a free pilot to a limited number of clinics. Setup and configuration for your doctors' schedules are free during the pilot, and there is no long-term contract. Contact the team to check availability.",
      },
      {
        q: "Can I keep my existing clinic phone number?",
        a: "Yes. Clinic Voice works with your existing clinic line, so patients keep calling the same number they already know.",
      },
    ],
  },

  "ai-hospital": {
    seoTitle: "AI Hospital — WhatsApp Appointment Booking for Hospitals",
    seoDescription:
      "AI Hospital is a WhatsApp-based appointment booking system for clinics and hospitals in India. Automate patient scheduling, confirmations and reminders. Free pilot.",
    keywords: [
      "hospital appointment booking system India",
      "WhatsApp appointment booking",
      "OPD scheduling software",
      "patient appointment automation",
      "doctor slot management",
      "AI Hospital",
    ],
    heroSubhead:
      "A WhatsApp-based appointment system that books patients, sends confirmations and reminders, and manages doctor slots automatically.",
    intro: [
      "AI Hospital is a WhatsApp-based appointment booking and patient-scheduling system built for clinics, diagnostic centres and small hospitals in India. Patients book, reschedule or confirm appointments through a simple WhatsApp conversation, and your OPD schedule stays organised without your front desk chasing phone calls all day.",
      "Every appointment gets an automatic confirmation and a reminder before the visit, which keeps no-shows low and OPD queues predictable. Because it runs on WhatsApp — the app patients already have — there is nothing for anyone to install, and your staff manage the whole schedule from one dashboard.",
      "For a busy hospital or multi-doctor clinic, AI Hospital replaces the messy mix of phone calls, registers and walk-ins with a single automated flow: book, confirm, remind, arrive.",
    ],
    audience: {
      heading: "Who AI Hospital is for",
      items: [
        "Multi-doctor clinics and small hospitals with heavy OPD load",
        "Diagnostic centres managing test appointments and slots",
        "Front desks overwhelmed by appointment phone calls",
        "Practices struggling with patient no-shows",
        "Hospitals that want scheduling without a costly HMS rollout",
      ],
    },
    steps: [
      { title: "Patient messages on WhatsApp", description: "The patient starts a WhatsApp chat to request an appointment — no app install, no form." },
      { title: "AI checks doctor availability", description: "The system reads the doctor's live slots and offers the patient the next available times." },
      { title: "Appointment confirmed", description: "The slot is booked and a confirmation is sent instantly over WhatsApp." },
      { title: "Automatic reminder", description: "A reminder goes out before the visit, cutting no-shows and keeping OPD queues smooth." },
    ],
    benefits: [
      { stat: "Auto", label: "Confirmations", description: "Every booking is confirmed and reminded automatically — no manual calls." },
      { stat: "0", label: "App installs", description: "Runs on WhatsApp, so patients and staff need nothing new." },
      { stat: "Fewer", label: "No-shows", description: "Reminders bring more patients in on time and reduce empty slots." },
    ],
    pilot: {
      heading: "Set it up free for your hospital",
      body: "AIVEXA is onboarding a limited number of clinics and hospitals on a free pilot. Configure AI Hospital for your doctors' schedules at no cost and see it handle real bookings before you decide.",
      bullets: ["Free setup for your doctor slots", "Uses WhatsApp — no patient app", "No lock-in — stop anytime"],
    },
    faqs: [
      { q: "How do patients book appointments with AI Hospital?", a: "Patients send a WhatsApp message to your clinic or hospital. AI Hospital checks the doctor's available slots, offers times, and books the appointment through the chat, then sends an instant confirmation — all without any app install." },
      { q: "Does it send reminders to reduce no-shows?", a: "Yes. Every booking gets an automatic WhatsApp confirmation and a reminder before the appointment, which significantly reduces patient no-shows and keeps OPD queues organised." },
      { q: "Can it manage multiple doctors and their schedules?", a: "Yes. AI Hospital supports doctor slot management, so each doctor's availability is tracked separately and patients are only offered open slots." },
      { q: "Do patients need to download an app?", a: "No. Everything happens inside WhatsApp, which patients already use. There is nothing for them to install." },
      { q: "How is AI Hospital different from Clinic Voice?", a: "Clinic Voice answers incoming phone calls with an AI voice agent. AI Hospital focuses on WhatsApp-based appointment booking and scheduling. Many clinics use them together — voice for callers, WhatsApp for chat bookings." },
      { q: "Is AI Hospital free to try?", a: "AIVEXA is offering a free pilot to a limited number of clinics and hospitals. Setup for your doctors' schedules is free during the pilot, with no long-term contract. Contact the team to check availability." },
      { q: "Is patient data kept secure?", a: "Patient scheduling data is processed on encrypted cloud infrastructure with access controls and audit logging, and AIVEXA does not sell your data." },
    ],
  },

  "ai-camp": {
    seoTitle: "AI Camp — WhatsApp Registration for Camps & Events",
    seoDescription:
      "AI Camp is a WhatsApp-based registration and tracking system for medical camps and events in India. Manage attendees, payments and confirmations. Free pilot.",
    keywords: [
      "event registration WhatsApp",
      "medical camp registration system",
      "camp attendee tracking",
      "event management India",
      "family registration system",
      "AI Camp",
    ],
    heroSubhead:
      "A WhatsApp-based registration and tracking system for camps and events — manage attendees, payments and confirmations from one place.",
    intro: [
      "AI Camp is a WhatsApp-based registration and management system for medical camps, health drives and events across India. Attendees register through WhatsApp, families are grouped correctly, duplicate mobile numbers are caught automatically, and payments and confirmations are tracked — all without spreadsheets or paper forms.",
      "Organising a camp usually means chaotic registration desks, lost forms and no clear headcount. AI Camp turns that into a clean digital flow: people register on WhatsApp, get an instant confirmation, and organisers see real-time status and payment tracking from a single dashboard.",
      "It is built for the way camps actually run in India — high volume, families registering together, and last-minute additions — so the team on the ground spends time on people, not paperwork.",
    ],
    audience: {
      heading: "Who AI Camp is for",
      items: [
        "Medical and health camp organisers",
        "Hospitals and clinics running outreach drives",
        "NGOs and community event teams",
        "Anyone managing high-volume family registrations",
        "Events that need payment tracking and confirmations",
      ],
    },
    steps: [
      { title: "Attendee registers on WhatsApp", description: "People register themselves and their family through a simple WhatsApp flow — no forms to print." },
      { title: "Duplicates auto-detected", description: "Duplicate mobile numbers are flagged automatically so your list stays clean." },
      { title: "Payment tracked", description: "Payments are recorded against each registration, giving organisers a live financial picture." },
      { title: "Confirmation sent", description: "Each attendee receives an instant WhatsApp confirmation with their details." },
    ],
    benefits: [
      { stat: "Live", label: "Status tracking", description: "See registrations and payments in real time from one dashboard." },
      { stat: "0", label: "Paper forms", description: "Everything is digital and searchable — no lost slips." },
      { stat: "Auto", label: "Confirmations", description: "Attendees are confirmed instantly, reducing desk crowding." },
    ],
    pilot: {
      heading: "Run your next camp on AI Camp — free",
      body: "AIVEXA is onboarding a limited number of camp and event organisers on a free pilot. Set up AI Camp for your next event at no cost and see the registration flow in action.",
      bullets: ["Free setup for your event", "WhatsApp-based — no attendee app", "No lock-in — stop anytime"],
    },
    faqs: [
      { q: "How do attendees register for a camp with AI Camp?", a: "Attendees register through a simple WhatsApp conversation, including their family members. They receive an instant confirmation, and organisers see the registration on a live dashboard — no paper forms or printed lists." },
      { q: "Can it handle family registrations?", a: "Yes. AI Camp is built for family registration, so one person can register several family members together, which is common at medical and health camps in India." },
      { q: "Does it detect duplicate registrations?", a: "Yes. Duplicate mobile numbers are detected automatically, so your attendee list stays clean even at high volume." },
      { q: "Can I track payments for a paid camp or event?", a: "Yes. AI Camp records payments against each registration and shows organisers a live view of who has paid, so reconciliation is simple." },
      { q: "Do attendees need an app?", a: "No. Registration happens entirely on WhatsApp, which attendees already have. There is nothing to install." },
      { q: "Is AI Camp free to try?", a: "AIVEXA is offering a free pilot to a limited number of organisers. Setup for your event is free during the pilot with no long-term commitment. Contact the team to check availability for your camp." },
    ],
  },

  "saferide-qr": {
    seoTitle: "SafeRide QR — Smart Vehicle QR Sticker for Bikes & Cars",
    seoDescription:
      "SafeRide QR is a smart QR sticker for bikes, cars & scooters in India. Anyone scans it to alert the owner by SMS & WhatsApp — without sharing your phone number.",
    keywords: [
      "vehicle QR sticker India",
      "car QR code owner alert",
      "bike safety sticker",
      "wrong parking notification",
      "hide phone number vehicle",
      "SafeRide QR",
    ],
  },

  "myrentsaathi": {
    seoTitle: "MyRentSaathi — WhatsApp Rent Collection for Landlords",
    seoDescription:
      "MyRentSaathi is a WhatsApp platform for landlords & housing societies in India. Collect rent at 0% commission, send reminders, generate rental agreements.",
    keywords: [
      "rent collection app India",
      "WhatsApp rent reminder",
      "housing society management",
      "0% commission UPI rent",
      "AI rental agreement generator",
      "MyRentSaathi",
    ],
  },
};

export function getProductContent(slug: string): ProductContent | null {
  return productContent[slug] ?? null;
}
