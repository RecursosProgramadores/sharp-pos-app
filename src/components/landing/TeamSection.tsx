import { Crown, Gem, Trophy, Award, Star, User } from "lucide-react";

export function TeamSection() {
  const team = [
    {
      name: "Jheremy Sair",
      specialty: "Maestro Barba",
      level: "Experto",
      status: "Premium",
      image: "https://images.unsplash.com/photo-1503467913725-8484b65b0715?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Juan Perez",
      specialty: "Diseño & Estilo",
      level: "Experto",
      status: "Premium",
      image: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?q=80&w=800&auto=format&fit=crop",
    },
    {
      name: "Vanessa Rosa Aquino",
      specialty: "Corte Mixto",
      level: "Experto",
      status: "Premium",
      image: "https://images.unsplash.com/photo-1595152772835-219674b2a8a6?q=80&w=800&auto=format&fit=crop",
    },
  ];

  return (
    <section id="equipo" className="py-32 lg:py-48 bg-[#050505] relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-amber-500/5 blur-[120px] rounded-full" />
      </div>

      <div className="container mx-auto px-6 lg:px-12 relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-24">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="h-px w-8 bg-amber-500" />
            <span className="text-amber-500 text-[10px] font-black uppercase tracking-[0.5em]">Nuestro Equipo</span>
            <div className="h-px w-8 bg-amber-500" />
          </div>
          <h2 className="font-display text-5xl md:text-7xl font-black text-white leading-[0.9] tracking-tighter uppercase italic mb-8">
            Maestros del <span className="text-gradient-gold">Oficio</span>
          </h2>
          <p className="text-zinc-500 text-lg md:text-xl font-light max-w-2xl mx-auto leading-relaxed italic">
            "Profesionales con años de experiencia dedicados a esculpir tu mejor versión a través del arte y la precisión."
          </p>
        </div>

        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3 max-w-7xl mx-auto">
          {team.map((member, i) => (
            <div
              key={i}
              className="group relative"
            >
              <div className="relative aspect-[3/4] overflow-hidden rounded-[2.5rem] border border-white/5 bg-zinc-900 shadow-2xl">
                {/* Image */}
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:rotate-1 opacity-70 group-hover:opacity-100"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent opacity-90 group-hover:opacity-60 transition-opacity duration-700" />

                {/* Content Overlay */}
                <div className="absolute inset-0 p-10 flex flex-col justify-end translate-y-8 group-hover:translate-y-0 transition-all duration-700">
                  <div className="flex gap-2 mb-6 opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                    <span className="px-5 py-2 rounded-full bg-amber-500 text-black text-[10px] font-black uppercase tracking-widest flex items-center gap-2 shadow-[0_10px_20px_-5px_rgba(245,158,11,0.5)]">
                      <Crown className="h-3 w-3" />
                      {member.level}
                    </span>
                    <span className="px-5 py-2 rounded-full bg-white/10 text-white border border-white/10 text-[10px] font-black uppercase tracking-widest backdrop-blur-md">
                      {member.status}
                    </span>
                  </div>
                  
                  <h3 className="font-display text-4xl font-black text-white uppercase italic tracking-tight leading-none mb-4 group-hover:text-amber-500 transition-colors">
                    {member.name}
                  </h3>
                  
                  <div className="flex items-center gap-3 mb-8">
                    <div className="w-8 h-px bg-amber-500" />
                    <p className="text-zinc-400 text-sm font-bold uppercase tracking-[0.2em] italic">{member.specialty}</p>
                  </div>

                  {/* High-Impact Icon Grid */}
                  <div className="flex gap-6 mt-2 pt-8 border-t border-white/10 opacity-0 group-hover:opacity-100 transition-all duration-700 translate-y-4 group-hover:translate-y-0">
                    <div className="flex flex-col items-center gap-2 group/icon">
                      <Trophy className="h-7 w-7 text-amber-500 group-hover/icon:scale-125 transition-transform" />
                      <span className="text-[7px] font-black text-amber-500/40 uppercase tracking-widest">Maestría</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 group/icon">
                      <Gem className="h-7 w-7 text-amber-500 group-hover/icon:scale-125 transition-transform" />
                      <span className="text-[7px] font-black text-amber-500/40 uppercase tracking-widest">Calidad</span>
                    </div>
                    <div className="flex flex-col items-center gap-2 group/icon">
                      <Star className="h-7 w-7 text-amber-500 group-hover/icon:scale-125 transition-transform" />
                      <span className="text-[7px] font-black text-amber-500/40 uppercase tracking-widest">Élite</span>
                    </div>
                  </div>
                </div>

                {/* Corner Decorative Element */}
                <div className="absolute top-10 right-10 w-14 h-14 rounded-2xl bg-amber-500 text-black flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 group-hover:rotate-[15deg] shadow-[0_0_30px_rgba(245,158,11,0.5)]">
                  <Award className="h-7 w-7" />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Decorative Line */}
        <div className="mt-32 flex items-center gap-8 justify-center">
          <div className="h-px flex-1 max-w-[200px] bg-gradient-to-r from-transparent to-amber-500/20" />
          <p className="text-amber-500/40 text-[9px] font-black uppercase tracking-[0.8em]">Supreme Grooming Masters</p>
          <div className="h-px flex-1 max-w-[200px] bg-gradient-to-l from-transparent to-amber-500/20" />
        </div>
      </div>
    </section>
  );
}
