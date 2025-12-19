/*
  # Create ERP Modules Table

  1. New Table: erp_modules
    - `id` (uuid, primary key)
    - `title_en` (text) - English module title
    - `title_bg` (text) - Bulgarian module title
    - `description_en` (text) - English description
    - `description_bg` (text) - Bulgarian description
    - `screenshot_url` (text, nullable) - Optional module screenshot
    - `platform` (text, nullable) - Platform: "Odoo", "Dolibarr", "Both"
    - `display_order` (integer) - For ordering modules
    - `is_visible` (boolean) - Toggle visibility on site
    - `created_at` (timestamp)
    - `updated_at` (timestamp)
  
  2. Site Settings Addition
    - `modules_section_enabled` (boolean) - Global toggle for modules section
  
  3. Security
    - Enable RLS on erp_modules table
    - Public read access for visible modules
    - Authenticated admin write access
*/

-- Create erp_modules table
CREATE TABLE IF NOT EXISTS erp_modules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en text NOT NULL,
  title_bg text NOT NULL,
  description_en text NOT NULL,
  description_bg text NOT NULL,
  screenshot_url text,
  platform text,
  display_order integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE erp_modules ENABLE ROW LEVEL SECURITY;

-- Policy: Public can view visible modules
CREATE POLICY "Public can view visible modules"
  ON erp_modules
  FOR SELECT
  USING (is_visible = true);

-- Policy: Authenticated users can view all modules
CREATE POLICY "Authenticated users can view all modules"
  ON erp_modules
  FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can insert modules
CREATE POLICY "Authenticated users can insert modules"
  ON erp_modules
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update modules
CREATE POLICY "Authenticated users can update modules"
  ON erp_modules
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can delete modules
CREATE POLICY "Authenticated users can delete modules"
  ON erp_modules
  FOR DELETE
  TO authenticated
  USING (true);

-- Add modules section toggle to site_settings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'modules_section_enabled'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN modules_section_enabled boolean DEFAULT false;
  END IF;
END $$;

-- Update existing row with default
UPDATE site_settings
SET modules_section_enabled = COALESCE(modules_section_enabled, false)
WHERE id IS NOT NULL;