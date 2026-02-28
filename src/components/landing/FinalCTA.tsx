import { Calendar, Sparkles, MessageCircle } from "lucide-react";

interface FinalCTAProps {
  onReserveClick: () => void;
}

export function FinalCTA({ onReserveClick }: FinalCTAProps) {
  return (
    <section className="py-20 lg:py-28 relative overflow-hidden"
      style={{ background: "linear-gradient(135deg, #0a0c12 0%, #1a1508 50%, #0d1018 100%)" }}
    >
      {/* Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[350px] rounded-full bg-gold/5 blur-[120px]" />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[250px] rounded-full bg-neon-cyan/5 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
        <Sparkles className="h-7 w-7 text-gold/40 mx-auto mb-4" />
        <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
          ¿Listo para tu próximo
          <br />
          <span className="text-gradient-gold">look legendario?</span>
        </h2>
        <p className="text-white/35 text-lg max-w-lg mx-auto mb-10">
          Reserva en segundos y vive la experiencia BarberShop. Respuesta por WhatsApp en minutos.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={onReserveClick}
            className="btn-gold text-base md:text-lg font-bold px-10 py-5 rounded-xl inline-flex items-center gap-3"
          >
            <Calendar className="h-5 w-5" />
            Reservar Cita Ahora
          </button>
          <a
            href="https://wa.me/51987457832"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-outline-gold text-base md:text-lg px-10 py-5 rounded-xl inline-flex items-center justify-center gap-3"
          >
            <MessageCircle className="h-5 w-5" />
            WhatsApp
          </a>
        </div>
        <p className="text-white/15 text-sm mt-5">
          Sin adelantos · Confirmación inmediata · Cancelación flexible
        </p>
      </div>
    </section>
  );
}
