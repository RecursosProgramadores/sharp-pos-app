import { DollarSign, Scissors, Users, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const activeBarbers = [
  { name: "Miguel", initials: "MA" },
  { name: "Juan", initials: "JC" },
  { name: "Pedro", initials: "PS" },
  { name: "Roberto", initials: "RD" },
  { name: "Luis", initials: "LG" },
];

export function MetricCards() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Ventas del Día */}
      <div className="stat-card animate-fade-in">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Ventas del Día</p>
            <p className="font-display text-3xl tracking-tight">$2,450</p>
            <p className="text-sm font-medium flex items-center gap-1 text-success">
              <span>↑</span>
              <span>15%</span>
              <span className="text-muted-foreground font-normal">vs ayer</span>
            </p>
          </div>
          <div className="rounded-xl p-3 bg-primary/10 text-primary">
            <DollarSign className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Cortes Realizados Hoy */}
      <div className="stat-card animate-fade-in" style={{ animationDelay: "0.1s" }}>
        <div className="flex items-start justify-between">
          <div className="space-y-2 flex-1">
            <p className="text-sm font-medium text-muted-foreground">Cortes Realizados Hoy</p>
            <div className="flex items-baseline gap-2">
              <p className="font-display text-3xl tracking-tight">28</p>
              <span className="text-sm text-muted-foreground">/ 30 meta</span>
            </div>
            <div className="space-y-1">
              <Progress value={93} className="h-2" />
              <p className="text-xs text-muted-foreground">93% de la meta diaria</p>
            </div>
          </div>
          <div className="rounded-xl p-3 bg-secondary/10 text-secondary">
            <Scissors className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Barberos Activos */}
      <div className="stat-card animate-fade-in" style={{ animationDelay: "0.2s" }}>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Barberos Activos</p>
            <p className="font-display text-3xl tracking-tight">5/6</p>
            <div className="flex -space-x-2">
              {activeBarbers.map((barber, index) => (
                <Avatar
                  key={barber.name}
                  className={cn(
                    "h-8 w-8 border-2 border-background",
                    index < 5 ? "ring-2 ring-success/50" : "ring-2 ring-muted"
                  )}
                >
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                    {barber.initials}
                  </AvatarFallback>
                </Avatar>
              ))}
              <div className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center ring-2 ring-muted">
                <span className="text-xs text-muted-foreground">+1</span>
              </div>
            </div>
          </div>
          <div className="rounded-xl p-3 bg-success/10 text-success">
            <Users className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Productos Bajo Stock */}
      <div className="stat-card animate-fade-in" style={{ animationDelay: "0.3s" }}>
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Productos Bajo Stock</p>
            <div className="flex items-center gap-2">
              <p className="font-display text-3xl tracking-tight">3</p>
              <Badge variant="destructive" className="text-xs">
                ¡Alerta!
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Requieren reabastecimiento
            </p>
          </div>
          <div className="rounded-xl p-3 bg-destructive/10 text-destructive">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
