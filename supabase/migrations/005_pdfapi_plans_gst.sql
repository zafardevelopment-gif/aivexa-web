-- ============================================================
-- AIVEXA PDF API — new plan ladder (INR, +18% GST) (005)
-- Safe to run more than once.
-- ============================================================

-- Plan ladder. Ids stay the same so old orders keep working:
--   free → Free, starter → Startup, growth → Standard, pro → Scale
-- Yearly = 10 × monthly (2 months free). Prices are in paise, before GST.
-- sort_order >= 10 = "higher" plans (hidden behind "Show higher plans").
insert into public.pdfapi_plans
  (id, name, price_monthly, price_yearly, credits, parallel, max_pdf_bytes, rate_limit_rpm, features, sort_order, is_active)
values
  ('free',       'Free',       0,       0,        100,   1,  1048576,   10,
     '["1 parallel conversion","All customization options","1 MB max PDF size","HTML, URL to PDF + screenshots"]', 0, true),
  ('starter',    'Startup',    74900,   749000,   1000,  3,  52428800,  60,
     '["3 parallel conversions","All customization options","Up to 50 MB PDF size","Hindi, Urdu & Arabic fonts"]', 1, true),
  ('growth',     'Standard',   209900,  2099000,  5000,  10, 52428800,  120,
     '["10 parallel conversions","All customization options","Up to 50 MB PDF size","Priority email support"]', 2, true),
  ('pro',        'Scale',      324900,  3249000,  10000, 20, 52428800,  240,
     '["20 parallel conversions","All customization options","Up to 50 MB PDF size","Priority WhatsApp support"]', 3, true),
  ('business',   'Business',   649900,  6499000,  25000, 30, 104857600, 400,
     '["30 parallel conversions","All customization options","Up to 100 MB PDF size","Priority WhatsApp support"]', 10, true),
  ('enterprise', 'Enterprise', 1249900, 12499000, 50000, 50, 104857600, 600,
     '["50 parallel conversions","All customization options","Up to 100 MB PDF size","Dedicated support line"]', 11, true)
on conflict (id) do update set
  name = excluded.name, price_monthly = excluded.price_monthly, price_yearly = excluded.price_yearly,
  credits = excluded.credits, parallel = excluded.parallel, max_pdf_bytes = excluded.max_pdf_bytes,
  rate_limit_rpm = excluded.rate_limit_rpm, features = excluded.features, sort_order = excluded.sort_order,
  is_active = excluded.is_active;

-- GST split saved with every order (amount = total charged incl. GST)
alter table public.pdfapi_payment_orders add column if not exists base_amount int;
alter table public.pdfapi_payment_orders add column if not exists gst_amount  int;
alter table public.pdfapi_payment_orders add column if not exists gst_rate    numeric(5,2);

-- Large PDFs: 1 credit per started 5 MB
create or replace function public.pdfapi_increment_credits_by(p_user_id uuid, p_n int)
returns void language plpgsql security definer as $$
begin
  update public.pdfapi_users
  set credits_used = credits_used + greatest(p_n, 1), updated_at = now()
  where id = p_user_id;
end;
$$;
