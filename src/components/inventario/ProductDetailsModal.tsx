import { useState } from "react";
import { Package, Edit, QrCode, TrendingUp, History, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface Product {
  id: number;
  name: string;
  sku: string;
  barcode: string;
  category: string;
  stock: number;
  minStock: number;
  price: number;
  cost: number;
  image?: string;
  status: string;
}

interface ProductDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

const movementHistory = [
  { id: 1, date: "2024-01-15 14:30", type: "Venta", quantity: -2, responsible: "Carlos", observation: "POS #1234" },
  { id: 2, date: "2024-01-14 10:00", type: "Compra", quantity: 20, responsible: "Admin", observation: "Factura #567" },
  { id: 3, date: "2024-01-13 16:45", type: "Venta", quantity: -1, responsible: "Miguel", observation: "POS #1233" },
  { id: 4, date: "2024-01-12 11:20", type: "Ajuste", quantity: -3, responsible: "Admin", observation: "Merma - Vencido" },
  { id: 5, date: "2024-01-11 09:00", type: "Venta", quantity: -2, responsible: "Carlos", observation: "POS #1232" },
];

const salesData = [
  { month: "Ago", units: 45 },
  { month: "Sep", units: 52 },
  { month: "Oct", units: 48 },
  { month: "Nov", units: 61 },
  { month: "Dic", units: 55 },
  { month: "Ene", units: 58 },
];

const stockAdjustments = [
  { id: 1, date: "2024-01-12", reason: "Vencido", quantity: -3, responsible: "Admin" },
  { id: 2, date: "2024-01-05", reason: "Error de conteo", quantity: 2, responsible: "Admin" },
  { id: 3, date: "2023-12-20", reason: "Dañado", quantity: -1, responsible: "Miguel" },
];

export function ProductDetailsModal({ open, onOpenChange, product }: ProductDetailsModalProps) {
  const [adjustmentQuantity, setAdjustmentQuantity] = useState("");
  const [adjustmentReason, setAdjustmentReason] = useState("");

  if (!product) return null;

  const getStatusBadge = () => {
    if (product.stock === 0) return { text: "Agotado", variant: "destructive" as const };
    if (product.stock < product.minStock) return { text: "Bajo Stock", variant: "warning" as const };
    return { text: "Disponible", variant: "success" as const };
  };

  const status = getStatusBadge();
  const margin = ((product.price - product.cost) / product.price * 100).toFixed(1);
  const totalSold = salesData.reduce((acc, curr) => acc + curr.units, 0);
  const totalRevenue = totalSold * product.price;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Detalles del Producto</DialogTitle>
        </DialogHeader>

        {/* Header del Producto */}
        <div className="flex flex-col md:flex-row gap-6 pb-6 border-b">
          <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
            {product.image ? (
              <img src={product.image} alt={product.name} className="w-full h-full object-cover rounded-lg" />
            ) : (
              <Package className="h-16 w-16 text-muted-foreground" />
            )}
          </div>
          
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-2xl">{product.name}</h2>
                <p className="text-muted-foreground">SKU: {product.sku} | Código: {product.barcode}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant={status.variant}>{status.text}</Badge>
                <Badge variant="outline">{product.category}</Badge>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-display text-primary">${product.price.toFixed(2)}</p>
                <p className="text-xs text-muted-foreground">Precio Venta</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-display">{product.stock}</p>
                <p className="text-xs text-muted-foreground">Stock Actual</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-display text-success">{margin}%</p>
                <p className="text-xs text-muted-foreground">Margen</p>
              </div>
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-display">{totalSold}</p>
                <p className="text-xs text-muted-foreground">Vendidos (6 meses)</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs de Contenido */}
        <Tabs defaultValue="info" className="mt-4">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="info" className="gap-2">
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">Info</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="gap-2">
              <History className="h-4 w-4" />
              <span className="hidden sm:inline">Historial</span>
            </TabsTrigger>
            <TabsTrigger value="stats" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              <span className="hidden sm:inline">Estadísticas</span>
            </TabsTrigger>
            <TabsTrigger value="stock" className="gap-2">
              <Settings className="h-4 w-4" />
              <span className="hidden sm:inline">Stock</span>
            </TabsTrigger>
          </TabsList>

          {/* Tab: Información General */}
          <TabsContent value="info" className="mt-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nombre del Producto</Label>
                <Input defaultValue={product.name} />
              </div>
              <div className="space-y-2">
                <Label>Categoría</Label>
                <Input defaultValue={product.category} />
              </div>
              <div className="space-y-2">
                <Label>Precio de Costo</Label>
                <Input type="number" defaultValue={product.cost} />
              </div>
              <div className="space-y-2">
                <Label>Precio de Venta</Label>
                <Input type="number" defaultValue={product.price} />
              </div>
              <div className="space-y-2">
                <Label>SKU</Label>
                <Input defaultValue={product.sku} />
              </div>
              <div className="space-y-2">
                <Label>Código de Barras</Label>
                <Input defaultValue={product.barcode} />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" className="gap-2">
                <QrCode className="h-4 w-4" />
                Generar Código QR
              </Button>
              <Button>Guardar Cambios</Button>
            </div>
          </TabsContent>

          {/* Tab: Historial de Movimientos */}
          <TabsContent value="history" className="mt-4">
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha y Hora</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-center">Cantidad</TableHead>
                    <TableHead>Responsable</TableHead>
                    <TableHead>Observación</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {movementHistory.map((mov) => (
                    <TableRow key={mov.id}>
                      <TableCell className="text-sm">{mov.date}</TableCell>
                      <TableCell>
                        <Badge variant={
                          mov.type === "Venta" ? "default" :
                          mov.type === "Compra" ? "success" : "warning"
                        }>
                          {mov.type}
                        </Badge>
                      </TableCell>
                      <TableCell className={`text-center font-semibold ${mov.quantity > 0 ? 'text-success' : 'text-destructive'}`}>
                        {mov.quantity > 0 ? '+' : ''}{mov.quantity}
                      </TableCell>
                      <TableCell>{mov.responsible}</TableCell>
                      <TableCell className="text-muted-foreground text-sm">{mov.observation}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* Tab: Estadísticas de Venta */}
          <TabsContent value="stats" className="mt-4 space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <p className="text-2xl font-display">{totalSold}</p>
                <p className="text-sm text-muted-foreground">Total Vendido</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <p className="text-2xl font-display text-success">${totalRevenue.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Ingresos Generados</p>
              </div>
              <div className="p-4 bg-muted/50 rounded-lg text-center">
                <p className="text-2xl font-display">${product.price.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground">Ticket Promedio</p>
              </div>
            </div>

            <div className="h-64">
              <p className="text-sm font-medium mb-2">Unidades Vendidas (Últimos 6 meses)</p>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={salesData}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                  <XAxis dataKey="month" className="text-xs" />
                  <YAxis className="text-xs" />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="units" 
                    stroke="hsl(var(--primary))" 
                    strokeWidth={2}
                    dot={{ fill: "hsl(var(--primary))" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          {/* Tab: Configuración de Stock */}
          <TabsContent value="stock" className="mt-4 space-y-6">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Stock Actual</Label>
                <Input type="number" defaultValue={product.stock} />
              </div>
              <div className="space-y-2">
                <Label>Stock Mínimo</Label>
                <Input type="number" defaultValue={product.minStock} />
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-4">Registrar Ajuste de Stock</h4>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Cantidad (+ o -)</Label>
                  <Input
                    type="number"
                    placeholder="Ej: -5 o +10"
                    value={adjustmentQuantity}
                    onChange={(e) => setAdjustmentQuantity(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Motivo</Label>
                  <Input
                    placeholder="Ej: Vencido, Error de conteo..."
                    value={adjustmentReason}
                    onChange={(e) => setAdjustmentReason(e.target.value)}
                  />
                </div>
                <div className="flex items-end">
                  <Button className="w-full">Registrar Ajuste</Button>
                </div>
              </div>
            </div>

            <div className="border-t pt-4">
              <h4 className="font-semibold mb-4">Historial de Ajustes</h4>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Motivo</TableHead>
                      <TableHead className="text-center">Cantidad</TableHead>
                      <TableHead>Responsable</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {stockAdjustments.map((adj) => (
                      <TableRow key={adj.id}>
                        <TableCell>{adj.date}</TableCell>
                        <TableCell>{adj.reason}</TableCell>
                        <TableCell className={`text-center font-semibold ${adj.quantity > 0 ? 'text-success' : 'text-destructive'}`}>
                          {adj.quantity > 0 ? '+' : ''}{adj.quantity}
                        </TableCell>
                        <TableCell>{adj.responsible}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
