import { AlertTriangle, CheckCircle2, Calendar, DollarSign, Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const alerts = [
  {
    id: 1,
    type: "warning",
    icon: AlertTriangle,
    message: "Stock bajo: Pomada Premium (quedan 2 unidades)",
    time: "Hace 10 min",
    action: "Reabastecer",
    iconBg: "bg-warning/10",
    iconColor: "text-warning",
  },
  {
    id: 2,
    type: "success",
    icon: CheckCircle2,
    message: "Juan Pérez completó 10 cortes hoy",
    time: "Hace 1 hora",
    action: null,
    iconBg: "bg-success/10",
    iconColor: "text-success",
  },
  {
    id: 3,
    type: "info",
    icon: Calendar,
    message: "Recordatorio: Inventario semanal programado para mañana",
    time: "Hace 2 horas",
    action: null,
    iconBg: "bg-info/10",
    iconColor: "text-info",
  },
  {
    id: 4,
    type: "money",
    icon: DollarSign,
    message: "Venta destacada: $150 en productos - Cliente VIP",
    time: "Hace 3 horas",
    action: null,
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
  {
    id: 5,
    type: "notification",
    icon: Bell,
    message: "Nueva reseña 5⭐ de cliente Mario González",
    time: "Hace 5 horas",
    action: null,
    iconBg: "bg-secondary/10",
    iconColor: "text-secondary",
  },
];

export function AlertsTimeline() {
  return (
    <div className="card-elevated p-6 animate-fade-in">
      <div className="mb-6">
        <h3 className="font-display text-xl">Alertas y Notificaciones</h3>
        <p className="text-sm text-muted-foreground">Actividad reciente</p>
      </div>
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
        
        <div className="space-y-4">
          {alerts.map((alert, index) => {
            const Icon = alert.icon;
            return (
              <div
                key={alert.id}
                className={cn(
                  "relative flex items-start gap-4 pl-12",
                  "animate-fade-in"
                )}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Icon circle */}
                <div
                  className={cn(
                    "absolute left-0 w-10 h-10 rounded-full flex items-center justify-center z-10",
                    alert.iconBg
                  )}
                >
                  <Icon className={cn("h-5 w-5", alert.iconColor)} />
                </div>
                
                {/* Content */}
                <div className="flex-1 min-w-0 bg-muted/30 rounded-lg p-3 hover:bg-muted/50 transition-colors">
                  <p className="text-sm font-medium leading-relaxed">{alert.message}</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-muted-foreground">{alert.time}</span>
                    {alert.action && (
                      <Button size="sm" variant="outline" className="h-7 text-xs">
                        {alert.action}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
