import { useState } from "react";
import { Clock, Calendar, Star } from "lucide-react";
import { useServices } from "@/hooks/usePublicData";

interface ServicesSectionProps {
  onReserveClick: () => void;
}

const CATEGORY_MAP: Record<string, string> = {
  "Cortes": "Cortes",
  "Degradados": "Degradados",
  "Ondulados": "Ondulados",
  "Tintes": "Tintes",
  "Otros Servicios": "Otros Servicios",
};

const CATEGORY_ORDER = ["Cortes", "Degradados", "Ondulados", "Tintes", "Otros Servicios"];

export function LandingServices({ onReserveClick }: ServicesSectionProps) {
  const { data: services, isLoading: loading } = useServices();
  const [activeCategory, setActiveCategory] = useState<string>("Cortes");

  const displayServices = services || [];

  // Get unique categories from data, ordered by CATEGORY_ORDER
  const categories = CATEGORY_ORDER.filter((cat) =>
    displayServices.some((s) => s.category === cat)
  );

  // If no categories match, show all with a fallback
  const effectiveCategories = categories.length > 0 ? categories : ["Todos"];

  const filteredServices =
    activeCategory === "Todos"
      ? displayServices
      : displayServices.filter((s) => s.category === activeCategory);

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  return (
    <section id="servicios" className="py-24 lg:py-32 relative bg-barber-card">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="text-barber-orange text-sm font-semibold uppercase tracking-[0.25em]">
            Servicios Premium
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-barber-text mt-3 mb-3">
            Excelencia en{" "}
            <span className="text-gradient-gold">cada servicio</span>
          </h2>
          <p className="text-barber-muted text-base max-w-lg mx-auto">
            Incluye lavado, cepillado y productos de alta gama. Reserva en segundos desde nuestro sistema exclusivo.
          </p>
        </div>

        {/* Category tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {effectiveCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 border ${
                activeCategory === cat
                  ? "bg-barber-red text-white border-barber-red shadow-[0_0_20px_hsl(358_77%_46%/0.3)]"
                  : "bg-transparent text-barber-muted border-barber-border hover:border-barber-red/40 hover:text-barber-text"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Services grid */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-2xl bg-barber-bg border border-barber-border p-6 animate-pulse">
                <div className="h-4 bg-barber-card rounded w-2/3 mb-3" />
                <div className="h-3 bg-barber-card rounded w-full mb-6" />
                <div className="h-8 bg-barber-card rounded w-1/3" />
              </div>
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-barber-muted text-lg">No hay servicios en esta categoría aún.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredServices.map((service, i) => (
              <div
                key={service.id || i}
                className="group relative rounded-2xl bg-barber-bg border border-barber-border p-6 transition-all duration-500 hover:border-barber-red/30 hover:shadow-[0_8px_40px_-8px_hsl(358_77%_46%/0.15)] hover:-translate-y-1"
              >
                {/* Popular badge */}
                {service.is_popular && (
                  <div className="absolute -top-3 right-4 flex items-center gap-1 px-3 py-1 rounded-full bg-barber-red text-white text-xs font-bold">
                    <Star className="h-3 w-3 fill-current" />
                    Popular
                  </div>
                )}

                {/* Category tag */}
                <span className="text-[10px] uppercase tracking-widest text-barber-muted font-semibold">
                  {service.category}
                </span>

                {/* Service name */}
                <h3 className="text-barber-text font-bold text-lg mt-1 mb-2 leading-tight">
                  {service.name}
                </h3>

                {/* Description */}
                {service.description && (
                  <p className="text-barber-muted text-sm mb-4 leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                )}

                {/* Duration + Price */}
                <div className="flex items-end justify-between mt-auto pt-2 border-t border-barber-border">
                  <div className="flex items-center gap-1.5 text-barber-muted text-xs">
                    <Clock className="h-3.5 w-3.5" />
                    <span>{formatDuration(service.duration_minutes)}</span>
                  </div>
                  <span className="font-display text-2xl font-extrabold text-barber-red">
                    S/{service.price}
                  </span>
                </div>

                {/* Reserve button */}
                <button
                  onClick={onReserveClick}
                  className="w-full mt-4 py-2.5 rounded-xl text-sm font-semibold transition-all duration-300 border border-barber-red/30 text-barber-red hover:bg-barber-red hover:text-white hover:shadow-[0_0_20px_hsl(358_77%_46%/0.25)]"
                >
                  <Calendar className="h-3.5 w-3.5 inline mr-1.5" />
                  Reservar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
