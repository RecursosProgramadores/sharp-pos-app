import { Badge } from "@/components/ui/badge";
import { Package, ShoppingBag } from "lucide-react";

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    sale_price: number;
    stock: number;
    photo_url?: string | null;
  };
  onClick: () => void;
}

export function ProductCard({ product, onClick }: ProductCardProps) {
  const isLowStock = product.stock <= 5;
  const isOutOfStock = product.stock === 0;

  return (
    <button
      onClick={onClick}
      disabled={isOutOfStock}
      className="group relative flex flex-col justify-between p-3 rounded-xl bg-card border border-border/40 hover:border-primary/50 hover:shadow-lg hover:-translate-y-0.5 transition-all duration-200 active:scale-[0.97] touch-manipulation disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:shadow-none disabled:hover:translate-y-0 text-left w-full h-full min-h-[90px]"
    >
      <div className="flex items-start gap-2.5 w-full mb-auto">
        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0 shadow-sm">
          {product.photo_url ? (
            <img src={product.photo_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <Package className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-xs leading-tight line-clamp-2 block">
            {product.name}
          </span>
          {isOutOfStock ? (
            <Badge variant="secondary" className="text-[9px] px-1.5 h-4 mt-1">Agotado</Badge>
          ) : isLowStock ? (
            <Badge variant="destructive" className="text-[9px] px-1.5 h-4 mt-1">Bajo Stock: {product.stock}</Badge>
          ) : (
            <span className="text-[10px] text-muted-foreground mt-1 block">Stock: {product.stock}</span>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-2 pt-2 border-t border-border/30">
        <div className="flex items-center gap-1 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity">
          <ShoppingBag className="h-3 w-3" />
          <span className="text-[10px]">Agregar</span>
        </div>
        <span className="font-display text-base font-bold text-primary shrink-0">
          S/ {product.sale_price.toFixed(2)}
        </span>
      </div>
    </button>
  );
}
