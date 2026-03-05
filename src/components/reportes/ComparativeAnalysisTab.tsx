import {
  TrendingUp,
  TrendingDown,
  Trophy,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { useComparativeAnalysis } from "@/hooks/useReportData";

export default function ComparativeAnalysisTab({ period }: { period: string }) {
  const { data, isLoading } = useComparativeAnalysis(period);

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[360px]" />
        <Skeleton className="h-[300px]" />
      </div>
    );
  }

  const getDiff = (current: number, previous: number) => {
    if (previous === 0) return { diff: current, pct: "N/A", positive: current >= 0 };
    const diff = current - previous;
    const pct = ((diff / previous) * 100).toFixed(1);
    return { diff, pct, positive: diff >= 0 };
  };

  return (
    <div className="space-y-6">
      {/* Period Comparison Chart */}
      <div className="card-elevated p-6">
        <div className="mb-4">
          <h3 className="font-display text-lg">Comparación de Ventas Diarias</h3>
          <p className="text-sm text-muted-foreground">Período anterior vs actual</p>
        </div>
        <div className="h-[300px]">
          {data.periodComparison.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.periodComparison}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `S/${v}`} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem" }} formatter={(value: number) => [`S/ ${value.toLocaleString()}`, ""]} />
                <Legend />
                <Line type="monotone" dataKey="periodo1" stroke="hsl(var(--muted-foreground))" strokeWidth={2} strokeDasharray="5 5" name="Período Anterior" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="periodo2" stroke="hsl(var(--primary))" strokeWidth={2} name="Período Actual" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          ) : <div className="flex items-center justify-center h-full text-muted-foreground">Sin datos para comparar</div>}
        </div>
      </div>

      {/* Metrics Table */}
      <div className="card-elevated p-6">
        <h3 className="font-display text-xl mb-4">Comparativa de Métricas Clave</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[200px]">Métrica</TableHead>
                <TableHead className="text-right">Período Anterior</TableHead>
                <TableHead className="text-right">Período Actual</TableHead>
                <TableHead className="text-right">Diferencia</TableHead>
                <TableHead className="text-right">Variación %</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.metricsComparison.map((metric) => {
                const d = getDiff(metric.periodo2, metric.periodo1);
                return (
                  <TableRow key={metric.metrica}>
                    <TableCell className="font-medium">{metric.metrica}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {metric.unidad === "$" ? `S/ ${metric.periodo1.toLocaleString()}` : metric.unidad === "%" ? `${metric.periodo1}%` : metric.periodo1.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {metric.unidad === "$" ? `S/ ${metric.periodo2.toLocaleString()}` : metric.unidad === "%" ? `${metric.periodo2}%` : metric.periodo2.toLocaleString()}
                    </TableCell>
                    <TableCell className={`text-right ${d.positive ? "text-success" : "text-destructive"}`}>
                      {d.positive ? "+" : ""}{metric.unidad === "$" ? `S/ ${d.diff.toLocaleString()}` : d.diff.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <Badge variant={d.positive ? "default" : "destructive"} className={d.positive ? "bg-success" : ""}>
                        <span className="flex items-center gap-1">
                          {d.positive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                          {d.positive ? "+" : ""}{d.pct}%
                        </span>
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Barber Comparison */}
      <div className="card-elevated p-6">
        <h3 className="font-display text-xl mb-4">Comparación de Barberos</h3>
        {data.barberComparison.length > 0 ? (
          <>
            <div className="overflow-x-auto mb-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Barbero</TableHead>
                    <TableHead className="text-right">Servicios</TableHead>
                    <TableHead className="text-right">Ingresos</TableHead>
                    <TableHead className="text-right">Prom/Servicio</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.barberComparison.map((barber, i) => (
                    <TableRow key={barber.barbero}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {i === 0 && <Trophy className="h-4 w-4 text-yellow-500" />}
                          {barber.barbero}
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{barber.cortes}</TableCell>
                      <TableCell className="text-right">S/ {barber.ingresos.toLocaleString()}</TableCell>
                      <TableCell className="text-right">S/ {barber.promedio.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Radar Charts */}
            {data.radarData1.length > 0 && data.radarData2.length > 0 && (
              <div className="grid gap-6 lg:grid-cols-2">
                <div>
                  <h4 className="font-medium mb-2 text-center">{data.barber1Name}</h4>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={data.radarData1}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <PolarRadiusAxis stroke="hsl(var(--border))" fontSize={10} />
                        <Radar name={data.barber1Name} dataKey="A" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium mb-2 text-center">{data.barber2Name}</h4>
                  <div className="h-[250px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <RadarChart data={data.radarData2}>
                        <PolarGrid stroke="hsl(var(--border))" />
                        <PolarAngleAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                        <PolarRadiusAxis stroke="hsl(var(--border))" fontSize={10} />
                        <Radar name={data.barber2Name} dataKey="A" stroke="hsl(var(--secondary))" fill="hsl(var(--secondary))" fillOpacity={0.3} />
                      </RadarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : <p className="text-muted-foreground">Sin datos de barberos en este período</p>}
      </div>

      {/* Revenue Summary */}
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="card-elevated p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">Ingresos Período Anterior</p>
          <p className="font-display text-3xl text-muted-foreground">S/ {data.prevRevenue.toLocaleString()}</p>
        </div>
        <div className="card-elevated p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">Ingresos Período Actual</p>
          <p className="font-display text-3xl text-primary">S/ {data.currRevenue.toLocaleString()}</p>
          {data.prevRevenue > 0 && (
            <p className={`text-sm mt-2 ${data.currRevenue >= data.prevRevenue ? "text-success" : "text-destructive"}`}>
              {data.currRevenue >= data.prevRevenue ? "+" : ""}{(((data.currRevenue - data.prevRevenue) / data.prevRevenue) * 100).toFixed(1)}% vs anterior
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
