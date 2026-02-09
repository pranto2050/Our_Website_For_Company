-- ============================================
-- Project Tier Configuration (Customizable Features)
-- ============================================

CREATE TABLE public.project_tiers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tier_key TEXT NOT NULL UNIQUE, -- 'basic', 'normal', 'premium'
  name TEXT NOT NULL,
  description TEXT,
  icon TEXT DEFAULT 'Star',
  color_from TEXT DEFAULT 'slate-500',
  color_to TEXT DEFAULT 'slate-600',
  delivery_multiplier DECIMAL(3,2) NOT NULL DEFAULT 1.0,
  price_multiplier DECIMAL(3,2) NOT NULL DEFAULT 1.0,
  features TEXT[] DEFAULT '{}',
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.project_tiers ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Anyone can view active tiers"
  ON public.project_tiers
  FOR SELECT
  USING (is_active = true);

CREATE POLICY "Admins can manage tiers"
  ON public.project_tiers
  FOR ALL
  USING (has_role(auth.uid(), 'admin'));

-- Insert default tiers
INSERT INTO public.project_tiers (tier_key, name, description, icon, color_from, color_to, delivery_multiplier, price_multiplier, features, display_order) VALUES
  ('basic', 'Basic', 'Economy option with extended timeline', 'Star', 'slate-500', 'slate-600', 1.5, 1.0, 
   ARRAY['Standard delivery time', 'Basic support', 'Email communication', '2 revision rounds'], 1),
  ('normal', 'Normal', 'Standard delivery with priority support', 'Zap', 'blue-500', 'blue-600', 1.0, 1.5, 
   ARRAY['Standard delivery', 'Priority support', 'Weekly updates', '5 revision rounds'], 2),
  ('premium', 'Premium', 'Fast-track delivery with VIP treatment', 'Crown', 'amber-500', 'orange-500', 0.6, 2.5, 
   ARRAY['Fast-track delivery', '24/7 VIP support', 'Daily updates', 'Unlimited revisions', 'Dedicated manager'], 3);

-- Create index
CREATE INDEX idx_project_tiers_key ON public.project_tiers(tier_key);

-- Add trigger for updated_at
CREATE TRIGGER update_project_tiers_updated_at
  BEFORE UPDATE ON public.project_tiers
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();