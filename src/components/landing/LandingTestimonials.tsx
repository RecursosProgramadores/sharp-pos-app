import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    text: "La mejor barbería de la zona. El nivel de profesionalismo y atención al detalle es excepcional. Siempre salgo con un corte perfecto.",
    name: "Carlos Martínez",
    role: "Cliente habitual",
    avatar: "CM",
    rating: 5,
  },
  {
    text: "Ambiente impecable, barberos de primer nivel y productos de alta calidad. No cambiaría esta barbería por ninguna otra.",
    name: "David Rodríguez",
    role: "Cliente desde 2020",
    avatar: "DR",
    rating: 5,
  },
  {
    text: "Desde la primera visita quedé impresionado. La puntualidad y el trato profesional marcan la diferencia. Totalmente recomendado.",
    name: "Miguel Sánchez",
    role: "Nuevo cliente",
    avatar: "MS",
    rating: 5,
  },
  {
    text: "Reservo por WhatsApp y siempre me confirman en minutos. El sistema de historial es genial, ya saben exactamente qué corte me gusta.",
    name: "Andrés Quiroz",
    role: "Cliente frecuente",
    avatar: "AQ",
    rating: 5,
  },
];

export function LandingTestimonials() {
  return (
    <section id="testimonios" className="py-20 lg:py-28 relative" style={{ background: "#0d1018" }}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-gold text-sm font-semibold uppercase tracking-[0.2em]">
            Testimonios
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white mt-3">
            Lo que dicen{" "}
            <span className="text-gradient-gold">nuestros clientes</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, i) => (
            <div key={i} className="glass-card-hover p-6 relative group">
              <Quote className="h-6 w-6 text-gold/10 absolute top-5 right-5 group-hover:text-gold/20 transition-colors" />
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-gold text-gold" />
                ))}
              </div>
              <p className="text-white/50 text-sm leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gold/20 to-gold/5 flex items-center justify-center text-gold font-bold text-xs border border-gold/15">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-white/25 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
