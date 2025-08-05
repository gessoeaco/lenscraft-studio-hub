import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Instagram, 
  Facebook, 
  Youtube,
  Send,
  MessageCircle
} from "lucide-react";

const Contact = () => {
  return (
    <section id="contact" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
            Vamos Conversar
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Tens um projeto em mente? Conta-me a tua ideia e vamos criar algo especial juntos.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          {/* Contact Form */}
          <div className="animate-fade-in">
            <Card className="p-8 shadow-portfolio border-0 bg-card">
              <h3 className="text-2xl font-serif font-semibold text-primary mb-6">
                Enviar Mensagem
              </h3>
              
              <form className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium text-foreground">
                      Nome *
                    </Label>
                    <Input 
                      id="name"
                      placeholder="O teu nome"
                      className="mt-2"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium text-foreground">
                      Email *
                    </Label>
                    <Input 
                      id="email"
                      type="email"
                      placeholder="exemplo@email.com"
                      className="mt-2"
                      required
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="phone" className="text-sm font-medium text-foreground">
                    Telefone
                  </Label>
                  <Input 
                    id="phone"
                    type="tel"
                    placeholder="+351 xxx xxx xxx"
                    className="mt-2"
                  />
                </div>

                <div>
                  <Label htmlFor="subject" className="text-sm font-medium text-foreground">
                    Tipo de Sessão *
                  </Label>
                  <Input 
                    id="subject"
                    placeholder="Ex: Casamento, Família, Corporativo..."
                    className="mt-2"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="message" className="text-sm font-medium text-foreground">
                    Conta-me a tua ideia *
                  </Label>
                  <Textarea 
                    id="message"
                    placeholder="Descreve o teu projeto, data desejada, local, número de pessoas, inspirações... Quanto mais detalhes, melhor!"
                    className="mt-2 min-h-[120px]"
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  size="lg" 
                  className="w-full hover-zoom shadow-elegant group"
                >
                  <Send className="h-4 w-4 mr-2" />
                  Enviar Mensagem
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
                  variant="outline" 
                  size="lg" 
                  className="flex-1 hover-zoom shadow-elegant"
                >
                  <Instagram className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="flex-1 hover-zoom shadow-elegant"
                >
                  <Facebook className="h-5 w-5" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="flex-1 hover-zoom shadow-elegant"
                >
                  <Youtube className="h-5 w-5" />
                </Button>
              </div>

              <p className="text-sm text-muted-foreground text-center mt-4">
                @studiovisual.pt
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