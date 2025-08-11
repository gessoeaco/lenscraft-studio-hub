import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, Tag, ArrowRight, Eye } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  featured_image: string;
  category: string;
  tags: string[];
  publish_date: string;
}

const Blog = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");

  const categories = [
    { value: "all", label: "Todos" },
    { value: "behind-scenes", label: "Bastidores" },
    { value: "client-stories", label: "Histórias de Clientes" },
    { value: "tips", label: "Dicas" },
    { value: "inspiration", label: "Inspiração" }
  ];

  useEffect(() => {
    fetchPosts();
  }, [selectedCategory]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .lte('publish_date', new Date().toISOString())
        .order('publish_date', { ascending: false });

      if (selectedCategory !== "all") {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching blog posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-PT', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const getCategoryColor = (category: string) => {
    const colors = {
      'behind-scenes': 'bg-accent text-accent-foreground',
      'client-stories': 'bg-secondary text-secondary-foreground',
      'tips': 'bg-primary text-primary-foreground',
      'inspiration': 'bg-muted text-muted-foreground'
    };
    return colors[category as keyof typeof colors] || 'bg-muted text-muted-foreground';
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    if (content.length <= maxLength) return content;
    return content.substring(0, maxLength) + '...';
  };

  return (
    <section id="blog" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
            Diário Visual
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Histórias por trás das lentes, bastidores das sessões e dicas para os vossos momentos especiais.
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12 animate-fade-in">
          {categories.map((category) => (
            <Button
              key={category.value}
              variant={selectedCategory === category.value ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedCategory(category.value)}
              className="hover-zoom"
            >
              {category.label}
            </Button>
          ))}
        </div>

        {/* Blog Posts Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
              <Card key={index} className="overflow-hidden animate-pulse">
                <div className="aspect-video bg-muted"></div>
                <div className="p-6 space-y-4">
                  <div className="h-4 bg-muted rounded w-3/4"></div>
                  <div className="h-4 bg-muted rounded w-1/2"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-muted rounded"></div>
                    <div className="h-3 bg-muted rounded w-5/6"></div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-12">
            <Eye className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Nenhum post encontrado
            </h3>
            <p className="text-muted-foreground">
              Não há posts publicados nesta categoria ainda.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
            {posts.map((post) => (
              <Card 
                key={post.id} 
                className="overflow-hidden hover:shadow-portfolio transition-all duration-300 hover-zoom group border-0 bg-card"
              >
                {/* Featured Image */}
                <div className="aspect-video overflow-hidden">
                  <img 
                    src={post.featured_image} 
                    alt={post.title}
                    loading="lazy"
                    decoding="async"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                  {/* Category & Date */}
                  <div className="flex items-center justify-between text-sm">
                    <Badge className={getCategoryColor(post.category)}>
                      {categories.find(cat => cat.value === post.category)?.label || post.category}
                    </Badge>
                    <div className="flex items-center text-muted-foreground">
                      <Calendar className="h-3 w-3 mr-1" />
                      {formatDate(post.publish_date)}
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="text-xl font-serif font-semibold text-primary line-clamp-2 group-hover:text-primary/80 transition-colors">
                    {post.title}
                  </h3>

                  {/* Excerpt */}
                  <p className="text-muted-foreground text-sm leading-relaxed line-clamp-3">
                    {post.excerpt || truncateContent(post.content)}
                  </p>

                  {/* Tags */}
                  {post.tags && post.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {post.tags.slice(0, 3).map((tag, index) => (
                        <span 
                          key={index}
                          className="inline-flex items-center text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full"
                        >
                          <Tag className="h-2 w-2 mr-1" />
                          {tag}
                        </span>
                      ))}
                      {post.tags.length > 3 && (
                        <span className="text-xs text-muted-foreground">
                          +{post.tags.length - 3}
                        </span>
                      )}
                    </div>
                  )}

                  {/* Read More Button */}
                  <Link to={`/blog/${post.slug}`}>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="w-full justify-between group/btn hover:bg-primary/5"
                    >
                      <span>Ler Mais</span>
                      <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* CTA Section */}
        <div className="text-center mt-16 animate-fade-in">
          <Card className="p-8 bg-primary/5 border-primary/20 max-w-2xl mx-auto">
            <h3 className="text-2xl font-serif font-semibold text-primary mb-4">
              Tens uma história para partilhar?
            </h3>
            <p className="text-muted-foreground mb-6">
              Se foste nosso cliente e queres partilhar a tua experiência, adoraríamos ouvir-te!
            </p>
            <Button className="hover-zoom shadow-elegant">
              Partilhar a Minha História
            </Button>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Blog;