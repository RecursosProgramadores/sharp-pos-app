import { Calendar, Sparkles } from "lucide-react";
import WhatsAppIcon from "@/assets/whatsapp.svg";

interface FinalCTAProps {
  onReserveClick: () => void;
}

export function FinalCTA({ onReserveClick }: FinalCTAProps) {
  return (
    <section className="py-24 lg:py-32 relative overflow-clip bg-[#050505]">
      {/* Dynamic Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] rounded-full bg-amber-500/5 blur-[150px]" />
      </div>

      <div className="container mx-auto px-4 lg:px-8 relative z-10 text-center">
        <div className="mb-6 inline-flex items-center gap-2 px-4 py-1 rounded-full bg-white/5 border border-white/10 text-amber-500/50 text-[10px] font-black uppercase tracking-[0.3em]">
          <Sparkles className="h-3 w-3" />
          Reserva Premium
        </div>
        
        <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-black text-white mb-8 leading-[0.95] tracking-tighter uppercase italic">
          ¿Listo para tu próximo <br />
          <span className="text-gradient-gold">Look Legendario?</span>
        </h2>
        
        <p className="text-zinc-500 text-lg md:text-xl max-w-xl mx-auto mb-12 font-light">
          Únete a los caballeros que eligen la excelencia. Reserva en segundos y vive la verdadera experiencia Tayta.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-5 justify-center items-center">
          <button
            onClick={onReserveClick}
            className="w-full sm:w-auto bg-amber-500 hover:bg-amber-600 text-black font-black px-12 py-5 rounded-2xl flex items-center justify-center gap-3 transition-all duration-500 shadow-2xl shadow-amber-500/20 active:scale-95 text-sm uppercase tracking-widest"
          >
            <Calendar className="h-5 w-5" />
            RESERVAR CITA AHORA
          </button>
          
          <a
            href="https://wa.me/51970772564"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white border border-white/10 px-12 py-5 rounded-2xl flex items-center justify-center gap-3 transition-all duration-500 text-sm font-black uppercase tracking-widest"
          >
            <img src={WhatsAppIcon} className="h-5 w-5" style={{ filter: 'brightness(0) invert(1)' }} alt="WhatsApp" />
            WHATSAPP
          </a>
        </div>
        
        <div className="mt-12 flex flex-wrap justify-center gap-x-8 gap-y-4">
          {["Sin adelantos", "Confirmación inmediata", "Cancelación flexible"].map((text) => (
            <div key={text} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-amber-500/30" />
              <span className="text-zinc-600 text-[10px] font-bold uppercase tracking-widest">{text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
