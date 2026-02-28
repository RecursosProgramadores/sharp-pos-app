import { useState } from "react";
import {
  Package, ShoppingCart, Settings, Trash2, RotateCcw, Plus, Calendar, Search, Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useStockMovements, useCreateMovement, useProducts } from "@/hooks/useInventory";
import { Skeleton } from "@/components/ui/skeleton";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { FileSpreadsheet, Download } from "lucide-react";

const movementTypes = [
  { value: "purchase", label: "Compra", icon: Package, color: "success" },
  { value: "sale", label: "Venta", icon: ShoppingCart, color: "default" },
  { value: "adjustment", label: "Ajuste", icon: Settings, color: "warning" },
  { value: "waste", label: "Merma", icon: Trash2, color: "destructive" },
  { value: "return", label: "Devolución", icon: RotateCcw, color: "secondary" },
  { value: "internal", label: "Uso Interno", icon: Package, color: "outline" },
];

export function MovementsTab() {
  const { data: movements = [], isLoading } = useStockMovements();
  const { data: products = [] } = useProducts();
  const createMovement = useCreateMovement();
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [searchProduct, setSearchProduct] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMov, setNewMov] = useState({ type: "", product_id: "", quantity: "", reason: "" });

  const getTypeInfo = (type: string) => movementTypes.find(t => t.value === type) || movementTypes[0];

  const filteredMovements = movements.filter(mov => {
    if (selectedTypes.length > 0 && !selectedTypes.includes(mov.type)) return false;
    if (searchProduct && !(mov.product?.name || "").toLowerCase().includes(searchProduct.toLowerCase())) return false;
    if (dateFrom && new Date(mov.created_at) < new Date(dateFrom)) return false;
    if (dateTo && new Date(mov.created_at) > new Date(dateTo + "T23:59:59")) return false;
    return true;
  });

  const totalEntries = filteredMovements.filter(m => m.quantity > 0).reduce((a, m) => a + m.quantity, 0);
  const totalExits = Math.abs(filteredMovements.filter(m => m.quantity < 0).reduce((a, m) => a + m.quantity, 0));

  const handleExportExcel = () => {
    const data = filteredMovements.map(m => ({
      Fecha: new Date(m.created_at).toLocaleString(),
      Tipo: getTypeInfo(m.type).label,
      Producto: m.product?.name || "-",
      Cantidad: m.quantity,
      "Stock Antes": m.stock_before,
      "Stock Después": m.stock_after,
      Responsable: m.responsible || "-",
      Motivo: m.reason || "-",
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Movimientos");
    XLSX.writeFile(wb, `Movimientos_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Reporte de Movimientos de Inventario", 14, 20);
    doc.setFontSize(10);
    doc.text(`Generado: ${new Date().toLocaleString()}`, 14, 28);

    autoTable(doc, {
      startY: 35,
      head: [["Fecha", "Tipo", "Producto", "Cantidad", "Stock", "Motivo"]],
      body: filteredMovements.map(m => [
        new Date(m.created_at).toLocaleDateString(),
        getTypeInfo(m.type).label,
        m.product?.name || "-",
        m.quantity.toString(),
        `${m.stock_before} → ${m.stock_after}`,
        m.reason || "-",
      ]),
      styles: { fontSize: 8 },
      headStyles: { fillColor: [41, 37, 36] },
    });

    doc.save(`Movimientos_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  const handleSaveMovement = async () => {
    if (!newMov.type || !newMov.product_id || !newMov.quantity) return;
    const qty = parseInt(newMov.quantity);
    const finalQty = ["sale", "waste", "internal"].includes(newMov.type) ? -Math.abs(qty) : Math.abs(qty);
    await createMovement.mutateAsync({
      product_id: newMov.product_id,
      type: newMov.type,
      quantity: finalQty,
      reason: newMov.reason || undefined,
      responsible: "Admin",
    });
    setNewMov({ type: "", product_id: "", quantity: "", reason: "" });
    setIsModalOpen(false);
  };

  if (isLoading) return <div className="space-y-4">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-20" />)}</div>;

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-success/10"><Package className="h-6 w-6 text-success" /></div>
              <div><p className="text-sm text-muted-foreground">Total Entradas</p><p className="text-2xl font-display text-success">+{totalEntries}</p></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-destructive/10"><ShoppingCart className="h-6 w-6 text-destructive" /></div>
              <div><p className="text-sm text-muted-foreground">Total Salidas</p><p className="text-2xl font-display text-destructive">-{totalExits}</p></div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-primary/10"><Settings className="h-6 w-6 text-primary" /></div>
              <div><p className="text-sm text-muted-foreground">Total Movimientos</p><p className="text-2xl font-display">{filteredMovements.length}</p></div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-2">
          {movementTypes.map((type) => (
            <Button key={type.value} variant={selectedTypes.includes(type.value) ? "default" : "outline"} size="sm"
              onClick={() => setSelectedTypes(prev => prev.includes(type.value) ? prev.filter(t => t !== type.value) : [...prev, type.value])} className="gap-2">
              <type.icon className="h-4 w-4" />{type.label}
            </Button>
          ))}
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            <Input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-40" />
            <span className="text-muted-foreground">-</span>
            <Input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-40" />
          </div>
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Buscar producto..." className="pl-10" value={searchProduct} onChange={(e) => setSearchProduct(e.target.value)} />
          </div>
          <div className="flex gap-2 ml-auto">
            <Button variant="outline" className="gap-2" onClick={handleExportExcel}><FileSpreadsheet className="h-4 w-4" />Excel</Button>
            <Button variant="outline" className="gap-2" onClick={handleExportPDF}><Download className="h-4 w-4" />PDF</Button>
          </div>
        </div>
      </div>

      {/* Movements Table */}
      {filteredMovements.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold">Sin movimientos</h3>
          <p className="text-muted-foreground">Los movimientos aparecerán aquí cuando registres entradas o salidas</p>
        </div>
      ) : (
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Fecha</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Producto</TableHead>
                  <TableHead className="text-center">Cantidad</TableHead>
                  <TableHead className="text-center">Stock</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead>Motivo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredMovements.map((mov) => {
                  const typeInfo = getTypeInfo(mov.type);
                  return (
                    <TableRow key={mov.id}>
                      <TableCell className="text-sm">{new Date(mov.created_at).toLocaleString()}</TableCell>
                      <TableCell><Badge variant={typeInfo.color as any} className="gap-1"><typeInfo.icon className="h-3 w-3" />{typeInfo.label}</Badge></TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-muted rounded flex items-center justify-center overflow-hidden">
                            {mov.product?.photo_url ? <img src={mov.product.photo_url} className="w-full h-full object-cover" /> : <Package className="h-4 w-4 text-muted-foreground" />}
                          </div>
                          <span className="text-sm">{mov.product?.name || "-"}</span>
                        </div>
                      </TableCell>
                      <TableCell className={`text-center font-semibold ${mov.quantity > 0 ? 'text-success' : 'text-destructive'}`}>
                        {mov.quantity > 0 ? '+' : ''}{mov.quantity}
                      </TableCell>
                      <TableCell className="text-center">
                        <span className="text-muted-foreground">{mov.stock_before}</span> → <span className="font-semibold">{mov.stock_after}</span>
                      </TableCell>
                      <TableCell className="text-sm">{mov.responsible || "-"}</TableCell>
                      <TableCell className="text-sm text-muted-foreground max-w-[150px] truncate">{mov.reason || "-"}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* FAB */}
      <Button className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg bg-secondary hover:bg-secondary/90" onClick={() => setIsModalOpen(true)}>
        <Plus className="h-6 w-6" />
      </Button>

      {/* New Movement Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader><DialogTitle className="font-display text-2xl">Registrar Movimiento</DialogTitle></DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Tipo de Movimiento</Label>
              <div className="grid grid-cols-2 gap-2">
                {movementTypes.map((type) => (
                  <Button key={type.value} variant={newMov.type === type.value ? "default" : "outline"} className="gap-2 justify-start"
                    onClick={() => setNewMov({ ...newMov, type: type.value })}>
                    <type.icon className="h-4 w-4" />{type.label}
                  </Button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label>Producto</Label>
              <Select value={newMov.product_id} onValueChange={(v) => setNewMov({ ...newMov, product_id: v })}>
                <SelectTrigger><SelectValue placeholder="Seleccionar producto" /></SelectTrigger>
                <SelectContent>
                  {products.map(p => <SelectItem key={p.id} value={p.id}>{p.name} (Stock: {p.stock})</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Cantidad</Label>
              <Input type="number" placeholder="Cantidad" value={newMov.quantity} onChange={(e) => setNewMov({ ...newMov, quantity: e.target.value })} />
            </div>
            <div className="space-y-2">
              <Label>Motivo / Observación</Label>
              <Input placeholder="Ej: Compra a proveedor, Merma por vencimiento..." value={newMov.reason} onChange={(e) => setNewMov({ ...newMov, reason: e.target.value })} />
            </div>
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancelar</Button>
            <Button onClick={handleSaveMovement} disabled={createMovement.isPending || !newMov.type || !newMov.product_id || !newMov.quantity}>
              {createMovement.isPending ? "Guardando..." : "Registrar"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
