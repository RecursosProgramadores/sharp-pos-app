import { useEffect, useRef, useState } from "react";
import { Star, Clock, MapPin } from "lucide-react";
import WhatsAppIcon from "@/assets/whatsapp.svg";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 2500;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="font-display font-black text-5xl md:text-6xl lg:text-7xl text-gradient-gold tracking-tighter italic">
      {count.toLocaleString()}
      {suffix && (
        <span className="text-2xl md:text-3xl ml-1 align-top opacity-80">{suffix}</span>
      )}
    </span>
  );
}

export function TrustSection() {
  const stats = [
    { value: 1000, suffix: "+", label: "Clientes Satisfechos" },
    { value: 10, suffix: "+", label: "Años de Excelencia" },
    { value: 1, suffix: "", label: "Sucursal Central" },
    { value: 15000, suffix: "+", label: "Cortes Realizados" },
  ];

  return (
    <section className="py-28 relative bg-[#050505] overflow-hidden border-y border-white/5">
      {/* Background Decorative Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-amber-500/5 blur-[120px] rounded-full" />
        <div className="absolute top-1/2 right-1/4 translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-amber-500/5 blur-[100px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-20">
          <p className="text-amber-500/50 text-[10px] font-black uppercase tracking-[0.5em]">
            Confianza · Calidad · Experiencia
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-x-8 gap-y-16 lg:gap-16 max-w-7xl mx-auto">
          {stats.map((stat, i) => (
            <div key={i} className="flex flex-col items-center group">
              <div className="mb-4 transition-transform duration-500 group-hover:scale-105">
                <AnimatedCounter target={stat.value} suffix={stat.suffix} />
              </div>
              <div className="h-px w-8 bg-amber-500/30 mb-4 group-hover:w-12 transition-all duration-500" />
              <p className="text-zinc-500 text-[10px] md:text-[11px] font-black uppercase tracking-[0.3em] text-center group-hover:text-zinc-300 transition-colors">
                {stat.label}
              </p>
            </div>
          ))}
        </div>

        <div className="flex justify-center gap-6 flex-wrap mt-24">
          {/* Rating Badge */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 to-transparent blur opacity-0 group-hover:opacity-100 transition duration-500" />
            <div className="relative glass-card bg-[#0a0a0a] border border-white/10 rounded-[1.5rem] px-8 py-5 flex items-center gap-6 transition-all duration-500 group-hover:border-amber-500/30">
              <div className="flex gap-1.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-500 text-amber-500 drop-shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
                ))}
              </div>
              <div className="w-px h-8 bg-white/5" />
              <div className="flex flex-col">
                <span className="text-white font-black text-sm tracking-widest uppercase italic">4.9/5 Promedio</span>
                <span className="text-zinc-600 text-[9px] font-bold uppercase tracking-tight">Opinión Clientes</span>
              </div>
            </div>
          </div>

          {/* WhatsApp Badge */}
          <div className="group relative">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-amber-500/20 to-transparent blur opacity-0 group-hover:opacity-100 transition duration-500" />
            <div className="relative glass-card bg-[#0a0a0a] border border-white/10 rounded-[1.5rem] px-8 py-5 flex items-center gap-6 transition-all duration-500 group-hover:border-amber-500/30">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center group-hover:bg-amber-500 transition-all duration-500 border border-amber-500/20">
                <img 
                  src={WhatsAppIcon} 
                  className="h-6 w-6 brightness-0 invert transition-all group-hover:brightness-0 group-hover:invert-0" 
                  alt="WhatsApp" 
                />
              </div>
              <div className="w-px h-8 bg-white/5" />
              <div className="flex flex-col">
                <span className="text-white font-black text-sm tracking-widest uppercase italic">Respuesta Inmediata</span>
                <span className="text-zinc-600 text-[9px] font-bold uppercase tracking-tight">Vía WhatsApp</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
