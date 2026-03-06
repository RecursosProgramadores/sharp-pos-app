import { usePublicBarbers } from "@/hooks/usePublicData";
import { Scissors, Award, Sparkles } from "lucide-react";

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
    <section id="equipo" className="py-24 lg:py-32 relative bg-barber-bg overflow-hidden">
      {/* Background decorations */}
      <div className="absolute top-0 left-0 w-72 h-72 bg-barber-red/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-barber-orange/5 rounded-full blur-[150px]" />

      <div className="container mx-auto px-4 lg:px-8 relative">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-barber-red/20 bg-barber-red/5 mb-4">
            <Scissors className="h-3.5 w-3.5 text-barber-red" />
            <span className="text-barber-red text-xs font-bold uppercase tracking-[0.2em]">
              Nuestro Equipo
            </span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl font-extrabold text-barber-text mt-3">
            Maestros{" "}
            <span className="text-gradient-gold">del Oficio</span>
          </h2>
          <p className="text-barber-muted mt-4 max-w-xl mx-auto text-base">
            Profesionales con años de experiencia dedicados a que luzcas tu mejor versión.
          </p>
        </div>

        {/* Barbers grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
          {loading ? (
            [...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="rounded-2xl bg-barber-card border border-barber-border p-6">
                  <div className="w-24 h-24 rounded-full bg-barber-border mx-auto mb-4" />
                  <div className="h-4 bg-barber-border rounded w-2/3 mx-auto mb-2" />
                  <div className="h-3 bg-barber-border rounded w-1/2 mx-auto" />
                </div>
              </div>
            ))
          ) : (
            displayBarbers.map((barber, i) => (
              <div
                key={i}
                className="group relative"
              >
                {/* Card */}
                <div className="relative rounded-2xl bg-barber-card border border-barber-border p-6 pt-8 text-center transition-all duration-500 hover:border-barber-red/30 hover:shadow-[0_12px_40px_-8px_hsl(358_77%_46%/0.2)] hover:-translate-y-2">
                  {/* Top accent */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-gradient-to-r from-barber-red to-barber-orange rounded-b-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Avatar */}
                  <div className="relative w-28 h-28 mx-auto mb-5">
                    <div className="absolute inset-0 rounded-full bg-gradient-to-br from-barber-red/20 to-barber-orange/20 group-hover:from-barber-red/40 group-hover:to-barber-orange/40 transition-all duration-500" />
                    <div className="absolute inset-[3px] rounded-full overflow-hidden bg-barber-bg">
                      {barber.photo_url ? (
                        <img
                          src={barber.photo_url}
                          alt={barber.full_name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-barber-card to-barber-bg flex items-center justify-center">
                          <span className="font-display text-3xl font-extrabold text-barber-red/25 group-hover:text-barber-red/40 transition-colors duration-500">
                            {barber.full_name.split(" ").map((n) => n[0]).join("")}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* Online indicator */}
                    <div className="absolute bottom-1 right-1 w-5 h-5 rounded-full bg-barber-card border-2 border-barber-card flex items-center justify-center">
                      <div className="w-3 h-3 rounded-full bg-emerald-500" />
                    </div>
                  </div>

                  {/* Name */}
                  <h3 className="text-barber-text font-bold text-lg mb-1">{barber.full_name}</h3>
                  
                  {/* Specialty badge */}
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-barber-red/10 border border-barber-red/20 mb-4">
                    <Scissors className="h-3 w-3 text-barber-red" />
                    <span className="text-barber-red text-xs font-semibold">
                      {barber.specialty || "Barbero profesional"}
                    </span>
                  </div>

                  {/* Stats row */}
                  <div className="grid grid-cols-2 gap-2 pt-4 border-t border-barber-border">
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-barber-orange mb-0.5">
                        <Award className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-barber-muted font-semibold">Experto</span>
                    </div>
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-1 text-barber-orange mb-0.5">
                        <Sparkles className="h-3.5 w-3.5" />
                      </div>
                      <span className="text-[10px] uppercase tracking-wider text-barber-muted font-semibold">Premium</span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
}
