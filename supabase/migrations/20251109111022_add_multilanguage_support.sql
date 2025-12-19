/*
  # Add Multilanguage Support to CMS

  ## Overview
  This migration adds multilanguage support to the DFlow ERP CMS, with Bulgarian as the primary language
  and English as the secondary language. All content tables are updated to store translations.

  ## Changes

  ### 1. Modify Existing Tables to Support Multiple Languages
  Each content table will have language-specific columns for Bulgarian (bg) and English (en):
  
  - **site_settings** - Add language columns for all text fields
  - **hero_content** - Add language-specific headline, subheadline, slogan, CTAs
  - **feature_cards** - Add title_bg, title_en, description_bg, description_en
  - **process_steps** - Add title_bg, title_en, description_bg, description_en
  - **packages** - Add name_bg, name_en, description_bg, description_en, price_text_bg, price_text_en, cta_text_bg, cta_text_en
  - **integrations** - Add title_bg, title_en
  - **consulting_content** - Add language-specific fields
  - **testimonials** - Add quote_bg, quote_en
  - **contact_content** - Add language-specific fields
  - **legal_pages** - Add content_bg, content_en

  ### 2. New Table: language_settings
  - Stores default language preference
  - Available languages configuration

  ## Security
  - All existing RLS policies remain in effect
  - No changes to authentication or authorization
*/

-- Add language settings table
CREATE TABLE IF NOT EXISTS language_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  default_language text DEFAULT 'bg' CHECK (default_language IN ('bg', 'en')),
  available_languages jsonb DEFAULT '["bg", "en"]'::jsonb,
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE language_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read language settings"
  ON language_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can update language settings"
  ON language_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default language settings
INSERT INTO language_settings (id) VALUES (gen_random_uuid()) ON CONFLICT DO NOTHING;

-- Modify site_settings table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'site_settings' AND column_name = 'company_name_bg') THEN
    ALTER TABLE site_settings 
      ADD COLUMN company_name_bg text DEFAULT 'Balkan Invest Consult',
      ADD COLUMN company_name_en text DEFAULT 'Balkan Invest Consult',
      ADD COLUMN company_address_bg text DEFAULT '',
      ADD COLUMN company_address_en text DEFAULT '',
      ADD COLUMN meta_title_bg text DEFAULT 'DFlow ERP - Персонализирани ERP Решения',
      ADD COLUMN meta_title_en text DEFAULT 'DFlow ERP - Tailored ERP Solutions',
      ADD COLUMN meta_description_bg text DEFAULT 'Персонализирани ERP решения базирани на Odoo и Dolibarr',
      ADD COLUMN meta_description_en text DEFAULT 'Customized ERP solutions based on Odoo and Dolibarr';
  END IF;
END $$;

-- Modify hero_content table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'hero_content' AND column_name = 'headline_bg') THEN
    ALTER TABLE hero_content
      ADD COLUMN headline_bg text DEFAULT 'Подобрете вашия работен процес',
      ADD COLUMN headline_en text DEFAULT 'Enhance your workflow',
      ADD COLUMN subheadline_bg text DEFAULT 'DFlow ERP предлага персонализирани ERP решения базирани на Odoo и Dolibarr.',
      ADD COLUMN subheadline_en text DEFAULT 'DFlow ERP delivers customized ERP solutions based on Odoo and Dolibarr.',
      ADD COLUMN slogan_bg text DEFAULT 'ERP, изграден около вашия бизнес',
      ADD COLUMN slogan_en text DEFAULT 'ERP, built around your business',
      ADD COLUMN cta_primary_text_bg text DEFAULT 'Заявете Безплатна Консултация',
      ADD COLUMN cta_primary_text_en text DEFAULT 'Request Free Consultation',
      ADD COLUMN cta_secondary_text_bg text DEFAULT 'Вижте Демо',
      ADD COLUMN cta_secondary_text_en text DEFAULT 'See Demo';
  END IF;
END $$;

-- Modify feature_cards table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'feature_cards' AND column_name = 'title_bg') THEN
    ALTER TABLE feature_cards
      ADD COLUMN title_bg text DEFAULT '',
      ADD COLUMN title_en text DEFAULT '',
      ADD COLUMN description_bg text DEFAULT '',
      ADD COLUMN description_en text DEFAULT '';
  END IF;
END $$;

-- Modify process_steps table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'process_steps' AND column_name = 'title_bg') THEN
    ALTER TABLE process_steps
      ADD COLUMN title_bg text DEFAULT '',
      ADD COLUMN title_en text DEFAULT '',
      ADD COLUMN description_bg text DEFAULT '',
      ADD COLUMN description_en text DEFAULT '';
  END IF;
END $$;

-- Modify packages table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'packages' AND column_name = 'name_bg') THEN
    ALTER TABLE packages
      ADD COLUMN name_bg text DEFAULT '',
      ADD COLUMN name_en text DEFAULT '',
      ADD COLUMN description_bg text DEFAULT '',
      ADD COLUMN description_en text DEFAULT '',
      ADD COLUMN erp_platform_bg text DEFAULT '',
      ADD COLUMN erp_platform_en text DEFAULT '',
      ADD COLUMN features_bg jsonb DEFAULT '[]'::jsonb,
      ADD COLUMN features_en jsonb DEFAULT '[]'::jsonb,
      ADD COLUMN price_text_bg text DEFAULT '',
      ADD COLUMN price_text_en text DEFAULT '',
      ADD COLUMN cta_text_bg text DEFAULT 'Започнете',
      ADD COLUMN cta_text_en text DEFAULT 'Get Started';
  END IF;
END $$;

-- Modify integrations table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'integrations' AND column_name = 'title_bg') THEN
    ALTER TABLE integrations
      ADD COLUMN title_bg text DEFAULT '',
      ADD COLUMN title_en text DEFAULT '';
  END IF;
END $$;

-- Modify consulting_content table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'consulting_content' AND column_name = 'section_title_bg') THEN
    ALTER TABLE consulting_content
      ADD COLUMN section_title_bg text DEFAULT 'Нуждаете се само от консултация или техническа спецификация?',
      ADD COLUMN section_title_en text DEFAULT 'Need Only Consulting or a Technical Specification?',
      ADD COLUMN description_bg text DEFAULT '',
      ADD COLUMN description_en text DEFAULT '',
      ADD COLUMN bullet_points_bg jsonb DEFAULT '[]'::jsonb,
      ADD COLUMN bullet_points_en jsonb DEFAULT '[]'::jsonb,
      ADD COLUMN cta_text_bg text DEFAULT 'Заявете Консултация',
      ADD COLUMN cta_text_en text DEFAULT 'Request Consultation';
  END IF;
END $$;

-- Modify testimonials table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'testimonials' AND column_name = 'quote_bg') THEN
    ALTER TABLE testimonials
      ADD COLUMN quote_bg text DEFAULT '',
      ADD COLUMN quote_en text DEFAULT '';
  END IF;
END $$;

-- Modify contact_content table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'contact_content' AND column_name = 'section_title_bg') THEN
    ALTER TABLE contact_content
      ADD COLUMN section_title_bg text DEFAULT 'Нека обсъдим вашето ERP решение',
      ADD COLUMN section_title_en text DEFAULT 'Let''s Discuss Your ERP Solution',
      ADD COLUMN subheadline_bg text DEFAULT 'Разкажете ни за вашия бизнес',
      ADD COLUMN subheadline_en text DEFAULT 'Tell us about your business',
      ADD COLUMN success_message_bg text DEFAULT 'Благодарим! Ще се свържем с вас скоро.',
      ADD COLUMN success_message_en text DEFAULT 'Thank you! We will get back to you soon.';
  END IF;
END $$;

-- Modify legal_pages table
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'legal_pages' AND column_name = 'content_bg') THEN
    ALTER TABLE legal_pages
      ADD COLUMN content_bg text DEFAULT '',
      ADD COLUMN content_en text DEFAULT '',
      ADD COLUMN title_bg text DEFAULT '',
      ADD COLUMN title_en text DEFAULT '';
  END IF;
END $$;