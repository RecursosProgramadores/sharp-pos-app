import { useState } from "react";
import {
  Calendar,
  Download,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Users,
  Scissors,
  Package,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const revenueData = [
  { month: "Ene", ingresos: 12400, gastos: 4000 },
  { month: "Feb", ingresos: 11398, gastos: 3800 },
  { month: "Mar", ingresos: 15800, gastos: 4200 },
  { month: "Abr", ingresos: 13908, gastos: 3900 },
  { month: "May", ingresos: 16800, gastos: 4500 },
  { month: "Jun", ingresos: 19300, gastos: 5100 },
];

const serviceData = [
  { name: "Corte Clásico", value: 35, color: "hsl(358, 76%, 47%)" },
  { name: "Fade Degradado", value: 25, color: "hsl(22, 94%, 54%)" },
  { name: "Corte + Barba", value: 20, color: "hsl(142, 76%, 36%)" },
  { name: "Barba Completa", value: 12, color: "hsl(199, 89%, 48%)" },
  { name: "Otros", value: 8, color: "hsl(220, 9%, 46%)" },
];

const barberPerformance = [
  { name: "Miguel Á.", servicios: 156, ingresos: 4680 },
  { name: "Juan C.", servicios: 142, ingresos: 4260 },
  { name: "Pedro S.", servicios: 128, ingresos: 3840 },
  { name: "Roberto D.", servicios: 98, ingresos: 2940 },
];

export default function Reportes() {
  const [period, setPeriod] = useState("month");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl md:text-4xl tracking-tight">
            Reportes y Estadísticas
          </h1>
          <p className="text-muted-foreground mt-1">
            Analiza el rendimiento de tu barbería
          </p>
        </div>
        <div className="flex gap-2">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="w-[180px]">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Esta semana</SelectItem>
              <SelectItem value="month">Este mes</SelectItem>
              <SelectItem value="quarter">Trimestre</SelectItem>
              <SelectItem value="year">Este año</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Ingresos Totales</p>
              <p className="font-display text-3xl">$19,300</p>
              <div className="flex items-center gap-1 text-sm text-success">
                <TrendingUp className="h-4 w-4" />
                <span>+14.5%</span>
              </div>
            </div>
            <div className="rounded-xl bg-primary/10 p-3">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Servicios Realizados</p>
              <p className="font-display text-3xl">524</p>
              <div className="flex items-center gap-1 text-sm text-success">
                <TrendingUp className="h-4 w-4" />
                <span>+8.2%</span>
              </div>
            </div>
            <div className="rounded-xl bg-secondary/10 p-3">
              <Scissors className="h-6 w-6 text-secondary" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Nuevos Clientes</p>
              <p className="font-display text-3xl">38</p>
              <div className="flex items-center gap-1 text-sm text-destructive">
                <TrendingDown className="h-4 w-4" />
                <span>-3.1%</span>
              </div>
            </div>
            <div className="rounded-xl bg-info/10 p-3">
              <Users className="h-6 w-6 text-info" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Productos Vendidos</p>
              <p className="font-display text-3xl">89</p>
              <div className="flex items-center gap-1 text-sm text-success">
                <TrendingUp className="h-4 w-4" />
                <span>+21.3%</span>
              </div>
            </div>
            <div className="rounded-xl bg-success/10 p-3">
              <Package className="h-6 w-6 text-success" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 card-elevated p-6">
          <div className="mb-6">
            <h3 className="font-display text-xl">Ingresos vs Gastos</h3>
            <p className="text-sm text-muted-foreground">Últimos 6 meses</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData}>
                <defs>
                  <linearGradient id="colorIngresos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(142, 76%, 36%)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="colorGastos" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(358, 76%, 47%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(358, 76%, 47%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
                <XAxis dataKey="month" stroke="hsl(220, 9%, 46%)" fontSize={12} />
                <YAxis stroke="hsl(220, 9%, 46%)" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(220, 13%, 91%)",
                    borderRadius: "0.75rem",
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                />
                <Area type="monotone" dataKey="ingresos" stroke="hsl(142, 76%, 36%)" strokeWidth={2} fill="url(#colorIngresos)" name="Ingresos" />
                <Area type="monotone" dataKey="gastos" stroke="hsl(358, 76%, 47%)" strokeWidth={2} fill="url(#colorGastos)" name="Gastos" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card-elevated p-6">
          <div className="mb-6">
            <h3 className="font-display text-xl">Servicios por Tipo</h3>
            <p className="text-sm text-muted-foreground">Distribución</p>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={serviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {serviceData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value}%`, ""]}
                  contentStyle={{
                    backgroundColor: "hsl(0, 0%, 100%)",
                    border: "1px solid hsl(220, 13%, 91%)",
                    borderRadius: "0.75rem",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {serviceData.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div
                    className="h-3 w-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Barber Performance */}
      <div className="card-elevated p-6">
        <div className="mb-6">
          <h3 className="font-display text-xl">Rendimiento por Barbero</h3>
          <p className="text-sm text-muted-foreground">Este mes</p>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barberPerformance} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 13%, 91%)" />
              <XAxis type="number" stroke="hsl(220, 9%, 46%)" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="hsl(220, 9%, 46%)" fontSize={12} width={80} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(0, 0%, 100%)",
                  border: "1px solid hsl(220, 13%, 91%)",
                  borderRadius: "0.75rem",
                }}
              />
              <Bar dataKey="servicios" fill="hsl(358, 76%, 47%)" radius={[0, 4, 4, 0]} name="Servicios" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-border">
          {barberPerformance.map((barber) => (
            <div key={barber.name} className="text-center">
              <p className="text-sm text-muted-foreground">{barber.name}</p>
              <p className="font-display text-2xl mt-1">${barber.ingresos.toLocaleString()}</p>
              <Badge variant="secondary" className="mt-1">
                {barber.servicios} servicios
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
