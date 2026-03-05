import { AlertTriangle, CheckCircle2, Calendar, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useLowStockProducts, useTodaySales } from "@/hooks/useDashboardData";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { startOfDay } from "date-fns";

export function AlertsTimeline() {
  const { data: lowStock } = useLowStockProducts();
  const { data: todaySales } = useTodaySales();

  const { data: todayReservations } = useQuery({
    queryKey: ["dashboard-today-reservations"],
    queryFn: async () => {
      const today = new Date().toISOString().split("T")[0];
      const { data } = await supabase
        .from("reservations")
        .select("id")
        .eq("reservation_date", today)
        .eq("status", "pending");
      return data?.length || 0;
    },
  });

  // Build dynamic alerts
  const alerts: { type: string; icon: any; message: string; iconBg: string; iconColor: string }[] = [];

  if (lowStock && lowStock.length > 0) {
    for (const p of lowStock.slice(0, 3)) {
      alerts.push({
        type: "warning",
        icon: AlertTriangle,
        message: `Stock bajo: ${p.name} (quedan ${p.stock} unidades)`,
        iconBg: "bg-warning/10",
        iconColor: "text-warning",
      });
    }
  }

  if (todayReservations && todayReservations > 0) {
    alerts.push({
      type: "info",
      icon: Calendar,
      message: `${todayReservations} reserva(s) pendiente(s) para hoy`,
      iconBg: "bg-info/10",
      iconColor: "text-info",
    });
  }

  if (todaySales && todaySales.totalHaircuts > 0) {
    alerts.push({
      type: "success",
      icon: CheckCircle2,
      message: `${todaySales.totalHaircuts} servicios realizados hoy — S/ ${todaySales.totalRevenue.toLocaleString()}`,
      iconBg: "bg-success/10",
      iconColor: "text-success",
    });
  }

  if (alerts.length === 0) {
    alerts.push({
      type: "info",
      icon: Package,
      message: "No hay alertas por el momento. ¡Todo en orden!",
      iconBg: "bg-muted/50",
      iconColor: "text-muted-foreground",
    });
  }

  return (
    <div className="card-elevated p-6 animate-fade-in">
      <div className="mb-6">
        <h3 className="font-display text-xl">Alertas y Notificaciones</h3>
        <p className="text-sm text-muted-foreground">Estado actual del negocio</p>
      </div>
      <div className="relative">
        <div className="absolute left-5 top-0 bottom-0 w-px bg-border" />
        <div className="space-y-4">
          {alerts.map((alert, index) => {
            const Icon = alert.icon;
            return (
              <div key={index} className="relative flex items-start gap-4 pl-12 animate-fade-in" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className={cn("absolute left-0 w-10 h-10 rounded-full flex items-center justify-center z-10", alert.iconBg)}>
                  <Icon className={cn("h-5 w-5", alert.iconColor)} />
                </div>
                <div className="flex-1 min-w-0 bg-muted/30 rounded-lg p-3 hover:bg-muted/50 transition-colors">
                  <p className="text-sm font-medium leading-relaxed">{alert.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
