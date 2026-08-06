-- ============================================================
-- AIVEXA — Digital Products & Orders Tables
-- Run this in Supabase Dashboard > SQL Editor.
-- ============================================================

-- ------------------------------------------------------------
-- Digital Products (PDFs, planners, templates for sale)
-- ------------------------------------------------------------
create table if not exists public.aivexa_digital_products (
  id             bigint generated always as identity primary key,
  slug           text not null unique,
  name           text not null,
  tagline        text not null default '',
  description    text not null default '',
  price          int  not null default 0,        -- in paise (₹99 = 9900)
  original_price int  not null default 0,        -- strike-through price, 0 = none
  category       text not null default '',       -- e.g. PDF, Planner, Template
  preview_image  text not null default '',       -- public URL of product thumbnail
  file_url       text not null default '',       -- private/signed URL — delivered post-payment
  is_active      boolean not null default true,
  is_featured    boolean not null default false, -- show on home page
  sort_order     int  not null default 0
);

alter table public.aivexa_digital_products enable row level security;
drop policy if exists "Public read digital products" on public.aivexa_digital_products;
create policy "Public read digital products" on public.aivexa_digital_products
  for select using (is_active);

-- ------------------------------------------------------------
-- Orders (Razorpay payment records)
-- ------------------------------------------------------------
create table if not exists public.aivexa_orders (
  id                  bigint generated always as identity primary key,
  razorpay_order_id   text not null unique,
  razorpay_payment_id text not null default '',
  razorpay_signature  text not null default '',
  product_id          bigint not null references public.aivexa_digital_products(id),
  product_slug        text not null default '',
  buyer_name          text not null default '',
  buyer_email         text not null,
  buyer_phone         text not null default '',
  amount_paise        int  not null,
  status              text not null default 'created',  -- created | paid | failed
  created_at          timestamptz not null default now()
);

alter table public.aivexa_orders enable row level security;
drop policy if exists "Anyone can create order" on public.aivexa_orders;
create policy "Anyone can create order" on public.aivexa_orders
  for insert with check (true);
-- No select/update policy — orders readable only via service_role (admin)
