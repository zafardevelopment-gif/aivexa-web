-- ============================================================
-- AIVEXA PDF API — auto-pay (Razorpay Subscriptions) (006)
-- Safe to run more than once.
-- ============================================================

-- Razorpay plan ids, created by the app on first use and re-created when the price changes
alter table public.pdfapi_plans add column if not exists rzp_plan_monthly  text;
alter table public.pdfapi_plans add column if not exists rzp_plan_yearly   text;
alter table public.pdfapi_plans add column if not exists rzp_amount_monthly int;  -- total incl. GST the Razorpay plan was made for
alter table public.pdfapi_plans add column if not exists rzp_amount_yearly  int;

create table if not exists public.pdfapi_subscriptions (
  id                  bigint generated always as identity primary key,
  user_id             uuid not null references public.pdfapi_users(id) on delete cascade,
  rzp_subscription_id text not null unique,
  plan_id             text not null references public.pdfapi_plans(id),
  cycle               text not null check (cycle in ('monthly','yearly')),
  status              text not null default 'created', -- created|authenticated|active|pending|halted|cancelled|completed
  current_end         timestamptz,
  cancel_at_cycle_end boolean not null default false,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now()
);
create index if not exists pdfapi_subscriptions_user_idx on public.pdfapi_subscriptions(user_id);
alter table public.pdfapi_subscriptions enable row level security;
drop policy if exists "Users read own subscriptions" on public.pdfapi_subscriptions;
create policy "Users read own subscriptions" on public.pdfapi_subscriptions
  for select using (auth.uid() = user_id);

-- Orders created by auto-debits point back to their subscription
alter table public.pdfapi_payment_orders add column if not exists rzp_subscription_id text;
