import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    text: "La mejor barbería de la zona. El nivel de profesionalismo y atención al detalle es excepcional. Siempre salgo con un corte perfecto.",
    name: "Carlos Martínez",
    role: "Cliente habitual",
    avatar: "C",
    rating: 5,
  },
  {
    text: "Ambiente impecable, barberos de primer nivel y productos de alta calidad. No cambiaría esta barbería por ninguna otra.",
    name: "David Rodríguez",
    role: "Cliente desde 2020",
    avatar: "D",
    rating: 5,
  },
  {
    text: "Desde la primera visita quedé impresionado. La puntualidad y el trato profesional marcan la diferencia. Totalmente recomendado.",
    name: "Miguel Sánchez",
    role: "Nuevo cliente",
    avatar: "M",
    rating: 5,
  },
  {
    text: "Increíble atención. La reserva web es súper rápida y el servicio en la sucursal es impecable. Muy recomendado el corte con navaja.",
    name: "Alejandro Ruiz",
    role: "Cliente frecuente",
    avatar: "A",
    rating: 5,
  },
  {
    text: "El ambiente es inmejorable, excelente música y los barberos de verdad saben lo que hacen. La atención al detalle es de 10/10.",
    name: "Javier Gómez",
    role: "Cliente desde 2021",
    avatar: "J",
    rating: 5,
  },
  {
    text: "Excelente servicio, primera vez que vengo y definitivamente regresaré. Me corté el cabello y perfilé la barba, gran trabajo.",
    name: "Rodrigo Silva",
    role: "Nuevo cliente",
    avatar: "R",
    rating: 5,
  },
];

// Duplicate items for the infinite marquee effect
const marqueeItems = [...testimonials, ...testimonials];

export function LandingTestimonials() {
  return (
    <section id="testimonios" className="py-20 lg:py-32 relative bg-[#050505] overflow-clip">
      {/* Dynamic inline styles for the marquee keyframes */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes marquee-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee-slow {
          display: flex;
          animation: marquee-scroll 45s linear infinite;
        }
        .animate-marquee-slow:hover {
          animation-play-state: paused;
        }
      `}} />

      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[350px] bg-amber-500/3 rounded-full blur-[140px] pointer-events-none" />

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* ── Header ── */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
            Testimonios
          </span>
          <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-black text-white leading-[0.95] tracking-tighter uppercase italic">
            Lo que dicen <br className="hidden sm:block" />
            <span className="text-gradient-gold">nuestros clientes</span>
          </h2>
          <div className="w-16 h-[2px] bg-amber-500/30 mx-auto mt-6" />
        </div>

        {/* ── Carousel Slider Container ── */}
        <div className="relative w-full overflow-hidden py-4
          before:absolute before:left-0 before:top-0 before:z-20 before:h-full before:w-16 sm:before:w-32 before:bg-gradient-to-r before:from-[#050505] before:to-transparent before:pointer-events-none
          after:absolute after:right-0 after:top-0 after:z-20 after:h-full after:w-16 sm:after:w-32 after:bg-gradient-to-l after:from-[#050505] after:to-transparent after:pointer-events-none"
        >
          <div className="animate-marquee-slow flex gap-5">
            {marqueeItems.map((t, i) => (
              <div
                key={i}
                className="w-[280px] sm:w-[350px] flex-shrink-0 bg-white/[0.02] border border-white/5 rounded-[1.5rem] sm:rounded-[2rem] p-6 sm:p-8 relative group flex flex-col justify-between hover:border-amber-500/20 hover:bg-amber-500/[0.02] transition-all duration-500 shadow-md"
              >
                {/* Decorative quote icon */}
                <Quote className="h-8 w-8 text-amber-500/5 absolute top-6 right-6 group-hover:text-amber-500/10 transition-colors" />

                {/* Card Content */}
                <div>
                  {/* Stars */}
                  <div className="flex gap-1 mb-4">
                    {[...Array(t.rating)].map((_, j) => (
                      <Star key={j} className="h-3.5 w-3.5 fill-amber-500 text-amber-500" />
                    ))}
                  </div>

                  {/* Quote text */}
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed font-light mb-6">
                    "{t.text}"
                  </p>
                </div>

                {/* Author Info */}
                <div className="flex items-center gap-4 pt-4 border-t border-white/5">
                  <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-500 font-display font-black text-sm sm:text-base">
                    {t.avatar}
                  </div>
                  <div>
                    <h4 className="text-white font-bold text-xs sm:text-sm tracking-wide">
                      {t.name}
                    </h4>
                    <p className="text-zinc-500 text-[10px] sm:text-xs font-light mt-0.5">
                      {t.role}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
