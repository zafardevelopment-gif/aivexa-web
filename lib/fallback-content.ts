import type { Page, Product, Settings, Stat, Step, Testimonial, WhyCard } from "./types";

// ============================================================
// Built-in fallback content — used only when Supabase env vars
// are missing or a query fails, so the site never goes blank.
// Once supabase/schema.sql is applied, all content is served
// from the aivexa_ tables.
// ============================================================

export const fallbackSettings: Settings = {
  site_name: "AIVEXA",
  site_tagline: "AI. Vision. Automation. Excellence.",
  hero_badge: "Enterprise-grade AI for healthcare, business & everyday life",
  hero_title: "One AI platform for real-world operations",
  hero_subtitle:
    "AIVEXA builds AI systems that answer your calls, manage your books, schedule your appointments, collect your rent, run your events and protect your vehicle — on WhatsApp, Voice and smart QR, in your language.",
  legal_name: "MD ZAFAR EQBAL",
  trade_name: "MART NEST",
  gst_number: "10AAKPE8885H1ZL",
  business_type: "Proprietorship",
  contact_email: "martnest01@gmail.com",
  contact_phone: "+91-XXXXXXXXXX",
  address:
    "2nd Floor, Gehumi Shivdhara Road, Light Pink Building, Front of Dr. Abu Zafar Clinic, Darbhanga, Bihar - 846004, India",
  city: "Darbhanga, Bihar 846004",
  country: "India",
  footer_about:
    "AI-powered automation across WhatsApp, Voice and smart QR. Secure, scalable and intelligent systems built for real-world operations.",
};

export const fallbackProducts: Product[] = [
  {
    slug: "ai-munim",
    name: "AI Munim",
    tagline: "Awaaz aapki, hisaab AI Munim ka.",
    badge: "Flagship",
    description:
      "A WhatsApp-based AI accounting assistant for retailers and traders. Manage your entire business — sales, stock, ledgers and staff — through simple voice and text commands.",
    icon: "munim",
    features: [
      "Sales & Purchase Entry",
      "Inventory Management",
      "Ledger & Payment Tracking",
      "Daily Reports",
      "Employee Management",
      "Low Stock Alerts",
    ],
    sort_order: 1,
  },
  {
    slug: "clinic-voice",
    name: "Clinic Voice",
    tagline: "Your clinic's AI receptionist — never miss a call.",
    badge: "New",
    description:
      "An AI voice agent for clinics and doctors. Clinic Voice answers patient calls 24/7, books appointments by voice in Hindi, English and Urdu, and sends instant WhatsApp confirmations.",
    icon: "voice",
    features: [
      "24/7 AI Call Answering",
      "Voice Appointment Booking",
      "Hindi, English & Urdu Support",
      "WhatsApp Confirmations & Reminders",
      "Call Recordings & Transcripts",
      "Doctor Schedule Sync",
      "Missed-Call Recovery",
    ],
    sort_order: 2,
  },
  {
    slug: "ai-hospital",
    name: "AI Hospital",
    tagline: "Appointments on autopilot.",
    badge: "",
    description:
      "A WhatsApp-based intelligent appointment booking system for clinics and hospitals. Streamline patient scheduling with fully automated workflows.",
    icon: "hospital",
    features: [
      "Appointment Scheduling",
      "Automated Confirmations",
      "Reminder Notifications",
      "Doctor Slot Management",
      "Multilingual Support",
    ],
    sort_order: 3,
  },
  {
    slug: "ai-camp",
    name: "AI Camp",
    tagline: "Events managed end-to-end.",
    badge: "",
    description:
      "A WhatsApp-based registration and tracking system for camps and events. Manage attendees, payments and communications seamlessly.",
    icon: "camp",
    features: [
      "Family Registration",
      "Duplicate Mobile Detection",
      "Payment Tracking",
      "Confirmation Messaging",
      "Real-time Status Search",
    ],
    sort_order: 4,
  },
  {
    slug: "saferide-qr",
    name: "SafeRide QR",
    tagline: "Your vehicle speaks. You stay safe.",
    badge: "Live",
    description:
      "A smart QR sticker system for bikes, cars and scooters. When someone scans the sticker, the owner gets an instant SMS and WhatsApp alert — without ever sharing their phone number. Built for parking conflicts, forgotten lights and roadside emergencies across India.",
    icon: "shield",
    features: [
      "Instant SMS & WhatsApp Alerts",
      "Number Stays 100% Private",
      "Emergency Mode with Location & Medical Info",
      "Wrong-Parking Notifications",
      "No App Needed to Scan",
      "Weatherproof QR Stickers",
    ],
    sort_order: 5,
  },
  {
    slug: "myrentsaathi",
    name: "MyRentSaathi",
    tagline: "Society + Rent + Tenant = Sab Ek Jagah.",
    badge: "Live",
    description:
      "A WhatsApp-native platform for landlords and housing societies. Collect rent and maintenance online, send automatic reminders, generate AI rental agreements, and track complaints — all from one dashboard, with zero app downloads for tenants.",
    icon: "building",
    features: [
      "WhatsApp Rent & Maintenance Reminders",
      "0% Commission UPI Collection",
      "AI Rental Agreement Generator",
      "Complaint Ticket System",
      "Parking & Visitor Management",
      "Tax-Ready Financial Reports",
    ],
    sort_order: 6,
  },
];

export const fallbackSteps: Step[] = [
  {
    step_no: 1,
    title: "Message or Call",
    icon: "chat",
    description:
      "Users interact through WhatsApp or a simple phone call — text, voice notes or live speech.",
  },
  {
    step_no: 2,
    title: "AI Understands",
    icon: "brain",
    description:
      "Our intelligence layer processes the request, detects the language and identifies the intent with high accuracy.",
  },
  {
    step_no: 3,
    title: "Secure Processing",
    icon: "shield",
    description:
      "Data is processed on encrypted cloud infrastructure with audit logging and role-based access.",
  },
  {
    step_no: 4,
    title: "Instant Confirmation",
    icon: "check",
    description:
      "A confirmation is sent back instantly with every relevant detail and live status updates.",
  },
];

export const fallbackWhy: WhyCard[] = [
  {
    title: "WhatsApp & Voice First",
    icon: "chat",
    sort_order: 1,
    description:
      "Built on the channels your users already know and trust. No app downloads, no training required.",
  },
  {
    title: "AI-Driven Workflows",
    icon: "brain",
    sort_order: 2,
    description:
      "Intelligent processing that understands context, learns patterns and delivers accurate results consistently.",
  },
  {
    title: "Secure Cloud Infrastructure",
    icon: "shield",
    sort_order: 3,
    description:
      "Enterprise-grade security with encrypted storage, secure APIs and regular security assessments.",
  },
  {
    title: "Multi-Tenant SaaS",
    icon: "layers",
    sort_order: 4,
    description:
      "Scalable architecture supporting multiple businesses with complete data isolation and customization.",
  },
  {
    title: "Audit Logging & Data Safety",
    icon: "doc",
    sort_order: 5,
    description:
      "Complete audit trails for every transaction with robust backup and recovery mechanisms.",
  },
  {
    title: "Built for Real Operations",
    icon: "users",
    sort_order: 6,
    description:
      "Designed through direct engagement with business users to solve actual day-to-day challenges.",
  },
];

export const fallbackStats: Stat[] = [
  {
    value: "3×",
    label: "Faster Operations",
    sort_order: 1,
    description: "Bookings, billing and records handled in seconds instead of minutes.",
  },
  {
    value: "60%",
    label: "Reduced Workload",
    sort_order: 2,
    description: "Front-desk and back-office tasks automated end-to-end.",
  },
  {
    value: "95%",
    label: "Patient Satisfaction",
    sort_order: 3,
    description: "Instant answers and zero missed calls keep patients happy.",
  },
  {
    value: "100%",
    label: "Secure Deployments",
    sort_order: 4,
    description: "Encrypted infrastructure with full audit trails on every install.",
  },
];

export const fallbackTestimonials: Testimonial[] = [
  {
    name: "Dr. Imran Khan",
    role: "Director",
    company: "Khan Multispeciality Clinic",
    sort_order: 1,
    quote:
      "Clinic Voice answers every patient call — even at 11 pm. Our front desk now focuses on patients in the room, not the phone. Missed appointments have dropped to almost zero.",
  },
  {
    name: "Rajesh Gupta",
    role: "Owner",
    company: "Gupta Trading Co.",
    sort_order: 2,
    quote:
      "I just send a voice note on WhatsApp and AI Munim updates my sales, stock and ledger. Month-end hisaab that took two days now takes ten minutes.",
  },
  {
    name: "Sana Parveen",
    role: "Administrator",
    company: "City Care Hospital",
    sort_order: 3,
    quote:
      "The AI Hospital system handles hundreds of appointment requests a week with automatic confirmations and reminders. Our OPD queues are finally organised.",
  },
];

export const fallbackPages: Record<string, Page> = {
  privacy: {
    slug: "privacy",
    title: "Privacy Policy",
    subtitle: "Last updated: July 2026",
    content: `<p>AIVEXA ("we," "us," or "our") is committed to protecting the privacy of individuals and businesses that use our automation systems. This Privacy Policy outlines how we collect, use, store, and protect your information.</p>
<h3>1. Information We Collect</h3>
<p>We may collect the following types of information when you use our services:</p>
<ul>
<li>Personal identification information (name, phone number, email address)</li>
<li>Business information (business name, GST number, trade details)</li>
<li>Transaction data (sales records, purchase entries, payment information as entered by users)</li>
<li>Communication data (WhatsApp messages and voice calls exchanged with our automated systems)</li>
<li>Device and usage information (device type, interaction timestamps)</li>
</ul>
<h3>2. Purpose of Data Collection</h3>
<p>We collect and process data for the following purposes: to provide and maintain our automation services, to process and respond to user requests and commands, to generate reports and analytics for the user's own business, to send system notifications and confirmations, and to improve our systems and user experience.</p>
<h3>3. Data Security Practices</h3>
<p>We implement industry-standard security measures to protect your data, including encrypted data transmission and storage, secure cloud infrastructure with access controls, regular security assessments and monitoring, and role-based access controls for system administration.</p>
<h3>4. No Selling of Personal Data</h3>
<p>AIVEXA does not sell, trade, or rent personal information of users to any third party. We do not share your data with external parties for marketing or advertising purposes.</p>
<h3>5. Compliance with Indian Regulations</h3>
<p>Our data handling practices are designed to comply with applicable Indian laws and regulations, including the Information Technology Act, 2000 and related rules. We are committed to adhering to evolving data protection standards.</p>
<h3>6. Data Retention Policy</h3>
<p>We retain user data only for as long as necessary to provide our services and comply with legal obligations. Users may request deletion of their data by contacting us at the details provided below. Upon termination of services, user data will be securely deleted within a reasonable timeframe.</p>
<h3>7. User Rights</h3>
<p>Users have the right to access their personal data held by us, request corrections to inaccurate data, request deletion of their data (subject to legal requirements), withdraw consent for data processing, and receive information about how their data is used.</p>
<h3>8. Cookies &amp; Third-Party Advertising</h3>
<p>Our website, including the free tools section, may use cookies and similar technologies to operate correctly, remember your preferences, and measure site usage.</p>
<p>We may also work with third-party advertising vendors, including Google, to display advertisements on this website. Google and its partners use cookies (such as the Google DoubleClick cookie) to serve ads based on a user's prior visits to this and other websites. Google's use of advertising cookies enables it and its partners to serve ads based on your visit to our site and/or other sites on the internet.</p>
<p>You may opt out of personalized advertising by visiting <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google Ads Settings</a>, or opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info/choices" target="_blank" rel="noopener noreferrer">www.aboutads.info</a>.</p>
<p>We may also use analytics services (such as Google Analytics) that use cookies to collect anonymous, aggregated information about how visitors use our site, which helps us improve our tools and content. This data is not used to personally identify individual visitors.</p>
<h3>9. Important Disclaimer</h3>
<p>AIVEXA provides digital automation systems and does not directly process financial transactions. All financial data entered by users is managed within the user's own account and is the responsibility of the user. AIVEXA acts solely as a technology service provider.</p>
<h3>10. Contact for Privacy Matters</h3>
<div class="legal-highlight"><p>For any privacy-related questions or requests, please contact us at: <a href="mailto:martnest01@gmail.com">martnest01@gmail.com</a></p></div>`,
  },
  terms: {
    slug: "terms",
    title: "Terms of Service",
    subtitle: "Last updated: January 2026",
    content: `<p>These Terms of Service ("Terms") govern your access to and use of AIVEXA's products, services, and platforms, including our SaaS applications, automation tools, WhatsApp and voice integrations, and business software solutions (collectively, "Services"). By accessing or using our Services, you agree to be bound by these Terms.</p>
<h3>1. Acceptance of Terms</h3>
<p>By creating an account, subscribing to our services, or using any AIVEXA product, you confirm that you have read, understood, and agree to be bound by these Terms. If you are using the Services on behalf of a business or other legal entity, you represent that you have the authority to bind such entity to these Terms.</p>
<h3>2. Description of Services</h3>
<p>AIVEXA provides AI-powered business automation solutions delivered primarily through WhatsApp, voice calling and web-based platforms. Our Services include:</p>
<ul>
<li>AI Munim &ndash; WhatsApp-based accounting and business management assistant</li>
<li>Clinic Voice &ndash; AI voice receptionist and appointment agent for clinics</li>
<li>AI Hospital &ndash; Intelligent appointment booking and scheduling system</li>
<li>AI Camp &ndash; Event and camp registration management system</li>
<li>Custom WhatsApp and voice automation and integration solutions</li>
<li>SaaS-based business tools and dashboards</li>
</ul>
<h3>3. User Accounts &amp; Responsibilities</h3>
<p>Users are responsible for maintaining the confidentiality of their account credentials, ensuring the accuracy and completeness of all data entered into our systems, complying with all applicable local, state, and national laws when using our Services, and notifying us immediately of any unauthorized access or security breach.</p>
<h3>4. Subscription &amp; Payment Terms</h3>
<p>Certain Services may require a paid subscription. By subscribing, you agree to pay all applicable fees as described at the time of purchase. Subscriptions auto-renew unless cancelled before the renewal date. Refunds are handled on a case-by-case basis in accordance with our refund policy. AIVEXA reserves the right to change pricing with reasonable prior notice.</p>
<h3>5. Acceptable Use Policy</h3>
<p>You agree not to use AIVEXA Services to:</p>
<ul>
<li>Violate any applicable law or regulation</li>
<li>Send spam, unsolicited messages, or bulk communications through our WhatsApp integrations</li>
<li>Transmit malicious code, viruses, or harmful content</li>
<li>Attempt to gain unauthorized access to our systems or other users' data</li>
<li>Use our AI systems to generate misleading, fraudulent, or harmful content</li>
<li>Resell or redistribute our Services without written authorization</li>
</ul>
<h3>6. WhatsApp Integration Terms</h3>
<p>Our Services integrate with the WhatsApp Business API. By using these features, you also agree to comply with WhatsApp's Business Terms of Service and Commerce Policy. AIVEXA is not responsible for changes to WhatsApp's platform, API availability, or policies that may affect service delivery.</p>
<h3>7. Intellectual Property</h3>
<p>All content, software, algorithms, designs, trademarks, and intellectual property associated with AIVEXA Services remain the exclusive property of AIVEXA. Users retain ownership of their data but grant AIVEXA a limited license to process such data for service delivery purposes.</p>
<h3>8. Data Handling &amp; Privacy</h3>
<p>Your use of our Services is also governed by our <a href="/privacy">Privacy Policy</a>. We are committed to protecting your data and handling it in compliance with applicable Indian laws, including the Information Technology Act, 2000. For data deletion requests, please visit our <a href="/data-deletion">Data Deletion</a> page.</p>
<h3>9. Service Availability &amp; Modifications</h3>
<p>AIVEXA strives to maintain 99.9% uptime but does not guarantee uninterrupted service. We reserve the right to modify, update, or discontinue any feature or service with reasonable notice. Scheduled maintenance windows will be communicated in advance when possible.</p>
<h3>10. Limitation of Liability</h3>
<p>To the maximum extent permitted by law, AIVEXA shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from the use or inability to use our Services. Our total liability for any claim shall not exceed the amount paid by the user for the relevant service during the twelve (12) months preceding the claim.</p>
<h3>11. Indemnification</h3>
<p>You agree to indemnify and hold harmless AIVEXA, its owner, and affiliates from any claims, damages, losses, or expenses arising from your violation of these Terms, misuse of the Services, or violation of any law or third-party rights.</p>
<h3>12. Governing Law</h3>
<p>These Terms are governed by the laws of India. Any disputes shall be subject to the exclusive jurisdiction of the courts of Darbhanga, Bihar, India.</p>
<h3>13. Contact</h3>
<div class="legal-highlight"><p>For questions regarding these Terms, contact us at: <a href="mailto:martnest01@gmail.com">martnest01@gmail.com</a></p></div>`,
  },
  "data-deletion": {
    slug: "data-deletion",
    title: "Data Deletion",
    subtitle: "Request removal of your personal or business data",
    content: `<div class="legal-highlight" style="text-align:center">
<h3 style="margin-top:0">Request Data Deletion</h3>
<p>If you would like to request deletion of your personal or business data, please email us at <a href="mailto:martnest01@gmail.com"><strong>martnest01@gmail.com</strong></a>.</p>
<p>We will process and complete your request within <strong>7 working days</strong>.</p>
</div>
<h3>How It Works</h3>
<ul>
<li><strong>1. Send Request</strong> &mdash; Email us with your registered details and deletion request.</li>
<li><strong>2. Verification</strong> &mdash; We verify your identity and locate all associated data in our systems.</li>
<li><strong>3. Confirmation</strong> &mdash; Your data is securely deleted and you receive a confirmation email.</li>
</ul>
<h3>What Data Can Be Deleted?</h3>
<p>You can request deletion of the following data associated with your account:</p>
<ul>
<li>Personal identification information (name, phone number, email)</li>
<li>Business data entered through our platforms</li>
<li>Transaction and communication records</li>
<li>Account preferences and settings</li>
<li>WhatsApp conversation and voice call history with our automated systems</li>
</ul>
<h3>Exceptions</h3>
<p>Certain data may be retained where required by applicable Indian law, tax regulations, or legal proceedings. In such cases, we will inform you of the specific data retained and the legal basis for retention.</p>
<h3>Related Policies</h3>
<p>For more information about how we handle your data, please review our <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms of Service</a>.</p>`,
  },
};
