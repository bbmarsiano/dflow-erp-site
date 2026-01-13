/*
  # Add Button Styles and Hero Design Settings

  1. New Columns in site_settings
    - Button primary: color, gradient_from, gradient_to, gradient_enabled
    - Button secondary: color, gradient_from, gradient_to, gradient_enabled
    - Hero design: title_color, subtitle_color, slogan_color, title_font_weight

  2. Purpose
    - Allow admin to customize button styles (solid or gradient)
    - Allow admin to customize hero text colors and font weight
    - These settings only affect visual appearance, not functionality
*/

-- Add button primary settings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'button_primary_color'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN button_primary_color text DEFAULT '#2563eb';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'button_primary_gradient_from'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN button_primary_gradient_from text DEFAULT '#2563eb';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'button_primary_gradient_to'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN button_primary_gradient_to text DEFAULT '#14b8a6';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'button_primary_gradient_enabled'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN button_primary_gradient_enabled boolean DEFAULT true;
  END IF;
END $$;

-- Add button secondary settings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'button_secondary_color'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN button_secondary_color text DEFAULT '#64748b';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'button_secondary_gradient_from'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN button_secondary_gradient_from text DEFAULT '#64748b';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'button_secondary_gradient_to'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN button_secondary_gradient_to text DEFAULT '#475569';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'button_secondary_gradient_enabled'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN button_secondary_gradient_enabled boolean DEFAULT false;
  END IF;
END $$;

-- Add hero design settings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'hero_title_color'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN hero_title_color text DEFAULT '#ffffff';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'hero_subtitle_color'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN hero_subtitle_color text DEFAULT '#dbeafe';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'hero_slogan_color'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN hero_slogan_color text DEFAULT '#ffffff';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'hero_title_font_weight'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN hero_title_font_weight text DEFAULT 'bold';
  END IF;
END $$;

-- Update existing row with defaults if they are NULL
UPDATE site_settings
SET 
  button_primary_color = COALESCE(button_primary_color, '#2563eb'),
  button_primary_gradient_from = COALESCE(button_primary_gradient_from, '#2563eb'),
  button_primary_gradient_to = COALESCE(button_primary_gradient_to, '#14b8a6'),
  button_primary_gradient_enabled = COALESCE(button_primary_gradient_enabled, true),
  button_secondary_color = COALESCE(button_secondary_color, '#64748b'),
  button_secondary_gradient_from = COALESCE(button_secondary_gradient_from, '#64748b'),
  button_secondary_gradient_to = COALESCE(button_secondary_gradient_to, '#475569'),
  button_secondary_gradient_enabled = COALESCE(button_secondary_gradient_enabled, false),
  hero_title_color = COALESCE(hero_title_color, '#ffffff'),
  hero_subtitle_color = COALESCE(hero_subtitle_color, '#dbeafe'),
  hero_slogan_color = COALESCE(hero_slogan_color, '#ffffff'),
  hero_title_font_weight = COALESCE(hero_title_font_weight, 'bold')
WHERE id IS NOT NULL;

