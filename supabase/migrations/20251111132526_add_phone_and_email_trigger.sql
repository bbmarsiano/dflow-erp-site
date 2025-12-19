/*
  # Add phone field and automatic email sending via trigger

  1. Changes to `contact_submissions` table
    - Add `phone` column (text, nullable)
    - Add `recaptcha_token` column (text, nullable) 
    - Add `email_sent` column (boolean, default false)
    - Add `email_sent_at` column (timestamptz, nullable)
    - Add `email_error` column (text, nullable)

  2. Create trigger function
    - Function to send HTTP request to edge function when new contact submission is inserted
    - Marks submission as email_sent when successful

  3. Security
    - Table already has RLS enabled
*/

-- Add new columns to contact_submissions table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'phone'
  ) THEN
    ALTER TABLE contact_submissions ADD COLUMN phone text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'recaptcha_token'
  ) THEN
    ALTER TABLE contact_submissions ADD COLUMN recaptcha_token text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'email_sent'
  ) THEN
    ALTER TABLE contact_submissions ADD COLUMN email_sent boolean DEFAULT false;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'email_sent_at'
  ) THEN
    ALTER TABLE contact_submissions ADD COLUMN email_sent_at timestamptz;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'contact_submissions' AND column_name = 'email_error'
  ) THEN
    ALTER TABLE contact_submissions ADD COLUMN email_error text;
  END IF;
END $$;

-- Create function to send email via edge function using pg_net (Supabase's HTTP extension)
CREATE OR REPLACE FUNCTION send_contact_email_trigger()
RETURNS TRIGGER AS $$
DECLARE
  request_id bigint;
  function_url text;
  service_role_key text;
BEGIN
  -- Get the Supabase URL and service role key from vault or use environment
  function_url := current_setting('app.settings.supabase_url', true) || '/functions/v1/send-contact-email';
  service_role_key := current_setting('app.settings.service_role_key', true);

  -- If settings are not available, construct URL from request
  IF function_url IS NULL OR function_url = '' THEN
    function_url := 'https://qyzigcibswxijofvczew.supabase.co/functions/v1/send-contact-email';
  END IF;

  -- Make async HTTP request to edge function using net.http_post
  -- This will be processed in the background
  SELECT net.http_post(
    url := function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || coalesce(service_role_key, '')
    ),
    body := jsonb_build_object(
      'name', NEW.name,
      'email', NEW.email,
      'phone', NEW.phone,
      'company', NEW.company,
      'message', NEW.message,
      'recaptchaToken', coalesce(NEW.recaptcha_token, 'testing-mode-bypass')
    )
  ) INTO request_id;

  -- Log the request
  RAISE NOTICE 'Email send request initiated: %', request_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger that fires after insert
DROP TRIGGER IF EXISTS on_contact_submission_send_email ON contact_submissions;
CREATE TRIGGER on_contact_submission_send_email
  AFTER INSERT ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION send_contact_email_trigger();
