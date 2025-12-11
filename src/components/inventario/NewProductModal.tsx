import { useState } from "react";
import { X, Upload, Scan, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
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

interface NewProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = [
  "Pomadas",
  "Shampoos",
  "Aceites",
  "Ceras",
  "Herramientas",
  "Tintes",
  "Aftershave",
  "Otros",
];

const taxes = [
  { value: "none", label: "Sin Impuesto", rate: 0 },
  { value: "igv18", label: "IGV 18%", rate: 18 },
  { value: "iva19", label: "IVA 19%", rate: 19 },
];

const units = ["Unidad", "Caja", "Paquete", "Litro", "Gramo"];

export function NewProductModal({ open, onOpenChange }: NewProductModalProps) {
  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    barcode: "",
    category: "",
    description: "",
    costPrice: "",
    salePrice: "",
    tax: "none",
    initialStock: "",
    minStock: "",
    location: "",
    unit: "Unidad",
    supplier: "",
    supplierContact: "",
    restockDays: "",
    status: "available",
    allowZeroSale: false,
    requiresPrescription: false,
    expirationDate: "",
  });

  const generateSKU = () => {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    setFormData({ ...formData, sku: `PRD-${random}` });
  };

  const calculateMargin = () => {
    const cost = parseFloat(formData.costPrice) || 0;
    const sale = parseFloat(formData.salePrice) || 0;
    if (sale === 0) return 0;
    return ((sale - cost) / sale * 100).toFixed(1);
  };

  const calculateFinalPrice = () => {
    const sale = parseFloat(formData.salePrice) || 0;
    const selectedTax = taxes.find(t => t.value === formData.tax);
    const taxRate = selectedTax?.rate || 0;
    return (sale * (1 + taxRate / 100)).toFixed(2);
  };

  const handleSave = (asDraft: boolean = false) => {
    console.log("Saving product:", formData, "as draft:", asDraft);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Nuevo Producto</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Sección: Información Básica */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Información Básica</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Producto *</Label>
                <Input
                  id="name"
                  placeholder="Ej: Pomada Premium"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sku">SKU / Código Interno</Label>
                <div className="flex gap-2">
                  <Input
                    id="sku"
                    placeholder="PRD-XXXXX"
                    value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  />
                  <Button type="button" variant="outline" onClick={generateSKU}>
                    Generar
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="barcode">Código de Barras</Label>
                <div className="flex gap-2">
                  <Input
                    id="barcode"
                    placeholder="7501234567890"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                  />
                  <Button type="button" variant="outline" className="gap-2">
                    <Scan className="h-4 w-4" />
                    Escanear
                  </Button>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Categoría</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar categoría" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Descripción (opcional)</Label>
                <Textarea
                  id="description"
                  placeholder="Descripción del producto..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label>Imagen del Producto</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover:border-primary transition-colors cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Arrastra una imagen o haz clic para seleccionar
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">PNG, JPG hasta 5MB</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sección: Precios e Impuestos */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Precios e Impuestos</h3>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="costPrice">Precio de Costo</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="costPrice"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-7"
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="salePrice">Precio de Venta</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
                  <Input
                    id="salePrice"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    className="pl-7"
                    value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Margen de Ganancia</Label>
                <div className="h-10 px-3 bg-muted rounded-md flex items-center">
                  <span className="text-success font-semibold">{calculateMargin()}%</span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="tax">Impuesto Aplicable</Label>
                <Select
                  value={formData.tax}
                  onValueChange={(value) => setFormData({ ...formData, tax: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {taxes.map((tax) => (
                      <SelectItem key={tax.value} value={tax.value}>{tax.label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2 lg:col-span-2">
                <Label>Precio Final (con impuesto)</Label>
                <div className="h-10 px-3 bg-primary/10 rounded-md flex items-center">
                  <span className="text-primary font-display text-lg">${calculateFinalPrice()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Sección: Inventario */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Inventario</h3>
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-2">
                <Label htmlFor="initialStock">Stock Inicial</Label>
                <Input
                  id="initialStock"
                  type="number"
                  placeholder="0"
                  value={formData.initialStock}
                  onChange={(e) => setFormData({ ...formData, initialStock: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="minStock">Stock Mínimo (para alertas)</Label>
                <Input
                  id="minStock"
                  type="number"
                  placeholder="10"
                  value={formData.minStock}
                  onChange={(e) => setFormData({ ...formData, minStock: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">Ubicación en Almacén</Label>
                <Input
                  id="location"
                  placeholder="Ej: Estante A-3"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="unit">Unidad de Medida</Label>
                <Select
                  value={formData.unit}
                  onValueChange={(value) => setFormData({ ...formData, unit: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {units.map((unit) => (
                      <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Sección: Proveedor */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Proveedor</h3>
            
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="supplier">Nombre del Proveedor</Label>
                <Input
                  id="supplier"
                  placeholder="Ej: Distribuidora ABC"
                  value={formData.supplier}
                  onChange={(e) => setFormData({ ...formData, supplier: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="supplierContact">Contacto del Proveedor</Label>
                <Input
                  id="supplierContact"
                  placeholder="Tel. o Email"
                  value={formData.supplierContact}
                  onChange={(e) => setFormData({ ...formData, supplierContact: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="restockDays">Tiempo de Reabastecimiento (días)</Label>
                <Input
                  id="restockDays"
                  type="number"
                  placeholder="5"
                  value={formData.restockDays}
                  onChange={(e) => setFormData({ ...formData, restockDays: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Sección: Configuración Adicional */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Configuración Adicional</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Estado del Producto</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({ ...formData, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="available">Disponible para venta</SelectItem>
                    <SelectItem value="unavailable">No disponible</SelectItem>
                    <SelectItem value="discontinued">Descontinuado</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="expirationDate">Fecha de Vencimiento (opcional)</Label>
                <Input
                  id="expirationDate"
                  type="date"
                  value={formData.expirationDate}
                  onChange={(e) => setFormData({ ...formData, expirationDate: e.target.value })}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="allowZeroSale"
                  checked={formData.allowZeroSale}
                  onCheckedChange={(checked) => setFormData({ ...formData, allowZeroSale: checked as boolean })}
                />
                <Label htmlFor="allowZeroSale" className="cursor-pointer">
                  Permitir venta con stock 0
                </Label>
              </div>

              <div className="flex items-center space-x-2">
                <Checkbox
                  id="requiresPrescription"
                  checked={formData.requiresPrescription}
                  onCheckedChange={(checked) => setFormData({ ...formData, requiresPrescription: checked as boolean })}
                />
                <Label htmlFor="requiresPrescription" className="cursor-pointer">
                  Requiere receta/prescripción
                </Label>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)} className="sm:mr-auto">
            Cancelar
          </Button>
          <Button variant="secondary" onClick={() => handleSave(true)}>
            Guardar como Borrador
          </Button>
          <Button onClick={() => handleSave(false)} className="bg-secondary hover:bg-secondary/90">
            Guardar y Activar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
