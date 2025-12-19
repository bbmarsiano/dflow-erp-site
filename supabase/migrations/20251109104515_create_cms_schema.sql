/*
  # DFlow ERP CMS Database Schema

  ## Overview
  This migration creates the complete database structure for the DFlow ERP marketing website CMS.
  It includes tables for all editable content, global settings, and admin authentication.

  ## New Tables

  ### 1. admin_users - Admin authentication for CMS access
  ### 2. site_settings - Global site configuration
  ### 3. hero_content - Hero section content
  ### 4. feature_cards - Why DFlow ERP feature cards
  ### 5. process_steps - Implementation process steps
  ### 6. packages - ERP packages/pricing tiers
  ### 7. integrations - Integration types
  ### 8. consulting_content - Consulting section content
  ### 9. testimonials - Client testimonials
  ### 10. contact_content - Contact section content
  ### 11. contact_submissions - Contact form submissions
  ### 12. legal_pages - Privacy and cookies policy content

  ## Security
  - RLS enabled on all tables
  - Public read access for public-facing content
  - Admin-only write access for authenticated users
  - Contact submissions: public insert, admin read
*/

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  password_hash text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admin users can read own data"
  ON admin_users FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

-- Site settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  logo_url text DEFAULT '',
  company_name text DEFAULT 'Balkan Invest Consult',
  company_address text DEFAULT '',
  company_email text DEFAULT '',
  company_phone text DEFAULT '',
  linkedin_url text DEFAULT '',
  youtube_url text DEFAULT '',
  facebook_url text DEFAULT '',
  meta_title text DEFAULT 'DFlow ERP - Tailored ERP Solutions',
  meta_description text DEFAULT 'Customized ERP solutions based on Odoo and Dolibarr',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read site settings"
  ON site_settings FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can update site settings"
  ON site_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Hero content table
CREATE TABLE IF NOT EXISTS hero_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  headline text DEFAULT 'Enhace your workflow',
  subheadline text DEFAULT 'DFlow ERP delivers customized ERP solutions based on Odoo and Dolibarr.',
  slogan text DEFAULT 'ERP, built around your business',
  cta_primary_text text DEFAULT 'Request Free Consultation',
  cta_secondary_text text DEFAULT 'See Demo',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE hero_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read hero content"
  ON hero_content FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can update hero content"
  ON hero_content FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Feature cards table
CREATE TABLE IF NOT EXISTS feature_cards (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  icon_name text DEFAULT 'Zap',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE feature_cards ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read feature cards"
  ON feature_cards FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage feature cards"
  ON feature_cards FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Process steps table
CREATE TABLE IF NOT EXISTS process_steps (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE process_steps ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read process steps"
  ON process_steps FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage process steps"
  ON process_steps FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Packages table
CREATE TABLE IF NOT EXISTS packages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  erp_platform text DEFAULT '',
  features jsonb DEFAULT '[]'::jsonb,
  price_text text DEFAULT '',
  cta_text text DEFAULT 'Get Started',
  order_index integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE packages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read visible packages"
  ON packages FOR SELECT
  TO public
  USING (is_visible = true);

CREATE POLICY "Authenticated users can manage packages"
  ON packages FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Integrations table
CREATE TABLE IF NOT EXISTS integrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  icon_name text DEFAULT 'Puzzle',
  order_index integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE integrations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read integrations"
  ON integrations FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can manage integrations"
  ON integrations FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Consulting content table
CREATE TABLE IF NOT EXISTS consulting_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_title text DEFAULT 'Need Only Consulting or a Technical Specification?',
  description text DEFAULT '',
  bullet_points jsonb DEFAULT '[]'::jsonb,
  cta_text text DEFAULT 'Request Consultation',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE consulting_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read consulting content"
  ON consulting_content FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can update consulting content"
  ON consulting_content FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  client_name text NOT NULL,
  company text NOT NULL,
  sector text DEFAULT '',
  quote text NOT NULL,
  order_index integer DEFAULT 0,
  is_visible boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read visible testimonials"
  ON testimonials FOR SELECT
  TO public
  USING (is_visible = true);

CREATE POLICY "Authenticated users can manage testimonials"
  ON testimonials FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Contact content table
CREATE TABLE IF NOT EXISTS contact_content (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  section_title text DEFAULT 'Let''s Discuss Your ERP Solution',
  subheadline text DEFAULT 'Tell us about your business',
  success_message text DEFAULT 'Thank you! We will get back to you soon.',
  target_email text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE contact_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read contact content"
  ON contact_content FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can update contact content"
  ON contact_content FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  company text DEFAULT '',
  interest text DEFAULT '',
  message text NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can insert contact submissions"
  ON contact_submissions FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Authenticated users can read contact submissions"
  ON contact_submissions FOR SELECT
  TO authenticated
  USING (true);

-- Legal pages table
CREATE TABLE IF NOT EXISTS legal_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_type text UNIQUE NOT NULL CHECK (page_type IN ('privacy', 'cookies')),
  content text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE legal_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read legal pages"
  ON legal_pages FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated users can update legal pages"
  ON legal_pages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Insert default data
INSERT INTO site_settings (id) VALUES (gen_random_uuid()) ON CONFLICT DO NOTHING;
INSERT INTO hero_content (id) VALUES (gen_random_uuid()) ON CONFLICT DO NOTHING;
INSERT INTO consulting_content (id) VALUES (gen_random_uuid()) ON CONFLICT DO NOTHING;
INSERT INTO contact_content (id) VALUES (gen_random_uuid()) ON CONFLICT DO NOTHING;