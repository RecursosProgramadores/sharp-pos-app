import { useState } from "react";
import {
  Package,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
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
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const inventoryByCategory = [
  { categoria: "Pomadas", valor: 2850, unidades: 120 },
  { categoria: "Aceites", valor: 1980, unidades: 85 },
  { categoria: "Shampoos", valor: 1450, unidades: 95 },
  { categoria: "Ceras", valor: 1120, unidades: 72 },
  { categoria: "After Shave", valor: 890, unidades: 48 },
  { categoria: "Herramientas", valor: 2200, unidades: 35 },
  { categoria: "Tónicos", valor: 780, unidades: 42 },
  { categoria: "Otros", valor: 650, unidades: 38 },
];

const productRotation = [
  { producto: "Pomada Premium", stock: 15, vendido: 45, rotacion: 3.0, diasInventario: 10, clase: "A" },
  { producto: "Aceite para Barba", stock: 12, vendido: 38, rotacion: 3.2, diasInventario: 9, clase: "A" },
  { producto: "Shampoo Anticaspa", stock: 18, vendido: 32, rotacion: 1.8, diasInventario: 17, clase: "B" },
  { producto: "Cera Mate", stock: 22, vendido: 28, rotacion: 1.3, diasInventario: 24, clase: "B" },
  { producto: "Gel Extra Fuerte", stock: 35, vendido: 25, rotacion: 0.7, diasInventario: 42, clase: "C" },
  { producto: "After Shave Classic", stock: 20, vendido: 22, rotacion: 1.1, diasInventario: 27, clase: "B" },
  { producto: "Tónico Capilar", stock: 25, vendido: 18, rotacion: 0.7, diasInventario: 42, clase: "C" },
  { producto: "Spray Fijador", stock: 30, vendido: 15, rotacion: 0.5, diasInventario: 60, clase: "C" },
  { producto: "Peine de Carbono", stock: 50, vendido: 12, rotacion: 0.2, diasInventario: 125, clase: "C" },
  { producto: "Navaja de Afeitar", stock: 8, vendido: 8, rotacion: 1.0, diasInventario: 30, clase: "B" },
];

const topMoving = [
  { producto: "Pomada Premium", vendido: 45, ingresos: 675, tendencia: 12 },
  { producto: "Aceite para Barba", vendido: 38, ingresos: 570, tendencia: 8 },
  { producto: "Shampoo Anticaspa", vendido: 32, ingresos: 384, tendencia: 5 },
  { producto: "Cera Mate", vendido: 28, ingresos: 336, tendencia: 3 },
  { producto: "Gel Extra Fuerte", vendido: 25, ingresos: 200, tendencia: -2 },
];

const slowMoving = [
  { producto: "Navaja de Afeitar", vendido: 8, stock: 8, mesesSinMov: 0 },
  { producto: "Peine de Carbono", vendido: 12, stock: 50, mesesSinMov: 0 },
  { producto: "Spray Fijador", vendido: 15, stock: 30, mesesSinMov: 0 },
  { producto: "Tónico Capilar", vendido: 18, stock: 25, mesesSinMov: 0 },
  { producto: "Tijeras Profesionales", vendido: 3, stock: 12, mesesSinMov: 2 },
];

const purchaseHistory = [
  { month: "Jul", monto: 1850 },
  { month: "Ago", monto: 2100 },
  { month: "Sep", monto: 1650 },
  { month: "Oct", monto: 2350 },
  { month: "Nov", monto: 2800 },
  { month: "Dic", monto: 3200 },
];

const supplierPurchases = [
  { proveedor: "Distribuidora Hair Pro", monto: 8500, pedidos: 12 },
  { proveedor: "Barbería Supplies", monto: 4200, pedidos: 8 },
  { proveedor: "ImportaShave", monto: 2800, pedidos: 5 },
  { proveedor: "Productos Milano", monto: 1500, pedidos: 3 },
];

const restockProjections = [
  { producto: "Pomada Premium", stockActual: 15, ventaDiaria: 1.5, diasRestantes: 10, urgencia: "alta" },
  { producto: "Aceite para Barba", stockActual: 12, ventaDiaria: 1.3, diasRestantes: 9, urgencia: "alta" },
  { producto: "Shampoo Anticaspa", stockActual: 18, ventaDiaria: 1.1, diasRestantes: 16, urgencia: "media" },
  { producto: "Cera Mate", stockActual: 22, ventaDiaria: 0.9, diasRestantes: 24, urgencia: "baja" },
  { producto: "After Shave Classic", stockActual: 20, ventaDiaria: 0.7, diasRestantes: 28, urgencia: "baja" },
];

const totalInventoryValue = inventoryByCategory.reduce((sum, cat) => sum + cat.valor, 0);

export default function InventoryAnalysisTab() {
  return (
    <div className="space-y-6">
      {/* Inventory Valuation */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="stat-card lg:col-span-2">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Valor Total del Inventario</p>
              <p className="font-display text-4xl text-primary">${totalInventoryValue.toLocaleString()}</p>
              <p className="text-sm text-muted-foreground">535 unidades en stock</p>
            </div>
            <div className="rounded-xl bg-primary/10 p-3">
              <Package className="h-8 w-8 text-primary" />
            </div>
          </div>
        </div>
        <div className="stat-card">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Rotación Promedio</p>
            <p className="font-display text-2xl">1.4x</p>
            <p className="text-xs text-muted-foreground">mensual</p>
          </div>
        </div>
        <div className="stat-card">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Productos Clase A</p>
            <p className="font-display text-2xl">2</p>
            <p className="text-xs text-success">Alta rotación</p>
          </div>
        </div>
      </div>

      {/* Inventory by Category Chart */}
      <div className="card-elevated p-6">
        <div className="mb-4">
          <h3 className="font-display text-lg">Valorización por Categoría</h3>
          <p className="text-sm text-muted-foreground">Desglose del inventario actual</p>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={inventoryByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="categoria" stroke="hsl(var(--muted-foreground))" fontSize={11} angle={-45} textAnchor="end" height={80} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "0.75rem",
                }}
                formatter={(value: number, name: string) => [name === "valor" ? `$${value}` : `${value} uds`, name === "valor" ? "Valor" : "Unidades"]}
              />
              <Bar dataKey="valor" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Product Rotation Table */}
      <div className="card-elevated p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-display text-xl">Rotación de Inventario</h3>
            <p className="text-sm text-muted-foreground">Clasificación ABC automática</p>
          </div>
          <div className="flex gap-2">
            <Badge className="bg-success/20 text-success">A - Alta rotación</Badge>
            <Badge className="bg-warning/20 text-warning">B - Media</Badge>
            <Badge className="bg-muted text-muted-foreground">C - Baja</Badge>
          </div>
        </div>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead className="text-right">Stock Actual</TableHead>
                <TableHead className="text-right">Vendidos/Mes</TableHead>
                <TableHead className="text-right">Tasa Rotación</TableHead>
                <TableHead className="text-right">Días Inventario</TableHead>
                <TableHead className="text-center">Clasificación</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productRotation.map((product) => (
                <TableRow key={product.producto}>
                  <TableCell className="font-medium">{product.producto}</TableCell>
                  <TableCell className="text-right">{product.stock}</TableCell>
                  <TableCell className="text-right">{product.vendido}</TableCell>
                  <TableCell className="text-right">{product.rotacion.toFixed(1)}x</TableCell>
                  <TableCell className="text-right">{product.diasInventario}</TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant={product.clase === "A" ? "default" : "secondary"}
                      className={
                        product.clase === "A" ? "bg-success text-success-foreground" : 
                        product.clase === "B" ? "bg-warning text-warning-foreground" : ""
                      }
                    >
                      {product.clase}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Top Moving vs Slow Moving */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Top Moving Products */}
        <div className="card-elevated p-6">
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-success" />
            <h3 className="font-display text-lg">Productos Estrella</h3>
          </div>
          <div className="space-y-3">
            {topMoving.map((product, i) => (
              <div key={product.producto} className="flex items-center justify-between p-3 rounded-lg bg-success/5 border border-success/20">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-success">{i + 1}</span>
                  <div>
                    <p className="font-medium">{product.producto}</p>
                    <p className="text-sm text-muted-foreground">{product.vendido} vendidos</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${product.ingresos}</p>
                  <div className={`flex items-center gap-1 text-sm ${product.tendencia >= 0 ? "text-success" : "text-destructive"}`}>
                    {product.tendencia >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                    <span>{product.tendencia >= 0 ? "+" : ""}{product.tendencia}%</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Slow Moving Products */}
        <div className="card-elevated p-6">
          <div className="flex items-center gap-2 mb-4">
            <Archive className="h-5 w-5 text-warning" />
            <h3 className="font-display text-lg">Productos de Menor Movimiento</h3>
          </div>
          <div className="space-y-3">
            {slowMoving.map((product, i) => (
              <div key={product.producto} className="flex items-center justify-between p-3 rounded-lg bg-warning/5 border border-warning/20">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-warning">{i + 1}</span>
                  <div>
                    <p className="font-medium">{product.producto}</p>
                    <p className="text-sm text-muted-foreground">Stock: {product.stock} uds</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm">{product.vendido} vendidos/mes</p>
                  {product.mesesSinMov > 0 && (
                    <Badge variant="destructive" className="text-xs">
                      {product.mesesSinMov} meses sin mov.
                    </Badge>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 bg-warning/10 rounded-lg">
            <p className="text-sm text-warning font-medium">⚠️ Inventario Muerto Potencial</p>
            <p className="text-xs text-muted-foreground mt-1">
              Considera hacer promociones o descuentos para estos productos de baja rotación.
            </p>
          </div>
        </div>
      </div>

      {/* Purchase Analysis */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Purchase History */}
        <div className="card-elevated p-6">
          <div className="mb-4">
            <h3 className="font-display text-lg">Histórico de Compras</h3>
            <p className="text-sm text-muted-foreground">Monto mensual invertido</p>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={purchaseHistory}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.75rem",
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "Monto"]}
                />
                <Line type="monotone" dataKey="monto" stroke="hsl(var(--secondary))" strokeWidth={2} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Supplier Purchases */}
        <div className="card-elevated p-6">
          <div className="mb-4">
            <h3 className="font-display text-lg">Compras por Proveedor</h3>
            <p className="text-sm text-muted-foreground">Últimos 6 meses</p>
          </div>
          <div className="space-y-3">
            {supplierPurchases.map((supplier, i) => (
              <div key={supplier.proveedor} className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <div className="flex items-center gap-3">
                  {i === 0 && <Badge variant="default">Principal</Badge>}
                  <p className="font-medium">{supplier.proveedor}</p>
                </div>
                <div className="text-right">
                  <p className="font-semibold">${supplier.monto.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">{supplier.pedidos} pedidos</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Restock Projections */}
      <div className="card-elevated p-6">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="h-5 w-5 text-info" />
          <h3 className="font-display text-xl">Proyecciones de Reabastecimiento</h3>
        </div>
        <p className="text-sm text-muted-foreground mb-4">
          Productos que necesitarán reabastecimiento en los próximos 30 días
        </p>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead className="text-right">Stock Actual</TableHead>
                <TableHead className="text-right">Venta Diaria</TableHead>
                <TableHead className="text-right">Días Restantes</TableHead>
                <TableHead className="text-center">Urgencia</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {restockProjections.map((product) => (
                <TableRow key={product.producto}>
                  <TableCell className="font-medium">{product.producto}</TableCell>
                  <TableCell className="text-right">{product.stockActual}</TableCell>
                  <TableCell className="text-right">{product.ventaDiaria.toFixed(1)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Progress 
                        value={(product.diasRestantes / 30) * 100} 
                        className={`w-16 h-2 ${product.diasRestantes <= 10 ? "[&>div]:bg-destructive" : product.diasRestantes <= 20 ? "[&>div]:bg-warning" : "[&>div]:bg-success"}`}
                      />
                      <span>{product.diasRestantes} días</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge 
                      variant={product.urgencia === "alta" ? "destructive" : product.urgencia === "media" ? "secondary" : "outline"}
                    >
                      {product.urgencia === "alta" ? "🔴 Alta" : product.urgencia === "media" ? "🟡 Media" : "🟢 Baja"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Button size="sm" variant="outline">Crear Pedido</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        
        {/* Info alert */}
        <div className="mt-4 p-4 bg-info/10 rounded-lg border border-info/20">
          <p className="text-sm">
            <strong>📊 Según tu ritmo de venta:</strong> Necesitarás reabastecer <strong>Pomada Premium</strong> en 10 días 
            y <strong>Aceite para Barba</strong> en 9 días. Considera hacer el pedido esta semana.
          </p>
        </div>
        
        <div className="flex justify-end mt-4">
          <Button className="gap-2">
            <Package className="h-4 w-4" />
            Generar Lista de Compras PDF
          </Button>
        </div>
      </div>
    </div>
  );
}
