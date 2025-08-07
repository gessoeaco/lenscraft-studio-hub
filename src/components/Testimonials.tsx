import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Star, 
  Quote, 
  User, 
  MessageSquare, 
  ChevronLeft, 
  ChevronRight,
  Loader2,
  Send
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface Testimonial {
  id: string;
  client_name: string;
  session_type: string;
  rating: number;
  testimonial: string;
  client_photo?: string;
}

const Testimonials = () => {
  const { toast } = useToast();
  const [testimonials, setTestimonials] = useState<Testimonial[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    clientName: "",
    sessionType: "",
    rating: 5,
    testimonial: "",
    clientEmail: ""
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .select('*')
        .eq('is_approved', true)
        .eq('is_featured', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setTestimonials(data || []);
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('testimonials')
        .insert([{
          client_name: formData.clientName,
          session_type: formData.sessionType,
          rating: formData.rating,
          testimonial: formData.testimonial,
          client_email: formData.clientEmail,
          is_approved: false,
          is_featured: false
        }]);

      if (error) throw error;

      toast({
        title: "Testemunho enviado!",
        description: "Obrigado pela partilha. O teu testemunho será analisado e publicado em breve.",
      });

      setFormData({
        clientName: "",
        sessionType: "",
        rating: 5,
        testimonial: "",
        clientEmail: ""
      });
      setShowForm(false);

    } catch (error) {
      console.error('Error submitting testimonial:', error);
      toast({
        title: "Erro ao enviar testemunho",
        description: "Tenta novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextTestimonial = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        className={`h-4 w-4 ${
          index < rating 
            ? "fill-yellow-400 text-yellow-400" 
            : "text-muted-foreground"
        }`}
      />
    ));
  };

  if (loading) {
    return (
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-6">
          <div className="animate-pulse space-y-8">
            <div className="h-8 bg-muted rounded w-64 mx-auto"></div>
            <div className="h-64 bg-muted rounded"></div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-muted/30">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
            O Que Dizem os Nossos Clientes
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Histórias reais de pessoas que confiaram em nós para capturar os seus momentos especiais.
          </p>
        </div>

        {testimonials.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Ainda não há testemunhos aprovados para mostrar.
            </p>
          </div>
        ) : (
          <>
            {/* Testimonials Carousel */}
            <div className="relative max-w-4xl mx-auto mb-12">
              <Card className="p-8 md:p-12 shadow-portfolio border-0 bg-card animate-fade-in">
                <div className="text-center">
                  <Quote className="h-12 w-12 text-primary mx-auto mb-6 opacity-50" />
                  
                  {/* Current Testimonial */}
                  <div className="space-y-6">
                    <blockquote className="text-lg md:text-xl text-foreground leading-relaxed italic">
                      "{testimonials[currentIndex]?.testimonial}"
                    </blockquote>
                    
                    <div className="flex justify-center mb-4">
                      {renderStars(testimonials[currentIndex]?.rating || 5)}
                    </div>
                    
                    <div className="flex items-center justify-center space-x-4">
                      {testimonials[currentIndex]?.client_photo ? (
                        <img 
                          src={testimonials[currentIndex].client_photo} 
                          alt={testimonials[currentIndex].client_name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-primary/20"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
                          <User className="h-6 w-6 text-primary" />
                        </div>
                      )}
                      <div className="text-left">
                        <p className="font-semibold text-primary">
                          {testimonials[currentIndex]?.client_name}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {testimonials[currentIndex]?.session_type}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Navigation Arrows */}
              {testimonials.length > 1 && (
                <>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full w-10 h-10 p-0 hover-zoom shadow-elegant"
                    onClick={prevTestimonial}
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full w-10 h-10 p-0 hover-zoom shadow-elegant"
                    onClick={nextTestimonial}
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </>
              )}

              {/* Dots Indicator */}
              {testimonials.length > 1 && (
                <div className="flex justify-center space-x-2 mt-6">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={`w-2 h-2 rounded-full transition-all ${
                        index === currentIndex 
                          ? "bg-primary w-6" 
                          : "bg-muted-foreground/30"
                      }`}
                      onClick={() => setCurrentIndex(index)}
                    />
                  ))}
                </div>
              )}
            </div>
          </>
        )}

        {/* CTA to Submit Testimonial */}
        <div className="text-center animate-fade-in">
          <Card className="p-8 bg-primary/5 border-primary/20 max-w-2xl mx-auto">
            <h3 className="text-2xl font-serif font-semibold text-primary mb-4">
              Foste nosso cliente?
            </h3>
            <p className="text-muted-foreground mb-6">
              Partilha a tua experiência connosco e ajuda outros a conhecerem o nosso trabalho.
            </p>
            
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogTrigger asChild>
                <Button className="hover-zoom shadow-elegant">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Deixar Testemunho
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Partilhar Testemunho</DialogTitle>
                </DialogHeader>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="clientName">Nome *</Label>
                    <Input
                      id="clientName"
                      value={formData.clientName}
                      onChange={(e) => setFormData(prev => ({ ...prev, clientName: e.target.value }))}
                      placeholder="O teu nome"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="clientEmail">Email</Label>
                    <Input
                      id="clientEmail"
                      type="email"
                      value={formData.clientEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, clientEmail: e.target.value }))}
                      placeholder="exemplo@email.com"
                      disabled={isSubmitting}
                    />
                  </div>

                  <div>
                    <Label htmlFor="sessionType">Tipo de Sessão *</Label>
                    <Select
                      value={formData.sessionType}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, sessionType: value }))}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleciona o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casamento">Casamento</SelectItem>
                        <SelectItem value="familia">Família</SelectItem>
                        <SelectItem value="gestante">Gestante</SelectItem>
                        <SelectItem value="batizado">Batizado</SelectItem>
                        <SelectItem value="corporativo">Corporativo</SelectItem>
                        <SelectItem value="reels">Reels & Redes Sociais</SelectItem>
                        <SelectItem value="ensaio">Ensaio Pessoal</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="rating">Avaliação *</Label>
                    <Select
                      value={formData.rating.toString()}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, rating: parseInt(value) }))}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="5">⭐⭐⭐⭐⭐ Excelente</SelectItem>
                        <SelectItem value="4">⭐⭐⭐⭐ Muito Bom</SelectItem>
                        <SelectItem value="3">⭐⭐⭐ Bom</SelectItem>
                        <SelectItem value="2">⭐⭐ Regular</SelectItem>
                        <SelectItem value="1">⭐ Fraco</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="testimonial">Testemunho *</Label>
                    <Textarea
                      id="testimonial"
                      value={formData.testimonial}
                      onChange={(e) => setFormData(prev => ({ ...prev, testimonial: e.target.value }))}
                      placeholder="Conta-nos como foi a tua experiência..."
                      className="min-h-[100px]"
                      required
                      disabled={isSubmitting}
                    />
                  </div>

                  <Button 
                    type="submit" 
                    className="w-full"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        A enviar...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Enviar Testemunho
                      </>
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;