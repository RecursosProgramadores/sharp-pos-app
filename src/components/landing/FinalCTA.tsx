import { ArrowRight, Sparkles } from "lucide-react";

interface FinalCTAProps {
  onTrialClick: () => void;
}

export function FinalCTA({ onTrialClick }: FinalCTAProps) {
  return (
    <section
      id="contacto"
      className="py-20 lg:py-28 relative overflow-hidden"
      style={{
        background: "linear-gradient(135deg, #0a0e17 0%, #1a1040 50%, #0d1025 100%)",
      }}
    >
      {/* Glow orbs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-neon-cyan/8 blur-[120px]" />
        <div className="absolute top-1/2 left-1/3 w-[400px] h-[300px] rounded-full bg-neon-purple/10 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
        <Sparkles className="h-8 w-8 text-neon-cyan/40 mx-auto mb-4" />
        <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 leading-tight">
          ¿Listo para llevar tu negocio
          <br />
          <span className="text-gradient-mixed">al siguiente nivel?</span>
        </h2>
        <p className="text-white/40 text-lg max-w-xl mx-auto mb-10">
          Únete a más de 500 negocios que ya están vendiendo más y mejor con Sharp POS.
        </p>
        <button
          onClick={onTrialClick}
          className="btn-neon text-base md:text-lg font-bold text-primary-foreground px-10 py-5 rounded-xl inline-flex items-center gap-3"
        >
          Crear mi cuenta gratis ahora
          <ArrowRight className="h-5 w-5" />
        </button>
        <p className="text-white/20 text-sm mt-4">
          Sin tarjeta de crédito · Configuración en 2 minutos
        </p>
      </div>
    </section>
  );
}
