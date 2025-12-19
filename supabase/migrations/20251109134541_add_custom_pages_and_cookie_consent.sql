/*
  # Add Custom Pages and Cookie Consent

  1. New Tables
    - `custom_pages`
      - `id` (uuid, primary key)
      - `slug` (text, unique) - URL path for the page (e.g., "about-us")
      - `title_en` (text) - Page title in English
      - `title_bg` (text) - Page title in Bulgarian
      - `content_en` (text) - Page content in English
      - `content_bg` (text) - Page content in Bulgarian
      - `meta_title_en` (text) - SEO meta title English
      - `meta_title_bg` (text) - SEO meta title Bulgarian
      - `meta_description_en` (text) - SEO meta description English
      - `meta_description_bg` (text) - SEO meta description Bulgarian
      - `is_published` (boolean) - Whether the page is live
      - `order_index` (integer) - Display order in navigation
      - `show_in_nav` (boolean) - Whether to show in navigation menu
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `cookie_consent_settings`
      - `id` (uuid, primary key)
      - `title_en` (text) - Cookie banner title English
      - `title_bg` (text) - Cookie banner title Bulgarian
      - `message_en` (text) - Cookie banner message English
      - `message_bg` (text) - Cookie banner message Bulgarian
      - `accept_button_en` (text) - Accept button text English
      - `accept_button_bg` (text) - Accept button text Bulgarian
      - `decline_button_en` (text) - Decline button text English
      - `decline_button_bg` (text) - Decline button text Bulgarian
      - `learn_more_text_en` (text) - Learn more link text English
      - `learn_more_text_bg` (text) - Learn more link text Bulgarian
      - `is_enabled` (boolean) - Whether to show cookie banner
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Public read access
    - Authenticated write access for admins
*/

-- Create custom_pages table
CREATE TABLE IF NOT EXISTS custom_pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title_en text NOT NULL DEFAULT '',
  title_bg text NOT NULL DEFAULT '',
  content_en text NOT NULL DEFAULT '',
  content_bg text NOT NULL DEFAULT '',
  meta_title_en text DEFAULT '',
  meta_title_bg text DEFAULT '',
  meta_description_en text DEFAULT '',
  meta_description_bg text DEFAULT '',
  is_published boolean DEFAULT false,
  order_index integer DEFAULT 0,
  show_in_nav boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE custom_pages ENABLE ROW LEVEL SECURITY;

-- Public can read published pages
CREATE POLICY "Published custom pages are viewable by everyone"
  ON custom_pages FOR SELECT
  TO public
  USING (is_published = true);

-- Authenticated users can manage custom pages
CREATE POLICY "Authenticated users can insert custom pages"
  ON custom_pages FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update custom pages"
  ON custom_pages FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete custom pages"
  ON custom_pages FOR DELETE
  TO authenticated
  USING (true);

-- Create cookie_consent_settings table
CREATE TABLE IF NOT EXISTS cookie_consent_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title_en text DEFAULT 'We use cookies',
  title_bg text DEFAULT 'Използваме бисквитки',
  message_en text DEFAULT 'We use cookies to enhance your browsing experience and analyze our traffic. By clicking "Accept", you consent to our use of cookies.',
  message_bg text DEFAULT 'Използваме бисквитки, за да подобрим вашето изживяване и да анализираме трафика. С натискане на "Приемам" вие се съгласявате с използването на бисквитки.',
  accept_button_en text DEFAULT 'Accept',
  accept_button_bg text DEFAULT 'Приемам',
  decline_button_en text DEFAULT 'Decline',
  decline_button_bg text DEFAULT 'Отказвам',
  learn_more_text_en text DEFAULT 'Learn more',
  learn_more_text_bg text DEFAULT 'Научете повече',
  is_enabled boolean DEFAULT true,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE cookie_consent_settings ENABLE ROW LEVEL SECURITY;

-- Public can read cookie settings
CREATE POLICY "Cookie settings are viewable by everyone"
  ON cookie_consent_settings FOR SELECT
  TO public
  USING (true);

-- Authenticated users can update cookie settings
CREATE POLICY "Authenticated users can update cookie settings"
  ON cookie_consent_settings FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert cookie settings"
  ON cookie_consent_settings FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert default cookie consent settings
INSERT INTO cookie_consent_settings (
  title_en,
  title_bg,
  message_en,
  message_bg,
  accept_button_en,
  accept_button_bg,
  decline_button_en,
  decline_button_bg,
  learn_more_text_en,
  learn_more_text_bg,
  is_enabled
) VALUES (
  'We use cookies',
  'Използваме бисквитки',
  'We use cookies to enhance your browsing experience and analyze our traffic. By clicking "Accept", you consent to our use of cookies.',
  'Използваме бисквитки, за да подобрим вашето изживяване и да анализираме трафика. С натискане на "Приемам" вие се съгласявате с използването на бисквитки.',
  'Accept',
  'Приемам',
  'Decline',
  'Отказвам',
  'Learn more',
  'Научете повече',
  true
) ON CONFLICT DO NOTHING;
