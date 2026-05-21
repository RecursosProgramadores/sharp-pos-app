import { useState } from "react";
import { Clock, Calendar, Star } from "lucide-react";
import { useServices } from "@/hooks/usePublicData";

interface ServicesSectionProps {
  onReserveClick: (serviceId?: string) => void;
}

const CATEGORY_ORDER = ["Cortes", "Degradados", "Ondulados", "Tintes", "Otros Servicios"];

export function LandingServices({ onReserveClick }: ServicesSectionProps) {
  const { data: services, isLoading: loading } = useServices();
  const [activeCategory, setActiveCategory] = useState<string>("Cortes");

  const displayServices = services || [];

  const categories = CATEGORY_ORDER.filter((cat) =>
    displayServices.some((s) => s.category === cat)
  );

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
    <section id="servicios" className="py-24 lg:py-36 relative bg-[#050505] overflow-clip">
      {/* Background Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-0 w-[500px] h-[500px] bg-amber-500/3 blur-[160px] rounded-full -ml-64" />
        <div className="absolute bottom-1/4 right-0 w-[500px] h-[500px] bg-amber-500/3 blur-[160px] rounded-full -mr-64" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* ── Header ── */}
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.4em] mb-4 block">
            Servicios Premium
          </span>
          <h2 className="font-display text-4xl sm:text-5xl font-black text-white leading-[0.95] tracking-tighter uppercase italic">
            Excelencia en <br className="hidden sm:block" />
            <span className="text-gradient-gold">cada servicio</span>
          </h2>
          <p className="text-zinc-500 text-sm sm:text-base font-light mt-6 max-w-xl mx-auto leading-relaxed">
            Incluye lavado, cepillado y productos de alta gama. Reserva en segundos desde nuestro sistema exclusivo.
          </p>
          <div className="w-16 h-[2px] bg-amber-500/30 mx-auto mt-6" />
        </div>

        {/* ── Categories Buttons Bar ── */}
        <div className="flex flex-wrap justify-center gap-3 mb-16 max-w-5xl mx-auto">
          {effectiveCategories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 border ${
                activeCategory === cat
                  ? "bg-amber-500 text-black border-amber-500 shadow-[0_10px_20px_-8px_rgba(245,158,11,0.4)]"
                  : "bg-white/5 text-zinc-400 border-white/5 hover:border-amber-500/30 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* ── Services Cards Grid ── */}
        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="rounded-3xl bg-white/[0.01] border border-white/5 p-8 animate-pulse h-80 flex flex-col justify-between">
                <div>
                  <div className="h-3 bg-white/10 rounded w-1/3 mb-4" />
                  <div className="h-6 bg-white/10 rounded w-2/3 mb-2" />
                  <div className="h-4 bg-white/10 rounded w-full mb-1" />
                  <div className="h-4 bg-white/10 rounded w-4/5" />
                </div>
                <div className="h-10 bg-white/10 rounded w-full" />
              </div>
            ))}
          </div>
        ) : filteredServices.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-zinc-500 text-lg font-light italic">No hay servicios en esta categoría aún.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto items-stretch">
            {filteredServices.map((service, i) => (
              <div
                key={service.id || i}
                className="group relative rounded-[2rem] bg-white/[0.02] border border-white/5 p-8 transition-all duration-500 hover:border-amber-500/20 hover:bg-amber-500/[0.01] flex flex-col justify-between shadow-md"
              >
                {/* Popular Badge */}
                {service.is_popular && (
                  <div className="absolute -top-3 right-6 flex items-center gap-1 px-3 py-1 rounded-full bg-amber-500 text-black text-[9px] font-black uppercase tracking-wider shadow-[0_5px_15px_rgba(245,158,11,0.3)]">
                    <Star className="h-3 w-3 fill-current" />
                    Popular
                  </div>
                )}

                {/* Card Top */}
                <div>
                  <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-black">
                    {service.category}
                  </span>

                  <h3 className="text-white font-black text-xl mt-2 mb-3 leading-snug uppercase italic tracking-tight group-hover:text-amber-500 transition-colors pr-2">
                    {service.name}
                  </h3>

                  {service.description && (
                    <p className="text-zinc-400 text-xs leading-relaxed font-light mb-6 line-clamp-3">
                      {service.description}
                    </p>
                  )}
                </div>

                {/* Card Bottom / Price / Booking Button */}
                <div className="mt-auto">
                  <div className="flex items-end justify-between pb-4 border-t border-white/5 pt-4">
                    <div className="flex items-center gap-1.5 text-zinc-500 text-xs font-semibold">
                      <Clock className="h-3.5 w-3.5 text-amber-500/60" />
                      <span>{formatDuration(service.duration_minutes)}</span>
                    </div>
                    <span className="font-display text-2xl sm:text-3xl font-black text-amber-500 italic pr-2 inline-block">
                      S/{service.price}
                    </span>
                  </div>

                  <button
                    onClick={() => onReserveClick(service.id)}
                    className={`w-full py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-2 active:scale-95 ${
                      service.is_popular
                        ? "bg-amber-500 text-black border border-amber-500 shadow-md shadow-amber-500/10 hover:bg-amber-600 hover:shadow-amber-500/20"
                        : "bg-white/5 border border-white/5 text-white hover:bg-amber-500 hover:text-black hover:border-amber-500"
                    }`}
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
