import { Scissors, Heart, Sparkles, Users, Building2, Layers, CalendarDays } from "lucide-react";
import { useLocations } from "@/hooks/usePublicData";
import { useEffect, useRef, useState } from "react";

function AnimatedNumber({ target, prefix = "", suffix = "" }: { target: number; prefix?: string; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const duration = 1800;
          const steps = 50;
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
    <span ref={ref} className="font-display text-5xl md:text-6xl font-extrabold text-gradient-gold">
      {prefix}{count}{suffix}
    </span>
  );
}

export function ObjectivesSection() {
  const stats = [
    { value: 1, prefix: "", suffix: "", label: "Sucursal", icon: Building2 },
    { value: 50, prefix: "+", suffix: "", label: "Servicios", icon: Layers },
    { value: 7, prefix: "", suffix: "", label: "Días Abiertos", icon: CalendarDays },
  ];

  const objectives = [
    {
      icon: Scissors,
      title: "Cortes Personalizados",
      description: "Ofrecer cortes de cabello personalizados y de alta calidad que se adapten a las necesidades y preferencias de cada cliente.",
    },
    {
      icon: Heart,
      title: "Servicio Excepcional",
      description: "Proporcionar un servicio al cliente excepcional, que supere las expectativas de quienes nos visitan.",
    },
    {
      icon: Sparkles,
      title: "Innovación Constante",
      description: "Innovar y mejorar constantemente nuestros servicios y productos para mantenernos a la vanguardia.",
    },
    {
      icon: Users,
      title: "Comunidad",
      description: "Ser parte activa de la comunidad de Huánuco y contribuir a su crecimiento y desarrollo.",
    },
  ];

  return (
    <section id="objetivos" className="py-24 lg:py-32 relative bg-[#050505] overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-amber-500/5 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-0 right-0 w-[300px] h-full bg-gradient-to-l from-amber-500/5 to-transparent pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className="max-w-4xl mx-auto text-center mb-20">
          <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
            Nuestros Objetivos
          </span>
          <h2 className="font-display text-4xl md:text-6xl font-black text-white leading-[0.95] tracking-tighter uppercase italic">
            Comprometidos con <br />
            <span className="text-gradient-gold">tu imagen</span>
          </h2>
          <p className="text-zinc-500 text-lg md:text-xl max-w-2xl mx-auto mt-8 leading-relaxed font-light">
            Nos distinguimos por nuestra dedicación al detalle, nuestro compromiso con la excelencia y nuestra pasión por hacer que cada cliente salga sintiéndose su mejor versión.
          </p>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap justify-center gap-16 md:gap-28 mb-24">
          {stats.map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="flex flex-col items-center">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-center mb-6 group-hover:border-amber-500/30 transition-all duration-500">
                  <stat.icon className="h-5 w-5 text-amber-500" />
                </div>
                <div className="mb-2">
                  <AnimatedNumber target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Objectives Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 max-w-7xl mx-auto">
          {objectives.map((obj, i) => (
            <div
              key={i}
              className="glass-card p-10 border-white/5 bg-white/[0.02] backdrop-blur-sm rounded-[2rem] group relative overflow-hidden transition-all duration-700 hover:border-amber-500/20 hover:bg-white/5"
            >
              {/* Corner accent */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              
              <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-8 group-hover:bg-amber-500 group-hover:text-black transition-all duration-700 group-hover:shadow-[0_0_30px_rgba(245,158,11,0.3)]">
                <obj.icon className="h-7 w-7 text-amber-500 group-hover:text-black transition-colors" />
              </div>
              
              <h4 className="font-display text-xl font-black text-white mb-4 tracking-tight group-hover:text-amber-500 transition-colors uppercase italic">{obj.title}</h4>
              <p className="text-zinc-500 text-sm leading-relaxed font-medium group-hover:text-zinc-400 transition-colors">{obj.description}</p>
              
              <div className="mt-8 pt-8 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                <div className="w-8 h-px bg-amber-500" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
