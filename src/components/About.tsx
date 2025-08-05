import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Camera, Heart, Star, Users } from "lucide-react";

const About = () => {
  const achievements = [
    {
      icon: Camera,
      number: "500+",
      label: "Sessões Realizadas"
    },
    {
      icon: Heart,
      number: "200+",
      label: "Casamentos Capturados"
    },
    {
      icon: Star,
      number: "5",
      label: "Anos de Experiência"
    },
    {
      icon: Users,
      number: "98%",
      label: "Clientes Satisfeitos"
    }
  ];

  return (
    <section id="about" className="py-20 bg-background">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="animate-fade-in">
            <h2 className="text-4xl md:text-5xl font-serif font-bold text-primary mb-6">
              Sobre o Studio
            </h2>
            
            <div className="space-y-6 text-lg text-muted-foreground leading-relaxed">
              <p>
                Há mais de 5 anos dedico-me à arte de capturar momentos únicos e transformá-los em memórias eternas. 
                Cada clique é pensado, cada enquadramento é cuidado, cada história é respeitada.
              </p>
              
              <p>
                Acredito que a fotografia vai além da técnica — é sobre conexão, emoção e autenticidade. 
                O meu objetivo é fazer com que te sintas confortável e natural, para que a tua verdadeira essência 
                seja capturada em cada imagem.
              </p>
              
              <p>
                Especializo-me em casamentos, sessões de família, eventos corporativos e conteúdo para redes sociais. 
                Cada projeto é único e recebe a atenção personalizada que merece.
              </p>
            </div>

            <div className="mt-8">
              <p className="text-2xl font-serif italic text-primary mb-6">
                "Fotografar é capturar não apenas o que se vê, mas o que se sente."
              </p>
              
              <Button size="lg" className="hover-zoom shadow-elegant">
                Conhecer o Meu Trabalho
              </Button>
            </div>
          </div>

          {/* Right Content - Photographer Image */}
          <div className="animate-scale-in">
            <div className="relative">
              {/* Main Image */}
              <div className="relative overflow-hidden rounded-lg shadow-portfolio">
                <img 
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=700&fit=crop&crop=face"
                  alt="Fotógrafo profissional em estúdio"
                  className="w-full h-[500px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
              </div>

              {/* Floating Card */}
              <Card className="absolute -bottom-8 -left-8 p-6 bg-white shadow-elegant border-0">
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
                    <Camera className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <div>
                    <p className="font-semibold text-primary">Studio Visual</p>
                    <p className="text-sm text-muted-foreground">Fotografia Profissional</p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>

        {/* Achievements Section */}
        <div className="mt-20 animate-slide-up">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon;
              return (
                <Card key={index} className="p-6 text-center hover:shadow-portfolio transition-shadow duration-300 hover-zoom">
                  <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-3xl font-serif font-bold text-primary mb-2">
                    {achievement.number}
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">
                    {achievement.label}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;