import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

const sales = [
  {
    id: 1,
    client: "Carlos Mendoza",
    service: "Corte + Barba",
    amount: 45,
    barber: "Miguel",
    time: "Hace 15 min",
  },
  {
    id: 2,
    client: "Roberto García",
    service: "Fade Degradado",
    amount: 35,
    barber: "Juan",
    time: "Hace 32 min",
  },
  {
    id: 3,
    client: "Luis Pérez",
    service: "Corte Clásico",
    amount: 25,
    barber: "Pedro",
    time: "Hace 1 hora",
  },
  {
    id: 4,
    client: "Fernando López",
    service: "Barba Completa",
    amount: 20,
    barber: "Miguel",
    time: "Hace 1 hora",
  },
  {
    id: 5,
    client: "Diego Ramírez",
    service: "Afeitado Tradicional",
    amount: 15,
    barber: "Juan",
    time: "Hace 2 horas",
  },
];

export function RecentSales() {
  return (
    <div className="card-elevated p-6 animate-fade-in">
      <div className="mb-6">
        <h3 className="font-display text-xl">Ventas Recientes</h3>
        <p className="text-sm text-muted-foreground">Últimas transacciones</p>
      </div>
      <div className="space-y-4">
        {sales.map((sale) => (
          <div
            key={sale.id}
            className="flex items-center gap-4 p-3 rounded-lg hover:bg-muted/50 transition-colors"
          >
            <Avatar className="h-10 w-10 border-2 border-primary/20">
              <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                {sale.client
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{sale.client}</p>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{sale.service}</span>
                <span>•</span>
                <span>{sale.barber}</span>
              </div>
            </div>
            <div className="text-right">
              <p className="font-display text-lg">${sale.amount}</p>
              <p className="text-xs text-muted-foreground">{sale.time}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
