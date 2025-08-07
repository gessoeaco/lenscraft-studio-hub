-- Create portfolio sessions table
CREATE TABLE public.portfolio_sessions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  description TEXT,
  session_date DATE,
  location TEXT,
  cover_image TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create portfolio images table (up to 20 images per session)
CREATE TABLE public.portfolio_images (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES public.portfolio_sessions(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  alt_text TEXT,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create site settings table for configurable content
CREATE TABLE public.site_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  setting_key TEXT NOT NULL UNIQUE,
  setting_value JSONB,
  setting_type TEXT NOT NULL DEFAULT 'text', -- text, image, json, boolean
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.portfolio_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for portfolio_sessions
CREATE POLICY "Anyone can view published portfolio sessions" 
ON public.portfolio_sessions 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Admins can manage portfolio sessions" 
ON public.portfolio_sessions 
FOR ALL 
USING (true);

-- RLS Policies for portfolio_images
CREATE POLICY "Anyone can view portfolio images" 
ON public.portfolio_images 
FOR SELECT 
USING (EXISTS (
  SELECT 1 FROM public.portfolio_sessions 
  WHERE portfolio_sessions.id = portfolio_images.session_id 
  AND portfolio_sessions.is_published = true
));

CREATE POLICY "Admins can manage portfolio images" 
ON public.portfolio_images 
FOR ALL 
USING (true);

-- RLS Policies for site_settings
CREATE POLICY "Anyone can view site settings" 
ON public.site_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage site settings" 
ON public.site_settings 
FOR ALL 
USING (true);

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('portfolio', 'portfolio', true),
  ('blog', 'blog', true),
  ('site-assets', 'site-assets', true);

-- Storage policies for portfolio bucket
CREATE POLICY "Anyone can view portfolio images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'portfolio');

CREATE POLICY "Admins can upload portfolio images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'portfolio');

CREATE POLICY "Admins can update portfolio images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'portfolio');

CREATE POLICY "Admins can delete portfolio images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'portfolio');

-- Storage policies for blog bucket
CREATE POLICY "Anyone can view blog images" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'blog');

CREATE POLICY "Admins can upload blog images" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'blog');

CREATE POLICY "Admins can update blog images" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'blog');

CREATE POLICY "Admins can delete blog images" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'blog');

-- Storage policies for site assets bucket
CREATE POLICY "Anyone can view site assets" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'site-assets');

CREATE POLICY "Admins can upload site assets" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'site-assets');

CREATE POLICY "Admins can update site assets" 
ON storage.objects 
FOR UPDATE 
USING (bucket_id = 'site-assets');

CREATE POLICY "Admins can delete site assets" 
ON storage.objects 
FOR DELETE 
USING (bucket_id = 'site-assets');

-- Triggers for updated_at
CREATE TRIGGER update_portfolio_sessions_updated_at
BEFORE UPDATE ON public.portfolio_sessions
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_site_settings_updated_at
BEFORE UPDATE ON public.site_settings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default site settings
INSERT INTO public.site_settings (setting_key, setting_value, setting_type, description) VALUES
  ('contact_title', '"Entre em Contato"', 'text', 'Título da seção de contato'),
  ('contact_description', '"Adoraria saber mais sobre o seu projeto especial. Vamos conversar?"', 'text', 'Descrição da seção de contato'),
  ('social_links', '{"instagram": "", "facebook": "", "whatsapp": "", "email": ""}', 'json', 'Links das redes sociais'),
  ('hero_title', '"Capturando Momentos Únicos"', 'text', 'Título principal do hero'),
  ('hero_subtitle', '"Fotógrafa especializada em retratos, ensaios e momentos especiais"', 'text', 'Subtítulo do hero'),
  ('about_title', '"Sobre Mim"', 'text', 'Título da seção sobre'),
  ('about_description', '"Sou apaixonada por capturar a essência única de cada pessoa e momento especial..."', 'text', 'Descrição da seção sobre');

-- Add some sample portfolio data
INSERT INTO public.portfolio_sessions (title, slug, category, description, session_date, location, is_featured) VALUES
  ('Ensaio Romântico no Pôr do Sol', 'ensaio-romantico-por-do-sol', 'Casais', 'Um ensaio lindo capturando a conexão especial de um casal durante o dourado pôr do sol.', '2024-01-15', 'Praia da Joaquina, Florianópolis', true),
  ('Sessão Maternidade Primavera', 'sessao-maternidade-primavera', 'Maternidade', 'Celebrando a vida que está chegando em meio às flores da primavera.', '2024-02-20', 'Jardim Botânico', true),
  ('Retratos Corporativos Elegantes', 'retratos-corporativos-elegantes', 'Corporativo', 'Retratos profissionais que transmitem confiança e personalidade.', '2024-03-10', 'Estúdio', false);