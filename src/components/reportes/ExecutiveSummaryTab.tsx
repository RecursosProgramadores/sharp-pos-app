import {
  TrendingUp,
  DollarSign,
  Users,
  Scissors,
  Package,
  ShoppingCart,
  Clock,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Skeleton } from "@/components/ui/skeleton";
import { useExecutiveSummary } from "@/hooks/useReportData";

const getHeatmapColor = (value: number) => {
  if (value === 0) return "bg-muted";
  if (value <= 2) return "bg-primary/20";
  if (value <= 5) return "bg-primary/40";
  if (value <= 8) return "bg-primary/60";
  if (value <= 12) return "bg-primary/80";
  return "bg-primary";
};

export default function ExecutiveSummaryTab({ period }: { period: string }) {
  const { data, isLoading } = useExecutiveSummary(period);

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-[340px]" />
          <Skeleton className="h-[340px]" />
        </div>
      </div>
    );
  }

  const revChange = data.prevRevenue > 0
    ? (((data.totalRevenue - data.prevRevenue) / data.prevRevenue) * 100).toFixed(1)
    : "0";

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Ingresos Totales</p>
              <p className="font-display text-2xl xl:text-3xl">S/ {data.totalRevenue.toLocaleString()}</p>
              <div className={`flex items-center gap-1 text-sm ${Number(revChange) >= 0 ? "text-success" : "text-destructive"}`}>
                <TrendingUp className="h-4 w-4" />
                <span>{Number(revChange) >= 0 ? "+" : ""}{revChange}% vs ant.</span>
              </div>
            </div>
            <div className="rounded-xl bg-primary/10 p-2"><DollarSign className="h-5 w-5 text-primary" /></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total de Ventas</p>
              <p className="font-display text-2xl xl:text-3xl">{data.totalSales}</p>
              <p className="text-xs text-muted-foreground">Ticket prom: S/ {data.avgTicket.toFixed(0)}</p>
            </div>
            <div className="rounded-xl bg-secondary/10 p-2"><ShoppingCart className="h-5 w-5 text-secondary" /></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Servicios Realizados</p>
              <p className="font-display text-2xl xl:text-3xl">{data.totalHaircuts}</p>
              <div className="space-y-1">
                <Progress value={Math.min((data.totalHaircuts / 100) * 100, 100)} className="h-2" />
                <p className="text-xs text-muted-foreground">S/ {data.serviceRevenue.toLocaleString()} en servicios</p>
              </div>
            </div>
            <div className="rounded-xl bg-info/10 p-2"><Scissors className="h-5 w-5 text-info" /></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Productos Vendidos</p>
              <p className="font-display text-2xl xl:text-3xl">{data.productsCount}</p>
              <p className="text-xs text-muted-foreground">S/ {data.productRevenue.toLocaleString()} en productos</p>
            </div>
            <div className="rounded-xl bg-success/10 p-2"><Package className="h-5 w-5 text-success" /></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Nuevos Clientes</p>
              <p className="font-display text-2xl xl:text-3xl">{data.newClients}</p>
              <p className="text-xs text-muted-foreground">En el período</p>
            </div>
            <div className="rounded-xl bg-warning/10 p-2"><Users className="h-5 w-5 text-warning" /></div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Barberos Activos</p>
              <p className="font-display text-2xl xl:text-3xl">{data.barbers.length}</p>
              <p className="text-xs text-muted-foreground">{data.lowStockProducts.length} alertas stock</p>
            </div>
            <div className="rounded-xl bg-primary/10 p-2"><Clock className="h-5 w-5 text-primary" /></div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-elevated p-6">
          <div className="mb-4">
            <h3 className="font-display text-lg">Evolución de Ingresos y Ventas</h3>
            <p className="text-sm text-muted-foreground">Período actual</p>
          </div>
          <div className="h-[280px]">
            {data.revenueEvolution.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={data.revenueEvolution}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis yAxisId="left" stroke="hsl(var(--primary))" fontSize={12} tickFormatter={(v) => `S/${v}`} />
                  <YAxis yAxisId="right" orientation="right" stroke="hsl(var(--secondary))" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem" }} />
                  <Legend />
                  <Line yAxisId="left" type="monotone" dataKey="ingresos" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ r: 4 }} name="Ingresos (S/)" />
                  <Line yAxisId="right" type="monotone" dataKey="ventas" stroke="hsl(var(--secondary))" strokeWidth={2} dot={{ r: 4 }} name="Ventas (#)" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">Sin datos en este período</div>
            )}
          </div>
        </div>

        <div className="card-elevated p-6">
          <div className="mb-4">
            <h3 className="font-display text-lg">Ingresos por Categoría</h3>
            <p className="text-sm text-muted-foreground">Servicios vs Productos</p>
          </div>
          <div className="h-[280px]">
            {data.categoryRevenue.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.categoryRevenue}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `S/${v}`} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem" }} />
                  <Legend />
                  <Bar dataKey="servicios" stackId="a" fill="hsl(var(--primary))" name="Servicios" />
                  <Bar dataKey="productos" stackId="a" fill="hsl(var(--secondary))" name="Productos" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex items-center justify-center h-full text-muted-foreground">Sin datos</div>
            )}
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-elevated p-6">
          <div className="mb-4">
            <h3 className="font-display text-lg">Distribución de Ventas por Hora</h3>
            <p className="text-sm text-muted-foreground">Picos de demanda</p>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.hourlyData}>
                <defs>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem" }} />
                <Area type="monotone" dataKey="ventas" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#colorVentas)" name="Ventas" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-elevated p-6">
          <div className="mb-4">
            <h3 className="font-display text-lg">Días de Mayor Actividad</h3>
            <p className="text-sm text-muted-foreground">Intensidad por día y hora</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr>
                  <th className="text-left p-1 text-muted-foreground">Día</th>
                  {["8a", "9a", "10a", "11a", "12p", "1p", "2p", "3p", "4p", "5p", "6p", "7p"].map((h) => (
                    <th key={h} className="p-1 text-muted-foreground font-normal">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {data.heatmap.map((row) => (
                  <tr key={row.dia}>
                    <td className="p-1 font-medium">{row.dia}</td>
                    {row.datos.map((val: number, i: number) => (
                      <td key={i} className="p-0.5">
                        <div className={`w-6 h-6 rounded ${getHeatmapColor(val)} flex items-center justify-center text-[10px]`}>
                          {val > 0 && val}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
            <span>Menos</span>
            <div className="flex gap-1">
              <div className="w-4 h-4 rounded bg-muted" />
              <div className="w-4 h-4 rounded bg-primary/20" />
              <div className="w-4 h-4 rounded bg-primary/40" />
              <div className="w-4 h-4 rounded bg-primary/60" />
              <div className="w-4 h-4 rounded bg-primary/80" />
              <div className="w-4 h-4 rounded bg-primary" />
            </div>
            <span>Más</span>
          </div>
        </div>
      </div>

      {/* Rankings */}
      <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-4">
        <div className="card-elevated p-4">
          <h3 className="font-display text-lg mb-3">Top Días Mayores Ingresos</h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {data.topDays.length === 0 && <p className="text-sm text-muted-foreground">Sin datos</p>}
            {data.topDays.map((day, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary">{i + 1}</span>
                  <span className="text-sm capitalize">{day.fecha}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">S/ {day.monto.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{day.transacciones} trans.</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-elevated p-4">
          <h3 className="font-display text-lg mb-3">Top Barberos por Ventas</h3>
          <div className="space-y-2">
            {data.topBarbers.length === 0 && <p className="text-sm text-muted-foreground">Sin datos</p>}
            {data.topBarbers.map((barber, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-muted-foreground"}`}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                  </span>
                  <span className="text-sm">{barber.nombre}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">S/ {barber.ventas.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{barber.servicios} servicios</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-elevated p-4">
          <h3 className="font-display text-lg mb-3">Top Servicios</h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {data.topServices.length === 0 && <p className="text-sm text-muted-foreground">Sin datos</p>}
            {data.topServices.map((service, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary text-sm">{i + 1}</span>
                  <span className="text-sm truncate max-w-[100px]">{service.servicio}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">S/ {service.ingresos.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{service.cantidad} veces</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-elevated p-4">
          <h3 className="font-display text-lg mb-3">Top Productos</h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {data.topProducts.length === 0 && <p className="text-sm text-muted-foreground">Sin datos</p>}
            {data.topProducts.map((product, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-secondary text-sm">{i + 1}</span>
                  <span className="text-sm truncate max-w-[100px]">{product.producto}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">S/ {product.ingresos.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{product.cantidad} uds</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
