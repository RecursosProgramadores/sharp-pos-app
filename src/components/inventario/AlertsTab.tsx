import {
  AlertTriangle, Calendar, Package, TrendingDown, ShoppingCart,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useProducts } from "@/hooks/useInventory";
import { Skeleton } from "@/components/ui/skeleton";

export function AlertsTab() {
  const { data: products = [], isLoading } = useProducts();

  const outOfStock = products.filter(p => p.stock === 0 && p.active);
  const lowStock = products.filter(p => p.stock > 0 && p.stock < p.min_stock && p.active);
  const allAlerts = [...outOfStock.map(p => ({ ...p, priority: "critical" as const })),
    ...lowStock.map(p => ({ ...p, priority: "low" as const }))];

  if (isLoading) return <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-destructive/10"><AlertTriangle className="h-6 w-6 text-destructive" /></div>
              <div><p className="text-sm text-muted-foreground">Críticos (Stock 0)</p><p className="text-2xl font-display text-destructive">{outOfStock.length}</p></div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-warning/10"><TrendingDown className="h-6 w-6 text-warning" /></div>
              <div><p className="text-sm text-muted-foreground">Bajo Stock</p><p className="text-2xl font-display text-warning">{lowStock.length}</p></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10"><Package className="h-6 w-6 text-primary" /></div>
              <div><p className="text-sm text-muted-foreground">Total Productos</p><p className="text-2xl font-display">{products.filter(p => p.active).length}</p></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Table */}
      {allAlerts.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Package className="h-12 w-12 mx-auto text-success mb-4" />
            <h3 className="text-lg font-semibold text-success">¡Todo en orden!</h3>
            <p className="text-muted-foreground">No hay productos con stock bajo o agotado</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><AlertTriangle className="h-5 w-5 text-warning" />Productos en Alerta</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="w-20">Prioridad</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-center">Stock Actual</TableHead>
                  <TableHead className="text-center">Stock Mínimo</TableHead>
                  <TableHead className="text-center">Faltante</TableHead>
                  <TableHead>Categoría</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {allAlerts.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Badge variant={item.priority === "critical" ? "destructive" : "warning"}>
                        {item.priority === "critical" ? "🔴 Crítico" : "🟡 Bajo"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-muted rounded flex items-center justify-center overflow-hidden">
                          {item.photo_url ? <img src={item.photo_url} className="w-full h-full object-cover" /> : <Package className="h-5 w-5 text-muted-foreground" />}
                        </div>
                        <span className="font-medium">{item.name}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={item.stock === 0 ? "destructive" : "warning"}>{item.stock}</Badge>
                    </TableCell>
                    <TableCell className="text-center">{item.min_stock}</TableCell>
                    <TableCell className="text-center font-semibold text-destructive">-{item.min_stock - item.stock}</TableCell>
                    <TableCell><Badge variant="outline">{item.category}</Badge></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
