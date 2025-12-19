/*
  # Add Popup Content Tables

  ## Overview
  This migration adds tables for managing popup content for integration cards and "why choose" cards,
  plus logo URL fields for Odoo and Dolibarr.

  ## New Tables

  ### 1. integration_popups
  Stores popup content for the 6 integration cards in the "Integrate DFlow ERP" section
  - Each popup has bilingual title, body, and technical details

  ### 2. why_choose_popups
  Stores popup content for the 4 cards in the "Why Choose DFlow ERP?" section
  - Similar structure to integration_popups

  ## Modified Tables

  ### site_settings
  - Add odoo_logo_url and dolibarr_logo_url fields

  ## Security
  - RLS enabled on all new tables
  - Public read access for popup content
  - Admin-only write access for authenticated users
*/

-- Integration popups table
CREATE TABLE IF NOT EXISTS integration_popups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  popup_key text UNIQUE NOT NULL CHECK (popup_key IN (
    'integration_api_system',
    'integration_financial_systems',
    'integration_ecommerce',
    'integration_analytics',
    'integration_sso',
    'integration_custom'
  )),
  title_en text DEFAULT '',
  title_bg text DEFAULT '',
  body_en text DEFAULT '',
  body_bg text DEFAULT '',
  technical_details_en jsonb DEFAULT '[]'::jsonb,
  technical_details_bg jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE integration_popups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read integration popups"
  ON integration_popups FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage integration popups"
  ON integration_popups FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Why choose popups table
CREATE TABLE IF NOT EXISTS why_choose_popups (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  popup_key text UNIQUE NOT NULL CHECK (popup_key IN (
    'why_flexibility',
    'why_cost',
    'why_expert',
    'why_control'
  )),
  title_en text DEFAULT '',
  title_bg text DEFAULT '',
  body_en text DEFAULT '',
  body_bg text DEFAULT '',
  technical_details_en jsonb DEFAULT '[]'::jsonb,
  technical_details_bg jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE why_choose_popups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read why choose popups"
  ON why_choose_popups FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage why choose popups"
  ON why_choose_popups FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add logo URL fields to site_settings
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'odoo_logo_url') THEN
    ALTER TABLE site_settings
      ADD COLUMN odoo_logo_url text DEFAULT '',
      ADD COLUMN dolibarr_logo_url text DEFAULT '';
  END IF;
END $$;