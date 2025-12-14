import { useState } from "react";
import {
  Receipt,
  Plus,
  Edit,
  Trash2,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { toast } from "@/hooks/use-toast";

interface Tax {
  id: number;
  name: string;
  rate: number;
  applyToServices: boolean;
  applyToProducts: boolean;
  includedInPrice: boolean;
  resolutionNumber: string;
  active: boolean;
}

const initialTaxes: Tax[] = [
  {
    id: 1,
    name: "IGV",
    rate: 18,
    applyToServices: true,
    applyToProducts: true,
    includedInPrice: true,
    resolutionNumber: "RES-2024-001234",
    active: true,
  },
];

export default function TaxesTab() {
  const [taxes, setTaxes] = useState<Tax[]>(initialTaxes);
  const [isNewTaxOpen, setIsNewTaxOpen] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [newTax, setNewTax] = useState<Omit<Tax, "id" | "active">>({
    name: "",
    rate: 0,
    applyToServices: true,
    applyToProducts: true,
    includedInPrice: false,
    resolutionNumber: "",
  });

  const handleCreateTax = () => {
    const newId = Math.max(...taxes.map((t) => t.id), 0) + 1;
    setTaxes([...taxes, { id: newId, ...newTax, active: true }]);
    setNewTax({
      name: "",
      rate: 0,
      applyToServices: true,
      applyToProducts: true,
      includedInPrice: false,
      resolutionNumber: "",
    });
    setIsNewTaxOpen(false);
    toast({
      title: "Impuesto creado",
      description: "El nuevo impuesto se ha configurado correctamente",
    });
  };

  const handleDeleteTax = (id: number) => {
    setTaxes((prev) => prev.filter((t) => t.id !== id));
    toast({
      title: "Impuesto eliminado",
      description: "El impuesto se ha eliminado correctamente",
    });
  };

  const handleToggleTax = (id: number) => {
    setTaxes((prev) =>
      prev.map((t) => (t.id === id ? { ...t, active: !t.active } : t))
    );
  };

  // Sample receipt preview calculation
  const calculatePreviewTotals = () => {
    const subtotal = 45;
    const activeTaxes = taxes.filter((t) => t.active);
    let taxAmount = 0;

    activeTaxes.forEach((tax) => {
      if (tax.includedInPrice) {
        // Tax is included, calculate what the base and tax are
        taxAmount += subtotal - subtotal / (1 + tax.rate / 100);
      } else {
        // Tax is additional
        taxAmount += subtotal * (tax.rate / 100);
      }
    });

    return {
      subtotal: activeTaxes.some((t) => t.includedInPrice)
        ? subtotal - taxAmount
        : subtotal,
      taxes: taxAmount,
      total: activeTaxes.some((t) => t.includedInPrice)
        ? subtotal
        : subtotal + taxAmount,
    };
  };

  const previewTotals = calculatePreviewTotals();

  return (
    <div className="space-y-6">
      <Card className="card-elevated">
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div>
              <CardTitle className="font-display text-xl flex items-center gap-2">
                <Receipt className="h-5 w-5 text-primary" />
                Configuración de Impuestos
              </CardTitle>
              <CardDescription>
                Configura los impuestos aplicables a servicios y productos
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Dialog open={isPreviewOpen} onOpenChange={setIsPreviewOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="gap-2">
                    <Eye className="h-4 w-4" />
                    Vista Previa de Recibo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-sm">
                  <DialogHeader>
                    <DialogTitle>Vista Previa del Recibo</DialogTitle>
                    <DialogDescription>
                      Así se mostrará el impuesto en el recibo
                    </DialogDescription>
                  </DialogHeader>
                  <div className="border rounded-lg p-4 bg-card font-mono text-sm">
                    <div className="text-center mb-4">
                      <p className="font-bold text-lg">BARBER PRO</p>
                      <p className="text-xs text-muted-foreground">
                        Av. Principal #123
                      </p>
                      <p className="text-xs text-muted-foreground">
                        RUC: 20123456789
                      </p>
                    </div>
                    <Separator className="my-2" />
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Corte + Barba</span>
                        <span>$45.00</span>
                      </div>
                    </div>
                    <Separator className="my-2" />
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>Subtotal:</span>
                        <span>${previewTotals.subtotal.toFixed(2)}</span>
                      </div>
                      {taxes
                        .filter((t) => t.active)
                        .map((tax) => (
                          <div
                            key={tax.id}
                            className="flex justify-between text-muted-foreground"
                          >
                            <span>
                              {tax.name} ({tax.rate}%)
                              {tax.includedInPrice ? " (incl.)" : ""}:
                            </span>
                            <span>
                              ${(
                                (tax.includedInPrice
                                  ? previewTotals.subtotal *
                                    (tax.rate / (100 + tax.rate))
                                  : previewTotals.subtotal * (tax.rate / 100)) 
                              ).toFixed(2)}
                            </span>
                          </div>
                        ))}
                    </div>
                    <Separator className="my-2" />
                    <div className="flex justify-between font-bold text-lg">
                      <span>TOTAL:</span>
                      <span>${previewTotals.total.toFixed(2)}</span>
                    </div>
                    <Separator className="my-2" />
                    <div className="text-center text-xs text-muted-foreground">
                      <p>¡Gracias por tu visita!</p>
                      <p>Vuelve pronto</p>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>

              <Dialog open={isNewTaxOpen} onOpenChange={setIsNewTaxOpen}>
                <DialogTrigger asChild>
                  <Button className="gap-2">
                    <Plus className="h-4 w-4" />
                    Nuevo Impuesto
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Configurar Nuevo Impuesto</DialogTitle>
                    <DialogDescription>
                      Define los parámetros del impuesto
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Nombre del Impuesto</Label>
                        <Input
                          value={newTax.name}
                          onChange={(e) =>
                            setNewTax({ ...newTax, name: e.target.value })
                          }
                          placeholder="Ej: IGV, IVA"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Tasa (%)</Label>
                        <Input
                          type="number"
                          value={newTax.rate}
                          onChange={(e) =>
                            setNewTax({
                              ...newTax,
                              rate: parseFloat(e.target.value) || 0,
                            })
                          }
                          placeholder="18"
                        />
                      </div>
                    </div>

                    <div className="space-y-3">
                      <Label>Aplicar a:</Label>
                      <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={newTax.applyToServices}
                            onCheckedChange={(checked) =>
                              setNewTax({
                                ...newTax,
                                applyToServices: checked as boolean,
                              })
                            }
                          />
                          <span>Servicios</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                          <Checkbox
                            checked={newTax.applyToProducts}
                            onCheckedChange={(checked) =>
                              setNewTax({
                                ...newTax,
                                applyToProducts: checked as boolean,
                              })
                            }
                          />
                          <span>Productos</span>
                        </label>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-4 border rounded-lg">
                      <div>
                        <p className="font-medium">Incluido en Precio de Venta</p>
                        <p className="text-sm text-muted-foreground">
                          El precio mostrado ya incluye el impuesto
                        </p>
                      </div>
                      <Switch
                        checked={newTax.includedInPrice}
                        onCheckedChange={(checked) =>
                          setNewTax({ ...newTax, includedInPrice: checked })
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Número de Resolución/Decreto</Label>
                      <Input
                        value={newTax.resolutionNumber}
                        onChange={(e) =>
                          setNewTax({ ...newTax, resolutionNumber: e.target.value })
                        }
                        placeholder="Ej: RES-2024-001234"
                      />
                    </div>
                  </div>
                  <DialogFooter>
                    <Button
                      variant="outline"
                      onClick={() => setIsNewTaxOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button onClick={handleCreateTax}>Guardar Impuesto</Button>
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
                <TableHead>Resolución</TableHead>
                <TableHead className="text-center">Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {taxes.map((tax) => (
                <TableRow key={tax.id}>
                  <TableCell className="font-medium">{tax.name}</TableCell>
                  <TableCell className="text-center">{tax.rate}%</TableCell>
                  <TableCell className="text-center">
                    {tax.applyToServices ? "✓" : "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    {tax.applyToProducts ? "✓" : "—"}
                  </TableCell>
                  <TableCell className="text-center">
                    {tax.includedInPrice ? "Sí" : "No"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {tax.resolutionNumber}
                  </TableCell>
                  <TableCell className="text-center">
                    <Switch
                      checked={tax.active}
                      onCheckedChange={() => handleToggleTax(tax.id)}
                    />
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon">
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive"
                        onClick={() => handleDeleteTax(tax.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Info Card */}
      <Card className="bg-info/10 border-info/20">
        <CardContent className="pt-6">
          <div className="flex gap-4">
            <Receipt className="h-6 w-6 text-info flex-shrink-0" />
            <div>
              <p className="font-medium text-info">Información Importante</p>
              <p className="text-sm text-muted-foreground mt-1">
                Los impuestos configurados aquí se aplicarán automáticamente en
                el punto de venta según las opciones seleccionadas. Asegúrese de
                consultar con su contador para la correcta configuración fiscal.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
