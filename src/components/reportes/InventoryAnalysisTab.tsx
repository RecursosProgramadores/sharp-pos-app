import {
  Package,
  TrendingUp,
  TrendingDown,
  Clock,
  Star,
  Archive,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
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
import { useInventoryAnalysis } from "@/hooks/useReportData";

export default function InventoryAnalysisTab() {
  const { data, isLoading } = useInventoryAnalysis();

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-28" />)}</div>
        <Skeleton className="h-[340px]" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="stat-card lg:col-span-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Valor Total del Inventario</p>
              <p className="font-display text-4xl text-primary">S/ {data.totalValue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">{data.totalUnits} unidades en stock</p>
            </div>
            <div className="rounded-xl bg-primary/10 p-3"><Package className="h-8 w-8 text-primary" /></div>
          </div>
        </div>
        <div className="stat-card">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Rotación Promedio</p>
            <p className="font-display text-2xl">{data.avgRotation}x</p>
            <p className="text-xs text-muted-foreground">mensual</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Productos Clase A</p>
            <p className="font-display text-2xl">{data.classA}</p>
            <p className="text-xs text-success">Alta rotación</p>
          </div>
        </div>
      </div>

      {/* Category Chart */}
      <div className="card-elevated p-6">
        <div className="mb-4">
          <h3 className="font-display text-lg">Valorización por Categoría</h3>
          <p className="text-sm text-muted-foreground">Desglose del inventario actual</p>
        </div>
        <div className="h-[300px]">
          {data.inventoryByCategory.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.inventoryByCategory}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="categoria" stroke="hsl(var(--muted-foreground))" fontSize={11} angle={-45} textAnchor="end" height={80} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `S/${v}`} />
                <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem" }} />
                <Bar dataKey="valor" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : <div className="flex items-center justify-center h-full text-muted-foreground">Sin productos en inventario</div>}
        </div>
      </div>

      {/* Rotation Table */}
      <div className="card-elevated p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-xl">Rotación de Inventario</h3>
            <p className="text-sm text-muted-foreground">Clasificación ABC automática</p>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-success/20 text-success">A - Alta</Badge>
            <Badge className="bg-warning/20 text-warning">B - Media</Badge>
            <Badge className="bg-muted text-muted-foreground">C - Baja</Badge>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead className="text-right">Stock</TableHead>
                <TableHead className="text-right">Vendidos/Mes</TableHead>
                <TableHead className="text-right">Rotación</TableHead>
                <TableHead className="text-right">Días Inv.</TableHead>
                <TableHead className="text-center">Clase</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.productRotation.map((p) => (
                <TableRow key={p.producto}>
                  <TableCell className="font-medium">{p.producto}</TableCell>
                  <TableCell className="text-right">{p.stock}</TableCell>
                  <TableCell className="text-right">{p.vendido}</TableCell>
                  <TableCell className="text-right">{p.rotacion}x</TableCell>
                  <TableCell className="text-right">{p.diasInventario > 900 ? "∞" : p.diasInventario}</TableCell>
                  <TableCell className="text-center">
                    <Badge className={p.clase === "A" ? "bg-success text-success-foreground" : p.clase === "B" ? "bg-warning text-warning-foreground" : ""} variant={p.clase === "C" ? "secondary" : "default"}>
                      {p.clase}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Top / Slow Moving */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-elevated p-6">
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-success" />
            <h3 className="font-display text-lg">Productos Estrella</h3>
          </div>
          <div className="space-y-3">
            {data.topMoving.length === 0 && <p className="text-sm text-muted-foreground">Sin ventas de productos</p>}
            {data.topMoving.map((p, i) => (
              <div key={p.producto} className="flex items-center justify-between p-3 rounded-lg bg-success/5 border border-success/20">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-success">{i + 1}</span>
                  <div>
                    <p className="font-medium">{p.producto}</p>
                    <p className="text-sm text-muted-foreground">{p.vendido} vendidos</p>
                  </div>
                </div>
                <p className="font-semibold">S/ {p.ingresos.toLocaleString()}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="card-elevated p-6">
          <div className="flex items-center gap-2 mb-4">
            <Archive className="h-5 w-5 text-warning" />
            <h3 className="font-display text-lg">Menor Movimiento</h3>
          </div>
          <div className="space-y-3">
            {data.slowMoving.map((p, i) => (
              <div key={p.producto} className="flex items-center justify-between p-3 rounded-lg bg-warning/5 border border-warning/20">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-warning">{i + 1}</span>
                  <div>
                    <p className="font-medium">{p.producto}</p>
                    <p className="text-sm text-muted-foreground">Stock: {p.stock} uds</p>
                  </div>
                </div>
                <p className="text-sm">{p.vendido} vendidos/mes</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Restock Projections */}
      {data.restockProjections.length > 0 && (
        <div className="card-elevated p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-5 w-5 text-info" />
            <h3 className="font-display text-xl">Proyecciones de Reabastecimiento</h3>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Stock</TableHead>
                  <TableHead className="text-right">Venta/Día</TableHead>
                  <TableHead className="text-right">Días Restantes</TableHead>
                  <TableHead className="text-center">Urgencia</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.restockProjections.map((p) => (
                  <TableRow key={p.producto}>
                    <TableCell className="font-medium">{p.producto}</TableCell>
                    <TableCell className="text-right">{p.stockActual}</TableCell>
                    <TableCell className="text-right">{p.ventaDiaria}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Progress value={Math.min((p.diasRestantes / 30) * 100, 100)} className={`w-16 h-2 ${p.diasRestantes <= 10 ? "[&>div]:bg-destructive" : p.diasRestantes <= 20 ? "[&>div]:bg-warning" : "[&>div]:bg-success"}`} />
                        <span>{p.diasRestantes} días</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={p.urgencia === "alta" ? "destructive" : p.urgencia === "media" ? "secondary" : "outline"}>
                        {p.urgencia === "alta" ? "🔴 Alta" : p.urgencia === "media" ? "🟡 Media" : "🟢 Baja"}
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
