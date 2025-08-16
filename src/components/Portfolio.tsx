import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Heart, Users, Baby, Camera, Building, PlayCircle } from "lucide-react";

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('all');

  const categories = [
    { id: 'all', name: 'Todos', icon: Camera },
    { id: 'Casais', name: 'Casais', icon: Heart },
    { id: 'Família', name: 'Famílias', icon: Users },
    { id: 'Maternidade', name: 'Maternidade', icon: Baby },
    { id: 'Individual', name: 'Individual', icon: Heart },
    { id: 'Corporativo', name: 'Corporativo', icon: Building },
    { id: 'Eventos', name: 'Eventos', icon: PlayCircle }
  ];

  // Mock portfolio data - In a real app, these would come from a database or CMS
const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolioSessions = async () => {
      try {
        const { data, error } = await supabase
          .from("portfolio_sessions")
          .select("*")
          .eq("is_published", true)
          .order("created_at", { ascending: false });

        if (error) throw error;
        setPortfolioItems(data || []);
      } catch (error) {
        console.error("Error fetching portfolio sessions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchPortfolioSessions();
  }, []);

  const filteredItems = activeFilter === 'all' 
    ? portfolioItems 
    : portfolioItems.filter((item: any) => item.category === activeFilter);

  return (
    <section id="portfolio" className="py-20 bg-secondary/50">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
            Portfólio
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Cada imagem conta uma história. Cada momento é único e merece ser eternizado com arte e sensibilidade.
          </p>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap justify-center gap-4 mb-12 animate-scale-in">
          {categories.map((category) => {
            const Icon = category.icon;
            return (
              <Button
                key={category.id}
                variant={activeFilter === category.id ? "default" : "outline"}
                size="lg"
                onClick={() => setActiveFilter(category.id)}
                className="hover-zoom group"
              >
                <Icon className="h-4 w-4 mr-2" />
                {category.name}
              </Button>
            );
          })}
        </div>

        {/* Portfolio Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-lg overflow-hidden bg-card">
                <Skeleton className="aspect-[4/5] w-full" />
                <div className="p-6">
                  <Skeleton className="h-6 w-20 mb-3" />
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
            {filteredItems.map((item: any, index: any) => (
              <Link key={item.id} to={`/portfolio/${item.slug}`} className="animate-fade-in" style={{animationDelay: `${index * 0.1}s`}}>
                <div className="group relative overflow-hidden rounded-lg shadow-portfolio hover:shadow-xl transition-all duration-500 hover-lift bg-card">
                  {/* Image */}
                  <div className="aspect-[4/5] overflow-hidden">
                    <img 
                      src={item.cover_image || "/placeholder.svg?height=400&width=600"}
                      alt={item.title}
                      loading="lazy"
                      decoding="async"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="w-full h-full object-cover image-zoom transition-transform duration-700"
                    />
                  </div>

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                      <Badge className="mb-3 bg-white/20 text-white border-white/30">
                        {categories.find(cat => cat.id === item.category)?.name || item.category}
                      </Badge>
                      <h3 className="text-xl font-serif font-semibold mb-2">
                        {item.title}
                      </h3>
                      <p className="text-sm text-white/90 line-clamp-2">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Content for non-hover state */}
                  <div className="p-6 group-hover:opacity-0 transition-opacity duration-300">
                    <Badge variant="secondary" className="mb-3">
                      {categories.find(cat => cat.id === item.category)?.name || item.category}
                    </Badge>
                    <h3 className="text-lg font-serif font-semibold text-primary mb-2">
                      {item.title}
                    </h3>
                    <p className="text-muted-foreground text-sm line-clamp-2">
                      {item.description}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* View More Button */}
        <div className="text-center mt-12">
          <Button size="lg" variant="outline" className="hover-zoom shadow-elegant">
            Ver Portfólio Completo
          </Button>
        </div>
      </div>
    </section>
  );
};

export default Portfolio;