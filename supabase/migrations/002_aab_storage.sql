-- Adds AAB artifact tracking to branded_apps.
-- The AAB file itself lives in the private Supabase Storage bucket "branded-apps".
ALTER TABLE branded_apps ADD COLUMN IF NOT EXISTS aab_path TEXT;
ALTER TABLE branded_apps ADD COLUMN IF NOT EXISTS aab_version_code BIGINT;

COMMENT ON COLUMN branded_apps.aab_path IS 'Storage path of uploaded .aab in private bucket branded-apps';

-- Private bucket for AAB files (create if missing)
INSERT INTO storage.buckets (id, name, public)
VALUES ('branded-apps', 'branded-apps', false)
ON CONFLICT (id) DO NOTHING;
