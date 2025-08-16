import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Calendar, MapPin, ImageIcon } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import PortfolioGallery from "@/components/PortfolioGallery";

interface PortfolioSession {
  id: string;
  title: string;
  slug: string;
  category: string;
  description: string;
  session_date: string;
  location: string;
  cover_image: string;
  created_at: string;
}

interface PortfolioImage {
  id: string;
  image_url: string;
  alt_text: string;
  sort_order: number;
}

const PortfolioDetail = () => {
  const { slug } = useParams<{ slug: string }>();
  const [session, setSession] = useState<PortfolioSession | null>(null);
  const [images, setImages] = useState<PortfolioImage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolioData = async () => {
      if (!slug) return;

      try {
        // Fetch session details
        const { data: sessionData, error: sessionError } = await supabase
          .from("portfolio_sessions")
          .select("*")
          .eq("slug", slug)
          .eq("is_published", true)
          .single();

        if (sessionError) throw sessionError;
        setSession(sessionData);

        // Fetch images for this session
        const { data: imagesData, error: imagesError } = await supabase
          .from("portfolio_images")
          .select("*")
          .eq("session_id", sessionData.id)
          .order("sort_order", { ascending: true });

        if (imagesError) throw imagesError;
        setImages(imagesData || []);
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioData();
  }, [slug]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("pt-BR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      "Casais": "bg-pink-100 text-pink-800",
      "Maternidade": "bg-purple-100 text-purple-800",
      "Família": "bg-blue-100 text-blue-800",
      "Individual": "bg-green-100 text-green-800",
      "Corporativo": "bg-gray-100 text-gray-800",
      "Eventos": "bg-yellow-100 text-yellow-800",
    };
    return colors[category as keyof typeof colors] || "bg-gray-100 text-gray-800";
  };

  // SEO: update document title
  useEffect(() => {
    if (session?.title) {
      document.title = `${session.title} | Portfólio`;
    }
  }, [session?.title]);
  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="container mx-auto px-4 py-8">
          <Skeleton className="h-8 w-32 mb-8" />
          <div className="grid gap-8 lg:grid-cols-2">
            <div>
              <Skeleton className="h-8 w-3/4 mb-4" />
              <Skeleton className="h-4 w-24 mb-2" />
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-4 w-28 mb-6" />
              <Skeleton className="h-32 w-full" />
            </div>
            <Skeleton className="h-96 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Sessão não encontrada</h1>
          <Link to="/portfolio" className="text-primary hover:underline">
            Voltar ao portfólio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header with back button */}
        <div className="mb-8">
          <Link
            to="/#portfolio"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Portfólio
          </Link>
        </div>

        {/* Main content */}
        <div className="grid gap-12 lg:grid-cols-2 animate-fade-in">
          {/* Session details */}
          <div className="space-y-6">
            <div>
              <Badge className={getCategoryColor(session.category)}>
                {session.category}
              </Badge>
              <h1 className="text-4xl font-serif font-bold mt-4 mb-6 animate-slide-in-right">
                {session.title}
              </h1>
              
              <div className="flex flex-wrap gap-4 text-muted-foreground mb-6 animate-fade-in" style={{animationDelay: '0.2s'}}>
                {session.session_date && (
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(session.session_date)}</span>
                  </div>
                )}
                {session.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    <span>{session.location}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <ImageIcon className="h-4 w-4" />
                  <span>{images.length} fotos</span>
                </div>
              </div>

              {session.description && (
                <div className="prose prose-gray max-w-none animate-fade-in" style={{animationDelay: '0.4s'}}>
                  <p className="text-lg leading-relaxed text-muted-foreground">{session.description}</p>
                </div>
              )}
            </div>
          </div>

          {/* Featured image */}
          {session.cover_image && (
            <div className="relative animate-scale-in" style={{animationDelay: '0.3s'}}>
              <div className="aspect-[4/5] overflow-hidden rounded-lg shadow-portfolio">
                <img
                  src={session.cover_image}
                  alt={session.title}
                  loading="lazy"
                  decoding="async"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="w-full h-full object-cover hover-lift transition-transform duration-500"
                />
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Image Gallery */}
        <div className="mt-16 animate-slide-up">
          <PortfolioGallery
            images={images}
            coverImage={session.cover_image}
            title={session.title}
          />
        </div>
      </div>
    </div>
  );
};

export default PortfolioDetail;