import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    text: "Ahorramos 2 horas diarias en cuadres de caja. El control de inventario nos cambió la vida.",
    name: "Carlos Mendoza",
    role: "Dueño de Barbería The King",
    avatar: "CM",
    rating: 5,
  },
  {
    text: "Mis clientes ahora reservan por WhatsApp y reciben confirmación automática. Increíble.",
    name: "María Fernández",
    role: "Administradora, Café La Esquina",
    avatar: "MF",
    rating: 5,
  },
  {
    text: "Pasamos de Excel a Sharp POS y ahora tenemos reportes en tiempo real. Lo recomiendo 100%.",
    name: "Jorge Ramírez",
    role: "Gerente, MiniMarket Express",
    avatar: "JR",
    rating: 5,
  },
  {
    text: "La versión móvil es perfecta para cuando no estoy en la tienda. Monitoreo todo desde mi celular.",
    name: "Andrea López",
    role: "Propietaria, Boutique Moda",
    avatar: "AL",
    rating: 5,
  },
];

export function LandingTestimonials() {
  return (
    <section
      id="testimonios"
      className="py-20 lg:py-28 relative"
      style={{ background: "#0f1117" }}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-neon-cyan text-sm font-semibold uppercase tracking-widest">
            Testimonios
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white mt-3 mb-4">
            Lo que dicen{" "}
            <span className="text-gradient-cyan">nuestros usuarios</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {testimonials.map((t, i) => (
            <div key={i} className="glass-card-hover p-6 relative group">
              <Quote className="h-6 w-6 text-neon-cyan/10 absolute top-5 right-5 group-hover:text-neon-cyan/20 transition-colors" />
              <div className="flex gap-0.5 mb-4">
                {[...Array(t.rating)].map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <p className="text-white/60 text-sm leading-relaxed mb-6">"{t.text}"</p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-neon-cyan/20 to-neon-purple/20 flex items-center justify-center text-white font-bold text-xs border border-white/10">
                  {t.avatar}
                </div>
                <div>
                  <p className="text-white font-semibold text-sm">{t.name}</p>
                  <p className="text-white/30 text-xs">{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
