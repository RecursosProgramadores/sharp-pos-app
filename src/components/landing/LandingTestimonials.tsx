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
];

export function LandingTestimonials() {
  return (
    <section id="testimonios" className="py-24 lg:py-32 relative" style={{ background: "#0d1018" }}>
      {/* Subtle ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[500px] h-[250px] bg-barber-orange/4 rounded-full blur-[120px] pointer-events-none" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <span className="text-barber-orange text-xs font-semibold uppercase tracking-[0.25em]">
            Testimonios
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mt-4">
            Lo que dicen{" "}
            <span className="text-gradient-gold">nuestros clientes</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {testimonials.map((t, i) => (
            <div key={i} className="glass-card-hover p-7 relative group flex flex-col">
              {/* Decorative quote */}
              <Quote className="h-8 w-8 text-barber-red/8 absolute top-6 right-6 group-hover:text-barber-red/15 transition-colors" />

              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="h-4 w-4 fill-barber-orange text-barber-orange" />
                ))}
              </div>

              {/* Quote text */}
              <p className="text-white/50 text-sm leading-[1.8] mb-8 flex-1">
                "{t.text}"
              </p>

              {/* Author */}
              <div className="flex items-center gap-4 pt-5 border-t border-white/5">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-barber-red/25 to-barber-orange/10 flex items-center justify-center text-barber-red font-display font-bold text-lg border border-barber-red/15">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-white/25 text-xs mt-0.5">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
