import { Calendar, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HeroSectionProps {
  onReserveClick: () => void;
}

export function HeroSection({ onReserveClick }: HeroSectionProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?w=1920&q=80"
          alt="Barbershop"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-sidebar/80 via-sidebar/70 to-sidebar/90" />
      </div>

      {/* Animated Particles/Lines - Decorative */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-px h-32 bg-gradient-to-b from-transparent via-primary/50 to-transparent animate-pulse-slow" />
        <div className="absolute top-1/3 right-20 w-px h-48 bg-gradient-to-b from-transparent via-secondary/50 to-transparent animate-pulse-slow delay-500" />
        <div className="absolute bottom-1/4 left-1/4 w-px h-24 bg-gradient-to-b from-transparent via-primary/30 to-transparent animate-pulse-slow delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center">
        <span className="inline-block text-primary font-semibold tracking-[0.3em] uppercase text-sm mb-4 animate-fade-in">
          Barbería Premium
        </span>

        <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-white mb-4 animate-slide-up">
          El arte de
          <br />
          <span className="text-primary">la barbería</span>
          <br />
          clásica
        </h1>

        <p className="text-white/70 text-lg md:text-xl max-w-2xl mx-auto mb-8 animate-fade-in">
          Tradición, precisión y estilo en cada servicio. Donde la excelencia
          se encuentra con el profesionalismo.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up">
          <Button
            size="lg"
            onClick={onReserveClick}
            className="gap-2 text-base bg-primary hover:bg-primary/90 shadow-glow"
          >
            <Calendar className="h-5 w-5" />
            Reservar Cita
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="gap-2 text-base border-white/30 text-white hover:bg-white/10"
            onClick={() => document.getElementById("servicios")?.scrollIntoView({ behavior: "smooth" })}
          >
            Conocer Servicios
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>

        {/* Scroll Indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center pt-2">
            <div className="w-1 h-3 bg-white/50 rounded-full animate-pulse" />
          </div>
        </div>
      </div>

      {/* Carousel Dots (decorative) */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 mt-20">
        <div className="w-8 h-2 bg-primary rounded-full" />
        <div className="w-2 h-2 bg-white/30 rounded-full" />
        <div className="w-2 h-2 bg-white/30 rounded-full" />
      </div>
    </section>
  );
}
