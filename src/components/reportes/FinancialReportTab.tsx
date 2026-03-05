import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  FileSpreadsheet,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
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
import { useFinancialReport } from "@/hooks/useReportData";

export default function FinancialReportTab({ period }: { period: string }) {
  const [compareEnabled, setCompareEnabled] = useState(false);
  const { data, isLoading } = useFinancialReport(period);

  if (isLoading || !data) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-[400px]" />
        <div className="grid gap-6 lg:grid-cols-2"><Skeleton className="h-[340px]" /><Skeleton className="h-[340px]" /></div>
      </div>
    );
  }

  const getDiff = (current: number, previous: number) => {
    if (previous === 0) return { diff: current, pct: "N/A", positive: current >= 0 };
    const diff = current - previous;
    const pct = ((diff / previous) * 100).toFixed(1);
    return { diff, pct, positive: diff >= 0 };
  };

  const c = data.current;
  const p = data.previous;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <Switch id="compare-toggle" checked={compareEnabled} onCheckedChange={setCompareEnabled} />
        <Label htmlFor="compare-toggle" className="cursor-pointer">Comparar con período anterior</Label>
      </div>

      {/* Income Statement */}
      <div className="card-elevated p-6">
        <h3 className="font-display text-xl mb-4">Estado de Resultados</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Concepto</TableHead>
                <TableHead className="text-right">Período Actual</TableHead>
                {compareEnabled && <><TableHead className="text-right">Período Anterior</TableHead><TableHead className="text-right">Diferencia</TableHead></>}
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow className="bg-muted/30">
                <TableCell className="font-semibold">INGRESOS</TableCell>
                <TableCell></TableCell>
                {compareEnabled && <><TableCell></TableCell><TableCell></TableCell></>}
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">Por Servicios</TableCell>
                <TableCell className="text-right">S/ {c.serviceRevenue.toLocaleString()}</TableCell>
                {compareEnabled && <>
                  <TableCell className="text-right text-muted-foreground">S/ {p.serviceRevenue.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{(() => { const d = getDiff(c.serviceRevenue, p.serviceRevenue); return <span className={d.positive ? "text-success" : "text-destructive"}>{d.positive ? "+" : ""}S/ {d.diff.toLocaleString()} ({d.pct}%)</span>; })()}</TableCell>
                </>}
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">Por Productos</TableCell>
                <TableCell className="text-right">S/ {c.productRevenue.toLocaleString()}</TableCell>
                {compareEnabled && <>
                  <TableCell className="text-right text-muted-foreground">S/ {p.productRevenue.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{(() => { const d = getDiff(c.productRevenue, p.productRevenue); return <span className={d.positive ? "text-success" : "text-destructive"}>{d.positive ? "+" : ""}S/ {d.diff.toLocaleString()} ({d.pct}%)</span>; })()}</TableCell>
                </>}
              </TableRow>
              <TableRow className="font-semibold bg-success/10">
                <TableCell>Total Ingresos</TableCell>
                <TableCell className="text-right text-success">S/ {c.totalIngresos.toLocaleString()}</TableCell>
                {compareEnabled && <>
                  <TableCell className="text-right">S/ {p.totalIngresos.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{(() => { const d = getDiff(c.totalIngresos, p.totalIngresos); return <span className={d.positive ? "text-success" : "text-destructive"}>{d.positive ? "+" : ""}S/ {d.diff.toLocaleString()} ({d.pct}%)</span>; })()}</TableCell>
                </>}
              </TableRow>
              <TableRow className="bg-muted/30">
                <TableCell className="font-semibold">COSTOS Y GASTOS</TableCell>
                <TableCell></TableCell>
                {compareEnabled && <><TableCell></TableCell><TableCell></TableCell></>}
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">Costo de Productos Vendidos</TableCell>
                <TableCell className="text-right text-destructive">-S/ {c.productCost.toLocaleString()}</TableCell>
                {compareEnabled && <>
                  <TableCell className="text-right text-muted-foreground">-S/ {p.productCost.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{(() => { const d = getDiff(c.productCost, p.productCost); return <span className={!d.positive ? "text-success" : "text-destructive"}>{d.positive ? "-" : "+"}S/ {Math.abs(d.diff).toLocaleString()}</span>; })()}</TableCell>
                </>}
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">Comisiones de Barberos</TableCell>
                <TableCell className="text-right text-destructive">-S/ {Math.round(c.commissions).toLocaleString()}</TableCell>
                {compareEnabled && <>
                  <TableCell className="text-right text-muted-foreground">-S/ {Math.round(p.commissions).toLocaleString()}</TableCell>
                  <TableCell className="text-right">{(() => { const d = getDiff(c.commissions, p.commissions); return <span className={!d.positive ? "text-success" : "text-destructive"}>{d.positive ? "-" : "+"}S/ {Math.abs(Math.round(d.diff)).toLocaleString()}</span>; })()}</TableCell>
                </>}
              </TableRow>
              <TableRow className="font-semibold">
                <TableCell>Total Costos</TableCell>
                <TableCell className="text-right text-destructive">-S/ {Math.round(c.totalCostos).toLocaleString()}</TableCell>
                {compareEnabled && <>
                  <TableCell className="text-right">-S/ {Math.round(p.totalCostos).toLocaleString()}</TableCell>
                  <TableCell></TableCell>
                </>}
              </TableRow>
              <TableRow className="font-bold text-lg bg-primary/10">
                <TableCell>Utilidad Bruta</TableCell>
                <TableCell className="text-right text-success">S/ {Math.round(c.utilidadBruta).toLocaleString()}</TableCell>
                {compareEnabled && <>
                  <TableCell className="text-right">S/ {Math.round(p.utilidadBruta).toLocaleString()}</TableCell>
                  <TableCell className="text-right">{(() => { const d = getDiff(c.utilidadBruta, p.utilidadBruta); return <span className={d.positive ? "text-success" : "text-destructive"}>{d.positive ? "+" : ""}S/ {Math.round(d.diff).toLocaleString()}</span>; })()}</TableCell>
                </>}
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Margen de Utilidad</TableCell>
                <TableCell className="text-right font-bold text-success">{c.margenUtilidad}%</TableCell>
                {compareEnabled && <>
                  <TableCell className="text-right">{p.margenUtilidad}%</TableCell>
                  <TableCell className="text-right"><span className={Number(c.margenUtilidad) >= Number(p.margenUtilidad) ? "text-success" : "text-destructive"}>{(Number(c.margenUtilidad) - Number(p.margenUtilidad)).toFixed(1)}pp</span></TableCell>
                </>}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card-elevated p-6">
          <div className="mb-4">
            <h3 className="font-display text-lg">Ingresos vs Costos Mensuales</h3>
            <p className="text-sm text-muted-foreground">Últimos meses con datos</p>
          </div>
          <div className="h-[280px]">
            {data.monthlyData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `S/${v}`} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem" }} />
                  <Legend />
                  <Bar dataKey="ingresos" fill="hsl(var(--success))" name="Ingresos" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="costos" fill="hsl(var(--destructive))" name="Costos" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="flex items-center justify-center h-full text-muted-foreground">Sin datos</div>}
          </div>
        </div>

        <div className="card-elevated p-6">
          <div className="mb-4">
            <h3 className="font-display text-lg">Composición de Ingresos</h3>
            <p className="text-sm text-muted-foreground">Servicios vs Productos</p>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data.incomeComposition} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={5} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                  {data.incomeComposition.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value}%`, ""]} contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem" }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {data.incomeComposition.map((item) => (
              <div key={item.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                <span className="text-sm">{item.name}: {item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Payment Methods */}
      <div className="card-elevated p-6">
        <h3 className="font-display text-xl mb-4">Desglose por Método de Pago</h3>
        <div className="grid gap-6 lg:grid-cols-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Método</TableHead>
                <TableHead className="text-right">Transacciones</TableHead>
                <TableHead className="text-right">Monto Total</TableHead>
                <TableHead className="text-right">%</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.paymentMethods.length === 0 && <TableRow><TableCell colSpan={4} className="text-center text-muted-foreground">Sin datos</TableCell></TableRow>}
              {data.paymentMethods.map((method) => (
                <TableRow key={method.metodo}>
                  <TableCell className="font-medium">{method.metodo}</TableCell>
                  <TableCell className="text-right">{method.transacciones}</TableCell>
                  <TableCell className="text-right">S/ {method.monto.toLocaleString()}</TableCell>
                  <TableCell className="text-right"><Badge variant="secondary">{method.porcentaje}%</Badge></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="h-[250px]">
            {data.paymentMethods.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.paymentMethods} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `S/${v}`} />
                  <YAxis type="category" dataKey="metodo" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                  <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "0.75rem" }} />
                  <Bar dataKey="monto" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : <div className="flex items-center justify-center h-full text-muted-foreground">Sin datos</div>}
          </div>
        </div>
      </div>

      {/* Product Profitability */}
      {data.productProfitability.length > 0 && (
        <div className="card-elevated p-6">
          <h3 className="font-display text-xl mb-4">Rentabilidad de Productos</h3>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-right">Cantidad</TableHead>
                  <TableHead className="text-right">P. Costo</TableHead>
                  <TableHead className="text-right">P. Venta</TableHead>
                  <TableHead className="text-right">Margen %</TableHead>
                  <TableHead className="text-right">Utilidad</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.productProfitability.map((product) => (
                  <TableRow key={product.producto}>
                    <TableCell className="font-medium">{product.producto}</TableCell>
                    <TableCell className="text-right">{product.vendido}</TableCell>
                    <TableCell className="text-right">S/ {product.costo}</TableCell>
                    <TableCell className="text-right">S/ {product.venta}</TableCell>
                    <TableCell className="text-right">
                      <Badge variant={product.margenP < 20 ? "destructive" : product.margenP < 40 ? "secondary" : "default"}>{product.margenP.toFixed(1)}%</Badge>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-success">S/ {Math.round(product.utilidad)}</TableCell>
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
