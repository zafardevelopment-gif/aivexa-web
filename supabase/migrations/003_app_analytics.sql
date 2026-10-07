-- App Analytics (admin) — run once in the AIVEXA Supabase SQL editor.
-- Service-role only (RLS on, no policies): read/written by server actions.

-- Install numbers per app (entered from Play Console › Statistics).
create table if not exists app_metrics (
  app           text primary key,          -- 'calivo' | 'miftah'
  installs      integer not null default 0,
  installs_as_of date,
  notes         text,
  updated_at    timestamptz not null default now()
);
alter table app_metrics enable row level security;

-- Miftah Qur'an-education fund shown in the app (/miftah/impact.json).
create table if not exists miftah_impact (
  id         integer primary key default 1 check (id = 1),
  data       jsonb not null,
  updated_at timestamptz not null default now()
);
alter table miftah_impact enable row level security;

insert into miftah_impact (id, data) values (1, '{
  "updated": "2026-10-07",
  "currency": "INR",
  "collected": 1000,
  "share_percent": 20,
  "pledged": 200,
  "donated": 200,
  "recipient": {"name": "Al-Mahad Lil Tahfizul Quran", "address": "Doghra, Darbhanga, Bihar, India 847302"},
  "donations": [{"date": "2026-10-07", "amount": 200}]
}'::jsonb)
on conflict (id) do nothing;

insert into app_metrics (app, installs) values ('calivo', 0), ('miftah', 0)
on conflict (app) do nothing;
