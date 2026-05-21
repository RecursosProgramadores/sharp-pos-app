import { Award, Users, Zap, Heart } from "lucide-react";

export function AboutSection() {
  const values = [
    {
      icon: Award,
      title: "Calidad Suprema",
      description: "Utilizamos productos de élite y técnicas de vanguardia para resultados que rozan la perfección.",
      tag: "Élite",
    },
    {
      icon: Users,
      title: "Maestría Profesional",
      description: "Un equipo de artistas del estilo dedicados a esculpir tu mejor versión con precisión técnica.",
      tag: "Expertos",
    },
    {
      icon: Zap,
      title: "Innovación Continua",
      description: "Evolucionamos constantemente para ofrecerte las tendencias más actuales del grooming mundial.",
      tag: "Vanguardia",
    },
    {
      icon: Heart,
      title: "Cuidado Exclusivo",
      description: "Una experiencia personalizada donde cada detalle está diseñado para tu confort y satisfacción.",
      tag: "Premium",
    },
  ];

  return (
    <section id="nosotros" className="py-32 lg:py-56 bg-[#050505] relative overflow-clip">
      {/* Cinematic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_20%_20%,rgba(245,158,11,0.05)_0%,transparent_50%)]" />
        <div className="absolute bottom-0 right-0 w-full h-full bg-[radial-gradient(circle_at_80%_80%,rgba(245,158,11,0.05)_0%,transparent_50%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        {/* Surprise Header Layout */}
        <div className="grid lg:grid-cols-2 gap-24 items-end mb-40">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="h-px w-12 bg-amber-500" />
              <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.5em]">Nuestra Esencia</span>
            </div>
            <h2 className="font-display text-6xl md:text-7xl lg:text-8xl font-black text-white leading-[0.8] tracking-tighter uppercase italic">
              Tayta <br />
              <span className="text-gradient-gold">Legacy</span>
            </h2>
          </div>
          <div className="pb-4">
            <p className="text-zinc-500 text-2xl md:text-3xl font-light leading-relaxed max-w-xl italic border-l-4 border-amber-500 pl-10">
              "Redefiniendo el arte de la barbería clásica con la sofisticación del mañana."
            </p>
          </div>
        </div>

        {/* Mission & Vision: The Manifestos */}
        <div className="grid lg:grid-cols-2 gap-10 mb-48">
          <div className="group relative overflow-hidden rounded-[3rem] p-[1px] transition-all duration-700 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-transparent to-white/10 opacity-50" />
            <div className="relative bg-[#0a0a0a] p-12 md:p-16 h-full rounded-[3rem] overflow-hidden">
              <span className="absolute -top-10 -right-10 text-[12rem] font-black text-white/[0.02] select-none">01</span>
              <h3 className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]" /> Misión
              </h3>
              <p className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-8">
                Esculpir la <span className="text-amber-500 italic">mejor versión</span> de cada caballero mediante la innovación y la maestría técnica.
              </p>
              <p className="text-zinc-500 text-lg leading-relaxed font-light">
                Somos una empresa que se preocupa por que los clientes disfruten de nuestro trabajo mediante la mejora continua de su imagen, diferenciándonos por el trato especial y tecnología de excelente calidad.
              </p>
            </div>
          </div>

          <div className="group relative overflow-hidden rounded-[3rem] p-[1px] transition-all duration-700 hover:scale-[1.02]">
            <div className="absolute inset-0 bg-gradient-to-bl from-amber-500/20 via-transparent to-white/10 opacity-50" />
            <div className="relative bg-[#0a0a0a] p-12 md:p-16 h-full rounded-[3rem] overflow-hidden">
              <span className="absolute -top-10 -right-10 text-[12rem] font-black text-white/[0.02] select-none">02</span>
              <h3 className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mb-10 flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.8)]" /> Visión
              </h3>
              <p className="font-display text-3xl md:text-4xl font-bold text-white leading-tight mb-8">
                Ser el <span className="text-amber-500 italic">referente máximo</span> de estilo y confianza, logrando una frescura eterna en cada cliente.
              </p>
              <p className="text-zinc-500 text-lg leading-relaxed font-light">
                Atender con el mejor esmero y calidad logrando diariamente mantener la confianza de nuestros clientes como referentes absolutos en el cuidado de la imagen personal.
              </p>
            </div>
          </div>
        </div>

        {/* Values: The Pillars of Excellence */}
        <div className="relative">
          <div className="text-center mb-24">
            <span className="text-amber-500/50 text-[10px] font-black uppercase tracking-[0.6em] mb-4 block">Lo que nos define</span>
            <h3 className="font-display text-4xl md:text-5xl font-black text-white uppercase italic tracking-tighter pr-4 pb-1">Nuestros Valores</h3>
          </div>

          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => (
              <div key={index} className="group relative pt-8">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-px h-12 bg-gradient-to-b from-amber-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="glass-card p-12 h-full border-white/5 bg-white/[0.01] backdrop-blur-xl rounded-[2.5rem] transition-all duration-700 hover:bg-white/[0.03] hover:border-amber-500/30 flex flex-col items-center text-center">
                  <div className="relative mb-10">
                    <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="w-20 h-20 rounded-3xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center relative z-10 group-hover:bg-amber-500 group-hover:text-black transition-all duration-500">
                      <value.icon className="h-8 w-8" />
                    </div>
                  </div>
                  
                  <span className="text-amber-500/40 text-[9px] font-black uppercase tracking-[0.3em] mb-3">{value.tag}</span>
                  <h4 className="font-display text-2xl font-black text-white mb-6 uppercase italic tracking-tight pr-2">{value.title}</h4>
                  <p className="text-zinc-500 text-sm leading-relaxed group-hover:text-zinc-300 transition-colors">
                    {value.description}
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
