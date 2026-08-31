-- ============================================================
-- AIVEXA — Branded Apps Module
-- Migration: 001_branded_apps.sql
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: branded_apps
-- ============================================================
CREATE TABLE IF NOT EXISTS branded_apps (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  tenant_name         TEXT NOT NULL,
  package_name        TEXT NOT NULL UNIQUE,
  app_display_name    TEXT NOT NULL,
  short_description   TEXT NOT NULL DEFAULT '',
  full_description    TEXT NOT NULL DEFAULT '',
  primary_color       TEXT NOT NULL DEFAULT '#4f46e5',
  secondary_color     TEXT NOT NULL DEFAULT '#10b981',
  icon_url            TEXT,
  feature_graphic_url TEXT,
  category            TEXT NOT NULL DEFAULT 'PRODUCTIVITY',
  content_rating      TEXT NOT NULL DEFAULT 'EVERYONE',
  default_language    TEXT NOT NULL DEFAULT 'en-US',
  release_track       TEXT NOT NULL DEFAULT 'internal',
  website_url         TEXT,
  email               TEXT,
  phone               TEXT,
  privacy_policy_url  TEXT,
  status              TEXT NOT NULL DEFAULT 'DRAFT',
  -- status values: DRAFT | PUBLISHING | SUBMITTED | PROCESSING | PUBLISHED | FAILED | MANUAL_ACTION_REQUIRED
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT branded_apps_status_check CHECK (status IN (
    'DRAFT','PUBLISHING','SUBMITTED','PROCESSING','PUBLISHED','FAILED','MANUAL_ACTION_REQUIRED'
  )),
  CONSTRAINT branded_apps_track_check CHECK (release_track IN (
    'internal','alpha','beta','production'
  )),
  CONSTRAINT branded_apps_pkg_format CHECK (
    package_name ~ '^[a-z][a-z0-9_]*(\.[a-z][a-z0-9_]*){2,}$'
  )
);

CREATE INDEX idx_branded_apps_status ON branded_apps(status);
CREATE INDEX idx_branded_apps_created ON branded_apps(created_at DESC);

-- ============================================================
-- TABLE: publishing_jobs
-- ============================================================
CREATE TABLE IF NOT EXISTS publishing_jobs (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branded_app_id    UUID NOT NULL REFERENCES branded_apps(id) ON DELETE CASCADE,
  status            TEXT NOT NULL DEFAULT 'DRAFT',
  -- DRAFT | VALIDATING | BUILDING | BUILT | UPLOADING | CONFIGURING_LISTING
  -- VALIDATING_PLAY_EDIT | READY_TO_COMMIT | COMMITTING | SUBMITTED
  -- PROCESSING | PUBLISHED | BUILD_FAILED | UPLOAD_FAILED | FAILED | MANUAL_ACTION_REQUIRED
  current_step      TEXT,
  play_edit_id      TEXT,           -- Google Play edit transaction ID
  aab_version_code  BIGINT,
  error_message     TEXT,
  retry_count       INT NOT NULL DEFAULT 0,
  completed_at      TIMESTAMPTZ,
  created_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT publishing_jobs_status_check CHECK (status IN (
    'DRAFT','VALIDATING','BUILDING','BUILT','UPLOADING','CONFIGURING_LISTING',
    'VALIDATING_PLAY_EDIT','READY_TO_COMMIT','COMMITTING','SUBMITTED',
    'PROCESSING','PUBLISHED','BUILD_FAILED','UPLOAD_FAILED','FAILED','MANUAL_ACTION_REQUIRED'
  ))
);

CREATE INDEX idx_publishing_jobs_app ON publishing_jobs(branded_app_id);
CREATE INDEX idx_publishing_jobs_status ON publishing_jobs(status);
CREATE INDEX idx_publishing_jobs_created ON publishing_jobs(created_at DESC);

-- ============================================================
-- TABLE: publishing_steps
-- (granular step log per job — append-only)
-- ============================================================
CREATE TABLE IF NOT EXISTS publishing_steps (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  job_id          UUID NOT NULL REFERENCES publishing_jobs(id) ON DELETE CASCADE,
  step_name       TEXT NOT NULL,
  status          TEXT NOT NULL DEFAULT 'PENDING',
  -- PENDING | RUNNING | COMPLETED | SKIPPED | FAILED
  started_at      TIMESTAMPTZ,
  completed_at    TIMESTAMPTZ,
  duration_ms     INT,
  error_message   TEXT,
  metadata        JSONB,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_publishing_steps_job ON publishing_steps(job_id);

-- ============================================================
-- TABLE: branding_assets
-- (app icon, feature graphic, screenshots per app)
-- ============================================================
CREATE TABLE IF NOT EXISTS branding_assets (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branded_app_id  UUID NOT NULL REFERENCES branded_apps(id) ON DELETE CASCADE,
  asset_type      TEXT NOT NULL,
  -- icon | feature_graphic | phone_screenshot | tablet_screenshot | tv_screenshot
  storage_path    TEXT NOT NULL,   -- Supabase Storage path
  public_url      TEXT,
  width_px        INT,
  height_px       INT,
  file_size_bytes BIGINT,
  mime_type       TEXT,
  uploaded_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_branding_assets_app ON branding_assets(branded_app_id);
CREATE INDEX idx_branding_assets_type ON branding_assets(branded_app_id, asset_type);

-- ============================================================
-- TABLE: publisher_accounts
-- (Google Play Developer accounts — credential ref in Vault)
-- ============================================================
CREATE TABLE IF NOT EXISTS publisher_accounts (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  account_name        TEXT NOT NULL,
  developer_account_id TEXT NOT NULL UNIQUE,  -- Google's numeric developer account ID
  credential_ref      TEXT NOT NULL,          -- UUID of secret in Supabase Vault (NEVER the key itself)
  is_active           BOOLEAN NOT NULL DEFAULT TRUE,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- TABLE: app_publisher_assignments
-- (which publisher account manages which branded app)
-- ============================================================
CREATE TABLE IF NOT EXISTS app_publisher_assignments (
  id                    UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  branded_app_id        UUID NOT NULL REFERENCES branded_apps(id) ON DELETE CASCADE,
  publisher_account_id  UUID NOT NULL REFERENCES publisher_accounts(id),
  assigned_at           TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(branded_app_id)  -- one publisher per app
);

-- ============================================================
-- TABLE: audit_logs
-- (INSERT-ONLY — no UPDATE/DELETE ever granted)
-- ============================================================
CREATE TABLE IF NOT EXISTS branded_app_audit_logs (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  entity_type     TEXT NOT NULL,  -- branded_app | publishing_job | publisher_account
  entity_id       UUID NOT NULL,
  action          TEXT NOT NULL,  -- created | updated | deleted | publish_started | publish_completed | publish_failed
  actor           TEXT,           -- admin user identifier
  old_value       JSONB,
  new_value       JSONB,
  ip_address      INET,
  user_agent      TEXT,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_audit_logs_entity ON branded_app_audit_logs(entity_type, entity_id);
CREATE INDEX idx_audit_logs_created ON branded_app_audit_logs(created_at DESC);

-- ============================================================
-- AUTO-UPDATE updated_at trigger
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER branded_apps_updated_at
  BEFORE UPDATE ON branded_apps
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER publishing_jobs_updated_at
  BEFORE UPDATE ON publishing_jobs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER publisher_accounts_updated_at
  BEFORE UPDATE ON publisher_accounts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY
-- (All tables locked down — service role bypasses RLS)
-- ============================================================
ALTER TABLE branded_apps ENABLE ROW LEVEL SECURITY;
ALTER TABLE publishing_jobs ENABLE ROW LEVEL SECURITY;
ALTER TABLE publishing_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE branding_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE publisher_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE app_publisher_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE branded_app_audit_logs ENABLE ROW LEVEL SECURITY;

-- Admin (service_role) can do everything — policies below deny anon/authenticated
-- audit_logs: no UPDATE/DELETE ever
CREATE POLICY "audit_logs_insert_only" ON branded_app_audit_logs
  FOR INSERT WITH CHECK (TRUE);

CREATE POLICY "audit_logs_select_service" ON branded_app_audit_logs
  FOR SELECT USING (auth.role() = 'service_role');

-- All other tables: service_role only (no public/authenticated access)
CREATE POLICY "branded_apps_service_only" ON branded_apps
  USING (auth.role() = 'service_role');

CREATE POLICY "publishing_jobs_service_only" ON publishing_jobs
  USING (auth.role() = 'service_role');

CREATE POLICY "publishing_steps_service_only" ON publishing_steps
  USING (auth.role() = 'service_role');

CREATE POLICY "branding_assets_service_only" ON branding_assets
  USING (auth.role() = 'service_role');

CREATE POLICY "publisher_accounts_service_only" ON publisher_accounts
  USING (auth.role() = 'service_role');

CREATE POLICY "app_publisher_assignments_service_only" ON app_publisher_assignments
  USING (auth.role() = 'service_role');

-- ============================================================
-- COMMENTS (documentation)
-- ============================================================
COMMENT ON TABLE branded_apps IS 'Each row = one white-label Android app for a client/tenant';
COMMENT ON COLUMN branded_apps.package_name IS 'Immutable after first Play publish. Format: com.company.app';
COMMENT ON COLUMN branded_apps.status IS 'Lifecycle status: DRAFT → PUBLISHING → PUBLISHED';

COMMENT ON TABLE publishing_jobs IS 'One job per publish attempt per app. State machine drives the build/upload pipeline.';
COMMENT ON COLUMN publishing_jobs.play_edit_id IS 'Google Play edit transaction ID — do not expose to frontend';
COMMENT ON COLUMN publishing_jobs.error_message IS 'Server-side only — never forward raw error to frontend';

COMMENT ON TABLE publisher_accounts IS 'Google Play Developer accounts. credential_ref points to Supabase Vault secret UUID.';
COMMENT ON COLUMN publisher_accounts.credential_ref IS 'Supabase Vault secret UUID for service account JSON key — NEVER the key itself';

COMMENT ON TABLE branded_app_audit_logs IS 'Append-only audit trail. No UPDATE or DELETE permitted via RLS.';
