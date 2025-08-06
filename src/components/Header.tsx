import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Menu, X, Camera, Calendar, Mail } from "lucide-react";
import BookingModal from "./BookingModal";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const navigationItems = [
    { name: 'Início', href: '#home' },
    { name: 'Portfólio', href: '#portfolio' },
    { name: 'Sobre', href: '#about' },
    { name: 'Sessões', href: '#sessions' },
    { name: 'Blog', href: '#blog' },
    { name: 'Contato', href: '#contact' }
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <Camera className="h-8 w-8 text-primary" />
            <span className="text-2xl font-serif font-semibold text-primary">Studio Visual</span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navigationItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className="text-foreground hover:text-primary transition-colors duration-300 font-medium"
              >
                {item.name}
              </a>
            ))}
          </nav>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <BookingModal>
              <Button variant="outline" size="sm" className="hover-zoom">
                <Calendar className="h-4 w-4 mr-2" />
                Agendar
              </Button>
            </BookingModal>
            <Button size="sm" className="hover-zoom">
              <Mail className="h-4 w-4 mr-2" />
              Orçamento
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="sm"
            className="md:hidden"
            onClick={toggleMenu}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-border animate-fade-in">
            <nav className="flex flex-col space-y-4">
              {navigationItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-foreground hover:text-primary transition-colors duration-300 font-medium py-2"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              <div className="flex flex-col space-y-3 pt-4 border-t border-border">
                <BookingModal>
                  <Button variant="outline" size="sm" className="justify-start">
                    <Calendar className="h-4 w-4 mr-2" />
                    Agendar Sessão
                  </Button>
                </BookingModal>
                <Button size="sm" className="justify-start">
                  <Mail className="h-4 w-4 mr-2" />
                  Pedir Orçamento
                </Button>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;