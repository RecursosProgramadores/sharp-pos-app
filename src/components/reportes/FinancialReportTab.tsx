import { useState } from "react";
import {
  TrendingUp,
  TrendingDown,
  Download,
  FileSpreadsheet,
  FileText,
  ToggleLeft,
  ToggleRight,
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

const monthlyFinanceData = [
  { month: "Ene", ingresos: 12400, costos: 4000 },
  { month: "Feb", ingresos: 11398, costos: 3800 },
  { month: "Mar", ingresos: 15800, costos: 4200 },
  { month: "Abr", ingresos: 13908, costos: 3900 },
  { month: "May", ingresos: 16800, costos: 4500 },
  { month: "Jun", ingresos: 19300, costos: 5100 },
  { month: "Jul", ingresos: 18200, costos: 4800 },
  { month: "Ago", ingresos: 20500, costos: 5400 },
  { month: "Sep", ingresos: 17600, costos: 4600 },
  { month: "Oct", ingresos: 21200, costos: 5600 },
  { month: "Nov", ingresos: 23400, costos: 6100 },
  { month: "Dic", ingresos: 26740, costos: 7020 },
];

const incomeComposition = [
  { name: "Servicios", value: 78, color: "hsl(var(--primary))" },
  { name: "Productos", value: 22, color: "hsl(var(--secondary))" },
];

const paymentMethods = [
  { metodo: "Efectivo", transacciones: 285, monto: 12450, porcentaje: 46.6 },
  { metodo: "Tarjeta Débito", transacciones: 98, monto: 5680, porcentaje: 21.2 },
  { metodo: "Tarjeta Crédito", transacciones: 65, monto: 4320, porcentaje: 16.2 },
  { metodo: "Transferencia", transacciones: 42, monto: 2560, porcentaje: 9.6 },
  { metodo: "Wallet Digital", transacciones: 34, monto: 1730, porcentaje: 6.4 },
];

const productProfitability = [
  { producto: "Pomada Premium", vendido: 45, costo: 8, venta: 15, margenP: 46.7, utilidad: 315 },
  { producto: "Aceite para Barba", vendido: 38, costo: 10, venta: 15, margenP: 33.3, utilidad: 190 },
  { producto: "Shampoo Anticaspa", vendido: 32, costo: 6, venta: 12, margenP: 50.0, utilidad: 192 },
  { producto: "Cera Mate", vendido: 28, costo: 7, venta: 12, margenP: 41.7, utilidad: 140 },
  { producto: "Gel Extra Fuerte", vendido: 25, costo: 4, venta: 8, margenP: 50.0, utilidad: 100 },
  { producto: "After Shave Classic", vendido: 22, costo: 6, venta: 12, margenP: 50.0, utilidad: 132 },
  { producto: "Tónico Capilar", vendido: 18, costo: 8, venta: 15, margenP: 46.7, utilidad: 126 },
  { producto: "Spray Fijador", vendido: 15, costo: 5, venta: 12, margenP: 58.3, utilidad: 105 },
  { producto: "Peine de Carbono", vendido: 12, costo: 3, venta: 12, margenP: 75.0, utilidad: 108 },
  { producto: "Navaja de Afeitar", vendido: 8, costo: 15, venta: 25, margenP: 40.0, utilidad: 80 },
];

const incomeStatement = {
  current: {
    servicios: {
      cortes: 15680,
      barbas: 3240,
      tratamientos: 2890,
      otros: 1380,
    },
    productos: {
      pomadas: 1850,
      aceites: 1280,
      shampoos: 980,
      otros: 490,
    },
    totalIngresos: 26740,
    costos: {
      productoVendido: 2150,
      comisiones: 4200,
      totalCostos: 6350,
    },
    utilidadBruta: 20390,
    margenUtilidad: 76.3,
  },
  previous: {
    servicios: {
      cortes: 13450,
      barbas: 2890,
      tratamientos: 2480,
      otros: 1180,
    },
    productos: {
      pomadas: 1520,
      aceites: 1080,
      shampoos: 820,
      otros: 380,
    },
    totalIngresos: 23800,
    costos: {
      productoVendido: 1850,
      comisiones: 3700,
      totalCostos: 5550,
    },
    utilidadBruta: 18250,
    margenUtilidad: 76.7,
  },
};

export default function FinancialReportTab() {
  const [compareEnabled, setCompareEnabled] = useState(false);

  const getDiff = (current: number, previous: number) => {
    const diff = current - previous;
    const pct = ((diff / previous) * 100).toFixed(1);
    return { diff, pct, positive: diff >= 0 };
  };

  return (
    <div className="space-y-6">
      {/* Compare Toggle */}
      <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
        <Switch
          id="compare-toggle"
          checked={compareEnabled}
          onCheckedChange={setCompareEnabled}
        />
        <Label htmlFor="compare-toggle" className="cursor-pointer">
          Comparar con período anterior
        </Label>
      </div>

      {/* Income Statement */}
      <div className="card-elevated p-6">
        <h3 className="font-display text-xl mb-4">Estado de Resultados Simplificado</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[250px]">Concepto</TableHead>
                <TableHead className="text-right">Período Actual</TableHead>
                {compareEnabled && (
                  <>
                    <TableHead className="text-right">Período Anterior</TableHead>
                    <TableHead className="text-right">Diferencia</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {/* Income Section */}
              <TableRow className="bg-muted/30">
                <TableCell className="font-semibold">INGRESOS</TableCell>
                <TableCell></TableCell>
                {compareEnabled && <><TableCell></TableCell><TableCell></TableCell></>}
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">Por Servicios</TableCell>
                <TableCell className="text-right">
                  ${(incomeStatement.current.servicios.cortes + incomeStatement.current.servicios.barbas + incomeStatement.current.servicios.tratamientos + incomeStatement.current.servicios.otros).toLocaleString()}
                </TableCell>
                {compareEnabled && (
                  <>
                    <TableCell className="text-right text-muted-foreground">
                      ${(incomeStatement.previous.servicios.cortes + incomeStatement.previous.servicios.barbas + incomeStatement.previous.servicios.tratamientos + incomeStatement.previous.servicios.otros).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {(() => {
                        const curr = incomeStatement.current.servicios.cortes + incomeStatement.current.servicios.barbas + incomeStatement.current.servicios.tratamientos + incomeStatement.current.servicios.otros;
                        const prev = incomeStatement.previous.servicios.cortes + incomeStatement.previous.servicios.barbas + incomeStatement.previous.servicios.tratamientos + incomeStatement.previous.servicios.otros;
                        const d = getDiff(curr, prev);
                        return (
                          <span className={d.positive ? "text-success" : "text-destructive"}>
                            {d.positive ? "+" : ""}${d.diff.toLocaleString()} ({d.pct}%)
                          </span>
                        );
                      })()}
                    </TableCell>
                  </>
                )}
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">Por Productos</TableCell>
                <TableCell className="text-right">
                  ${(incomeStatement.current.productos.pomadas + incomeStatement.current.productos.aceites + incomeStatement.current.productos.shampoos + incomeStatement.current.productos.otros).toLocaleString()}
                </TableCell>
                {compareEnabled && (
                  <>
                    <TableCell className="text-right text-muted-foreground">
                      ${(incomeStatement.previous.productos.pomadas + incomeStatement.previous.productos.aceites + incomeStatement.previous.productos.shampoos + incomeStatement.previous.productos.otros).toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      {(() => {
                        const curr = incomeStatement.current.productos.pomadas + incomeStatement.current.productos.aceites + incomeStatement.current.productos.shampoos + incomeStatement.current.productos.otros;
                        const prev = incomeStatement.previous.productos.pomadas + incomeStatement.previous.productos.aceites + incomeStatement.previous.productos.shampoos + incomeStatement.previous.productos.otros;
                        const d = getDiff(curr, prev);
                        return (
                          <span className={d.positive ? "text-success" : "text-destructive"}>
                            {d.positive ? "+" : ""}${d.diff.toLocaleString()} ({d.pct}%)
                          </span>
                        );
                      })()}
                    </TableCell>
                  </>
                )}
              </TableRow>
              <TableRow className="font-semibold bg-success/10">
                <TableCell>Total Ingresos</TableCell>
                <TableCell className="text-right text-success">${incomeStatement.current.totalIngresos.toLocaleString()}</TableCell>
                {compareEnabled && (
                  <>
                    <TableCell className="text-right">${incomeStatement.previous.totalIngresos.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      {(() => {
                        const d = getDiff(incomeStatement.current.totalIngresos, incomeStatement.previous.totalIngresos);
                        return (
                          <span className={d.positive ? "text-success" : "text-destructive"}>
                            {d.positive ? "+" : ""}${d.diff.toLocaleString()} ({d.pct}%)
                          </span>
                        );
                      })()}
                    </TableCell>
                  </>
                )}
              </TableRow>

              {/* Costs Section */}
              <TableRow className="bg-muted/30">
                <TableCell className="font-semibold">COSTOS Y GASTOS</TableCell>
                <TableCell></TableCell>
                {compareEnabled && <><TableCell></TableCell><TableCell></TableCell></>}
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">Costo de Productos Vendidos</TableCell>
                <TableCell className="text-right text-destructive">-${incomeStatement.current.costos.productoVendido.toLocaleString()}</TableCell>
                {compareEnabled && (
                  <>
                    <TableCell className="text-right text-muted-foreground">-${incomeStatement.previous.costos.productoVendido.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      {(() => {
                        const d = getDiff(incomeStatement.current.costos.productoVendido, incomeStatement.previous.costos.productoVendido);
                        return (
                          <span className={!d.positive ? "text-success" : "text-destructive"}>
                            {d.positive ? "-" : "+"}${Math.abs(d.diff).toLocaleString()} ({d.pct}%)
                          </span>
                        );
                      })()}
                    </TableCell>
                  </>
                )}
              </TableRow>
              <TableRow>
                <TableCell className="pl-6">Comisiones de Barberos</TableCell>
                <TableCell className="text-right text-destructive">-${incomeStatement.current.costos.comisiones.toLocaleString()}</TableCell>
                {compareEnabled && (
                  <>
                    <TableCell className="text-right text-muted-foreground">-${incomeStatement.previous.costos.comisiones.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      {(() => {
                        const d = getDiff(incomeStatement.current.costos.comisiones, incomeStatement.previous.costos.comisiones);
                        return (
                          <span className={!d.positive ? "text-success" : "text-destructive"}>
                            {d.positive ? "-" : "+"}${Math.abs(d.diff).toLocaleString()} ({d.pct}%)
                          </span>
                        );
                      })()}
                    </TableCell>
                  </>
                )}
              </TableRow>
              <TableRow className="font-semibold">
                <TableCell>Total Costos</TableCell>
                <TableCell className="text-right text-destructive">-${incomeStatement.current.costos.totalCostos.toLocaleString()}</TableCell>
                {compareEnabled && (
                  <>
                    <TableCell className="text-right">-${incomeStatement.previous.costos.totalCostos.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      {(() => {
                        const d = getDiff(incomeStatement.current.costos.totalCostos, incomeStatement.previous.costos.totalCostos);
                        return (
                          <span className={!d.positive ? "text-success" : "text-destructive"}>
                            {d.positive ? "-" : "+"}${Math.abs(d.diff).toLocaleString()} ({d.pct}%)
                          </span>
                        );
                      })()}
                    </TableCell>
                  </>
                )}
              </TableRow>

              {/* Gross Profit */}
              <TableRow className="font-bold text-lg bg-primary/10">
                <TableCell>Utilidad Bruta</TableCell>
                <TableCell className="text-right text-success">${incomeStatement.current.utilidadBruta.toLocaleString()}</TableCell>
                {compareEnabled && (
                  <>
                    <TableCell className="text-right">${incomeStatement.previous.utilidadBruta.toLocaleString()}</TableCell>
                    <TableCell className="text-right">
                      {(() => {
                        const d = getDiff(incomeStatement.current.utilidadBruta, incomeStatement.previous.utilidadBruta);
                        return (
                          <span className={d.positive ? "text-success" : "text-destructive"}>
                            {d.positive ? "+" : ""}${d.diff.toLocaleString()} ({d.pct}%)
                          </span>
                        );
                      })()}
                    </TableCell>
                  </>
                )}
              </TableRow>
              <TableRow>
                <TableCell className="font-semibold">Margen de Utilidad</TableCell>
                <TableCell className="text-right font-bold text-success">{incomeStatement.current.margenUtilidad}%</TableCell>
                {compareEnabled && (
                  <>
                    <TableCell className="text-right">{incomeStatement.previous.margenUtilidad}%</TableCell>
                    <TableCell className="text-right">
                      {(() => {
                        const d = incomeStatement.current.margenUtilidad - incomeStatement.previous.margenUtilidad;
                        return (
                          <span className={d >= 0 ? "text-success" : "text-destructive"}>
                            {d >= 0 ? "+" : ""}{d.toFixed(1)}pp
                          </span>
                        );
                      })()}
                    </TableCell>
                  </>
                )}
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Monthly Income vs Costs */}
        <div className="card-elevated p-6">
          <div className="mb-4">
            <h3 className="font-display text-lg">Ingresos vs Costos Mensuales</h3>
            <p className="text-sm text-muted-foreground">Últimos 12 meses</p>
          </div>
          <div className="h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyFinanceData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.75rem",
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, ""]}
                />
                <Legend />
                <Bar dataKey="ingresos" fill="hsl(var(--success))" name="Ingresos" radius={[4, 4, 0, 0]} />
                <Bar dataKey="costos" fill="hsl(var(--destructive))" name="Costos" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Income Composition */}
        <div className="card-elevated p-6">
          <div className="mb-4">
            <h3 className="font-display text-lg">Composición de Ingresos</h3>
            <p className="text-sm text-muted-foreground">Servicios vs Productos</p>
          </div>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={incomeComposition}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {incomeComposition.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value}%`, ""]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.75rem",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-6 mt-4">
            {incomeComposition.map((item) => (
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
                <TableHead className="text-right">% del Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paymentMethods.map((method) => (
                <TableRow key={method.metodo}>
                  <TableCell className="font-medium">{method.metodo}</TableCell>
                  <TableCell className="text-right">{method.transacciones}</TableCell>
                  <TableCell className="text-right">${method.monto.toLocaleString()}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant="secondary">{method.porcentaje}%</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={paymentMethods} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis type="number" stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                <YAxis type="category" dataKey="metodo" stroke="hsl(var(--muted-foreground))" fontSize={12} width={100} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "0.75rem",
                  }}
                  formatter={(value: number) => [`$${value.toLocaleString()}`, "Monto"]}
                />
                <Bar dataKey="monto" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Product Profitability */}
      <div className="card-elevated p-6">
        <h3 className="font-display text-xl mb-4">Análisis de Rentabilidad de Productos</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Producto</TableHead>
                <TableHead className="text-right">Cantidad</TableHead>
                <TableHead className="text-right">P. Costo</TableHead>
                <TableHead className="text-right">P. Venta</TableHead>
                <TableHead className="text-right">Margen $</TableHead>
                <TableHead className="text-right">Margen %</TableHead>
                <TableHead className="text-right">Utilidad Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {productProfitability.sort((a, b) => b.utilidad - a.utilidad).map((product) => (
                <TableRow key={product.producto} className={product.margenP < 20 ? "bg-warning/10" : ""}>
                  <TableCell className="font-medium">{product.producto}</TableCell>
                  <TableCell className="text-right">{product.vendido}</TableCell>
                  <TableCell className="text-right">${product.costo}</TableCell>
                  <TableCell className="text-right">${product.venta}</TableCell>
                  <TableCell className="text-right">${product.venta - product.costo}</TableCell>
                  <TableCell className="text-right">
                    <Badge variant={product.margenP < 20 ? "destructive" : product.margenP < 40 ? "secondary" : "default"}>
                      {product.margenP.toFixed(1)}%
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right font-semibold text-success">${product.utilidad}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="flex justify-end gap-2">
        <Button variant="outline" className="gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Exportar a Excel
        </Button>
        <Button className="gap-2">
          <FileText className="h-4 w-4" />
          Generar Reporte Contable PDF
        </Button>
      </div>
    </div>
  );
}
