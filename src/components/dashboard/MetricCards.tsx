import { DollarSign, Scissors, Users, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { useTodaySales, useYesterdaySales, useActiveBarbers, useLowStockProducts } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";

const DAILY_GOAL = 30;

export function MetricCards() {
  const { data: today, isLoading: loadingToday } = useTodaySales();
  const { data: yesterday } = useYesterdaySales();
  const { data: barbers, isLoading: loadingBarbers } = useActiveBarbers();
  const { data: lowStock, isLoading: loadingStock } = useLowStockProducts();

  const todayRevenue = today?.totalRevenue || 0;
  const yesterdayRevenue = yesterday?.revenue || 0;
  const revenueChange = yesterdayRevenue > 0
    ? Math.round(((todayRevenue - yesterdayRevenue) / yesterdayRevenue) * 100)
    : 0;

  const totalHaircuts = today?.totalHaircuts || 0;
  const haircutPercent = Math.min(Math.round((totalHaircuts / DAILY_GOAL) * 100), 100);

  const activeBarbers = (barbers || []).filter(b => b.active);
  const totalBarbers = (barbers || []).length;

  const lowStockCount = (lowStock || []).length;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {/* Ventas del Día */}
      <div className="stat-card animate-fade-in">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-sm font-medium text-muted-foreground">Ventas del Día</p>
            {loadingToday ? (
              <Skeleton className="h-9 w-24" />
            ) : (
              <>
                <p className="font-display text-3xl tracking-tight">S/ {todayRevenue.toLocaleString()}</p>
                <p className="text-sm font-medium flex items-center gap-1">
                  <span className={revenueChange >= 0 ? "text-success" : "text-destructive"}>
                    {revenueChange >= 0 ? "↑" : "↓"} {Math.abs(revenueChange)}%
                  </span>
                  <span className="text-muted-foreground font-normal">vs ayer</span>
                </p>
              </>
            )}
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
            <p className="text-sm font-medium text-muted-foreground">Servicios Hoy</p>
            {loadingToday ? (
              <Skeleton className="h-9 w-20" />
            ) : (
              <>
                <div className="flex items-baseline gap-2">
                  <p className="font-display text-3xl tracking-tight">{totalHaircuts}</p>
                  <span className="text-sm text-muted-foreground">/ {DAILY_GOAL} meta</span>
                </div>
                <div className="space-y-1">
                  <Progress value={haircutPercent} className="h-2" />
                  <p className="text-xs text-muted-foreground">{haircutPercent}% de la meta diaria</p>
                </div>
              </>
            )}
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
            {loadingBarbers ? (
              <Skeleton className="h-9 w-16" />
            ) : (
              <>
                <p className="font-display text-3xl tracking-tight">{activeBarbers.length}/{totalBarbers}</p>
                <div className="flex -space-x-2">
                  {activeBarbers.slice(0, 5).map((barber) => (
                    <Avatar
                      key={barber.id}
                      className="h-8 w-8 border-2 border-background ring-2 ring-success/50"
                    >
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs font-medium">
                        {barber.full_name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  ))}
                  {activeBarbers.length > 5 && (
                    <div className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center ring-2 ring-muted">
                      <span className="text-xs text-muted-foreground">+{activeBarbers.length - 5}</span>
                    </div>
                  )}
                </div>
              </>
            )}
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
            {loadingStock ? (
              <Skeleton className="h-9 w-12" />
            ) : (
              <>
                <div className="flex items-center gap-2">
                  <p className="font-display text-3xl tracking-tight">{lowStockCount}</p>
                  {lowStockCount > 0 && (
                    <Badge variant="destructive" className="text-xs">¡Alerta!</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {lowStockCount > 0 ? "Requieren reabastecimiento" : "Todo en orden"}
                </p>
              </>
            )}
          </div>
          <div className="rounded-xl p-3 bg-destructive/10 text-destructive">
            <AlertTriangle className="h-6 w-6" />
          </div>
        </div>
      </div>
    </div>
  );
}
