import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Trophy, Medal } from "lucide-react";
import { cn } from "@/lib/utils";
import { useBarberRanking } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";

const getMedalIcon = (position: number) => {
  switch (position) {
    case 1: return <Trophy className="h-5 w-5 text-yellow-500" />;
    case 2: return <Medal className="h-5 w-5 text-gray-400" />;
    case 3: return <Medal className="h-5 w-5 text-amber-600" />;
    default: return <span className="font-display text-lg text-muted-foreground">{position}</span>;
  }
};

export function BarberRanking() {
  const { data: barbers, isLoading } = useBarberRanking();

  return (
    <div className="card-elevated p-6 animate-fade-in">
      <div className="mb-6">
        <h3 className="font-display text-xl">Barberos Más Productivos</h3>
        <p className="text-sm text-muted-foreground">Ranking últimos 30 días</p>
      </div>
      {isLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-14 w-full rounded-lg" />)}
        </div>
      ) : !barbers?.length ? (
        <div className="py-8 text-center text-muted-foreground">Sin datos de barberos aún</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">#</th>
                <th className="text-left py-3 px-2 text-sm font-medium text-muted-foreground">Barbero</th>
                <th className="text-center py-3 px-2 text-sm font-medium text-muted-foreground">Cortes</th>
                <th className="text-right py-3 px-2 text-sm font-medium text-muted-foreground">Ingresos</th>
              </tr>
            </thead>
            <tbody>
              {barbers.map((barber) => (
                <tr key={barber.id} className={cn("border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors", barber.position <= 3 && "bg-muted/20")}>
                  <td className="py-3 px-2 w-12">
                    <div className="flex items-center justify-center w-8 h-8">
                      {getMedalIcon(barber.position)}
                    </div>
                  </td>
                  <td className="py-3 px-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border-2 border-primary/20">
                        <AvatarFallback className="bg-primary text-primary-foreground text-sm font-medium">
                          {barber.avatar}
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium truncate max-w-[150px]">{barber.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-2 text-center">
                    <span className="font-display text-lg">{barber.cuts}</span>
                  </td>
                  <td className="py-3 px-2 text-right">
                    <span className="font-display text-lg text-success">S/ {barber.revenue.toLocaleString()}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
