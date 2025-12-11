import { useState } from "react";
import {
  Package,
  ShoppingCart,
  Settings,
  Trash2,
  RotateCcw,
  Plus,
  Download,
  FileSpreadsheet,
  Calendar,
  Search,
  Eye,
  Printer,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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

const movements = [
  { id: "MOV-001", date: "2024-01-15 14:30", type: "sale", product: "Pomada Premium", productImg: null, quantity: -2, stockBefore: 25, stockAfter: 23, responsible: "Carlos Ruiz", observation: "POS #1234" },
  { id: "MOV-002", date: "2024-01-15 10:00", type: "purchase", product: "Gel Fijador", productImg: null, quantity: 50, stockBefore: 10, stockAfter: 60, responsible: "Admin", observation: "Factura #567" },
  { id: "MOV-003", date: "2024-01-14 16:45", type: "sale", product: "Aceite para Barba", productImg: null, quantity: -1, stockBefore: 15, stockAfter: 14, responsible: "Miguel López", observation: "POS #1233" },
  { id: "MOV-004", date: "2024-01-14 11:20", type: "adjustment", product: "Shampoo Anticaspa", productImg: null, quantity: -3, stockBefore: 48, stockAfter: 45, responsible: "Admin", observation: "Inventario mensual" },
  { id: "MOV-005", date: "2024-01-13 09:00", type: "waste", product: "Cera Moldeadora", productImg: null, quantity: -5, stockBefore: 20, stockAfter: 15, responsible: "Admin", observation: "Vencido" },
  { id: "MOV-006", date: "2024-01-12 15:30", type: "return_customer", product: "Bálsamo para Barba", productImg: null, quantity: 1, stockBefore: 17, stockAfter: 18, responsible: "Carlos Ruiz", observation: "Producto defectuoso" },
  { id: "MOV-007", date: "2024-01-12 12:00", type: "return_supplier", product: "Spray Fijador", productImg: null, quantity: -10, stockBefore: 40, stockAfter: 30, responsible: "Admin", observation: "Lote dañado" },
  { id: "MOV-008", date: "2024-01-11 14:00", type: "internal", product: "Navaja Desechable", productImg: null, quantity: -5, stockBefore: 55, stockAfter: 50, responsible: "Miguel López", observation: "Uso en barbería" },
];

const movementTypes = [
  { value: "purchase", label: "Compra", icon: Package, color: "success" },
  { value: "sale", label: "Venta", icon: ShoppingCart, color: "default" },
  { value: "adjustment", label: "Ajuste", icon: Settings, color: "warning" },
  { value: "waste", label: "Merma", icon: Trash2, color: "destructive" },
  { value: "return_customer", label: "Devolución Cliente", icon: RotateCcw, color: "secondary" },
  { value: "return_supplier", label: "Devolución Proveedor", icon: RotateCcw, color: "secondary" },
  { value: "internal", label: "Uso Interno", icon: Package, color: "outline" },
];

const wasteReasons = ["Vencido", "Dañado", "Perdido", "Robo"];

const chartData = [
  { day: "1", compra: 20, venta: 15, ajuste: 2, merma: 1 },
  { day: "5", compra: 0, venta: 18, ajuste: 0, merma: 0 },
  { day: "10", compra: 35, venta: 22, ajuste: 5, merma: 2 },
  { day: "15", compra: 10, venta: 25, ajuste: 1, merma: 0 },
  { day: "20", compra: 45, venta: 20, ajuste: 3, merma: 1 },
  { day: "25", compra: 0, venta: 28, ajuste: 0, merma: 0 },
  { day: "30", compra: 25, venta: 30, ajuste: 2, merma: 1 },
];

export function MovementsTab() {
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [selectedResponsible, setSelectedResponsible] = useState("all");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMovement, setNewMovement] = useState({
    type: "",
    product: "",
    quantity: "",
    observation: "",
    supplier: "",
    purchasePrice: "",
    totalPaid: "",
    invoiceNumber: "",
    wasteReason: "",
    isAddition: true,
  });

  const getTypeInfo = (type: string) => {
    return movementTypes.find(t => t.value === type) || movementTypes[0];
  };

  const toggleType = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type)
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const filteredMovements = movements.filter(mov => {
    if (selectedTypes.length > 0 && !selectedTypes.includes(mov.type)) return false;
    if (searchProduct && !mov.product.toLowerCase().includes(searchProduct.toLowerCase())) return false;
    if (selectedResponsible !== "all" && mov.responsible !== selectedResponsible) return false;
    return true;
  });

  const totalEntries = filteredMovements.filter(m => m.quantity > 0).reduce((acc, m) => acc + m.quantity, 0);
  const totalExits = Math.abs(filteredMovements.filter(m => m.quantity < 0).reduce((acc, m) => acc + m.quantity, 0));

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-success/10">
                <Package className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Entradas</p>
                <p className="text-2xl font-display text-success">+{totalEntries}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-destructive/10">
                <ShoppingCart className="h-6 w-6 text-destructive" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Salidas</p>
                <p className="text-2xl font-display text-destructive">-{totalExits}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10">
                <Settings className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Valor Total Movimientos</p>
                <p className="text-2xl font-display">$4,580.00</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {movementTypes.map((type) => (
            <Button
              key={type.value}
              variant={selectedTypes.includes(type.value) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleType(type.value)}
              className="gap-2"
            >
              <type.icon className="h-4 w-4" />
              {type.label}
            </Button>
          ))}
        </div>

        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Input
              type="date"
              placeholder="Desde"
              value={dateFrom}
              onChange={(e) => setDateFrom(e.target.value)}
              className="w-40"
            />
            <span className="text-muted-foreground">-</span>
            <Input
              type="date"
              placeholder="Hasta"
              value={dateTo}
              onChange={(e) => setDateTo(e.target.value)}
              className="w-40"
            />
          </div>

          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar producto..."
              className="pl-10"
              value={searchProduct}
              onChange={(e) => setSearchProduct(e.target.value)}
            />
          </div>

          <Select value={selectedResponsible} onValueChange={setSelectedResponsible}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Responsable" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="Admin">Admin</SelectItem>
              <SelectItem value="Carlos Ruiz">Carlos Ruiz</SelectItem>
              <SelectItem value="Miguel López">Miguel López</SelectItem>
            </SelectContent>
          </Select>

          <div className="flex gap-2 ml-auto">
            <Button variant="outline" className="gap-2">
              <FileSpreadsheet className="h-4 w-4" />
              Excel
            </Button>
            <Button variant="outline" className="gap-2">
              <Download className="h-4 w-4" />
              PDF
            </Button>
          </div>
        </div>
      </div>

      {/* Movements Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead>ID</TableHead>
                <TableHead>Fecha y Hora</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Producto</TableHead>
                <TableHead className="text-center">Cantidad</TableHead>
                <TableHead className="text-center">Stock</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Observación</TableHead>
                <TableHead className="text-center">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredMovements.map((mov) => {
                const typeInfo = getTypeInfo(mov.type);
                return (
                  <TableRow key={mov.id}>
                    <TableCell className="font-mono text-sm">{mov.id}</TableCell>
                    <TableCell className="text-sm">{mov.date}</TableCell>
                    <TableCell>
                      <Badge variant={typeInfo.color as any} className="gap-1">
                        <typeInfo.icon className="h-3 w-3" />
                        {typeInfo.label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-muted rounded flex items-center justify-center">
                          <Package className="h-4 w-4 text-muted-foreground" />
                        </div>
                        <span className="text-sm">{mov.product}</span>
                      </div>
                    </TableCell>
                    <TableCell className={`text-center font-semibold ${mov.quantity > 0 ? 'text-success' : 'text-destructive'}`}>
                      {mov.quantity > 0 ? '+' : ''}{mov.quantity}
                    </TableCell>
                    <TableCell className="text-center">
                      <span className="text-muted-foreground">{mov.stockBefore}</span>
                      <span className="mx-1">→</span>
                      <span className="font-semibold">{mov.stockAfter}</span>
                    </TableCell>
                    <TableCell className="text-sm">{mov.responsible}</TableCell>
                    <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">
                      {mov.observation}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center justify-center gap-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Printer className="h-4 w-4" />
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

      {/* Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Movimientos por Tipo (Últimos 30 días)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                <XAxis dataKey="day" className="text-xs" />
                <YAxis className="text-xs" />
                <Tooltip />
                <Legend />
                <Bar dataKey="compra" name="Compra" fill="hsl(var(--success))" stackId="stack" />
                <Bar dataKey="venta" name="Venta" fill="hsl(var(--primary))" stackId="stack" />
                <Bar dataKey="ajuste" name="Ajuste" fill="hsl(var(--warning))" stackId="stack" />
                <Bar dataKey="merma" name="Merma" fill="hsl(var(--destructive))" stackId="stack" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Floating Button */}
      <Button
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-secondary hover:bg-secondary/90"
        onClick={() => setIsModalOpen(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>

      {/* New Movement Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl">Registrar Movimiento</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tipo de Movimiento</Label>
              <div className="grid grid-cols-2 gap-2">
                {movementTypes.slice(0, 4).map((type) => (
                  <Button
                    key={type.value}
                    variant={newMovement.type === type.value ? "default" : "outline"}
                    className="gap-2 justify-start"
                    onClick={() => setNewMovement({ ...newMovement, type: type.value })}
                  >
                    <type.icon className="h-4 w-4" />
                    {type.label}
                  </Button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label>Producto</Label>
              <Input
                placeholder="Buscar producto o escanear código..."
                value={newMovement.product}
                onChange={(e) => setNewMovement({ ...newMovement, product: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label>Cantidad</Label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const current = parseInt(newMovement.quantity) || 0;
                    if (current > 1) setNewMovement({ ...newMovement, quantity: String(current - 1) });
                  }}
                >
                  -
                </Button>
                <Input
                  type="number"
                  className="text-center"
                  value={newMovement.quantity}
                  onChange={(e) => setNewMovement({ ...newMovement, quantity: e.target.value })}
                />
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => {
                    const current = parseInt(newMovement.quantity) || 0;
                    setNewMovement({ ...newMovement, quantity: String(current + 1) });
                  }}
                >
                  +
                </Button>
              </div>
            </div>

            {newMovement.type === "purchase" && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Proveedor</Label>
                    <Input
                      placeholder="Nombre del proveedor"
                      value={newMovement.supplier}
                      onChange={(e) => setNewMovement({ ...newMovement, supplier: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Precio Unitario</Label>
                    <Input
                      type="number"
                      placeholder="$0.00"
                      value={newMovement.purchasePrice}
                      onChange={(e) => setNewMovement({ ...newMovement, purchasePrice: e.target.value })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Total Pagado</Label>
                    <Input
                      type="number"
                      placeholder="$0.00"
                      value={newMovement.totalPaid}
                      onChange={(e) => setNewMovement({ ...newMovement, totalPaid: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Nº Factura</Label>
                    <Input
                      placeholder="FAC-XXXXX"
                      value={newMovement.invoiceNumber}
                      onChange={(e) => setNewMovement({ ...newMovement, invoiceNumber: e.target.value })}
                    />
                  </div>
                </div>
              </>
            )}

            {newMovement.type === "waste" && (
              <div className="space-y-2">
                <Label>Motivo de Merma</Label>
                <Select
                  value={newMovement.wasteReason}
                  onValueChange={(value) => setNewMovement({ ...newMovement, wasteReason: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar motivo" />
                  </SelectTrigger>
                  <SelectContent>
                    {wasteReasons.map((reason) => (
                      <SelectItem key={reason} value={reason}>{reason}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {newMovement.type === "adjustment" && (
              <div className="flex items-center gap-4">
                <Label>Tipo de Ajuste:</Label>
                <div className="flex gap-4">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={newMovement.isAddition}
                      onChange={() => setNewMovement({ ...newMovement, isAddition: true })}
                    />
                    <span className="text-success">Suma (+)</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="radio"
                      checked={!newMovement.isAddition}
                      onChange={() => setNewMovement({ ...newMovement, isAddition: false })}
                    />
                    <span className="text-destructive">Resta (-)</span>
                  </label>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Observaciones</Label>
              <Textarea
                placeholder="Notas adicionales..."
                value={newMovement.observation}
                onChange={(e) => setNewMovement({ ...newMovement, observation: e.target.value })}
              />
            </div>

            {newMovement.product && newMovement.quantity && (
              <div className="p-4 bg-muted/50 rounded-lg">
                <p className="text-sm font-medium">Vista Previa del Cambio:</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Stock actual: <span className="font-semibold">25</span> → 
                  Stock nuevo: <span className="font-semibold text-primary">
                    {25 + (newMovement.type === "purchase" || (newMovement.type === "adjustment" && newMovement.isAddition) ? parseInt(newMovement.quantity) || 0 : -(parseInt(newMovement.quantity) || 0))}
                  </span>
                </p>
              </div>
            )}
          </div>

          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsModalOpen(false)} className="flex-1">
              Cancelar
            </Button>
            <Button className="flex-1 bg-secondary hover:bg-secondary/90">
              Guardar Movimiento
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
