/*
  # Update email trigger with longer timeout

  1. Changes
    - Update trigger to use net.http_post with longer timeout (30 seconds)
    - Add better error logging
    - Set timeout_milliseconds parameter

  2. Notes
    - Edge function now returns immediately
    - Email sending happens asynchronously in background
    - Longer timeout allows for SMTP connection delays
*/

-- Recreate function with timeout parameter
CREATE OR REPLACE FUNCTION send_contact_email_trigger()
RETURNS TRIGGER AS $$
DECLARE
  request_id bigint;
  function_url text;
BEGIN
  -- Construct edge function URL
  function_url := 'https://qyzigcibswxijofvczew.supabase.co/functions/v1/send-contact-email';

  -- Make async HTTP request with 30 second timeout
  SELECT net.http_post(
    url := function_url,
    headers := jsonb_build_object(
      'Content-Type', 'application/json'
    ),
    body := jsonb_build_object(
      'name', NEW.name,
      'email', NEW.email,
      'phone', NEW.phone,
      'company', NEW.company,
      'message', NEW.message,
      'recaptchaToken', coalesce(NEW.recaptcha_token, 'testing-mode-bypass')
    ),
    timeout_milliseconds := 30000
  ) INTO request_id;

  RAISE NOTICE 'Email send request initiated with ID: % for submission: %', request_id, NEW.id;

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

-- Ensure trigger exists
DROP TRIGGER IF EXISTS on_contact_submission_send_email ON contact_submissions;
CREATE TRIGGER on_contact_submission_send_email
  AFTER INSERT ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION send_contact_email_trigger();
