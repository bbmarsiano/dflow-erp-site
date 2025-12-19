/*
  # Add Captcha Mode Setting

  1. New Column
    - Add `captcha_mode` to site_settings table
    - Values: 'testing' or 'google'
    - Default: 'testing' for development
  
  2. Purpose
    - Allow admin to switch between simple math captcha (testing) and Google reCAPTCHA (production)
    - Keep Google reCAPTCHA settings available for future use
*/

-- Add captcha mode column
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'captcha_mode'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN captcha_mode text DEFAULT 'testing';
  END IF;
END $$;

-- Update existing row
UPDATE site_settings
SET captcha_mode = COALESCE(captcha_mode, 'testing')
WHERE id IS NOT NULL;