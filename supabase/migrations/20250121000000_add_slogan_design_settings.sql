/*
  # Add Site Slogan Design Settings

  Adds design control columns for the site slogan (under the logo):
  - slogan_color: Text color for the slogan
  - slogan_font_family: Font family (system, sans, serif, mono)
  - slogan_font_bold: Bold toggle
  - slogan_font_italic: Italic toggle
  - slogan_font_underline: Underline toggle
*/

-- Add slogan design columns to site_settings
ALTER TABLE site_settings
  ADD COLUMN IF NOT EXISTS slogan_color text,
  ADD COLUMN IF NOT EXISTS slogan_font_family text,
  ADD COLUMN IF NOT EXISTS slogan_font_bold boolean,
  ADD COLUMN IF NOT EXISTS slogan_font_italic boolean,
  ADD COLUMN IF NOT EXISTS slogan_font_underline boolean;

-- Set defaults for existing rows
UPDATE site_settings
SET
  slogan_color = COALESCE(slogan_color, '#ffffff'),
  slogan_font_family = COALESCE(slogan_font_family, 'system'),
  slogan_font_bold = COALESCE(slogan_font_bold, true),
  slogan_font_italic = COALESCE(slogan_font_italic, false),
  slogan_font_underline = COALESCE(slogan_font_underline, false)
WHERE id IS NOT NULL;
