/*
  # Add Header Content Management

  1. New Tables
    - `header_nav_items` - Stores navigation menu items
      - `id` (uuid, primary key)
      - `label_en` (text) - Link label in English
      - `label_bg` (text) - Link label in Bulgarian
      - `section_id` (text) - ID of section to scroll to (e.g., 'home', 'packages')
      - `item_order` (integer) - Display order
      - `is_visible` (boolean) - Whether item is shown in nav
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
    
  2. Changes to Existing Tables
    - Add header fields to `site_settings`
      - `site_name_en` (text) - Site name in English
      - `site_name_bg` (text) - Site name in Bulgarian
    
  3. Security
    - Enable RLS on new table
    - Add policies for authenticated users to manage content
    - Public users can read header content

  4. Sample Data
    - Pre-populate with existing navigation structure
*/

-- Add site name fields to site_settings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'site_name_en'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN site_name_en text DEFAULT 'DFlow ERP';
  END IF;
  
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'site_name_bg'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN site_name_bg text DEFAULT 'DFlow ERP';
  END IF;
END $$;

-- Create header_nav_items table
CREATE TABLE IF NOT EXISTS header_nav_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label_en text NOT NULL,
  label_bg text NOT NULL,
  section_id text NOT NULL,
  item_order integer NOT NULL DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE header_nav_items ENABLE ROW LEVEL SECURITY;

-- Policies for header_nav_items
CREATE POLICY "Public can read header nav items"
  ON header_nav_items
  FOR SELECT
  TO public
  USING (is_visible = true);

CREATE POLICY "Authenticated users can insert header nav items"
  ON header_nav_items
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update header nav items"
  ON header_nav_items
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete header nav items"
  ON header_nav_items
  FOR DELETE
  TO authenticated
  USING (true);

-- Update default site names
UPDATE site_settings
SET 
  site_name_en = 'DFlow ERP',
  site_name_bg = 'DFlow ERP'
WHERE id IS NOT NULL;

-- Insert default navigation items
INSERT INTO header_nav_items (label_en, label_bg, section_id, item_order, is_visible) VALUES
  ('Home', 'Начало', 'home', 1, true),
  ('Packages', 'Пакети', 'packages', 2, true),
  ('Integrations', 'Интеграции', 'integrations', 3, true),
  ('Consulting', 'Консултации', 'consulting', 4, true),
  ('Contact', 'Контакт', 'contact', 5, true)
ON CONFLICT DO NOTHING;
