import { Crown, Eye, Gem, Sparkles, Award, Heart } from "lucide-react";

const values = [
  {
    icon: Gem,
    title: "Calidad",
    text: "Productos y técnicas de última generación para resultados excepcionales.",
  },
  {
    icon: Award,
    title: "Profesionalismo",
    text: "Equipo capacitado y experimentado que brinda un servicio excepcional.",
  },
  {
    icon: Sparkles,
    title: "Innovación",
    text: "Siempre buscando nuevas formas de mejorar nuestros servicios.",
  },
  {
    icon: Heart,
    title: "Atención Personalizada",
    text: "Servicio atento y personalizado para cada uno de nuestros clientes.",
  },
];

export function EssenceSection() {
  return (
    <section id="esencia" className="py-24 lg:py-32 relative" style={{ background: "#0d1018" }}>
      {/* Subtle glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-barber-red/5 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <span className="text-barber-orange text-xs font-semibold uppercase tracking-[0.25em]">
            Nuestra Esencia
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mt-4">
            Quiénes <span className="text-gradient-gold">Somos</span>
          </h2>
        </div>

        {/* Misión & Visión — stacked editorial cards */}
        <div className="grid lg:grid-cols-2 gap-6 mb-20 max-w-5xl mx-auto">
          {/* Misión */}
          <div className="glass-card-hover p-8 lg:p-10 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-barber-red via-barber-orange to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-barber-red/10 border border-barber-red/15 flex items-center justify-center group-hover:bg-barber-red/20 transition-colors">
                <Crown className="h-5 w-5 text-barber-red" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">Misión</h3>
            </div>
            <p className="text-white/45 text-sm leading-[1.8]">
              Somos una empresa que se preocupa por que los clientes disfruten de nuestro trabajo mediante la innovación, desarrollo y mejora continua de su imagen. En nuestro salón contará con servicios de peluquería, estética y barbería, diferenciándonos por el trato especial con el que atendemos a nuestros clientes y por nuestro trabajo profesional con productos y tecnología de excelente calidad.
            </p>
          </div>

          {/* Visión */}
          <div className="glass-card-hover p-8 lg:p-10 relative overflow-hidden group">
            <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-barber-orange via-barber-red to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
            <div className="flex items-center gap-3 mb-5">
              <div className="w-11 h-11 rounded-xl bg-barber-orange/10 border border-barber-orange/15 flex items-center justify-center group-hover:bg-barber-orange/20 transition-colors">
                <Eye className="h-5 w-5 text-barber-orange" />
              </div>
              <h3 className="font-display text-xl font-bold text-white">Visión</h3>
            </div>
            <p className="text-white/45 text-sm leading-[1.8]">
              Ser el lugar más atractivo por nuestro esmero y servicio que ofrecemos a quienes nos visitan permanentemente, atender con el mejor esmero y calidad logrando diariamente mantener la frescura de la belleza y la confianza de nuestros clientes como referentes en el cuidado de la imagen personal.
            </p>
          </div>
        </div>

        {/* Valores heading */}
        <div className="text-center mb-12">
          <span className="text-barber-red text-xs font-semibold uppercase tracking-[0.25em]">
            Lo que nos define
          </span>
          <h3 className="font-display text-2xl md:text-3xl font-extrabold text-white mt-3">
            Nuestros <span className="text-gradient-gold">Valores</span>
          </h3>
        </div>

        {/* Values grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5 max-w-5xl mx-auto">
          {values.map((item, i) => (
            <div key={i} className="glass-card-hover p-6 text-center group">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-barber-red/10 to-barber-orange/5 flex items-center justify-center mx-auto mb-5 border border-barber-red/10 group-hover:border-barber-red/30 group-hover:from-barber-red/15 group-hover:to-barber-orange/10 transition-all">
                <item.icon className="h-6 w-6 text-barber-red group-hover:text-barber-orange transition-colors" />
              </div>
              <h4 className="text-white font-bold text-base mb-2">{item.title}</h4>
              <p className="text-white/40 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
