/*
  # Add Package Pop-up Modal Fields

  1. Changes to `packages` table
    - Add `popup_enabled` (boolean, default false)
    - Add `popup_title_en` (text)
    - Add `popup_title_bg` (text)
    - Add `popup_content_en` (text)
    - Add `popup_content_bg` (text)
    - Add `popup_cta_label_en` (text)
    - Add `popup_cta_label_bg` (text)

  2. Notes
    - These fields enable custom pop-up modals for packages
    - Pop-up content can include HTML for rich formatting
    - CTA label is optional for the pop-up modal
*/

-- Add new fields to packages table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'packages' AND column_name = 'popup_enabled'
  ) THEN
    ALTER TABLE packages ADD COLUMN popup_enabled boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'packages' AND column_name = 'popup_title_en'
  ) THEN
    ALTER TABLE packages ADD COLUMN popup_title_en text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'packages' AND column_name = 'popup_title_bg'
  ) THEN
    ALTER TABLE packages ADD COLUMN popup_title_bg text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'packages' AND column_name = 'popup_content_en'
  ) THEN
    ALTER TABLE packages ADD COLUMN popup_content_en text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'packages' AND column_name = 'popup_content_bg'
  ) THEN
    ALTER TABLE packages ADD COLUMN popup_content_bg text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'packages' AND column_name = 'popup_cta_label_en'
  ) THEN
    ALTER TABLE packages ADD COLUMN popup_cta_label_en text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'packages' AND column_name = 'popup_cta_label_bg'
  ) THEN
    ALTER TABLE packages ADD COLUMN popup_cta_label_bg text;
  END IF;
END $$;