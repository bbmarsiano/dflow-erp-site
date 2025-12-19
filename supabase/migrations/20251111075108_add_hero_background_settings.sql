/*
  # Add Hero Background Image Settings

  1. New Columns in site_settings
    - `hero_bg_image_url` (text) - URL of the dashboard screenshot
    - `hero_bg_opacity` (numeric) - Opacity value 0-1, default 0.25
  
  2. Purpose
    - Allow admin to configure hero background image
    - Control opacity of the background image overlay
    - Provides subtle dashboard screenshot behind hero content
*/

-- Add hero background image URL column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'hero_bg_image_url'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN hero_bg_image_url text;
  END IF;
END $$;

-- Add hero background opacity column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'hero_bg_opacity'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN hero_bg_opacity numeric DEFAULT 0.25;
  END IF;
END $$;

-- Update existing row with default opacity
UPDATE site_settings
SET hero_bg_opacity = COALESCE(hero_bg_opacity, 0.25)
WHERE id IS NOT NULL;