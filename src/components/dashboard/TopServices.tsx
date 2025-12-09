import { Progress } from "@/components/ui/progress";

const services = [
  { name: "Corte Clásico", count: 156, percentage: 100 },
  { name: "Barba Completa", count: 98, percentage: 63 },
  { name: "Corte + Barba", count: 87, percentage: 56 },
  { name: "Fade Degradado", count: 72, percentage: 46 },
  { name: "Afeitado Tradicional", count: 45, percentage: 29 },
];

export function TopServices() {
  return (
    <div className="card-elevated p-6 animate-fade-in">
      <div className="mb-6">
        <h3 className="font-display text-xl">Servicios Más Populares</h3>
        <p className="text-sm text-muted-foreground">Este mes</p>
      </div>
      <div className="space-y-5">
        {services.map((service, index) => (
          <div key={service.name} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">{service.name}</span>
              <span className="text-muted-foreground">{service.count} servicios</span>
            </div>
            <Progress
              value={service.percentage}
              className="h-2"
            />
          </div>
        ))}
      </div>
    </div>
  );
}
