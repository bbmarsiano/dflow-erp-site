/*
  # Add Design Settings

  1. New Columns in site_settings
    - Add `logo_scale` (text) - Logo scale percentage, default '100'
    - Add `accent_color` (text) - Primary accent color hex, default '#de3c3c'

  2. Purpose
    - Allow admin to customize logo size
    - Allow admin to customize primary accent color
    - These settings only affect visual appearance, not functionality
*/

-- Add logo_scale column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'logo_scale'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN logo_scale text DEFAULT '100';
  END IF;
END $$;

-- Add accent_color column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'accent_color'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN accent_color text DEFAULT '#de3c3c';
  END IF;
END $$;

-- Update existing row with defaults if they are NULL
UPDATE site_settings
SET 
  logo_scale = COALESCE(logo_scale, '100'),
  accent_color = COALESCE(accent_color, '#de3c3c')
WHERE id IS NOT NULL;

