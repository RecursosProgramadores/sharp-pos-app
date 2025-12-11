import { useState } from "react";
import {
  AlertTriangle,
  Clock,
  Calendar,
  Settings,
  FileText,
  ShoppingCart,
  Edit,
  Bell,
  BellOff,
  ChevronDown,
  ChevronUp,
  Package,
  TrendingDown,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const alertProducts = [
  { 
    id: 1, 
    priority: "critical", 
    product: "Cera Moldeadora Premium", 
    image: null, 
    currentStock: 0, 
    minStock: 10, 
    difference: 10, 
    daysSinceRestock: 15, 
    estimatedDepletion: "Agotado",
    avgSales: 3,
    restockTime: 5,
    supplier: "Distribuidora ABC"
  },
  { 
    id: 2, 
    priority: "low", 
    product: "Gel Fijador Fuerte", 
    image: null, 
    currentStock: 5, 
    minStock: 10, 
    difference: 5, 
    daysSinceRestock: 8, 
    estimatedDepletion: "2 días",
    avgSales: 2,
    restockTime: 3,
    supplier: "Proveedor XYZ"
  },
  { 
    id: 3, 
    priority: "low", 
    product: "Aceite para Barba", 
    image: null, 
    currentStock: 8, 
    minStock: 10, 
    difference: 2, 
    daysSinceRestock: 12, 
    estimatedDepletion: "4 días",
    avgSales: 2,
    restockTime: 4,
    supplier: "Distribuidora ABC"
  },
  { 
    id: 4, 
    priority: "expiring", 
    product: "Tinte Capilar Negro", 
    image: null, 
    currentStock: 12, 
    minStock: 5, 
    difference: 0, 
    daysSinceRestock: 30, 
    estimatedDepletion: "Vence en 15 días",
    avgSales: 1,
    restockTime: 7,
    supplier: "Proveedor XYZ"
  },
];

const resolvedAlerts = [
  { id: 1, product: "Pomada Premium", type: "low_stock", activatedAt: "2024-01-10", resolvedAt: "2024-01-12", action: "Reabastecido" },
  { id: 2, product: "Shampoo Anticaspa", type: "expiring", activatedAt: "2024-01-05", resolvedAt: "2024-01-08", action: "Vendido" },
  { id: 3, product: "Navaja Desechable", type: "critical", activatedAt: "2024-01-01", resolvedAt: "2024-01-03", action: "Reabastecido" },
];

const restockProjection = [
  { product: "Cera Moldeadora Premium", avgMonthly: 45, restockTime: 5, safetyStock: 10, suggestedQty: 60 },
  { product: "Gel Fijador Fuerte", avgMonthly: 30, restockTime: 3, safetyStock: 8, suggestedQty: 40 },
  { product: "Aceite para Barba", avgMonthly: 25, restockTime: 4, safetyStock: 6, suggestedQty: 35 },
  { product: "Pomada Premium", avgMonthly: 50, restockTime: 5, safetyStock: 12, suggestedQty: 65 },
];

export function AlertsTab() {
  const [configOpen, setConfigOpen] = useState(false);
  const [notifications, setNotifications] = useState({
    lowStock: true,
    outOfStock: true,
    expiring: true,
  });
  const [notificationFrequency, setNotificationFrequency] = useState("immediate");

  const getPriorityInfo = (priority: string) => {
    switch (priority) {
      case "critical":
        return { icon: "🔴", text: "Crítico", variant: "destructive" as const };
      case "low":
        return { icon: "🟡", text: "Bajo Stock", variant: "warning" as const };
      case "expiring":
        return { icon: "🟠", text: "Por Vencer", variant: "secondary" as const };
      default:
        return { icon: "⚪", text: "Normal", variant: "outline" as const };
    }
  };

  const criticalCount = alertProducts.filter(p => p.priority === "critical").length;
  const lowStockCount = alertProducts.filter(p => p.priority === "low").length;
  const expiringCount = alertProducts.filter(p => p.priority === "expiring").length;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-destructive/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-destructive/10">
                <AlertTriangle className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Críticos (Stock 0)</p>
                <p className="text-2xl font-display text-destructive">{criticalCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-warning/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-warning/10">
                <TrendingDown className="h-6 w-6 text-warning" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Bajo Stock</p>
                <p className="text-2xl font-display text-warning">{lowStockCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="border-secondary/50">
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-secondary/10">
                <Calendar className="h-6 w-6 text-secondary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Próximos a Vencer</p>
                <p className="text-2xl font-display">{expiringCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Productos en Alerta
          </CardTitle>
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
                <TableHead className="text-center">Días sin Reabastecer</TableHead>
                <TableHead>Estimado Agotamiento</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alertProducts.map((item) => {
                const priority = getPriorityInfo(item.priority);
                return (
                  <TableRow key={item.id}>
                    <TableCell>
                      <Badge variant={priority.variant} className="gap-1">
                        <span>{priority.icon}</span>
                        {priority.text}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-muted rounded flex items-center justify-center">
                          <Package className="h-5 w-5 text-muted-foreground" />
                        </div>
                        <span className="font-medium">{item.product}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={item.currentStock === 0 ? "destructive" : "warning"}>
                        {item.currentStock}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">{item.minStock}</TableCell>
                    <TableCell className="text-center font-semibold text-destructive">
                      -{item.difference}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className={item.daysSinceRestock > 10 ? "text-destructive" : ""}>
                        {item.daysSinceRestock} días
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant={item.priority === "critical" ? "destructive" : "outline"}>
                        {item.estimatedDepletion}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="default" size="sm" className="gap-1 bg-secondary hover:bg-secondary/90">
                          <ShoppingCart className="h-4 w-4" />
                          Orden
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Alert Configuration */}
      <Collapsible open={configOpen} onOpenChange={setConfigOpen}>
        <Card>
          <CollapsibleTrigger asChild>
            <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Settings className="h-5 w-5" />
                  Configuración de Alertas
                </CardTitle>
                {configOpen ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
              </div>
            </CardHeader>
          </CollapsibleTrigger>
          <CollapsibleContent>
            <CardContent className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-4">
                  <h4 className="font-semibold">Notificaciones por Email</h4>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <TrendingDown className="h-4 w-4 text-warning" />
                      <Label htmlFor="lowStock">Stock bajo</Label>
                    </div>
                    <Switch
                      id="lowStock"
                      checked={notifications.lowStock}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, lowStock: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4 text-destructive" />
                      <Label htmlFor="outOfStock">Stock agotado</Label>
                    </div>
                    <Switch
                      id="outOfStock"
                      checked={notifications.outOfStock}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, outOfStock: checked })}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-secondary" />
                      <Label htmlFor="expiring">Producto próximo a vencer</Label>
                    </div>
                    <Switch
                      id="expiring"
                      checked={notifications.expiring}
                      onCheckedChange={(checked) => setNotifications({ ...notifications, expiring: checked })}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <h4 className="font-semibold">Frecuencia de Notificaciones</h4>
                  <Select value={notificationFrequency} onValueChange={setNotificationFrequency}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="immediate">Inmediata</SelectItem>
                      <SelectItem value="daily">Diaria (resumen)</SelectItem>
                      <SelectItem value="weekly">Semanal</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="space-y-2">
                    <Label>Umbral de alerta personalizado por categoría</Label>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Pomadas:</span>
                        <Input type="number" defaultValue="10" className="w-20" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Shampoos:</span>
                        <Input type="number" defaultValue="15" className="w-20" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Herramientas:</span>
                        <Input type="number" defaultValue="20" className="w-20" />
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm">Otros:</span>
                        <Input type="number" defaultValue="5" className="w-20" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <Button>Guardar Configuración</Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Card>
      </Collapsible>

      {/* Resolved Alerts History */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Historial de Alertas Resueltas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {resolvedAlerts.map((alert) => (
              <div key={alert.id} className="flex items-center gap-4 p-4 bg-muted/30 rounded-lg">
                <div className="w-2 h-2 rounded-full bg-success" />
                <div className="flex-1">
                  <p className="font-medium">{alert.product}</p>
                  <p className="text-sm text-muted-foreground">
                    Activado: {alert.activatedAt} → Resuelto: {alert.resolvedAt}
                  </p>
                </div>
                <Badge variant="success">{alert.action}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Restock Projection */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Proyección de Reabastecimiento
            </CardTitle>
            <Button className="gap-2 bg-secondary hover:bg-secondary/90">
              <Download className="h-4 w-4" />
              Generar Lista de Compras
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>Producto</TableHead>
                <TableHead className="text-center">Venta Promedio Mensual</TableHead>
                <TableHead className="text-center">Tiempo de Entrega (días)</TableHead>
                <TableHead className="text-center">Stock de Seguridad</TableHead>
                <TableHead className="text-center">Cantidad Sugerida</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {restockProjection.map((item, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{item.product}</TableCell>
                  <TableCell className="text-center">{item.avgMonthly} uds.</TableCell>
                  <TableCell className="text-center">{item.restockTime} días</TableCell>
                  <TableCell className="text-center">{item.safetyStock} uds.</TableCell>
                  <TableCell className="text-center">
                    <Badge variant="default" className="text-lg px-3 py-1">
                      {item.suggestedQty} uds.
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
