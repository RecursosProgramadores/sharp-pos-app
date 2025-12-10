import { useState } from "react";
import { Download, TrendingUp, Star, Scissors, DollarSign, Trophy, Clock, Flame, ChartLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";
import { cn } from "@/lib/utils";

const barbers = [
  { id: 0, name: "Todos los barberos", avatar: "TB" },
  { id: 1, name: "Miguel Ángel", avatar: "MA" },
  { id: 2, name: "Juan Carlos", avatar: "JC" },
  { id: 3, name: "Pedro Sánchez", avatar: "PS" },
  { id: 4, name: "Roberto Díaz", avatar: "RD" },
];

const evolutionData = [
  { name: "Sem 1", cortes: 32 },
  { name: "Sem 2", cortes: 45 },
  { name: "Sem 3", cortes: 38 },
  { name: "Sem 4", cortes: 52 },
  { name: "Sem 5", cortes: 48 },
  { name: "Sem 6", cortes: 61 },
];

const servicesData = [
  { name: "Corte Clásico", cantidad: 156, percentage: 35, color: "hsl(var(--primary))" },
  { name: "Fade Degradado", cantidad: 124, percentage: 28, color: "hsl(var(--secondary))" },
  { name: "Barba Completa", cantidad: 89, percentage: 20, color: "hsl(var(--success))" },
  { name: "Corte + Barba", cantidad: 52, percentage: 12, color: "hsl(var(--info))" },
  { name: "Diseño", cantidad: 22, percentage: 5, color: "hsl(var(--warning))" },
];

const incomeComparisonData = [
  { name: "Miguel", ingresos: 4680 },
  { name: "Juan", ingresos: 4260 },
  { name: "Pedro", ingresos: 3840 },
  { name: "Roberto", ingresos: 3450 },
  { name: "Luis", ingresos: 2940 },
];

const heatmapData = [
  { day: "Lun", hours: [2, 3, 5, 8, 12, 15, 12, 8, 5, 3] },
  { day: "Mar", hours: [1, 2, 4, 7, 10, 12, 11, 7, 4, 2] },
  { day: "Mié", hours: [2, 3, 6, 9, 14, 16, 13, 9, 5, 3] },
  { day: "Jue", hours: [1, 2, 5, 8, 11, 13, 12, 8, 4, 2] },
  { day: "Vie", hours: [3, 4, 7, 11, 15, 18, 16, 12, 8, 5] },
  { day: "Sáb", hours: [5, 7, 10, 15, 20, 22, 18, 14, 10, 6] },
];

const historyData = [
  { id: 1, date: "2024-01-15", time: "10:30", service: "Corte Clásico", client: "Carlos Mendoza", duration: 25, amount: 30, payment: "Efectivo", rating: 5 },
  { id: 2, date: "2024-01-15", time: "09:15", service: "Fade + Barba", client: "Roberto García", duration: 45, amount: 55, payment: "Tarjeta", rating: 5 },
  { id: 3, date: "2024-01-14", time: "17:45", service: "Barba Completa", client: "Luis Pérez", duration: 20, amount: 25, payment: "Transferencia", rating: 4 },
  { id: 4, date: "2024-01-14", time: "16:00", service: "Corte Moderno", client: "Fernando López", duration: 30, amount: 35, payment: "Efectivo", rating: 5 },
  { id: 5, date: "2024-01-14", time: "14:30", service: "Fade Degradado", client: "Diego Ramírez", duration: 35, amount: 40, payment: "Wallet", rating: 4 },
];

const insights = [
  { icon: Trophy, text: "Mejor día de la semana: Sábado con 8 cortes promedio", color: "text-yellow-500" },
  { icon: Clock, text: "Hora pico: 2:00 PM - 4:00 PM (35% de atenciones)", color: "text-info" },
  { icon: DollarSign, text: "Servicio más rentable: Fade + Barba ($45 promedio)", color: "text-success" },
  { icon: TrendingUp, text: "Tendencia: +12% más cortes vs mes anterior", color: "text-primary" },
];

export function StatsTab() {
  const [selectedBarber, setSelectedBarber] = useState<number>(0);
  const [selectedPeriod, setSelectedPeriod] = useState<string>("month");
  const [itemsPerPage, setItemsPerPage] = useState<number>(10);

  const hours = ["9AM", "10AM", "11AM", "12PM", "1PM", "2PM", "3PM", "4PM", "5PM", "6PM"];

  const getHeatmapColor = (value: number) => {
    if (value >= 18) return "bg-success";
    if (value >= 12) return "bg-success/70";
    if (value >= 8) return "bg-success/50";
    if (value >= 4) return "bg-success/30";
    return "bg-success/10";
  };

  const renderStars = (rating: number) => (
    <div className="flex items-center gap-0.5">
      {[...Array(5)].map((_, i) => (
        <Star
          key={i}
          className={cn(
            "h-3 w-3",
            i < rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-muted-foreground/30"
          )}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-wrap gap-3">
          <Select
            value={selectedBarber.toString()}
            onValueChange={(v) => setSelectedBarber(parseInt(v))}
          >
            <SelectTrigger className="w-[200px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {barbers.map((barber) => (
                <SelectItem key={barber.id} value={barber.id.toString()}>
                  <div className="flex items-center gap-2">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-xs bg-primary text-primary-foreground">
                        {barber.avatar}
                      </AvatarFallback>
                    </Avatar>
                    {barber.name}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex border border-border rounded-lg overflow-hidden">
            {[
              { value: "today", label: "Hoy" },
              { value: "week", label: "Semana" },
              { value: "month", label: "Mes" },
              { value: "quarter", label: "3 Meses" },
            ].map((period) => (
              <Button
                key={period.value}
                variant={selectedPeriod === period.value ? "secondary" : "ghost"}
                size="sm"
                className="rounded-none"
                onClick={() => setSelectedPeriod(period.value)}
              >
                {period.label}
              </Button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Input type="date" className="w-auto" />
            <span className="text-muted-foreground">-</span>
            <Input type="date" className="w-auto" />
          </div>
        </div>

        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Excel
          </Button>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Cortes</p>
              <p className="font-display text-3xl">443</p>
              <p className="text-sm text-success flex items-center gap-1">
                <TrendingUp className="h-3 w-3" />
                +8% vs anterior
              </p>
            </div>
            <div className="p-3 rounded-xl bg-primary/10">
              <Scissors className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Ingresos Generados</p>
              <p className="font-display text-3xl">$19,170</p>
              <div className="h-8">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={evolutionData.slice(-4)}>
                    <Line type="monotone" dataKey="cortes" stroke="hsl(var(--success))" strokeWidth={2} dot={false} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="p-3 rounded-xl bg-success/10">
              <DollarSign className="h-6 w-6 text-success" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Promedio/Día</p>
              <p className="font-display text-3xl">14.8</p>
              <Badge variant="success" className="text-xs">Eficiencia Alta</Badge>
            </div>
            <div className="p-3 rounded-xl bg-info/10">
              <ChartLine className="h-6 w-6 text-info" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Rating Promedio</p>
              <div className="flex items-center gap-2">
                <p className="font-display text-3xl">4.8</p>
                {renderStars(5)}
              </div>
              <p className="text-sm text-muted-foreground">156 reseñas</p>
            </div>
            <div className="p-3 rounded-xl bg-warning/10">
              <Star className="h-6 w-6 text-warning" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Evolution Chart */}
        <div className="card-elevated p-6">
          <h3 className="font-display text-xl mb-4">Evolución de Cortes</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={evolutionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="cortes"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: "hsl(var(--primary))", strokeWidth: 2 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Services Bar Chart */}
        <div className="card-elevated p-6">
          <h3 className="font-display text-xl mb-4">Servicios Más Realizados</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={servicesData} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" horizontal={true} vertical={false} />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={11} />
                <YAxis type="category" dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={11} width={90} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                  formatter={(value: number, name, props) => [`${value} (${props.payload.percentage}%)`, "Cantidad"]}
                />
                <Bar dataKey="cantidad" radius={[0, 4, 4, 0]} barSize={20}>
                  {servicesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Income Comparison */}
        <div className="card-elevated p-6">
          <h3 className="font-display text-xl mb-4">Comparativa de Ingresos</h3>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={incomeComparisonData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${v/1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.5rem",
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "Ingresos"]}
                />
                <Bar dataKey="ingresos" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} barSize={40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Heatmap */}
        <div className="card-elevated p-6">
          <h3 className="font-display text-xl mb-4">Días y Horas de Mayor Actividad</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  <th className="text-left text-xs font-medium text-muted-foreground p-1 w-12"></th>
                  {hours.map((hour) => (
                    <th key={hour} className="text-center text-xs font-medium text-muted-foreground p-1">
                      {hour}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {heatmapData.map((row) => (
                  <tr key={row.day}>
                    <td className="text-xs font-medium p-1">{row.day}</td>
                    {row.hours.map((value, i) => (
                      <td key={i} className="p-0.5">
                        <div
                          className={cn(
                            "h-6 rounded text-xs flex items-center justify-center text-success-foreground font-medium",
                            getHeatmapColor(value)
                          )}
                          title={`${value} cortes`}
                        >
                          {value >= 10 && value}
                        </div>
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Insights */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div key={index} className="card-elevated p-4 flex items-start gap-3">
              <Icon className={cn("h-5 w-5 mt-0.5 shrink-0", insight.color)} />
              <p className="text-sm">{insight.text}</p>
            </div>
          );
        })}
      </div>

      {/* History Table */}
      <div className="card-elevated">
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h3 className="font-display text-xl">Historial de Atenciones</h3>
          <Select
            value={itemsPerPage.toString()}
            onValueChange={(v) => setItemsPerPage(parseInt(v))}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left p-3 text-sm font-medium">Fecha y Hora</th>
                <th className="text-left p-3 text-sm font-medium">Servicio</th>
                <th className="text-left p-3 text-sm font-medium">Cliente</th>
                <th className="text-center p-3 text-sm font-medium">Duración</th>
                <th className="text-right p-3 text-sm font-medium">Monto</th>
                <th className="text-center p-3 text-sm font-medium">Pago</th>
                <th className="text-center p-3 text-sm font-medium">Rating</th>
                <th className="text-right p-3 text-sm font-medium">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {historyData.map((item) => (
                <tr key={item.id} className="border-b border-border/50 hover:bg-muted/30">
                  <td className="p-3">
                    <p className="font-medium">
                      {new Date(item.date).toLocaleDateString("es-MX", { day: "numeric", month: "short" })}
                    </p>
                    <p className="text-sm text-muted-foreground">{item.time}</p>
                  </td>
                  <td className="p-3">
                    <Badge variant="secondary">{item.service}</Badge>
                  </td>
                  <td className="p-3">{item.client}</td>
                  <td className="p-3 text-center">{item.duration} min</td>
                  <td className="p-3 text-right font-display text-lg">${item.amount}</td>
                  <td className="p-3 text-center">
                    <Badge variant="outline">{item.payment}</Badge>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-center">
                      {renderStars(item.rating)}
                    </div>
                  </td>
                  <td className="p-3 text-right">
                    <Button variant="ghost" size="sm">Ver</Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="p-4 border-t border-border flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Mostrando 1-{historyData.length} de {historyData.length} registros
          </p>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" disabled>Anterior</Button>
            <Button variant="outline" size="sm" disabled>Siguiente</Button>
          </div>
        </div>
      </div>
    </div>
  );
}
