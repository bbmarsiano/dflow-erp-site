/*
  # Add viewed flag to contact submissions

  1. Changes
    - Add `viewed` boolean column (defaults to false for new submissions)
    - Add `viewed_at` timestamp column (null until viewed)
    - Add `viewed_by` uuid column (references auth.users)

  2. Notes
    - New submissions start as unviewed (viewed = false)
    - When admin views submission, viewed is set to true
    - viewed_at tracks when it was first viewed
    - viewed_by tracks which admin user viewed it
*/

-- Add viewed tracking columns
ALTER TABLE contact_submissions 
ADD COLUMN IF NOT EXISTS viewed boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS viewed_at timestamptz,
ADD COLUMN IF NOT EXISTS viewed_by uuid REFERENCES auth.users(id);

-- Create index for faster querying of unviewed submissions
CREATE INDEX IF NOT EXISTS idx_contact_submissions_viewed 
ON contact_submissions(viewed, created_at DESC);

-- Add comment
COMMENT ON COLUMN contact_submissions.viewed IS 'Whether this submission has been viewed by an admin';
COMMENT ON COLUMN contact_submissions.viewed_at IS 'Timestamp when submission was first viewed';
COMMENT ON COLUMN contact_submissions.viewed_by IS 'Admin user who first viewed this submission';
