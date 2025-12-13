import { useState } from "react";
import {
  Users,
  UserPlus,
  UserCheck,
  UserMinus,
  TrendingUp,
  TrendingDown,
  Gift,
  Heart,
  Star,
  Calendar,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const clientLevelDistribution = [
  { name: "Nuevo", value: 45, color: "hsl(var(--muted-foreground))" },
  { name: "Regular", value: 120, color: "hsl(var(--info))" },
  { name: "VIP", value: 85, color: "hsl(var(--warning))" },
  { name: "Premium", value: 32, color: "hsl(var(--primary))" },
];

const rfmAnalysis = [
  { cliente: "Carlos Mendoza", ultimaVisita: 3, frecuencia: 24, valor: 1850, segmento: "Campeón" },
  { cliente: "Miguel Torres", ultimaVisita: 7, frecuencia: 18, valor: 1420, segmento: "Leal" },
  { cliente: "Roberto García", ultimaVisita: 5, frecuencia: 22, valor: 1680, segmento: "Campeón" },
  { cliente: "Juan Pérez", ultimaVisita: 14, frecuencia: 12, valor: 890, segmento: "Potencial" },
  { cliente: "Pedro Sánchez", ultimaVisita: 21, frecuencia: 8, valor: 560, segmento: "En Riesgo" },
  { cliente: "Luis Ramírez", ultimaVisita: 45, frecuencia: 4, valor: 280, segmento: "Perdido" },
  { cliente: "Antonio López", ultimaVisita: 10, frecuencia: 15, valor: 1120, segmento: "Leal" },
  { cliente: "Fernando Díaz", ultimaVisita: 2, frecuencia: 20, valor: 1540, segmento: "Campeón" },
];

const scatterData = rfmAnalysis.map(c => ({
  x: c.frecuencia,
  y: c.valor,
  z: 100 - c.ultimaVisita,
  name: c.cliente,
  segmento: c.segmento,
}));

const vipClients = [
  { nombre: "Carlos Mendoza", gastoTotal: 1850, promedio: 77, servicio: "Corte + Barba", ultimoRegalo: "Descuento 20%" },
  { nombre: "Fernando Díaz", gastoTotal: 1680, promedio: 84, servicio: "Fade Degradado", ultimoRegalo: "Producto gratis" },
  { nombre: "Roberto García", gastoTotal: 1540, promedio: 70, servicio: "Corte Clásico", ultimoRegalo: "Descuento 15%" },
  { nombre: "Miguel Torres", gastoTotal: 1420, promedio: 79, servicio: "Corte + Barba", ultimoRegalo: "Ninguno" },
  { nombre: "Antonio López", gastoTotal: 1120, promedio: 75, servicio: "Fade Degradado", ultimoRegalo: "Descuento 10%" },
];

const birthdaysThisMonth = [
  { nombre: "Carlos Mendoza", fecha: "15 Dic", edad: 32, potencial: 85 },
  { nombre: "Juan Pérez", fecha: "18 Dic", edad: 28, potencial: 45 },
  { nombre: "Roberto García", fecha: "22 Dic", edad: 35, potencial: 70 },
  { nombre: "Miguel Torres", fecha: "25 Dic", edad: 41, potencial: 65 },
];

const acquisitionRetention = [
  { month: "Jul", nuevos: 28, regresan: 145 },
  { month: "Ago", nuevos: 32, regresan: 152 },
  { month: "Sep", nuevos: 25, regresan: 148 },
  { month: "Oct", nuevos: 35, regresan: 158 },
  { month: "Nov", nuevos: 42, regresan: 165 },
  { month: "Dic", nuevos: 38, regresan: 172 },
];

const totalClients = clientLevelDistribution.reduce((sum, c) => sum + c.value, 0);

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

export default function ClientsAnalysisTab() {
  return (
    <div className="space-y-6">
      {/* Client Stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Clientes</p>
              <p className="font-display text-3xl">{totalClients}</p>
              <p className="text-xs text-muted-foreground">En base de datos</p>
            </div>
            <div className="rounded-xl bg-primary/10 p-2">
              <Users className="h-5 w-5 text-primary" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Nuevos Este Mes</p>
              <p className="font-display text-3xl">38</p>
              <div className="flex items-center gap-1 text-sm text-success">
                <TrendingUp className="h-4 w-4" />
                <span>+12% vs ant.</span>
              </div>
            </div>
            <div className="rounded-xl bg-success/10 p-2">
              <UserPlus className="h-5 w-5 text-success" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tasa de Retención</p>
              <p className="font-display text-3xl">72%</p>
              <div className="flex items-center gap-1 text-sm text-success">
                <TrendingUp className="h-4 w-4" />
                <span>+3% vs ant.</span>
              </div>
            </div>
            <div className="rounded-xl bg-info/10 p-2">
              <UserCheck className="h-5 w-5 text-info" />
            </div>
          </div>
        </div>

        <div className="stat-card">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Gasto Promedio</p>
              <p className="font-display text-3xl">$51</p>
              <p className="text-xs text-muted-foreground">Por visita</p>
            </div>
            <div className="rounded-xl bg-secondary/10 p-2">
              <Heart className="h-5 w-5 text-secondary" />
            </div>
          </div>
        </div>
      </div>

      {/* Client Distribution & Acquisition */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Client Level Distribution */}
        <div className="card-elevated p-6">
          <div className="mb-4">
            <h3 className="font-display text-lg">Distribución por Nivel</h3>
            <p className="text-sm text-muted-foreground">Segmentación de clientes</p>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={clientLevelDistribution}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {clientLevelDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.75rem",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 mt-4">
            {clientLevelDistribution.map((item) => (
              <div key={item.name} className="flex items-center gap-2 text-sm">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Acquisition vs Retention */}
        <div className="card-elevated p-6">
          <div className="mb-4">
            <h3 className="font-display text-lg">Adquisición vs Retención</h3>
            <p className="text-sm text-muted-foreground">Nuevos clientes vs clientes que regresan</p>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={acquisitionRetention}>
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
                <Line type="monotone" dataKey="nuevos" stroke="hsl(var(--success))" strokeWidth={2} name="Nuevos Clientes" dot={{ r: 4 }} />
                <Line type="monotone" dataKey="regresan" stroke="hsl(var(--primary))" strokeWidth={2} name="Clientes que Regresan" dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* RFM Analysis */}
      <div className="card-elevated p-6">
        <div className="mb-4">
          <h3 className="font-display text-xl">Análisis RFM (Recency, Frequency, Monetary)</h3>
          <p className="text-sm text-muted-foreground">Segmentación basada en comportamiento de compra</p>
        </div>
        <div className="grid gap-6 lg:grid-cols-2">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead className="text-right">Última Visita</TableHead>
                  <TableHead className="text-right">Frecuencia</TableHead>
                  <TableHead className="text-right">Valor ($)</TableHead>
                  <TableHead className="text-center">Segmento</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rfmAnalysis.map((client) => (
                  <TableRow key={client.cliente}>
                    <TableCell className="font-medium">{client.cliente}</TableCell>
                    <TableCell className="text-right">{client.ultimaVisita} días</TableCell>
                    <TableCell className="text-right">{client.frecuencia} visitas</TableCell>
                    <TableCell className="text-right">${client.valor}</TableCell>
                    <TableCell className="text-center">
                      <Badge className={getSegmentColor(client.segmento)}>
                        {client.segmento}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" dataKey="x" name="Frecuencia" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis type="number" dataKey="y" name="Valor $" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <ZAxis type="number" dataKey="z" range={[50, 400]} name="Recencia" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.75rem",
                  }}
                  formatter={(value: number, name: string) => [name === "x" ? `${value} visitas` : name === "y" ? `$${value}` : value, name === "x" ? "Frecuencia" : name === "y" ? "Valor" : "Recencia"]}
                />
                <Scatter 
                  data={scatterData} 
                  fill="hsl(var(--primary))"
                />
              </ScatterChart>
            </ResponsiveContainer>
          </div>
        </div>
        
        {/* Segment Legend */}
        <div className="flex flex-wrap gap-3 mt-4 pt-4 border-t border-border">
          <Badge className="bg-success text-success-foreground">Campeón: Compra frecuente, alto valor, reciente</Badge>
          <Badge className="bg-info text-info-foreground">Leal: Compra regular, buen valor</Badge>
          <Badge className="bg-warning text-warning-foreground">Potencial: Podría convertirse en leal</Badge>
          <Badge className="bg-secondary text-secondary-foreground">En Riesgo: Sin visitar recientemente</Badge>
          <Badge className="bg-destructive text-destructive-foreground">Perdido: Sin actividad prolongada</Badge>
        </div>
      </div>

      {/* VIP Clients & CLV */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* VIP Clients */}
        <div className="card-elevated p-6">
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-warning" />
            <h3 className="font-display text-lg">Top 20 Clientes VIP</h3>
          </div>
          <div className="space-y-3">
            {vipClients.map((client, i) => (
              <div key={client.nombre} className="flex items-center justify-between p-3 rounded-lg bg-warning/5 border border-warning/20">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarFallback className="bg-warning/20 text-warning">
                      {client.nombre.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{client.nombre}</p>
                    <p className="text-sm text-muted-foreground">{client.servicio}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${client.gastoTotal}</p>
                  <p className="text-xs text-muted-foreground">Prom: ${client.promedio}/visita</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Birthday Calendar */}
        <div className="card-elevated p-6">
          <div className="flex items-center gap-2 mb-4">
            <Gift className="h-5 w-5 text-secondary" />
            <h3 className="font-display text-lg">Cumpleaños Este Mes</h3>
          </div>
          
          <div className="p-4 bg-secondary/10 rounded-lg mb-4">
            <p className="text-lg font-semibold text-secondary">
              {birthdaysThisMonth.length} cumpleaños este mes
            </p>
            <p className="text-sm text-muted-foreground">
              Potencial estimado: ${birthdaysThisMonth.reduce((sum, c) => sum + c.potencial, 0)} en ventas con descuento
            </p>
          </div>
          
          <div className="space-y-3">
            {birthdaysThisMonth.map((client) => (
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
                <Badge variant="outline">${client.potencial} potencial</Badge>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CLV & Churn Metrics */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card-elevated p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">Customer Lifetime Value (CLV)</p>
          <p className="font-display text-4xl text-primary">$486</p>
          <p className="text-sm text-muted-foreground mt-2">Valor promedio por cliente</p>
        </div>
        <div className="card-elevated p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">Tasa de Churn</p>
          <p className="font-display text-4xl text-destructive">12%</p>
          <p className="text-sm text-muted-foreground mt-2">Clientes que no vuelven ({">"}3 meses)</p>
        </div>
        <div className="card-elevated p-6 text-center">
          <p className="text-sm text-muted-foreground mb-2">Tiempo Promedio Entre Visitas</p>
          <p className="font-display text-4xl text-info">18 días</p>
          <p className="text-sm text-muted-foreground mt-2">Para clientes activos</p>
        </div>
      </div>
    </div>
  );
}
