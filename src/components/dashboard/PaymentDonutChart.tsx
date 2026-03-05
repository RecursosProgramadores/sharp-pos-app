import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";
import { usePaymentDistribution } from "@/hooks/useDashboardData";
import { Skeleton } from "@/components/ui/skeleton";

const renderLegend = (props: any) => {
  const { payload } = props;
  return (
    <ul className="flex flex-wrap justify-center gap-4 mt-4">
      {payload.map((entry: any, index: number) => (
        <li key={`legend-${index}`} className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full" style={{ backgroundColor: entry.color }} />
          <span className="text-sm text-muted-foreground">
            {entry.value} ({entry.payload?.value || 0}%)
          </span>
        </li>
      ))}
    </ul>
  );
};

export function PaymentDonutChart() {
  const { data, isLoading } = usePaymentDistribution();

  return (
    <div className="card-elevated p-6 animate-fade-in">
      <div className="mb-4">
        <h3 className="font-display text-xl">Distribución de Métodos de Pago</h3>
        <p className="text-sm text-muted-foreground">Últimos 30 días</p>
      </div>
      <div className="h-[280px]">
        {isLoading ? (
          <Skeleton className="h-full w-full rounded-xl" />
        ) : !data?.length ? (
          <div className="h-full flex items-center justify-center text-muted-foreground">
            Sin datos de pagos aún
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={data} cx="50%" cy="45%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value" stroke="none">
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem", boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
                formatter={(value: number, name: string) => [`${value}%`, name]}
              />
              <Legend content={renderLegend} />
            </PieChart>
          </ResponsiveContainer>
        )}
      </div>
    </div>
  );
}
