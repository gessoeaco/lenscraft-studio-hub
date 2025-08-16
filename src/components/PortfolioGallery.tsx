import { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, ZoomIn, ZoomOut, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

interface GalleryImage {
  id: string;
  image_url: string;
  alt_text?: string;
  sort_order: number;
}

interface PortfolioGalleryProps {
  images: GalleryImage[];
  coverImage?: string;
  title: string;
  className?: string;
}

const PortfolioGallery = ({ images, coverImage, title, className = '' }: PortfolioGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Create complete image array with cover image first if exists
  const allImages = [
    ...(coverImage ? [{ id: 'cover', image_url: coverImage, alt_text: title, sort_order: -1 }] : []),
    ...images
  ];

  const openLightbox = (index: number) => {
    setSelectedIndex(index);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = useCallback(() => {
    setSelectedIndex(null);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    document.body.style.overflow = 'unset';
  }, []);

  const navigateImage = useCallback((direction: 'next' | 'prev') => {
    if (selectedIndex === null) return;
    
    const newIndex = direction === 'next' 
      ? (selectedIndex + 1) % allImages.length
      : (selectedIndex - 1 + allImages.length) % allImages.length;
    
    setSelectedIndex(newIndex);
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, [selectedIndex, allImages.length]);

  const handleZoom = (zoomIn: boolean) => {
    const newScale = zoomIn ? Math.min(scale * 1.5, 3) : Math.max(scale / 1.5, 0.5);
    setScale(newScale);
    if (newScale === 1) {
      setPosition({ x: 0, y: 0 });
    }
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (selectedIndex === null) return;
      
      switch (e.key) {
        case 'Escape':
          closeLightbox();
          break;
        case 'ArrowLeft':
          navigateImage('prev');
          break;
        case 'ArrowRight':
          navigateImage('next');
          break;
        case '+':
        case '=':
          handleZoom(true);
          break;
        case '-':
          handleZoom(false);
          break;
        case '0':
          resetZoom();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, closeLightbox, navigateImage]);

  // Mouse drag for panning when zoomed
  const handleMouseDown = (e: React.MouseEvent) => {
    if (scale > 1) {
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <>
      {/* Gallery Grid */}
      <div className={`space-y-8 ${className}`}>
        {allImages.length > 0 && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-center animate-fade-in">
              {coverImage ? 'Galeria Completa' : 'Galeria'}
            </h2>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {allImages.map((image, index) => (
                <Card
                  key={image.id}
                  className="group overflow-hidden cursor-pointer hover:shadow-portfolio transition-all duration-300 animate-scale-in hover-lift bg-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => openLightbox(index)}
                >
                  <CardContent className="p-0 relative">
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={image.image_url}
                        alt={image.alt_text || title}
                        loading="lazy"
                        decoding="async"
                        sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    </div>
                    
                    {/* Hover overlay */}
                    <div className="absolute inset-0 bg-gradient-overlay opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <ZoomIn className="h-8 w-8 text-white drop-shadow-lg" />
                    </div>
                    
                    {/* Cover badge */}
                    {image.id === 'cover' && (
                      <div className="absolute top-2 left-2">
                        <span className="bg-primary text-primary-foreground text-xs px-2 py-1 rounded-full">
                          Destaque
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Lightbox */}
      {selectedIndex !== null && (
        <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center animate-fade-in">
          {/* Controls */}
          <div className="absolute top-4 right-4 flex gap-2 z-10">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleZoom(true)}
              className="text-white hover:bg-white/10"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleZoom(false)}
              className="text-white hover:bg-white/10"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={resetZoom}
              className="text-white hover:bg-white/10"
            >
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={closeLightbox}
              className="text-white hover:bg-white/10"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Image counter */}
          <div className="absolute top-4 left-4 text-white text-sm bg-black/30 px-3 py-1 rounded-full">
            {selectedIndex + 1} / {allImages.length}
          </div>

          {/* Navigation arrows */}
          {allImages.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => navigateImage('prev')}
                className="absolute left-4 text-white hover:bg-white/10 hover:scale-110 transition-all"
              >
                <ChevronLeft className="h-8 w-8" />
              </Button>
              <Button
                variant="ghost"
                size="lg"
                onClick={() => navigateImage('next')}
                className="absolute right-4 text-white hover:bg-white/10 hover:scale-110 transition-all"
              >
                <ChevronRight className="h-8 w-8" />
              </Button>
            </>
          )}

          {/* Main image */}
          <div 
            className="max-w-full max-h-full overflow-hidden cursor-grab active:cursor-grabbing"
            onClick={(e) => e.stopPropagation()}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              src={allImages[selectedIndex].image_url}
              alt={allImages[selectedIndex].alt_text || title}
              loading="lazy"
              decoding="async"
              className="max-w-full max-h-full object-contain transition-transform duration-300 select-none"
              style={{
                transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default'
              }}
              draggable={false}
            />
          </div>

          {/* Background click to close */}
          <div 
            className="absolute inset-0 -z-10" 
            onClick={closeLightbox}
          />

          {/* Help text */}
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 text-white text-sm text-center bg-black/30 px-4 py-2 rounded-full">
            Use as setas para navegar • ESC para fechar • +/- para zoom
          </div>
        </div>
      )}
    </>
  );
};

export default PortfolioGallery;