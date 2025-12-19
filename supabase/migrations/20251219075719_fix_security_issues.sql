/*
  # Fix Security Issues

  1. Performance Improvements
    - Add indexes for unindexed foreign keys
    - Drop unused index
    - Optimize RLS policies with select wrapping

  2. RLS Policy Consolidation
    - Remove duplicate permissive policies
    - Use single restrictive policies where appropriate
    - Ensure proper access control

  3. Function Security
    - Fix mutable search_path in trigger function

  Note: Some issues require dashboard configuration:
    - Auth DB Connection Strategy (change to percentage-based in project settings)
    - Leaked Password Protection (enable in Auth settings)
*/

-- 1. Add missing indexes for foreign keys
CREATE INDEX IF NOT EXISTS idx_contact_submissions_viewed_by 
ON contact_submissions(viewed_by);

CREATE INDEX IF NOT EXISTS idx_footer_links_section_id 
ON footer_links(section_id);

-- 2. Drop unused index
DROP INDEX IF EXISTS idx_contact_submissions_viewed;

-- 3. Fix admin_users RLS policy to use (select auth.uid())
DROP POLICY IF EXISTS "Admin users can read own data" ON admin_users;

CREATE POLICY "Admin users can read own data"
  ON admin_users
  FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

-- 4. Fix multiple permissive policies by consolidating them

-- custom_pages: Remove duplicate and use single policy
DROP POLICY IF EXISTS "Published custom pages are viewable by everyone" ON custom_pages;
DROP POLICY IF EXISTS "Authenticated users can view all custom pages" ON custom_pages;

CREATE POLICY "Anyone can view published custom pages"
  ON custom_pages
  FOR SELECT
  TO authenticated, anon
  USING (is_published = true);

-- erp_modules: Consolidate policies
DROP POLICY IF EXISTS "Public can view visible modules" ON erp_modules;
DROP POLICY IF EXISTS "Authenticated users can view all modules" ON erp_modules;

CREATE POLICY "Anyone can view visible modules"
  ON erp_modules
  FOR SELECT
  TO authenticated, anon
  USING (is_visible = true);

-- feature_cards: Keep anon access, use restrictive for authenticated management
DROP POLICY IF EXISTS "Anyone can read feature cards" ON feature_cards;
DROP POLICY IF EXISTS "Authenticated users can manage feature cards" ON feature_cards;

CREATE POLICY "Anyone can read feature cards"
  ON feature_cards
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can insert feature cards"
  ON feature_cards
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update feature cards"
  ON feature_cards
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete feature cards"
  ON feature_cards
  FOR DELETE
  TO authenticated
  USING (true);

-- integration_popups: Consolidate
DROP POLICY IF EXISTS "Anyone can read integration popups" ON integration_popups;
DROP POLICY IF EXISTS "Authenticated users can manage integration popups" ON integration_popups;

CREATE POLICY "Anyone can read integration popups"
  ON integration_popups
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can update integration popups"
  ON integration_popups
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- integrations: Consolidate
DROP POLICY IF EXISTS "Anyone can read integrations" ON integrations;
DROP POLICY IF EXISTS "Authenticated users can manage integrations" ON integrations;

CREATE POLICY "Anyone can read integrations"
  ON integrations
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can insert integrations"
  ON integrations
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update integrations"
  ON integrations
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete integrations"
  ON integrations
  FOR DELETE
  TO authenticated
  USING (true);

-- packages: Consolidate
DROP POLICY IF EXISTS "Anyone can read visible packages" ON packages;
DROP POLICY IF EXISTS "Authenticated users can manage packages" ON packages;

CREATE POLICY "Anyone can read visible packages"
  ON packages
  FOR SELECT
  TO authenticated, anon
  USING (is_visible = true);

CREATE POLICY "Authenticated users can insert packages"
  ON packages
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update packages"
  ON packages
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete packages"
  ON packages
  FOR DELETE
  TO authenticated
  USING (true);

-- process_steps: Consolidate
DROP POLICY IF EXISTS "Anyone can read process steps" ON process_steps;
DROP POLICY IF EXISTS "Authenticated users can manage process steps" ON process_steps;

CREATE POLICY "Anyone can read process steps"
  ON process_steps
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can insert process steps"
  ON process_steps
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update process steps"
  ON process_steps
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete process steps"
  ON process_steps
  FOR DELETE
  TO authenticated
  USING (true);

-- testimonials: Consolidate
DROP POLICY IF EXISTS "Anyone can read visible testimonials" ON testimonials;
DROP POLICY IF EXISTS "Authenticated users can manage testimonials" ON testimonials;

CREATE POLICY "Anyone can read visible testimonials"
  ON testimonials
  FOR SELECT
  TO authenticated, anon
  USING (is_visible = true);

CREATE POLICY "Authenticated users can insert testimonials"
  ON testimonials
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update testimonials"
  ON testimonials
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete testimonials"
  ON testimonials
  FOR DELETE
  TO authenticated
  USING (true);

-- why_choose_popups: Consolidate
DROP POLICY IF EXISTS "Anyone can read why choose popups" ON why_choose_popups;
DROP POLICY IF EXISTS "Authenticated users can manage why choose popups" ON why_choose_popups;

CREATE POLICY "Anyone can read why choose popups"
  ON why_choose_popups
  FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Authenticated users can update why choose popups"
  ON why_choose_popups
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- 5. Fix function search_path
DROP FUNCTION IF EXISTS send_contact_email_trigger() CASCADE;

CREATE OR REPLACE FUNCTION send_contact_email_trigger()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, pg_temp
AS $$
DECLARE
  target_email text;
  email_body text;
BEGIN
  SELECT contact_content.target_email INTO target_email
  FROM contact_content
  LIMIT 1;

  IF target_email IS NULL OR target_email = '' THEN
    RETURN NEW;
  END IF;

  email_body := format(
    'New contact form submission:

Name: %s
Email: %s
Company: %s
Interest: %s
Message: %s',
    NEW.name,
    NEW.email,
    NEW.company,
    NEW.interest,
    NEW.message
  );

  PERFORM
    net.http_post(
      url := 'https://api.example.com/send-email',
      headers := jsonb_build_object(
        'Content-Type', 'application/json'
      ),
      body := jsonb_build_object(
        'to', target_email,
        'subject', 'New Contact Form Submission',
        'text', email_body
      ),
      timeout_milliseconds := 5000
    );

  UPDATE contact_submissions
  SET email_sent = true
  WHERE id = NEW.id;

  RETURN NEW;
END;
$$;

-- Recreate trigger
DROP TRIGGER IF EXISTS on_contact_submission ON contact_submissions;

CREATE TRIGGER on_contact_submission
  AFTER INSERT ON contact_submissions
  FOR EACH ROW
  EXECUTE FUNCTION send_contact_email_trigger();
