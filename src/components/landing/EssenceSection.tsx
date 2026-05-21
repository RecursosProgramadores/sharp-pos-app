import { Crown, Eye } from "lucide-react";
import nosotrosImg from "@/assets/nosotros.jpeg";

import imgCalidad from "@/assets/valores/Calidad.jpeg";
import imgProfesionalismo from "@/assets/valores/profecionalismo.jpeg";
import imgInnovacion from "@/assets/valores/innovacion.jpeg";
import imgAtencion from "@/assets/valores/Atencionpersonalizado.jpeg";

const values = [
  {
    img: imgCalidad,
    title: "Calidad",
    text: "Productos y técnicas de última generación para resultados excepcionales.",
  },
  {
    img: imgProfesionalismo,
    title: "Profesionalismo",
    text: "Equipo capacitado y experimentado que brinda un servicio excepcional.",
  },
  {
    img: imgInnovacion,
    title: "Innovación",
    text: "Siempre buscando nuevas formas de mejorar nuestros servicios.",
  },
  {
    img: imgAtencion,
    title: "Atención Personalizada",
    text: "Servicio atento y personalizado para cada uno de nuestros clientes.",
  },
];

export function EssenceSection() {
  return (
    <section id="esencia" className="relative overflow-clip" style={{ background: "#0a0a0a" }}>
      {/* Top ambient glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-amber-500/4 rounded-full blur-[140px] pointer-events-none" />

      {/* ── HERO SPLIT: Image + Mission/Vision ── */}
      <div className="relative">
        {/* Mobile: stack image first. Desktop: side-by-side */}
        <div className="flex flex-col lg:flex-row min-h-[80vh] lg:min-h-[75vh]">

          {/* ── Image Panel ── */}
          <div className="relative w-full lg:w-[48%] order-1 lg:order-1 overflow-hidden lg:flex lg:items-center lg:justify-center">
            {/* Image Wrapper for Desktop frame effect */}
            <div className="w-full lg:rounded-[2rem] lg:border lg:border-white/10 lg:shadow-[0_20px_50px_rgba(0,0,0,0.5)] lg:overflow-hidden lg:relative">
              <img
                src={nosotrosImg}
                alt="El equipo de Tayta Barber"
                className="w-full h-auto block"
                loading="lazy"
              />
              {/* Floating badge for desktop inside the framed image */}
              <div className="absolute bottom-5 left-5 hidden lg:flex items-center gap-3 bg-black/60 backdrop-blur-xl border border-amber-500/20 rounded-2xl px-4 py-3">
                <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                <span className="text-amber-500/90 text-[10px] font-black uppercase tracking-[0.25em]">Tayta BarberShop</span>
              </div>
            </div>

            {/* Gradient overlays (Only Mobile) */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/20 to-transparent lg:hidden pointer-events-none" />

            {/* Floating badge (Only Mobile) */}
            <div className="absolute bottom-5 left-5 flex lg:hidden items-center gap-3 bg-black/60 backdrop-blur-xl border border-amber-500/20 rounded-2xl px-4 py-3">
              <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
              <span className="text-amber-500/90 text-[10px] font-black uppercase tracking-[0.25em]">Tayta BarberShop</span>
            </div>
          </div>

          {/* ── Content Panel ── */}
          <div className="relative w-full lg:w-1/2 flex flex-col justify-center order-2 lg:order-2 px-6 sm:px-10 lg:px-16 xl:px-20 py-14 lg:py-20">

            {/* Section label */}
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="h-px w-8 bg-amber-500/50" />
              <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em]">Nuestra Esencia</span>
            </div>

            {/* Title */}
            <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-[0.95] tracking-tight mb-10">
              Quiénes{" "}
              <span className="text-gradient-gold">Somos</span>
            </h2>

            {/* Mission card */}
            <div className="relative group mb-5">
              <div className="absolute left-0 top-0 w-[2px] h-full bg-gradient-to-b from-amber-500 via-amber-500/50 to-transparent rounded-full" />
              <div className="pl-6 py-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Crown className="h-4 w-4 text-amber-500" />
                  </div>
                  <h3 className="font-display text-base font-black text-white uppercase tracking-widest">Misión</h3>
                </div>
                <p className="text-zinc-400 text-sm leading-[1.85] font-light">
                  Somos una empresa que se preocupa por que los clientes disfruten de nuestro trabajo mediante la innovación, desarrollo y mejora continua de su imagen. En nuestro salón contará con servicios de peluquería, estética y barbería, diferenciándonos por el trato especial con el que atendemos a nuestros clientes y por nuestro trabajo profesional con productos y tecnología de excelente calidad.
                </p>
              </div>
            </div>

            {/* Divider */}
            <div className="h-px bg-gradient-to-r from-white/5 via-amber-500/10 to-transparent mb-5 ml-6" />

            {/* Vision card */}
            <div className="relative group">
              <div className="absolute left-0 top-0 w-[2px] h-full bg-gradient-to-b from-amber-500/50 via-amber-500/20 to-transparent rounded-full" />
              <div className="pl-6 py-1">
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                    <Eye className="h-4 w-4 text-amber-500" />
                  </div>
                  <h3 className="font-display text-base font-black text-white uppercase tracking-widest">Visión</h3>
                </div>
                <p className="text-zinc-400 text-sm leading-[1.85] font-light">
                  Ser el lugar más atractivo por nuestro esmero y servicio que ofrecemos a quienes nos visitan permanentemente, atender con el mejor esmero y calidad logrando diariamente mantener la frescura de la belleza y la confianza de nuestros clientes como referentes en el cuidado de la imagen personal.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── VALUES GRID ── */}
      <div className="relative z-10 px-6 sm:px-10 lg:px-16 xl:px-20 pb-20 pt-12 lg:pt-16 border-t border-white/5">
        <div className="max-w-6xl mx-auto">

          {/* Values header */}
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-10">
            <div>
              <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em]">Lo que nos define</span>
              <h3 className="font-display text-2xl sm:text-3xl font-extrabold text-white mt-2">
                Nuestros <span className="text-gradient-gold">Valores</span>
              </h3>
            </div>
            <div className="h-px flex-1 max-w-xs bg-gradient-to-r from-amber-500/20 to-transparent hidden sm:block mb-2" />
          </div>

          {/* Values cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5">
            {values.map((item, i) => (
              <div
                key={i}
                className="group relative rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden cursor-default"
                style={{ minHeight: "420px" }}
              >
                {/* Background image */}
                <img
                  src={item.img}
                  alt={item.title}
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
                    {item.title}
                  </h4>

                  {/* Description slides up on hover */}
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-light max-h-0 group-hover:max-h-32 overflow-hidden transition-all duration-700 opacity-0 group-hover:opacity-100">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
