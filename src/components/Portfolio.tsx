import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, Users, Baby, Camera, Building, PlayCircle } from "lucide-react";

const Portfolio = () => {
  const [activeFilter, setActiveFilter] = useState('todos');

  const categories = [
    { id: 'todos', name: 'Todos', icon: Camera },
    { id: 'casamentos', name: 'Casamentos', icon: Heart },
    { id: 'familias', name: 'Famílias', icon: Users },
    { id: 'batizados', name: 'Batizados', icon: Baby },
    { id: 'gestantes', name: 'Gestantes', icon: Heart },
    { id: 'corporativo', name: 'Corporativo', icon: Building },
    { id: 'videos', name: 'Vídeos', icon: PlayCircle }
  ];

  // Mock portfolio data - In a real app, these would come from a database or CMS
  const portfolioItems = [
    {
      id: 1,
      title: "Casamento Maria & João",
      category: "casamentos",
      image: "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?w=500&h=600&fit=crop&crop=faces",
      description: "Uma celebração íntima de amor verdadeiro"
    },
    {
      id: 2,
      title: "Sessão Família Silva",
      category: "familias",
      image: "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=500&h=600&fit=crop&crop=faces",
      description: "Momentos de cumplicidade e alegria"
    },
    {
      id: 3,
      title: "Batizado Pequeno Miguel",
      category: "batizados",
      image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=500&h=600&fit=crop&crop=faces",
      description: "Um dia especial de bênçãos"
    },
    {
      id: 4,
      title: "Ensaio Gestante Ana",
      category: "gestantes",
      image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=500&h=600&fit=crop&crop=faces",
      description: "A beleza da espera"
    },
    {
      id: 5,
      title: "Corporativo Tech Company",
      category: "corporativo",
      image: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=500&h=600&fit=crop&crop=faces",
      description: "Profissionalismo e modernidade"
    },
    {
      id: 6,
      title: "Wedding Film Highlights",
      category: "videos",
      image: "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?w=500&h=600&fit=crop&crop=faces",
      description: "Cinematic storytelling"
    }
  ];

  const filteredItems = activeFilter === 'todos' 
    ? portfolioItems 
    : portfolioItems.filter(item => item.category === activeFilter);

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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
          {filteredItems.map((item) => (
            <div 
              key={item.id}
              className="group relative overflow-hidden rounded-lg shadow-portfolio hover:shadow-xl transition-all duration-500 hover-zoom bg-card"
            >
              {/* Image */}
              <div className="aspect-[4/5] overflow-hidden">
                <img 
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover image-zoom transition-transform duration-700"
                />
              </div>

              {/* Overlay */}
              <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                  <Badge className="mb-3 bg-white/20 text-white border-white/30">
                    {categories.find(cat => cat.id === item.category)?.name}
                  </Badge>
                  <h3 className="text-xl font-serif font-semibold mb-2">
                    {item.title}
                  </h3>
                  <p className="text-sm text-white/90">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Content for non-hover state */}
              <div className="p-6 group-hover:opacity-0 transition-opacity duration-300">
                <Badge variant="secondary" className="mb-3">
                  {categories.find(cat => cat.id === item.category)?.name}
                </Badge>
                <h3 className="text-lg font-serif font-semibold text-primary mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>

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