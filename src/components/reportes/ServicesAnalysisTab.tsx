import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Clock,
  AlertTriangle,
  Lightbulb,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  Legend,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const servicesRanking = [
  { servicio: "Corte Clásico", cantidad: 245, ingresos: 3675, promedio: 15, porcentaje: 29.5, trend: 5.2 },
  { servicio: "Fade Degradado", cantidad: 198, ingresos: 3960, promedio: 20, porcentaje: 23.8, trend: 8.1 },
  { servicio: "Corte + Barba", cantidad: 156, ingresos: 3900, promedio: 25, porcentaje: 18.8, trend: 12.3 },
  { servicio: "Barba Completa", cantidad: 132, ingresos: 1584, promedio: 12, porcentaje: 15.9, trend: -2.1 },
  { servicio: "Diseño", cantidad: 89, ingresos: 1602, promedio: 18, porcentaje: 10.7, trend: 15.8 },
  { servicio: "Tratamiento Capilar", cantidad: 67, ingresos: 2010, promedio: 30, porcentaje: 8.1, trend: 22.4 },
  { servicio: "Coloración", cantidad: 45, ingresos: 1800, promedio: 40, porcentaje: 5.4, trend: 18.2 },
  { servicio: "Corte Niño", cantidad: 78, ingresos: 936, promedio: 12, porcentaje: 9.4, trend: -5.3 },
];

const serviceTrends = [
  { month: "Jul", corte: 180, fade: 145, barba: 98, combo: 120 },
  { month: "Ago", corte: 195, fade: 158, barba: 105, combo: 135 },
  { month: "Sep", corte: 210, fade: 170, barba: 112, combo: 142 },
  { month: "Oct", corte: 225, fade: 182, barba: 120, combo: 148 },
  { month: "Nov", corte: 235, fade: 190, barba: 128, combo: 152 },
  { month: "Dic", corte: 245, fade: 198, barba: 132, combo: 156 },
];

const barberServiceComparison = [
  { nombre: "Miguel Á.", corte: 68, fade: 52, barba: 22, combo: 14 },
  { nombre: "Juan C.", corte: 62, fade: 48, barba: 18, combo: 14 },
  { nombre: "Pedro S.", corte: 58, fade: 42, barba: 16, combo: 12 },
  { nombre: "Roberto D.", corte: 45, fade: 38, barba: 10, combo: 5 },
  { nombre: "Carlos L.", corte: 32, fade: 28, barba: 8, combo: 4 },
];

const barberProductivity = [
  { barbero: "Miguel Ángel", total: 156, principal: "Fade Degradado", promedioDia: 6.5, rating: 4.9 },
  { barbero: "Juan Carlos", total: 142, principal: "Corte Clásico", promedioDia: 5.9, rating: 4.8 },
  { barbero: "Pedro Sánchez", total: 128, principal: "Corte + Barba", promedioDia: 5.3, rating: 4.7 },
  { barbero: "Roberto Díaz", total: 98, principal: "Corte Clásico", promedioDia: 4.1, rating: 4.5 },
  { barbero: "Carlos López", total: 72, principal: "Fade Degradado", promedioDia: 3.0, rating: 4.6 },
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

const durationAnalysis = [
  { servicio: "Corte Clásico", estimado: 20, real: 22, eficiencia: 91 },
  { servicio: "Fade Degradado", estimado: 30, real: 35, eficiencia: 86 },
  { servicio: "Barba Completa", estimado: 15, real: 14, eficiencia: 107 },
  { servicio: "Corte + Barba", estimado: 35, real: 38, eficiencia: 92 },
  { servicio: "Diseño", estimado: 25, real: 32, eficiencia: 78 },
  { servicio: "Tratamiento Capilar", estimado: 40, real: 42, eficiencia: 95 },
  { servicio: "Coloración", estimado: 60, real: 75, eficiencia: 80 },
  { servicio: "Corte Niño", estimado: 15, real: 18, eficiencia: 83 },
];

const getHeatmapColor = (value: number) => {
  if (value === 0) return "bg-muted";
  if (value <= 5) return "bg-secondary/20";
  if (value <= 10) return "bg-secondary/40";
  if (value <= 15) return "bg-secondary/60";
  if (value <= 20) return "bg-secondary/80";
  return "bg-secondary";
};

export default function ServicesAnalysisTab() {
  return (
    <div className="space-y-6">
      {/* Services Ranking Chart */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-elevated p-6">
          <div className="mb-4">
            <h3 className="font-display text-lg">Servicios Más Solicitados</h3>
            <p className="text-sm text-muted-foreground">Ranking por cantidad</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={servicesRanking} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis type="category" dataKey="servicio" stroke="hsl(var(--muted-foreground))" fontSize={11} width={110} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.75rem",
                  }}
                />
                <Bar dataKey="cantidad" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Service Trends */}
        <div className="card-elevated p-6">
          <div className="mb-4">
            <h3 className="font-display text-lg">Tendencia de Servicios</h3>
            <p className="text-sm text-muted-foreground">Últimos 6 meses</p>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={serviceTrends}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.75rem",
                  }}
                />
                <Legend />
                <Line type="monotone" dataKey="corte" stroke="hsl(var(--primary))" strokeWidth={2} name="Corte Clásico" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="fade" stroke="hsl(var(--secondary))" strokeWidth={2} name="Fade" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="barba" stroke="hsl(var(--info))" strokeWidth={2} name="Barba" dot={{ r: 3 }} />
                <Line type="monotone" dataKey="combo" stroke="hsl(var(--success))" strokeWidth={2} name="Combo" dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Detailed Services Table */}
      <div className="card-elevated p-6">
        <h3 className="font-display text-xl mb-4">Detalle de Servicios</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Servicio</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">Ingresos</TableHead>
                <TableHead className="text-right">Precio Prom.</TableHead>
                <TableHead className="text-right">% del Total</TableHead>
                <TableHead className="text-right">Tendencia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {servicesRanking.map((service) => (
                <TableRow key={service.servicio}>
                  <TableCell className="font-medium">{service.servicio}</TableCell>
                  <TableCell className="text-right">{service.cantidad}</TableCell>
                  <TableCell className="text-right">${service.ingresos.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${service.promedio}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Progress value={service.porcentaje} className="w-16 h-2" />
                      <span className="text-sm">{service.porcentaje}%</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className={`flex items-center justify-end gap-1 ${service.trend >= 0 ? "text-success" : "text-destructive"}`}>
                      {service.trend >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                      <span>{service.trend >= 0 ? "+" : ""}{service.trend}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Barber Service Comparison */}
      <div className="card-elevated p-6">
        <div className="mb-4">
          <h3 className="font-display text-lg">Comparativa de Servicios por Barbero</h3>
          <p className="text-sm text-muted-foreground">Distribución de servicios realizados</p>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barberServiceComparison}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="nombre" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.75rem",
                }}
              />
              <Legend />
              <Bar dataKey="corte" fill="hsl(var(--primary))" name="Corte" radius={[4, 4, 0, 0]} />
              <Bar dataKey="fade" fill="hsl(var(--secondary))" name="Fade" radius={[4, 4, 0, 0]} />
              <Bar dataKey="barba" fill="hsl(var(--info))" name="Barba" radius={[4, 4, 0, 0]} />
              <Bar dataKey="combo" fill="hsl(var(--success))" name="Combo" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Barber Productivity Table */}
      <div className="card-elevated p-6">
        <h3 className="font-display text-xl mb-4">Productividad por Barbero</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Barbero</TableHead>
                <TableHead className="text-right">Total Servicios</TableHead>
                <TableHead>Servicio Principal</TableHead>
                <TableHead className="text-right">Promedio/Día</TableHead>
                <TableHead className="text-right">Valoración</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {barberProductivity.map((barber) => (
                <TableRow key={barber.barbero}>
                  <TableCell className="font-medium">{barber.barbero}</TableCell>
                  <TableCell className="text-right">{barber.total}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{barber.principal}</Badge>
                  </TableCell>
                  <TableCell className="text-right">{barber.promedioDia}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <span className="text-yellow-500">★</span>
                      <span>{barber.rating}</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Demand Heatmap */}
      <div className="card-elevated p-6">
        <div className="mb-4">
          <h3 className="font-display text-lg">Demanda de Servicios por Día y Hora</h3>
          <p className="text-sm text-muted-foreground">Horarios pico y valle</p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr>
                <th className="text-left p-2 text-muted-foreground">Día</th>
                {["8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm", "7pm"].map((h) => (
                  <th key={h} className="p-2 text-muted-foreground font-normal">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {heatmapData.map((row) => (
                <tr key={row.dia}>
                  <td className="p-2 font-medium">{row.dia}</td>
                  {row.datos.map((val, i) => (
                    <td key={i} className="p-1">
                      <div className={`w-8 h-8 rounded ${getHeatmapColor(val)} flex items-center justify-center text-xs font-medium`}>
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
            <div className="w-4 h-4 rounded bg-secondary/20" />
            <div className="w-4 h-4 rounded bg-secondary/40" />
            <div className="w-4 h-4 rounded bg-secondary/60" />
            <div className="w-4 h-4 rounded bg-secondary/80" />
            <div className="w-4 h-4 rounded bg-secondary" />
          </div>
          <span>Más</span>
        </div>
        
        {/* Insights */}
        <div className="mt-6 p-4 bg-info/10 rounded-lg border border-info/20">
          <div className="flex items-start gap-3">
            <Lightbulb className="h-5 w-5 text-info mt-0.5" />
            <div>
              <p className="font-medium text-info">Sugerencia Automática</p>
              <p className="text-sm text-muted-foreground mt-1">
                Los sábados de 10am a 1pm son tus horarios más ocupados con un promedio de 25 servicios. 
                Considera añadir un barbero extra en ese horario para reducir tiempos de espera.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Duration Analysis */}
      <div className="card-elevated p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-muted-foreground" />
          <h3 className="font-display text-xl">Duración Real vs Estimada</h3>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Servicio</TableHead>
                <TableHead className="text-right">Dur. Estimada</TableHead>
                <TableHead className="text-right">Dur. Real Prom.</TableHead>
                <TableHead className="text-right">Diferencia</TableHead>
                <TableHead className="text-right">Eficiencia</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {durationAnalysis.map((item) => (
                <TableRow key={item.servicio}>
                  <TableCell className="font-medium">{item.servicio}</TableCell>
                  <TableCell className="text-right">{item.estimado} min</TableCell>
                  <TableCell className="text-right">{item.real} min</TableCell>
                  <TableCell className="text-right">
                    <span className={item.real > item.estimado ? "text-destructive" : "text-success"}>
                      {item.real > item.estimado ? "+" : ""}{item.real - item.estimado} min
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Progress 
                        value={Math.min(item.eficiencia, 100)} 
                        className={`w-16 h-2 ${item.eficiencia < 85 ? "[&>div]:bg-destructive" : item.eficiencia < 95 ? "[&>div]:bg-warning" : "[&>div]:bg-success"}`} 
                      />
                      <Badge variant={item.eficiencia < 85 ? "destructive" : item.eficiencia < 95 ? "secondary" : "default"}>
                        {item.eficiencia}%
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Alert for inefficient services */}
        <div className="mt-4 p-4 bg-warning/10 rounded-lg border border-warning/20">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-5 w-5 text-warning mt-0.5" />
            <div>
              <p className="font-medium text-warning">Servicios con Baja Eficiencia</p>
              <p className="text-sm text-muted-foreground mt-1">
                <strong>Diseño</strong> y <strong>Coloración</strong> están tomando significativamente más tiempo del estimado. 
                Considera revisar el proceso o ajustar los tiempos estimados para una mejor programación.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
