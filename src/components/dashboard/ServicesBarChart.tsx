import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { useTopServices } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";

export function ServicesBarChart() {
  const { data, isLoading } = useTopServices();

  return (
    <div className="card-elevated p-6 animate-fade-in">
      <div className="mb-6">
        <h3 className="font-display text-xl">Top Servicios Más Solicitados</h3>
        <p className="text-sm text-muted-foreground">Últimos 30 días</p>
      </div>
      <div className="h-[300px]">
        {isLoading ? (
          <Skeleton className="h-full w-full rounded-xl" />
        ) : !data?.length ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Sin datos de servicios aún
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical" margin={{ left: 20, right: 20 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal vertical={false} />
              <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} width={120} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                formatter={(value: number) => [`${value} servicios`, "Cantidad"]}
                cursor={{ fill: "hsl(var(--muted))", opacity: 0.3 }}
              />
              <Bar dataKey="cantidad" radius={[0, 6, 6, 0]} barSize={24} fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
