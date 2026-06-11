-- ============================================================
-- AIVEXA — Supabase Schema
-- Run this in Supabase Dashboard > SQL Editor.
-- All tables use the aivexa_ prefix.
-- Content tables: public read (anon). Messages: insert-only.
-- Safe to re-run: policies are dropped/recreated and seed data
-- is only inserted where it does not already exist.
-- ============================================================

-- ------------------------------------------------------------
-- Site settings (key/value)
-- ------------------------------------------------------------
create table if not exists public.aivexa_settings (
  setting_key   text primary key,
  setting_value text not null
);

alter table public.aivexa_settings enable row level security;
drop policy if exists "Public read settings" on public.aivexa_settings;
create policy "Public read settings" on public.aivexa_settings
  for select using (true);

insert into public.aivexa_settings (setting_key, setting_value) values
('site_name',     'AIVEXA'),
('site_tagline',  'AI That Runs Your Business'),
('hero_badge',    'Enterprise-grade AI for healthcare & business'),
('hero_title',    'AI that runs your clinic and business operations'),
('hero_subtitle', 'AIVEXA builds AI systems that answer your calls, manage your books and schedule your appointments — on WhatsApp and Voice, in your language.'),
('legal_name',    'MD ZAFAR EQBAL'),
('trade_name',    'MART NEST'),
('gst_number',    '10AAKPE8885H1ZL'),
('business_type', 'Proprietorship'),
('contact_email', 'martnest01@gmail.com'),
('contact_phone', '+91-XXXXXXXXXX'),
('address',       '2nd Floor, Gehumi Shivdhara Road, Light Pink Building, Front of Dr. Abu Zafar Clinic, Darbhanga, Bihar - 846004, India'),
('city',          'Darbhanga, Bihar 846004'),
('country',       'India'),
('footer_about',  'AI-powered automation across WhatsApp and Voice. Secure, scalable and intelligent systems built for real-world operations.')
on conflict (setting_key) do update set setting_value = excluded.setting_value;

-- ------------------------------------------------------------
-- Products
-- ------------------------------------------------------------
create table if not exists public.aivexa_products (
  id          bigint generated always as identity primary key,
  slug        text not null unique,
  name        text not null,
  tagline     text not null default '',
  badge       text not null default '',
  description text not null,
  icon        text not null default 'spark',
  features    jsonb not null default '[]',
  sort_order  int  not null default 0,
  is_active   boolean not null default true
);

alter table public.aivexa_products enable row level security;
drop policy if exists "Public read products" on public.aivexa_products;
create policy "Public read products" on public.aivexa_products
  for select using (is_active);

insert into public.aivexa_products (slug, name, tagline, badge, description, icon, features, sort_order) values
('ai-munim', 'AI Munim', 'Awaaz aapki, hisaab AI Munim ka.', 'Flagship',
 'A WhatsApp-based AI accounting assistant for retailers and traders. Manage your entire business — sales, stock, ledgers and staff — through simple voice and text commands.',
 'munim',
 '["Sales & Purchase Entry","Inventory Management","Ledger & Payment Tracking","Daily Reports","Employee Management","Low Stock Alerts"]', 1),
('clinic-voice', 'Clinic Voice', 'Your clinic''s AI receptionist — never miss a call.', 'New',
 'An AI voice agent for clinics and doctors. Clinic Voice answers patient calls 24/7, books appointments by voice in Hindi, English and Urdu, and sends instant WhatsApp confirmations.',
 'voice',
 '["24/7 AI Call Answering","Voice Appointment Booking","Hindi, English & Urdu Support","WhatsApp Confirmations & Reminders","Call Recordings & Transcripts","Doctor Schedule Sync","Missed-Call Recovery"]', 2),
('ai-hospital', 'AI Hospital', 'Appointments on autopilot.', '',
 'A WhatsApp-based intelligent appointment booking system for clinics and hospitals. Streamline patient scheduling with fully automated workflows.',
 'hospital',
 '["Appointment Scheduling","Automated Confirmations","Reminder Notifications","Doctor Slot Management","Multilingual Support"]', 3),
('ai-camp', 'AI Camp', 'Events managed end-to-end.', '',
 'A WhatsApp-based registration and tracking system for camps and events. Manage attendees, payments and communications seamlessly.',
 'camp',
 '["Family Registration","Duplicate Mobile Detection","Payment Tracking","Confirmation Messaging","Real-time Status Search"]', 4)
on conflict (slug) do nothing;

-- ------------------------------------------------------------
-- How-it-works steps
-- ------------------------------------------------------------
create table if not exists public.aivexa_steps (
  id          bigint generated always as identity primary key,
  step_no     int  not null,
  title       text not null,
  description text not null,
  icon        text not null default 'spark'
);

alter table public.aivexa_steps enable row level security;
drop policy if exists "Public read steps" on public.aivexa_steps;
create policy "Public read steps" on public.aivexa_steps
  for select using (true);

insert into public.aivexa_steps (step_no, title, description, icon)
select * from (values
  (1, 'Message or Call', 'Users interact through WhatsApp or a simple phone call — text, voice notes or live speech.', 'chat'),
  (2, 'AI Understands', 'Our intelligence layer processes the request, detects the language and identifies the intent with high accuracy.', 'brain'),
  (3, 'Secure Processing', 'Data is processed on encrypted cloud infrastructure with audit logging and role-based access.', 'shield'),
  (4, 'Instant Confirmation', 'A confirmation is sent back instantly with every relevant detail and live status updates.', 'check')
) as seed(step_no, title, description, icon)
where not exists (select 1 from public.aivexa_steps);

-- ------------------------------------------------------------
-- Why-us cards
-- ------------------------------------------------------------
create table if not exists public.aivexa_why (
  id          bigint generated always as identity primary key,
  title       text not null,
  description text not null,
  icon        text not null default 'spark',
  sort_order  int  not null default 0
);

alter table public.aivexa_why enable row level security;
drop policy if exists "Public read why" on public.aivexa_why;
create policy "Public read why" on public.aivexa_why
  for select using (true);

insert into public.aivexa_why (title, description, icon, sort_order)
select * from (values
  ('WhatsApp & Voice First', 'Built on the channels your users already know and trust. No app downloads, no training required.', 'chat', 1),
  ('AI-Driven Workflows', 'Intelligent processing that understands context, learns patterns and delivers accurate results consistently.', 'brain', 2),
  ('Secure Cloud Infrastructure', 'Enterprise-grade security with encrypted storage, secure APIs and regular security assessments.', 'shield', 3),
  ('Multi-Tenant SaaS', 'Scalable architecture supporting multiple businesses with complete data isolation and customization.', 'layers', 4),
  ('Audit Logging & Data Safety', 'Complete audit trails for every transaction with robust backup and recovery mechanisms.', 'doc', 5),
  ('Built for Real Operations', 'Designed through direct engagement with business users to solve actual day-to-day challenges.', 'users', 6)
) as seed(title, description, icon, sort_order)
where not exists (select 1 from public.aivexa_why);

-- ------------------------------------------------------------
-- Statistic cards (Why AIVEXA section)
-- ------------------------------------------------------------
create table if not exists public.aivexa_stats (
  id          bigint generated always as identity primary key,
  value       text not null,
  label       text not null,
  description text not null,
  sort_order  int  not null default 0
);

alter table public.aivexa_stats enable row level security;
drop policy if exists "Public read stats" on public.aivexa_stats;
create policy "Public read stats" on public.aivexa_stats
  for select using (true);

insert into public.aivexa_stats (value, label, description, sort_order)
select * from (values
  ('3×',   'Faster Operations',    'Bookings, billing and records handled in seconds instead of minutes.', 1),
  ('60%',  'Reduced Workload',     'Front-desk and back-office tasks automated end-to-end.', 2),
  ('95%',  'Patient Satisfaction', 'Instant answers and zero missed calls keep patients happy.', 3),
  ('100%', 'Secure Deployments',   'Encrypted infrastructure with full audit trails on every install.', 4)
) as seed(value, label, description, sort_order)
where not exists (select 1 from public.aivexa_stats);

-- ------------------------------------------------------------
-- Testimonials
-- ------------------------------------------------------------
create table if not exists public.aivexa_testimonials (
  id         bigint generated always as identity primary key,
  name       text not null,
  role       text not null default '',
  company    text not null default '',
  quote      text not null,
  sort_order int  not null default 0
);

alter table public.aivexa_testimonials enable row level security;
drop policy if exists "Public read testimonials" on public.aivexa_testimonials;
create policy "Public read testimonials" on public.aivexa_testimonials
  for select using (true);

insert into public.aivexa_testimonials (name, role, company, quote, sort_order)
select * from (values
  ('Dr. Imran Khan', 'Director', 'Khan Multispeciality Clinic',
   'Clinic Voice answers every patient call — even at 11 pm. Our front desk now focuses on patients in the room, not the phone. Missed appointments have dropped to almost zero.', 1),
  ('Rajesh Gupta', 'Owner', 'Gupta Trading Co.',
   'I just send a voice note on WhatsApp and AI Munim updates my sales, stock and ledger. Month-end hisaab that took two days now takes ten minutes.', 2),
  ('Sana Parveen', 'Administrator', 'City Care Hospital',
   'The AI Hospital system handles hundreds of appointment requests a week with automatic confirmations and reminders. Our OPD queues are finally organised.', 3)
) as seed(name, role, company, quote, sort_order)
where not exists (select 1 from public.aivexa_testimonials);

-- ------------------------------------------------------------
-- Dynamic pages (legal content, HTML body)
-- ------------------------------------------------------------
create table if not exists public.aivexa_pages (
  id         bigint generated always as identity primary key,
  slug       text not null unique,
  title      text not null,
  subtitle   text not null default '',
  content    text not null,
  updated_at timestamptz not null default now()
);

alter table public.aivexa_pages enable row level security;
drop policy if exists "Public read pages" on public.aivexa_pages;
create policy "Public read pages" on public.aivexa_pages
  for select using (true);

insert into public.aivexa_pages (slug, title, subtitle, content) values
('privacy', 'Privacy Policy', 'Last updated: January 2026',
'<p>AIVEXA ("we," "us," or "our") is committed to protecting the privacy of individuals and businesses that use our automation systems. This Privacy Policy outlines how we collect, use, store, and protect your information.</p>
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
<p>We collect and process data for the following purposes: to provide and maintain our automation services, to process and respond to user requests and commands, to generate reports and analytics for the user''s own business, to send system notifications and confirmations, and to improve our systems and user experience.</p>
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
<h3>8. Important Disclaimer</h3>
<p>AIVEXA provides digital automation systems and does not directly process financial transactions. All financial data entered by users is managed within the user''s own account and is the responsibility of the user. AIVEXA acts solely as a technology service provider.</p>
<h3>9. Contact for Privacy Matters</h3>
<div class="legal-highlight"><p>For any privacy-related questions or requests, please contact us at: <a href="mailto:martnest01@gmail.com">martnest01@gmail.com</a></p></div>'),

('terms', 'Terms of Service', 'Last updated: January 2026',
'<p>These Terms of Service ("Terms") govern your access to and use of AIVEXA''s products, services, and platforms, including our SaaS applications, automation tools, WhatsApp and voice integrations, and business software solutions (collectively, "Services"). By accessing or using our Services, you agree to be bound by these Terms.</p>
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
<li>Attempt to gain unauthorized access to our systems or other users'' data</li>
<li>Use our AI systems to generate misleading, fraudulent, or harmful content</li>
<li>Resell or redistribute our Services without written authorization</li>
</ul>
<h3>6. WhatsApp Integration Terms</h3>
<p>Our Services integrate with the WhatsApp Business API. By using these features, you also agree to comply with WhatsApp''s Business Terms of Service and Commerce Policy. AIVEXA is not responsible for changes to WhatsApp''s platform, API availability, or policies that may affect service delivery.</p>
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
<div class="legal-highlight"><p>For questions regarding these Terms, contact us at: <a href="mailto:martnest01@gmail.com">martnest01@gmail.com</a></p></div>'),

('data-deletion', 'Data Deletion', 'Request removal of your personal or business data',
'<div class="legal-highlight" style="text-align:center">
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
<p>For more information about how we handle your data, please review our <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms of Service</a>.</p>')
on conflict (slug) do update set
  title = excluded.title,
  subtitle = excluded.subtitle,
  content = excluded.content,
  updated_at = now();

-- ------------------------------------------------------------
-- Contact form messages (anon can insert, never read)
-- ------------------------------------------------------------
create table if not exists public.aivexa_messages (
  id         bigint generated always as identity primary key,
  name       text not null,
  email      text not null,
  phone      text not null default '',
  message    text not null,
  created_at timestamptz not null default now()
);

alter table public.aivexa_messages enable row level security;
drop policy if exists "Anyone can submit a message" on public.aivexa_messages;
create policy "Anyone can submit a message" on public.aivexa_messages
  for insert with check (true);

-- ------------------------------------------------------------
-- Admin users (simple table-based login)
-- RLS is enabled with NO policies, so this table is completely
-- inaccessible with the public anon key. The website checks
-- credentials server-side using the service_role key.
-- Default login: admin / aivexa123  — CHANGE IT after first
-- login (Table Editor > aivexa_users) ya SQL:
--   update public.aivexa_users set password = 'NEW_PASS' where user_id = 'admin';
-- ------------------------------------------------------------
create table if not exists public.aivexa_users (
  user_id  text primary key,
  password text not null
);

alter table public.aivexa_users enable row level security;

insert into public.aivexa_users (user_id, password)
values ('admin', 'aivexa123')
on conflict (user_id) do nothing;

-- Clean up old Supabase-Auth based policies (no longer used)
drop policy if exists "Admin write settings" on public.aivexa_settings;
drop policy if exists "Admin write products" on public.aivexa_products;
drop policy if exists "Admin write steps" on public.aivexa_steps;
drop policy if exists "Admin write why" on public.aivexa_why;
drop policy if exists "Admin write stats" on public.aivexa_stats;
drop policy if exists "Admin write testimonials" on public.aivexa_testimonials;
drop policy if exists "Admin write pages" on public.aivexa_pages;
drop policy if exists "Admin read messages" on public.aivexa_messages;
drop policy if exists "Admin delete messages" on public.aivexa_messages;
