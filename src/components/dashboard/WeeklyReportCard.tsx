import {
  TrendingUp,
  TrendingDown,
  Minus,
  Scissors,
  Users,
  DollarSign,
  BarChart3,
  Trophy,
  FileText,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useWeeklyReport } from "@/hooks/useWeeklyReport";
import { cn } from "@/lib/utils";

function TrendBadge({ value }: { value: number }) {
  if (value === 0)
    return (
      <Badge variant="secondary" className="text-xs gap-1">
        <Minus className="h-3 w-3" /> 0%
      </Badge>
    );
  if (value > 0)
    return (
      <Badge variant="success" className="text-xs gap-1">
        <TrendingUp className="h-3 w-3" /> +{value}%
      </Badge>
    );
  return (
    <Badge variant="destructive" className="text-xs gap-1">
      <TrendingDown className="h-3 w-3" /> {value}%
    </Badge>
  );
}

export function WeeklyReportCard() {
  const { data: report, isLoading } = useWeeklyReport();

  if (isLoading) {
    return (
      <div className="card-elevated p-6 animate-fade-in">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-12 w-full rounded-lg" />
          ))}
        </div>
      </div>
    );
  }

  if (!report) return null;

  const { currentWeek: cw } = report;

  return (
    <div className="card-elevated p-6 animate-fade-in">
      {/* Header */}
      <div className="mb-5 flex items-center justify-between">
        <div>
          <h3 className="font-display text-xl flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Reporte Semanal
          </h3>
          <p className="text-sm text-muted-foreground">
            {cw.start} — {cw.end}
          </p>
        </div>
      </div>

      {/* KPI Grid */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="rounded-lg bg-muted/40 p-3 text-center">
          <DollarSign className="h-4 w-4 text-primary mx-auto mb-1" />
          <p className="text-lg font-bold">S/ {cw.totalRevenue.toLocaleString()}</p>
          <p className="text-[10px] text-muted-foreground">Ingresos</p>
          <div className="mt-1">
            <TrendBadge value={report.revenueChange} />
          </div>
        </div>
        <div className="rounded-lg bg-muted/40 p-3 text-center">
          <Scissors className="h-4 w-4 text-primary mx-auto mb-1" />
          <p className="text-lg font-bold">{cw.totalHaircuts}</p>
          <p className="text-[10px] text-muted-foreground">Servicios</p>
          <div className="mt-1">
            <TrendBadge value={report.haircutsChange} />
          </div>
        </div>
        <div className="rounded-lg bg-muted/40 p-3 text-center">
          <Users className="h-4 w-4 text-primary mx-auto mb-1" />
          <p className="text-lg font-bold">{cw.newClients}</p>
          <p className="text-[10px] text-muted-foreground">Nuevos Clientes</p>
          <div className="mt-1">
            <TrendBadge value={report.clientsChange} />
          </div>
        </div>
      </div>

      {/* Revenue by day mini bar */}
      <div className="mb-5">
        <p className="text-xs font-medium text-muted-foreground mb-2">Ingresos por día</p>
        <div className="flex items-end gap-1 h-16">
          {cw.revenueByDay.map((d, i) => {
            const max = Math.max(...cw.revenueByDay.map(x => x.amount), 1);
            const height = Math.max((d.amount / max) * 100, 4);
            return (
              <div key={i} className="flex-1 flex flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-primary/80 hover:bg-primary transition-colors min-h-[2px]"
                  style={{ height: `${height}%` }}
                  title={`S/ ${d.amount}`}
                />
                <span className="text-[9px] text-muted-foreground">{d.day}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Services */}
      {cw.topServices.length > 0 && (
        <div className="mb-4">
          <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
            <Trophy className="h-3 w-3" /> Top Servicios
          </p>
          <div className="space-y-1.5">
            {cw.topServices.slice(0, 3).map((s, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="truncate">{s.name}</span>
                <Badge variant="secondary" className="text-xs shrink-0 ml-2">
                  {s.count}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Barbers */}
      {cw.topBarbers.length > 0 && (
        <div>
          <p className="text-xs font-medium text-muted-foreground mb-2 flex items-center gap-1">
            <BarChart3 className="h-3 w-3" /> Top Barberos
          </p>
          <div className="space-y-1.5">
            {cw.topBarbers.slice(0, 3).map((b, i) => (
              <div key={i} className="flex items-center justify-between text-sm">
                <span className="truncate">{b.name}</span>
                <span className="text-xs text-primary font-semibold shrink-0 ml-2">
                  S/ {b.revenue.toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Ticket promedio */}
      <div className="mt-4 pt-4 border-t border-border flex items-center justify-between text-sm">
        <span className="text-muted-foreground">Ticket promedio</span>
        <span className="font-bold text-primary">S/ {cw.avgTicket}</span>
      </div>
    </div>
  );
}
