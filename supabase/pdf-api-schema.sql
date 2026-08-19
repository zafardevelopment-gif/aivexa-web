-- ============================================================
-- AIVEXA PDF API — Supabase Schema
-- Run in Supabase Dashboard > SQL Editor
-- All tables use the pdfapi_ prefix to avoid conflicts.
-- Safe to re-run: uses CREATE TABLE IF NOT EXISTS.
-- ============================================================

-- ------------------------------------------------------------
-- Plans (DB-driven, not hard-coded)
-- ------------------------------------------------------------
create table if not exists public.pdfapi_plans (
  id            text primary key,               -- 'free', 'starter', 'growth', 'pro'
  name          text not null,
  price_monthly int  not null default 0,        -- INR paise (0 = free)
  price_yearly  int  not null default 0,        -- INR paise
  credits       int  not null default 100,      -- PDFs per month
  parallel      int  not null default 1,        -- concurrent conversions
  max_pdf_bytes bigint not null default 2097152, -- 2MB default
  rate_limit_rpm int  not null default 5,       -- requests per minute
  is_active     boolean not null default true,
  features      jsonb not null default '[]',
  sort_order    int  not null default 0,
  created_at    timestamptz not null default now()
);

alter table public.pdfapi_plans enable row level security;
drop policy if exists "Public read plans" on public.pdfapi_plans;
create policy "Public read plans" on public.pdfapi_plans
  for select using (is_active);

insert into public.pdfapi_plans
  (id, name, price_monthly, price_yearly, credits, parallel, max_pdf_bytes, rate_limit_rpm, features, sort_order)
values
  ('free',    'Free',    0,       0,        100,   1,  2097152,   5,  '["100 PDFs/month","1 parallel conversion","2 MB max PDF","All PDF options","API access","Playground"]', 0),
  ('starter', 'Starter', 99900,   999000,   1000,  3,  5242880,   20, '["1,000 PDFs/month","3 parallel conversions","5 MB max PDF","Async + webhooks","Priority support"]', 1),
  ('growth',  'Growth',  199900,  1999000,  2000,  5,  10485760,  50, '["2,000 PDFs/month","5 parallel conversions","10 MB max PDF","Async + webhooks","Priority support"]', 2),
  ('pro',     'Pro',     399900,  3999000,  5000,  10, 26214400,  150, '["5,000 PDFs/month","10 parallel conversions","25 MB max PDF","Async + webhooks","Dedicated support","SLA"]', 3)
on conflict (id) do update set
  name = excluded.name,
  price_monthly = excluded.price_monthly,
  price_yearly = excluded.price_yearly,
  credits = excluded.credits,
  parallel = excluded.parallel,
  max_pdf_bytes = excluded.max_pdf_bytes,
  rate_limit_rpm = excluded.rate_limit_rpm,
  features = excluded.features;

-- ------------------------------------------------------------
-- Users (extends Supabase Auth)
-- ------------------------------------------------------------
create table if not exists public.pdfapi_users (
  id              uuid primary key references auth.users(id) on delete cascade,
  email           text not null,
  full_name       text,
  plan_id         text not null default 'free' references public.pdfapi_plans(id),
  credits_used    int  not null default 0,
  credits_reset_at timestamptz not null default (date_trunc('month', now()) + interval '1 month'),
  is_active       boolean not null default true,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

alter table public.pdfapi_users enable row level security;
drop policy if exists "Users read own record" on public.pdfapi_users;
create policy "Users read own record" on public.pdfapi_users
  for select using (auth.uid() = id);
drop policy if exists "Users update own record" on public.pdfapi_users;
create policy "Users update own record" on public.pdfapi_users
  for update using (auth.uid() = id);

-- ------------------------------------------------------------
-- API Keys
-- ------------------------------------------------------------
create table if not exists public.pdfapi_api_keys (
  id            bigint generated always as identity primary key,
  user_id       uuid not null references public.pdfapi_users(id) on delete cascade,
  name          text not null default 'Default Key',
  key_prefix    text not null,               -- 'avx_pdf_live_' or 'avx_pdf_test_'
  key_hash      text not null unique,        -- SHA-256 of full key, never store plaintext
  key_hint      text not null,               -- last 4 chars shown in UI
  is_test       boolean not null default false,
  is_active     boolean not null default true,
  last_used_at  timestamptz,
  created_at    timestamptz not null default now()
);

alter table public.pdfapi_api_keys enable row level security;
drop policy if exists "Users read own keys" on public.pdfapi_api_keys;
create policy "Users read own keys" on public.pdfapi_api_keys
  for select using (auth.uid() = user_id);
drop policy if exists "Users insert own keys" on public.pdfapi_api_keys;
create policy "Users insert own keys" on public.pdfapi_api_keys
  for insert with check (auth.uid() = user_id);
drop policy if exists "Users update own keys" on public.pdfapi_api_keys;
create policy "Users update own keys" on public.pdfapi_api_keys
  for update using (auth.uid() = user_id);

create index if not exists pdfapi_api_keys_user_id_idx on public.pdfapi_api_keys(user_id);
create index if not exists pdfapi_api_keys_hash_idx on public.pdfapi_api_keys(key_hash);

-- ------------------------------------------------------------
-- API Requests (usage log)
-- ------------------------------------------------------------
create table if not exists public.pdfapi_requests (
  id              bigint generated always as identity primary key,
  request_id      text not null unique,           -- 'req_01KXXX...'
  user_id         uuid references public.pdfapi_users(id),
  api_key_id      bigint references public.pdfapi_api_keys(id),
  endpoint        text not null,                  -- '/v1/pdf', '/v1/url-to-pdf', etc.
  is_test         boolean not null default false,
  status          text not null default 'pending', -- pending|processing|completed|failed
  error_code      text,
  error_message   text,
  input_type      text,                           -- 'html' or 'url'
  input_size_bytes bigint,
  output_size_bytes bigint,
  pdf_pages       int,
  response_ms     int,
  pdf_gen_ms      int,
  credits_used    int not null default 1,
  ip_address      text,
  user_agent      text,
  created_at      timestamptz not null default now()
);

alter table public.pdfapi_requests enable row level security;
drop policy if exists "Users read own requests" on public.pdfapi_requests;
create policy "Users read own requests" on public.pdfapi_requests
  for select using (auth.uid() = user_id);

create index if not exists pdfapi_requests_user_id_idx on public.pdfapi_requests(user_id);
create index if not exists pdfapi_requests_created_at_idx on public.pdfapi_requests(created_at desc);
create index if not exists pdfapi_requests_api_key_id_idx on public.pdfapi_requests(api_key_id);

-- ------------------------------------------------------------
-- PDF Jobs (async queue tracking)
-- ------------------------------------------------------------
create table if not exists public.pdfapi_jobs (
  id          bigint generated always as identity primary key,
  job_id      text not null unique,    -- 'job_01KXXX...'
  request_id  text not null,
  user_id     uuid references public.pdfapi_users(id),
  status      text not null default 'queued', -- queued|processing|completed|failed
  webhook_url text,
  webhook_secret text,
  download_url text,
  expires_at  timestamptz,
  error_code  text,
  attempts    int not null default 0,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

alter table public.pdfapi_jobs enable row level security;
drop policy if exists "Users read own jobs" on public.pdfapi_jobs;
create policy "Users read own jobs" on public.pdfapi_jobs
  for select using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- Subscriptions
-- ------------------------------------------------------------
create table if not exists public.pdfapi_subscriptions (
  id                  bigint generated always as identity primary key,
  user_id             uuid not null references public.pdfapi_users(id) on delete cascade,
  plan_id             text not null references public.pdfapi_plans(id),
  provider            text not null default 'razorpay',  -- 'razorpay' | 'stripe'
  provider_sub_id     text,                              -- Razorpay subscription ID
  status              text not null default 'active',    -- active|cancelled|past_due|expired
  billing_cycle       text not null default 'monthly',   -- monthly|yearly
  current_period_start timestamptz,
  current_period_end  timestamptz,
  cancelled_at        timestamptz,
  created_at          timestamptz not null default now()
);

alter table public.pdfapi_subscriptions enable row level security;
drop policy if exists "Users read own subscriptions" on public.pdfapi_subscriptions;
create policy "Users read own subscriptions" on public.pdfapi_subscriptions
  for select using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- Webhooks (user-configured endpoints)
-- ------------------------------------------------------------
create table if not exists public.pdfapi_webhooks (
  id          bigint generated always as identity primary key,
  user_id     uuid not null references public.pdfapi_users(id) on delete cascade,
  url         text not null,
  secret      text not null,               -- for HMAC signature verification
  events      text[] not null default '{pdf.completed,pdf.failed}',
  is_active   boolean not null default true,
  created_at  timestamptz not null default now()
);

alter table public.pdfapi_webhooks enable row level security;
drop policy if exists "Users read own webhooks" on public.pdfapi_webhooks;
create policy "Users read own webhooks" on public.pdfapi_webhooks
  for select using (auth.uid() = user_id);

-- ------------------------------------------------------------
-- Function: auto-create pdfapi_user on auth signup
-- ------------------------------------------------------------
create or replace function public.handle_pdfapi_new_user()
returns trigger language plpgsql security definer as $$
begin
  insert into public.pdfapi_users (id, email, full_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_pdfapi_auth_user_created on auth.users;
create trigger on_pdfapi_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_pdfapi_new_user();
