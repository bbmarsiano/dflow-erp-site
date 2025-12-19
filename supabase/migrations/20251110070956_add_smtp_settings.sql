/*
  # Add SMTP Settings Table

  1. New Tables
    - `smtp_settings`
      - `id` (uuid, primary key)
      - `smtp_host` (text) - SMTP server hostname
      - `smtp_port` (integer) - SMTP server port
      - `smtp_secure` (boolean) - Use TLS/SSL
      - `smtp_user` (text) - SMTP username/email
      - `smtp_password` (text) - SMTP password (encrypted)
      - `from_email` (text) - Email address to send from
      - `from_name` (text) - Name to send from
      - `recaptcha_site_key` (text) - Google reCAPTCHA site key
      - `recaptcha_secret_key` (text) - Google reCAPTCHA secret key
      - `updated_at` (timestamptz)
  
  2. Security
    - Enable RLS on `smtp_settings` table
    - Add policy for authenticated users to read/update SMTP settings
*/

CREATE TABLE IF NOT EXISTS smtp_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  smtp_host text DEFAULT 'smtp.gmail.com',
  smtp_port integer DEFAULT 587,
  smtp_secure boolean DEFAULT true,
  smtp_user text DEFAULT 'your-email@gmail.com',
  smtp_password text DEFAULT '',
  from_email text DEFAULT 'your-email@gmail.com',
  from_name text DEFAULT 'DFlow ERP',
  recaptcha_site_key text DEFAULT '',
  recaptcha_secret_key text DEFAULT '',
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE smtp_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Authenticated users can read SMTP settings"
  ON smtp_settings
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update SMTP settings"
  ON smtp_settings
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert SMTP settings"
  ON smtp_settings
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Insert default SMTP settings if none exist
INSERT INTO smtp_settings (smtp_host, smtp_port, smtp_secure, smtp_user, smtp_password, from_email, from_name)
VALUES ('smtp.gmail.com', 587, true, 'your-email@gmail.com', '', 'your-email@gmail.com', 'DFlow ERP')
ON CONFLICT DO NOTHING;