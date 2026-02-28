import { usePublicBarbers } from "@/hooks/usePublicData";

export function LandingTeam() {
  const { data: barbers, isLoading: loading } = usePublicBarbers();

  const fallbackBarbers = [
    { full_name: "Carlos Mendoza", specialty: "Fade & Diseños", photo_url: null },
    { full_name: "Miguel Ramírez", specialty: "Barba Experta", photo_url: null },
    { full_name: "David Torres", specialty: "Corte Clásico", photo_url: null },
    { full_name: "Andrés García", specialty: "Afeitado Clásico", photo_url: null },
  ];

  const displayBarbers = barbers && barbers.length > 0 ? barbers : fallbackBarbers;

  return (
    <section id="equipo" className="py-20 lg:py-28 relative" style={{ background: "#0d1018" }}>
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-gold text-sm font-semibold uppercase tracking-[0.2em]">
            Equipo
          </span>
          <h2 className="font-display text-3xl md:text-5xl font-extrabold text-white mt-3">
            Nuestros Maestros{" "}
            <span className="text-gradient-gold">del Oficio</span>
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="text-center animate-pulse">
                <div className="w-28 h-28 rounded-full bg-white/5 mx-auto mb-4" />
                <div className="h-3 bg-white/5 rounded w-2/3 mx-auto mb-2" />
                <div className="h-2 bg-white/5 rounded w-1/2 mx-auto" />
              </div>
            ))
          ) : (
            displayBarbers.map((barber, i) => (
              <div key={i} className="text-center group">
                <div className="w-28 h-28 md:w-32 md:h-32 rounded-full mx-auto mb-4 overflow-hidden border-2 border-gold/20 group-hover:border-gold/50 transition-all duration-500 group-hover:shadow-lg group-hover:shadow-gold/10">
                  {barber.photo_url ? (
                    <img
                      src={barber.photo_url}
                      alt={barber.full_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-gold/15 to-gold/5 flex items-center justify-center">
                      <span className="font-display text-2xl font-extrabold text-gold/40">
                        {barber.full_name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="text-white font-bold text-sm mb-0.5">{barber.full_name}</h3>
                <p className="text-gold/50 text-xs font-medium">{barber.specialty || "Barbero profesional"}</p>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
