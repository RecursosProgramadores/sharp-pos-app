import { Building2, Layers, CalendarDays } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import img1 from "@/assets/escencia/Cortepersonalizado.jpeg";
import img2 from "@/assets/escencia/Cortecepcional.jpeg";
import img3 from "@/assets/escencia/Innovacionconstante.jpeg";
import img4 from "@/assets/escencia/Comunidad.jpeg";

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
    { value: 1,  prefix: "",  suffix: "", label: "Sucursal",     icon: Building2   },
    { value: 50, prefix: "+", suffix: "", label: "Servicios",    icon: Layers      },
    { value: 7,  prefix: "",  suffix: "", label: "Días Abiertos", icon: CalendarDays },
  ];

  const objectives = [
    {
      img: img1,
      tag: "01",
      title: "Cortes Personalizados",
      description:
        "Ofrecer cortes de cabello personalizados y de alta calidad que se adapten a las necesidades y preferencias de cada cliente.",
    },
    {
      img: img2,
      tag: "02",
      title: "Servicio Excepcional",
      description:
        "Proporcionar un servicio al cliente excepcional, que supere las expectativas de quienes nos visitan.",
    },
    {
      img: img3,
      tag: "03",
      title: "Innovación Constante",
      description:
        "Innovar y mejorar constantemente nuestros servicios y productos para mantenernos a la vanguardia.",
    },
    {
      img: img4,
      tag: "04",
      title: "Comunidad",
      description:
        "Ser parte activa de la comunidad de Huánuco y contribuir a su crecimiento y desarrollo.",
    },
  ];

  return (
    <section id="objetivos" className="py-20 lg:py-32 relative bg-[#050505] overflow-clip">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] bg-amber-500/4 rounded-full blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* ── Header ── */}
        <div className="max-w-3xl mx-auto text-center mb-16 lg:mb-20">
          <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
            Nuestros Objetivos
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[0.95] tracking-tighter uppercase italic">
            Comprometidos con{" "}<br className="hidden sm:block" />
            <span className="text-gradient-gold">tu imagen</span>
          </h2>
          <p className="text-zinc-500 text-base sm:text-lg max-w-2xl mx-auto mt-6 leading-relaxed font-light">
            Nos distinguimos por nuestra dedicación al detalle, nuestro compromiso con la excelencia y nuestra pasión por hacer que cada cliente salga sintiéndose su mejor versión.
          </p>
        </div>

        {/* ── Stats bar ── */}
        <div className="flex flex-wrap justify-center gap-10 sm:gap-16 md:gap-28 mb-16 lg:mb-24">
          {stats.map((stat, i) => (
            <div key={i} className="text-center group">
              <div className="flex flex-col items-center">
                <div className="w-11 h-11 rounded-2xl bg-amber-500/5 border border-amber-500/10 flex items-center justify-center mb-5 group-hover:border-amber-500/30 transition-all duration-500">
                  <stat.icon className="h-5 w-5 text-amber-500" />
                </div>
                <div className="mb-1.5">
                  <AnimatedNumber target={stat.value} prefix={stat.prefix} suffix={stat.suffix} />
                </div>
                <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ── Objectives Grid ── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5 max-w-7xl mx-auto">
          {objectives.map((obj, i) => (
            <div
              key={i}
              className="group relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden cursor-default"
              style={{ minHeight: "420px" }}
            >
              {/* Background image */}
              <img
                src={obj.img}
                alt={obj.title}
                className="absolute inset-0 w-full h-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
                loading="lazy"
              />

              {/* Dark overlay base */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20 transition-all duration-500" />

              {/* Hover amber tint */}
              <div className="absolute inset-0 bg-amber-500/0 group-hover:bg-amber-500/8 transition-all duration-700" />

              {/* Corner accent on hover */}
              <div className="absolute top-0 right-0 w-16 h-16 bg-gradient-to-bl from-amber-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 rounded-tr-[2rem]" />

              {/* Content bottom */}
              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-6">
                {/* Amber line reveal */}
                <div className="w-0 group-hover:w-8 h-px bg-amber-500 mb-3 transition-all duration-500" />

                <h4 className="font-display text-lg sm:text-xl font-black text-white tracking-tight uppercase italic leading-tight mb-2 group-hover:text-amber-400 transition-colors duration-500 pr-2">
                  {obj.title}
                </h4>

                {/* Description slides up on hover */}
                <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-light max-h-0 group-hover:max-h-32 overflow-hidden transition-all duration-700 opacity-0 group-hover:opacity-100">
                  {obj.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
