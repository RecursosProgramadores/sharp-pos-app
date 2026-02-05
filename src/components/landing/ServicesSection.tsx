import { useState } from "react";
import { Clock, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useServices } from "@/hooks/usePublicData";

interface ServicesSectionProps {
  onReserveClick: () => void;
}

export function ServicesSection({ onReserveClick }: ServicesSectionProps) {
  const { data: services = [], isLoading } = useServices();

  // Get unique categories
  const categories = [...new Set(services.map((s) => s.category))];

  const formatDuration = (minutes: number) => {
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}min` : `${hours}h`;
  };

  return (
    <section id="servicios" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <span className="text-primary font-semibold tracking-[0.2em] uppercase text-sm">
            Nuestros Servicios
          </span>
          <h2 className="font-display text-4xl md:text-5xl mt-2">
            Catálogo de Servicios
          </h2>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Todos nuestros servicios incluyen lavado, cepillado y aplicación de productos de calidad.
          </p>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="card-elevated p-6 animate-pulse">
                <div className="h-6 bg-muted rounded mb-4 w-3/4" />
                <div className="h-4 bg-muted rounded mb-2" />
                <div className="h-4 bg-muted rounded w-1/2" />
              </div>
            ))}
          </div>
        ) : (
          <Tabs defaultValue={categories[0] || "cortes"} className="w-full">
            <TabsList className="flex flex-wrap justify-center gap-2 mb-8 bg-transparent h-auto">
              {categories.map((category) => (
                <TabsTrigger
                  key={category}
                  value={category}
                  className="capitalize data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                >
                  {category}
                </TabsTrigger>
              ))}
            </TabsList>

            {categories.map((category) => (
              <TabsContent key={category} value={category}>
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {services
                    .filter((s) => s.category === category)
                    .map((service) => (
                      <div
                        key={service.id}
                        className="card-elevated p-6 relative overflow-hidden hover:shadow-glow transition-all group"
                      >
                        {service.is_popular && (
                          <Badge className="absolute top-4 right-4 bg-secondary">
                            Popular
                          </Badge>
                        )}
                        <h3 className="font-display text-xl mb-2">
                          {service.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4">
                          {service.description}
                        </p>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                          <Clock className="h-4 w-4" />
                          <span>{formatDuration(service.duration_minutes)}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-display text-3xl text-primary">
                            S/ {service.price}
                          </span>
                          <Button
                            size="sm"
                            onClick={onReserveClick}
                            className="gap-2"
                          >
                            <Calendar className="h-4 w-4" />
                            Reservar
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}

        <div className="text-center mt-12">
          <Button
            size="lg"
            onClick={onReserveClick}
            className="gap-2 bg-primary hover:bg-primary/90"
          >
            <Calendar className="h-5 w-5" />
            Ver Todos los Servicios y Reservar
          </Button>
        </div>
      </div>
    </section>
  );
}
