import { Clock, Calendar } from "lucide-react";
import { useServices } from "@/hooks/usePublicData";

interface ServicesSectionProps {
  onReserveClick: () => void;
}

export function LandingServices({ onReserveClick }: ServicesSectionProps) {
  const { data: services, isLoading: loading } = useServices();

  const fallbackServices = [
    { name: "Perfilado de Barba", price: 12, duration_minutes: 25, category: "Barba", description: "Diseño y perfilado profesional con navaja y máquina." },
    { name: "Afeitado Clásico", price: 20, duration_minutes: 35, category: "Barba", description: "Afeitado tradicional con toalla caliente y navaja." },
    { name: "Corte Fade Personalizado", price: 25, duration_minutes: 40, category: "Corte", description: "Degradado a medida con acabado perfecto." },
    { name: "Corte + Barba Combo", price: 35, duration_minutes: 55, category: "Combo", description: "El combo completo para tu mejor look." },
    { name: "Diseño de Cejas", price: 8, duration_minutes: 15, category: "Detalle", description: "Perfilado y diseño de cejas con cera y navaja." },
    { name: "Tratamiento Capilar", price: 30, duration_minutes: 30, category: "Tratamiento", description: "Nutrición profunda con productos premium." },
  ];

  const displayServices = services && services.length > 0 ? services : fallbackServices;

  return (
    <section id="servicios" className="py-20 lg:py-28 relative" style={{ background: "#0a0c12" }}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-neon-cyan text-sm font-semibold uppercase tracking-[0.2em]">
            Servicios Premium
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white mt-3 mb-3">
            Excelencia en{" "}
            <span className="text-gradient-gold">cada servicio</span>
          </h2>
          <p className="text-white/35 text-base max-w-lg mx-auto">
            Incluye lavado, cepillado y productos de alta gama. Reserva en segundos desde nuestro sistema exclusivo.
          </p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="glass-card p-6 animate-pulse">
                <div className="h-4 bg-white/5 rounded w-2/3 mb-3" />
                <div className="h-3 bg-white/5 rounded w-full mb-6" />
                <div className="h-8 bg-white/5 rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {displayServices.map((service, i) => (
              <div key={i} className="glass-card-hover p-6 group">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="text-[10px] uppercase tracking-wider text-gold/60 font-semibold">
                      {service.category}
                    </span>
                    <h3 className="text-white font-bold text-lg mt-0.5">{service.name}</h3>
                  </div>
                  <span className="font-display text-2xl font-extrabold text-gradient-gold">
                    S/{service.price}
                  </span>
                </div>

                {service.description && (
                  <p className="text-white/35 text-sm mb-4 leading-relaxed">{service.description}</p>
                )}

                <div className="flex items-center justify-between mt-auto">
                  <div className="flex items-center gap-1.5 text-white/30 text-xs">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{service.duration_minutes} min</span>
                  </div>
                  <button
                    onClick={onReserveClick}
                    className="flex items-center gap-1.5 text-gold text-xs font-semibold hover:text-gold-light transition-colors group-hover:underline underline-offset-2"
                  >
                    <Calendar className="h-3.5 w-3.5" />
                    Reservar
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
