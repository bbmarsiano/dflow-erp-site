/*
  # Add Blog / Use Cases System

  1. New Table: blog_posts
    - Stores blog posts / use cases with bilingual content
    - Supports publishing, homepage display, and footer links

  2. Blog Settings in site_settings
    - blog_menu_enabled - Show blog in navigation
    - blog_menu_label_bg / blog_menu_label_en - Navigation labels
    - blog_home_section_enabled - Show blog section on homepage
    - blog_footer_links_enabled - Show blog links in footer

  3. Security
    - RLS enabled on blog_posts
    - Public can read published posts only
    - Authenticated users have full CRUD access
*/

-- Create blog_posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  title_bg text NOT NULL,
  title_en text NOT NULL,
  excerpt_bg text NOT NULL,
  excerpt_en text NOT NULL,
  content_bg text NOT NULL,
  content_en text NOT NULL,
  client_name text,
  client_industry text,
  is_published boolean NOT NULL DEFAULT false,
  show_on_home boolean NOT NULL DEFAULT false,
  show_in_footer boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

-- Policy: Public can read published posts
CREATE POLICY "Anyone can read published blog posts"
  ON blog_posts FOR SELECT
  TO public
  USING (is_published = true);

-- Policy: Authenticated users can read all posts
CREATE POLICY "Authenticated users can read all blog posts"
  ON blog_posts FOR SELECT
  TO authenticated
  USING (true);

-- Policy: Authenticated users can insert blog posts
CREATE POLICY "Authenticated users can insert blog posts"
  ON blog_posts FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Policy: Authenticated users can update blog posts
CREATE POLICY "Authenticated users can update blog posts"
  ON blog_posts FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Policy: Authenticated users can delete blog posts
CREATE POLICY "Authenticated users can delete blog posts"
  ON blog_posts FOR DELETE
  TO authenticated
  USING (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_blog_posts_published ON blog_posts(is_published, published_at DESC, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_show_on_home ON blog_posts(show_on_home) WHERE show_on_home = true;
CREATE INDEX IF NOT EXISTS idx_blog_posts_show_in_footer ON blog_posts(show_in_footer) WHERE show_in_footer = true;

-- Add blog settings to site_settings
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'blog_menu_enabled'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN blog_menu_enabled text DEFAULT 'true';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'blog_menu_label_bg'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN blog_menu_label_bg text DEFAULT 'Блог';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'blog_menu_label_en'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN blog_menu_label_en text DEFAULT 'Blog';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'blog_home_section_enabled'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN blog_home_section_enabled text DEFAULT 'true';
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'site_settings' AND column_name = 'blog_footer_links_enabled'
  ) THEN
    ALTER TABLE site_settings ADD COLUMN blog_footer_links_enabled text DEFAULT 'true';
  END IF;
END $$;

-- Update existing row with defaults if they are NULL
UPDATE site_settings
SET 
  blog_menu_enabled = COALESCE(blog_menu_enabled, 'true'),
  blog_menu_label_bg = COALESCE(blog_menu_label_bg, 'Блог'),
  blog_menu_label_en = COALESCE(blog_menu_label_en, 'Blog'),
  blog_home_section_enabled = COALESCE(blog_home_section_enabled, 'true'),
  blog_footer_links_enabled = COALESCE(blog_footer_links_enabled, 'true')
WHERE id IS NOT NULL;

