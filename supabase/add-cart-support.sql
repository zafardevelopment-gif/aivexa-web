-- ============================================================
-- AIVEXA — Cart support: update aivexa_orders table
-- Run in Supabase Dashboard > SQL Editor
-- ============================================================

-- Add items JSONB column (stores all products in a cart order)
alter table public.aivexa_orders
  add column if not exists items jsonb not null default '[]';

-- Make product_id nullable (cart orders don't have a single product)
alter table public.aivexa_orders
  alter column product_id drop not null;
