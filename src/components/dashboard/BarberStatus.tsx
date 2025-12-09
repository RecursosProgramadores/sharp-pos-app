import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const barbers = [
  {
    id: 1,
    name: "Miguel Ángel",
    status: "available",
    currentClient: null,
    todaySales: 8,
  },
  {
    id: 2,
    name: "Juan Carlos",
    status: "busy",
    currentClient: "Carlos M.",
    todaySales: 6,
  },
  {
    id: 3,
    name: "Pedro Sánchez",
    status: "busy",
    currentClient: "Luis P.",
    todaySales: 7,
  },
  {
    id: 4,
    name: "Roberto Díaz",
    status: "break",
    currentClient: null,
    todaySales: 5,
  },
];

const statusConfig = {
  available: { label: "Disponible", variant: "success" as const },
  busy: { label: "Ocupado", variant: "warning" as const },
  break: { label: "Descanso", variant: "muted" as const },
};

export function BarberStatus() {
  return (
    <div className="card-elevated p-6 animate-fade-in">
      <div className="mb-6">
        <h3 className="font-display text-xl">Estado de Barberos</h3>
        <p className="text-sm text-muted-foreground">En tiempo real</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {barbers.map((barber) => {
          const status = statusConfig[barber.status as keyof typeof statusConfig];
          return (
            <div
              key={barber.id}
              className="flex items-center gap-3 p-4 rounded-xl border border-border bg-muted/30 hover:bg-muted/50 transition-colors"
            >
              <Avatar className="h-12 w-12 border-2 border-primary/20">
                <AvatarFallback className="bg-primary text-primary-foreground font-display text-lg">
                  {barber.name.split(" ")[0][0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="font-semibold truncate">{barber.name}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={status.variant} className="text-xs">
                    {status.label}
                  </Badge>
                  {barber.currentClient && (
                    <span className="text-xs text-muted-foreground">
                      → {barber.currentClient}
                    </span>
                  )}
                </div>
              </div>
              <div className="text-right">
                <p className="font-display text-2xl">{barber.todaySales}</p>
                <p className="text-xs text-muted-foreground">servicios</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
