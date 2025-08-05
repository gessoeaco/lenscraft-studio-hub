import { Button } from "@/components/ui/button";
import { ArrowRight, Eye, Calendar } from "lucide-react";
import heroImage from "@/assets/hero-photographer.jpg";

const Hero = () => {
  return (
    <section id="home" className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      >
        <div className="absolute inset-0 bg-gradient-hero"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center text-white px-6 max-w-4xl mx-auto">
        <div className="animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-serif font-bold mb-6 leading-tight">
            Momentos passam.
            <br />
            <span className="text-gradient">Imagens permanecem.</span>
          </h1>
          
          <p className="text-xl md:text-2xl mb-8 text-white/90 font-light max-w-2xl mx-auto leading-relaxed">
            Fotografia com alma. Vídeo com verdade. 
            <br />
            Cada sessão é única, como o teu momento especial.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-slide-up">
            <Button 
              size="lg" 
              className="group bg-white text-primary hover:bg-white/90 shadow-elegant hover-zoom px-8 py-6 text-lg font-semibold"
            >
              <Eye className="h-5 w-5 mr-3" />
              Ver Portfólio
              <ArrowRight className="h-5 w-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <Button 
              variant="outline" 
              size="lg"
              className="group border-white text-white hover:bg-white hover:text-primary shadow-elegant hover-zoom px-8 py-6 text-lg font-semibold"
            >
              <Calendar className="h-5 w-5 mr-3" />
              Agendar Sessão
            </Button>
          </div>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white/70 rounded-full mt-2 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-2 h-2 bg-white/30 rounded-full animate-pulse hidden md:block"></div>
      <div className="absolute bottom-32 left-20 w-3 h-3 bg-white/20 rounded-full animate-pulse hidden md:block"></div>
    </section>
  );
};

export default Hero;