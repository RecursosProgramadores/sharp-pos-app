import { Calendar, ArrowRight, Play } from "lucide-react";
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
          className="w-full h-full object-cover scale-105"
          loading="eager"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0c12]/80 via-[#0a0c12]/50 to-[#0a0c12]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0c12]/90 via-[#0a0c12]/30 to-transparent" />
      </div>

      {/* Animated decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-10 w-[1px] h-40 bg-gradient-to-b from-transparent via-barber-red/30 to-transparent animate-pulse-slow" />
        <div className="absolute top-1/3 right-20 w-[1px] h-56 bg-gradient-to-b from-transparent via-barber-orange/20 to-transparent animate-pulse-slow" style={{ animationDelay: "1.5s" }} />
        <div className="absolute bottom-1/4 left-1/4 w-[1px] h-32 bg-gradient-to-b from-transparent via-barber-red/15 to-transparent animate-pulse-slow" style={{ animationDelay: "3s" }} />
        {/* Corner accent lines */}
        <div className="absolute top-32 left-8 w-16 h-[1px] bg-gradient-to-r from-barber-red/40 to-transparent" />
        <div className="absolute top-32 left-8 w-[1px] h-16 bg-gradient-to-b from-barber-red/40 to-transparent" />
      </div>

      <div className="relative z-10 container mx-auto px-4 lg:px-8">
        <div className="max-w-4xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-3 glass-card px-5 py-2.5 mb-8 animate-fade-in">
            <span className="w-2 h-2 rounded-full bg-barber-red animate-pulse-slow" />
            <span className="text-white/50 tracking-[0.15em] uppercase text-xs font-medium">Barbería Premium · Huánuco</span>
          </div>

          <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl xl:text-[6.5rem] font-extrabold text-white leading-[0.9] tracking-tight mb-6 animate-slide-up">
            Tu imagen,
            <br />
            <span className="text-gradient-gold">nuestra</span>
            <br />
            <span className="text-gradient-gold">pasión</span>
          </h1>

          <p className="text-white/40 text-lg md:text-xl lg:text-2xl max-w-xl mb-10 leading-relaxed animate-slide-up font-light" style={{ animationDelay: "0.1s" }}>
            Más de una década de experiencia transformando estilos.{" "}
            <span className="text-white/60 font-normal">Cada corte cuenta una historia.</span>
          </p>

          <div className="flex flex-col sm:flex-row gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <button
              onClick={onReserveClick}
              className="btn-gold text-base font-bold px-8 py-4 rounded-xl flex items-center justify-center gap-3 group"
            >
              <Calendar className="h-5 w-5" />
              Reservar Cita Ahora
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              className="btn-outline-gold text-base px-8 py-4 rounded-xl flex items-center justify-center gap-3"
              onClick={() => document.getElementById("esencia")?.scrollIntoView({ behavior: "smooth" })}
            >
              <Play className="h-4 w-4" />
              Conoce Nuestra Historia
            </button>
          </div>
        </div>
      </div>

      {/* Bottom gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-[#0a0c12] to-transparent" />
    </section>
  );
}
