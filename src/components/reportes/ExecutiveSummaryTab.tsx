import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Scissors,
  Package,
  ShoppingCart,
  Clock,
  Download,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Cell,
  Legend,
} from "recharts";

const revenueEvolutionData = [
  { day: "1", ingresos: 1200, ventas: 32 },
  { day: "5", ingresos: 1450, ventas: 38 },
  { day: "10", ingresos: 980, ventas: 28 },
  { day: "15", ingresos: 1680, ventas: 45 },
  { day: "20", ingresos: 1520, ventas: 42 },
  { day: "25", ingresos: 1890, ventas: 52 },
  { day: "30", ingresos: 2100, ventas: 58 },
];

const categoryRevenueData = [
  { category: "Sem 1", servicios: 4200, productos: 1100 },
  { category: "Sem 2", servicios: 4800, productos: 1350 },
  { category: "Sem 3", servicios: 3900, productos: 980 },
  { category: "Sem 4", servicios: 5200, productos: 1420 },
];

const hourlyDistributionData = [
  { hour: "8am", ventas: 5 },
  { hour: "9am", ventas: 12 },
  { hour: "10am", ventas: 25 },
  { hour: "11am", ventas: 38 },
  { hour: "12pm", ventas: 32 },
  { hour: "1pm", ventas: 28 },
  { hour: "2pm", ventas: 35 },
  { hour: "3pm", ventas: 45 },
  { hour: "4pm", ventas: 52 },
  { hour: "5pm", ventas: 48 },
  { hour: "6pm", ventas: 42 },
  { hour: "7pm", ventas: 30 },
  { hour: "8pm", ventas: 15 },
];

const topDays = [
  { fecha: "Sábado 7 Dic", monto: 3250, transacciones: 48 },
  { fecha: "Sábado 30 Nov", monto: 3120, transacciones: 45 },
  { fecha: "Viernes 6 Dic", monto: 2890, transacciones: 42 },
  { fecha: "Sábado 23 Nov", monto: 2780, transacciones: 40 },
  { fecha: "Domingo 1 Dic", monto: 2650, transacciones: 38 },
  { fecha: "Viernes 29 Nov", monto: 2580, transacciones: 37 },
  { fecha: "Sábado 16 Nov", monto: 2520, transacciones: 36 },
  { fecha: "Viernes 22 Nov", monto: 2450, transacciones: 35 },
  { fecha: "Domingo 8 Dic", monto: 2380, transacciones: 34 },
  { fecha: "Sábado 9 Nov", monto: 2320, transacciones: 33 },
];

const topBarbers = [
  { nombre: "Miguel Ángel", ventas: 8450, servicios: 156 },
  { nombre: "Juan Carlos", ventas: 7280, servicios: 142 },
  { nombre: "Pedro Sánchez", ventas: 6120, servicios: 128 },
  { nombre: "Roberto Díaz", ventas: 4890, servicios: 98 },
  { nombre: "Carlos López", ventas: 3650, servicios: 72 },
];

const topServices = [
  { servicio: "Corte Clásico", cantidad: 245, ingresos: 3675 },
  { servicio: "Fade Degradado", cantidad: 198, ingresos: 3960 },
  { servicio: "Corte + Barba", cantidad: 156, ingresos: 3900 },
  { servicio: "Barba Completa", cantidad: 132, ingresos: 1584 },
  { servicio: "Diseño", cantidad: 89, ingresos: 1602 },
  { servicio: "Tratamiento Capilar", cantidad: 67, ingresos: 2010 },
  { servicio: "Coloración", cantidad: 45, ingresos: 1800 },
  { servicio: "Corte Niño", cantidad: 78, ingresos: 936 },
  { servicio: "Afeitado Clásico", cantidad: 56, ingresos: 840 },
  { servicio: "Cejas", cantidad: 42, ingresos: 210 },
];

const topProducts = [
  { producto: "Pomada Premium", cantidad: 45, ingresos: 675 },
  { producto: "Aceite para Barba", cantidad: 38, ingresos: 570 },
  { producto: "Shampoo Anticaspa", cantidad: 32, ingresos: 384 },
  { producto: "Cera Mate", cantidad: 28, ingresos: 336 },
  { producto: "Gel Extra Fuerte", cantidad: 25, ingresos: 200 },
  { producto: "After Shave Classic", cantidad: 22, ingresos: 264 },
  { producto: "Tónico Capilar", cantidad: 18, ingresos: 270 },
  { producto: "Spray Fijador", cantidad: 15, ingresos: 180 },
  { producto: "Peine de Carbono", cantidad: 12, ingresos: 144 },
  { producto: "Navaja de Afeitar", cantidad: 8, ingresos: 200 },
];

const heatmapData = [
  { dia: "Lun", datos: [2, 5, 8, 12, 10, 8, 6, 4, 2, 1, 0, 0] },
  { dia: "Mar", datos: [3, 6, 10, 14, 12, 9, 7, 5, 3, 2, 1, 0] },
  { dia: "Mié", datos: [4, 8, 12, 15, 13, 11, 8, 6, 4, 2, 1, 0] },
  { dia: "Jue", datos: [3, 7, 11, 16, 14, 12, 9, 7, 5, 3, 1, 0] },
  { dia: "Vie", datos: [5, 10, 15, 20, 18, 15, 12, 10, 8, 5, 3, 1] },
  { dia: "Sáb", datos: [8, 15, 22, 28, 25, 22, 18, 15, 12, 8, 4, 2] },
  { dia: "Dom", datos: [6, 12, 18, 22, 20, 16, 12, 8, 4, 2, 0, 0] },
];

const getHeatmapColor = (value: number) => {
  if (value === 0) return "bg-muted";
  if (value <= 5) return "bg-primary/20";
  if (value <= 10) return "bg-primary/40";
  if (value <= 15) return "bg-primary/60";
  if (value <= 20) return "bg-primary/80";
  return "bg-primary";
};

export default function ExecutiveSummaryTab() {
  return (
    <div className="space-y-6">
      {/* KPIs Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Ingresos Totales</p>
              <p className="font-display text-2xl xl:text-3xl">$26,740</p>
              <div className="flex items-center gap-1 text-sm text-success">
                <TrendingUp className="h-4 w-4" />
                <span>+14.5% vs ant.</span>
              </div>
            </div>
            <div className="rounded-xl bg-primary/10 p-2">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total de Ventas</p>
              <p className="font-display text-2xl xl:text-3xl">524</p>
              <p className="text-xs text-muted-foreground">Ticket prom: $51</p>
            </div>
            <div className="rounded-xl bg-secondary/10 p-2">
              <ShoppingCart className="h-5 w-5 text-secondary" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Cortes Realizados</p>
              <p className="font-display text-2xl xl:text-3xl">412</p>
              <div className="space-y-1">
                <Progress value={82} className="h-2" />
                <p className="text-xs text-muted-foreground">Meta: 500</p>
              </div>
            </div>
            <div className="rounded-xl bg-info/10 p-2">
              <Scissors className="h-5 w-5 text-info" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Productos Vendidos</p>
              <p className="font-display text-2xl xl:text-3xl">89</p>
              <p className="text-xs text-muted-foreground">$2,580 en productos</p>
            </div>
            <div className="rounded-xl bg-success/10 p-2">
              <Package className="h-5 w-5 text-success" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Nuevos Clientes</p>
              <p className="font-display text-2xl xl:text-3xl">38</p>
              <div className="flex items-center gap-1 text-sm text-success">
                <TrendingUp className="h-4 w-4" />
                <span>72% retención</span>
              </div>
            </div>
            <div className="rounded-xl bg-warning/10 p-2">
              <Users className="h-5 w-5 text-warning" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tasa Ocupación</p>
              <p className="font-display text-2xl xl:text-3xl">78%</p>
              <div className="flex items-center gap-1 text-sm text-success">
                <TrendingUp className="h-4 w-4" />
                <span>+5% vs ant.</span>
              </div>
            </div>
            <div className="rounded-xl bg-primary/10 p-2">
              <Clock className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Revenue Evolution */}
        <div className="card-elevated p-6">
          <div className="mb-4">
            <h3 className="font-display text-lg">Evolución de Ingresos y Ventas</h3>
            <p className="text-sm text-muted-foreground">Últimos 30 días</p>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueEvolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis 
                  yAxisId="left" 
                  stroke="hsl(var(--primary))" 
                  fontSize={12} 
                  tickFormatter={(v) => `$${v / 1000}k`} 
                />
                <YAxis 
                  yAxisId="right" 
                  orientation="right" 
                  stroke="hsl(var(--secondary))" 
                  fontSize={12} 
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.75rem",
                  }}
                />
                <Legend />
                <Line 
                  yAxisId="left"
                  type="monotone" 
                  dataKey="ingresos" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2} 
                  dot={{ r: 4 }}
                  name="Ingresos ($)" 
                />
                <Line 
                  yAxisId="right"
                  type="monotone" 
                  dataKey="ventas" 
                  stroke="hsl(var(--secondary))" 
                  strokeWidth={2} 
                  dot={{ r: 4 }}
                  name="Ventas (#)" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Revenue */}
        <div className="card-elevated p-6">
          <div className="mb-4">
            <h3 className="font-display text-lg">Ingresos por Categoría</h3>
            <p className="text-sm text-muted-foreground">Servicios vs Productos</p>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryRevenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="category" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.75rem",
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                />
                <Legend />
                <Bar dataKey="servicios" stackId="a" fill="hsl(var(--primary))" name="Servicios" radius={[0, 0, 0, 0]} />
                <Bar dataKey="productos" stackId="a" fill="hsl(var(--secondary))" name="Productos" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Hourly Distribution */}
        <div className="card-elevated p-6">
          <div className="mb-4">
            <h3 className="font-display text-lg">Distribución de Ventas por Hora</h3>
            <p className="text-sm text-muted-foreground">Picos de demanda</p>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={hourlyDistributionData}>
                <defs>
                  <linearGradient id="colorVentas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.75rem",
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="ventas" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2} 
                  fill="url(#colorVentas)" 
                  name="Ventas"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heatmap Calendar */}
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
                {heatmapData.map((row) => (
                  <tr key={row.dia}>
                    <td className="p-1 font-medium">{row.dia}</td>
                    {row.datos.map((val, i) => (
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
        {/* Top Days */}
        <div className="card-elevated p-4">
          <h3 className="font-display text-lg mb-3">Top 10 Días Mayores Ingresos</h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {topDays.map((day, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary">{i + 1}</span>
                  <span className="text-sm">{day.fecha}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${day.monto.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{day.transacciones} trans.</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Barbers */}
        <div className="card-elevated p-4">
          <h3 className="font-display text-lg mb-3">Top 5 Barberos por Ventas</h3>
          <div className="space-y-2">
            {topBarbers.map((barber, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <span className={`font-bold ${i === 0 ? "text-yellow-500" : i === 1 ? "text-gray-400" : i === 2 ? "text-amber-600" : "text-muted-foreground"}`}>
                    {i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : i + 1}
                  </span>
                  <span className="text-sm">{barber.nombre}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${barber.ventas.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{barber.servicios} servicios</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Services */}
        <div className="card-elevated p-4">
          <h3 className="font-display text-lg mb-3">Top 10 Servicios</h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {topServices.map((service, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-primary text-sm">{i + 1}</span>
                  <span className="text-sm truncate max-w-[100px]">{service.servicio}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">${service.ingresos.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{service.cantidad} veces</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Products */}
        <div className="card-elevated p-4">
          <h3 className="font-display text-lg mb-3">Top 10 Productos</h3>
          <div className="space-y-2 max-h-[300px] overflow-y-auto">
            {topProducts.map((product, i) => (
              <div key={i} className="flex items-center justify-between p-2 rounded-lg bg-muted/50">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-secondary text-sm">{i + 1}</span>
                  <span className="text-sm truncate max-w-[100px]">{product.producto}</span>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-sm">${product.ingresos.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{product.cantidad} uds</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Export Button */}
      <div className="flex justify-end">
        <Button className="gap-2">
          <FileText className="h-4 w-4" />
          Exportar Reporte Ejecutivo PDF
        </Button>
      </div>
    </div>
  );
}
