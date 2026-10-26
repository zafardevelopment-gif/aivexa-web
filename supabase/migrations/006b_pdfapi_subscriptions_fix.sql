-- 006b: pdfapi_subscriptions already existed from an older setup with different
-- column names, so 006 skipped it. Add the columns the auto-pay code uses.
alter table public.pdfapi_subscriptions add column if not exists rzp_subscription_id text;
alter table public.pdfapi_subscriptions add column if not exists cycle text not null default 'monthly';
alter table public.pdfapi_subscriptions add column if not exists current_end timestamptz;
alter table public.pdfapi_subscriptions add column if not exists cancel_at_cycle_end boolean not null default false;
alter table public.pdfapi_subscriptions add column if not exists updated_at timestamptz not null default now();
alter table public.pdfapi_subscriptions alter column status set default 'created';
create unique index if not exists pdfapi_subscriptions_rzp_id_key on public.pdfapi_subscriptions(rzp_subscription_id);
