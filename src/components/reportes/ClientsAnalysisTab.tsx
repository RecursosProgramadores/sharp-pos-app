import {
  Users,
  UserPlus,
  UserCheck,
  Heart,
  Star,
  Gift,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
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
import { useClientsAnalysis } from "@/hooks/useReportData";

const getSegmentColor = (segmento: string) => {
  switch (segmento) {
    case "Campeón": return "bg-success text-success-foreground";
    case "Leal": return "bg-info text-info-foreground";
    case "Potencial": return "bg-warning text-warning-foreground";
    case "En Riesgo": return "bg-secondary text-secondary-foreground";
    case "Perdido": return "bg-destructive text-destructive-foreground";
    default: return "";
  }
};

export default function ClientsAnalysisTab({ period }: { period: string }) {
  const { data, isLoading } = useClientsAnalysis(period);

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}</div>
        <Skeleton className="h-[300px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Clientes</p>
              <p className="font-display text-3xl">{data.totalClients}</p>
              <p className="text-xs text-muted-foreground">En base de datos</p>
            </div>
            <div className="rounded-xl bg-primary/10 p-2"><Users className="h-5 w-5 text-primary" /></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Nuevos Este Período</p>
              <p className="font-display text-3xl">{data.newClientsCount}</p>
            </div>
            <div className="rounded-xl bg-success/10 p-2"><UserPlus className="h-5 w-5 text-success" /></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tasa de Retención</p>
              <p className="font-display text-3xl">{data.retentionRate}%</p>
            </div>
            <div className="rounded-xl bg-info/10 p-2"><UserCheck className="h-5 w-5 text-info" /></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Gasto Promedio</p>
              <p className="font-display text-3xl">S/ {data.avgPerVisit}</p>
              <p className="text-xs text-muted-foreground">Por visita</p>
            </div>
            <div className="rounded-xl bg-secondary/10 p-2"><Heart className="h-5 w-5 text-secondary" /></div>
          </div>
        </div>
      </div>

      {/* Distribution */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-elevated p-6">
          <div className="mb-4">
            <h3 className="font-display text-lg">Distribución por Nivel</h3>
            <p className="text-sm text-muted-foreground">Segmentación de clientes</p>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.clientLevelDistribution} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}`}>
                  {data.clientLevelDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {data.clientLevelDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}: {item.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* VIP Clients */}
        <div className="card-elevated p-6">
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-warning" />
            <h3 className="font-display text-lg">Top Clientes VIP</h3>
          </div>
          <div className="space-y-3">
            {data.vipClients.length === 0 && <p className="text-sm text-muted-foreground">Sin clientes con gasto registrado</p>}
            {data.vipClients.map((client) => (
              <div key={client.nombre} className="flex items-center justify-between p-3 rounded-lg bg-warning/5 border border-warning/20">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-warning/20 text-warning">
                      {client.nombre.split(" ").map(n => n[0]).join("").substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{client.nombre}</p>
                    <p className="text-sm text-muted-foreground">{client.servicio}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">S/ {client.gastoTotal.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">Prom: S/ {client.promedio}/visita</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* RFM */}
      {data.rfmAnalysis.length > 0 && (
        <div className="card-elevated p-6">
          <div className="mb-4">
            <h3 className="font-display text-xl">Análisis RFM</h3>
            <p className="text-sm text-muted-foreground">Segmentación basada en comportamiento</p>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="text-right">Última Visita</TableHead>
                  <TableHead className="text-right">Frecuencia</TableHead>
                  <TableHead className="text-right">Valor (S/)</TableHead>
                  <TableHead className="text-center">Segmento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.rfmAnalysis.map((client) => (
                  <TableRow key={client.cliente}>
                    <TableCell className="font-medium">{client.cliente}</TableCell>
                    <TableCell className="text-right">{client.ultimaVisita} días</TableCell>
                    <TableCell className="text-right">{client.frecuencia} visitas</TableCell>
                    <TableCell className="text-right">S/ {client.valor.toLocaleString()}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={getSegmentColor(client.segmento)}>{client.segmento}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border">
            <Badge className="bg-success text-success-foreground">Campeón</Badge>
            <Badge className="bg-info text-info-foreground">Leal</Badge>
            <Badge className="bg-warning text-warning-foreground">Potencial</Badge>
            <Badge className="bg-secondary text-secondary-foreground">En Riesgo</Badge>
            <Badge className="bg-destructive text-destructive-foreground">Perdido</Badge>
          </div>
        </div>
      )}

      {/* Birthdays */}
      {data.birthdaysThisMonth.length > 0 && (
        <div className="card-elevated p-6">
          <div className="flex items-center gap-2 mb-4">
            <Gift className="h-5 w-5 text-secondary" />
            <h3 className="font-display text-lg">Cumpleaños Este Mes ({data.birthdaysThisMonth.length})</h3>
          </div>
          <div className="space-y-3">
            {data.birthdaysThisMonth.map((client) => (
              <div key={client.nombre} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  <div className="text-center bg-secondary/20 rounded-lg p-2 min-w-[50px]">
                    <Calendar className="h-4 w-4 text-secondary mx-auto" />
                    <p className="text-xs font-medium mt-1">{client.fecha}</p>
                  </div>
                  <div>
                    <p className="font-medium">{client.nombre}</p>
                    <p className="text-sm text-muted-foreground">Cumple {client.edad} años</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* CLV & Churn */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card-elevated p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">CLV Promedio</p>
          <p className="font-display text-4xl text-primary">S/ {data.clv}</p>
          <p className="text-sm text-muted-foreground mt-2">Valor promedio por cliente</p>
        </div>
        <div className="card-elevated p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">Tasa de Churn</p>
          <p className="font-display text-4xl text-destructive">{data.churnRate}%</p>
          <p className="text-sm text-muted-foreground mt-2">Clientes inactivos ({">"}3 meses)</p>
        </div>
        <div className="card-elevated p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">Días Entre Visitas</p>
          <p className="font-display text-4xl text-info">{data.avgDaysBetween}</p>
          <p className="text-sm text-muted-foreground mt-2">Promedio clientes activos</p>
        </div>
      </div>
    </div>
  );
}
