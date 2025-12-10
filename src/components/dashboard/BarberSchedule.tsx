import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

const barbers = [
  {
    id: 1,
    name: "Miguel Ángel",
    avatar: "MA",
    shift: "9:00 - 18:00",
    status: "available",
    nextAvailable: null,
  },
  {
    id: 2,
    name: "Juan Carlos",
    avatar: "JC",
    shift: "10:00 - 19:00",
    status: "busy",
    nextAvailable: 15,
  },
  {
    id: 3,
    name: "Pedro Sánchez",
    avatar: "PS",
    shift: "9:00 - 18:00",
    status: "busy",
    nextAvailable: 25,
  },
  {
    id: 4,
    name: "Roberto Díaz",
    avatar: "RD",
    shift: "11:00 - 20:00",
    status: "break",
    nextAvailable: 10,
  },
  {
    id: 5,
    name: "Luis Gómez",
    avatar: "LG",
    shift: "9:00 - 18:00",
    status: "available",
    nextAvailable: null,
  },
];

const statusConfig = {
  available: { label: "Disponible", variant: "success" as const, color: "bg-success" },
  busy: { label: "Ocupado", variant: "warning" as const, color: "bg-warning" },
  break: { label: "En Break", variant: "muted" as const, color: "bg-muted-foreground" },
};

export function BarberSchedule() {
  return (
    <div className="card-elevated p-6 animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl">Horario de Barberos Hoy</h3>
          <p className="text-sm text-muted-foreground">Estado actual del equipo</p>
        </div>
        <Clock className="h-5 w-5 text-muted-foreground" />
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Barbero</th>
              <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Turno</th>
              <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Estado</th>
              <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Próximo</th>
            </tr>
          </thead>
          <tbody>
            {barbers.map((barber) => {
              const status = statusConfig[barber.status as keyof typeof statusConfig];
              return (
                <tr
                  key={barber.id}
                  className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors"
                >
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-9 w-9 border-2 border-primary/20">
                          <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                            {barber.avatar}
                          </AvatarFallback>
                        </Avatar>
                        {/* Status dot */}
                        <span
                          className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${status.color}`}
                        />
                      </div>
                      <span className="font-medium">{barber.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className="text-sm text-muted-foreground">{barber.shift}</span>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <Badge variant={status.variant} className="text-xs">
                      {status.label}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-right">
                    {barber.nextAvailable ? (
                      <span className="text-sm text-muted-foreground">
                        En {barber.nextAvailable} min
                      </span>
                    ) : (
                      <span className="text-sm text-success font-medium">Ahora</span>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
