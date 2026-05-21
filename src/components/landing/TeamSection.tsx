import { usePublicBarbers } from "@/hooks/usePublicData";

const defaultTeam = [
  {
    name: "Jheremy Sair",
    image: "https://images.unsplash.com/photo-1503467913725-8484b65b0715?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Juan Perez",
    image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=800&auto=format&fit=crop",
  },
  {
    name: "Vanessa Rosa Aquino",
    image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=800&auto=format&fit=crop",
  },
];

export function TeamSection() {
  const { data: dbBarbers } = usePublicBarbers();

  // Map database barbers or fallback to defaultTeam
  const displayTeam = dbBarbers && dbBarbers.length > 0
    ? dbBarbers.map((b) => ({
        name: b.full_name,
        image: b.photo_url || "https://images.unsplash.com/photo-1503467913725-8484b65b0715?q=80&w=800&auto=format&fit=crop"
      }))
    : defaultTeam;

  return (
    <section id="equipo" className="py-24 lg:py-36 bg-[#050505] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        
        {/* ── Header ── */}
        <div className="max-w-4xl mx-auto text-center mb-20 lg:mb-28">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-8 bg-amber-500/50" />
            <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.5em]">Nuestro Equipo</span>
            <div className="h-px w-8 bg-amber-500/50" />
          </div>
          <h2 className="font-display text-4xl sm:text-6xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter uppercase italic mb-6 pr-4 pb-1">
            Maestros del <span className="text-gradient-gold">Oficio</span>
          </h2>
          <p className="text-zinc-500 text-base sm:text-lg font-light max-w-2xl mx-auto leading-relaxed">
            Profesionales con años de experiencia dedicados a esculpir tu mejor versión a través del arte y la precisión.
          </p>
        </div>

        {/* ── Grid ── */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3 max-w-6xl mx-auto">
          {displayTeam.map((member, i) => (
            <div
              key={i}
              className="group relative"
            >
              {/* Aspect-ratio adjusted to aspect-[3/4.2] to make cards slightly taller and larger */}
              <div className="relative aspect-[3/4.2] overflow-hidden rounded-[2rem] sm:rounded-[2.5rem] border border-white/5 bg-zinc-950 shadow-2xl">
                {/* Image */}
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105 opacity-80 group-hover:opacity-100"
                  loading="lazy"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent transition-opacity duration-700" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-8 sm:p-10 flex flex-col justify-end">
                  <h3 className="font-display text-3xl sm:text-4xl font-black text-white uppercase italic tracking-tight leading-none group-hover:text-amber-500 transition-colors pr-2">
                    {member.name}
                  </h3>
                </div>
              </div>
            </div>
          ))}
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
