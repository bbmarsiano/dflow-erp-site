/*
  # Add Footer Content Management

  1. New Tables
    - `footer_sections` - Stores footer column sections (About, Company, Legal, etc.)
      - `id` (uuid, primary key)
      - `title_en` (text) - Section title in English
      - `title_bg` (text) - Section title in Bulgarian
      - `section_order` (integer) - Display order
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
    - `footer_links` - Stores individual footer links
      - `id` (uuid, primary key)
      - `section_id` (uuid, foreign key to footer_sections)
      - `label_en` (text) - Link label in English
      - `label_bg` (text) - Link label in Bulgarian
      - `url` (text) - Link URL
      - `link_order` (integer) - Display order within section
      - `is_external` (boolean) - Whether link opens in new tab
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
  2. Changes to Existing Tables
    - Add footer description fields to `site_settings`
      - `footer_description_en` (text)
      - `footer_description_bg` (text)
      - `footer_copyright_en` (text)
      - `footer_copyright_bg` (text)
    
  3. Security
    - Enable RLS on both new tables
    - Add policies for authenticated users to manage content
    - Public users can read footer content

  4. Sample Data
    - Pre-populate with existing footer structure
*/

-- Add footer description fields to site_settings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'footer_description_en'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN footer_description_en text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'footer_description_bg'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN footer_description_bg text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'footer_copyright_en'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN footer_copyright_en text;
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'footer_copyright_bg'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN footer_copyright_bg text;
  END IF;
END $$;

-- Create footer_sections table
CREATE TABLE IF NOT EXISTS footer_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en text NOT NULL,
  title_bg text NOT NULL,
  section_order integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create footer_links table
CREATE TABLE IF NOT EXISTS footer_links (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_id uuid REFERENCES footer_sections(id) ON DELETE CASCADE,
  label_en text NOT NULL,
  label_bg text NOT NULL,
  url text NOT NULL,
  link_order integer NOT NULL DEFAULT 0,
  is_external boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE footer_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE footer_links ENABLE ROW LEVEL SECURITY;

-- Policies for footer_sections
CREATE POLICY "Public can read footer sections"
  ON footer_sections
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert footer sections"
  ON footer_sections
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update footer sections"
  ON footer_sections
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete footer sections"
  ON footer_sections
  FOR DELETE
  TO authenticated
  USING (true);

-- Policies for footer_links
CREATE POLICY "Public can read footer links"
  ON footer_links
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can insert footer links"
  ON footer_links
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update footer links"
  ON footer_links
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete footer links"
  ON footer_links
  FOR DELETE
  TO authenticated
  USING (true);

-- Update default footer description
UPDATE site_settings
SET 
  footer_description_en = 'Tailored ERP solutions based on Odoo and Dolibarr',
  footer_description_bg = 'Персонализирани ERP решения базирани на Odoo и Dolibarr',
  footer_copyright_en = 'DFlow ERP © 2025',
  footer_copyright_bg = 'DFlow ERP © 2025'
WHERE id IS NOT NULL;

-- Insert default footer sections
INSERT INTO footer_sections (title_en, title_bg, section_order) VALUES
  ('Company', 'Компания', 1),
  ('Legal', 'Правни условия', 2)
ON CONFLICT DO NOTHING;

-- Insert default footer links for Legal section
INSERT INTO footer_links (section_id, label_en, label_bg, url, link_order, is_external)
SELECT 
  (SELECT id FROM footer_sections WHERE title_en = 'Legal'),
  'Privacy Policy',
  'Политика за поверителност',
  '/privacy',
  1,
  false
WHERE NOT EXISTS (SELECT 1 FROM footer_links WHERE url = '/privacy');

INSERT INTO footer_links (section_id, label_en, label_bg, url, link_order, is_external)
SELECT 
  (SELECT id FROM footer_sections WHERE title_en = 'Legal'),
  'Cookies Policy',
  'Политика за бисквитки',
  '/cookies',
  2,
  false
WHERE NOT EXISTS (SELECT 1 FROM footer_links WHERE url = '/cookies');
