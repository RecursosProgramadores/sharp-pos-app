import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Trophy,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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

const periodComparison = [
  { day: "1", periodo1: 850, periodo2: 920 },
  { day: "5", periodo1: 1020, periodo2: 1150 },
  { day: "10", periodo1: 780, periodo2: 890 },
  { day: "15", periodo1: 1250, periodo2: 1380 },
  { day: "20", periodo1: 1100, periodo2: 1200 },
  { day: "25", periodo1: 1450, periodo2: 1580 },
  { day: "30", periodo1: 1650, periodo2: 1820 },
];

const metricsComparison = [
  { metrica: "Ingresos Totales", periodo1: 23800, periodo2: 26740, unidad: "$" },
  { metrica: "Número de Ventas", periodo1: 468, periodo2: 524, unidad: "" },
  { metrica: "Ticket Promedio", periodo1: 50.85, periodo2: 51.03, unidad: "$" },
  { metrica: "Servicios Realizados", periodo1: 380, periodo2: 412, unidad: "" },
  { metrica: "Productos Vendidos", periodo1: 72, periodo2: 89, unidad: "" },
  { metrica: "Nuevos Clientes", periodo1: 34, periodo2: 38, unidad: "" },
  { metrica: "Clientes Recurrentes", periodo1: 145, periodo2: 158, unidad: "" },
  { metrica: "Tasa de Ocupación", periodo1: 73, periodo2: 78, unidad: "%" },
];

const barberComparison = [
  { barbero: "Miguel Ángel", cortes: 156, ingresos: 8450, promedio: 54.2, rating: 4.9, eficiencia: 92 },
  { barbero: "Juan Carlos", cortes: 142, ingresos: 7280, promedio: 51.3, rating: 4.8, eficiencia: 88 },
  { barbero: "Pedro Sánchez", cortes: 128, ingresos: 6120, promedio: 47.8, rating: 4.7, eficiencia: 85 },
  { barbero: "Roberto Díaz", cortes: 98, ingresos: 4890, promedio: 49.9, rating: 4.5, eficiencia: 82 },
  { barbero: "Carlos López", cortes: 72, ingresos: 3650, promedio: 50.7, rating: 4.6, eficiencia: 80 },
];

const radarDataMiguel = [
  { subject: "Cortes", A: 95, fullMark: 100 },
  { subject: "Ingresos", A: 92, fullMark: 100 },
  { subject: "Rating", A: 98, fullMark: 100 },
  { subject: "Eficiencia", A: 92, fullMark: 100 },
  { subject: "Retención", A: 88, fullMark: 100 },
];

const radarDataJuan = [
  { subject: "Cortes", A: 87, fullMark: 100 },
  { subject: "Ingresos", A: 84, fullMark: 100 },
  { subject: "Rating", A: 96, fullMark: 100 },
  { subject: "Eficiencia", A: 88, fullMark: 100 },
  { subject: "Retención", A: 85, fullMark: 100 },
];

const bestPeriods = {
  bestWeek: { periodo: "25 Nov - 1 Dic 2024", ingresos: 7850, servicios: 142 },
  currentWeek: { periodo: "9 Dic - 15 Dic 2024", ingresos: 6420, servicios: 118 },
  bestMonth: { periodo: "Noviembre 2024", ingresos: 26740, servicios: 524 },
  currentMonth: { periodo: "Diciembre 2024", ingresos: 19820, servicios: 385 },
};

export default function ComparativeAnalysisTab() {
  const [selectedBarber1, setSelectedBarber1] = useState("Miguel Ángel");
  const [selectedBarber2, setSelectedBarber2] = useState("Juan Carlos");

  const getDiff = (current: number, previous: number) => {
    const diff = current - previous;
    const pct = previous !== 0 ? ((diff / previous) * 100).toFixed(1) : "N/A";
    return { diff, pct, positive: diff >= 0 };
  };

  return (
    <div className="space-y-6">
      {/* Period Selector */}
      <div className="card-elevated p-4">
        <div className="flex flex-wrap items-end gap-4">
          <div className="flex-1 min-w-[200px]">
            <Label className="text-sm text-muted-foreground">Período 1</Label>
            <div className="flex gap-2 mt-1">
              <Input type="date" defaultValue="2024-11-01" />
              <span className="self-center">a</span>
              <Input type="date" defaultValue="2024-11-30" />
            </div>
          </div>
          <div className="flex-1 min-w-[200px]">
            <Label className="text-sm text-muted-foreground">Período 2</Label>
            <div className="flex gap-2 mt-1">
              <Input type="date" defaultValue="2024-12-01" />
              <span className="self-center">a</span>
              <Input type="date" defaultValue="2024-12-13" />
            </div>
          </div>
          <Button>Comparar</Button>
        </div>
      </div>

      {/* Period Comparison Chart */}
      <div className="card-elevated p-6">
        <div className="mb-4">
          <h3 className="font-display text-lg">Comparación de Ventas Diarias</h3>
          <p className="text-sm text-muted-foreground">Período 1 vs Período 2</p>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={periodComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="day" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.75rem",
                }}
                formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="periodo1" 
                stroke="hsl(var(--muted-foreground))" 
                strokeWidth={2} 
                strokeDasharray="5 5"
                name="Período Anterior" 
                dot={{ r: 3 }} 
              />
              <Line 
                type="monotone" 
                dataKey="periodo2" 
                stroke="hsl(var(--primary))" 
                strokeWidth={2} 
                name="Período Actual" 
                dot={{ r: 4 }} 
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Metrics Comparison Table */}
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
              {metricsComparison.map((metric) => {
                const d = getDiff(metric.periodo2, metric.periodo1);
                return (
                  <TableRow key={metric.metrica}>
                    <TableCell className="font-medium">{metric.metrica}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {metric.unidad === "$" ? `$${metric.periodo1.toLocaleString()}` : 
                       metric.unidad === "%" ? `${metric.periodo1}%` : metric.periodo1.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      {metric.unidad === "$" ? `$${metric.periodo2.toLocaleString()}` : 
                       metric.unidad === "%" ? `${metric.periodo2}%` : metric.periodo2.toLocaleString()}
                    </TableCell>
                    <TableCell className={`text-right ${d.positive ? "text-success" : "text-destructive"}`}>
                      {d.positive ? "+" : ""}{metric.unidad === "$" ? `$${d.diff.toLocaleString()}` : 
                       metric.unidad === "%" ? `${d.diff}pp` : d.diff.toLocaleString()}
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
        <div className="overflow-x-auto mb-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Barbero</TableHead>
                <TableHead className="text-right">Cortes</TableHead>
                <TableHead className="text-right">Ingresos</TableHead>
                <TableHead className="text-right">Prom/Corte</TableHead>
                <TableHead className="text-right">Rating</TableHead>
                <TableHead className="text-right">Eficiencia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {barberComparison.map((barber, i) => (
                <TableRow key={barber.barbero}>
                  <TableCell className="font-medium">
                    <div className="flex items-center gap-2">
                      {i === 0 && <Trophy className="h-4 w-4 text-yellow-500" />}
                      {barber.barbero}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">{barber.cortes}</TableCell>
                  <TableCell className="text-right">${barber.ingresos.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${barber.promedio.toFixed(2)}</TableCell>
                  <TableCell className="text-right">
                    <span className="flex items-center justify-end gap-1">
                      <span className="text-yellow-500">★</span>
                      {barber.rating}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge variant={barber.eficiencia >= 90 ? "default" : "secondary"}>
                      {barber.eficiencia}%
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Radar Charts */}
        <div className="grid gap-6 lg:grid-cols-2">
          <div>
            <h4 className="font-medium mb-2 text-center">Miguel Ángel</h4>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarDataMiguel}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <PolarRadiusAxis stroke="hsl(var(--border))" fontSize={10} />
                  <Radar 
                    name="Miguel Ángel" 
                    dataKey="A" 
                    stroke="hsl(var(--primary))" 
                    fill="hsl(var(--primary))" 
                    fillOpacity={0.3} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div>
            <h4 className="font-medium mb-2 text-center">Juan Carlos</h4>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart data={radarDataJuan}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis dataKey="subject" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <PolarRadiusAxis stroke="hsl(var(--border))" fontSize={10} />
                  <Radar 
                    name="Juan Carlos" 
                    dataKey="A" 
                    stroke="hsl(var(--secondary))" 
                    fill="hsl(var(--secondary))" 
                    fillOpacity={0.3} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>

      {/* Best Periods Benchmarking */}
      <div className="card-elevated p-6">
        <div className="flex items-center gap-2 mb-4">
          <Trophy className="h-5 w-5 text-warning" />
          <h3 className="font-display text-xl">Benchmarking Interno</h3>
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Best Week vs Current Week */}
          <div className="p-4 rounded-lg bg-muted/50">
            <h4 className="font-medium mb-4">Mejor Semana del Año vs Semana Actual</h4>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 p-4 rounded-lg bg-warning/10 border border-warning/20 text-center">
                <Trophy className="h-6 w-6 text-warning mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Mejor Semana</p>
                <p className="text-xs text-muted-foreground mb-2">{bestPeriods.bestWeek.periodo}</p>
                <p className="font-display text-2xl text-warning">${bestPeriods.bestWeek.ingresos.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{bestPeriods.bestWeek.servicios} servicios</p>
              </div>
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
              <div className="flex-1 p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
                <Calendar className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Semana Actual</p>
                <p className="text-xs text-muted-foreground mb-2">{bestPeriods.currentWeek.periodo}</p>
                <p className="font-display text-2xl text-primary">${bestPeriods.currentWeek.ingresos.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{bestPeriods.currentWeek.servicios} servicios</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-info/10 rounded-lg">
              <p className="text-sm">
                <strong>Diferencia:</strong> ${(bestPeriods.bestWeek.ingresos - bestPeriods.currentWeek.ingresos).toLocaleString()} menos 
                ({((1 - bestPeriods.currentWeek.ingresos / bestPeriods.bestWeek.ingresos) * 100).toFixed(1)}% bajo el récord)
              </p>
            </div>
          </div>

          {/* Best Month vs Current Month */}
          <div className="p-4 rounded-lg bg-muted/50">
            <h4 className="font-medium mb-4">Mejor Mes del Año vs Mes Actual</h4>
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1 p-4 rounded-lg bg-warning/10 border border-warning/20 text-center">
                <Trophy className="h-6 w-6 text-warning mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Mejor Mes</p>
                <p className="text-xs text-muted-foreground mb-2">{bestPeriods.bestMonth.periodo}</p>
                <p className="font-display text-2xl text-warning">${bestPeriods.bestMonth.ingresos.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{bestPeriods.bestMonth.servicios} servicios</p>
              </div>
              <ArrowRight className="h-6 w-6 text-muted-foreground" />
              <div className="flex-1 p-4 rounded-lg bg-primary/10 border border-primary/20 text-center">
                <Calendar className="h-6 w-6 text-primary mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">Mes Actual</p>
                <p className="text-xs text-muted-foreground mb-2">{bestPeriods.currentMonth.periodo}</p>
                <p className="font-display text-2xl text-primary">${bestPeriods.currentMonth.ingresos.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">{bestPeriods.currentMonth.servicios} servicios</p>
              </div>
            </div>
            <div className="mt-4 p-3 bg-success/10 rounded-lg">
              <p className="text-sm">
                <strong>Proyección:</strong> A este ritmo, cerrarás el mes con aproximadamente $25,800 
                (96.5% del mejor mes)
              </p>
            </div>
          </div>
        </div>

        {/* Success Factors */}
        <div className="mt-6 p-4 bg-warning/10 rounded-lg border border-warning/20">
          <h4 className="font-medium text-warning mb-2">🏆 Factores de Éxito Identificados</h4>
          <ul className="text-sm space-y-1 text-muted-foreground">
            <li>• La mejor semana coincidió con una promoción de "Black Friday" con 15% de descuento en combos</li>
            <li>• Se contó con todos los barberos disponibles (sin ausencias)</li>
            <li>• Se realizaron 3 campañas de WhatsApp a clientes inactivos que generaron 18 visitas</li>
            <li>• El clima fue favorable (sin lluvias) durante toda la semana</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
