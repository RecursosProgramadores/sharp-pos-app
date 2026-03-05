import { useState, useEffect } from "react";
import { Receipt, Plus, Edit, Trash2, Eye, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useSettings } from "@/hooks/useSettings";

interface Tax {
  id: string;
  name: string;
  rate: number;
  applyToServices: boolean;
  applyToProducts: boolean;
  includedInPrice: boolean;
  resolutionNumber: string;
  active: boolean;
}

const defaultTaxes = {
  taxes: [
    { id: "default-igv", name: "IGV", rate: 18, applyToServices: true, applyToProducts: true, includedInPrice: true, resolutionNumber: "", active: true },
  ] as Tax[],
};

export default function TaxesTab() {
  const { data: saved, isLoading, save, isSaving } = useSettings("taxes", defaultTaxes);
  const [taxes, setTaxes] = useState<Tax[]>(defaultTaxes.taxes);
  const [isNewTaxOpen, setIsNewTaxOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [newTax, setNewTax] = useState({ name: "", rate: 0, applyToServices: true, applyToProducts: true, includedInPrice: false, resolutionNumber: "" });

  useEffect(() => {
    if (saved?.taxes) setTaxes(saved.taxes);
  }, [saved]);

  const handleCreateTax = () => {
    const updated = [...taxes, { id: `tax-${Date.now()}`, ...newTax, active: true }];
    setTaxes(updated);
    save({ taxes: updated });
    setNewTax({ name: "", rate: 0, applyToServices: true, applyToProducts: true, includedInPrice: false, resolutionNumber: "" });
    setIsNewTaxOpen(false);
  };

  const handleDeleteTax = (id: string) => {
    const updated = taxes.filter(t => t.id !== id);
    setTaxes(updated);
    save({ taxes: updated });
  };

  const handleToggleTax = (id: string) => {
    const updated = taxes.map(t => t.id === id ? { ...t, active: !t.active } : t);
    setTaxes(updated);
    save({ taxes: updated });
  };

  const subtotal = 45;
  const activeTaxes = taxes.filter(t => t.active);
  let taxAmount = 0;
  activeTaxes.forEach(tax => {
    taxAmount += tax.includedInPrice ? subtotal - subtotal / (1 + tax.rate / 100) : subtotal * (tax.rate / 100);
  });
  const previewSubtotal = activeTaxes.some(t => t.includedInPrice) ? subtotal - taxAmount : subtotal;
  const previewTotal = activeTaxes.some(t => t.includedInPrice) ? subtotal : subtotal + taxAmount;

  if (isLoading) return <div className="space-y-6">{[...Array(2)].map((_, i) => <Skeleton key={i} className="h-48 w-full rounded-xl" />)}</div>;

  return (
    <div className="space-y-6">
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="font-display text-xl flex items-center gap-2"><Receipt className="h-5 w-5 text-primary" />Configuración de Impuestos</CardTitle>
              <CardDescription>Configura los impuestos aplicables a servicios y productos</CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogTrigger asChild><Button variant="outline" className="gap-2"><Eye className="h-4 w-4" />Vista Previa</Button></DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogHeader><DialogTitle>Vista Previa del Recibo</DialogTitle></DialogHeader>
                  <div className="border rounded-lg p-4 bg-card font-mono text-sm">
                    <div className="text-center mb-4"><p className="font-bold text-lg">TAYTA BARBERSHOP</p></div>
                    <Separator className="my-2" />
                    <div className="flex justify-between"><span>Corte + Barba</span><span>S/ 45.00</span></div>
                    <Separator className="my-2" />
                    <div className="flex justify-between"><span>Subtotal:</span><span>S/ {previewSubtotal.toFixed(2)}</span></div>
                    {activeTaxes.map(tax => (
                      <div key={tax.id} className="flex justify-between text-muted-foreground">
                        <span>{tax.name} ({tax.rate}%){tax.includedInPrice ? " (incl.)" : ""}:</span>
                        <span>S/ {(tax.includedInPrice ? previewSubtotal * (tax.rate / (100 + tax.rate)) : previewSubtotal * (tax.rate / 100)).toFixed(2)}</span>
                      </div>
                    ))}
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold text-lg"><span>TOTAL:</span><span>S/ {previewTotal.toFixed(2)}</span></div>
                  </div>
                </DialogContent>
              </Dialog>
              <Dialog open={isNewTaxOpen} onOpenChange={setIsNewTaxOpen}>
                <DialogTrigger asChild><Button className="gap-2"><Plus className="h-4 w-4" />Nuevo Impuesto</Button></DialogTrigger>
                <DialogContent>
                  <DialogHeader><DialogTitle>Configurar Nuevo Impuesto</DialogTitle></DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2"><Label>Nombre</Label><Input value={newTax.name} onChange={(e) => setNewTax({ ...newTax, name: e.target.value })} placeholder="Ej: IGV" /></div>
                      <div className="space-y-2"><Label>Tasa (%)</Label><Input type="number" value={newTax.rate} onChange={(e) => setNewTax({ ...newTax, rate: parseFloat(e.target.value) || 0 })} /></div>
                    </div>
                    <div className="flex items-center gap-6">
                      <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={newTax.applyToServices} onCheckedChange={(v) => setNewTax({ ...newTax, applyToServices: v as boolean })} /><span>Servicios</span></label>
                      <label className="flex items-center gap-2 cursor-pointer"><Checkbox checked={newTax.applyToProducts} onCheckedChange={(v) => setNewTax({ ...newTax, applyToProducts: v as boolean })} /><span>Productos</span></label>
                    </div>
                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div><p className="font-medium">Incluido en Precio</p><p className="text-sm text-muted-foreground">El precio mostrado ya incluye el impuesto</p></div>
                      <Switch checked={newTax.includedInPrice} onCheckedChange={(v) => setNewTax({ ...newTax, includedInPrice: v })} />
                    </div>
                    <div className="space-y-2"><Label>Nº Resolución</Label><Input value={newTax.resolutionNumber} onChange={(e) => setNewTax({ ...newTax, resolutionNumber: e.target.value })} /></div>
                  </div>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsNewTaxOpen(false)}>Cancelar</Button>
                    <Button onClick={handleCreateTax}>Guardar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead className="text-center">Tasa</TableHead>
                <TableHead className="text-center">Servicios</TableHead>
                <TableHead className="text-center">Productos</TableHead>
                <TableHead className="text-center">Incluido</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxes.map(tax => (
                <TableRow key={tax.id}>
                  <TableCell className="font-medium">{tax.name}</TableCell>
                  <TableCell className="text-center">{tax.rate}%</TableCell>
                  <TableCell className="text-center">{tax.applyToServices ? "✓" : "—"}</TableCell>
                  <TableCell className="text-center">{tax.applyToProducts ? "✓" : "—"}</TableCell>
                  <TableCell className="text-center">{tax.includedInPrice ? "Sí" : "No"}</TableCell>
                  <TableCell className="text-center"><Switch checked={tax.active} onCheckedChange={() => handleToggleTax(tax.id)} /></TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive" onClick={() => handleDeleteTax(tax.id)}><Trash2 className="h-4 w-4" /></Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="bg-info/10 border-info/20">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Receipt className="h-6 w-6 text-info flex-shrink-0" />
            <div>
              <p className="font-medium text-info">Información Importante</p>
              <p className="text-sm text-muted-foreground mt-1">Los impuestos se aplican automáticamente en el POS. Consulte con su contador para la correcta configuración fiscal.</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
