/*
  # Remove email trigger and simplify contact submissions

  1. Changes
    - Drop the trigger and function that was causing issues
    - Keep the new columns (phone, recaptcha_token, email_sent, etc.)
    
  2. Notes
    - Contact submissions will be saved directly to database
    - Email sending will be handled manually or via admin dashboard
*/

-- Drop the trigger and function
DROP TRIGGER IF EXISTS on_contact_submission_send_email ON contact_submissions;
DROP FUNCTION IF EXISTS send_contact_email_trigger();
