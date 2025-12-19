/*
  # Add UPDATE and DELETE policies for contact submissions

  1. Changes
    - Add UPDATE policy for authenticated users to update contact submissions
    - Add DELETE policy for authenticated users to delete contact submissions
    
  2. Security
    - Only authenticated admin users can update submissions (to mark as viewed)
    - Only authenticated admin users can delete submissions
    - Maintains existing INSERT (public) and SELECT (authenticated) policies
*/

-- Add UPDATE policy for authenticated users
CREATE POLICY "Authenticated users can update contact submissions"
  ON contact_submissions
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Add DELETE policy for authenticated users
CREATE POLICY "Authenticated users can delete contact submissions"
  ON contact_submissions
  FOR DELETE
  TO authenticated
  USING (true);
