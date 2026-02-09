-- ============================================
-- Project Categories with Delivery Time & Pricing
-- ============================================

-- Create project tier enum
CREATE TYPE project_tier AS ENUM ('basic', 'normal', 'premium');

-- Create project_categories table
CREATE TABLE public.project_categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  icon TEXT,
  base_delivery_days INTEGER NOT NULL DEFAULT 30,
  deposit_percentage INTEGER NOT NULL DEFAULT 30,
  is_active BOOLEAN DEFAULT TRUE,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_categories ENABLE ROW LEVEL SECURITY;

-- Policies for project_categories
CREATE POLICY "Anyone can view active categories"
  ON public.project_categories
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage categories"
  ON public.project_categories
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Add new columns to projects table
ALTER TABLE public.projects 
  ADD COLUMN IF NOT EXISTS category_id UUID REFERENCES public.project_categories(id),
  ADD COLUMN IF NOT EXISTS tier project_tier DEFAULT 'normal',
  ADD COLUMN IF NOT EXISTS features TEXT[] DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS image_url TEXT,
  ADD COLUMN IF NOT EXISTS deposit_amount NUMERIC(12, 2),
  ADD COLUMN IF NOT EXISTS total_amount NUMERIC(12, 2),
  ADD COLUMN IF NOT EXISTS delivery_days INTEGER;

-- Create index for category lookups
CREATE INDEX idx_projects_category ON public.projects(category_id);
CREATE INDEX idx_project_categories_slug ON public.project_categories(slug);

-- Insert default project categories
INSERT INTO public.project_categories (name, slug, description, icon, base_delivery_days, deposit_percentage, display_order) VALUES
  ('Web Development', 'web-development', 'Custom website and web application development', 'Globe', 21, 30, 1),
  ('Web Design', 'web-design', 'UI/UX design and website mockups', 'Palette', 14, 25, 2),
  ('Mobile App', 'mobile-app', 'iOS and Android application development', 'Smartphone', 45, 40, 3),
  ('E-Commerce', 'e-commerce', 'Online store and shopping platform development', 'ShoppingCart', 30, 35, 4),
  ('Digital Marketing', 'digital-marketing', 'SEO, social media, and marketing campaigns', 'TrendingUp', 30, 20, 5),
  ('Graphic Design', 'graphic-design', 'Logo, branding, and visual identity design', 'PenTool', 10, 50, 6),
  ('Technical Support', 'technical-support', 'Maintenance, updates, and technical assistance', 'Wrench', 7, 100, 7);