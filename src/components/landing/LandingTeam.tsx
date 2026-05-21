import { useRef } from "react";
import { usePublicBarbers } from "@/hooks/usePublicData";
import { ChevronLeft, ChevronRight } from "lucide-react";

const defaultImages = [
  "https://images.unsplash.com/photo-1503467913725-8484b65b0715?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=800&auto=format&fit=crop",
  "https://images.unsplash.com/photo-1621605815971-fbc98d665033?q=80&w=800&auto=format&fit=crop"
];

export function LandingTeam() {
  const { data: barbers, isLoading: loading } = usePublicBarbers();
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const fallbackBarbers = [
    { id: "1", full_name: "Jheremy Sair", photo_url: defaultImages[0] },
    { id: "2", full_name: "Juan Perez", photo_url: defaultImages[1] },
    { id: "3", full_name: "Tayta", photo_url: defaultImages[2] },
    { id: "4", full_name: "Vanessa Rosa Aquino", photo_url: defaultImages[3] },
  ];

  const displayBarbers = barbers && barbers.length > 0 ? barbers : fallbackBarbers;

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -340, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 340, behavior: "smooth" });
    }
  };

  return (
    <section id="equipo" className="py-24 lg:py-36 bg-[#050505] relative overflow-clip">
      {/* Hide scrollbar utility */}
      <style dangerouslySetInnerHTML={{__html: `
        .scrollbar-none::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-none {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />

      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-amber-500/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-amber-500/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-16 max-w-7xl mx-auto gap-6">
          <div className="text-left">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.5em]">Nuestro Equipo</span>
              <div className="h-px w-8 bg-amber-500/30" />
            </div>
            <h2 className="font-display text-4xl sm:text-5xl font-black text-white leading-[0.9] tracking-tighter uppercase italic">
              Maestros del <span className="text-gradient-gold">Oficio</span>
            </h2>
            <p className="text-zinc-500 text-sm sm:text-base font-light mt-4 max-w-xl">
              Profesionales con años de experiencia dedicados a esculpir tu mejor versión a través del arte y la precisión.
            </p>
          </div>
          
          {/* Slider controls */}
          <div className="flex gap-3 shrink-0 self-start md:self-end">
            <button
              onClick={scrollLeft}
              className="w-12 h-12 rounded-full border border-white/10 bg-white/5 hover:bg-amber-500 hover:text-black hover:border-amber-500 text-white flex items-center justify-center transition-all duration-300 active:scale-95"
              aria-label="Anterior"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={scrollRight}
              className="w-12 h-12 rounded-full border border-white/10 bg-white/5 hover:bg-amber-500 hover:text-black hover:border-amber-500 text-white flex items-center justify-center transition-all duration-300 active:scale-95"
              aria-label="Siguiente"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* ── Horizontal Scroll Slider Row ── */}
        <div 
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-none snap-x snap-mandatory max-w-7xl mx-auto py-4 px-1"
        >
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse w-[280px] sm:w-[320px] shrink-0">
                <div className="relative aspect-[3/4.5] rounded-[2rem] bg-zinc-900 border border-white/5" />
              </div>
            ))
          ) : (
            displayBarbers.map((barber, i) => {
              const imageSrc = barber.photo_url || defaultImages[i % defaultImages.length];
              return (
                <div
                  key={barber.id || i}
                  className="w-[280px] sm:w-[320px] shrink-0 snap-start group relative"
                >
                  <div className="relative aspect-[3/4.5] overflow-hidden rounded-[2rem] border border-white/5 bg-zinc-950 shadow-2xl">
                    {/* Image */}
                    <img
                      src={imageSrc}
                      alt={barber.full_name}
                      className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                      loading="lazy"
                    />
                    
                    {/* Overlay Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/25 to-transparent transition-opacity duration-500" />

                    {/* Content Overlay */}
                    <div className="absolute inset-0 p-8 flex flex-col justify-end">
                      <h3 className="font-display text-2xl sm:text-3xl font-black text-white uppercase italic tracking-tight leading-none group-hover:text-amber-500 transition-colors pr-2">
                        {barber.full_name}
                      </h3>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Bottom Decorative Line */}
        <div className="mt-24 flex items-center gap-8 justify-center">
          <div className="h-px flex-1 max-w-[200px] bg-gradient-to-r from-transparent to-amber-500/10" />
          <p className="text-amber-500/30 text-[9px] font-black uppercase tracking-[0.8em]">Supreme Grooming Masters</p>
          <div className="h-px flex-1 max-w-[200px] bg-gradient-to-l from-transparent to-amber-500/10" />
        </div>
      </div>
    </section>
  );
}
