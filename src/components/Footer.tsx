import { Camera, Heart, Instagram, Facebook, Youtube, Mail, Phone } from "lucide-react";
import { useSiteSettings } from "@/hooks/useSiteSettings";

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const { settings } = useSiteSettings();

  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-6 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <Camera className="h-8 w-8" />
              <span className="text-2xl font-serif font-semibold">Studio Visual</span>
            </div>
            <p className="text-primary-foreground/80 mb-6 max-w-md leading-relaxed">
              Momentos passam. Imagens permanecem. Especializamos-nos em capturar a essência de cada momento 
              com arte, técnica e sensibilidade.
            </p>
            <div className="flex space-x-4">
              <a 
                href={settings.social_links?.instagram || "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href={settings.social_links?.facebook || "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href={settings.social_links?.youtube || "#"}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
                className="w-10 h-10 bg-primary-foreground/10 rounded-lg flex items-center justify-center hover:bg-primary-foreground/20 transition-colors"
              >
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-serif font-semibold mb-4">Navegação</h3>
            <ul className="space-y-3">
              <li>
                <a href="#home" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Início
                </a>
              </li>
              <li>
                <a href="#portfolio" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Portfólio
                </a>
              </li>
              <li>
                <a href="#about" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Sobre
                </a>
              </li>
              <li>
                <a href="#sessions" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Sessões
                </a>
              </li>
              <li>
                <a href="#contact" className="text-primary-foreground/80 hover:text-primary-foreground transition-colors">
                  Contato
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-serif font-semibold mb-4">Contato Rápido</h3>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary-foreground/80" />
                <span className="text-primary-foreground/80 text-sm">{settings.social_links?.email || "contato@studiovisual.pt"}</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-primary-foreground/80" />
                <span className="text-primary-foreground/80 text-sm">{settings.social_links?.whatsapp || "+351 912 345 678"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-primary-foreground/20 pt-8">
          {/* Bottom Footer */}
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-primary-foreground/60 text-sm">
              © {currentYear} Studio Visual. Todos os direitos reservados.
            </div>
            
            <div className="flex items-center space-x-6 text-sm text-primary-foreground/60">
              <a href="#" className="hover:text-primary-foreground transition-colors">
                Política de Privacidade
              </a>
              <a href="#" className="hover:text-primary-foreground transition-colors">
                Termos de Serviço
              </a>
            </div>
          </div>

          {/* Inspirational Quote */}
          <div className="text-center mt-8 pt-6 border-t border-primary-foreground/10">
            <p className="text-primary-foreground/80 font-serif italic flex items-center justify-center space-x-2">
              <Heart className="h-4 w-4" />
              <span>"Cada clique é uma história. Cada história merece ser contada."</span>
              <Heart className="h-4 w-4" />
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;