/*
  # Add Card Descriptions and Platforms Section

  1. Changes to existing tables
    - Add `card_description_en` and `card_description_bg` to `why_choose_popups`
    - These fields store the short description shown on the card itself

  2. New Tables
    - `platform_logos`
      - `id` (uuid, primary key)
      - `name_en` (text) - Platform name in English
      - `name_bg` (text) - Platform name in Bulgarian
      - `logo_url` (text) - URL to the logo image
      - `order_index` (integer) - Display order
      - `created_at` (timestamptz)

  3. Security
    - Enable RLS on `platform_logos` table
    - Add policy for public read access
    - Add policy for authenticated admin write access
*/

-- Add card description fields to why_choose_popups
DO $$ 
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns 
    WHERE table_name = 'why_choose_popups' AND column_name = 'card_description_en'
  ) THEN
    ALTER TABLE why_choose_popups 
    ADD COLUMN card_description_en text DEFAULT '',
    ADD COLUMN card_description_bg text DEFAULT '';
  END IF;
END $$;

-- Update existing records with card descriptions based on feature cards
UPDATE why_choose_popups SET
  card_description_en = CASE popup_key
    WHEN 'why_flexibility' THEN 'Every ERP system is configured specifically for your business model'
    WHEN 'why_cost' THEN 'Easily scalable solutions that grow with you'
    WHEN 'why_expert' THEN 'Full GDPR compliance and industry standards'
    WHEN 'why_control' THEN '24/7 technical support and consultations'
    ELSE ''
  END,
  card_description_bg = CASE popup_key
    WHEN 'why_flexibility' THEN 'Всяка ERP система е конфигурирана специално за вашия бизнес модел'
    WHEN 'why_cost' THEN 'Лесно мащабируеми решения, които растат заедно с вас'
    WHEN 'why_expert' THEN 'Пълно съответствие с GDPR и индустриални стандарти'
    WHEN 'why_control' THEN '24/7 техническа поддръжка и консултации'
    ELSE ''
  END
WHERE card_description_en = '' OR card_description_en IS NULL;

-- Create platform_logos table
CREATE TABLE IF NOT EXISTS platform_logos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en text NOT NULL,
  name_bg text NOT NULL,
  logo_url text NOT NULL,
  order_index integer NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE platform_logos ENABLE ROW LEVEL SECURITY;

-- Public can read platform logos
CREATE POLICY "Platform logos are viewable by everyone"
  ON platform_logos FOR SELECT
  TO public
  USING (true);

-- Only authenticated users can insert platform logos
CREATE POLICY "Authenticated users can insert platform logos"
  ON platform_logos FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Only authenticated users can update platform logos
CREATE POLICY "Authenticated users can update platform logos"
  ON platform_logos FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Only authenticated users can delete platform logos
CREATE POLICY "Authenticated users can delete platform logos"
  ON platform_logos FOR DELETE
  TO authenticated
  USING (true);

-- Insert default platform logos
INSERT INTO platform_logos (name_en, name_bg, logo_url, order_index) VALUES
  ('Odoo', 'Odoo', 'https://www.odoo.com/web/image/website/1/logo/Odoo?unique=2024', 1),
  ('Dolibarr', 'Dolibarr', 'https://www.dolibarr.org/images/dolibarr_logo1.png', 2)
ON CONFLICT DO NOTHING;
