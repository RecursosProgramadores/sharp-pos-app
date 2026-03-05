import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { useActiveBarbers } from "@/hooks/useDashboardData";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

export function BarberSchedule() {
  const { data: barbers, isLoading: loadingBarbers } = useActiveBarbers();

  const today = new Date().getDay(); // 0=Sun

  const { data: schedules } = useQuery({
    queryKey: ["dashboard-barber-schedules", today],
    queryFn: async () => {
      const { data } = await supabase
        .from("barber_schedules")
        .select("barber_id, start_time, end_time")
        .eq("day_of_week", today);
      return data || [];
    },
  });

  const activeBarbers = (barbers || []).filter(b => b.active);

  const scheduleMap = Object.fromEntries(
    (schedules || []).map(s => [s.barber_id, s])
  );

  return (
    <div className="card-elevated p-6 animate-fade-in">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl">Horario de Barberos Hoy</h3>
          <p className="text-sm text-muted-foreground">Estado actual del equipo</p>
        </div>
        <Clock className="h-5 w-5 text-muted-foreground" />
      </div>

      {loadingBarbers ? (
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-12 w-full rounded-lg" />)}
        </div>
      ) : !activeBarbers.length ? (
        <div className="py-8 text-center text-muted-foreground">No hay barberos activos</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Barbero</th>
                <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Turno</th>
                <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Estado</th>
              </tr>
            </thead>
            <tbody>
              {activeBarbers.map((barber) => {
                const schedule = scheduleMap[barber.id];
                const hasSchedule = !!schedule;
                const initials = barber.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();

                return (
                  <tr key={barber.id} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-2">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <Avatar className="h-9 w-9 border-2 border-primary/20">
                            <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                              {initials}
                            </AvatarFallback>
                          </Avatar>
                          <span className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${hasSchedule ? "bg-success" : "bg-muted-foreground"}`} />
                        </div>
                        <span className="font-medium">{barber.full_name}</span>
                      </div>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <span className="text-sm text-muted-foreground">
                        {hasSchedule ? `${schedule.start_time.slice(0, 5)} - ${schedule.end_time.slice(0, 5)}` : "Sin turno"}
                      </span>
                    </td>
                    <td className="py-3 px-2 text-center">
                      <Badge variant={hasSchedule ? "success" : "muted"} className="text-xs">
                        {hasSchedule ? "Programado" : "Libre"}
                      </Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
