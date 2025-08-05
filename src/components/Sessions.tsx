import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Heart, 
  Users, 
  Baby, 
  Camera, 
  Building, 
  Clock, 
  MapPin, 
  Calendar,
  ArrowRight 
} from "lucide-react";

const Sessions = () => {
  const sessionTypes = [
    {
      id: 'mini-sessions',
      title: 'Mini Sessões Temáticas',
      description: 'Sessões rápidas e criativas para ocasiões especiais',
      duration: '30 min',
      location: 'Estúdio ou Externo',
      startingPrice: 'A partir de 89€',
      features: [
        '10-15 fotos editadas',
        'Cenário temático',
        'Entrega em 7 dias',
        'Galeria online privada'
      ],
      icon: Camera,
      popular: true,
      color: 'bg-accent'
    },
    {
      id: 'couple-session',
      title: 'Ensaios Pessoais & Casal',
      description: 'Momentos íntimos e autênticos para eternizar',
      duration: '1-2h',
      location: 'Local à escolha',
      startingPrice: 'A partir de 150€',
      features: [
        '30-50 fotos editadas',
        'Múltiplas localizações',
        'Orientação de poses',
        'Entrega em 10 dias'
      ],
      icon: Heart,
      popular: false,
      color: 'bg-secondary'
    },
    {
      id: 'family-session',
      title: 'Sessões de Família',
      description: 'Capturando conexões e momentos especiais em família',
      duration: '1-2h',
      location: 'Estúdio, Casa ou Externo',
      startingPrice: 'A partir de 180€',
      features: [
        '40-60 fotos editadas',
        'Múltiplas combinações',
        'Fotos individuais e grupo',
        'Entrega em 14 dias'
      ],
      icon: Users,
      popular: false,
      color: 'bg-muted'
    },
    {
      id: 'events',
      title: 'Eventos & Celebrações',
      description: 'Cobertura completa de momentos especiais',
      duration: '3-8h',
      location: 'Local do evento',
      startingPrice: 'Consultar',
      features: [
        'Cobertura completa',
        'Edição profissional',
        'Galeria online',
        'Entrega personalizada'
      ],
      icon: Baby,
      popular: false,
      color: 'bg-accent'
    },
    {
      id: 'corporate',
      title: 'Corporativo & Empresarial',
      description: 'Conteúdo profissional para empresas e marcas',
      duration: '2-4h',
      location: 'Escritório ou Estúdio',
      startingPrice: 'A partir de 250€',
      features: [
        'Fotos corporativas',
        'Headshots profissionais',
        'Conteúdo para marketing',
        'Múltiplos formatos'
      ],
      icon: Building,
      popular: false,
      color: 'bg-secondary'
    },
    {
      id: 'social-media',
      title: 'Conteúdo para Redes Sociais',
      description: 'Fotos e vídeos otimizados para Instagram e TikTok',
      duration: '1-3h',
      location: 'Estúdio ou Externo',
      startingPrice: 'A partir de 120€',
      features: [
        'Fotos + Reels curtos',
        'Múltiplos looks',
        'Edição para redes sociais',
        'Templates personalizados'
      ],
      icon: Camera,
      popular: true,
      color: 'bg-muted'
    }
  ];

  return (
    <section id="sessions" className="py-20 bg-secondary/30">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 animate-fade-in">
          <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
            Sessões & Pacotes
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Cada sessão é pensada especialmente para ti. Escolhe o tipo que melhor se adapta ao teu momento especial.
          </p>
        </div>

        {/* Sessions Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up">
          {sessionTypes.map((session) => {
            const Icon = session.icon;
            return (
              <Card 
                key={session.id}
                className={`relative p-6 hover:shadow-portfolio transition-all duration-300 hover-zoom group border-0 ${session.color}`}
              >
                {/* Popular Badge */}
                {session.popular && (
                  <div className="absolute -top-3 left-6">
                    <Badge className="bg-primary text-primary-foreground shadow-elegant">
                      Mais Popular
                    </Badge>
                  </div>
                )}

                {/* Icon */}
                <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-6 group-hover:bg-primary/20 transition-colors">
                  <Icon className="h-6 w-6 text-primary" />
                </div>

                {/* Content */}
                <div className="space-y-4">
                  <h3 className="text-xl font-serif font-semibold text-primary">
                    {session.title}
                  </h3>
                  
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {session.description}
                  </p>

                  {/* Session Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-muted-foreground">
                      <Clock className="h-4 w-4 mr-2" />
                      {session.duration}
                    </div>
                    <div className="flex items-center text-muted-foreground">
                      <MapPin className="h-4 w-4 mr-2" />
                      {session.location}
                    </div>
                  </div>

                  {/* Price */}
                  <div className="text-lg font-semibold text-primary">
                    {session.startingPrice}
                  </div>

                  {/* Features */}
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    {session.features.map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <div className="w-1.5 h-1.5 bg-primary rounded-full mt-2 mr-3 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <Button 
                    className="w-full group hover-zoom shadow-elegant mt-6"
                    size="lg"
                  >
                    <Calendar className="h-4 w-4 mr-2" />
                    Agendar Sessão
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16 animate-fade-in">
          <div className="bg-card p-8 rounded-lg shadow-elegant max-w-2xl mx-auto">
            <h3 className="text-2xl font-serif font-semibold text-primary mb-4">
              Não encontras o que procuras?
            </h3>
            <p className="text-muted-foreground mb-6">
              Cada projeto é único. Vamos conversar sobre as tuas necessidades e criar algo especial juntos.
            </p>
            <Button size="lg" variant="outline" className="hover-zoom shadow-elegant">
              Pedir Orçamento Personalizado
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Sessions;