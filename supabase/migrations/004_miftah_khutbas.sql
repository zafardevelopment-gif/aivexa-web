-- Miftah › Juma Khutba (Makkah & Madinah) — run once in the AIVEXA Supabase SQL editor.
-- Added weekly by the admin (aivexallp.com/admin/khutba). Service-role only
-- (RLS on, no policies): read by the public JSON routes, written by server actions.
create table if not exists miftah_khutbas (
  id           uuid primary key default gen_random_uuid(),
  masjid       text not null check (masjid in ('makkah', 'madinah')),
  date         date not null,                    -- Friday (Gregorian)
  hijri        text,                             -- e.g. "15 Rabi al-Akhir 1448"
  khateeb      text not null,                    -- name in Latin script
  khateeb_ar   text,                             -- name in Arabic
  title        jsonb not null default '{}'::jsonb, -- {"ar": "...", "en": "...", "ur": "..."}
  arabic       text not null,                    -- full Arabic text
  translations jsonb not null default '{}'::jsonb, -- {"en": "...", "hi": "...", "ur": "...", "bn": "...", "ml": "...", "id": "..."}
  source_url   text,                             -- where the text was obtained (official source)
  published    boolean not null default true,
  created_at   timestamptz not null default now(),
  updated_at   timestamptz not null default now(),
  unique (masjid, date)
);
alter table miftah_khutbas enable row level security;
create index if not exists miftah_khutbas_date_idx on miftah_khutbas (date desc);
