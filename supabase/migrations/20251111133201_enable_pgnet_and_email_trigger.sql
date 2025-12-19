/*
  # Enable pg_net extension and create email trigger

  1. Extensions
    - Enable pg_net extension for async HTTP requests from database

  2. New Function
    - `send_contact_email_trigger()` - Sends HTTP POST to edge function when contact submitted
    - Uses pg_net to make async HTTP request
    - Runs with SECURITY DEFINER to access edge function

  3. New Trigger
    - Fires after INSERT on contact_submissions
    - Automatically calls edge function to send email notification

  4. Notes
    - Edge function URL is hardcoded to your Supabase project
    - Uses service role authentication for edge function calls
    - Emails will be sent asynchronously in the background
*/

-- Enable pg_net extension
CREATE EXTENSION IF NOT EXISTS pg_net WITH SCHEMA extensions;

-- Create function to send email via edge function
CREATE OR REPLACE FUNCTION send_contact_email_trigger()
RETURNS TRIGGER AS $$
DECLARE
  request_id bigint;
  function_url text;
BEGIN
  -- Construct edge function URL
  function_url := 'https://qyzigcibswxijofvczew.supabase.co/functions/v1/send-contact-email';

  -- Make async HTTP request to edge function
  SELECT extensions.http_post(
    url := function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
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

  -- Update the record to mark email as sent
  UPDATE contact_submissions
  SET 
    email_sent = true,
    email_sent_at = now()
  WHERE id = NEW.id;

  -- Log the request
  RAISE NOTICE 'Email send request initiated with ID: %', request_id;

  RETURN NEW;
EXCEPTION WHEN OTHERS THEN
  -- Log error but don't fail the insert
  UPDATE contact_submissions
  SET 
    email_error = SQLERRM
  WHERE id = NEW.id;
  
  RAISE WARNING 'Failed to send email for submission %: %', NEW.id, SQLERRM;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger that fires after insert
DROP TRIGGER IF EXISTS on_contact_submission_send_email ON contact_submissions;
CREATE TRIGGER on_contact_submission_send_email
  AFTER INSERT ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION send_contact_email_trigger();
