/*
  # Add SELECT policy for authenticated users on custom_pages

  1. Changes
    - Add SELECT policy for authenticated users to view ALL custom pages (published and unpublished)
    - This allows admins to manage all pages in the admin dashboard

  2. Security
    - Only authenticated users can view unpublished pages
    - Public users can still only view published pages (existing policy)
*/

CREATE POLICY "Authenticated users can view all custom pages"
  ON custom_pages
  FOR SELECT
  TO authenticated
  USING (true);
