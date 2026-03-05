import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Minus, ShoppingCart } from "lucide-react";

interface QuantityModalProps {
  open: boolean;
  onClose: () => void;
  product: {
    id: string;
    name: string;
    sale_price: number;
    stock: number;
  } | null;
  onConfirm: (quantity: number) => void;
}

export function QuantityModal({ open, onClose, product, onConfirm }: QuantityModalProps) {
  const [quantity, setQuantity] = useState(1);

  if (!product) return null;

  const handleConfirm = () => {
    onConfirm(quantity);
    setQuantity(1);
    onClose();
  };

  const handleClose = () => {
    setQuantity(1);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">{product.name}</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col items-center py-6">
          <p className="text-3xl font-display text-primary mb-6">S/ {product.sale_price.toFixed(2)}</p>

          <div className="flex items-center gap-6">
            <Button variant="outline" size="icon" className="h-14 w-14 rounded-full" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
              <Minus className="h-6 w-6" />
            </Button>
            <span className="font-display text-5xl w-20 text-center">{quantity}</span>
            <Button variant="outline" size="icon" className="h-14 w-14 rounded-full" onClick={() => setQuantity(Math.min(product.stock, quantity + 1))} disabled={quantity >= product.stock}>
              <Plus className="h-6 w-6" />
            </Button>
          </div>

          <p className="text-muted-foreground mt-4">Stock disponible: {product.stock} unidades</p>
          <p className="font-semibold text-xl mt-4">
            Total: <span className="text-primary">S/ {(product.sale_price * quantity).toFixed(2)}</span>
          </p>
        </div>

        <DialogFooter className="flex-row gap-3">
          <Button variant="outline" onClick={handleClose} className="flex-1">Cancelar</Button>
          <Button onClick={handleConfirm} className="flex-1 gap-2">
            <ShoppingCart className="h-4 w-4" />
            Agregar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
