import { usePublicBarbers } from "@/hooks/usePublicData";
import { User, Award, Star } from "lucide-react";

export function TeamSection() {
  const { data: barbers = [], isLoading } = usePublicBarbers();

  return (
    <section id="equipo" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold tracking-[0.2em] uppercase text-sm">
            El Equipo
          </span>
          <h2 className="font-display text-4xl md:text-5xl mt-2">
            Maestros del Oficio
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Conoce a los profesionales que harán de cada visita una experiencia excepcional.
            Años de experiencia, formación continua y pasión por el oficio.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="card-elevated p-4 animate-pulse">
                <div className="aspect-square bg-muted rounded-lg mb-4" />
                <div className="h-6 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded w-2/3" />
              </div>
            ))}
          </div>
        ) : barbers.length === 0 ? (
          <div className="text-center py-12">
            <User className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Próximamente conocerás a nuestro equipo
            </p>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {barbers.map((barber) => (
              <div
                key={barber.id}
                className="card-elevated overflow-hidden group"
              >
                <div className="aspect-square relative overflow-hidden">
                  {barber.photo_url ? (
                    <img
                      src={barber.photo_url}
                      alt={barber.full_name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                      <User className="h-24 w-24 text-primary/40" />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-sidebar/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="p-4">
                  <h3 className="font-display text-xl">{barber.full_name}</h3>
                  {barber.specialty && (
                    <p className="text-primary text-sm font-medium">
                      {barber.specialty}
                    </p>
                  )}
                  <div className="flex items-center gap-1 mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-warning text-warning"
                      />
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
