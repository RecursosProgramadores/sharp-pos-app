import { useState } from "react";
import { Package, Edit, TrendingUp, History, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useUpdateProduct, useCreateMovement, useStockMovements, type Product } from "@/hooks/useInventory";
import { toast } from "sonner";

interface ProductDetailsModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  product: Product | null;
}

export function ProductDetailsModal({ open, onOpenChange, product }: ProductDetailsModalProps) {
  const updateProduct = useUpdateProduct();
  const createMovement = useCreateMovement();
  const { data: allMovements = [] } = useStockMovements();
  const [adjustQty, setAdjustQty] = useState("");
  const [adjustReason, setAdjustReason] = useState("");
  const [editName, setEditName] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editCost, setEditCost] = useState("");

  if (!product) return null;

  const productMovements = allMovements.filter(m => m.product_id === product.id);
  const status = product.stock === 0 ? { text: "Agotado", variant: "destructive" as const }
    : product.stock < product.min_stock ? { text: "Bajo Stock", variant: "warning" as const }
    : { text: "Disponible", variant: "success" as const };
  const margin = product.sale_price > 0 ? ((product.sale_price - product.purchase_price) / product.sale_price * 100).toFixed(1) : "0";

  const handleSaveInfo = () => {
    const updates: any = {};
    if (editName && editName !== product.name) updates.name = editName;
    if (editPrice && parseFloat(editPrice) !== product.sale_price) updates.sale_price = parseFloat(editPrice);
    if (editCost && parseFloat(editCost) !== product.purchase_price) updates.purchase_price = parseFloat(editCost);
    if (Object.keys(updates).length > 0) {
      updateProduct.mutate({ id: product.id, ...updates });
    }
  };

  const handleAdjust = async () => {
    const qty = parseInt(adjustQty);
    if (!qty || !adjustReason) { toast.error("Ingresa cantidad y motivo"); return; }
    await createMovement.mutateAsync({
      product_id: product.id,
      type: "adjustment",
      quantity: qty,
      reason: adjustReason,
      responsible: "Admin",
    });
    setAdjustQty("");
    setAdjustReason("");
  };

  const getMovTypeBadge = (type: string) => {
    const map: Record<string, { text: string; variant: any }> = {
      purchase: { text: "Compra", variant: "success" },
      sale: { text: "Venta", variant: "default" },
      adjustment: { text: "Ajuste", variant: "warning" },
      waste: { text: "Merma", variant: "destructive" },
      return: { text: "Devolución", variant: "secondary" },
      internal: { text: "Uso Interno", variant: "outline" },
    };
    return map[type] || { text: type, variant: "outline" };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Detalles del Producto</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col md:flex-row gap-6 pb-6 border-b">
          <div className="w-32 h-32 bg-muted rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
            {product.photo_url ? <img src={product.photo_url} alt={product.name} className="w-full h-full object-cover rounded-lg" />
              : <Package className="h-16 w-16 text-muted-foreground" />}
          </div>
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="font-display text-2xl">{product.name}</h2>
                <p className="text-muted-foreground">{product.sku ? `SKU: ${product.sku}` : ""} {product.barcode ? `| Código: ${product.barcode}` : ""}</p>
              </div>
              <div className="flex gap-2">
                <Badge variant={status.variant}>{status.text}</Badge>
                <Badge variant="outline">{product.category}</Badge>
              </div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4">
              <div className="text-center p-3 bg-muted/50 rounded-lg">
                <p className="text-2xl font-display text-primary">S/{product.sale_price.toFixed(2)}</p>
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
                <p className="text-2xl font-display">{product.min_stock}</p>
                <p className="text-xs text-muted-foreground">Stock Mínimo</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs defaultValue="info" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="info" className="gap-2"><Edit className="h-4 w-4" /><span className="hidden sm:inline">Info</span></TabsTrigger>
            <TabsTrigger value="history" className="gap-2"><History className="h-4 w-4" /><span className="hidden sm:inline">Historial</span></TabsTrigger>
            <TabsTrigger value="stock" className="gap-2"><Settings className="h-4 w-4" /><span className="hidden sm:inline">Ajuste Stock</span></TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="mt-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Nombre</Label>
                <Input defaultValue={product.name} onChange={(e) => setEditName(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Categoría</Label>
                <Input defaultValue={product.category} disabled />
              </div>
              <div className="space-y-2">
                <Label>Precio de Costo</Label>
                <Input type="number" defaultValue={product.purchase_price} onChange={(e) => setEditCost(e.target.value)} />
              </div>
              <div className="space-y-2">
                <Label>Precio de Venta</Label>
                <Input type="number" defaultValue={product.sale_price} onChange={(e) => setEditPrice(e.target.value)} />
              </div>
            </div>
            <div className="flex justify-end">
              <Button onClick={handleSaveInfo}>Guardar Cambios</Button>
            </div>
          </TabsContent>

          <TabsContent value="history" className="mt-4">
            {productMovements.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">Sin movimientos registrados</p>
            ) : (
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead className="text-center">Cantidad</TableHead>
                      <TableHead className="text-center">Stock</TableHead>
                      <TableHead>Motivo</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productMovements.map((m) => {
                      const t = getMovTypeBadge(m.type);
                      return (
                        <TableRow key={m.id}>
                          <TableCell className="text-sm">{new Date(m.created_at).toLocaleString()}</TableCell>
                          <TableCell><Badge variant={t.variant}>{t.text}</Badge></TableCell>
                          <TableCell className={`text-center font-semibold ${m.quantity > 0 ? 'text-success' : 'text-destructive'}`}>
                            {m.quantity > 0 ? '+' : ''}{m.quantity}
                          </TableCell>
                          <TableCell className="text-center">
                            <span className="text-muted-foreground">{m.stock_before}</span> → <span className="font-semibold">{m.stock_after}</span>
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">{m.reason || "-"}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="stock" className="mt-4 space-y-6">
            <div className="border-t pt-4">
              <h4 className="font-semibold mb-4">Registrar Ajuste de Stock</h4>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label>Cantidad (+ entrada, - salida)</Label>
                  <Input type="number" placeholder="Ej: -5 o +10" value={adjustQty} onChange={(e) => setAdjustQty(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label>Motivo</Label>
                  <Input placeholder="Ej: Vencido, Error conteo..." value={adjustReason} onChange={(e) => setAdjustReason(e.target.value)} />
                </div>
                <div className="flex items-end">
                  <Button className="w-full" onClick={handleAdjust} disabled={createMovement.isPending}>
                    {createMovement.isPending ? "Registrando..." : "Registrar Ajuste"}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
