/*
  # Add Integrations Section Visibility Toggle

  1. Changes
    - Add `show_integrations_section` field to `site_settings` table
    - Defaults to `false` (hidden)
    - Allows admins to control visibility of the integrations section

  2. Notes
    - This controls the "Built on proven open-source ERP platforms" section
    - Admins can toggle it via the admin dashboard
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'show_integrations_section'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN show_integrations_section boolean DEFAULT false;
  END IF;
END $$;

UPDATE site_settings SET show_integrations_section = false WHERE show_integrations_section IS NULL;
