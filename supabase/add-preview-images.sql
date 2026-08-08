-- ============================================================
-- AIVEXA — Add preview_images, features, highlights columns
-- Run this in Supabase Dashboard > SQL Editor.
-- ============================================================

ALTER TABLE public.aivexa_digital_products
  ADD COLUMN IF NOT EXISTS preview_images jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS features       jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS highlights     jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS pages_count    int  NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS file_size      text NOT NULL DEFAULT '';
