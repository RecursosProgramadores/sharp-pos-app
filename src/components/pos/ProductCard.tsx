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
      className="relative flex items-center gap-3 p-3 rounded-lg bg-card border border-border/50 hover:border-primary/50 hover:shadow-md transition-all duration-150 active:scale-[0.98] touch-manipulation disabled:opacity-50 disabled:cursor-not-allowed text-left w-full"
    >
      <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
        {product.photo_url ? (
          <img src={product.photo_url} alt={product.name} className="w-full h-full object-cover" />
        ) : (
          <Package className="h-6 w-6 text-muted-foreground" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <span className="font-medium text-sm line-clamp-1 leading-tight block">
          {product.name}
        </span>
        <div className="flex items-center gap-2 mt-0.5">
          {isOutOfStock ? (
            <Badge variant="secondary" className="text-[10px] px-1.5 h-4">Agotado</Badge>
          ) : isLowStock ? (
            <Badge variant="destructive" className="text-[10px] px-1.5 h-4">Stock: {product.stock}</Badge>
          ) : (
            <span className="text-[11px] text-muted-foreground">Stock: {product.stock}</span>
          )}
        </div>
      </div>

      <span className="font-display text-lg font-bold text-primary shrink-0">
        S/ {product.sale_price.toFixed(2)}
      </span>
    </button>
  );
}
