-- ============================================================
-- AIVEXA PDF API — billing + credit period fixes (004)
-- Safe to run more than once.
-- ============================================================

-- 1) Paid plan expiry (null = free / never expires)
alter table public.pdfapi_users
  add column if not exists plan_expires_at timestamptz;

-- 2) Razorpay orders (was referenced by the code but never created)
create table if not exists public.pdfapi_payment_orders (
  id          bigint generated always as identity primary key,
  order_id    text not null unique,
  user_id     uuid not null references public.pdfapi_users(id) on delete cascade,
  plan_id     text not null references public.pdfapi_plans(id),
  cycle       text not null default 'monthly' check (cycle in ('monthly','yearly')),
  amount      int  not null,               -- paise, decided by the server
  status      text not null default 'created', -- created | paid
  payment_id  text,
  paid_at     timestamptz,
  created_at  timestamptz not null default now()
);
alter table public.pdfapi_payment_orders enable row level security;
drop policy if exists "Users read own orders" on public.pdfapi_payment_orders;
create policy "Users read own orders" on public.pdfapi_payment_orders
  for select using (auth.uid() = user_id);

-- 3) Called on every API request / dashboard load:
--    - resets the monthly credit counter when the period is over
--    - moves an expired paid plan back to Free
create or replace function public.pdfapi_refresh_user(p_user_id uuid)
returns void language plpgsql security definer as $$
begin
  update public.pdfapi_users
  set plan_id = 'free', plan_expires_at = null, updated_at = now()
  where id = p_user_id and plan_expires_at is not null and plan_expires_at <= now();

  update public.pdfapi_users
  set credits_used = 0,
      credits_reset_at = credits_reset_at
        + (ceil(extract(epoch from (now() - credits_reset_at)) / 2592000.0)::int * interval '30 days'),
      updated_at = now()
  where id = p_user_id and credits_reset_at <= now();

  -- guarantee the next reset is in the future
  update public.pdfapi_users
  set credits_reset_at = now() + interval '30 days'
  where id = p_user_id and credits_reset_at <= now();
end;
$$;

-- 4) Plan features: only list what the API really does today
update public.pdfapi_plans set features =
  '["1,000 PDFs/month","20 requests/minute","5 MB max PDF","HTML, URL to PDF + screenshots","Email support"]'
  where id = 'starter';
update public.pdfapi_plans set features =
  '["2,000 PDFs/month","50 requests/minute","10 MB max PDF","HTML, URL to PDF + screenshots","Priority support"]'
  where id = 'growth';
update public.pdfapi_plans set features =
  '["5,000 PDFs/month","150 requests/minute","25 MB max PDF","HTML, URL to PDF + screenshots","Priority WhatsApp support"]'
  where id = 'pro';
update public.pdfapi_plans set features =
  '["100 PDFs/month","5 requests/minute","2 MB max PDF","HTML, URL to PDF + screenshots","Playground + test keys"]'
  where id = 'free';

-- 5) Make sure every existing auth user has a PDF API profile
insert into public.pdfapi_users (id, email, full_name)
select u.id, coalesce(u.email, ''), split_part(coalesce(u.email,''), '@', 1)
from auth.users u
on conflict (id) do nothing;

-- 6) Billing details shown on payment receipts
alter table public.pdfapi_users add column if not exists billing_name    text;
alter table public.pdfapi_users add column if not exists billing_company text;
alter table public.pdfapi_users add column if not exists billing_gstin   text;
alter table public.pdfapi_users add column if not exists billing_address text;
