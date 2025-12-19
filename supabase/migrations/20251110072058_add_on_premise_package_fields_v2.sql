/*
  # Add On-Premise Package Enhancement Fields

  1. Changes to `packages` table
    - Add `deployment_options_en` (text)
    - Add `deployment_options_bg` (text)
    - Add `technical_details_en` (text)
    - Add `technical_details_bg` (text)
    - Add `cta_label_en` (text)
    - Add `cta_label_bg` (text)
    - Add `pricing_note_en` (text)
    - Add `pricing_note_bg` (text)

  2. Notes
    - These fields enhance the On-Premise Solution package
    - Other packages can use these fields if needed in the future
*/

-- Add new fields to packages table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'packages' AND column_name = 'deployment_options_en'
  ) THEN
    ALTER TABLE packages ADD COLUMN deployment_options_en text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'packages' AND column_name = 'deployment_options_bg'
  ) THEN
    ALTER TABLE packages ADD COLUMN deployment_options_bg text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'packages' AND column_name = 'technical_details_en'
  ) THEN
    ALTER TABLE packages ADD COLUMN technical_details_en text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'packages' AND column_name = 'technical_details_bg'
  ) THEN
    ALTER TABLE packages ADD COLUMN technical_details_bg text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'packages' AND column_name = 'cta_label_en'
  ) THEN
    ALTER TABLE packages ADD COLUMN cta_label_en text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'packages' AND column_name = 'cta_label_bg'
  ) THEN
    ALTER TABLE packages ADD COLUMN cta_label_bg text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'packages' AND column_name = 'pricing_note_en'
  ) THEN
    ALTER TABLE packages ADD COLUMN pricing_note_en text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'packages' AND column_name = 'pricing_note_bg'
  ) THEN
    ALTER TABLE packages ADD COLUMN pricing_note_bg text;
  END IF;
END $$;