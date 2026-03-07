import { Badge } from "@/components/ui/badge";
import { Package } from "lucide-react";

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
      className="relative flex flex-col justify-between p-2 rounded-lg bg-card border border-border/50 hover:border-primary/50 hover:shadow-md transition-all duration-150 active:scale-[0.97] touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed text-left w-full min-h-[56px]"
    >
      <div className="flex items-start gap-2 w-full">
        <div className="w-8 h-8 rounded bg-muted flex items-center justify-center overflow-hidden shrink-0">
          {product.photo_url ? (
            <img src={product.photo_url} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <Package className="h-3.5 w-3.5 text-muted-foreground" />
          )}
        </div>
        <span className="font-medium text-xs leading-tight line-clamp-2 flex-1">
          {product.name}
        </span>
      </div>
      <div className="flex items-center justify-between mt-1">
        {isOutOfStock ? (
          <Badge variant="secondary" className="text-[9px] px-1 h-3.5">Agotado</Badge>
        ) : isLowStock ? (
          <Badge variant="destructive" className="text-[9px] px-1 h-3.5">Stock: {product.stock}</Badge>
        ) : (
          <span className="text-[10px] text-muted-foreground">Stock: {product.stock}</span>
        )}
        <span className="font-display text-sm font-bold text-primary shrink-0">
          S/ {product.sale_price.toFixed(2)}
        </span>
      </div>
    </button>
  );
}
