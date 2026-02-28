import { usePublicBarbers } from "@/hooks/usePublicData";
import { Scissors } from "lucide-react";

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
    <section id="equipo" className="py-24 lg:py-32 relative bg-barber-bg">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-barber-orange text-sm font-semibold uppercase tracking-[0.25em]">
            Equipo
          </span>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-barber-text mt-3">
            Nuestros Maestros{" "}
            <span className="text-gradient-gold">del Oficio</span>
          </h2>
          <p className="text-barber-muted mt-4 max-w-xl mx-auto text-base">
            Profesionales con años de experiencia dedicados a que luzcas tu mejor versión.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] rounded-2xl bg-barber-card mb-4" />
                <div className="h-4 bg-barber-card rounded w-2/3 mx-auto mb-2" />
                <div className="h-3 bg-barber-card rounded w-1/2 mx-auto" />
              </div>
            ))
          ) : (
            displayBarbers.map((barber, i) => (
              <div
                key={i}
                className="group relative"
              >
                {/* Photo container */}
                <div className="aspect-[3/4] rounded-2xl overflow-hidden mb-5 relative border border-barber-border bg-barber-card transition-all duration-500 group-hover:border-barber-red/40 group-hover:shadow-[0_8px_40px_-8px_hsl(358_77%_46%/0.25)]">
                  {barber.photo_url ? (
                    <img
                      src={barber.photo_url}
                      alt={barber.full_name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-barber-card to-barber-bg flex items-center justify-center">
                      <span className="font-display text-5xl lg:text-6xl font-extrabold text-barber-red/20">
                        {barber.full_name.split(" ").map((n) => n[0]).join("")}
                      </span>
                    </div>
                  )}
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-gradient-to-t from-barber-bg/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-5">
                    <div className="flex items-center gap-2 text-barber-orange text-sm font-medium">
                      <Scissors className="h-4 w-4" />
                      <span>{barber.specialty || "Barbero profesional"}</span>
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div className="text-center">
                  <h3 className="text-barber-text font-bold text-lg">{barber.full_name}</h3>
                  <p className="text-barber-muted text-sm mt-0.5">{barber.specialty || "Barbero profesional"}</p>
                </div>

                {/* Red accent line */}
                <div className="mx-auto mt-3 w-8 h-0.5 bg-barber-red/40 rounded-full group-hover:w-16 group-hover:bg-barber-red transition-all duration-500" />
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
