/*
  # Add Site Logo and Slogan Settings

  1. New Columns
    - Add `site_slogan_en` (English slogan)
    - Add `site_slogan_bg` (Bulgarian slogan)
    - Rename `logo_url` usage to support custom logo
  
  2. Purpose
    - Allow admin to customize site branding
    - Support editable slogan displayed under logo
    - Bilingual slogan support
*/

-- Add slogan columns
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'site_slogan_en'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN site_slogan_en text DEFAULT 'Enhace your workflow';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'site_slogan_bg'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN site_slogan_bg text DEFAULT 'Подобрете работния си процес';
  END IF;
END $$;

-- Update existing row if exists
UPDATE site_settings
SET 
  site_slogan_en = COALESCE(site_slogan_en, 'Enhace your workflow'),
  site_slogan_bg = COALESCE(site_slogan_bg, 'Подобрете работния си процес')
WHERE id IS NOT NULL;