-- Create blog posts table for visual diary
CREATE TABLE public.blog_posts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT,
  content TEXT NOT NULL,
  featured_image TEXT,
  gallery_images TEXT[], -- Array of image URLs
  category TEXT DEFAULT 'behind-scenes' CHECK (category IN ('behind-scenes', 'client-stories', 'tips', 'inspiration')),
  tags TEXT[],
  is_published BOOLEAN DEFAULT false,
  publish_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (only published posts)
CREATE POLICY "Anyone can view published blog posts" 
ON public.blog_posts 
FOR SELECT 
USING (is_published = true AND publish_date <= now());

-- Create policy for admin access
CREATE POLICY "Admins can manage blog posts" 
ON public.blog_posts 
FOR ALL 
USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_blog_posts_updated_at
BEFORE UPDATE ON public.blog_posts
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Insert sample blog posts
INSERT INTO public.blog_posts (title, slug, excerpt, content, featured_image, category, tags, is_published, publish_date) VALUES
(
  'Bastidores de um Casamento de Sonho',
  'bastidores-casamento-sonho',
  'Uma viagem pelos momentos mais especiais e autênticos de um casamento único no Porto.',
  'Cada casamento conta uma história única, e este não foi exceção. Desde os preparativos matinais até à festa que se prolongou pela madrugada, cada momento foi capturado com cuidado e sensibilidade.\n\nO que mais me emociona na fotografia de casamento é a capacidade de preservar não apenas as imagens, mas as emoções. O nervosismo antes da cerimónia, a alegria no "sim", as lágrimas de felicidade dos pais...\n\nEste casamento ensinou-me que por vezes os melhores momentos acontecem entre as poses, nos intervalos, nos olhares trocados quando pensam que ninguém está a ver.',
  'https://images.unsplash.com/photo-1606216794074-735e91aa2c92?w=800&h=600&fit=crop',
  'behind-scenes',
  ARRAY['casamento', 'bastidores', 'emoções'],
  true,
  now() - interval '2 days'
),
(
  'Como Preparar-se para uma Sessão de Família',
  'preparar-sessao-familia',
  'Dicas essenciais para que a vossa sessão de família seja natural e memorável.',
  'Uma sessão de família bem-sucedida começa muito antes do dia da fotografia. Aqui ficam algumas dicas que partilho sempre com os meus clientes:\n\n**Escolham roupas confortáveis** - O mais importante é sentirem-se bem. Cores neutras e coordenadas (mas não iguais) funcionam sempre bem.\n\n**Tragam objectos especiais** - Um brinquedo favorito, um livro, algo que faça parte do vosso dia-a-dia torna as fotos mais autênticas.\n\n**Não se preocupem com a perfeição** - As melhores fotos de família são as espontâneas, onde se vêem as vossas personalidades.\n\nLembrem-se: estou aqui para capturar quem vocês realmente são, não quem acham que deviam ser.',
  'https://images.unsplash.com/photo-1475503572774-15a45e5d60b9?w=800&h=600&fit=crop',
  'tips',
  ARRAY['família', 'dicas', 'preparação'],
  true,
  now() - interval '5 days'
);

-- Create testimonials table
CREATE TABLE public.testimonials (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  client_email TEXT,
  session_type TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  testimonial TEXT NOT NULL,
  client_photo TEXT,
  is_featured BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (only approved testimonials)
CREATE POLICY "Anyone can view approved testimonials" 
ON public.testimonials 
FOR SELECT 
USING (is_approved = true);

-- Create policy for public inserts (clients can submit testimonials)
CREATE POLICY "Anyone can submit testimonials" 
ON public.testimonials 
FOR INSERT 
WITH CHECK (true);

-- Insert sample testimonials
INSERT INTO public.testimonials (client_name, session_type, rating, testimonial, is_featured, is_approved) VALUES
(
  'Maria & João Silva',
  'Casamento',
  5,
  'O trabalho do Studio Visual superou todas as nossas expectativas! Conseguiu capturar cada emoção do nosso grande dia de forma natural e artística. As fotos são simplesmente perfeitas e vamos guardá-las para sempre no coração.',
  true,
  true
),
(
  'Ana Rodrigues',
  'Família',
  5,
  'Sessão incrível com os meus filhos! Conseguiu que eles se sentissem à vontade e capturou momentos genuínos de felicidade. Recomendo a 100%!',
  true,
  true
),
(
  'Pedro Costa',
  'Corporativo',
  5,
  'Profissionalismo e qualidade excepcionais. As fotos corporativas ficaram excelentes e ajudaram muito no nosso marketing. Muito obrigado!',
  false,
  true
);