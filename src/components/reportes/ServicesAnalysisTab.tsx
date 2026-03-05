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
import { Skeleton } from "@/components/ui/skeleton";
import { useServicesAnalysis } from "@/hooks/useReportData";

const getHeatmapColor = (value: number) => {
  if (value === 0) return "bg-muted";
  if (value <= 2) return "bg-secondary/20";
  if (value <= 5) return "bg-secondary/40";
  if (value <= 8) return "bg-secondary/60";
  if (value <= 12) return "bg-secondary/80";
  return "bg-secondary";
};

export default function ServicesAnalysisTab({ period }: { period: string }) {
  const { data, isLoading } = useServicesAnalysis(period);

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid gap-6 lg:grid-cols-2"><Skeleton className="h-[360px]" /><Skeleton className="h-[360px]" /></div>
        <Skeleton className="h-[300px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Services Ranking & Barber Comparison */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-elevated p-6">
          <div className="mb-4">
            <h3 className="font-display text-lg">Servicios Más Solicitados</h3>
            <p className="text-sm text-muted-foreground">Ranking por cantidad</p>
          </div>
          <div className="h-[300px]">
            {data.servicesRanking.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.servicesRanking} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis type="category" dataKey="servicio" stroke="hsl(var(--muted-foreground))" fontSize={11} width={110} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem" }} />
                  <Bar dataKey="cantidad" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="flex items-center justify-center h-full text-muted-foreground">Sin datos de servicios</div>}
          </div>
        </div>

        <div className="card-elevated p-6">
          <div className="mb-4">
            <h3 className="font-display text-lg">Comparativa por Barbero</h3>
            <p className="text-sm text-muted-foreground">Distribución de servicios realizados</p>
          </div>
          <div className="h-[300px]">
            {data.barberComparison.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.barberComparison}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="nombre" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem" }} />
                  <Legend />
                  {data.top4Services.map((svc, i) => (
                    <Bar key={svc} dataKey={svc} fill={["hsl(var(--primary))", "hsl(var(--secondary))", "hsl(var(--info))", "hsl(var(--success))"][i]} name={svc} radius={[4, 4, 0, 0]} />
                  ))}
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="flex items-center justify-center h-full text-muted-foreground">Sin datos</div>}
          </div>
        </div>
      </div>

      {/* Services Detail Table */}
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.servicesRanking.length === 0 && <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground">Sin datos en este período</TableCell></TableRow>}
              {data.servicesRanking.map((service) => (
                <TableRow key={service.servicio}>
                  <TableCell className="font-medium">{service.servicio}</TableCell>
                  <TableCell className="text-right">{service.cantidad}</TableCell>
                  <TableCell className="text-right">S/ {service.ingresos.toLocaleString()}</TableCell>
                  <TableCell className="text-right">S/ {service.promedio}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Progress value={service.porcentaje} className="w-16 h-2" />
                      <span className="text-sm">{service.porcentaje}%</span>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Barber Productivity */}
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.barberProductivity.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">Sin datos</TableCell></TableRow>}
              {data.barberProductivity.map((barber) => (
                <TableRow key={barber.barbero}>
                  <TableCell className="font-medium">{barber.barbero}</TableCell>
                  <TableCell className="text-right">{barber.total}</TableCell>
                  <TableCell><Badge variant="secondary">{barber.principal}</Badge></TableCell>
                  <TableCell className="text-right">{barber.promedioDia}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Heatmap */}
      <div className="card-elevated p-6">
        <div className="mb-4">
          <h3 className="font-display text-lg">Demanda por Día y Hora</h3>
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
              {data.heatmap.map((row) => (
                <tr key={row.dia}>
                  <td className="p-2 font-medium">{row.dia}</td>
                  {row.datos.map((val: number, i: number) => (
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
      </div>

      {/* Duration Analysis */}
      {data.durationAnalysis.length > 0 && (
        <div className="card-elevated p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-muted-foreground" />
            <h3 className="font-display text-xl">Duración Estimada de Servicios</h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Servicio</TableHead>
                  <TableHead className="text-right">Duración (min)</TableHead>
                  <TableHead className="text-right">Eficiencia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.durationAnalysis.map((item) => (
                  <TableRow key={item.servicio}>
                    <TableCell className="font-medium">{item.servicio}</TableCell>
                    <TableCell className="text-right">{item.estimado} min</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={item.eficiencia < 85 ? "destructive" : item.eficiencia < 95 ? "secondary" : "default"}>
                        {item.eficiencia}%
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      )}
    </div>
  );
}
