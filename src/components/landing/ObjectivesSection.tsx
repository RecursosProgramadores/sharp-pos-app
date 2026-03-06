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
  const { data: locations = [] } = useLocations();

  const stats = [
    { value: locations.length || 2, prefix: "", suffix: "", label: "Sucursales", icon: Building2 },
    { value: 50, prefix: "+", suffix: "", label: "Servicios", icon: Layers },
    { value: 7, prefix: "", suffix: "", label: "Días Abiertos", icon: CalendarDays },
  ];

  const objectives = [
    {
      icon: Scissors,
      title: "Cortes Personalizados",
      description: "Ofrecer cortes de cabello personalizados y de alta calidad que se adapten a las necesidades y preferencias de cada cliente.",
      accent: "from-barber-red/20 to-barber-red/5",
    },
    {
      icon: Heart,
      title: "Servicio Excepcional",
      description: "Proporcionar un servicio al cliente excepcional, que supere las expectativas de quienes nos visitan.",
      accent: "from-barber-orange/20 to-barber-orange/5",
    },
    {
      icon: Sparkles,
      title: "Innovación Constante",
      description: "Innovar y mejorar constantemente nuestros servicios y productos para mantenernos a la vanguardia.",
      accent: "from-barber-red/20 to-barber-orange/5",
    },
    {
      icon: Users,
      title: "Comunidad",
      description: "Ser parte activa de la comunidad de Huánuco y contribuir a su crecimiento y desarrollo.",
      accent: "from-barber-orange/20 to-barber-red/5",
    },
  ];

  return (
    <section id="objetivos" className="py-24 lg:py-32 relative overflow-hidden" style={{ background: "linear-gradient(180deg, #0a0c12 0%, #0d1018 50%, #0a0c12 100%)" }}>
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-barber-red/3 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <span className="text-barber-orange text-xs font-semibold uppercase tracking-[0.25em]">
            Nuestros Objetivos
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mt-4 leading-tight">
            Comprometidos con{" "}
            <span className="text-gradient-gold">tu imagen</span>
          </h2>
          <p className="text-white/35 text-base md:text-lg max-w-3xl mx-auto mt-5 leading-relaxed">
            Nos distinguimos por nuestra dedicación al detalle, nuestro compromiso con la excelencia y nuestra pasión por hacer que cada cliente salga sintiéndose su mejor versión. Trabajamos cada día para superar tus expectativas.
          </p>
        </div>

        {/* Stats bar */}
        <div className="flex flex-wrap justify-center gap-12 md:gap-20 my-16">
          {stats.map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="flex items-center justify-center mb-2">
                <stat.icon className="h-5 w-5 text-barber-red/40 mr-2 group-hover:text-barber-red transition-colors" />
                <AnimatedNumber target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
              </div>
              <p className="text-white/30 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Objectives Grid */}
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 max-w-6xl mx-auto">
          {objectives.map((obj, i) => (
            <div
              key={i}
              className="glass-card-hover p-7 group relative overflow-hidden"
            >
              {/* Top accent line */}
              <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-barber-red via-barber-orange to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${obj.accent} flex items-center justify-center mb-5 border border-white/5 group-hover:border-barber-red/20 transition-all`}>
                <obj.icon className="h-6 w-6 text-barber-red group-hover:text-barber-orange transition-colors" />
              </div>
              <h4 className="font-display text-lg font-bold text-white mb-3">{obj.title}</h4>
              <p className="text-white/40 text-sm leading-relaxed">{obj.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
