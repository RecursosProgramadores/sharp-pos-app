import { useState, useRef } from "react";
import { Upload, ImagePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { useCreateProduct, uploadProductImage } from "@/hooks/useInventory";

interface NewProductModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const categories = ["Pomadas", "Shampoos", "Aceites", "Ceras", "Herramientas", "Tintes", "Aftershave", "Cuidado", "Otros"];

export function NewProductModal({ open, onOpenChange }: NewProductModalProps) {
  const createProduct = useCreateProduct();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    sku: "",
    barcode: "",
    category: "",
    description: "",
    costPrice: "",
    salePrice: "",
    initialStock: "",
    minStock: "5",
  });

  const generateSKU = () => {
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    setFormData({ ...formData, sku: `PRD-${random}` });
  };

  const calculateMargin = () => {
    const cost = parseFloat(formData.costPrice) || 0;
    const sale = parseFloat(formData.salePrice) || 0;
    if (sale === 0) return "0";
    return ((sale - cost) / sale * 100).toFixed(1);
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onload = (ev) => setImagePreview(ev.target?.result as string);
      reader.readAsDataURL(file);
    }
  };

  const resetForm = () => {
    setFormData({ name: "", sku: "", barcode: "", category: "", description: "", costPrice: "", salePrice: "", initialStock: "", minStock: "5" });
    setImagePreview(null);
    setImageFile(null);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.salePrice) return;
    setSaving(true);
    try {
      let photoUrl: string | undefined;
      if (imageFile) {
        photoUrl = await uploadProductImage(imageFile);
      }

      await createProduct.mutateAsync({
        name: formData.name,
        sku: formData.sku || undefined,
        barcode: formData.barcode || undefined,
        category: formData.category || "Otros",
        description: formData.description || undefined,
        stock: parseInt(formData.initialStock) || 0,
        min_stock: parseInt(formData.minStock) || 5,
        purchase_price: parseFloat(formData.costPrice) || 0,
        sale_price: parseFloat(formData.salePrice),
        photo_url: photoUrl,
      });

      resetForm();
      onOpenChange(false);
    } catch {
      // error handled in hook
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-display text-2xl">Nuevo Producto</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Info Básica */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Información Básica</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre del Producto *</Label>
                <Input id="name" placeholder="Ej: Pomada Premium" value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU / Código Interno</Label>
                <div className="flex gap-2">
                  <Input id="sku" placeholder="PRD-XXXXX" value={formData.sku}
                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })} />
                  <Button type="button" variant="outline" onClick={generateSKU}>Generar</Button>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="barcode">Código de Barras</Label>
                <Input id="barcode" placeholder="7501234567890" value={formData.barcode}
                  onChange={(e) => setFormData({ ...formData, barcode: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Categoría</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger><SelectValue placeholder="Seleccionar categoría" /></SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (<SelectItem key={cat} value={cat}>{cat}</SelectItem>))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Descripción (opcional)</Label>
                <Textarea placeholder="Descripción del producto..." value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={2} />
              </div>
              <div className="space-y-2 md:col-span-2">
                <Label>Imagen del Producto</Label>
                <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageSelect} />
                {imagePreview ? (
                  <div className="relative w-32 h-32 rounded-lg overflow-hidden border cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                    <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/30 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                      <ImagePlus className="h-6 w-6 text-white" />
                    </div>
                  </div>
                ) : (
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors cursor-pointer"
                    onClick={() => fileInputRef.current?.click()}>
                    <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Haz clic para seleccionar imagen</p>
                    <p className="text-xs text-muted-foreground mt-1">PNG, JPG hasta 5MB</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Precios */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Precios</h3>
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label>Precio de Costo</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">S/</span>
                  <Input type="number" step="0.01" placeholder="0.00" className="pl-8" value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Precio de Venta *</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">S/</span>
                  <Input type="number" step="0.01" placeholder="0.00" className="pl-8" value={formData.salePrice}
                    onChange={(e) => setFormData({ ...formData, salePrice: e.target.value })} />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Margen</Label>
                <div className="h-10 px-3 bg-muted rounded-md flex items-center">
                  <span className="text-success font-semibold">{calculateMargin()}%</span>
                </div>
              </div>
            </div>
          </div>

          {/* Inventario */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg border-b pb-2">Inventario</h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label>Stock Inicial</Label>
                <Input type="number" placeholder="0" value={formData.initialStock}
                  onChange={(e) => setFormData({ ...formData, initialStock: e.target.value })} />
              </div>
              <div className="space-y-2">
                <Label>Stock Mínimo (para alertas)</Label>
                <Input type="number" placeholder="5" value={formData.minStock}
                  onChange={(e) => setFormData({ ...formData, minStock: e.target.value })} />
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-2 pt-4 border-t justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSave} disabled={saving || !formData.name || !formData.salePrice}>
            {saving ? "Guardando..." : "Guardar Producto"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
