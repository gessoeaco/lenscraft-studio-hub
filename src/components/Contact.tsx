import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Facebook, 
  Youtube,
  Send,
  MessageCircle,
  Loader2
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

import { useSiteSettings } from "@/hooks/useSiteSettings";

const Contact = () => {
  const { settings } = useSiteSettings();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    sessionType: "",
    message: "",
    budgetRange: "",
    eventDate: "",
    location: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (value: string, name: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('contacts')
        .insert([{
          name: formData.name,
          email: formData.email,
          phone: formData.phone || null,
          session_type: formData.sessionType,
          message: formData.message,
          budget_range: formData.budgetRange || null,
          event_date: formData.eventDate || null,
          location: formData.location || null
        }]);

      if (error) throw error;

      toast({
        title: "Mensagem enviada com sucesso!",
        description: "Responderemos em até 48h úteis. Obrigado pelo contacto!",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        sessionType: "",
        message: "",
        budgetRange: "",
        eventDate: "",
        location: ""
      });

    } catch (error) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Erro ao enviar mensagem",
        description: "Tenta novamente ou contacta-nos directamente.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
            {settings.contact_title || "Vamos Conversar"}
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            {settings.contact_description || "Tens um projeto em mente? Conta-me a tua ideia e vamos criar algo especial juntos."}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="animate-fade-in">
            <Card className="p-8 shadow-portfolio border-0 bg-card">
              <h3 className="text-2xl font-serif font-semibold text-primary mb-6">
                Enviar Mensagem
              </h3>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-foreground">
                      Nome *
                    </Label>
                    <Input 
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="O teu nome"
                      className="mt-2"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email *
                    </Label>
                    <Input 
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="exemplo@email.com"
                      className="mt-2"
                      required
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                      Telefone
                    </Label>
                    <Input 
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="+351 xxx xxx xxx"
                      className="mt-2"
                      disabled={isSubmitting}
                    />
                  </div>
                  <div>
                    <Label htmlFor="sessionType" className="text-sm font-medium text-foreground">
                      Tipo de Sessão *
                    </Label>
                    <Select
                      value={formData.sessionType}
                      onValueChange={(value) => handleSelectChange(value, "sessionType")}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Seleciona o tipo de sessão" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="casamento">Casamento</SelectItem>
                        <SelectItem value="familia">Família</SelectItem>
                        <SelectItem value="gestante">Gestante</SelectItem>
                        <SelectItem value="batizado">Batizado</SelectItem>
                        <SelectItem value="corporativo">Corporativo</SelectItem>
                        <SelectItem value="reels">Reels & Redes Sociais</SelectItem>
                        <SelectItem value="ensaio">Ensaio Pessoal</SelectItem>
                        <SelectItem value="outro">Outro</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="budgetRange" className="text-sm font-medium text-foreground">
                      Orçamento Estimado
                    </Label>
                    <Select
                      value={formData.budgetRange}
                      onValueChange={(value) => handleSelectChange(value, "budgetRange")}
                      disabled={isSubmitting}
                    >
                      <SelectTrigger className="mt-2">
                        <SelectValue placeholder="Faixa de orçamento" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ate-500">Até €500</SelectItem>
                        <SelectItem value="500-1000">€500 - €1.000</SelectItem>
                        <SelectItem value="1000-2000">€1.000 - €2.000</SelectItem>
                        <SelectItem value="2000-5000">€2.000 - €5.000</SelectItem>
                        <SelectItem value="5000-plus">Mais de €5.000</SelectItem>
                        <SelectItem value="a-definir">A definir</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="eventDate" className="text-sm font-medium text-foreground">
                      Data Desejada
                    </Label>
                    <Input 
                      id="eventDate"
                      name="eventDate"
                      type="date"
                      value={formData.eventDate}
                      onChange={handleInputChange}
                      className="mt-2"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="location" className="text-sm font-medium text-foreground">
                    Local Preferido
                  </Label>
                  <Input 
                    id="location"
                    name="location"
                    value={formData.location}
                    onChange={handleInputChange}
                    placeholder="Ex: Porto, Lisboa, Estúdio, Exterior..."
                    className="mt-2"
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm font-medium text-foreground">
                    Conta-me a tua ideia *
                  </Label>
                  <Textarea 
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    placeholder="Descreve o teu projeto, número de pessoas, inspirações, estilo pretendido... Quanto mais detalhes, melhor!"
                    className="mt-2 min-h-[120px]"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full hover-zoom shadow-elegant group"
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
                      Enviar Mensagem
                    </>
                  )}
                </Button>

                <p className="text-sm text-muted-foreground text-center">
                  Resposta garantida em até 48h úteis
                </p>
              </form>
            </Card>
          </div>

          {/* Contact Info & Map */}
          <div className="space-y-8 animate-scale-in">
            {/* Contact Information */}
            <Card className="p-8 shadow-portfolio border-0 bg-card">
              <h3 className="text-2xl font-serif font-semibold text-primary mb-6">
                Informações de Contato
              </h3>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Email</p>
                    <p className="text-muted-foreground">contato@studiovisual.pt</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Telefone / WhatsApp</p>
                    <p className="text-muted-foreground">+351 912 345 678</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-foreground">Estúdio</p>
                    <p className="text-muted-foreground">
                      Rua das Artes, 123<br />
                      4000-000 Porto, Portugal
                    </p>
                  </div>
                </div>
              </div>

              {/* WhatsApp CTA */}
              <div className="mt-8 p-4 bg-accent rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-foreground">Preferes WhatsApp?</p>
                    <p className="text-sm text-muted-foreground">Resposta mais rápida</p>
                  </div>
                  <Button size="sm" variant="outline" className="hover-zoom">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Enviar WhatsApp
                  </Button>
                </div>
              </div>
            </Card>

            {/* Social Media */}
            <Card className="p-8 shadow-portfolio border-0 bg-card">
              <h3 className="text-xl font-serif font-semibold text-primary mb-6">
                Segue o Trabalho
              </h3>
              
              <div className="flex space-x-4">
                <Button 
                  asChild
                  variant="outline" 
                  size="lg" 
                  className="flex-1 hover-zoom shadow-elegant"
                >
                  <a href={settings.social_links?.instagram || "#"} target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                    <Instagram className="h-5 w-5" />
                  </a>
                </Button>
                <Button 
                  asChild
                  variant="outline" 
                  size="lg" 
                  className="flex-1 hover-zoom shadow-elegant"
                >
                  <a href={settings.social_links?.facebook || "#"} target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                    <Facebook className="h-5 w-5" />
                  </a>
                </Button>
                <Button 
                  asChild
                  variant="outline" 
                  size="lg" 
                  className="flex-1 hover-zoom shadow-elegant"
                >
                  <a href={settings.social_links?.youtube || "#"} target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                    <Youtube className="h-5 w-5" />
                  </a>
                </Button>
              </div>

              <p className="text-sm text-muted-foreground text-center mt-4">
                {settings.social_links?.instagram?.replace(/https?:\/\/[^/]+\//, '@') || '@studiovisual.pt'}
              </p>
            </Card>

            {/* Working Hours */}
            <Card className="p-8 shadow-portfolio border-0 bg-card">
              <h3 className="text-xl font-serif font-semibold text-primary mb-4">
                Horário de Atendimento
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Segunda - Sexta</span>
                  <span className="text-foreground">9h - 18h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Sábado</span>
                  <span className="text-foreground">10h - 16h</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Domingo</span>
                  <span className="text-foreground">Sessões agendadas</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;