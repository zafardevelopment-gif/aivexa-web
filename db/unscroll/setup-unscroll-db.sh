#!/usr/bin/env bash
# Unscroll DB setup for the VPS.
# Default: uses the self-hosted Supabase Postgres container "aivexa-db" (host port 6002)
# and creates a SEPARATE database "unscroll" inside it (website data untouched).
#   bash db/unscroll/setup-unscroll-db.sh
# Other container/port:  DB_CONTAINER=nsa-db DB_HOST_PORT=5003 bash db/unscroll/setup-unscroll-db.sh
# Native Postgres (no Docker):  DB_CONTAINER= DB_HOST_PORT=5432 bash db/unscroll/setup-unscroll-db.sh
# Safe to re-run: keeps the same password (~/.unscroll_db_password), schema uses IF NOT EXISTS.
set -euo pipefail

DB_CONTAINER="${DB_CONTAINER-aivexa-db}"
DB_HOST_PORT="${DB_HOST_PORT-6002}"
DB_NAME="unscroll"
DB_USER="unscroll"
PASS_FILE="$HOME/.unscroll_db_password"

if [ -f "$PASS_FILE" ]; then
  DB_PASS="$(cat "$PASS_FILE")"
else
  DB_PASS="$(openssl rand -hex 24)"
  ( umask 077; echo "$DB_PASS" > "$PASS_FILE" )
fi

# Admin psql (superuser) and app psql (as unscroll), inside the container or native.
admin_psql() {
  if [ -n "$DB_CONTAINER" ]; then
    docker exec -i "$DB_CONTAINER" psql -h 127.0.0.1 -U "$ADMIN_USER" -v ON_ERROR_STOP=1 -q "$@"
  else
    sudo -u postgres psql -v ON_ERROR_STOP=1 -q "$@"
  fi
}
app_psql() {
  if [ -n "$DB_CONTAINER" ]; then
    docker exec -i -e PGPASSWORD="$DB_PASS" "$DB_CONTAINER" psql -h 127.0.0.1 -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 -q "$@"
  else
    PGPASSWORD="$DB_PASS" psql -h 127.0.0.1 -U "$DB_USER" -d "$DB_NAME" -v ON_ERROR_STOP=1 -q "$@"
  fi
}

# Find a superuser login inside the container (probe must not read the heredoc on stdin).
ADMIN_USER=""
if [ -n "$DB_CONTAINER" ]; then
  for u in supabase_admin postgres; do
    if docker exec "$DB_CONTAINER" psql -h 127.0.0.1 -U "$u" -d postgres -tAc "select 1" </dev/null >/dev/null 2>&1; then
      ADMIN_USER="$u"; break
    fi
  done
  [ -n "$ADMIN_USER" ] || { echo "Container $DB_CONTAINER mein admin login nahi hua (supabase_admin/postgres)." >&2; exit 1; }
  echo "Admin user: $ADMIN_USER"
fi

echo "== Role aur database bana rahe hain (${DB_CONTAINER:-native}) =="
admin_psql -d postgres <<SQL
DO \$\$ BEGIN
  IF NOT EXISTS (SELECT FROM pg_roles WHERE rolname = '$DB_USER') THEN
    CREATE ROLE $DB_USER LOGIN PASSWORD '$DB_PASS';
  ELSE
    ALTER ROLE $DB_USER LOGIN PASSWORD '$DB_PASS';
  END IF;
END \$\$;
SQL
if ! admin_psql -d postgres -tAc "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'" | grep -q 1; then
  admin_psql -d postgres -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
fi
admin_psql -d "$DB_NAME" -c "CREATE EXTENSION IF NOT EXISTS pgcrypto; GRANT ALL ON SCHEMA public TO $DB_USER;"

echo "== Schema load ho raha hai =="
app_psql <<'SQL_EOF'
-- Unscroll family backend — PostgreSQL schema (VPS database).
-- Run once:  psql "$UNSCROLL_DATABASE_URL" -f db/unscroll/001_unscroll.sql
-- Safe to re-run (IF NOT EXISTS everywhere).

CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Parents (and individual users) who sign in with an email code.
CREATE TABLE IF NOT EXISTS unscroll_users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text NOT NULL UNIQUE,
  display_name  text NOT NULL DEFAULT '',
  role          text NOT NULL DEFAULT 'parent' CHECK (role IN ('individual', 'parent')),
  family_id     uuid,
  created_at    timestamptz NOT NULL DEFAULT now(),
  last_seen_at  timestamptz
);

CREATE TABLE IF NOT EXISTS unscroll_families (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id    uuid NOT NULL REFERENCES unscroll_users(id) ON DELETE CASCADE,
  -- IANA time zone used to decide "today" for bonus time and daily summaries.
  time_zone   text NOT NULL DEFAULT 'Asia/Kolkata',
  created_at  timestamptz NOT NULL DEFAULT now()
);
DO $$ BEGIN
  ALTER TABLE unscroll_users ADD CONSTRAINT unscroll_users_family_fk FOREIGN KEY (family_id) REFERENCES unscroll_families(id) ON DELETE SET NULL;
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

-- One-time email sign-in codes (only a hash of the code is stored).
CREATE TABLE IF NOT EXISTS unscroll_email_challenges (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email       text NOT NULL,
  code_hash   text NOT NULL,
  attempts    int  NOT NULL DEFAULT 0,
  expires_at  timestamptz NOT NULL,
  used_at     timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS unscroll_email_challenges_email_idx ON unscroll_email_challenges (email, created_at DESC);

-- Login sessions: opaque tokens, stored as SHA-256 hashes.
CREATE TABLE IF NOT EXISTS unscroll_sessions (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             uuid NOT NULL REFERENCES unscroll_users(id) ON DELETE CASCADE,
  access_hash         text NOT NULL UNIQUE,
  refresh_hash        text NOT NULL UNIQUE,
  access_expires_at   timestamptz NOT NULL,
  refresh_expires_at  timestamptz NOT NULL,
  revoked_at          timestamptz,
  created_at          timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS unscroll_sessions_user_idx ON unscroll_sessions (user_id);

CREATE TABLE IF NOT EXISTS unscroll_children (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id   uuid NOT NULL REFERENCES unscroll_families(id) ON DELETE CASCADE,
  name        text NOT NULL,
  birth_year  int,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS unscroll_children_family_idx ON unscroll_children (family_id);

-- Short-lived 6-digit codes the parent shows and the child's phone enters.
CREATE TABLE IF NOT EXISTS unscroll_pairing_codes (
  code        text PRIMARY KEY,
  child_id    uuid NOT NULL REFERENCES unscroll_children(id) ON DELETE CASCADE,
  expires_at  timestamptz NOT NULL,
  used_at     timestamptz,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- The child's phone. One active device per child; pairing again replaces it.
CREATE TABLE IF NOT EXISTS unscroll_devices (
  id             uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id       uuid NOT NULL REFERENCES unscroll_children(id) ON DELETE CASCADE,
  token_hash     text NOT NULL UNIQUE,
  model          text NOT NULL DEFAULT '',
  os             text NOT NULL DEFAULT 'android',
  app_version    text NOT NULL DEFAULT '',
  guard_running  boolean,
  permissions    jsonb NOT NULL DEFAULT '{}'::jsonb,
  last_sync_at   timestamptz,
  revoked_at     timestamptz,
  created_at     timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS unscroll_devices_child_idx ON unscroll_devices (child_id) WHERE revoked_at IS NULL;

-- Rules the parent sets (RuleSet JSON from the app). bonus_day: the family-local day
-- that rules.bonusMinutes were granted for; bonus time expires when the day changes.
CREATE TABLE IF NOT EXISTS unscroll_rules (
  child_id    uuid PRIMARY KEY REFERENCES unscroll_children(id) ON DELETE CASCADE,
  rules       jsonb NOT NULL,
  bonus_day   text,
  updated_at  timestamptz NOT NULL DEFAULT now()
);

-- Daily usage uploaded by the child's phone (one row per child per local day).
CREATE TABLE IF NOT EXISTS unscroll_usage_days (
  child_id    uuid NOT NULL REFERENCES unscroll_children(id) ON DELETE CASCADE,
  day_key     text NOT NULL,
  total_ms    bigint NOT NULL DEFAULT 0,
  unlocks     int,
  apps        jsonb NOT NULL DEFAULT '[]'::jsonb,
  source      text NOT NULL DEFAULT 'device',
  updated_at  timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (child_id, day_key)
);

CREATE TABLE IF NOT EXISTS unscroll_extra_time_requests (
  id               uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  child_id         uuid NOT NULL REFERENCES unscroll_children(id) ON DELETE CASCADE,
  package_name     text NOT NULL,
  label            text NOT NULL,
  minutes          int  NOT NULL CHECK (minutes BETWEEN 1 AND 600),
  reason           text,
  status           text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied')),
  granted_minutes  int,
  created_at       timestamptz NOT NULL DEFAULT now(),
  decided_at       timestamptz
);
CREATE INDEX IF NOT EXISTS unscroll_requests_child_idx ON unscroll_extra_time_requests (child_id, created_at DESC);

-- Alerts shown in the parent's app and sent as push notifications.
CREATE TABLE IF NOT EXISTS unscroll_alerts (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  family_id   uuid NOT NULL REFERENCES unscroll_families(id) ON DELETE CASCADE,
  child_id    uuid REFERENCES unscroll_children(id) ON DELETE CASCADE,
  kind        text NOT NULL,
  title       text NOT NULL,
  body        text NOT NULL,
  read        boolean NOT NULL DEFAULT false,
  -- Prevents the same alert twice (e.g. one "limit reached" per app per day).
  dedupe_key  text UNIQUE,
  created_at  timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS unscroll_alerts_family_idx ON unscroll_alerts (family_id, created_at DESC);

-- Firebase Cloud Messaging tokens, for a parent (user_id) or a child's phone (device_id).
CREATE TABLE IF NOT EXISTS unscroll_push_tokens (
  token       text PRIMARY KEY,
  user_id     uuid REFERENCES unscroll_users(id) ON DELETE CASCADE,
  device_id   uuid REFERENCES unscroll_devices(id) ON DELETE CASCADE,
  platform    text NOT NULL DEFAULT 'android',
  updated_at  timestamptz NOT NULL DEFAULT now(),
  CHECK (user_id IS NOT NULL OR device_id IS NOT NULL)
);
CREATE INDEX IF NOT EXISTS unscroll_push_tokens_user_idx ON unscroll_push_tokens (user_id);
CREATE INDEX IF NOT EXISTS unscroll_push_tokens_device_idx ON unscroll_push_tokens (device_id);

-- Plan state (Google Play verification comes later; the owner build unlocks everything).
CREATE TABLE IF NOT EXISTS unscroll_subscriptions (
  user_id      uuid PRIMARY KEY REFERENCES unscroll_users(id) ON DELETE CASCADE,
  tier         text NOT NULL DEFAULT 'free',
  status       text NOT NULL DEFAULT 'none',
  expires_at   timestamptz,
  verified_at  timestamptz
);

-- Anonymous app opens for the admin App Analytics page (no account needed).
-- install_id is a random id created by the app; no personal data.
CREATE TABLE IF NOT EXISTS unscroll_daily_active (
  install_id   text NOT NULL,
  day          date NOT NULL,
  mode         text NOT NULL DEFAULT 'individual',
  app_version  text,
  first_at     timestamptz NOT NULL DEFAULT now(),
  last_at      timestamptz NOT NULL DEFAULT now(),
  opens        int  NOT NULL DEFAULT 1,
  PRIMARY KEY (install_id, day)
);
CREATE INDEX IF NOT EXISTS unscroll_daily_active_day_idx ON unscroll_daily_active (day);
CREATE TABLE IF NOT EXISTS unscroll_app_opens (
  install_id  text NOT NULL,
  opened_at   timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS unscroll_app_opens_at_idx ON unscroll_app_opens (opened_at);

-- Razorpay billing (website checkout, UPI Autopay / card).
ALTER TABLE unscroll_subscriptions ADD COLUMN IF NOT EXISTS provider             text;
ALTER TABLE unscroll_subscriptions ADD COLUMN IF NOT EXISTS plan_key             text;
ALTER TABLE unscroll_subscriptions ADD COLUMN IF NOT EXISTS rzp_subscription_id  text;
ALTER TABLE unscroll_subscriptions ADD COLUMN IF NOT EXISTS cancel_at_period_end boolean NOT NULL DEFAULT false;
ALTER TABLE unscroll_subscriptions ADD COLUMN IF NOT EXISTS updated_at           timestamptz NOT NULL DEFAULT now();

-- Razorpay plan ids, created automatically the first time a plan is bought (re-created if the price changes).
CREATE TABLE IF NOT EXISTS unscroll_rzp_plans (
  plan_key     text PRIMARY KEY,
  amount       int  NOT NULL,           -- paise, incl. GST
  rzp_plan_id  text NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now()
);

-- Every checkout the app starts (one Razorpay subscription each).
CREATE TABLE IF NOT EXISTS unscroll_rzp_checkouts (
  rzp_subscription_id  text PRIMARY KEY,
  user_id              uuid NOT NULL REFERENCES unscroll_users(id) ON DELETE CASCADE,
  plan_key             text NOT NULL,
  status               text NOT NULL DEFAULT 'created',
  created_at           timestamptz NOT NULL DEFAULT now(),
  updated_at           timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS unscroll_rzp_checkouts_user_idx ON unscroll_rzp_checkouts (user_id, created_at DESC);

-- Successful payments (first payment + every renewal). Safe against duplicates.
CREATE TABLE IF NOT EXISTS unscroll_payments (
  payment_id           text PRIMARY KEY,
  user_id              uuid REFERENCES unscroll_users(id) ON DELETE SET NULL,
  plan_key             text NOT NULL,
  amount               int  NOT NULL,   -- paise
  rzp_subscription_id  text,
  created_at           timestamptz NOT NULL DEFAULT now()
);

-- Prices set from the admin panel (App Analytics › Unscroll). Missing rows = defaults in lib/unscroll/billing.ts.
CREATE TABLE IF NOT EXISTS unscroll_plan_prices (
  plan_key    text PRIMARY KEY,
  amount      int  NOT NULL,           -- paise, incl. GST
  updated_at  timestamptz NOT NULL DEFAULT now()
);
SQL_EOF

echo "== Tables =="
app_psql -tAc "SELECT table_name FROM information_schema.tables WHERE table_schema='public' AND table_name LIKE 'unscroll_%' ORDER BY 1;"

URL="postgres://$DB_USER:$DB_PASS@127.0.0.1:$DB_HOST_PORT/$DB_NAME"
echo "== Host se connection test (port $DB_HOST_PORT) =="
if command -v psql >/dev/null; then
  if psql "$URL" -tAc "select 'host connection OK'" 2>/tmp/unscroll_conn_err; then :; else
    echo "WARNING: host se connect nahi hua:"; cat /tmp/unscroll_conn_err
  fi
fi

echo
echo "DONE. Yeh line /var/www/aivexa-web/.env.local mein daalein (ya purani UNSCROLL_DATABASE_URL replace karein):"
echo "UNSCROLL_DATABASE_URL=$URL"
