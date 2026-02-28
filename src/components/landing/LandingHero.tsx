import { Calendar, ArrowRight } from "lucide-react";
import heroImg from "@/assets/hero-barbershop.jpg";

interface LandingHeroProps {
  onReserveClick: () => void;
}

export function LandingHero({ onReserveClick }: LandingHeroProps) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0">
        <img
          src={heroImg}
          alt="Interior de barbería premium"
          className="w-full h-full object-cover"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c12]/70 via-[#0a0c12]/60 to-[#0a0c12]/95" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0c12]/80 via-transparent to-[#0a0c12]/40" />
      </div>

      {/* Decorative gold particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-16 w-px h-32 bg-gradient-to-b from-transparent via-gold/30 to-transparent animate-pulse-slow" />
        <div className="absolute top-1/3 right-24 w-px h-48 bg-gradient-to-b from-transparent via-gold/20 to-transparent animate-pulse-slow" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-1/3 left-1/3 w-px h-24 bg-gradient-to-b from-transparent via-neon-cyan/20 to-transparent animate-pulse-slow" style={{ animationDelay: "2s" }} />
      </div>

      <div className="relative z-10 container mx-auto px-4 lg:px-8">
        <div className="max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass-card px-4 py-2 mb-6 text-sm animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-gold animate-pulse-slow" />
            <span className="text-white/60 tracking-wide">Barbería Premium</span>
          </div>

          <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-extrabold text-white leading-[0.92] tracking-tight mb-5 animate-slide-up">
            El Arte de la
            <br />
            <span className="text-gradient-gold">Barbería Clásica</span>
          </h1>

          <p className="text-white/45 text-lg md:text-xl max-w-xl mb-8 leading-relaxed animate-slide-up" style={{ animationDelay: "0.1s" }}>
            Tradición, precisión y estilo en cada detalle. Donde la excelencia se convierte en tu mejor versión.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <button
              onClick={onReserveClick}
              className="btn-gold text-base font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-2"
            >
              <Calendar className="h-5 w-5" />
              Reservar Cita Ahora
            </button>
            <button
              className="btn-outline-gold text-base px-8 py-4 rounded-xl flex items-center justify-center gap-2"
              onClick={() => document.getElementById("servicios")?.scrollIntoView({ behavior: "smooth" })}
            >
              Ver Servicios
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#0a0c12] to-transparent" />
    </section>
  );
}
